//190
import '@babel/polyfill'; //190
import { displayMap } from './mapbox'; //190
import { login } from './login'; //190

//dom elements
// 190
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

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
