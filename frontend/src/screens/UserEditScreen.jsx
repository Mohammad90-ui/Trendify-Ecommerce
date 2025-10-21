import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetUserDetailsQuery, useUpdateUserByAdminMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { data: user, isLoading, error, refetch } = useGetUserDetailsQuery(userId);
  
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserByAdminMutation();
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId,
        name,
        email,
        isAdmin,
      }).unwrap();
      toast.success('User updated successfully');
      refetch();
      navigate('/admin/userlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  
  return (
    <>
      <Link to="/admin/userlist" className="flex items-center text-primary mb-4">
        <FaArrowLeft className="mr-1" /> Go Back
      </Link>
      
      <div className="flex justify-center">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit User</h1>
          
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
                  required
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
                  required
                />
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAdmin"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                  />
                  <label htmlFor="isAdmin" className="ml-2 block text-gray-700">
                    Is Admin
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300 flex justify-center"
                disabled={loadingUpdate}
              >
                {loadingUpdate ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Update'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default UserEditScreen;