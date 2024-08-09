import axios from 'axios';
import { showAlert } from './alert.js';

export const protect = async (slug) => {
  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:3000/api/v1/tour/${slug}`,
    });
    if (res.data.status === 'success') {
      // location.assign(`/tour/${slug}`);
    }
  } catch (e) {
    console.log(e);
    showAlert('error', 'Login first to access this page!');
  }
};
