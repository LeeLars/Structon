/**
 * Industry Page Configuration Data
 * Centrale configuratie voor alle industrie pagina's
 */

export const INDUSTRY_DATA = {
  grondwerkers: {
    name: 'Grondwerkers',
    slug: 'grondwerkers',
    title: 'Kraanbakken voor Grondwerkers',
    metaTitle: 'Kraanbakken voor Grondwerkers | Graafbakken Grondverzet | Structon',
    metaDescription: 'Professionele kraanbakken voor grondwerkers en grondverzet. Graafbakken, slotenbakken en rioolbakken voor alle grondwerkzaamheden. ✓ Hardox staal ✓ Alle tonnages ✓ Snelle levering',
    metaKeywords: 'kraanbak grondwerkers, graafbak grondverzet, slotenbak grondwerk, rioolbak grondwerker',
    
    hero: {
      description: 'Als grondwerker heeft u betrouwbaar materiaal nodig dat elke dag presteert. Structon levert robuuste graafbakken, slotenbakken en rioolbakken speciaal geselecteerd voor grondverzet en uitgraafwerk. Belgische kwaliteit met snelle levering.',
      icon: '<path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor grondwerk – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Scherpe prijzen voor professionals.'
    },
    
    tonnageRanges: ['0-2', '2-5', '5-10', '10-15', '15-25', '25-40', '40+'],
    
    bucketTypes: ['graafbakken', 'slotenbakken', 'rioolbakken', 'egalisatiebakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Hardox Kwaliteit',
        description: 'Slijtplaten van Hardox 450 voor maximale levensduur in zware omstandigheden.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Snelle Levering',
        description: 'Grote voorraad, snel leverbaar. Stilstand kost geld, wij begrijpen dat.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Maatwerk Mogelijk',
        description: 'Speciale afmetingen of aanpassingen? Wij produceren op maat.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Belgische Productie',
        description: 'Lokaal geproduceerd met oog voor kwaliteit en service.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Professioneel Grondwerk',
      sections: [
        {
          title: null,
          content: 'Als grondwerker weet u dat de kwaliteit van uw materiaal direct invloed heeft op uw productiviteit en winstgevendheid. Structon levert al jaren kraanbakken aan grondwerkers in heel België en Nederland. Onze bakken zijn ontworpen voor intensief gebruik en gaan langer mee dan standaard bakken.'
        },
        {
          title: 'Welke Kraanbak voor Grondverzet?',
          content: 'Voor algemeen grondverzet adviseren wij een standaard graafbak met Hardox slijtplaten. De breedte hangt af van uw machine en het type werk. Voor sleuven en kabels is een slotenbak de beste keuze. Bij rioolwerk kiest u voor een rioolbak met de juiste bodemradius.'
        },
        {
          title: 'CW-Aansluiting voor Grondwerkmachines',
          content: 'Alle onze bakken zijn leverbaar met de gangbare CW-aansluitingen (CW05, CW10, CW20, CW30, CW40) en S-systemen. Twijfelt u over de juiste aansluiting? Neem contact op met onze specialisten voor persoonlijk advies.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Grondwerk?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  wegenbouw: {
    name: 'Wegenbouw',
    slug: 'wegenbouw',
    title: 'Kraanbakken voor Wegenbouw',
    metaTitle: 'Kraanbakken voor Wegenbouw | Graafbakken Infrastructuur | Structon',
    metaDescription: 'Professionele kraanbakken voor wegenbouw en infrastructuur. Robuuste graafbakken voor bestrating, nutsvoorzieningen en grondwerk. ✓ Hardox staal ✓ Snelle levering',
    metaKeywords: 'kraanbak wegenbouw, graafbak infrastructuur, slotenbak wegenbouw, rioolbak wegenbouw',
    
    hero: {
      description: 'Infrastructuurprojecten vragen om betrouwbaar materiaal dat intensief gebruik aankan. Structon levert robuuste graafbakken, slotenbakken en rioolbakken voor wegenbouw, bestrating en nutsvoorzieningen. Gebouwd voor de zwaarste omstandigheden.',
      icon: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor wegenbouw – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Scherpe prijzen voor aannemers.'
    },
    
    tonnageRanges: ['5-10', '10-15', '15-25', '25-40', '40+'],
    
    bucketTypes: ['graafbakken', 'slotenbakken', 'rioolbakken', 'egalisatiebakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Hardox Kwaliteit',
        description: 'Extra sterke slijtplaten voor intensief gebruik in wegenbouw.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Snelle Levering',
        description: 'Planning is alles. Wij leveren op tijd, elke keer.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Projectondersteuning',
        description: 'Technisch advies en ondersteuning gedurende uw project.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Betrouwbare Partner',
        description: 'Jarenlange ervaring met grote infrastructuurprojecten.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Wegenbouw en Infrastructuur',
      sections: [
        {
          title: null,
          content: 'Wegenbouwprojecten stellen hoge eisen aan uw materiaal. Structon levert kraanbakken die bestand zijn tegen intensief gebruik en zware omstandigheden. Onze bakken worden ingezet bij grote infrastructuurprojecten in heel België.'
        },
        {
          title: 'Welke Kraanbak voor Wegenbouw?',
          content: 'Voor wegenbouwprojecten adviseren wij graafbakken met extra sterke slijtplaten. Voor nutsvoorzieningen zijn slotenbakken en rioolbakken essentieel. De keuze hangt af van het specifieke project en de grondsoort.'
        },
        {
          title: 'Geschikt voor Alle Machines',
          content: 'Onze bakken zijn compatibel met alle gangbare merken graafmachines. Van Caterpillar tot Volvo, van Komatsu tot Hitachi. Alle CW-aansluitingen leverbaar.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Wegenbouwproject?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  tuinaanleggers: {
    name: 'Tuinaanleggers',
    slug: 'tuinaanleggers',
    title: 'Kraanbakken voor Tuinaanleggers',
    metaTitle: 'Kraanbakken voor Tuinaanleggers | Graafbakken Tuinaanleg | Structon',
    metaDescription: 'Compacte kraanbakken voor tuinaanleggers. Graafbakken en slotenbakken voor minigravers en kleine machines. ✓ Precisiewerk ✓ Snelle levering',
    metaKeywords: 'kraanbak tuinaanlegger, graafbak tuinaanleg, minigraver bak, slotenbak tuin',
    
    hero: {
      description: 'Tuinaanleg vraagt om precisie en compacte afmetingen. Structon levert graafbakken en slotenbakken speciaal voor minigravers en compacte machines. Perfect voor tuinen, parken en groenaanleg.',
      icon: '<path d="M12 22v-5M12 7V2M5 12H2M22 12h-3M17 17l-5-5M17 7l-5 5M7 17l5-5M7 7l5 5"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor tuinaanleg – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies voor compacte machines. Scherpe prijzen voor hoveniers.'
    },
    
    tonnageRanges: ['0-2', '2-5', '5-10'],
    
    bucketTypes: ['graafbakken', 'slotenbakken', 'egalisatiebakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Compacte Afmetingen',
        description: 'Speciaal ontworpen voor minigravers en kleine machines.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Precisiewerk',
        description: 'Scherpe snijkanten voor nauwkeurig graven en afwerken.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Licht Gewicht',
        description: 'Optimaal gewicht voor kleine machines zonder verlies van sterkte.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Snelle Levering',
        description: 'Grote voorraad minigraver bakken direct leverbaar.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Professionele Tuinaanleg',
      sections: [
        {
          title: null,
          content: 'Tuinaanleggers werken vaak met compacte machines in krappe ruimtes. Structon levert graafbakken en slotenbakken speciaal ontworpen voor minigravers van 1 tot 10 ton. Perfecte balans tussen gewicht en sterkte.'
        },
        {
          title: 'Welke Kraanbak voor Tuinaanleg?',
          content: 'Voor algemene tuinwerkzaamheden adviseren wij een compacte graafbak van 30-60cm breed. Voor drainage en kabels is een smalle slotenbak ideaal. Egalisatiebakken zijn perfect voor het afwerken van gazons en paden.'
        },
        {
          title: 'Geschikt voor Alle Minigravers',
          content: 'Onze bakken passen op alle gangbare minigraver merken: Kubota, Takeuchi, Yanmar, Bobcat en meer. CW05 en CW10 aansluitingen standaard leverbaar.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Tuinproject?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  'afbraak-sloop': {
    name: 'Afbraak & Sloop',
    slug: 'afbraak-sloop',
    title: 'Kraanbakken voor Afbraak & Sloop',
    metaTitle: 'Kraanbakken voor Afbraak & Sloop | Sloopbakken | Structon',
    metaDescription: 'Extra sterke kraanbakken voor afbraak en sloopwerk. Robuuste graafbakken met versterkte constructie. ✓ Hardox 500 ✓ Zwaar gebruik',
    metaKeywords: 'kraanbak afbraak, sloopbak, graafbak sloop, versterkte kraanbak',
    
    hero: {
      description: 'Sloopwerk vraagt om het zwaarste materiaal. Structon levert extra versterkte graafbakken speciaal voor afbraak en sloopwerkzaamheden. Gebouwd om te overleven in de zwaarste omstandigheden.',
      icon: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor sloopwerk – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Extra sterke bakken voor zwaar werk.'
    },
    
    tonnageRanges: ['10-15', '15-25', '25-40', '40+'],
    
    bucketTypes: ['graafbakken', 'sloopbakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Extra Versterkt',
        description: 'Hardox 500 slijtplaten en versterkte constructie voor sloopwerk.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Extreme Duurzaamheid',
        description: 'Gebouwd om te overleven in de zwaarste omstandigheden.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Maatwerk Mogelijk',
        description: 'Speciale versterkingen op aanvraag mogelijk.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Sloopervaring',
        description: 'Jarenlange ervaring met sloopbedrijven in België.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Professioneel Sloopwerk',
      sections: [
        {
          title: null,
          content: 'Sloopwerk stelt extreme eisen aan uw materiaal. Structon levert extra versterkte graafbakken met Hardox 500 slijtplaten en versterkte constructie. Onze sloopbakken gaan langer mee en besparen u downtime en kosten.'
        },
        {
          title: 'Welke Kraanbak voor Sloopwerk?',
          content: 'Voor sloopwerk adviseren wij graafbakken met extra dikke slijtplaten (12-15mm) en versterkte zijwangen. Tanden zijn optioneel, vaak werkt men met een rechte snijkant voor meer kracht.'
        },
        {
          title: 'Geschikt voor Zware Machines',
          content: 'Onze sloopbakken zijn geschikt voor machines vanaf 15 ton. CW30, CW40, CW45 en CW55 aansluitingen leverbaar. Ook S-systemen mogelijk.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Sloopproject?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  verhuur: {
    name: 'Verhuur',
    slug: 'verhuur',
    title: 'Kraanbakken voor Verhuur',
    metaTitle: 'Kraanbakken voor Verhuur | Graafbakken Verhuurbedrijven | Structon',
    metaDescription: 'Robuuste kraanbakken voor verhuurbedrijven. Betrouwbaar materiaal met lange levensduur. ✓ Hardox staal ✓ Scherpe prijzen ✓ Grote volumes',
    metaKeywords: 'kraanbak verhuur, graafbak verhuur, verhuurbak, kraanbak verhuurbedrijf',
    
    hero: {
      description: 'Verhuurbedrijven hebben betrouwbaar materiaal nodig dat intensief gebruik aankan. Structon levert robuuste kraanbakken met lange levensduur tegen scherpe prijzen. Perfect voor uw verhuurvloot.',
      icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor verhuur – binnen 24u antwoord',
      subtitle: 'Scherpe prijzen voor grote volumes. Betrouwbaar materiaal voor uw vloot.'
    },
    
    tonnageRanges: ['0-2', '2-5', '5-10', '10-15', '15-25', '25-40'],
    
    bucketTypes: ['graafbakken', 'slotenbakken', 'rioolbakken', 'egalisatiebakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Lange Levensduur',
        description: 'Hardox 450 slijtplaten voor maximale levensduur bij intensief gebruik.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Scherpe Prijzen',
        description: 'Volumekortingen voor verhuurbedrijven. Vraag naar onze tarieven.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Snelle Levering',
        description: 'Grote voorraad, snel leverbaar. Ook voor grote orders.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Verhuurervaring',
        description: 'Jarenlange samenwerking met verhuurbedrijven in België.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Verhuurbedrijven',
      sections: [
        {
          title: null,
          content: 'Verhuurbedrijven hebben materiaal nodig dat betrouwbaar is en lang meegaat. Structon levert kraanbakken speciaal voor verhuur: robuust, onderhoudsarm en met lange levensduur. Wij begrijpen de eisen van de verhuurmarkt.'
        },
        {
          title: 'Waarom Structon voor Verhuur?',
          content: 'Onze bakken zijn ontworpen voor intensief gebruik door verschillende operators. Sterke constructie, Hardox slijtplaten en eenvoudig onderhoud. Volumekortingen beschikbaar voor grote orders.'
        },
        {
          title: 'Alle Tonnages Leverbaar',
          content: 'Van minigraver bakken (CW05) tot zware graafmachine bakken (CW55). Wij leveren het complete assortiment voor uw verhuurvloot. Alle gangbare merken en aansluitingen.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbakken Nodig voor Uw Verhuurvloot?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  recycling: {
    name: 'Recycling',
    slug: 'recycling',
    title: 'Kraanbakken voor Recycling',
    metaTitle: 'Kraanbakken voor Recycling | Graafbakken Recyclingbedrijven | Structon',
    metaDescription: 'Sterke kraanbakken voor recycling en afvalverwerking. Robuuste graafbakken voor zwaar materiaal. ✓ Hardox staal ✓ Slijtvast',
    metaKeywords: 'kraanbak recycling, graafbak recycling, sorteer bak, afvalverwerking bak',
    
    hero: {
      description: 'Recycling en afvalverwerking vraagt om slijtvast materiaal. Structon levert robuuste graafbakken speciaal voor recyclingbedrijven. Bestand tegen zwaar en scherp materiaal.',
      icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor recycling – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Slijtvast materiaal voor zwaar werk.'
    },
    
    tonnageRanges: ['10-15', '15-25', '25-40', '40+'],
    
    bucketTypes: ['graafbakken', 'sorteerbakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Extra Slijtvast',
        description: 'Hardox 500 slijtplaten voor maximale levensduur bij recycling.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Sterke Constructie',
        description: 'Versterkte zijwangen en bodem voor zwaar materiaal.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Maatwerk Mogelijk',
        description: 'Speciale afmetingen voor uw specifieke toepassing.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Recycling Expertise',
        description: 'Ervaring met recyclingbedrijven in België en Nederland.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Recycling en Afvalverwerking',
      sections: [
        {
          title: null,
          content: 'Recyclingbedrijven werken met zwaar en vaak scherp materiaal. Structon levert extra slijtvaste graafbakken met Hardox 500 slijtplaten. Onze bakken zijn speciaal ontworpen voor de recycling sector.'
        },
        {
          title: 'Welke Kraanbak voor Recycling?',
          content: 'Voor recycling adviseren wij graafbakken met extra dikke slijtplaten (12-15mm) en versterkte constructie. Afhankelijk van het materiaal kunnen we de bak aanpassen met extra versterkingen.'
        },
        {
          title: 'Geschikt voor Zware Machines',
          content: 'Onze recycling bakken zijn geschikt voor machines vanaf 15 ton. CW30, CW40, CW45 en CW55 aansluitingen leverbaar.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Recyclingbedrijf?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  baggerwerken: {
    name: 'Baggerwerken',
    slug: 'baggerwerken',
    title: 'Kraanbakken voor Baggerwerken',
    metaTitle: 'Kraanbakken voor Baggerwerken | Baggerbakken | Structon',
    metaDescription: 'Speciale kraanbakken voor baggerwerken. Waterdichte baggerbakken voor natte grond. ✓ Hardox staal ✓ Waterdicht',
    metaKeywords: 'kraanbak baggerwerk, baggerbak, graafbak baggeren, waterdichte bak',
    
    hero: {
      description: 'Baggerwerken vraagt om speciaal materiaal. Structon levert baggerbakken en graafbakken speciaal voor werk in en rond water. Waterdichte constructie en optimale vorm voor baggeren.',
      icon: '<path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor baggerwerk – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Waterdichte bakken voor natte grond.'
    },
    
    tonnageRanges: ['5-10', '10-15', '15-25', '25-40', '40+'],
    
    bucketTypes: ['baggerbakken', 'graafbakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Waterdichte Constructie',
        description: 'Speciaal gelaste naden voor werk in en rond water.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Optimale Vorm',
        description: 'Ontworpen voor maximale capaciteit en minimale weerstand.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Maatwerk Mogelijk',
        description: 'Speciale afmetingen voor uw specifieke baggerwerk.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Bagger Expertise',
        description: 'Ervaring met baggerbedrijven in België en Nederland.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Professioneel Baggerwerk',
      sections: [
        {
          title: null,
          content: 'Baggerwerken stelt specifieke eisen aan uw materiaal. Structon levert baggerbakken met waterdichte constructie en optimale vorm voor werk in en rond water. Onze bakken zijn speciaal ontworpen voor de bagger sector.'
        },
        {
          title: 'Welke Kraanbak voor Baggerwerk?',
          content: 'Voor baggerwerk adviseren wij speciale baggerbakken met waterdichte constructie en extra capaciteit. De vorm is geoptimaliseerd voor minimale weerstand en maximale inhoud.'
        },
        {
          title: 'Geschikt voor Alle Machines',
          content: 'Onze baggerbakken zijn geschikt voor machines vanaf 5 ton. CW10, CW20, CW30, CW40 en CW45 aansluitingen leverbaar.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Baggerwerk?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  },

  'loonwerk-landbouw': {
    name: 'Loonwerk & Landbouw',
    slug: 'loonwerk-landbouw',
    title: 'Kraanbakken voor Loonwerk & Landbouw',
    metaTitle: 'Kraanbakken voor Loonwerk & Landbouw | Graafbakken Loonwerker | Structon',
    metaDescription: 'Veelzijdige kraanbakken voor loonwerk en landbouw. Graafbakken voor drainage, sloten en grondwerk. ✓ Hardox staal ✓ Scherpe prijzen',
    metaKeywords: 'kraanbak loonwerk, graafbak landbouw, slotenbak drainage, kraanbak loonwerker',
    
    hero: {
      description: 'Loonwerkers en landbouwbedrijven hebben veelzijdig materiaal nodig. Structon levert robuuste graafbakken en slotenbakken voor drainage, sloten en algemeen grondwerk. Betrouwbaar en betaalbaar.',
      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
    },
    
    ctaBanner: {
      title: 'Vraag een offerte aan voor loonwerk – binnen 24u antwoord',
      subtitle: 'Persoonlijk advies van onze specialisten. Scherpe prijzen voor loonwerkers.'
    },
    
    tonnageRanges: ['2-5', '5-10', '10-15', '15-25'],
    
    bucketTypes: ['graafbakken', 'slotenbakken', 'egalisatiebakken'],
    
    benefits: [
      {
        icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
        title: 'Veelzijdig Inzetbaar',
        description: 'Geschikt voor drainage, sloten, grondwerk en meer.'
      },
      {
        icon: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
        title: 'Scherpe Prijzen',
        description: 'Goede prijs-kwaliteit verhouding voor loonwerkers.'
      },
      {
        icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        title: 'Snelle Levering',
        description: 'Grote voorraad, snel leverbaar. Ook in drukke seizoenen.'
      },
      {
        icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
        title: 'Landbouw Expertise',
        description: 'Ervaring met loonwerkers en landbouwbedrijven.'
      }
    ],
    
    seoContent: {
      mainTitle: 'Kraanbakken voor Loonwerk en Landbouw',
      sections: [
        {
          title: null,
          content: 'Loonwerkers en landbouwbedrijven hebben betrouwbaar materiaal nodig tegen een scherpe prijs. Structon levert kraanbakken speciaal voor de agrarische sector: robuust, veelzijdig en betaalbaar.'
        },
        {
          title: 'Welke Kraanbak voor Loonwerk?',
          content: 'Voor drainage en sloten adviseren wij slotenbakken van 30-60cm breed. Voor algemeen grondwerk zijn standaard graafbakken ideaal. Egalisatiebakken zijn perfect voor het afwerken van percelen.'
        },
        {
          title: 'Geschikt voor Alle Machines',
          content: 'Onze bakken passen op alle gangbare merken: Kubota, Yanmar, Case, New Holland en meer. CW05, CW10, CW20 en CW30 aansluitingen leverbaar.'
        }
      ]
    },
    
    ctaFooter: {
      title: 'Kraanbak Nodig voor Uw Loonbedrijf?',
      text: 'Vraag vandaag nog een vrijblijvende offerte aan. Binnen 24 uur ontvangt u ons antwoord.'
    }
  }
};

// Lijst van alle industrieën voor cross-linking
export const ALL_INDUSTRIES = [
  { name: 'Grondwerkers', slug: 'grondwerkers' },
  { name: 'Wegenbouw', slug: 'wegenbouw' },
  { name: 'Tuinaanleggers', slug: 'tuinaanleggers' },
  { name: 'Afbraak & Sloop', slug: 'afbraak-sloop' },
  { name: 'Verhuur', slug: 'verhuur' },
  { name: 'Recycling', slug: 'recycling' },
  { name: 'Baggerwerken', slug: 'baggerwerken' },
  { name: 'Loonwerk & Landbouw', slug: 'loonwerk-landbouw' }
];

// Helper functie om industrie data op te halen
export function getIndustryData(slug) {
  return INDUSTRY_DATA[slug] || null;
}

// Helper functie om gerelateerde industrieën op te halen (exclusief huidige)
export function getRelatedIndustries(currentSlug) {
  return ALL_INDUSTRIES.filter(industry => industry.slug !== currentSlug);
}
