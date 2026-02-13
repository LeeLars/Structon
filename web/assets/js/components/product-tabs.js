/**
 * Product Tabs Component
 * Handles tab switching on product detail pages
 */
document.addEventListener('DOMContentLoaded', function() {
  const tabs = document.querySelectorAll('.product-tab');
  const contents = document.querySelectorAll('.product-tab-content');

  if (!tabs.length) return;

  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      const target = this.getAttribute('data-tab');

      // Remove active from all tabs and contents
      tabs.forEach(function(t) { t.classList.remove('active'); });
      contents.forEach(function(c) { c.classList.remove('active'); });

      // Activate clicked tab and matching content
      this.classList.add('active');
      var targetContent = document.getElementById('tab-' + target);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
});
