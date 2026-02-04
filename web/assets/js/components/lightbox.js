/**
 * Structon Lightbox Component
 * Modern image lightbox for product gallery
 */

class Lightbox {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.overlay = null;
    this.init();
  }

  init() {
    this.createOverlay();
    this.bindEvents();
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
      <div class="lightbox-content">
        <img src="" alt="" class="lightbox-image" id="lightbox-image">
        <button class="lightbox-close" id="lightbox-close" aria-label="Sluiten">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button class="lightbox-nav prev" id="lightbox-prev" aria-label="Vorige">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button class="lightbox-nav next" id="lightbox-next" aria-label="Volgende">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        <div class="lightbox-counter" id="lightbox-counter">1 / 1</div>
      </div>
    `;
    document.body.appendChild(overlay);
    this.overlay = overlay;
  }

  bindEvents() {
    // Close button
    document.getElementById('lightbox-close').addEventListener('click', () => this.close());
    
    // Navigation
    document.getElementById('lightbox-prev').addEventListener('click', () => this.prev());
    document.getElementById('lightbox-next').addEventListener('click', () => this.next());
    
    // Click outside to close
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.overlay.classList.contains('active')) return;
      
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });
  }

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.updateImage();
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage();
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage();
  }

  updateImage() {
    const img = document.getElementById('lightbox-image');
    const counter = document.getElementById('lightbox-counter');
    
    img.src = this.images[this.currentIndex];
    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    
    // Show/hide nav buttons
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    if (this.images.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }
}

// Initialize lightbox
const lightbox = new Lightbox();

// Export for use in other scripts
window.structonLightbox = lightbox;

console.log('✨ Lightbox initialized');
