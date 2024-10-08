import axios from 'axios';
import { showAlert } from './alert.js';

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (e) {
    
    showAlert('error', 'Error logging out!');
  }
};
