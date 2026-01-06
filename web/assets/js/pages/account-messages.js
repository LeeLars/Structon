/**
 * Structon Account Messages Page
 */

import { auth } from '../api/client.js';
import { checkAuth, getUser, logout } from '../auth.js';

let currentUser = null;
let messages = [];

async function initMessagesPage() {
  const user = await checkAuth();
  
  if (!user) {
    window.location.href = '../login/?redirect=' + encodeURIComponent(window.location.pathname);
    return;
  }
  
  currentUser = user;
  updateUserInfo();
  await loadMessages();
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

async function loadMessages() {
  try {
    // Load from localStorage for now
    const stored = localStorage.getItem(`structon_messages_${currentUser.email}`);
    messages = stored ? JSON.parse(stored) : [];
    
    renderMessages();
  } catch (error) {
    console.error('Error loading messages:', error);
    renderMessages();
  }
}

function renderMessages() {
  const list = document.getElementById('message-list');
  const emptyState = document.getElementById('messages-empty');
  const card = document.querySelector('.dashboard-card');
  
  if (messages.length === 0) {
    if (card) card.style.display = 'none';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  
  if (card) card.style.display = 'block';
  if (emptyState) emptyState.style.display = 'none';
  
  if (list) {
    list.innerHTML = messages.map((msg, index) => `
      <li class="message-item ${msg.read ? '' : 'unread'}" data-index="${index}">
        <div class="message-avatar">S</div>
        <div class="message-content">
          <div class="message-header">
            <span class="message-sender">${msg.from || 'Structon'}</span>
            <span class="message-time">${formatRelativeTime(msg.created_at)}</span>
          </div>
          <div class="message-subject">${escapeHtml(msg.subject)}</div>
          <div class="message-preview">${escapeHtml(msg.body?.substring(0, 100) || '')}...</div>
        </div>
      </li>
    `).join('');
    
    // Add click handlers
    list.querySelectorAll('.message-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        viewMessage(index);
      });
    });
  }
}

function viewMessage(index) {
  const msg = messages[index];
  if (!msg) return;
  
  // Mark as read
  msg.read = true;
  localStorage.setItem(`structon_messages_${currentUser.email}`, JSON.stringify(messages));
  
  alert(`Van: ${msg.from || 'Structon'}\nOnderwerp: ${msg.subject}\n\n${msg.body}`);
  renderMessages();
}

function setupEventListeners() {
  // New message buttons
  document.getElementById('new-message-btn')?.addEventListener('click', openModal);
  document.getElementById('empty-new-message-btn')?.addEventListener('click', openModal);
  
  // Modal controls
  document.getElementById('close-modal')?.addEventListener('click', closeModal);
  document.getElementById('cancel-message')?.addEventListener('click', closeModal);
  
  // Message form
  document.getElementById('message-form')?.addEventListener('submit', handleSubmit);
  
  // Close modal on overlay click
  document.getElementById('message-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'message-modal') closeModal();
  });
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await logout();
  });
}

function openModal() {
  document.getElementById('message-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('message-modal').style.display = 'none';
  document.getElementById('message-form').reset();
}

async function handleSubmit(e) {
  e.preventDefault();
  
  const subject = document.getElementById('message-subject').value;
  const body = document.getElementById('message-body').value;
  
  // Save message locally (in production, send to API)
  const newMessage = {
    id: Date.now(),
    subject,
    body,
    from: currentUser.email,
    to: 'Structon',
    created_at: new Date().toISOString(),
    read: true,
    type: 'sent'
  };
  
  // Add to sent messages
  const sentMessages = JSON.parse(localStorage.getItem(`structon_sent_${currentUser.email}`) || '[]');
  sentMessages.unshift(newMessage);
  localStorage.setItem(`structon_sent_${currentUser.email}`, JSON.stringify(sentMessages));
  
  // Show confirmation
  showToast('Bericht verzonden', 'success');
  closeModal();
  
  // Simulate auto-reply after 2 seconds
  setTimeout(() => {
    const reply = {
      id: Date.now(),
      subject: `Re: ${subject}`,
      body: `Bedankt voor uw bericht. We hebben uw vraag ontvangen en zullen zo snel mogelijk reageren.\n\nMet vriendelijke groet,\nStructon Team`,
      from: 'Structon',
      created_at: new Date().toISOString(),
      read: false
    };
    
    messages.unshift(reply);
    localStorage.setItem(`structon_messages_${currentUser.email}`, JSON.stringify(messages));
    renderMessages();
  }, 2000);
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#236773'};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 9999;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Zojuist';
  if (minutes < 60) return `${minutes}m geleden`;
  if (hours < 24) return `${hours}u geleden`;
  if (days < 7) return `${days}d geleden`;
  
  return date.toLocaleDateString('nl-NL');
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
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

document.addEventListener('DOMContentLoaded', initMessagesPage);
