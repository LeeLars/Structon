/**
 * Dealer Application Page
 * Handles dealer registration form submission to CMS with confirmation email
 */

// API base URL
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001/api'
  : 'https://structon-production.up.railway.app/api';

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
      // Submit to CMS API
      const response = await fetch(`${API_BASE}/dealer-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Company info
          company_name: data.company_name,
          vat_number: data.btw,
          website: data.website || null,
          
          // Contact person
          contact_name: data.contact_name,
          contact_function: data.contact_function || null,
          email: data.email,
          phone: data.phone,
          
          // Address
          address: data.address,
          postal_code: data.postal_code,
          city: data.city,
          country: data.country,
          
          // Business info
          business_type: data.business_type,
          other_business_type: data.other_business_type || null,
          annual_turnover: data.annual_turnover || null,
          message: data.message || null,
          
          // Meta
          submitted_at: new Date().toISOString(),
          status: 'pending'
        })
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      console.log('✅ Dealer application submitted:', result);
      
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
    formWrapper.innerHTML = `
      <div class="success-message" style="text-align: center; padding: 60px 20px;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" style="margin-bottom: 24px;">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2 style="color: var(--color-primary); margin-bottom: 16px;">Bedankt voor je aanmelding!</h2>
        <p style="font-size: 1.1rem; color: #555; margin-bottom: 24px;">
          We hebben je dealer aanvraag ontvangen en nemen zo snel mogelijk contact met je op.
        </p>
        <p style="color: #666; margin-bottom: 32px;">
          Een bevestiging is verzonden naar <strong>${email}</strong>
        </p>
        <a href="../index.html" class="btn-split usp-btn">
          <span class="btn-split-text">Terug naar Home</span>
          <span class="btn-split-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
        </a>
      </div>
    `;
    
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
   * Format email body
   */
  function formatEmailBody(data) {
    return `
DEALER AANMELDING - STRUCTON
========================================

BEDRIJFSGEGEVENS
----------------
Bedrijfsnaam: ${data.company_name}
BTW nummer: ${data.btw}
Website: ${data.website || 'Niet opgegeven'}

CONTACTPERSOON
--------------
Naam: ${data.contact_name}
Functie: ${data.contact_function || 'Niet opgegeven'}
E-mail: ${data.email}
Telefoon: ${data.phone}

ADRESGEGEVENS
-------------
Adres: ${data.address}
Postcode: ${data.postal_code}
Plaats: ${data.city}
Land: ${data.country}

BEDRIJFSINFORMATIE
------------------
Type bedrijf: ${data.business_type}
${data.other_business_type ? `Specificatie: ${data.other_business_type}` : ''}
Jaaromzet: ${data.annual_turnover || 'Niet opgegeven'}

MOTIVATIE / OPMERKINGEN
-----------------------
${data.message || 'Geen opmerkingen'}

========================================
Aanmelding ontvangen op: ${new Date().toLocaleString('nl-NL')}
    `.trim();
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
