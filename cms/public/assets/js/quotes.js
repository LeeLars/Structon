import api from './api-client.js';
import { renderSidebar } from './sidebar.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar
  const sidebarContainer = document.getElementById('sidebar-container');
  if (sidebarContainer) {
    sidebarContainer.innerHTML = renderSidebar('quotes');
  }
  
  loadQuotes();
});

async function loadQuotes() {
  const tableBody = document.querySelector('#quotes-table tbody');
  
  try {
    // In a real app, we would fetch all quotes with pagination
    // For now we reuse the recent quotes endpoint or a new one
    const quotes = await api.get('/sales/quotes');
    
    if (quotes.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-muted">Geen offertes gevonden</td>
        </tr>
      `;
      return;
    }
    
    tableBody.innerHTML = quotes.map(quote => `
      <tr>
        <td>
          <div class="font-medium">${formatDate(quote.created_at)}</div>
          <div class="text-sm text-muted">${formatTime(quote.created_at)}</div>
        </td>
        <td>
          <div class="font-medium">${quote.customer_name}</div>
          <div class="text-sm text-muted">${quote.customer_email}</div>
        </td>
        <td>
          ${quote.product_title || quote.product_name || 'Algemene aanvraag'}
        </td>
        <td>
          <span class="badge badge-${getStatusColor(quote.status)}">${getStatusLabel(quote.status)}</span>
        </td>
        <td class="text-right">
          <button class="btn-icon btn-sm" title="Bekijken">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </td>
      </tr>
    `).join('');
    
  } catch (error) {
    console.error('Error loading quotes:', error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-error">Fout bij laden gegevens</td>
      </tr>
    `;
  }
}

function getStatusColor(status) {
  const colors = { new: 'primary', processing: 'warning', quoted: 'info', won: 'success', lost: 'error' };
  return colors[status] || 'secondary';
}

function getStatusLabel(status) {
  const labels = { new: 'Nieuw', processing: 'In behandeling', quoted: 'Geoffreerd', won: 'Gewonnen', lost: 'Verloren' };
  return labels[status] || status;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' });
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}
