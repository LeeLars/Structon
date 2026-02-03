/**
 * Blog Overview Page JavaScript
 */

import { API_BASE_URL } from '../main.js';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadBlogs();
  setupMobileNav();
});

/**
 * Load published blogs from API
 */
async function loadBlogs() {
  const container = document.getElementById('blog-grid');
  if (!container) return;
  
  container.innerHTML = `
    <div class="structon-loader loader-medium">
      <div class="loader-spinner"></div>
      <p class="loader-message">Artikelen laden...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`${API_BASE_URL}/blogs?limit=20`);
    const data = await response.json();
    
    if (!data.blogs || data.blogs.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <p>Nog geen blogartikelen gepubliceerd.</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = data.blogs.map(blog => createBlogCard(blog)).join('');
    
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>Fout bij laden van artikelen. Probeer het later opnieuw.</p>
      </div>
    `;
  }
}

/**
 * Create blog card HTML
 */
function createBlogCard(blog) {
  const imageUrl = blog.featured_image || 'https://via.placeholder.com/400x225?text=Blog';
  const excerpt = blog.excerpt || blog.content?.substring(0, 150) + '...' || '';
  const date = formatDate(blog.published_at);
  
  return `
    <a href="blog-post.html?slug=${blog.slug}" class="blog-card">
      <div class="blog-card-image">
        <img src="${imageUrl}" alt="${escapeHtml(blog.title)}" loading="lazy">
      </div>
      <div class="blog-card-content">
        <span class="blog-card-category">Artikel</span>
        <h3 class="blog-card-title">${escapeHtml(blog.title)}</h3>
        <p class="blog-card-excerpt">${escapeHtml(excerpt)}</p>
        <span class="blog-card-meta">${date}</span>
      </div>
    </a>
  `;
}

/**
 * Format date to Dutch locale
 */
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Setup mobile navigation
 */
function setupMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const navMobileClose = document.getElementById('nav-mobile-close');

  menuToggle?.addEventListener('click', () => {
    navMobile?.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  navMobileClose?.addEventListener('click', () => {
    navMobile?.classList.remove('active');
    document.body.style.overflow = '';
  });
}
