import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useCreatePaymentIntentMutation } from '../slices/ordersApiSlice';
import { toast } from 'react-toastify';

const StripePaymentForm = ({ orderId, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const res = await createPaymentIntent(orderId).unwrap();
        setClientSecret(res.clientSecret);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };

    if (orderId) {
      getPaymentIntent();
    }
  }, [orderId, createPaymentIntent]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('Payment successful!');
      onPaymentSuccess();
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement options={cardElementOptions} />
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || processing || isLoading}
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {processing ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            'Pay Now'
          )}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>Test card numbers:</p>
        <ul className="list-disc list-inside mt-1">
          <li>4242 4242 4242 4242 (Success)</li>
          <li>4000 0000 0000 0002 (Declined)</li>
        </ul>
      </div>
    </div>
  );
};

export default StripePaymentForm;
