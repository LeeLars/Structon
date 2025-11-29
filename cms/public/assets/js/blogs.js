/**
 * Blogs Page JavaScript
 * Handles blog CRUD operations
 */

import api from './api-client.js';

// Demo data
const DEMO_BLOGS = [
  {
    id: 'blog-1',
    title: 'De juiste graafbak kiezen voor uw project',
    slug: 'juiste-graafbak-kiezen',
    excerpt: 'Een uitgebreide gids voor het selecteren van de perfecte graafbak voor verschillende grondsoorten en projecten.',
    content: '<p>Het kiezen van de juiste graafbak is essentieel voor efficiënt grondverzet. In dit artikel bespreken we de belangrijkste factoren.</p><h2>Grondsoort</h2><p>De grondsoort bepaalt grotendeels welk type bak u nodig heeft...</p>',
    featured_image: 'https://via.placeholder.com/800x400?text=Graafbak+Gids',
    status: 'published',
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'blog-2',
    title: 'Onderhoudstips voor uw aanbouwdelen',
    slug: 'onderhoudstips-aanbouwdelen',
    excerpt: 'Verleng de levensduur van uw graafmachine accessoires met deze praktische onderhoudstips.',
    content: '<p>Regelmatig onderhoud is cruciaal voor de levensduur van uw aanbouwdelen.</p>',
    featured_image: 'https://via.placeholder.com/800x400?text=Onderhoud',
    status: 'published',
    published_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'blog-3',
    title: 'Nieuwe CW40 snelwissel systemen',
    slug: 'nieuwe-cw40-snelwissel',
    excerpt: 'Ontdek de nieuwste ontwikkelingen in CW40 snelwissel technologie.',
    content: '<p>De CW40 snelwissel is een van de meest populaire systemen...</p>',
    featured_image: null,
    status: 'draft',
    published_at: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let blogs = [];
let currentBlogId = null;

// Initialize
console.log('🚀 [BLOGS] Script loading...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 [BLOGS] DOM loaded, starting initialization...');
  
  try {
    initializeData();
    console.log('✅ [BLOGS] initializeData() completed');
  } catch (error) {
    console.error('❌ [BLOGS] Error in initializeData():', error);
  }
  
  try {
    setupEventListeners();
    console.log('✅ [BLOGS] setupEventListeners() completed');
  } catch (error) {
    console.error('❌ [BLOGS] Error in setupEventListeners():', error);
  }
});

/**
 * Initialize with demo data immediately
 */
