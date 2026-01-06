/**
 * Structon Account Favorites Page
 */

import { products } from '../api/client.js';
import { checkAuth, getUser, logout } from '../auth.js';

let currentUser = null;
let favorites = [];

async function initFavoritesPage() {
  const user = await checkAuth();
  
  if (!user) {
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  updateUserInfo();
  await loadFavorites();
  setupEventListeners();
  setupMobileSidebar();
}

function updateUserInfo() {
  const avatarEl = document.getElementById('user-avatar');
  const nameEl = document.getElementById('user-name');
  const emailEl = document.getElementById('user-email');
  
  if (currentUser) {
    const initials = currentUser.email.substring(0, 2).toUpperCase();
    if (avatarEl) avatarEl.textContent = initials;
    if (nameEl) nameEl.textContent = currentUser.company_name || currentUser.email.split('@')[0];
    if (emailEl) emailEl.textContent = currentUser.email;
  }
}

async function loadFavorites() {
  try {
    const stored = localStorage.getItem('structon_favorites');
    const favoriteIds = stored ? JSON.parse(stored) : [];
    
    if (favoriteIds.length === 0) {
      renderFavorites([]);
      return;
    }
    
    // Load product details for each favorite
    const productPromises = favoriteIds.map(id => 
      products.getById(id).catch(() => null)
    );
    
    const results = await Promise.all(productPromises);
    favorites = results.filter(p => p && p.product).map(p => p.product);
    
    renderFavorites(favorites);
  } catch (error) {
    console.error('Error loading favorites:', error);
    renderFavorites([]);
  }
}

function renderFavorites(items) {
  const grid = document.getElementById('favorites-grid');
  const emptyState = document.getElementById('favorites-empty');
  
  if (items.length === 0) {
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (grid) {
    grid.style.display = 'grid';
    grid.innerHTML = items.map(product => `
      <div class="favorite-card" data-id="${product.id}">
        <div class="favorite-card-image">
          ${product.cloudinary_images && product.cloudinary_images[0] 
            ? `<img src="${product.cloudinary_images[0].url}" alt="${escapeHtml(product.title)}">`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1" width="64" height="64"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`
          }
        </div>
        <div class="favorite-card-body">
          <h3 class="favorite-card-title">${escapeHtml(product.title)}</h3>
          <div class="favorite-card-meta">
            ${product.category_title || ''} ${product.excavator_weight_min && product.excavator_weight_max ? `• ${product.excavator_weight_min}-${product.excavator_weight_max} ton` : ''}
          </div>
          <div class="favorite-card-actions">
            <a href="../pages/product.html?id=${product.slug || product.id}" class="btn-dashboard btn-dashboard-primary btn-dashboard-sm">Bekijk</a>
            <button class="btn-dashboard btn-dashboard-secondary btn-dashboard-sm" onclick="removeFavorite('${product.id}')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }
  if (emptyState) emptyState.style.display = 'none';
}

window.removeFavorite = function(productId) {
  const stored = localStorage.getItem('structon_favorites');
  let favoriteIds = stored ? JSON.parse(stored) : [];
  favoriteIds = favoriteIds.filter(id => id !== productId);
  localStorage.setItem('structon_favorites', JSON.stringify(favoriteIds));
  
  // Remove from UI
  const card = document.querySelector(`.favorite-card[data-id="${productId}"]`);
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'scale(0.9)';
    setTimeout(() => {
      card.remove();
      // Check if empty
      const remaining = document.querySelectorAll('.favorite-card');
      if (remaining.length === 0) {
        renderFavorites([]);
      }
    }, 200);
  }
};

function setupEventListeners() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await logout();
    });
  }
}

function setupMobileSidebar() {
  const sidebar = document.getElementById('dashboard-sidebar');
  const toggle = document.getElementById('sidebar-toggle');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }
  if (overlay && sidebar) {
    overlay.addEventListener('click', () => sidebar.classList.remove('open'));
  }
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initFavoritesPage);
