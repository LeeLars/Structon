#!/usr/bin/env python3
"""
Generate complete brand-data.js with full model selectors and CW tables for all 11 remaining brands
"""

import json

# Read the current brand-data.js to preserve Caterpillar, Volvo, Komatsu, Hitachi
with open('web/assets/js/data/brand-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the existing complete brands (Caterpillar, Volvo, Komatsu, Hitachi)
# We'll keep everything up to hitachi and replace the rest

# Find where hitachi ends
hitachi_end = content.find("ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'\n  }\n};")
if hitachi_end == -1:
    print("Error: Could not find hitachi end marker")
    exit(1)

# Keep everything up to and including the closing of hitachi
preserved_content = content[:hitachi_end + len("ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'\n  }")]

# Now add the remaining 11 brands with full data
additional_brands = """
,

  liebherr: {
    name: 'Liebherr',
    slug: 'liebherr',
    shortName: 'Liebherr',
    title: 'Kraanbak voor Liebherr',
    metaTitle: 'Kraanbak voor Liebherr | Graafbakken Liebherr Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Liebherr graafmachine? Structon levert graafbakken passend voor alle Liebherr R-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak liebherr, graafbak liebherr, R926, R936, slotenbak liebherr',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Liebherr graafmachines. Duitse ingenieurskunst sinds 1949. R-serie rupskranen, A-serie wielgravers. Let op: zwaardere stick-afmetingen.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Liebherr Model',
    modelSelectorSubtitle: 'R-serie rupskranen, A-serie wielgravers',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'R914 Compact', tonnage: 1.4, cw: 'CW05' },
          { name: 'R918 Compact', tonnage: 1.8, cw: 'CW05' },
          { name: 'R922 Compact', tonnage: 2.2, cw: 'CW05' },
          { name: 'R926 Compact', tonnage: 6.0, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'R914', tonnage: 14, cw: 'CW20' },
          { name: 'R920', tonnage: 20, cw: 'CW30' },
          { name: 'R924', tonnage: 24, cw: 'CW40' },
          { name: 'A918', tonnage: 18, cw: 'CW30', type: 'wielen' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'R930', tonnage: 30, cw: 'CW40' },
          { name: 'R936', tonnage: 36, cw: 'CW45' },
          { name: 'R945', tonnage: 45, cw: 'CW55' },
          { name: 'R956', tonnage: 56, cw: 'CW70' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Liebherr?',
        description: 'Liebherr Duitse ingenieurskunst sinds 1949. R-serie rupskranen, A-serie wielgravers. Let op: zwaardere stick-afmetingen dan andere merken.',
        rows: [
          { model: 'R914 Compact', weight: '1,4 ton', cw: 'CW05', type: 'Rups' },
          { model: 'R918 Compact', weight: '1,8 ton', cw: 'CW05', type: 'Rups' },
          { model: 'R922 Compact', weight: '2,2 ton', cw: 'CW05', type: 'Rups' },
          { model: 'R926 Compact', weight: '6,0 ton', cw: 'CW10', type: 'Rups' },
          { model: 'R914', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'R920', weight: '20 ton', cw: 'CW30', type: 'Rups' },
          { model: 'A918', weight: '18 ton', cw: 'CW30', type: 'Banden' },
          { model: 'R924', weight: '24 ton', cw: 'CW40', type: 'Rups' },
          { model: 'R930', weight: '30 ton', cw: 'CW40', type: 'Rups' },
          { model: 'R936', weight: '36 ton', cw: 'CW45', type: 'Rups' },
          { model: 'R945', weight: '45 ton', cw: 'CW55', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Liebherr?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Aangepast aan zwaardere Liebherr stick-afmetingen' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Liebherr Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  }
};

// Lijst van andere merken voor cross-linking
export const OTHER_BRANDS = [
  { name: 'Komatsu', slug: 'komatsu' },
  { name: 'Volvo', slug: 'volvo' },
  { name: 'Hitachi', slug: 'hitachi' },
  { name: 'Liebherr', slug: 'liebherr' },
  { name: 'JCB', slug: 'jcb' },
  { name: 'Kubota', slug: 'kubota' },
  { name: 'Takeuchi', slug: 'takeuchi' },
  { name: 'Yanmar', slug: 'yanmar' },
  { name: 'Doosan', slug: 'doosan' },
  { name: 'Case', slug: 'case' },
  { name: 'Caterpillar', slug: 'caterpillar' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Kobelco', slug: 'kobelco' },
  { name: 'Sany', slug: 'sany' },
  { name: 'Wacker Neuson', slug: 'wacker-neuson' }
];
"""

# Write the new file
output = preserved_content + additional_brands

with open('web/assets/js/data/brand-data-new.js', 'w', encoding='utf-8') as f:
    f.write("""/**
 * Brand Page Configuration Data
 * Centrale configuratie voor alle merkpagina's
 */

export const BRAND_DATA = {
""")
    # Remove the opening part from preserved content
    start_idx = preserved_content.find('caterpillar: {')
    if start_idx != -1:
        f.write(preserved_content[start_idx:])
    f.write(additional_brands)

print("✅ Generated brand-data-new.js with Liebherr complete")
print("⚠️  Still need to add: JCB, Kubota, Takeuchi, Yanmar, Doosan, Case, Hyundai, Kobelco, Sany, Wacker Neuson")
