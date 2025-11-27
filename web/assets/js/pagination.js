/**
 * Structon Pagination Module
 */

const ITEMS_PER_PAGE = 12;

let currentPage = 1;
let totalItems = 0;
let onPageChange = null;

/**
 * Initialize pagination
 */
export function initPagination(total, callback) {
  totalItems = total;
  onPageChange = callback;
  currentPage = 1;
  
  render();
}

/**
 * Update pagination with new total
 */
export function updatePagination(total) {
  totalItems = total;
  
  // Reset to page 1 if current page is out of bounds
  const totalPages = getTotalPages();
  if (currentPage > totalPages) {
    currentPage = 1;
  }
  
  render();
}

/**
 * Get total pages
 */
function getTotalPages() {
  return Math.ceil(totalItems / ITEMS_PER_PAGE);
}

/**
 * Get current page
 */
export function getCurrentPage() {
  return currentPage;
}

/**
 * Get items per page
 */
export function getItemsPerPage() {
  return ITEMS_PER_PAGE;
}

/**
 * Get offset for API
 */
export function getOffset() {
  return (currentPage - 1) * ITEMS_PER_PAGE;
}

/**
 * Go to specific page
 */
export function goToPage(page) {
  const totalPages = getTotalPages();
  
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  render();
  
  if (onPageChange) {
    onPageChange(currentPage, getOffset());
  }
  
  // Scroll to top of products
  const productsContainer = document.querySelector('.products-container');
  if (productsContainer) {
    productsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Render pagination
 */
function render() {
  const container = document.getElementById('pagination');
  if (!container) return;
  
  const totalPages = getTotalPages();
  
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }
  
  let html = '';
  
  // Previous button
  html += `
    <button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">
      ←
    </button>
  `;
  
  // Page numbers
  const pages = getPageNumbers(currentPage, totalPages);
  
  pages.forEach((page, index) => {
    if (page === '...') {
      html += `<span class="pagination-ellipsis">...</span>`;
    } else {
      html += `
        <button class="pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">
          ${page}
        </button>
      `;
    }
  });
  
  // Next button
  html += `
    <button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">
      →
    </button>
  `;
  
  container.innerHTML = html;
  
  // Add event listeners
  container.querySelectorAll('.pagination-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (!isNaN(page)) {
        goToPage(page);
      }
    });
  });
}

/**
 * Get page numbers to display
 */
function getPageNumbers(current, total) {
  const pages = [];
  const delta = 2; // Pages to show around current
  
  // Always show first page
  pages.push(1);
  
  // Calculate range around current page
  const rangeStart = Math.max(2, current - delta);
  const rangeEnd = Math.min(total - 1, current + delta);
  
  // Add ellipsis if needed before range
  if (rangeStart > 2) {
    pages.push('...');
  }
  
  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }
  
  // Add ellipsis if needed after range
  if (rangeEnd < total - 1) {
    pages.push('...');
  }
  
  // Always show last page (if more than 1 page)
  if (total > 1) {
    pages.push(total);
  }
  
  return pages;
}

/**
 * Paginate array of items
 */
export function paginateItems(items, page = currentPage) {
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  return items.slice(start, end);
}
