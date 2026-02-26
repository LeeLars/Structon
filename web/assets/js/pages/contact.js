/**
 * Structon - Contact Form JavaScript
 * Handles contact form submission to CMS
 */

import { quotes, notifications } from '../api/client.js';

// Email addresses for form notifications
const NOTIFICATION_EMAILS = ['klantenleads@grafixstudio.be', 'offertes@structon.be'];

// Form state
let isSubmitting = false;

/**
 * Initialize contact page
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('📝 Contact page initialized');
  setupFormHandling();
});

/**
 * Setup form handling
 */
function setupFormHandling() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleSubmit);
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  if (isSubmitting) return;
  
  const form = e.target;
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  // Basic validation
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  
  // Get form data
  const formData = new FormData(form);
  const data = {
    customer_name: formData.get('customer_name'),
    customer_email: formData.get('customer_email'),
    customer_phone: formData.get('customer_phone') || null,
    message: formData.get('message'),
    type: 'contact',
    submitted_at: new Date().toISOString()
  };
  
  // Show loading state
  isSubmitting = true;
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoading.style.display = 'flex';
  
  // Prepare quote data for CMS (contact requests are stored as quotes with type 'contact')
  const quoteData = {
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone,
    message: data.message,
    request_type: 'contact',
    source_page: window.location.href,
    slug: generateQuoteSlug(data.customer_name)
  };
  
  console.log('📤 Submitting contact request:', quoteData);
  
  try {
    // Submit to CMS API
    const response = await quotes.submit(quoteData);
    
    console.log('✅ Contact request submitted successfully:', response);
    
    // Send email notifications
    try {
      const emailBody = formatContactEmail(data);
      const emailPromises = NOTIFICATION_EMAILS.map(email => 
        notifications.sendEmail({
          to: email,
          subject: `Nieuw contact bericht van ${data.customer_name}`,
          body: emailBody,
          replyTo: data.customer_email,
          formType: 'contact'
        })
      );
      await Promise.all(emailPromises);
      console.log('✅ Email notifications sent');
    } catch (emailError) {
      console.error('⚠️ Email notification failed:', emailError);
      // Don't fail the form if email fails
    }
    
    // Show success message
    showSuccessMessage();
    
  } catch (error) {
    console.error('❌ Contact form submission failed:', error);
    
    // Show error alert
    alert('Er is een fout opgetreden bij het verzenden van uw bericht. Probeer het later opnieuw of neem telefonisch contact met ons op: +32 (0)50 12 34 56');
    
    // Reset button
    isSubmitting = false;
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
  }
}

/**
 * Generate a slug for the contact request in CMS
 * Format: contact-YYYYMMDD-name-slug
 */
function generateQuoteSlug(customerName) {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const nameSlug = customerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 30);
  
  return `contact-${dateStr}-${nameSlug}`;
}

/**
 * Format contact email body for notifications
 */
function formatContactEmail(data) {
  return `NIEUW CONTACT BERICHT

Naam: ${data.customer_name}
E-mail: ${data.customer_email}
Telefoon: ${data.customer_phone || 'Niet opgegeven'}

Bericht:
${data.message}

---
Verzonden op: ${new Date().toLocaleString('nl-BE')}
Pagina: ${window.location.href}`;
}

/**
 * Show success message
 */
function showSuccessMessage() {
  const form = document.getElementById('contact-form');
  const successDiv = document.getElementById('form-success');
  
  if (form) form.style.display = 'none';
  if (successDiv) successDiv.style.display = 'block';
  
  // Scroll to success message
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
