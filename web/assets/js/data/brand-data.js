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
          { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
          { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' },
          { title: 'Garantie', description: '2 jaar garantie op constructiefouten' }
        ]
      }
    },
    ctaTitle: 'Kraanbak voor Jouw Volvo Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  },

  // Placeholder data voor andere merken - deze kunnen later worden uitgebreid
  komatsu: {
    name: 'Komatsu',
    slug: 'komatsu',
    shortName: 'Komatsu',
    title: 'Kraanbak voor Komatsu',
    metaTitle: 'Kraanbak voor Komatsu | Graafbakken Komatsu Graafmachine | Structon',
    metaDescription: 'Kraanbak voor Komatsu graafmachine? Structon levert graafbakken passend voor alle Komatsu PC modellen. ✓ CW-aansluiting ✓ Hardox staal',
    metaKeywords: 'kraanbak komatsu, graafbak komatsu, PC200, PC300',
    heroDescription: 'Structon levert hoogwaardige kraanbakken passend voor alle Komatsu graafmachines. Van compacte PC30 tot zware PC490.',
    heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
    modelSelectorTitle: 'Zoek op Komatsu Model',
    modelSelectorSubtitle: 'PC-serie graafmachines',
    modelCategories: [],
    seoContent: { cwTable: { title: 'CW-Aansluitingen', description: '', rows: [] }, whyStructon: { title: 'Waarom Structon?', items: [] } },
    ctaTitle: 'Kraanbak voor Jouw Komatsu Nodig?',
    ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
  }
};

// Helper functie om andere merken te genereren met basis data
const otherBrands = ['hitachi', 'liebherr', 'jcb', 'kubota', 'takeuchi', 'yanmar', 'doosan', 'case', 'hyundai', 'kobelco', 'sany', 'wacker-neuson'];

otherBrands.forEach(brand => {
  if (!BRAND_DATA[brand]) {
    const brandName = brand.charAt(0).toUpperCase() + brand.slice(1).replace('-', ' ');
    BRAND_DATA[brand] = {
      name: brandName,
      slug: brand,
      shortName: brandName,
      title: `Kraanbak voor ${brandName}`,
      metaTitle: `Kraanbak voor ${brandName} | Graafbakken ${brandName} Graafmachine | Structon`,
      metaDescription: `Kraanbak voor ${brandName} graafmachine? Structon levert graafbakken passend voor alle ${brandName} modellen. ✓ CW-aansluiting ✓ Hardox staal`,
      metaKeywords: `kraanbak ${brand}, graafbak ${brand}`,
      heroDescription: `Structon levert hoogwaardige kraanbakken passend voor alle ${brandName} graafmachines.`,
      heroImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=600&fit=crop',
      modelSelectorTitle: `Zoek op ${brandName} Model`,
      modelSelectorSubtitle: 'Klik op jouw machinemodel voor passende producten',
      modelCategories: [],
      seoContent: {
        cwTable: { title: 'CW-Aansluitingen', description: '', rows: [] },
        whyStructon: {
          title: 'Waarom Structon?',
          items: [
            { title: 'Perfecte pasvorm', description: `Ontworpen voor optimale prestaties met ${brandName} machines` },
            { title: 'Hardox kwaliteit', description: 'Slijtplaten van Hardox 450 voor maximale levensduur' },
            { title: 'Snelle levering', description: 'Grote voorraad, direct leverbaar uit België' },
            { title: 'Maatwerk', description: 'Speciale afmetingen op aanvraag mogelijk' },
            { title: 'Garantie', description: '2 jaar garantie op constructiefouten' }
          ]
        }
      },
      ctaTitle: `Kraanbak voor Jouw ${brandName} Nodig?`,
      ctaText: 'Neem contact op voor advies of een vrijblijvende offerte.'
    };
  }
});

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
