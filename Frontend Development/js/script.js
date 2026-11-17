/* ============================================
   BlogSphere – Main Script
   Common functionality across all pages
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Update nav based on auth
  Auth.updateNav();

  // Init password toggles globally
  initPasswordToggles();

  // Init navbar
  initNavbar();

  // Init page-specific logic
  const page = document.body.dataset.page;
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'login':
      initLoginPage();
      break;
    case 'register':
      initRegisterPage();
      break;
    case 'dashboard':
      initDashboard();
      break;
    case 'create-blog':
      initCreateBlogPage();
      break;
  }
});

/* ---------- NAVBAR ---------- */

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  // Scroll effect
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  // Mobile toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  }
}

/* ---------- TOAST NOTIFICATIONS ---------- */

function showToast(type, message, duration = 4000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="${icons[type] || icons.info}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut .4s var(--ease) forwards';
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/* ---------- LOGOUT ---------- */

function handleLogout() {
  Auth.logout();
  showToast('success', 'Logged out successfully!');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}
