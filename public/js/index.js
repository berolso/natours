//190
import '@babel/polyfill'; //190
import { displayMap } from './mapbox'; //190
import { login, logout } from './login'; //190
import { signup } from './signup'; // mine
import { updateSettings } from './updateSettings'; //195, 196
import { bookTour } from './stripe'; //211
import { showAlert } from './alerts'; //226

//dom elements
// 190
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login'); //194
const signupForm = document.querySelector('.form--signup'); //mine
const logOutBtn = document.querySelector('.nav__el--logout'); //191
const userDataForm = document.querySelector('.form-user-data'); //195
const userPasswordForm = document.querySelector('.form-user-password'); //196
const bookBtn = document.getElementById('book-tour'); //211
//deligation
//185, 190
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

//189, 190
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

//mine
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(firstName, lastName, email, password, confirmPassword);
  });
}

//191
if (logOutBtn) logOutBtn.addEventListener('click', logout);

//195, 196, 202
if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    //202
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

//196
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
//211
if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });

//226
const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 10);
