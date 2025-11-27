/**
 * Categories Page JavaScript
 */

import api from './api-client.js';

let categories = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadCategories();
});

async function checkAuth() {
  try {
    const data = await api.get('/auth/me');
    if (data.user.role !== 'admin') window.location.href = '/cms/';
  } catch (error) {
    window.location.href = '/cms/';
  }
}

function setupEventListeners() {
  document.getElementById('btn-new-category')?.addEventListener('click', () => openModal());
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-category')?.addEventListener('click', closeModal);
  document.getElementById('category-form')?.addEventListener('submit', handleSubmit);
  document.getElementById('category-title')?.addEventListener('input', (e) => {
    document.getElementById('category-slug').value = generateSlug(e.target.value);
  });
  
  // Image upload
  const uploadArea = document.getElementById('image-upload-area');
  const imageInput = document.getElementById('image-input');
  uploadArea?.addEventListener('click', () => imageInput.click());
  imageInput?.addEventListener('change', handleImageSelect);
  document.getElementById('remove-image')?.addEventListener('click', removeImage);
  
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

async function loadCategories() {
  try {
    const data = await api.get('/categories');
    categories = data.categories || [];
    renderCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function renderCategories() {
  const grid = document.getElementById('categories-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (categories.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }
  
  emptyState.style.display = 'none';
  grid.innerHTML = categories.map(cat => `
    <div class="category-card" data-id="${cat.id}">
      ${cat.image_url 
        ? `<div class="category-image"><img src="${cat.image_url}" alt="${escapeHtml(cat.title)}"></div>`
        : `<div class="category-image-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg><span>Geen afbeelding</span></div>`
      }
      <div class="category-content">
        <div class="category-header">
          <div class="category-title-group">
            <h3 class="category-title">${escapeHtml(cat.title)}</h3>
            <div class="category-slug">${cat.slug}</div>
          </div>
          <div class="category-drag-handle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        </div>
        ${cat.description ? `<p class="category-description">${escapeHtml(cat.description)}</p>` : ''}
        <div class="category-meta">
          <div class="category-meta-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
            <strong>${cat.product_count || 0}</strong> producten
          </div>
          <div class="category-meta-item">
            Volgorde: <strong>${cat.sort_order || 0}</strong>
          </div>
        </div>
        <div class="category-actions">
          <button class="btn btn-secondary" onclick="editCategory('${cat.id}')">Bewerken</button>
          <button class="btn btn-danger" onclick="deleteCategory('${cat.id}')">Verwijderen</button>
        </div>
      </div>
    </div>
  `).join('');
}

function openModal(category = null) {
  const modal = document.getElementById('category-modal');
  const form = document.getElementById('category-form');
  const title = document.getElementById('modal-title');
  
  if (category) {
    title.textContent = 'Categorie Bewerken';
    populateForm(category);
  } else {
    title.textContent = 'Nieuwe Categorie';
    form.reset();
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('category-modal').style.display = 'none';
  document.getElementById('category-form').reset();
  removeImage();
}

function populateForm(cat) {
  document.getElementById('category-title').value = cat.title || '';
  document.getElementById('category-slug').value = cat.slug || '';
  document.getElementById('category-description').value = cat.description || '';
  document.getElementById('category-sort').value = cat.sort_order || 0;
  document.getElementById('category-active').checked = cat.is_active;
  document.getElementById('category-seo-title').value = cat.seo_title || '';
  document.getElementById('category-seo-description').value = cat.seo_description || '';
  document.getElementById('category-seo-h1').value = cat.seo_h1 || '';
  document.getElementById('category-seo-intro').value = cat.seo_intro || '';
  document.getElementById('category-seo-content').value = cat.seo_content || '';
  
  if (cat.image_url) {
    showImagePreview(cat.image_url);
  }
  
  document.getElementById('category-form').dataset.categoryId = cat.id;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const categoryId = form.dataset.categoryId;
  
  const data = {
    title: document.getElementById('category-title').value,
    slug: document.getElementById('category-slug').value,
    description: document.getElementById('category-description').value,
    sort_order: parseInt(document.getElementById('category-sort').value) || 0,
    is_active: document.getElementById('category-active').checked,
    seo_title: document.getElementById('category-seo-title').value,
    seo_description: document.getElementById('category-seo-description').value,
    seo_h1: document.getElementById('category-seo-h1').value,
    seo_intro: document.getElementById('category-seo-intro').value,
    seo_content: document.getElementById('category-seo-content').value,
  };
  
  try {
    if (categoryId) {
      await api.put(`/admin/categories/${categoryId}`, data);
      showToast('Categorie bijgewerkt', 'success');
    } else {
      await api.post('/admin/categories', data);
      showToast('Categorie toegevoegd', 'success');
    }
    
    closeModal();
    await loadCategories();
  } catch (error) {
    console.error('Error saving category:', error);
    showToast(error.message || 'Fout bij opslaan', 'error');
  }
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => showImagePreview(e.target.result);
    reader.readAsDataURL(file);
  }
}

function showImagePreview(url) {
  const preview = document.getElementById('image-preview');
  const img = document.getElementById('preview-img');
  const uploadArea = document.getElementById('image-upload-area');
  
  img.src = url;
  preview.style.display = 'block';
  uploadArea.style.display = 'none';
}

function removeImage() {
  const preview = document.getElementById('image-preview');
  const uploadArea = document.getElementById('image-upload-area');
  const imageInput = document.getElementById('image-input');
  
  preview.style.display = 'none';
  uploadArea.style.display = 'flex';
  imageInput.value = '';
}

window.editCategory = async function(id) {
  try {
    const data = await api.get(`/categories/${id}`);
    openModal(data.category);
  } catch (error) {
    console.error('Error loading category:', error);
    showToast('Fout bij laden categorie', 'error');
  }
};

window.deleteCategory = async function(id) {
  if (!confirm('Weet je zeker dat je deze categorie wilt verwijderen?')) return;
  
  try {
    await api.delete(`/admin/categories/${id}`);
    showToast('Categorie verwijderd', 'success');
    await loadCategories();
  } catch (error) {
    console.error('Error deleting category:', error);
    showToast('Fout bij verwijderen', 'error');
  }
};

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function handleLogout() {
  try {
    await api.post('/auth/logout');
    window.location.href = '/cms/';
  } catch (error) {
    window.location.href = '/cms/';
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  if (window.showToast) window.showToast(message, type);
}
