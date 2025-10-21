import React from 'react';
import { useGetOrdersQuery } from '../slices/ordersApiSlice';
import { Link } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error?.data?.message || error.error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">USER</th>
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="py-3 px-4 text-left">TOTAL</th>
                <th className="py-3 px-4 text-center">PAID</th>
                <th className="py-3 px-4 text-center">DELIVERED</th>
                <th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.user && order.user.name}</td>
                  <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-3 px-4">${order.totalPrice}</td>
                  <td className="py-3 px-4 text-center">
                    {order.isPaid ? (
                      <FaCheck className="inline text-green-500" />
                    ) : (
                      <FaTimes className="inline text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {order.isDelivered ? (
                      <FaCheck className="inline text-green-500" />
                    ) : (
                      <FaTimes className="inline text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-primary hover:underline"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;