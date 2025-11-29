/**
 * Brands Page JavaScript
 */

import api from './api-client.js?v=3';

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
  console.log('Brands page initializing...');
  initializeData();
  setupEventListeners();
});

/**
 * Initialize with demo data immediately
 */
async function initializeData() {
  // Load demo data immediately
  brands = [...DEMO_BRANDS];
  renderBrands();
  
  // Try API in background
  try {
    const response = await api.get('/brands');
    if (response?.length > 0 || response?.brands?.length > 0) {
      brands = response.brands || response;
      renderBrands();
    }
  } catch (error) {
    console.log('Using demo brands (API unavailable)');
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
    id: brandId || `brand-${Date.now()}`,
    title: document.getElementById('brand-title').value,
    slug: document.getElementById('brand-slug').value,
    is_active: document.getElementById('brand-active').checked,
    product_count: 0
  };
  
  // Try API first
  try {
    if (brandId) {
      await api.put(`/admin/brands/${brandId}`, data);
    } else {
      await api.post('/admin/brands', data);
    }
  } catch (error) {
    console.log('API unavailable, saving locally');
  }
  
  // Update local data
  if (brandId) {
    const index = brands.findIndex(b => b.id === brandId);
    if (index !== -1) {
      brands[index] = { ...brands[index], ...data };
    }
    showToast('Merk bijgewerkt', 'success');
  } else {
    brands.unshift(data);
    showToast('Merk toegevoegd', 'success');
  }
  
  closeModal();
  renderBrands();
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

window.editBrand = function(id) {
  const brand = brands.find(b => b.id === id);
  if (brand) {
    openModal(brand);
  } else {
    showToast('Merk niet gevonden', 'error');
  }
};

window.deleteBrand = async function(id) {
  if (!confirm('Weet je zeker dat je dit merk wilt verwijderen?')) return;
  
  // Try API first
  try {
    await api.delete(`/admin/brands/${id}`);
  } catch (error) {
    console.log('API unavailable, deleting locally');
  }
  
  // Remove from local data
  brands = brands.filter(b => b.id !== id);
  showToast('Merk verwijderd', 'success');
  renderBrands();
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
