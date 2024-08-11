import 'leaflet/dist/leaflet.css';
import 'ol/ol.css';
import { displayMap } from './map';
import { login } from './login';
import { logout } from './logout';
import { updateSettings } from './updateSettings';

// DOM Elements
const loginForm = document.querySelector('.form--login');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const mapElement = document.getElementById('map');

// Check if the map element exists and initialize the map
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

// Handle form submission for login
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}

if (formUserData) {
  formUserData.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    updateSettings({ name, email }, 'data');
  });
}

if (formUserPassword) {
  formUserPassword.addEventListener('submit', async (e) => {
    e.preventDefault();

    const saveBtn = document.querySelector('.btn--save-password');
    const spinner = document.querySelector('.loading-spinner');

    // Add updating state
    saveBtn.textContent = 'Updating...';
    saveBtn.classList.add('updating');
    spinner.classList.remove('hidden');

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    // Reset button and form
    saveBtn.textContent = 'Save Password';
    saveBtn.classList.remove('updating');
    spinner.classList.add('hidden');

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
