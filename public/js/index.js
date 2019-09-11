//190
import '@babel/polyfill'; //190
import { displayMap } from './mapbox'; //190
import { login, logout } from './login'; //190
import { updateSettings } from './updateSettings'; //195, 196

//dom elements
// 190
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login'); //194
const logOutBtn = document.querySelector('.nav__el--logout'); //191
const userDataForm = document.querySelector('.form-user-data'); //195
const userPasswordForm = document.querySelector('.form-user-password'); //196

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
