/**
 * Product Tabs Component
 * Handles tab switching on product detail pages.
 * Uses data-tab attribute on buttons and matching tab-panel IDs.
 */
(function() {
  'use strict';

  function initProductTabs() {
    const tabButtons = document.querySelectorAll('.product-tab');
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (!tabButtons.length || !tabPanels.length) return;

    tabButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const targetTab = this.getAttribute('data-tab');

        // Deactivate all tabs
        tabButtons.forEach(function(btn) {
          btn.classList.remove('active');
        });

        // Deactivate all panels
        tabPanels.forEach(function(panel) {
          panel.classList.remove('active');
        });

        // Activate clicked tab
        this.classList.add('active');

        // Activate matching panel
        var targetPanel = document.getElementById('tab-' + targetTab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductTabs);
  } else {
    initProductTabs();
  }
})();
