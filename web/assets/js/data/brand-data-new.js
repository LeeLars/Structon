/**
 * Brand Page Configuration Data
 * Centrale configuratie voor alle merkpagina's
 */

export const BRAND_DATA = {
caterpillar: {
    name: 'Caterpillar',
    slug: 'caterpillar',
    shortName: 'CAT',
    title: 'Kraanbak voor Caterpillar',
    metaTitle: 'Kraanbak voor Caterpillar | Graafbakken CAT Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Caterpillar graafmachine? Structon levert graafbakken passend voor alle CAT modellen. ✓ CW-aansluiting ✓ Hardox staal ✓ Belgische productie',
    metaKeywords: 'kraanbak caterpillar, graafbak CAT, slotenbak caterpillar, kraanbak CAT 320, kraanbak CAT 330',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Caterpillar graafmachines. Van de compacte CAT 301 minigraver tot de zware CAT 395 rupskraan.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op CAT Model',
    modelSelectorSubtitle: 'Klik op jouw machinemodel voor passende producten',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW00 - CW10 snelwissels',
        models: [
          { name: '300.9D', tonnage: 0.9, cw: 'CW00' },
          { name: '301.5', tonnage: 1.8, cw: 'CW05' },
          { name: '302.7 CR', tonnage: 3.0, cw: 'CW05' },
          { name: '303.5 CR', tonnage: 4.2, cw: 'CW05' },
          { name: '305 CR', tonnage: 5.8, cw: 'CW10' },
          { name: '306 CR', tonnage: 7.2, cw: 'CW10' },
          { name: '308 CR', tonnage: 8.5, cw: 'CW10' },
          { name: '310', tonnage: 10, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-22 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: '315', tonnage: 15, cw: 'CW20' },
          { name: '317', tonnage: 18, cw: 'CW30' },
          { name: '320', tonnage: 22.6, cw: 'CW40' },
          { name: 'M314', tonnage: 15, cw: 'CW30' },
          { name: 'M318', tonnage: 18, cw: 'CW30' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: '336', tonnage: 37, cw: 'CW45' },
          { name: '349', tonnage: 48, cw: 'CW55' },
          { name: '395', tonnage: 94, cw: 'CW70' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting?',
        description: 'Caterpillar machines gebruiken verschillende CW-systemen afhankelijk van het gewicht:',
        rows: [
          { model: '300.9D', weight: '0,9 ton', cw: 'CW00' },
          { model: '301.5', weight: '1,8 ton', cw: 'CW05' },
          { model: '302.7', weight: '3,0 ton', cw: 'CW05' },
          { model: '305', weight: '5,8 ton', cw: 'CW10' },
          { model: '308', weight: '8,5 ton', cw: 'CW10' },
          { model: '315', weight: '15 ton', cw: 'CW20/30' },
          { model: '320', weight: '22 ton', cw: 'CW40' },
          { model: '336', weight: '37 ton', cw: 'CW45' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met CAT machines' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Op bestelling gemaakt, korte levertijd uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' },
          { title: 'Garantie', description: '2 jaar garantie op constructiefouten' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw CAT Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  volvo: {
    name: 'Volvo',
    slug: 'volvo',
    shortName: 'Volvo',
    title: 'Kraanbak voor Volvo',
    metaTitle: 'Kraanbak voor Volvo | Graafbakken Volvo Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Volvo graafmachine? Structon levert graafbakken passend voor alle Volvo modellen. ✓ CW-aansluiting ✓ Hardox staal ✓ Belgische productie',
    metaKeywords: 'kraanbak volvo, graafbak volvo, slotenbak volvo, kraanbak EC220, kraanbak EC300',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Volvo graafmachines. Van de compacte EC15 minigraver tot de zware EC480 rupskraan.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Volvo Model',
    modelSelectorSubtitle: 'EC = rupsgraafmachine, ECR = compact rups, EW = bandengraafmachine',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'ECR18E', tonnage: 1.8, cw: 'CW05' },
          { name: 'EC20D', tonnage: 2.0, cw: 'CW05' },
          { name: 'EC27D', tonnage: 2.7, cw: 'CW05' },
          { name: 'EC60E', tonnage: 6.0, cw: 'CW10' },
          { name: 'ECR88D', tonnage: 9.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'EC140E', tonnage: 14, cw: 'CW20' },
          { name: 'EC160E', tonnage: 17, cw: 'CW30' },
          { name: 'EC220E', tonnage: 22, cw: 'CW40' },
          { name: 'EW160E', tonnage: 18, cw: 'CW30', type: 'wielen' },
          { name: 'EW180E', tonnage: 18, cw: 'CW30', type: 'wielen' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'EC300E', tonnage: 30, cw: 'CW40' },
          { name: 'EC380E', tonnage: 38, cw: 'CW45' },
          { name: 'EC480E', tonnage: 48, cw: 'CW55' },
          { name: 'EC750E', tonnage: 75, cw: 'CW70' },
          { name: 'EC950F', tonnage: 90, cw: 'CW70' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Volvo?',
        description: 'Volvo CE levert graafmachines van ~1,8 ton minigravers tot ~90 ton zware machines.',
        rows: [
          { model: 'ECR18E', weight: '1,8 ton', cw: 'CW05', type: 'Rups' },
          { model: 'EC20D', weight: '2,0 ton', cw: 'CW05', type: 'Rups' },
          { model: 'EC27D', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'EC60E', weight: '6,0 ton', cw: 'CW10', type: 'Rups' },
          { model: 'EC140E', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'EC220E', weight: '22 ton', cw: 'CW40', type: 'Rups' },
          { model: 'EC300E', weight: '30 ton', cw: 'CW40', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Volvo machines' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Op bestelling gemaakt, korte levertijd uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' },
          { title: 'Garantie', description: '2 jaar garantie op constructiefouten' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Volvo Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  komatsu: {
    name: 'Komatsu',
    slug: 'komatsu',
    shortName: 'Komatsu',
    title: 'Kraanbak voor Komatsu',
    metaTitle: 'Kraanbak voor Komatsu | Graafbakken Komatsu Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Komatsu graafmachine? Structon levert graafbakken passend voor alle Komatsu PC modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak komatsu, graafbak komatsu, PC200, PC300, slotenbak komatsu',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Komatsu graafmachines. Van compacte PC30 tot zware PC490. Japanse precisie met Intelligent Machine Control.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Komatsu Model',
    modelSelectorSubtitle: 'PC-serie graafmachines met iMC technologie',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'PC18MR', tonnage: 1.8, cw: 'CW05' },
          { name: 'PC26MR', tonnage: 2.7, cw: 'CW05' },
          { name: 'PC30MR', tonnage: 3.2, cw: 'CW05' },
          { name: 'PC55MR', tonnage: 5.5, cw: 'CW10' },
          { name: 'PC88MR', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW20 - CW40 snelwissels',
        models: [
          { name: 'PC138US', tonnage: 14, cw: 'CW20' },
          { name: 'PC170LC', tonnage: 17, cw: 'CW30' },
          { name: 'PC210LC', tonnage: 22, cw: 'CW40' },
          { name: 'PC240LC', tonnage: 24, cw: 'CW40' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'PC290LC', tonnage: 29, cw: 'CW40' },
          { name: 'PC360LC', tonnage: 36, cw: 'CW45' },
          { name: 'PC490LC', tonnage: 49, cw: 'CW55' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Komatsu?',
        description: 'Komatsu PC-serie graafmachines met Intelligent Machine Control (iMC) en KOMTRAX telematica. Japanse precisie, sterk in grondverzet.',
        rows: [
          { model: 'PC18MR', weight: '1,8 ton', cw: 'CW05', type: 'Rups' },
          { model: 'PC26MR', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'PC30MR', weight: '3,2 ton', cw: 'CW05', type: 'Rups' },
          { model: 'PC55MR', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'PC88MR', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'PC138US', weight: '14 ton', cw: 'CW20', type: 'Rups' },
          { model: 'PC170LC', weight: '17 ton', cw: 'CW30', type: 'Rups' },
          { model: 'PC210LC', weight: '22 ton', cw: 'CW40', type: 'Rups' },
          { model: 'PC290LC', weight: '29 ton', cw: 'CW40', type: 'Rups' },
          { model: 'PC360LC', weight: '36 ton', cw: 'CW45', type: 'Rups' },
          { model: 'PC490LC', weight: '49 ton', cw: 'CW55', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Komatsu?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Komatsu PC-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Op bestelling gemaakt, korte levertijd uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Komatsu Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  hitachi: {
    name: 'Hitachi',
    slug: 'hitachi',
    shortName: 'Hitachi',
    title: 'Kraanbak voor Hitachi',
    metaTitle: 'Kraanbak voor Hitachi | Graafbakken Hitachi Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Hitachi graafmachine? Structon levert graafbakken passend voor alle Hitachi Zaxis modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak hitachi, graafbak hitachi, slotenbak hitachi, kraanbak ZX210, kraanbak ZX350',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Hitachi graafmachines. Van de compacte ZX17 minigraver tot de zware ZX490 rupskraan.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Hitachi Model',
    modelSelectorSubtitle: 'Zaxis (ZX) reeks. Suffix -5, -6 of -7 geeft de generatie aan',
    modelCategories: [
      {
        title: 'Minigravers (< 10 ton)',
        subtitle: 'CW05 - CW10 snelwissels',
        models: [
          { name: 'ZX19U-5', tonnage: 1.9, cw: 'CW05' },
          { name: 'ZX26U-6', tonnage: 2.7, cw: 'CW05' },
          { name: 'ZX48U-5', tonnage: 4.8, cw: 'CW05' },
          { name: 'ZX55U-6', tonnage: 5.5, cw: 'CW10' },
          { name: 'ZX85US-6', tonnage: 8.5, cw: 'CW10' }
        ]
      },
      {
        title: 'Middenklasse (10-30 ton)',
        subtitle: 'CW30 - CW40 snelwissels',
        models: [
          { name: 'ZX135US-7', tonnage: 15, cw: 'CW30' },
          { name: 'ZX160LC-6', tonnage: 17, cw: 'CW30' },
          { name: 'ZX210LC-6', tonnage: 21, cw: 'CW40' },
          { name: 'ZX250LC-6', tonnage: 25, cw: 'CW40' },
          { name: 'ZX170W-6', tonnage: 17, cw: 'CW30', type: 'wielen' },
          { name: 'ZX190W-6', tonnage: 19, cw: 'CW30', type: 'wielen' }
        ]
      },
      {
        title: 'Zware Klasse (> 30 ton)',
        subtitle: 'CW40 - CW70 snelwissels',
        models: [
          { name: 'ZX300LC-6', tonnage: 30, cw: 'CW40' },
          { name: 'ZX350LC-7', tonnage: 35, cw: 'CW45' },
          { name: 'ZX490LCH-6', tonnage: 49, cw: 'CW55' },
          { name: 'ZX690LCH-7', tonnage: 69, cw: 'CW70' },
          { name: 'EX1200-7', tonnage: 120, cw: 'CW70' }
        ]
      }
    ],
    seoContent: {
      cwTable: {
        title: 'Welke CW-Aansluiting voor Hitachi?',
        description: 'Hitachi produceert graafmachines van ~2 ton tot de allergrootste ter wereld (~800 ton). De Zaxis (ZX) reeks omvat compacte mini\'s tot zware machines. Hieronder de CW-snelwissels:',
        rows: [
          { model: 'ZX19U-5', weight: '1,9 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ZX26U-6', weight: '2,7 ton', cw: 'CW05', type: 'Rups' },
          { model: 'ZX48U-5', weight: '4,8 ton', cw: 'CW05/CW10', type: 'Rups' },
          { model: 'ZX55U-6', weight: '5,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'ZX85US-6', weight: '8,5 ton', cw: 'CW10', type: 'Rups' },
          { model: 'ZX135US-7', weight: '15 ton', cw: 'CW30', type: 'Rups' },
          { model: 'ZX160LC-6', weight: '17 ton', cw: 'CW30', type: 'Rups' },
          { model: 'ZX170W-6', weight: '17 ton', cw: 'CW30', type: 'Banden' },
          { model: 'ZX190W-6', weight: '19 ton', cw: 'CW30', type: 'Banden' },
          { model: 'ZX210LC-6', weight: '21 ton', cw: 'CW40', type: 'Rups' },
          { model: 'ZX250LC-6', weight: '25 ton', cw: 'CW40', type: 'Rups' },
          { model: 'ZX300LC-6', weight: '30 ton', cw: 'CW40', type: 'Rups' },
          { model: 'ZX350LC-7', weight: '35 ton', cw: 'CW45', type: 'Rups' },
          { model: 'ZX490LCH-6', weight: '49 ton', cw: 'CW55', type: 'Rups' },
          { model: 'ZX690LCH-7', weight: '69 ton', cw: 'CW70', type: 'Rups' },
          { model: 'EX1200-7', weight: '120 ton', cw: 'CW70', type: 'Rups' }
        ]
      },
      whyStructon: {
        title: 'Waarom Structon voor Hitachi?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Onze bakken zijn ontworpen voor optimale prestaties met Hitachi machines' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Op bestelling gemaakt, snel leverbaar' },
          { title: 'Maatwerk mogelijk', description: 'Speciale afmetingen op aanvraag' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Hitachi Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  }
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
          { title: 'Snelle levering', description: 'Op bestelling gemaakt, korte levertijd uit België' },
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
  { name: 'Develon', slug: 'develon' },
  { name: 'Case', slug: 'case' },
  { name: 'Caterpillar', slug: 'caterpillar' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Kobelco', slug: 'kobelco' },
  { name: 'Sany', slug: 'sany' },
  { name: 'Wacker Neuson', slug: 'wacker-neuson' }
];
