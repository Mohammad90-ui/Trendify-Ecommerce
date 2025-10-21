import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useUpdateUserProfileMutation, useGetUserDetailsQuery, useGetMyOrdersQuery } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: user, refetch, isLoading: loadingUserDetails } = useGetUserDetailsQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateUserProfileMutation();
  const { data: orders, isLoading: loadingOrders, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await updateProfile({
        _id: user._id,
        name,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      refetch();
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h2 className="text-2xl font-bold mb-6">User Profile</h2>
        {loadingUserDetails ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300 flex justify-center"
              disabled={loadingUpdateProfile}
            >
              {loadingUpdateProfile ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Update'
              )}
            </button>
          </form>
        )}
      </div>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-6">My Orders</h2>
        {loadingOrders ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error?.data?.message || error.error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              orders?.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                      <p className="text-gray-600">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${order.totalPrice}</p>
                      <p className={`text-sm ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                        {order.isPaid ? 'Paid' : 'Not Paid'}
                      </p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Items:</h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded mr-4"
                            />
                            <div>
                              <Link
                                to={`/product/${item.product}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {item.name}
                              </Link>
                              <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                            </div>
                          </div>
                          <p className="font-semibold">${(item.qty * item.price).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition-colors duration-300"
                    >
                      View Details
                    </Link>
                    <div className="text-sm text-gray-600">
                      {order.isDelivered ? (
                        <span className="text-green-600">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-orange-600">Not Delivered</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;