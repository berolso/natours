//211
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_CmSGPBteniyIdpW7GLHQz7yg00KQPm8X11'); //211

export const bookTour = async tourId => {

    try {
    // 1) Get checkout session from api
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    // 2) create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch {
    console.log(err);
    showAlert('error', err);
  }
};
