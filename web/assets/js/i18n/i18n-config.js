/**
 * Structon i18n Configuration
 * Multilanguage support for Benelux region
 */

const I18N_CONFIG = {
  // Supported locales
  locales: ['be-nl', 'nl-nl', 'be-fr', 'de-de'],
  
  // Default locale (fallback)
  defaultLocale: 'be-nl',
  
  // Locale metadata
  localeData: {
    'be-nl': { lang: 'nl', region: 'BE', name: 'Nederlands', flag: '🇧🇪', hreflang: 'nl-BE' },
    'nl-nl': { lang: 'nl', region: 'NL', name: 'Nederlands', flag: '🇳🇱', hreflang: 'nl-NL' },
    'be-fr': { lang: 'fr', region: 'BE', name: 'Français', flag: '🇧🇪', hreflang: 'fr-BE' },
    'de-de': { lang: 'de', region: 'DE', name: 'Deutsch', flag: '🇩🇪', hreflang: 'de-DE' }
  },
  
  // Browser language to locale mapping
  languageMapping: {
    'nl-be': 'be-nl',
    'nl-nl': 'nl-nl',
    'nl': 'be-nl',      // Default Dutch to Belgium
    'fr-be': 'be-fr',
    'fr-lu': 'be-fr',
    'fr': 'be-fr',      // Default French to Belgium
    'de-de': 'de-de',
    'de-at': 'de-de',
    'de-lu': 'de-de',
    'de': 'de-de',
    'en': 'be-nl'       // English speakers get Dutch Belgium (most content)
  },
  
  // Storage key for user preference
  storageKey: 'structon_locale'
};

/**
 * Get current locale from URL path
 * @returns {string} Current locale or null if not in locale path
 */
function getCurrentLocale() {
  const path = window.location.pathname;
  const localePattern = new RegExp(`^/(?:Structon/)?(${I18N_CONFIG.locales.join('|')})/`);
  const match = path.match(localePattern);
  return match ? match[1] : null;
}

/**
 * Get user's preferred locale from storage
 * @returns {string|null} Stored locale preference
 */
function getStoredLocale() {
  try {
    const stored = localStorage.getItem(I18N_CONFIG.storageKey);
    if (stored && I18N_CONFIG.locales.includes(stored)) {
      return stored;
    }
  } catch (e) {
    // localStorage not available
  }
  return null;
}

/**
 * Save user's locale preference
 * @param {string} locale - Locale to save
 */
function setStoredLocale(locale) {
  try {
    if (I18N_CONFIG.locales.includes(locale)) {
      localStorage.setItem(I18N_CONFIG.storageKey, locale);
    }
  } catch (e) {
    // localStorage not available
  }
}

/**
 * Detect best locale from browser settings
 * @returns {string} Detected locale
 */
function detectBrowserLocale() {
  const languages = navigator.languages || [navigator.language || navigator.userLanguage];
  
  for (const lang of languages) {
    const langLower = lang.toLowerCase();
    
    // Try exact match first
    if (I18N_CONFIG.languageMapping[langLower]) {
      return I18N_CONFIG.languageMapping[langLower];
    }
    
    // Try language without region
    const langOnly = langLower.split('-')[0];
    if (I18N_CONFIG.languageMapping[langOnly]) {
      return I18N_CONFIG.languageMapping[langOnly];
    }
  }
  
  return I18N_CONFIG.defaultLocale;
}

/**
 * Get the best locale for the user
 * Priority: 1. URL, 2. Stored preference, 3. Browser detection, 4. Default
 * @returns {string} Best locale
 */
function getBestLocale() {
  // 1. Check URL
  const urlLocale = getCurrentLocale();
  if (urlLocale) return urlLocale;
  
  // 2. Check stored preference
  const storedLocale = getStoredLocale();
  if (storedLocale) return storedLocale;
  
  // 3. Detect from browser
  return detectBrowserLocale();
}

