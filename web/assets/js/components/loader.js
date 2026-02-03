/**
 * Universal Loader Component
 * Herbruikbare loader voor alle dynamische content secties
 */

/**
 * Maak een loader HTML element
 * @param {string} size - 'small', 'medium', 'large' (default: 'medium')
 * @param {string} message - Optioneel bericht onder de loader
 * @returns {string} HTML string van de loader
 */
export function createLoader(size = 'medium', message = '') {
  const sizeClass = `loader-${size}`;
  
  return `
    <div class="structon-loader ${sizeClass}">
      <div class="loader-spinner"></div>
      ${message ? `<p class="loader-message">${message}</p>` : ''}
    </div>
  `;
}

/**
 * Toon loader in een container
 * @param {HTMLElement} container - Container element
 * @param {string} size - 'small', 'medium', 'large'
 * @param {string} message - Optioneel bericht
 */
export function showLoader(container, size = 'medium', message = '') {
  if (!container) return;
  container.innerHTML = createLoader(size, message);
}

/**
 * Verwijder loader uit een container
 * @param {HTMLElement} container - Container element
 */
export function hideLoader(container) {
  if (!container) return;
  const loader = container.querySelector('.structon-loader');
  if (loader) {
    loader.remove();
  }
}

/**
 * Toon inline loader (voor kleinere elementen zoals prijzen)
 * @returns {string} HTML string van inline loader
 */
export function createInlineLoader() {
  return '<span class="loader-inline"><span class="loader-spinner-inline"></span></span>';
}
