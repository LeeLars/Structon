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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/caterpillar',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/volvo',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/komatsu',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/hitachi',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
          { title: 'Snelle levering', description: 'Grote voorraad, snel leverbaar' },
          { title: 'Maatwerk mogelijk', description: 'Speciale afmetingen op aanvraag' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Hitachi Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'

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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/liebherr',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/jcb',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/kubota',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/takeuchi',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/yanmar',
    heroImageWidth: 800,
    heroImageHeight: 600,
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

  develon: {
    name: 'Develon',
    slug: 'develon',
    shortName: 'Develon',
    title: 'Kraanbak voor Develon',
    metaTitle: 'Kraanbak voor Develon | Graafbakken Develon/Develon Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Develon/Develon graafmachine? Structon levert graafbakken passend voor alle DX-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak develon, graafbak develon, DX225, DX300, develon',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Develon/Develon graafmachines. Sinds 2023 Develon, zelfde DX-serie. D-ECOPOWER hydrauliek, veel standaarduitrusting. Sterk in verhuurmarkt.',
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/develon',
    heroImageWidth: 800,
    heroImageHeight: 600,
    modelSelectorTitle: 'Zoek op Develon Model',
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
        title: 'Welke CW-Aansluiting voor Develon/Develon?',
        description: 'Develon/Develon - Sinds 2023 Develon, zelfde DX-serie. D-ECOPOWER hydrauliek, veel standaarduitrusting. Sterk in verhuurmarkt.',
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
        title: 'Waarom Structon voor Develon/Develon?',
        items: [
          { title: 'Perfecte pasvorm', description: 'Ontworpen voor optimale prestaties met Develon/Develon DX-serie' },
          { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Develon/Develon Nodig?',
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
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/case',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Hyundai graafmachines. Koreaanse kwaliteit, HX-serie. Moderne machines met veel standaarduitrusting. Sterke prijs/kwaliteit verhouding.',
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/hyundai',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    metaKeywords: 'kraanbak kobelco, graafbak kobelco, SK210, SK350, slotenbak kobelco',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Kobelco graafmachines. Japanse specialist in hydrauliek, SK-serie. Zuinig, krachtig, betrouwbaar. Sterk in zware toepassingen.',
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/kobelco',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
        description: 'Kobelco Japanse specialist in hydrauliek, SK-serie. Bekend om zuinigheid en reduced tail swing modellen. Sterk in stedelijke projecten.',
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
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Sany graafmachines. Chinees wereldmerk, SY-serie. Moderne technologie, scherpe prijs. Groeiend marktaandeel in Europa.',
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/sany',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
    metaDescription: 'Kraanbak voor Wacker Neuson minigraver? Structon levert graafbakken passend voor alle Wacker Neuson ET-serie modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak wacker neuson, graafbak wacker neuson, ET65, ET90, slotenbak wacker neuson',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Wacker Neuson minigravers. Duits-Oostenrijks merk, ET-serie. Compact, wendbaar, zero tail swing. Ideaal voor stedelijke omgevingen.',
    heroImage: 'https://res.cloudinary.com/dchrgzyb4/image/upload/wacker-neuson',
    heroImageWidth: 800,
    heroImageHeight: 600,
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
        description: 'Wacker Neuson Duits/Oostenrijks, compact materieel specialist. ET/EW-serie mini\'s. Dual View cabine, zero tail swing.',
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
