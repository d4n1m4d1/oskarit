document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('main-nav');
  const token = localStorage.getItem('access');
  if (token) {
    // Remove Register & Login
    const toRemove = ['register.html','login.html'];
    nav.querySelectorAll('a').forEach(a => {
      if (toRemove.includes(a.getAttribute('href'))) {
        a.remove();
      }
    });

    // Insert Dashboard link (if not present)
    if (!nav.querySelector('a[href="dashboard.html"]')) {
      const dash = document.createElement('a');
      dash.href = 'dashboard.html';
      dash.textContent = 'Кабинет';
      // insert after Home
      nav.insertBefore(dash, nav.children[1]);
    }

    // Append Logout link
    if (!nav.querySelector('#logout-link')) {
      const logout = document.createElement('a');
      logout.href = '#';
      logout.id = 'logout-link';
      logout.textContent = 'Выход';
      nav.appendChild(logout);
      logout.addEventListener('click', () => {
        localStorage.removeItem('access');
        window.location.href = 'login.html';
      });
    }
  }
});


// … inside your DOMContentLoaded or at top if you guard for form existence …
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch(`${API}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    document.getElementById('login-result').textContent = JSON.stringify(data, null, 2);

    if (res.ok) {
      // 1) save the token
      localStorage.setItem('access', data.access);
      // 2) redirect to dashboard
      window.location.href = 'dashboard.html';
    }
  });
}
if (location.pathname.endsWith('dashboard.html')) {
  const token = localStorage.getItem('access');
  if (!token) {
    window.location.href = 'login.html';
  } else {
    loadProfile();
    loadApplications();
  }
}


// app.js
const API = 'https://daneemadee.pythonanywhere.com/api';

document.addEventListener('DOMContentLoaded', () => {
  // ——— REGISTER ———
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const password = document.getElementById('reg-password').value;
      const res = await fetch(`${API}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      document.getElementById('reg-result').textContent = JSON.stringify(await res.json(), null,2);
    });
  }

  // ——— LOGIN ———
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const res = await fetch(`${API}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      document.getElementById('login-result').textContent = JSON.stringify(data, null,2);
      if (res.ok) localStorage.setItem('access', data.access);
    });
  }

  // ——— FETCH PROFILE ———
  const fetchBtn = document.getElementById('fetch-profile');
  if (fetchBtn) {
    fetchBtn.addEventListener('click', async () => {
      const token = localStorage.getItem('access');
      const res = await fetch(`${API}/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      document.getElementById('profile-result').textContent =
        JSON.stringify(await res.json(), null,2);
    });
  }

  // ——— APPLICATION SUBMIT ———
  const appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', async e => {
      e.preventDefault();
      const fd = new FormData(appForm);
      const token = localStorage.getItem('access');
      const res = await fetch(`${API}/applications/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      document.getElementById('application-result').textContent =
        JSON.stringify(await res.json(), null,2);
    });
  }

  // ——— LOGOUT ———
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('access');
      window.location.href = 'login.html';
    });
  }
});
