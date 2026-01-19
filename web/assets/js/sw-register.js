/**
 * Service Worker Registration
 * Registers the service worker for offline caching
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        // Determine base path for GitHub Pages compatibility
        const basePath = window.location.pathname.includes('/Structon/') ? '/Structon' : '';
        
        const registration = await navigator.serviceWorker.register(`${basePath}/service-worker.js`, {
          scope: `${basePath}/`
        });
        
        console.log('✅ Service Worker registered:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('🔄 New version available! Refresh to update.');
              
              // Optional: Show update notification to user
              showUpdateNotification();
            }
          });
        });

      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    });
  }
}

/**
 * Show update notification (optional)
 */
function showUpdateNotification() {
  // You can implement a toast notification here
  // For now, just log it
  if (confirm('Er is een nieuwe versie beschikbaar. Pagina herladen?')) {
    window.location.reload();
  }
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    console.log('Service Worker unregistered');
  }
}
