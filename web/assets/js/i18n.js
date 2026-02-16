/**
 * Structon i18n - Internationalization Helper
 * Provides locale-aware translations for all dynamic UI text
 * Supported locales: be-nl, nl-nl, be-fr, de-de
 */

const SUPPORTED_LOCALES = ['be-nl', 'nl-nl', 'be-fr', 'de-de'];

/**
 * Detect current locale from URL path
 */
export function getCurrentLocale() {
  const path = window.location.pathname;
  for (const locale of SUPPORTED_LOCALES) {
    if (path.includes('/' + locale + '/')) {
      return locale;
    }
  }
  return 'be-nl';
}

/**
 * All UI translations organized by key
 */
const translations = {
  // ============================================================
  // PRODUCT CARDS
  // ============================================================
  inStock: {
    'be-nl': 'Op voorraad', 'nl-nl': 'Op voorraad',
    'be-fr': 'En stock', 'de-de': 'Auf Lager'
  },
  lowStock: {
    'be-nl': 'Nog slechts enkele stuks', 'nl-nl': 'Nog slechts enkele stuks',
    'be-fr': 'Plus que quelques pieces', 'de-de': 'Nur noch wenige Stueck'
  },
  onOrder: {
    'be-nl': 'Op bestelling', 'nl-nl': 'Op bestelling',
    'be-fr': 'Sur commande', 'de-de': 'Auf Bestellung'
  },
  moreInfo: {
    'be-nl': 'Meer info', 'nl-nl': 'Meer info',
    'be-fr': 'Plus d\'infos', 'de-de': 'Mehr Infos'
  },
  priceOnRequest: {
    'be-nl': 'Prijs op aanvraag', 'nl-nl': 'Prijs op aanvraag',
    'be-fr': 'Prix sur demande', 'de-de': 'Preis auf Anfrage'
  },
  exclVat: {
    'be-nl': ',- excl. BTW', 'nl-nl': ',- excl. BTW',
    'be-fr': ',- HTVA', 'de-de': ',- zzgl. MwSt.'
  },
  addToCart: {
    'be-nl': 'In winkelwagen', 'nl-nl': 'In winkelwagen',
    'be-fr': 'Ajouter au panier', 'de-de': 'In den Warenkorb'
  },
  newBadge: {
    'be-nl': 'Nieuw', 'nl-nl': 'Nieuw',
    'be-fr': 'Nouveau', 'de-de': 'Neu'
  },
  defaultDescription: {
    'be-nl': 'Hoogwaardig aanbouwdeel voor uw machine. Robuust en betrouwbaar.',
    'nl-nl': 'Hoogwaardig aanbouwdeel voor uw machine. Robuust en betrouwbaar.',
    'be-fr': 'Accessoire de haute qualite pour votre machine. Robuste et fiable.',
    'de-de': 'Hochwertiges Anbaugeraet fuer Ihre Maschine. Robust und zuverlaessig.'
  },
  addedToCart: {
    'be-nl': 'toegevoegd aan winkelmandje', 'nl-nl': 'toegevoegd aan winkelmandje',
    'be-fr': 'ajoute au panier', 'de-de': 'zum Warenkorb hinzugefuegt'
  },

  // ============================================================
  // PRODUCT SPECS
  // ============================================================
  weight: {
    'be-nl': 'Gewicht', 'nl-nl': 'Gewicht',
    'be-fr': 'Poids', 'de-de': 'Gewicht'
  },
  width: {
    'be-nl': 'Breedte', 'nl-nl': 'Breedte',
    'be-fr': 'Largeur', 'de-de': 'Breite'
  },
  volume: {
    'be-nl': 'Inhoud', 'nl-nl': 'Inhoud',
    'be-fr': 'Contenance', 'de-de': 'Inhalt'
  },
  machineClass: {
    'be-nl': 'Machine klasse', 'nl-nl': 'Machine klasse',
    'be-fr': 'Classe de machine', 'de-de': 'Maschinenklasse'
  },
  attachment: {
    'be-nl': 'Ophanging', 'nl-nl': 'Ophanging',
    'be-fr': 'Fixation', 'de-de': 'Aufhaengung'
  },

  // ============================================================
  // NO RESULTS / ERRORS / LOADING
  // ============================================================
  noResults: {
    'be-nl': 'Geen resultaten', 'nl-nl': 'Geen resultaten',
    'be-fr': 'Aucun resultat', 'de-de': 'Keine Ergebnisse'
  },
  noProductsFound: {
    'be-nl': 'Geen producten gevonden.', 'nl-nl': 'Geen producten gevonden.',
    'be-fr': 'Aucun produit trouve.', 'de-de': 'Keine Produkte gefunden.'
  },
  noProductsWithFilters: {
    'be-nl': 'Geen producten gevonden met de huidige filters.',
    'nl-nl': 'Geen producten gevonden met de huidige filters.',
    'be-fr': 'Aucun produit trouve avec les filtres actuels.',
    'de-de': 'Keine Produkte mit den aktuellen Filtern gefunden.'
  },
  clearFilters: {
    'be-nl': 'Filters wissen', 'nl-nl': 'Filters wissen',
    'be-fr': 'Effacer les filtres', 'de-de': 'Filter loeschen'
  },
  oops: {
    'be-nl': 'Oeps!', 'nl-nl': 'Oeps!',
    'be-fr': 'Oups !', 'de-de': 'Hoppla!'
  },
  errorOccurred: {
    'be-nl': 'Er is een fout opgetreden.', 'nl-nl': 'Er is een fout opgetreden.',
    'be-fr': 'Une erreur s\'est produite.', 'de-de': 'Ein Fehler ist aufgetreten.'
  },
  noProductsAvailable: {
    'be-nl': 'Geen producten beschikbaar', 'nl-nl': 'Geen producten beschikbaar',
    'be-fr': 'Aucun produit disponible', 'de-de': 'Keine Produkte verfuegbar'
  },
  productsLoadError: {
    'be-nl': 'Producten konden niet geladen worden',
    'nl-nl': 'Producten konden niet geladen worden',
    'be-fr': 'Les produits n\'ont pas pu etre charges',
    'de-de': 'Produkte konnten nicht geladen werden'
  },
  relatedProductsLoading: {
    'be-nl': 'Gerelateerde producten laden...', 'nl-nl': 'Gerelateerde producten laden...',
    'be-fr': 'Chargement des produits associes...', 'de-de': 'Verwandte Produkte werden geladen...'
  },
  productNotFound: {
    'be-nl': 'Product niet gevonden', 'nl-nl': 'Product niet gevonden',
    'be-fr': 'Produit introuvable', 'de-de': 'Produkt nicht gefunden'
  },
  productNotFoundDesc: {
    'be-nl': 'Het product dat u zoekt bestaat niet of is niet meer beschikbaar.',
    'nl-nl': 'Het product dat u zoekt bestaat niet of is niet meer beschikbaar.',
    'be-fr': 'Le produit que vous recherchez n\'existe pas ou n\'est plus disponible.',
    'de-de': 'Das gesuchte Produkt existiert nicht oder ist nicht mehr verfuegbar.'
  },
  viewAllProducts: {
    'be-nl': 'Bekijk alle producten', 'nl-nl': 'Bekijk alle producten',
    'be-fr': 'Voir tous les produits', 'de-de': 'Alle Produkte ansehen'
  },
  noDescriptionAvailable: {
    'be-nl': 'Geen omschrijving beschikbaar.', 'nl-nl': 'Geen omschrijving beschikbaar.',
    'be-fr': 'Aucune description disponible.', 'de-de': 'Keine Beschreibung verfuegbar.'
  },
  description: {
    'be-nl': 'Omschrijving', 'nl-nl': 'Omschrijving',
    'be-fr': 'Description', 'de-de': 'Beschreibung'
  },

  // ============================================================
  // PRICING / AUTH
  // ============================================================
  loginForPrice: {
    'be-nl': 'Login voor prijs', 'nl-nl': 'Login voor prijs',
    'be-fr': 'Connectez-vous pour le prix', 'de-de': 'Anmelden fuer Preis'
  },
  loginToViewPrices: {
    'be-nl': 'om prijzen te bekijken en te bestellen.',
    'nl-nl': 'om prijzen te bekijken en te bestellen.',
    'be-fr': 'pour consulter les prix et commander.',
    'de-de': 'um Preise einzusehen und zu bestellen.'
  },
  logIn: {
    'be-nl': 'Log in', 'nl-nl': 'Log in',
    'be-fr': 'Connectez-vous', 'de-de': 'Anmelden'
  },
  contactUs: {
    'be-nl': 'Neem contact op', 'nl-nl': 'Neem contact op',
    'be-fr': 'Contactez-nous', 'de-de': 'Kontaktieren Sie uns'
  },
  contactUsForQuote: {
    'be-nl': 'Neem contact met ons op voor een offerte.',
    'nl-nl': 'Neem contact met ons op voor een offerte.',
    'be-fr': 'Contactez-nous pour un devis.',
    'de-de': 'Kontaktieren Sie uns fuer ein Angebot.'
  },
  contactUsForProduct: {
    'be-nl': 'Neem contact met ons op voor dit product.',
    'nl-nl': 'Neem contact met ons op voor dit product.',
    'be-fr': 'Contactez-nous pour ce produit.',
    'de-de': 'Kontaktieren Sie uns fuer dieses Produkt.'
  },
  requestQuote: {
    'be-nl': 'Offerte Aanvragen', 'nl-nl': 'Offerte Aanvragen',
    'be-fr': 'Demander un devis', 'de-de': 'Angebot anfordern'
  },
  contactAction: {
    'be-nl': 'Contact Opnemen', 'nl-nl': 'Contact Opnemen',
    'be-fr': 'Nous contacter', 'de-de': 'Kontakt aufnehmen'
  },

  // ============================================================
  // FOOTER
  // ============================================================
  footerTagline: {
    'be-nl': 'Specialist in kraanbakken en<br>graafmachine aanbouwdelen.',
    'nl-nl': 'Specialist in kraanbakken en<br>graafmachine aanbouwdelen.',
    'be-fr': 'Specialiste en godets et<br>accessoires pour pelles.',
    'de-de': 'Spezialist fuer Baggerloeffel und<br>Bagger-Anbaugeraete.'
  },
  navLoading: {
    'be-nl': 'Navigatie laden...', 'nl-nl': 'Navigatie laden...',
    'be-fr': 'Chargement de la navigation...', 'de-de': 'Navigation wird geladen...'
  },
  allRightsReserved: {
    'be-nl': 'Alle rechten voorbehouden.', 'nl-nl': 'Alle rechten voorbehouden.',
    'be-fr': 'Tous droits reserves.', 'de-de': 'Alle Rechte vorbehalten.'
  },
  terms: {
    'be-nl': 'Voorwaarden', 'nl-nl': 'Voorwaarden',
    'be-fr': 'Conditions', 'de-de': 'AGB'
  },
  madeBy: {
    'be-nl': 'Gemaakt door', 'nl-nl': 'Gemaakt door',
    'be-fr': 'Realise par', 'de-de': 'Erstellt von'
  },

  // ============================================================
  // SITEMAP
  // ============================================================
  general: {
    'be-nl': 'Algemeen', 'nl-nl': 'Algemeen',
    'be-fr': 'General', 'de-de': 'Allgemein'
  },
  home: {
    'be-nl': 'Home', 'nl-nl': 'Home',
    'be-fr': 'Accueil', 'de-de': 'Startseite'
  },
  aboutUs: {
    'be-nl': 'Over Ons', 'nl-nl': 'Over Ons',
    'be-fr': 'A propos', 'de-de': 'Ueber uns'
  },
  customerLogin: {
    'be-nl': 'Klant Login', 'nl-nl': 'Klant Login',
    'be-fr': 'Connexion client', 'de-de': 'Kunden-Login'
  },
  products: {
    'be-nl': 'Producten', 'nl-nl': 'Producten',
    'be-fr': 'Produits', 'de-de': 'Produkte'
  },
  loading: {
    'be-nl': 'Laden...', 'nl-nl': 'Laden...',
    'be-fr': 'Chargement...', 'de-de': 'Laden...'
  },
  navigation: {
    'be-nl': 'Navigatie', 'nl-nl': 'Navigatie',
    'be-fr': 'Navigation', 'de-de': 'Navigation'
  },
  excavatorBuckets: {
    'be-nl': 'Kraanbakken', 'nl-nl': 'Kraanbakken',
    'be-fr': 'Godets', 'de-de': 'Baggerloeffel'
  },

  // ============================================================
  // HEADER - MOBILE MENU
  // ============================================================
  allProducts: {
    'be-nl': 'Alle Producten', 'nl-nl': 'Alle Producten',
    'be-fr': 'Tous les produits', 'de-de': 'Alle Produkte'
  },
  requestQuoteShort: {
    'be-nl': 'Offerte Aanvragen', 'nl-nl': 'Offerte Aanvragen',
    'be-fr': 'Demander un devis', 'de-de': 'Angebot anfordern'
  },
  productCategories: {
    'be-nl': 'PRODUCTCATEGORIEEN', 'nl-nl': 'PRODUCTCATEGORIEEN',
    'be-fr': 'CATEGORIES DE PRODUITS', 'de-de': 'PRODUKTKATEGORIEN'
  },
  excavatorBucketsMenu: {
    'be-nl': 'Graafbakken', 'nl-nl': 'Graafbakken',
    'be-fr': 'Godets', 'de-de': 'Baggerloeffel'
  },
  trenchBucketsMenu: {
    'be-nl': 'Slotenbakken', 'nl-nl': 'Slotenbakken',
    'be-fr': 'Godets de tranchee', 'de-de': 'Grabenloeffel'
  },
  demolitionGrippersMenu: {
    'be-nl': 'Sloop- en Sorteergrijpers', 'nl-nl': 'Sloop- en Sorteergrijpers',
    'be-fr': 'Pinces de tri et demolition', 'de-de': 'Sortier- und Abbruchgreifer'
  },
  adaptersMenu: {
    'be-nl': 'Adapters', 'nl-nl': 'Adapters',
    'be-fr': 'Adaptateurs', 'de-de': 'Adapter'
  },
  viewAllArrow: {
    'be-nl': 'Bekijk alles', 'nl-nl': 'Bekijk alles',
    'be-fr': 'Voir tout', 'de-de': 'Alles ansehen'
  },
  brands: {
    'be-nl': 'MERKEN', 'nl-nl': 'MERKEN',
    'be-fr': 'MARQUES', 'de-de': 'MARKEN'
  },
  allBrands: {
    'be-nl': 'Alle merken', 'nl-nl': 'Alle merken',
    'be-fr': 'Toutes les marques', 'de-de': 'Alle Marken'
  },
  company: {
    'be-nl': 'BEDRIJF', 'nl-nl': 'BEDRIJF',
    'be-fr': 'ENTREPRISE', 'de-de': 'UNTERNEHMEN'
  },
  about: {
    'be-nl': 'Over Ons', 'nl-nl': 'Over Ons',
    'be-fr': 'A propos', 'de-de': 'Ueber uns'
  },
  loginRegister: {
    'be-nl': 'Inloggen / Registreren', 'nl-nl': 'Inloggen / Registreren',
    'be-fr': 'Connexion / Inscription', 'de-de': 'Anmelden / Registrieren'
  },
  openMenu: {
    'be-nl': 'Menu openen', 'nl-nl': 'Menu openen',
    'be-fr': 'Ouvrir le menu', 'de-de': 'Menue oeffnen'
  },
  closeMenu: {
    'be-nl': 'Menu sluiten', 'nl-nl': 'Menu sluiten',
    'be-fr': 'Fermer le menu', 'de-de': 'Menue schliessen'
  },
  mobileNav: {
    'be-nl': 'Mobiele navigatie', 'nl-nl': 'Mobiele navigatie',
    'be-fr': 'Navigation mobile', 'de-de': 'Mobile Navigation'
  },

  // ============================================================
  // HEADER - ACCOUNT MENU
  // ============================================================
  myAccount: {
    'be-nl': 'Mijn Account', 'nl-nl': 'Mijn Account',
    'be-fr': 'Mon compte', 'de-de': 'Mein Konto'
  },
  customer: {
    'be-nl': 'Klant', 'nl-nl': 'Klant',
    'be-fr': 'Client', 'de-de': 'Kunde'
  },
  manageProducts: {
    'be-nl': 'Producten Beheren', 'nl-nl': 'Producten Beheren',
    'be-fr': 'Gerer les produits', 'de-de': 'Produkte verwalten'
  },
  manageQuotes: {
    'be-nl': 'Offertes Beheren', 'nl-nl': 'Offertes Beheren',
    'be-fr': 'Gerer les devis', 'de-de': 'Angebote verwalten'
  },
  orders: {
    'be-nl': 'Bestellingen', 'nl-nl': 'Bestellingen',
    'be-fr': 'Commandes', 'de-de': 'Bestellungen'
  },
  quotes: {
    'be-nl': 'Offertes', 'nl-nl': 'Offertes',
    'be-fr': 'Devis', 'de-de': 'Angebote'
  },
  profile: {
    'be-nl': 'Profiel', 'nl-nl': 'Profiel',
    'be-fr': 'Profil', 'de-de': 'Profil'
  },
  logout: {
    'be-nl': 'Uitloggen', 'nl-nl': 'Uitloggen',
    'be-fr': 'Deconnexion', 'de-de': 'Abmelden'
  },
  login: {
    'be-nl': 'Inloggen', 'nl-nl': 'Inloggen',
    'be-fr': 'Connexion', 'de-de': 'Anmelden'
  },

  // ============================================================
  // HEADER - MEGA MENU TONNAGE LINKS
  // ============================================================
  trenchBucketsFor: {
    'be-nl': 'Slotenbakken voor kranen van',
    'nl-nl': 'Slotenbakken voor kranen van',
    'be-fr': 'Godets de tranchee pour pelles de',
    'de-de': 'Grabenloeffel fuer Bagger von'
  },
  deepBucketsFor: {
    'be-nl': 'Dieplepelbakken voor kranen van',
    'nl-nl': 'Dieplepelbakken voor kranen van',
    'be-fr': 'Godets de terrassement pour pelles de',
    'de-de': 'Tiefloeffel fuer Bagger von'
  },
  narrowBucketsFor: {
    'be-nl': 'Sleuvenbakken voor kranen van',
    'nl-nl': 'Sleuvenbakken voor kranen van',
    'be-fr': 'Godets etroits pour pelles de',
    'de-de': 'Schlitzloeffel fuer Bagger von'
  },
  tiltBucketsFor: {
    'be-nl': 'Kantelbakken voor kranen van',
    'nl-nl': 'Kantelbakken voor kranen van',
    'be-fr': 'Godets orientables pour pelles de',
    'de-de': 'Schwenkloeffel fuer Bagger von'
  },
  sortingGrippersFor: {
    'be-nl': 'Sorteergrijpers voor kranen van',
    'nl-nl': 'Sorteergrijpers voor kranen van',
    'be-fr': 'Pinces de tri pour pelles de',
    'de-de': 'Sortiergreifer fuer Bagger von'
  },
  demolitionGrippersFor: {
    'be-nl': 'Sloopgrijpers voor kranen van',
    'nl-nl': 'Sloopgrijpers voor kranen van',
    'be-fr': 'Pinces de demolition pour pelles de',
    'de-de': 'Abbruchgreifer fuer Bagger von'
  },
  concreteShearsFor: {
    'be-nl': 'Betonscharen voor kranen van',
    'nl-nl': 'Betonscharen voor kranen van',
    'be-fr': 'Cisailles a beton pour pelles de',
    'de-de': 'Betonscheren fuer Bagger von'
  },
  pulverizersFor: {
    'be-nl': 'Pulverisers voor kranen van',
    'nl-nl': 'Pulverisers voor kranen van',
    'be-fr': 'Pulverisateurs pour pelles de',
    'de-de': 'Pulverisierer fuer Bagger von'
  },

  // ============================================================
  // HEADER - MEGA MENU "OVERIGE" SUB-ITEMS
  // ============================================================
  digTeeth: {
    'be-nl': 'Graaftanden (diverse types)', 'nl-nl': 'Graaftanden (diverse types)',
    'be-fr': 'Dents de godet (divers types)', 'de-de': 'Grabzaehne (verschiedene Typen)'
  },
  wearPlates: {
    'be-nl': 'Slijtplaten Hardox', 'nl-nl': 'Slijtplaten Hardox',
    'be-fr': 'Plaques d\'usure Hardox', 'de-de': 'Verschleissplatten Hardox'
  },
  cuttingEdges: {
    'be-nl': 'Snijkanten', 'nl-nl': 'Snijkanten',
    'be-fr': 'Lames de coupe', 'de-de': 'Schneidkanten'
  },
  hydraulicCylinders: {
    'be-nl': 'Hydraulische cilinders', 'nl-nl': 'Hydraulische cilinders',
    'be-fr': 'Verins hydrauliques', 'de-de': 'Hydraulikzylinder'
  },
  hydraulicHoses: {
    'be-nl': 'Hydraulische slangen', 'nl-nl': 'Hydraulische slangen',
    'be-fr': 'Flexibles hydrauliques', 'de-de': 'Hydraulikschlaeuche'
  },
  quickCouplers: {
    'be-nl': 'Snelkoppelingen', 'nl-nl': 'Snelkoppelingen',
    'be-fr': 'Attaches rapides', 'de-de': 'Schnellkupplungen'
  },
  grease: {
    'be-nl': 'Smeervet', 'nl-nl': 'Smeervet',
    'be-fr': 'Graisse', 'de-de': 'Schmierfett'
  },
  hydraulicOil: {
    'be-nl': 'Hydraulische olie', 'nl-nl': 'Hydraulische olie',
    'be-fr': 'Huile hydraulique', 'de-de': 'Hydraulikoel'
  },
  lubricantSprays: {
    'be-nl': 'Smeersprays', 'nl-nl': 'Smeersprays',
    'be-fr': 'Sprays lubrifiants', 'de-de': 'Schmiersprays'
  },
  liftingEyes: {
    'be-nl': 'Hijsogen', 'nl-nl': 'Hijsogen',
    'be-fr': 'Anneaux de levage', 'de-de': 'Hebeaugen'
  },
  protectiveCaps: {
    'be-nl': 'Beschermkappen', 'nl-nl': 'Beschermkappen',
    'be-fr': 'Capots de protection', 'de-de': 'Schutzkappen'
  },
  assemblyTools: {
    'be-nl': 'Montage gereedschap', 'nl-nl': 'Montage gereedschap',
    'be-fr': 'Outillage de montage', 'de-de': 'Montagewerkzeug'
  }
};

/**
 * Get a translated string for the current locale
 * @param {string} key - Translation key
 * @param {string} [locale] - Override locale (auto-detected if not provided)
 * @returns {string} Translated string
 */
export function t(key, locale) {
  const loc = locale || getCurrentLocale();
  const entry = translations[key];
  if (!entry) {
    console.warn('[i18n] Missing translation key:', key);
    return key;
  }
  return entry[loc] || entry['be-nl'] || key;
}

/**
 * Get all translations as an object for the current locale
 * Useful for passing to template functions
 * @param {string} [locale] - Override locale
 * @returns {Object} All translations for the locale
 */
export function getAllTranslations(locale) {
  const loc = locale || getCurrentLocale();
  const result = {};
  for (const key in translations) {
    result[key] = translations[key][loc] || translations[key]['be-nl'] || key;
  }
  return result;
}
