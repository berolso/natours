//188, 189, 190
import axios from 'axios'; //190
import { showAlert } from './alerts'; //190
//190
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
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
