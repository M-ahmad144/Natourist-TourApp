import axios from 'axios';
import { showAlert } from './alert.js';

// Initialize Stripe with your public key
const stripe = Stripe(
  'pk_test_51PnP46DUrvAwl3AZjRUXN9dXGgk1OfcAc25LRTdpRBRNbPwuoeYm4hvAHeXF849nwh9fbQI4rDio1T5ybrd8zGfT00WF0qyhpO',
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Redirect to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    if (result.error) {
      // Show error message in your UI
      showAlert('error', result.error.message);
    }
  } catch (err) {
    console.error(err);
    showAlert('error', err.message);
  }
};
