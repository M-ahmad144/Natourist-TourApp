import 'leaflet/dist/leaflet.css';
import 'ol/ol.css';
import { displayMap } from './map';
import { login } from './login';
import { logout } from './logout';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
 import { signUp } from './signUp';

// DOM Elements
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.signup-form');
const formUserData = document.querySelector('.form-user-data');
const formUserPassword = document.querySelector('.form-user-password');
const logOutBtn = document.querySelector('.nav__el--logout');
const mapElement = document.getElementById('map');
const bookBtn = document.getElementById('book-tour');

// Check if the map element exists and initialize the map
if (mapElement) {
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (signupForm) { 
    signupForm.addEventListener('submit',  (e) => {
      e.preventDefault();
      // Gather form data
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      const passwordConfirm = document.querySelector('#passwordConfirm').value;
      // Show loading spinner
      const signUpBtn = document.querySelector('#signUpSubmit');
      signUpBtn.textContent = 'Processing...';
       signUp(name, email, password, passwordConfirm);
        
        // Clear fields after successful sign-up
        document.querySelector('#name').value = '';
        document.querySelector('#email').value = '';
        document.querySelector('#password').value = '';
      document.querySelector('#passwordConfirm').value = '';
       signUpBtn.textContent = 'Sign Up';
    });
  }

// Handle form submission for login
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const signInBtn = document.querySelector('#signInSubmit');
      signInBtn.textContent = 'Processing...';
    await login(email, password);
    signInBtn.textContent = 'Sign In';
  });
}


if (formUserData) {
  const photoInput = document.getElementById('photo');
  const photoPreview = document.getElementById('photoPreview');

  // Preview the image when a new one is selected
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  formUserData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(); // Creating multipart form data
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    

    updateSettings(form, 'data');
  });
}

if (formUserPassword) {
  formUserPassword.addEventListener('submit',  (e) => {
    e.preventDefault();

    const saveBtn = document.querySelector('.btn--save-password');

    // Add updating state
    saveBtn.textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

     updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    // Reset button and form
    saveBtn.textContent = 'Save Password';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}


if (bookBtn) {
  bookBtn.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}