async function initializeData() {
  // Load demo data immediately
  blogs = [...DEMO_BLOGS];
  renderBlogList(blogs);
  
  // Try API in background
  try {
    const response = await api.get('/blogs/admin/all');
    if (response?.blogs?.length > 0 || (Array.isArray(response) && response.length > 0)) {
      blogs = response.blogs || response;
      renderBlogList(blogs);
    }
  } catch (error) {
    console.log('Using demo blogs (API unavailable)');
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  console.log('🔧 [BLOGS] Setting up event listeners...');
  
  // New blog button
  const newBlogBtn = document.getElementById('btn-new-blog');
  console.log('   btn-new-blog found:', !!newBlogBtn);
  
  if (newBlogBtn) {
    newBlogBtn.addEventListener('click', () => {
      console.log('🆕 [BLOGS] New blog button clicked!');
      showEditor();
    });
  }
  
  // Cancel button
  const cancelBtn = document.getElementById('btn-cancel');
  console.log('   btn-cancel found:', !!cancelBtn);
  cancelBtn?.addEventListener('click', hideEditor);
  
  // Form submit
  document.getElementById('blog-form')?.addEventListener('submit', handleSubmit);
  
  // Auto-generate slug from title
  document.getElementById('blog-title')?.addEventListener('input', (e) => {
    if (!currentBlogId) { // Only auto-generate for new blogs
      document.getElementById('blog-slug').value = generateSlug(e.target.value);
    }
  });
  
  // Image upload
  document.getElementById('image-preview')?.addEventListener('click', () => {
    document.getElementById('image-input').click();
  });
  
  document.getElementById('image-input')?.addEventListener('change', handleImageUpload);
  
  // Filter
  document.getElementById('filter-status')?.addEventListener('change', filterBlogs);
}

/**
 * Render blog list
 */
function renderBlogList(blogsToRender) {
  const container = document.getElementById('blogs-container');
  
  if (blogsToRender.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>Nog geen artikelen</p>
        <button class="btn btn-primary" onclick="document.getElementById('btn-new-blog').click()">
          Eerste artikel schrijven
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = blogsToRender.map(blog => `
    <div class="blog-list-item" data-id="${blog.id}">
      <img src="${blog.featured_image || 'https://via.placeholder.com/80x60?text=Blog'}" alt="" class="blog-thumb">
      <div class="blog-info">
        <h4>${escapeHtml(blog.title)}</h4>
        <p>${blog.excerpt ? escapeHtml(blog.excerpt.substring(0, 100)) + '...' : 'Geen samenvatting'}</p>
      </div>
      <div class="blog-meta">
        <span class="badge badge-${getStatusColor(blog.status)}">${getStatusLabel(blog.status)}</span>
      </div>
      <div class="btn-group">
        <button class="btn btn-sm btn-secondary" onclick="editBlog(${blog.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteBlog(${blog.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Filter blogs by status
 */
function filterBlogs() {
  const status = document.getElementById('filter-status').value;
  const filtered = status ? blogs.filter(b => b.status === status) : blogs;
  renderBlogList(filtered);
}

/**
 * Show editor view
 */
function showEditor(blog = null) {
  console.log('📝 [BLOGS] showEditor called, blog:', blog ? blog.title : 'NEW');
  
  const listView = document.getElementById('blog-list-view');
  const editorView = document.getElementById('blog-editor-view');
  
  console.log('   blog-list-view found:', !!listView);
  console.log('   blog-editor-view found:', !!editorView);
  
  if (!listView || !editorView) {
    console.error('❌ [BLOGS] Views not found!');
    return;
  }
  
  listView.style.display = 'none';
  editorView.style.display = 'block';
  console.log('✅ [BLOGS] Editor opened');
  
  if (blog) {
    currentBlogId = blog.id;
    document.getElementById('blog-id').value = blog.id;
    document.getElementById('blog-title').value = blog.title || '';
    document.getElementById('blog-slug').value = blog.slug || '';
    document.getElementById('blog-excerpt').value = blog.excerpt || '';
    document.getElementById('blog-content').value = blog.content || '';
    document.getElementById('blog-status').value = blog.status || 'draft';
    document.getElementById('blog-image').value = blog.featured_image || '';
    document.getElementById('blog-meta-title').value = blog.meta_title || '';
    document.getElementById('blog-meta-description').value = blog.meta_description || '';
    
    // Show image preview
    if (blog.featured_image) {
      document.getElementById('image-preview').innerHTML = `<img src="${blog.featured_image}" alt="">`;
    }
  } else {
    currentBlogId = null;
    document.getElementById('blog-form').reset();
    document.getElementById('blog-id').value = '';
    document.getElementById('image-preview').innerHTML = `
      <div class="image-preview-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <p>Klik om afbeelding te uploaden</p>
      </div>
    `;
  }
}

/**
 * Hide editor view
 */
function hideEditor() {
  document.getElementById('blog-editor-view').style.display = 'none';
  document.getElementById('blog-list-view').style.display = 'block';
  currentBlogId = null;
}

/**
 * Handle form submit
 */
async function handleSubmit(e) {
  e.preventDefault();
  
  const blogData = {
    id: currentBlogId || `blog-${Date.now()}`,
    title: document.getElementById('blog-title').value,
    slug: document.getElementById('blog-slug').value,
    excerpt: document.getElementById('blog-excerpt').value,
    content: document.getElementById('blog-content').value,
    status: document.getElementById('blog-status').value,
    featured_image: document.getElementById('blog-image').value,
    meta_title: document.getElementById('blog-meta-title').value,
    meta_description: document.getElementById('blog-meta-description').value,
    author_name: 'Admin',
    created_at: new Date().toISOString(),
    published_at: document.getElementById('blog-status').value === 'published' ? new Date().toISOString() : null
  };
  
  // Try API first
  try {
    if (currentBlogId) {
      await api.put(`/blogs/admin/${currentBlogId}`, blogData);
    } else {
      await api.post('/blogs/admin', blogData);
    }
  } catch (error) {
    console.log('API unavailable, saving locally');
  }
  
  // Update local data
  if (currentBlogId) {
    const index = blogs.findIndex(b => b.id === currentBlogId);
    if (index !== -1) {
      blogs[index] = { ...blogs[index], ...blogData };
    }
    showToast('Artikel bijgewerkt');
  } else {
    blogs.unshift(blogData);
    showToast('Artikel aangemaakt');
  }
  
  hideEditor();
  renderBlogList(blogs);
}

/**
 * Edit blog
 */
window.editBlog = function(id) {
  const blog = blogs.find(b => b.id === id);
  if (blog) {
    showEditor(blog);
  } else {
    showToast('Artikel niet gevonden', 'error');
  }
};

/**
 * Delete blog
 */
window.deleteBlog = async function(id) {
  if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return;
  
  // Try API first
  try {
    await api.delete(`/blogs/admin/${id}`);
  } catch (error) {
    console.log('API unavailable, deleting locally');
  }
  
  // Remove from local data
  blogs = blogs.filter(b => b.id !== id);
  showToast('Artikel verwijderd');
  renderBlogList(blogs);
};

/**
 * Handle image upload
 */
async function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    // For now, use a placeholder or Cloudinary direct upload
    // In production, you'd upload to your server or Cloudinary
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('image-preview').innerHTML = `<img src="${event.target.result}" alt="">`;
      // Note: In production, you'd upload to Cloudinary and store the URL
      // For now we'll use a placeholder approach
      document.getElementById('blog-image').value = event.target.result;
    };
    reader.readAsDataURL(file);
    
    showToast('Afbeelding toegevoegd');
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Fout bij uploaden afbeelding', 'error');
  }
}

/**
 * Helper functions
 */
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getStatusColor(status) {
  const colors = {
    published: 'success',
    draft: 'warning',
    archived: 'secondary'
  };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = {
    published: 'Gepubliceerd',
    draft: 'Concept',
    archived: 'Gearchiveerd'
  };
  return labels[status] || status;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
