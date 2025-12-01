/**
 * Dealer Application Page
 * Handles dealer registration form submission
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('dealer-form');
  const submitBtn = document.getElementById('submit-btn');
  const alertContainer = document.getElementById('dealer-alert');

  if (form) {
    form.addEventListener('submit', handleSubmit);
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

    try {
      // Send email via mailto (fallback)
      // In production, this should be an API call to send email via backend
      const emailBody = formatEmailBody(data);
      const subject = `Dealer Aanmelding: ${data.company_name}`;
      
      // For now, we'll show success and copy to clipboard
      await copyToClipboard(emailBody);
      
      showAlert('success', 'Aanmelding succesvol! De gegevens zijn gekopieerd naar je klembord. Stuur deze naar info@structon.nl');
      
      // Reset form
      form.reset();
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      showAlert('error', 'Er is iets misgegaan. Probeer het opnieuw of neem contact met ons op.');
    } finally {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
    }
  }

  /**
   * Validate form data
   */
  function validateForm(data) {
    // Check required fields
    const requiredFields = [
      'company_name', 'kvk', 'btw', 'contact_name', 
      'contact_function', 'email', 'phone', 'address', 
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
KVK nummer: ${data.kvk}
BTW nummer: ${data.btw}
Website: ${data.website || 'Niet opgegeven'}

CONTACTPERSOON
--------------
Naam: ${data.contact_name}
Functie: ${data.contact_function}
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
