/**
 * Dealer Application Page
 * Handles dealer registration form submission to CMS with confirmation email
 */

import { quotes, notifications } from '../api/client.js';

const NOTIFICATION_EMAILS = ['klantenleads@grafixstudio.be', 'offertes@structon.be'];
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dealer-form');
  const submitBtn = document.getElementById('submit-btn');
  const alertContainer = document.getElementById('dealer-alert');
  const businessTypeSelect = document.getElementById('business-type');
  const otherBusinessTypeGroup = document.getElementById('other-business-type-group');

  if (form) {
    form.addEventListener('submit', handleSubmit);
  }

  // Toggle "Anders" text field
  if (businessTypeSelect) {
    businessTypeSelect.addEventListener('change', (e) => {
      if (e.target.value === 'other') {
        otherBusinessTypeGroup.style.display = 'block';
      } else {
        otherBusinessTypeGroup.style.display = 'none';
        document.getElementById('other-business-type').value = '';
      }
    });
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Validate
    if (!validateForm(data)) {
      return;
    }

    // Show loading state
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Verzenden...';

    try {
      // Submit to CMS API using quotes endpoint with request_type: 'dealer'
      const quoteData = {
        // Request type for routing to "Aanvragen" tab
        request_type: 'dealer',
        
        // Contact info (required fields)
        customer_name: data.contact_name,
        customer_email: data.email,
        customer_phone: data.phone,
        
        // Company info
        company_name: data.company_name,
        vat_number: data.btw,
        
        // Dealer-specific data in message field
        message: formatDealerMessage(data),
        
        // Additional dealer data (stored as JSON in separate field if API supports it)
        dealer_data: {
          website: data.website || null,
          contact_function: data.contact_function || null,
          address: data.address,
          postal_code: data.postal_code,
          city: data.city,
          country: data.country,
          business_type: data.business_type,
          other_business_type: data.other_business_type || null,
          annual_turnover: data.annual_turnover || null
        },
        
        // Tracking
        source_page: window.location.href,
        slug: generateDealerSlug(data.company_name)
      };

      const result = await quotes.submit(quoteData);
      console.log('✅ Dealer application submitted:', result);
      
      // Send email notifications
      try {
        const emailBody = formatDealerMessage(data);
        const emailPromises = NOTIFICATION_EMAILS.map(email => 
          notifications.sendEmail({
            to: email,
            subject: `Nieuwe dealer aanmelding: ${data.company_name}`,
            body: emailBody,
            replyTo: data.email,
            formType: 'dealer'
          })
        );
        await Promise.all(emailPromises);
        console.log('✅ Email notifications sent');
      } catch (emailError) {
        console.error('⚠️ Email notification failed:', emailError);
        // Don't fail the form if email fails
      }
      
      // Show success message
      showSuccessMessage(data.email);
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Fallback: copy to clipboard and show instructions
      const emailBody = formatEmailBody(data);
      await copyToClipboard(emailBody);
      
      showAlert('warning', 'De aanmelding kon niet automatisch worden verzonden. De gegevens zijn gekopieerd naar je klembord. Stuur deze naar info@structon.be');
    } finally {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Aanmelding Versturen';
    }
  }

  /**
   * Show success message with confirmation
   */
  function showSuccessMessage(email) {
    const formWrapper = document.querySelector('.dealer-form-wrapper');
    formWrapper.innerHTML = '';
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = 'text-align: center; padding: 60px 20px;';
    
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '80');
    svg.setAttribute('height', '80');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#22c55e');
    svg.setAttribute('stroke-width', '2');
    svg.style.marginBottom = '24px';
    svg.innerHTML = '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>';
    successDiv.appendChild(svg);
    
    const h2 = document.createElement('h2');
    h2.style.cssText = 'color: var(--color-primary); margin-bottom: 16px;';
    h2.textContent = 'Bedankt voor je aanmelding!';
    successDiv.appendChild(h2);
    
    const p1 = document.createElement('p');
    p1.style.cssText = 'font-size: 1.1rem; color: #555; margin-bottom: 24px;';
    p1.textContent = 'We hebben je dealer aanvraag ontvangen en nemen zo snel mogelijk contact met je op.';
    successDiv.appendChild(p1);
    
    const p2 = document.createElement('p');
    p2.style.cssText = 'color: #666; margin-bottom: 32px;';
    p2.appendChild(document.createTextNode('Een bevestiging is verzonden naar '));
    const strong = document.createElement('strong');
    strong.textContent = email;
    p2.appendChild(strong);
    successDiv.appendChild(p2);
    
    const link = document.createElement('a');
    link.href = '../index.html';
    link.className = 'btn-split usp-btn';
    link.innerHTML = '<span class="btn-split-text">Terug naar Home</span><span class="btn-split-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></span>';
    successDiv.appendChild(link);
    
    formWrapper.appendChild(successDiv);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Validate form data
   */
  function validateForm(data) {
    // Check required fields
    const requiredFields = [
      'company_name', 'btw', 'contact_name', 
      'email', 'phone', 'address', 
      'postal_code', 'city', 'country', 'business_type'
    ];

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === '') {
        showAlert('error', 'Vul alle verplichte velden in.');
        return false;
      }
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showAlert('error', 'Voer een geldig e-mailadres in.');
      return false;
    }

    // Check privacy checkbox
    if (!data.privacy) {
      showAlert('error', 'Je moet akkoord gaan met de privacyverklaring en algemene voorwaarden.');
      return false;
    }

    return true;
  }

  /**
   * Format dealer message for CMS
   */
  function formatDealerMessage(data) {
    return `DEALER AANMELDING

Bedrijfsgegevens:
- Bedrijfsnaam: ${data.company_name}
- BTW nummer: ${data.btw}
- Website: ${data.website || 'Niet opgegeven'}

Contactpersoon:
- Naam: ${data.contact_name}
- Functie: ${data.contact_function || 'Niet opgegeven'}
- E-mail: ${data.email}
- Telefoon: ${data.phone}

Adresgegevens:
- Adres: ${data.address}
- Postcode: ${data.postal_code}
- Plaats: ${data.city}
- Land: ${data.country}

Bedrijfsinformatie:
- Type bedrijf: ${data.business_type}${data.other_business_type ? ` (${data.other_business_type})` : ''}
- Jaaromzet: ${data.annual_turnover || 'Niet opgegeven'}

Motivatie / Opmerkingen:
${data.message || 'Geen opmerkingen'}`;
  }

  /**
   * Generate slug for dealer application
   */
  function generateDealerSlug(companyName) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const nameSlug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
    
    return `dealer-${dateStr}-${nameSlug}`;
  }

  /**
   * Format email body (fallback)
   */
  function formatEmailBody(data) {
    return formatDealerMessage(data);
  }

  /**
   * Copy text to clipboard
   */
  async function copyToClipboard(text) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  /**
   * Show alert message
   */
  function showAlert(type, message) {
    alertContainer.className = `alert alert-${type}`;
    alertContainer.textContent = message;
    alertContainer.style.display = 'block';

    // Auto-hide after 10 seconds
    setTimeout(() => {
      alertContainer.style.display = 'none';
    }, 10000);
  }
});