/**
 * Get base path for current environment (handles GitHub Pages /Structon/ prefix)
 * @returns {string} Base path
 */
function getBasePath() {
  const path = window.location.pathname;
  // Check if we're on GitHub Pages with /Structon/ prefix
  if (path.startsWith('/Structon/')) {
    return '/Structon/';
  }
  return '/';
}

/**
 * Get locale-aware path for a page
 * @param {string} page - Page path (e.g., 'contact/', 'producten/')
 * @param {string} [locale] - Target locale (defaults to current)
 * @returns {string} Full locale-aware path
 */
function getLocalePath(page, locale) {
  const targetLocale = locale || getCurrentLocale() || getBestLocale();
  const basePath = getBasePath();
  
  // Remove leading slash from page if present
  const cleanPage = page.startsWith('/') ? page.slice(1) : page;
  
  return `${basePath}${targetLocale}/${cleanPage}`;
}

/**
 * Get path to switch to a different locale (same page)
 * @param {string} targetLocale - Target locale
 * @returns {string} Path to same page in target locale
 */
function getSwitchLocalePath(targetLocale) {
  const currentLocale = getCurrentLocale();
  const path = window.location.pathname;
  const basePath = getBasePath();
  
  if (currentLocale) {
    // Replace current locale with target
    const pagePath = path.replace(new RegExp(`^${basePath}${currentLocale}/`), '');
    return `${basePath}${targetLocale}/${pagePath}`;
  }
  
  // No current locale, just go to target locale root
  return `${basePath}${targetLocale}/`;
}

/**
 * Redirect to the appropriate locale
 * Used on root page for automatic language detection
 */
function redirectToLocale() {
  const bestLocale = getBestLocale();
  const basePath = getBasePath();
  const targetUrl = `${basePath}${bestLocale}/`;
  
  // Save the detected/chosen locale
  setStoredLocale(bestLocale);
  
  // Redirect
  window.location.replace(targetUrl);
}

/**
 * Load translations for current locale
 * @returns {Promise<Object>} Translation object
 */
async function loadTranslations(locale) {
  const targetLocale = locale || getCurrentLocale() || I18N_CONFIG.defaultLocale;
  const basePath = getBasePath();
  
  try {
    const response = await fetch(`${basePath}_i18n/${targetLocale}.json`);
    if (!response.ok) throw new Error('Translation file not found');
    return await response.json();
  } catch (e) {
    console.warn(`Failed to load translations for ${targetLocale}, falling back to default`);
    try {
      const response = await fetch(`${basePath}_i18n/${I18N_CONFIG.defaultLocale}.json`);
      return await response.json();
    } catch (e2) {
      console.error('Failed to load any translations');
      return {};
    }
  }
}

/**
 * Get a translation by key path (e.g., 'nav.home')
 * @param {Object} translations - Translation object
 * @param {string} keyPath - Dot-separated key path
 * @param {string} [fallback] - Fallback value if key not found
 * @returns {string} Translated string
 */
function t(translations, keyPath, fallback = '') {
  const keys = keyPath.split('.');
  let value = translations;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return fallback || keyPath;
    }
  }
  
  return typeof value === 'string' ? value : fallback || keyPath;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
  window.I18N_CONFIG = I18N_CONFIG;
  window.i18n = {
    getCurrentLocale,
    getStoredLocale,
    setStoredLocale,
    detectBrowserLocale,
    getBestLocale,
    getBasePath,
    getLocalePath,
    getSwitchLocalePath,
    redirectToLocale,
    loadTranslations,
    t
  };
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    I18N_CONFIG,
    getCurrentLocale,
    getStoredLocale,
    setStoredLocale,
    detectBrowserLocale,
    getBestLocale,
    getBasePath,
    getLocalePath,
    getSwitchLocalePath,
    redirectToLocale,
    loadTranslations,
    t
  };
}
