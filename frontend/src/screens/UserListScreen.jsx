import React from 'react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery, useDeleteUserMutation } from '../slices/usersApiSlice';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        refetch();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      {loadingDelete && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
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
                <th className="py-3 px-4 text-left">NAME</th>
                <th className="py-3 px-4 text-left">EMAIL</th>
                <th className="py-3 px-4 text-center">ADMIN</th>
                <th className="py-3 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{user._id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">
                    <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                      {user.email}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {user.isAdmin ? (
                      <FaCheck className="inline text-green-500" />
                    ) : (
                      <FaTimes className="inline text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center space-x-3">
                      <Link to={`/admin/user/${user._id}/edit`} className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loadingDelete}
                      >
                        <FaTrash />
                      </button>
                    </div>
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

export default UserListScreen;