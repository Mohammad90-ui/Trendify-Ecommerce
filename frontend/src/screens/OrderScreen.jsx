import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} from '../slices/ordersApiSlice';
import StripePaymentForm from '../components/StripePaymentForm';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handlePaymentSuccess = () => {
    refetch();
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ) : error ? (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error! </strong>
      <span className="block sm:inline">{error?.data?.message || error.error}</span>
    </div>
  ) : (
    <>
      <h1 className="text-3xl font-bold mb-6">Order {order._id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping</h2>
              <p className="mb-2">
                <strong>Name: </strong> {order.user.name}
              </p>
              <p className="mb-2">
                <strong>Email: </strong> {order.user.email}
              </p>
              <p className="mb-2">
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              <div className="mt-4">
                {order.isDelivered ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <p>Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <p>Not Delivered</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <p className="mb-2">
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              <div className="mt-4">
                {order.isPaid ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <p>Paid on {new Date(order.paidAt).toLocaleDateString()}</p>
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <p>Not Paid</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>
              {order.orderItems.length === 0 ? (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                  <p>Order is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex-shrink-0 w-24 h-24 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow sm:ml-6">
                        <Link to={`/product/${item._id}`} className="text-lg font-medium text-gray-900 hover:text-primary">
                          {item.name}
                        </Link>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-6">
                        {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>${order.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>${order.shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                <span>Total:</span>
                <span>${order.totalPrice}</span>
              </div>

              {!order.isPaid && order.paymentMethod === 'Stripe' && (
                <div className="mt-4">
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      orderId={orderId}
                      onPaymentSuccess={handlePaymentSuccess}
                    />
                  </Elements>
                </div>
              )}

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <button
                  type="button"
                  className="w-full mt-4 bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300"
                  onClick={deliverOrderHandler}
                >
                  {loadingDeliver ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                  ) : (
                    'Mark As Delivered'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;