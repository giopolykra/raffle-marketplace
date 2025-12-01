import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { useEffect } from 'react';

initStripe({
  publishableKey: 'pk_test_your_stripe_key',  // From backend .env or env var
  merchantIdentifier: 'merchant.com.yourapp',  // For Apple Pay
});

export const usePayment = () => {
  const { presentPaymentSheet, confirmPaymentSheetPayment } = useStripe();

  const handlePayment = async (clientSecret: string, paymentIntentId: string) => {
    const { error: paymentSheetError } = await presentPaymentSheet({
      clientSecret,
    });

    if (paymentSheetError) {
      console.log('Payment sheet error', paymentSheetError);
      return false;
    }

    const { error: confirmError } = await confirmPaymentSheetPayment(clientSecret, {
      paymentIntentId,
    });

    if (confirmError) {
      console.log('Confirm error', confirmError);
      return false;
    }

    return true;
  };

  return { handlePayment };
};