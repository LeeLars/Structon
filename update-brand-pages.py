#!/usr/bin/env python3
"""
Update all brand pages to match the new industry-style design.
Adds CTA banner, benefits section, and 2-column SEO layout.
"""

import os
import re

# Brand list (excluding caterpillar which is already done)
BRANDS = [
    'case', 'develon', 'hitachi', 'hyundai', 'jcb', 'kobelco', 
    'komatsu', 'kubota', 'liebherr', 'sany', 'takeuchi', 'volvo', 
    'wacker-neuson', 'yanmar'
]

BASE_PATH = '/Users/larsleenders/Downloads/Structon/web/kraanbakken'

def update_brand_page(brand_name):
    """Update a single brand page with new design elements."""
    
    file_path = os.path.join(BASE_PATH, brand_name, 'index.html')
    
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Get brand display name (capitalize first letter)
    brand_display = brand_name.replace('-', ' ').title()
    
    # 1. Add CTA Banner after hero section
    cta_banner = f'''    </section>

    <!-- CTA Banner -->
    <section class="brand-cta-banner">
      <div class="container">
        <div class="brand-cta-content">
          <div class="brand-cta-text-wrapper">
            <h2 class="brand-cta-banner-title">Vraag een offerte aan voor uw {brand_display} – binnen 24u antwoord</h2>
            <p class="brand-cta-banner-subtitle">Persoonlijk advies van onze specialisten. Scherpe prijzen voor professionals.</p>
          </div>
          <div class="brand-cta-button-wrapper">
            <a href="../../contact/?brand={brand_name}" class="btn-split usp-btn">
              <span class="btn-split-text">Offerte Aanvragen</span>
              <span class="btn-split-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Model Selector Section -->'''
    
    content = re.sub(
        r'    </section>\n\n    <!-- Model Selector Section -->',
        cta_banner,
        content,
        count=1
    )
    
    # 2. Replace SEO section with Benefits + 2-column SEO layout
    benefits_and_seo = f'''    </section>

    <!-- Benefits Section -->
    <section class="brand-benefits">
      <div class="container">
        <h2 class="section-title text-center">Waarom Structon voor {brand_display}?</h2>
        
        <div class="benefits-grid">
          <div class="benefit-card">
            <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <h3 class="benefit-title">Perfecte Pasvorm</h3>
            <p class="benefit-text">Ontworpen voor optimale prestaties met {brand_display} machines. Elke bak past perfect op uw snelwissel.</p>
          </div>
          
          <div class="benefit-card">
            <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h3 class="benefit-title">Hardox Kwaliteit</h3>
            <p class="benefit-text">Slijtplaten van Hardox 450 voor maximale levensduur, zelfs bij intensief gebruik.</p>
          </div>
          
          <div class="benefit-card">
            <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <h3 class="benefit-title">Snelle Levering</h3>
            <p class="benefit-text">Grote voorraad, direct leverbaar uit België. Spoedleveringen mogelijk.</p>
          </div>
          
          <div class="benefit-card">
            <svg class="benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3 class="benefit-title">2 Jaar Garantie</h3>
            <p class="benefit-text">Volledige garantie op constructiefouten. Betrouwbare kwaliteit waar u op kunt vertrouwen.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="brand-seo-content">
      <div class="container">
        <div class="brand-seo-grid">
          <div class="brand-seo-main">
            <h2>Kraanbakken voor {brand_display} Graafmachines</h2>
            <p>
              Structon levert hoogwaardige kraanbakken speciaal ontworpen voor {brand_display} graafmachines. 
              Wij hebben de juiste bak voor elke machine en toepassing, van minigravers tot zware rupskranen.
            </p>
            
            <h3>Snelwisselsysteem</h3>
            <p>
              Alle Structon kraanbakken zijn standaard uitgerust met de juiste snelwissel-aansluiting 
              voor uw {brand_display} machine. Compatibel met alle gangbare systemen.
            </p>
            
            <h3>Hardox Slijtplaten</h3>
            <p>
              Alle Structon kraanbakken worden vervaardigd met Hardox 450 slijtplaten. Dit Zweedse 
              slijtvaststaal biedt een uitstekende balans tussen hardheid en taaiheid, waardoor uw 
              kraanbak langer meegaat en minder onderhoud nodig heeft.
            </p>
          </div>
          
          <div class="brand-seo-sidebar">
            <div class="brand-contact-card">
              <h4>Direct Contact</h4>
              <p>Vragen over kraanbakken voor uw {brand_display}? Onze specialisten helpen u graag.</p>
              <div class="brand-contact-info">
                <a href="tel:+3250123456">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                  </svg>
                  +32 (0)50 12 34 56
                </a>
                <a href="mailto:info@structon.be">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  info@structon.be
                </a>
              </div>
            </div>
            
            <div class="brand-related-card">
              <h4>Andere Merken</h4>
              <div class="brand-related-links">
                <a href="/kraanbakken/caterpillar/">Caterpillar</a>
                <a href="/kraanbakken/komatsu/">Komatsu</a>
                <a href="/kraanbakken/volvo/">Volvo</a>
                <a href="/kraanbakken/hitachi/">Hitachi</a>
                <a href="/kraanbakken/liebherr/">Liebherr</a>
                <a href="/kraanbakken/jcb/">JCB</a>
                <a href="/kraanbakken/kubota/">Kubota</a>
                <a href="/kraanbakken/takeuchi/">Takeuchi</a>
                <a href="/kraanbakken/yanmar/">Yanmar</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->'''
    
    # Find and replace the old SEO section
    seo_pattern = r'    </section>\n\n    <!-- SEO Content Section -->.*?<!-- Bottom CTA -->'
    content = re.sub(seo_pattern, benefits_and_seo, content, flags=re.DOTALL, count=1)
    
    # 3. Update footer CTA text
    content = re.sub(
        r'<p class="brand-cta-text">.*?</p>',
        '<p class="brand-cta-text">Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.</p>',
        content,
        count=1
    )
    
    # Write updated content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated: {brand_name}")
    return True

def main():
    """Update all brand pages."""
    print("🚀 Starting brand page updates...\n")
    
    success_count = 0
    for brand in BRANDS:
        if update_brand_page(brand):
            success_count += 1
    
    print(f"\n✨ Completed! Updated {success_count}/{len(BRANDS)} brand pages.")

if __name__ == '__main__':
    main()
