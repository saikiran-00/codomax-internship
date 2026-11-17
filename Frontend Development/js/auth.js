/* ============================================
   BlogSphere – Authentication Module
   Handles login, register, and session management
   ============================================ */

const Auth = {
  USERS_KEY: 'blogsphere_users',
  SESSION_KEY: 'blogsphere_session',

  // Get all registered users
  getUsers() {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  },

  // Save users array
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  // Register a new user
  register(name, email, password) {
    const users = this.getUsers();
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const user = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      name,
      email: email.toLowerCase(),
      password,
      createdAt: new Date().toISOString()
    };
    users.push(user);
    this.saveUsers(users);
    return { success: true, message: 'Registration successful!', user };
  },

  // Login
  login(email, password, remember = false) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    const session = {
      userId: user.id,
      name: user.name,
      email: user.email,
      remember,
      loginAt: new Date().toISOString()
    };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { success: true, message: 'Login successful!', user };
  },

  // Logout
  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  // Get current session
  getSession() {
    return JSON.parse(localStorage.getItem(this.SESSION_KEY));
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.getSession() !== null;
  },

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    const users = this.getUsers();
    return users.find(u => u.id === session.userId) || null;
  },

  // Protect a page — redirect to login if not authenticated
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Update nav based on auth state
  updateNav() {
    if (this.isLoggedIn()) {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }
  }
};

/* ---------- FORM VALIDATION HELPERS ---------- */

const Validator = {
  isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  minLength(str, min) {
    return str.length >= min;
  },

  matches(a, b) {
    return a === b;
  },

  isEmpty(str) {
    return !str || str.trim() === '';
  },

  showError(input, message) {
    const wrapper = input.closest('.form-group');
    const errorEl = wrapper.querySelector('.form-error');
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  },

  clearError(input) {
    const wrapper = input.closest('.form-group');
    const errorEl = wrapper.querySelector('.form-error');
    input.classList.remove('error');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  },

  clearAllErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  }
};

/* ---------- LOGIN PAGE ---------- */

function initLoginPage() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  // If already logged in, redirect to dashboard
  if (Auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    Validator.clearAllErrors(form);

    const email = form.querySelector('#loginEmail');
    const password = form.querySelector('#loginPassword');
    const remember = form.querySelector('#rememberMe');
    let valid = true;

    if (Validator.isEmpty(email.value)) {
      Validator.showError(email, 'Email is required.');
      valid = false;
    } else if (!Validator.isEmail(email.value)) {
      Validator.showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (Validator.isEmpty(password.value)) {
      Validator.showError(password, 'Password is required.');
      valid = false;
    }

    if (!valid) return;

    const result = Auth.login(email.value.trim(), password.value, remember?.checked);
    if (result.success) {
      showToast('success', result.message);
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);
    } else {
      showToast('error', result.message);
    }
  });

  // Clear error on input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => Validator.clearError(input));
  });
}

/* ---------- REGISTER PAGE ---------- */

function initRegisterPage() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  // If already logged in, redirect
  if (Auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    Validator.clearAllErrors(form);

    const name = form.querySelector('#regName');
    const email = form.querySelector('#regEmail');
    const password = form.querySelector('#regPassword');
    const confirm = form.querySelector('#regConfirm');
    let valid = true;

    if (Validator.isEmpty(name.value)) {
      Validator.showError(name, 'Full name is required.');
      valid = false;
    } else if (!Validator.minLength(name.value.trim(), 2)) {
      Validator.showError(name, 'Name must be at least 2 characters.');
      valid = false;
    }

    if (Validator.isEmpty(email.value)) {
      Validator.showError(email, 'Email is required.');
      valid = false;
    } else if (!Validator.isEmail(email.value)) {
      Validator.showError(email, 'Please enter a valid email address.');
      valid = false;
    }

    if (Validator.isEmpty(password.value)) {
      Validator.showError(password, 'Password is required.');
      valid = false;
    } else if (!Validator.minLength(password.value, 6)) {
      Validator.showError(password, 'Password must be at least 6 characters.');
      valid = false;
    }

    if (Validator.isEmpty(confirm.value)) {
      Validator.showError(confirm, 'Please confirm your password.');
      valid = false;
    } else if (!Validator.matches(password.value, confirm.value)) {
      Validator.showError(confirm, 'Passwords do not match.');
      valid = false;
    }

    if (!valid) return;

    const result = Auth.register(name.value.trim(), email.value.trim(), password.value);
    if (result.success) {
      showToast('success', result.message);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      showToast('error', result.message);
    }
  });

  // Clear errors on input
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => Validator.clearError(input));
  });
}

/* ---------- PASSWORD TOGGLE ---------- */

function initPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        this.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
      } else {
        input.type = 'password';
        this.innerHTML = '<i class="fa-regular fa-eye"></i>';
      }
    });
  });
}
