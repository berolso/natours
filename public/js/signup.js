//my addition. not in videos
import axios from 'axios';
import { showAlert } from './alerts'; //190


export const signup = async (name, last, email, password, passwordConfirm) => {
  console.log(name, last, email, password, passwordConfirm);
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        last,
        email,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'You are now signed up!');
      window.setTimeout(() => {
        location.assign('/');
      }, 50);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
