/**
 * Service Worker for Structon Website
 * Provides offline caching and performance improvements
 * Optimized for fast loading and offline support
 */

const CACHE_VERSION = 'structon-v7';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Static assets to cache immediately (critical path)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/global.css',
  '/assets/css/fonts.css',
  '/assets/js/main.js',
  '/assets/images/static/logo.svg',
  '/assets/images/static/favicon.svg'
];

// Cache size limits
const CACHE_LIMITS = {
  [DYNAMIC_CACHE]: 50,
  [API_CACHE]: 50,
  [IMAGE_CACHE]: 100
};

// API endpoints that should be cached longer
const LONG_CACHE_API = ['/products', '/categories', '/brands', '/navigation'];

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key.startsWith('structon-') && key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== API_CACHE)
            .map((key) => {
              console.log('[SW] Deleting old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * Fetch event - serve from cache, fallback to network
 * Optimized with stale-while-revalidate for better UX
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - stale-while-revalidate for better UX
  if (url.pathname.startsWith('/api/')) {
    // Check if it's a cacheable API endpoint
    const isLongCache = LONG_CACHE_API.some(ep => url.pathname.includes(ep));
    if (isLongCache) {
      event.respondWith(staleWhileRevalidate(request, API_CACHE));
    } else {
      event.respondWith(networkFirstStrategy(request, API_CACHE));
    }
    return;
  }

  // Fonts - cache first (they rarely change)
  if (request.destination === 'font') {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // CSS and JS - network first (to ensure updates are visible)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    url.pathname.includes('/assets/css/') ||
    url.pathname.includes('/assets/js/')
  ) {
    event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Images - cache first with dedicated image cache
  if (request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // HTML pages - stale-while-revalidate for fast loads
  if (request.destination === 'document') {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Default: network first
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

/**
 * Cache first strategy
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName);
    }

    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first strategy failed:', error);
    
    // Return offline page for HTML requests
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/offline.html') || new Response('Offline', { status: 503 });
    }
    
    throw error;
  }
}

/**
 * Network first strategy
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      await limitCacheSize(cacheName);
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for HTML requests
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      return cache.match('/offline.html') || new Response('Offline', { status: 503 });
    }

    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 * Returns cached response immediately, then updates cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request)
    .then(async (networkResponse) => {
      if (networkResponse.ok) {
        await cache.put(request, networkResponse.clone());
        await limitCacheSize(cacheName);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Background fetch failed:', error.message);
      return null;
    });

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for network
  const networkResponse = await fetchPromise;
  if (networkResponse) {
    return networkResponse;
  }

  // Fallback for HTML
  if (request.destination === 'document') {
    return new Response('Offline', { status: 503 });
  }

  throw new Error('No cached response and network failed');
}

/**
 * Limit cache size
 */
async function limitCacheSize(cacheName) {
  const limit = CACHE_LIMITS[cacheName];
  
  if (!limit) return;

  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length > limit) {
    // Delete oldest entries
    const deleteCount = keys.length - limit;
    for (let i = 0; i < deleteCount; i++) {
      await cache.delete(keys[i]);
    }
  }
}

/**
 * Background sync for offline actions (future feature)
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

async function syncOrders() {
  // Placeholder for syncing offline orders
  console.log('[SW] Syncing offline orders...');
}
