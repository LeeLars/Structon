import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send confirmation email for quote/request submission
 */
export async function sendConfirmationEmail(data) {
  const { 
    customer_name, 
    customer_email, 
    request_type, 
    reference,
    cart_items,
    product_name,
    company_name,
    message
  } = data;

  // Determine email subject and content based on request type
  const emailConfig = getEmailConfig(request_type);
  
  // Build email HTML
  const html = buildEmailHTML({
    customer_name,
    request_type,
    reference,
    cart_items,
    product_name,
    company_name,
    message,
    emailConfig
  });

  try {
    const result = await resend.emails.send({
      from: 'Structon <noreply@structon-bv.com>',
      to: customer_email,
      subject: emailConfig.subject,
      html: html
    });

    console.log('✅ Confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    throw error;
  }
}

/**
 * Get email configuration based on request type
 */
function getEmailConfig(request_type) {
  const configs = {
    'offerte': {
      subject: 'Bevestiging - Uw offerteaanvraag bij Structon',
      title: 'Bedankt voor uw offerteaanvraag',
      intro: 'We hebben uw offerteaanvraag in goede orde ontvangen. Ons team zal uw aanvraag zo spoedig mogelijk behandelen en u een offerte op maat toesturen.'
    },
    'maatwerk': {
      subject: 'Bevestiging - Uw maatwerkaanvraag bij Structon',
      title: 'Bedankt voor uw maatwerkaanvraag',
      intro: 'We hebben uw maatwerkaanvraag in goede orde ontvangen. Onze specialisten zullen contact met u opnemen om uw specifieke wensen te bespreken.'
    },
    'dealer': {
      subject: 'Bevestiging - Uw dealer aanmelding bij Structon',
      title: 'Bedankt voor uw interesse om Structon dealer te worden',
      intro: 'We hebben uw aanmelding als dealer in goede orde ontvangen. Ons team zal uw aanvraag beoordelen en binnen enkele werkdagen contact met u opnemen.'
    },
    'contact': {
      subject: 'Bevestiging - Uw contactaanvraag bij Structon',
      title: 'Bedankt voor uw bericht',
      intro: 'We hebben uw bericht in goede orde ontvangen. Ons team zal zo spoedig mogelijk contact met u opnemen.'
    },
    'vraag': {
      subject: 'Bevestiging - Uw vraag aan Structon',
      title: 'Bedankt voor uw vraag',
      intro: 'We hebben uw vraag in goede orde ontvangen. Ons team zal u zo spoedig mogelijk van een antwoord voorzien.'
    }
  };

  return configs[request_type] || configs['contact'];
}

/**
 * Build HTML email template
 */
function buildEmailHTML({ customer_name, request_type, reference, cart_items, product_name, company_name, message, emailConfig }) {
  const firstName = customer_name?.split(' ')[0] || 'Klant';
  
  return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${emailConfig.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #236773 0%, #2d7f8d 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">STRUCTON</h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">Kraanbakken & Graafmachine Aanbouwdelen</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              
              <!-- Greeting -->
              <h2 style="margin: 0 0 20px 0; color: #236773; font-size: 24px;">${emailConfig.title}</h2>
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                Beste ${firstName},
              </p>
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                ${emailConfig.intro}
              </p>

              <!-- Reference Number -->
              ${reference ? `
              <div style="background-color: #f8f9fa; border-left: 4px solid #236773; padding: 15px 20px; margin-bottom: 30px;">
                <p style="margin: 0; color: #666666; font-size: 14px;">Referentienummer</p>
                <p style="margin: 5px 0 0 0; color: #236773; font-size: 18px; font-weight: bold;">${reference}</p>
              </div>
              ` : ''}

              <!-- Customer Details -->
              <h3 style="margin: 0 0 15px 0; color: #236773; font-size: 18px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Uw Gegevens</h3>
              <table width="100%" cellpadding="8" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="color: #666666; font-size: 14px; width: 140px;">Naam:</td>
                  <td style="color: #333333; font-size: 14px; font-weight: 600;">${customer_name || '-'}</td>
                </tr>
                ${company_name ? `
                <tr>
                  <td style="color: #666666; font-size: 14px;">Bedrijf:</td>
                  <td style="color: #333333; font-size: 14px; font-weight: 600;">${company_name}</td>
                </tr>
                ` : ''}
              </table>

              <!-- Products (if cart_items) -->
              ${cart_items && Array.isArray(cart_items) && cart_items.length > 0 ? `
              <h3 style="margin: 0 0 15px 0; color: #236773; font-size: 18px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Aangevraagde Producten</h3>
              ${cart_items.map(item => `
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 15px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          ${item.image ? `
                          <td width="80" style="vertical-align: top;">
                            <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 70px; object-fit: contain; border-radius: 4px; background: #f8f9fa; padding: 5px;">
                          </td>
                          ` : ''}
                          <td style="vertical-align: top; padding-left: ${item.image ? '15px' : '0'};">
                            <p style="margin: 0 0 5px 0; color: #333333; font-size: 16px; font-weight: 600;">${item.title || 'Product'}</p>
                            ${item.category || item.subcategory ? `
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 13px;">${item.category || ''}${item.subcategory ? ' › ' + item.subcategory : ''}</p>
                            ` : ''}
                            ${item.specs ? `
                            <div style="margin-top: 8px;">
                              ${Object.entries(item.specs).filter(([k,v]) => v).map(([k,v]) => `
                                <span style="display: inline-block; background-color: #236773; color: #ffffff; font-size: 11px; padding: 3px 8px; border-radius: 3px; margin-right: 5px; margin-bottom: 5px;">${v}</span>
                              `).join('')}
                            </div>
                            ` : ''}
                          </td>
                          <td width="60" style="vertical-align: top; text-align: right;">
                            <p style="margin: 0; color: #236773; font-size: 18px; font-weight: bold;">${item.quantity || 1}x</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              `).join('')}
              ` : product_name ? `
              <h3 style="margin: 0 0 15px 0; color: #236773; font-size: 18px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Product</h3>
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; font-weight: 600;">${product_name}</p>
              ` : ''}

              <!-- Message (if provided) -->
              ${message ? `
              <h3 style="margin: 0 0 15px 0; color: #236773; font-size: 18px; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">Uw Bericht</h3>
              <div style="background-color: #f8f9fa; padding: 15px 20px; border-radius: 6px; margin-bottom: 30px;">
                <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              ` : ''}

              <!-- Next Steps -->
              <div style="background-color: #f0f8fa; border-radius: 8px; padding: 20px; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0; color: #236773; font-size: 16px;">Wat gebeurt er nu?</h3>
                <p style="margin: 0; color: #333333; font-size: 14px; line-height: 1.6;">
                  ${request_type === 'dealer' 
                    ? 'Ons team beoordeelt uw aanmelding en neemt binnen enkele werkdagen contact met u op om de mogelijkheden te bespreken.' 
                    : request_type === 'offerte' || request_type === 'maatwerk'
                    ? 'Ons team stelt een offerte op maat voor u samen. U ontvangt deze binnen 1-2 werkdagen per e-mail.'
                    : 'Ons team neemt zo spoedig mogelijk contact met u op, meestal binnen 24 uur.'}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>Structon BV</strong><br>
                Sint jorisstraat 84B, 8730 Beernem, België<br>
                BTW: BE 1029978959
              </p>
              <p style="margin: 15px 0 0 0; color: #666666; font-size: 14px;">
                <a href="mailto:info@structon.be" style="color: #236773; text-decoration: none;">info@structon.be</a> | 
                <a href="https://structon-bv.com" style="color: #236773; text-decoration: none;">www.structon-bv.com</a>
              </p>
              <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px;">
                Deze e-mail is automatisch gegenereerd. Gelieve niet te antwoorden op dit bericht.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
