//195
import axios from 'axios'; //195
import { showAlert } from './alerts'; //195

//195, 196
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe'; //http://127.0.0.1:3000
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      //202 comments edit
      window.setTimeout(() => {
        location.reload(true);
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
