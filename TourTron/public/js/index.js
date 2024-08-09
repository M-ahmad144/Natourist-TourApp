import '@babel/polyfill';
import 'leaflet/dist/leaflet.css';
import { displayMap } from './map';
import { login } from './login';

// DOM Elements
const loginForm = document.querySelector('.form');
const mapElement = document.getElementById('map');

if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

// Handle form submission
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    login(email, password);
  });
}
