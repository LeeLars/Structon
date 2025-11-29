/**
 * Brands Page JavaScript
 */

import api from './api-client.js';

// Demo data
const DEMO_BRANDS = [
  {
    id: 'brand-1',
    title: 'Caterpillar',
    slug: 'caterpillar',
    logo_url: 'https://via.placeholder.com/150x80?text=CAT',
    is_active: true,
    product_count: 8
  },
  {
    id: 'brand-2',
    title: 'Komatsu',
    slug: 'komatsu',
    logo_url: 'https://via.placeholder.com/150x80?text=Komatsu',
    is_active: true,
    product_count: 6
  },
  {
    id: 'brand-3',
    title: 'Volvo',
    slug: 'volvo',
    logo_url: 'https://via.placeholder.com/150x80?text=Volvo',
    is_active: true,
    product_count: 5
  },
  {
    id: 'brand-4',
    title: 'Hitachi',
    slug: 'hitachi',
    logo_url: null,
    is_active: true,
    product_count: 4
  },
  {
    id: 'brand-5',
    title: 'Liebherr',
    slug: 'liebherr',
    logo_url: null,
    is_active: true,
    product_count: 3
  },
  {
    id: 'brand-6',
    title: 'JCB',
    slug: 'jcb',
    logo_url: null,
    is_active: false,
    product_count: 2
  }
];

let brands = [];

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupEventListeners();
  loadBrands();
});

async function checkAuth() {
  const token = localStorage.getItem('cms_token');
  // Don't redirect - allow demo data to be shown
  if (!token) {
    console.log('No auth token - running in demo mode');
  }
}

function setupEventListeners() {
  document.getElementById('btn-new-brand')?.addEventListener('click', () => openModal());
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-brand')?.addEventListener('click', closeModal);
  document.getElementById('brand-form')?.addEventListener('submit', handleSubmit);
  document.getElementById('brand-title')?.addEventListener('input', (e) => {
    document.getElementById('brand-slug').value = generateSlug(e.target.value);
  });
  
  const uploadArea = document.getElementById('logo-upload-area');
  const logoInput = document.getElementById('logo-input');
  uploadArea?.addEventListener('click', () => logoInput.click());
  logoInput?.addEventListener('change', handleLogoSelect);
  document.getElementById('remove-logo')?.addEventListener('click', removeLogo);
  
  document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
}

async function loadBrands() {
  try {
    const data = await api.get('/brands');
    brands = data.brands || [];
    
    // Use demo data if no real data
    if (brands.length === 0) {
      brands = DEMO_BRANDS;
    }
    
    renderBrands();
  } catch (error) {
    console.error('Error loading brands:', error);
    // Use demo data on error
    brands = DEMO_BRANDS;
    renderBrands();
  }
}

function renderBrands() {
  const grid = document.getElementById('brands-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (brands.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }
  
  emptyState.style.display = 'none';
  grid.innerHTML = brands.map(brand => `
    <div class="brand-card">
      ${brand.logo_url 
        ? `<div class="brand-logo"><img src="${brand.logo_url}" alt="${escapeHtml(brand.title)}"></div>`
        : `<div class="brand-logo-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path></svg></div>`
      }
      <div class="brand-info">
        <h3 class="brand-name">${escapeHtml(brand.title)}</h3>
        <div class="brand-slug">${brand.slug}</div>
      </div>
      <div class="brand-meta">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
        ${brand.product_count || 0} producten
      </div>
      <div class="brand-actions">
        <button class="btn btn-secondary" onclick="editBrand('${brand.id}')">Bewerken</button>
        <button class="btn btn-danger" onclick="deleteBrand('${brand.id}')">Verwijderen</button>
      </div>
    </div>
  `).join('');
}

function openModal(brand = null) {
  const modal = document.getElementById('brand-modal');
  const form = document.getElementById('brand-form');
  const title = document.getElementById('modal-title');
  
  if (brand) {
    title.textContent = 'Merk Bewerken';
    populateForm(brand);
  } else {
    title.textContent = 'Nieuw Merk';
    form.reset();
  }
  
  modal.style.display = 'flex';
}

function closeModal() {
  document.getElementById('brand-modal').style.display = 'none';
  document.getElementById('brand-form').reset();
  removeLogo();
}

function populateForm(brand) {
  document.getElementById('brand-title').value = brand.title || '';
  document.getElementById('brand-slug').value = brand.slug || '';
  document.getElementById('brand-active').checked = brand.is_active;
  
  if (brand.logo_url) {
    showLogoPreview(brand.logo_url);
  }
  
  document.getElementById('brand-form').dataset.brandId = brand.id;
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const brandId = form.dataset.brandId;
  
  const data = {
    title: document.getElementById('brand-title').value,
    slug: document.getElementById('brand-slug').value,
    is_active: document.getElementById('brand-active').checked,
  };
  
  try {
    if (brandId) {
      await api.put(`/admin/brands/${brandId}`, data);
      showToast('Merk bijgewerkt', 'success');
    } else {
      await api.post('/admin/brands', data);
      showToast('Merk toegevoegd', 'success');
    }
    
    closeModal();
    await loadBrands();
  } catch (error) {
    console.error('Error saving brand:', error);
    showToast(error.message || 'Fout bij opslaan', 'error');
  }
}

function handleLogoSelect(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => showLogoPreview(e.target.result);
    reader.readAsDataURL(file);
  }
}

function showLogoPreview(url) {
  const preview = document.getElementById('logo-preview');
  const img = document.getElementById('preview-img');
  const uploadArea = document.getElementById('logo-upload-area');
  
  img.src = url;
  preview.style.display = 'block';
  uploadArea.style.display = 'none';
}

function removeLogo() {
  const preview = document.getElementById('logo-preview');
  const uploadArea = document.getElementById('logo-upload-area');
  const logoInput = document.getElementById('logo-input');
  
  preview.style.display = 'none';
  uploadArea.style.display = 'flex';
  logoInput.value = '';
}

window.editBrand = async function(id) {
  try {
    const data = await api.get(`/brands/${id}`);
    openModal(data.brand);
  } catch (error) {
    console.error('Error loading brand:', error);
    showToast('Fout bij laden merk', 'error');
  }
};

window.deleteBrand = async function(id) {
  if (!confirm('Weet je zeker dat je dit merk wilt verwijderen?')) return;
  
  try {
    await api.delete(`/admin/brands/${id}`);
    showToast('Merk verwijderd', 'success');
    await loadBrands();
  } catch (error) {
    console.error('Error deleting brand:', error);
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
