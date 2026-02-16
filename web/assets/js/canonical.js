/**
 * Canonical URL Manager
 * Ensures canonical tags are always clean (without query parameters)
 * and correctly point to the current page
 */

(function() {
  'use strict';

  /**
   * Get clean canonical URL (without query parameters or hash)
   */
  function getCleanCanonicalUrl() {
    const url = new URL(window.location.href);
    // Remove query parameters and hash
    return url.origin + url.pathname;
  }

  /**
   * Update or create canonical link tag
   */
  function updateCanonicalTag() {
    const cleanUrl = getCleanCanonicalUrl();
    
    // Find existing canonical tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    
    if (canonicalTag) {
      // Update existing tag
      if (canonicalTag.href !== cleanUrl) {
        canonicalTag.href = cleanUrl;
        console.log('[Canonical] Updated:', cleanUrl);
      }
    } else {
      // Create new canonical tag if it doesn't exist
      canonicalTag = document.createElement('link');
      canonicalTag.rel = 'canonical';
      canonicalTag.href = cleanUrl;
      document.head.appendChild(canonicalTag);
      console.log('[Canonical] Created:', cleanUrl);
    }
  }

  /**
   * Update Open Graph URL meta tag
   */
  function updateOgUrl() {
    const cleanUrl = getCleanCanonicalUrl();
    let ogUrlTag = document.querySelector('meta[property="og:url"]');
    
    if (ogUrlTag) {
      if (ogUrlTag.content !== cleanUrl) {
        ogUrlTag.content = cleanUrl;
        console.log('[OG:URL] Updated:', cleanUrl);
      }
    } else {
      // Create og:url if it doesn't exist
      ogUrlTag = document.createElement('meta');
      ogUrlTag.setAttribute('property', 'og:url');
      ogUrlTag.content = cleanUrl;
      document.head.appendChild(ogUrlTag);
      console.log('[OG:URL] Created:', cleanUrl);
    }
  }

  /**
   * Initialize canonical URL management
   */
  function init() {
    // Update on page load
    updateCanonicalTag();
    updateOgUrl();
    
    // Update on history changes (for SPAs)
    window.addEventListener('popstate', function() {
      updateCanonicalTag();
      updateOgUrl();
    });
    
    // Monitor for dynamic navigation (if using pushState)
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(history, arguments);
      updateCanonicalTag();
      updateOgUrl();
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
      originalReplaceState.apply(history, arguments);
      updateCanonicalTag();
      updateOgUrl();
    };
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
