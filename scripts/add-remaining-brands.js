#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read current file
const filePath = path.join(__dirname, '../web/assets/js/data/brand-data.js');
let content = fs.readFileSync(filePath, 'utf-8');

// Find where to insert (after hitachi closing brace, before the closing of BRAND_DATA)
const insertPoint = content.indexOf("  }\n};");

if (insertPoint === -1) {
  console.error('❌ Could not find insertion point');
  process.exit(1);
}

// All remaining brands with complete data
const remainingBrands = `
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
  },

  jcb: {
    name: 'JCB',
    slug: 'jcb',
    shortName: 'JCB',
    title: 'Kraanbak voor JCB',
    metaTitle: 'Kraanbak voor JCB | Graafbakken JCB Graafmachine | Structon',
    metaDescription: 'Kraanbak voor JCB graafmachine? Structon levert graafbakken passend voor alle JCB JS-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak jcb, graafbak jcb, JS220, JS330, slotenbak jcb',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle JCB graafmachines. Brits no-nonsense. JS-serie rupskranen, Hydradig innovatief concept. Eenvoudig onderhoud, sterke prijs/kwaliteit.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op JCB Model',
    modelSelectorSubtitle: 'JS-serie rupskranen, Hydradig 110W innovatief concept',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'JS16', tonnage: 1.6, cw: 'CW05' },
          { name: 'JS20', tonnage: 2.0, cw: 'CW05' },
          { name: 'JS30', tonnage: 3.0, cw: 'CW05' },
          { name: 'JS55', tonnage: 5.5, cw: 'CW10' },
          { name: 'JS85', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'JS130', tonnage: 13, cw: 'CW20' },
          { name: 'JS160', tonnage: 16, cw: 'CW30' },
          { name: 'JS220', tonnage: 22, cw: 'CW40' },
          { name: 'Hydradig 110W', tonnage: 11, cw: 'CW20', type: 'wielen' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'JS290', tonnage: 29, cw: 'CW40' },
          { name: 'JS330', tonnage: 33, cw: 'CW45' },
          { name: 'JS370', tonnage: 37, cw: 'CW45' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor JCB?',
        description: 'JCB Brits no-nonsense. JS-serie rupskranen, Hydradig 110W innovatief concept. Eenvoudig onderhoud, sterke prijs/kwaliteit.',
        rows: [
          { model: 'JS16', weight: '1,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'JS20', weight: '2,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'JS30', weight: '3,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'JS55', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'JS85', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'JS130', weight: '13 ton', cw: 'CW20', type: 'Rups' },
          { model: 'JS160', weight: '16 ton', cw: 'CW30', type: 'Rups' },
          { model: 'Hydradig 110W', weight: '11 ton', cw: 'CW20', type: 'Banden' },
          { model: 'JS220', weight: '22 ton', cw: 'CW40', type: 'Rups' },
          { model: 'JS290', weight: '29 ton', cw: 'CW40', type: 'Rups' },
          { model: 'JS330', weight: '33 ton', cw: 'CW45', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor JCB?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met JCB machines' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw JCB Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  kubota: {
    name: 'Kubota',
    slug: 'kubota',
    shortName: 'Kubota',
    title: 'Kraanbak voor Kubota',
    metaTitle: 'Kraanbak voor Kubota | Graafbakken Kubota Minigraver | Structon',
    metaDescription: 'Kraanbak voor Kubota minigraver? Structon levert graafbakken passend voor alle Kubota KX/U-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak kubota, graafbak kubota, KX080, U55, slotenbak kubota',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Kubota minigravers. Japanse mini-specialist, KX/U-serie. Compact, betrouwbaar, ideaal voor tuinaanleg en kleine werven.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Kubota Model',
    modelSelectorSubtitle: 'KX/U-serie minigravers - compact en betrouwbaar',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'U17', tonnage: 1.7, cw: 'CW05' },
          { name: 'KX019', tonnage: 1.9, cw: 'CW05' },
          { name: 'U27', tonnage: 2.7, cw: 'CW05' },
          { name: 'KX030', tonnage: 3.0, cw: 'CW05' },
          { name: 'U55', tonnage: 5.5, cw: 'CW10' },
          { name: 'KX080', tonnage: 8.0, cw: 'CW10' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Kubota?',
        description: 'Kubota Japanse mini-specialist, KX/U-serie. Compact, betrouwbaar, ideaal voor tuinaanleg en kleine werven.',
        rows: [
          { model: 'U17', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'KX019', weight: '1,9 ton', cw: 'CW05', type: 'Rups' },
          { model: 'U27', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'KX030', weight: '3,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'U55', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'KX080', weight: '8,0 ton', cw: 'CW10', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Kubota?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Speciaal ontworpen voor compacte Kubota minigravers' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Kubota Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  takeuchi: {
    name: 'Takeuchi',
    slug: 'takeuchi',
    shortName: 'Takeuchi',
    title: 'Kraanbak voor Takeuchi',
    metaTitle: 'Kraanbak voor Takeuchi | Graafbakken Takeuchi Minigraver | Structon',
    metaDescription: 'Kraanbak voor Takeuchi minigraver? Structon levert graafbakken passend voor alle Takeuchi TB-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak takeuchi, graafbak takeuchi, TB240, TB260, slotenbak takeuchi',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Takeuchi minigravers. Japanse compacte specialist, TB-serie. Robuust, eenvoudig, sterke restwaarde. Favoriet in verhuur.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Takeuchi Model',
    modelSelectorSubtitle: 'TB-serie - robuust en eenvoudig',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'TB210R', tonnage: 1.0, cw: 'CW05' },
          { name: 'TB216', tonnage: 1.6, cw: 'CW05' },
          { name: 'TB230', tonnage: 3.0, cw: 'CW05' },
          { name: 'TB240', tonnage: 4.0, cw: 'CW05' },
          { name: 'TB260', tonnage: 6.0, cw: 'CW10' },
          { name: 'TB290', tonnage: 9.0, cw: 'CW10' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Takeuchi?',
        description: 'Takeuchi Japanse compacte specialist, TB-serie. Robuust, eenvoudig, sterke restwaarde. Favoriet in verhuur.',
        rows: [
          { model: 'TB210R', weight: '1,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'TB216', weight: '1,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'TB230', weight: '3,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'TB240', weight: '4,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'TB260', weight: '6,0 ton', cw: 'CW10', type: 'Rups' },
          { model: 'TB290', weight: '9,0 ton', cw: 'CW10', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Takeuchi?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Takeuchi TB-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Takeuchi Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  yanmar: {
    name: 'Yanmar',
    slug: 'yanmar',
    shortName: 'Yanmar',
    title: 'Kraanbak voor Yanmar',
    metaTitle: 'Kraanbak voor Yanmar | Graafbakken Yanmar Minigraver | Structon',
    metaDescription: 'Kraanbak voor Yanmar minigraver? Structon levert graafbakken passend voor alle Yanmar ViO-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak yanmar, graafbak yanmar, ViO55, ViO80, slotenbak yanmar',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Yanmar minigravers. Japanse dieselmotor-expertise. ViO-serie met zero tail swing. Populair bij verhuurders en tuinaanleggers.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Yanmar Model',
    modelSelectorSubtitle: 'ViO-serie met zero tail swing',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'ViO17', tonnage: 1.7, cw: 'CW05' },
          { name: 'ViO20', tonnage: 2.0, cw: 'CW05' },
          { name: 'ViO27', tonnage: 2.7, cw: 'CW05' },
          { name: 'ViO35', tonnage: 3.5, cw: 'CW05' },
          { name: 'ViO55', tonnage: 5.5, cw: 'CW10' },
          { name: 'ViO80', tonnage: 8.0, cw: 'CW10' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Yanmar?',
        description: 'Yanmar Japanse dieselmotor-expertise. ViO-serie met zero tail swing. Populair bij verhuurders en tuinaanleggers.',
        rows: [
          { model: 'ViO17', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ViO20', weight: '2,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ViO27', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ViO35', weight: '3,5 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ViO55', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'ViO80', weight: '8,0 ton', cw: 'CW10', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Yanmar?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Yanmar ViO-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Yanmar Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  doosan: {
    name: 'Doosan',
    slug: 'doosan',
    shortName: 'Doosan',
    title: 'Kraanbak voor Doosan',
    metaTitle: 'Kraanbak voor Doosan | Graafbakken Doosan/Develon Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Doosan/Develon graafmachine? Structon levert graafbakken passend voor alle DX-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak doosan, graafbak doosan, DX225, DX300, develon',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Doosan/Develon graafmachines. Sinds 2023 Develon, zelfde DX-serie. D-ECOPOWER hydrauliek, veel standaarduitrusting. Sterk in verhuurmarkt.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Doosan Model',
    modelSelectorSubtitle: 'DX-serie (nu Develon) - D-ECOPOWER hydrauliek',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'DX17Z', tonnage: 1.7, cw: 'CW05' },
          { name: 'DX27Z', tonnage: 2.7, cw: 'CW05' },
          { name: 'DX35Z', tonnage: 3.5, cw: 'CW05' },
          { name: 'DX55', tonnage: 5.5, cw: 'CW10' },
          { name: 'DX85R', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'DX140LC', tonnage: 14, cw: 'CW20' },
          { name: 'DX160LC', tonnage: 16, cw: 'CW30' },
          { name: 'DX225LC', tonnage: 22, cw: 'CW40' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'DX300LC', tonnage: 30, cw: 'CW40' },
          { name: 'DX340LC', tonnage: 34, cw: 'CW45' },
          { name: 'DX420LC', tonnage: 42, cw: 'CW55' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Doosan/Develon?',
        description: 'Doosan/Develon - Sinds 2023 Develon, zelfde DX-serie. D-ECOPOWER hydrauliek, veel standaarduitrusting. Sterk in verhuurmarkt.',
        rows: [
          { model: 'DX17Z', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'DX27Z', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'DX35Z', weight: '3,5 ton', cw: 'CW05', type: 'Rups' },
          { model: 'DX55', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'DX85R', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'DX140LC', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'DX160LC', weight: '16 ton', cw: 'CW30', type: 'Rups' },
          { model: 'DX225LC', weight: '22 ton', cw: 'CW40', type: 'Rups' },
          { model: 'DX300LC', weight: '30 ton', cw: 'CW40', type: 'Rups' },
          { model: 'DX340LC', weight: '34 ton', cw: 'CW45', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Doosan/Develon?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Doosan/Develon DX-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Doosan/Develon Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  case: {
    name: 'Case',
    slug: 'case',
    shortName: 'Case',
    title: 'Kraanbak voor Case',
    metaTitle: 'Kraanbak voor Case | Graafbakken Case Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Case graafmachine? Structon levert graafbakken passend voor alle Case CX-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak case, graafbak case, CX210, CX300, slotenbak case',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Case graafmachines. Amerikaans merk (CNH Industrial). CX-serie rupskranen. Solide machines, goede prijs/prestatie.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Case Model',
    modelSelectorSubtitle: 'CX-serie rupskranen - solide prijs/prestatie',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'CX17C', tonnage: 1.7, cw: 'CW05' },
          { name: 'CX26C', tonnage: 2.6, cw: 'CW05' },
          { name: 'CX33C', tonnage: 3.3, cw: 'CW05' },
          { name: 'CX55B', tonnage: 5.5, cw: 'CW10' },
          { name: 'CX80C', tonnage: 8.0, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'CX130D', tonnage: 13, cw: 'CW20' },
          { name: 'CX145D', tonnage: 14.5, cw: 'CW20' },
          { name: 'CX210D', tonnage: 21, cw: 'CW40' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'CX300D', tonnage: 30, cw: 'CW40' },
          { name: 'CX350D', tonnage: 35, cw: 'CW45' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Case?',
        description: 'Case Amerikaans merk (CNH Industrial). CX-serie rupskranen. Solide machines, goede prijs/prestatie.',
        rows: [
          { model: 'CX17C', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'CX26C', weight: '2,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'CX33C', weight: '3,3 ton', cw: 'CW05', type: 'Rups' },
          { model: 'CX55B', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'CX80C', weight: '8,0 ton', cw: 'CW10', type: 'Rups' },
          { model: 'CX130D', weight: '13 ton', cw: 'CW20', type: 'Rups' },
          { model: 'CX145D', weight: '14,5 ton', cw: 'CW20', type: 'Rups' },
          { model: 'CX210D', weight: '21 ton', cw: 'CW40', type: 'Rups' },
          { model: 'CX300D', weight: '30 ton', cw: 'CW40', type: 'Rups' },
          { model: 'CX350D', weight: '35 ton', cw: 'CW45', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Case?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Case CX-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Case Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  hyundai: {
    name: 'Hyundai',
    slug: 'hyundai',
    shortName: 'Hyundai',
    title: 'Kraanbak voor Hyundai',
    metaTitle: 'Kraanbak voor Hyundai | Graafbakken Hyundai Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Hyundai graafmachine? Structon levert graafbakken passend voor alle Hyundai HX/HW-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak hyundai, graafbak hyundai, HX220, HX300, slotenbak hyundai',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Hyundai graafmachines. HX/HW-serie, focus op 4 pijlers: onderhoud, comfort, veiligheid, productiviteit. Hi MATE telematica.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Hyundai Model',
    modelSelectorSubtitle: 'HX/HW-serie - Hi MATE telematica',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'HX17A', tonnage: 1.7, cw: 'CW05' },
          { name: 'HX27Z', tonnage: 2.7, cw: 'CW05' },
          { name: 'HX35A', tonnage: 3.5, cw: 'CW05' },
          { name: 'HX55A', tonnage: 5.5, cw: 'CW10' },
          { name: 'HX85A', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'HX140L', tonnage: 14, cw: 'CW20' },
          { name: 'HX160L', tonnage: 16, cw: 'CW30' },
          { name: 'HX220L', tonnage: 22, cw: 'CW40' },
          { name: 'HW160', tonnage: 16, cw: 'CW30', type: 'wielen' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'HX300L', tonnage: 30, cw: 'CW40' },
          { name: 'HX380L', tonnage: 38, cw: 'CW45' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Hyundai?',
        description: 'Hyundai HX/HW-serie, focus op 4 pijlers: onderhoud, comfort, veiligheid, productiviteit. Hi MATE telematica, A-serie met langere intervallen.',
        rows: [
          { model: 'HX17A', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'HX27Z', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'HX35A', weight: '3,5 ton', cw: 'CW05', type: 'Rups' },
          { model: 'HX55A', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'HX85A', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'HX140L', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'HX160L', weight: '16 ton', cw: 'CW30', type: 'Rups' },
          { model: 'HW160', weight: '16 ton', cw: 'CW30', type: 'Banden' },
          { model: 'HX220L', weight: '22 ton', cw: 'CW40', type: 'Rups' },
          { model: 'HX300L', weight: '30 ton', cw: 'CW40', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Hyundai?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Hyundai HX/HW-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Hyundai Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  kobelco: {
    name: 'Kobelco',
    slug: 'kobelco',
    shortName: 'Kobelco',
    title: 'Kraanbak voor Kobelco',
    metaTitle: 'Kraanbak voor Kobelco | Graafbakken Kobelco Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Kobelco graafmachine? Structon levert graafbakken passend voor alle Kobelco SK-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak kobelco, graafbak kobelco, SK210, SK300, slotenbak kobelco',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Kobelco graafmachines. Japanse specialist, SK-serie. Bekend om zuinigheid en reduced tail swing modellen. Sterk in stedelijke projecten.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Kobelco Model',
    modelSelectorSubtitle: 'SK-serie - zuinig en reduced tail swing',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'SK17SR', tonnage: 1.7, cw: 'CW05' },
          { name: 'SK27SR', tonnage: 2.7, cw: 'CW05' },
          { name: 'SK35SR', tonnage: 3.5, cw: 'CW05' },
          { name: 'SK55SRX', tonnage: 5.5, cw: 'CW10' },
          { name: 'SK85MSR', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'SK140SRLC', tonnage: 14, cw: 'CW20' },
          { name: 'SK170LC', tonnage: 17, cw: 'CW30' },
          { name: 'SK210LC', tonnage: 21, cw: 'CW40' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'SK300LC', tonnage: 30, cw: 'CW40' },
          { name: 'SK350LC', tonnage: 35, cw: 'CW45' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Kobelco?',
        description: 'Kobelco Japanse specialist, SK-serie. Bekend om zuinigheid en reduced tail swing modellen. Sterk in stedelijke projecten.',
        rows: [
          { model: 'SK17SR', weight: '1,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SK27SR', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SK35SR', weight: '3,5 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SK55SRX', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'SK85MSR', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'SK140SRLC', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'SK170LC', weight: '17 ton', cw: 'CW30', type: 'Rups' },
          { model: 'SK210LC', weight: '21 ton', cw: 'CW40', type: 'Rups' },
          { model: 'SK300LC', weight: '30 ton', cw: 'CW40', type: 'Rups' },
          { model: 'SK350LC', weight: '35 ton', cw: 'CW45', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Kobelco?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Kobelco SK-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Kobelco Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  sany: {
    name: 'Sany',
    slug: 'sany',
    shortName: 'Sany',
    title: 'Kraanbak voor Sany',
    metaTitle: 'Kraanbak voor Sany | Graafbakken Sany Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Sany graafmachine? Structon levert graafbakken passend voor alle Sany SY-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak sany, graafbak sany, SY215, SY365, slotenbak sany',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Sany graafmachines. Chinese fabrikant, snelgroeiend in Europa. SY-serie. Competitieve prijs, moderne technologie.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Sany Model',
    modelSelectorSubtitle: 'SY-serie - moderne technologie',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'SY16C', tonnage: 1.6, cw: 'CW05' },
          { name: 'SY26U', tonnage: 2.6, cw: 'CW05' },
          { name: 'SY35U', tonnage: 3.5, cw: 'CW05' },
          { name: 'SY55C', tonnage: 5.5, cw: 'CW10' },
          { name: 'SY75C', tonnage: 7.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'SY135C', tonnage: 13.5, cw: 'CW20' },
          { name: 'SY155H', tonnage: 15.5, cw: 'CW30' },
          { name: 'SY215C', tonnage: 21.5, cw: 'CW40' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'SY305H', tonnage: 30.5, cw: 'CW40' },
          { name: 'SY365H', tonnage: 36.5, cw: 'CW45' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Sany?',
        description: 'Sany Chinese fabrikant, snelgroeiend in Europa. SY-serie. Competitieve prijs, moderne technologie.',
        rows: [
          { model: 'SY16C', weight: '1,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SY26U', weight: '2,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SY35U', weight: '3,5 ton', cw: 'CW05', type: 'Rups' },
          { model: 'SY55C', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'SY75C', weight: '7,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'SY135C', weight: '13,5 ton', cw: 'CW20', type: 'Rups' },
          { model: 'SY155H', weight: '15,5 ton', cw: 'CW30', type: 'Rups' },
          { model: 'SY215C', weight: '21,5 ton', cw: 'CW40', type: 'Rups' },
          { model: 'SY305H', weight: '30,5 ton', cw: 'CW40', type: 'Rups' },
          { model: 'SY365H', weight: '36,5 ton', cw: 'CW45', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Sany?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Sany SY-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Sany Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  'wacker-neuson': {
    name: 'Wacker Neuson',
    slug: 'wacker-neuson',
    shortName: 'Wacker Neuson',
    title: 'Kraanbak voor Wacker Neuson',
    metaTitle: 'Kraanbak voor Wacker Neuson | Graafbakken Wacker Neuson Minigraver | Structon',
    metaDescription: 'Kraanbak voor Wacker Neuson minigraver? Structon levert graafbakken passend voor alle Wacker Neuson ET/EW-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak wacker neuson, graafbak wacker neuson, ET65, EW65, slotenbak wacker neuson',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Wacker Neuson minigravers. Duits/Oostenrijks, compact materieel specialist. ET/EW-serie mini\\'s. Dual View cabine, zero tail swing.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Wacker Neuson Model',
    modelSelectorSubtitle: 'ET/EW-serie - Dual View cabine',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'ET16', tonnage: 1.6, cw: 'CW05' },
          { name: 'ET18', tonnage: 1.8, cw: 'CW05' },
          { name: 'ET24', tonnage: 2.4, cw: 'CW05' },
          { name: 'ET65', tonnage: 6.5, cw: 'CW10' },
          { name: 'EW65', tonnage: 6.5, cw: 'CW10', type: 'wielen' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Wacker Neuson?',
        description: 'Wacker Neuson Duits/Oostenrijks, compact materieel specialist. ET/EW-serie mini\\'s. Dual View cabine, zero tail swing.',
        rows: [
          { model: 'ET16', weight: '1,6 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ET18', weight: '1,8 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ET24', weight: '2,4 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ET65', weight: '6,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'EW65', weight: '6,5 ton', cw: 'CW10', type: 'Banden' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Wacker Neuson?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Wacker Neuson ET/EW-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Wacker Neuson Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  }`;

// Remove the old helper function section
const helperStart = content.indexOf('\n// Basis data voor overige merken');
const helperEnd = content.indexOf('\n// Lijst van andere merken voor cross-linking');

if (helperStart === -1 || helperEnd === -1) {
  console.error('❌ Could not find helper function section');
  process.exit(1);
}

// Build new content
const newContent = content.substring(0, insertPoint) + remainingBrands + '\n};\n' + content.substring(helperEnd);

// Write back
fs.writeFileSync(filePath, newContent, 'utf-8');

console.log('✅ Successfully added all 11 remaining brands with full model selectors!');
console.log('📊 Total brands now: 15 (Caterpillar, Volvo, Komatsu, Hitachi + 11 new)');
console.log('🎯 Each brand now has:');
console.log('   - Model selector with categories');
console.log('   - Complete CW-aansluiting table');
console.log('   - Waarom Structon section');
console.log('   - Brand-specific descriptions');
