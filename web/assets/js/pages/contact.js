/**
 * Structon - Contact Form JavaScript
 * Handles simple contact form submission
 */

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
  
  try {
    // Create mailto link with form data
    const subject = encodeURIComponent('Contact formulier - Structon');
    const body = encodeURIComponent(
      `Naam: ${data.customer_name}\n` +
      `E-mail: ${data.customer_email}\n` +
      `Telefoon: ${data.customer_phone || 'Niet opgegeven'}\n\n` +
      `Bericht:\n${data.message}\n\n` +
      `---\n` +
      `Verzonden op: ${new Date().toLocaleString('nl-BE')}`
    );
    
    const mailtoLink = `mailto:info@structon.be?subject=${subject}&body=${body}`;
    
    // Open mailto link
    window.location.href = mailtoLink;
    
    console.log('✅ Contact form submitted successfully');
    
    // Show success message after short delay
    setTimeout(() => {
      showSuccessMessage();
    }, 500);
    
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
