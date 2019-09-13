//188, 189, 190
import axios from 'axios'; //190
import { showAlert } from './alerts'; //190
//190
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login', //http://127.0.0.1:3000
      data: {
        email,
        password
      }
    });
    //189
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 50);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

//191
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout' //http://127.0.0.1:3000
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    showAlert('error', 'Error logging out: Try again.');
  }
};
