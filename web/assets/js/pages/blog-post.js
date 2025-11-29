/**
 * Blog Post Page JavaScript
 */

import { API_BASE_URL } from '../main.js';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadBlogPost();
  setupMobileNav();
});

/**
 * Load blog post from API
 */
async function loadBlogPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  
  if (!slug) {
    showError('Geen artikel gevonden');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
    
    if (!response.ok) {
      showError('Artikel niet gevonden');
      return;
    }
    
    const blog = await response.json();
    renderBlogPost(blog);
    
  } catch (error) {
    console.error('Error loading blog:', error);
    showError('Fout bij laden van artikel');
  }
}

/**
 * Render blog post content
 */
function renderBlogPost(blog) {
  // Update page title and meta
  document.getElementById('page-title').textContent = `${blog.title} | Structon Blog`;
  document.getElementById('meta-description').content = blog.meta_description || blog.excerpt || '';
  document.getElementById('breadcrumb-title').textContent = blog.title;
  
  // Render header
  const headerEl = document.getElementById('post-header');
  const date = formatDate(blog.published_at);
  
  headerEl.innerHTML = `
    <h1>${escapeHtml(blog.title)}</h1>
    <div class="post-meta">
      <span>${date}</span>
      ${blog.author_email ? `<span>Door ${blog.author_email.split('@')[0]}</span>` : ''}
    </div>
    ${blog.featured_image ? `
      <div class="post-featured-image">
        <img src="${blog.featured_image}" alt="${escapeHtml(blog.title)}">
      </div>
    ` : ''}
  `;
  
  // Render content
  const contentEl = document.getElementById('post-content');
  
  // Convert plain text to HTML paragraphs if needed
  let content = blog.content;
  if (!content.includes('<p>') && !content.includes('<h')) {
    // Simple text - convert line breaks to paragraphs
    content = content
      .split('\n\n')
      .filter(p => p.trim())
      .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('');
  }
  
  contentEl.innerHTML = content;
}

/**
 * Show error message
 */
function showError(message) {
  const headerEl = document.getElementById('post-header');
  const contentEl = document.getElementById('post-content');
  
  headerEl.innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>${message}</p>
    </div>
  `;
  contentEl.innerHTML = '';
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
