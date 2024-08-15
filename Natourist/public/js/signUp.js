import axios from 'axios';
import { showAlert } from './alert.js';

export const signUp = async (name, email, password, passwordConfirm) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/signup',
            data: {
                name,
                email,
                password,
                passwordConfirm,
            }
        })
        console.log(res);

        if (res.data.status === 'success') { 
            showAlert('success', 'User created successfully');
            window.setTimeout(() => {
                location.assign('/login');
            }, 1000);
        }
    } catch (e) {
        showAlert('error', e.response.data.message);
        console.log(e);
    }
}