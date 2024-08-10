import 'leaflet/dist/leaflet.css';
import 'ol/ol.css';
import { displayMap } from './map';
import { login } from './login';
import { logout } from './logout';

// DOM Elements
const loginForm = document.querySelector('.form--login');
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
