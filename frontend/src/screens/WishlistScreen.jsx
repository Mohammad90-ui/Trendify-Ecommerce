import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../slices/usersApiSlice';
import { addToCart } from '../slices/cartSlice';

const WishlistScreen = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { data: wishlistItems, isLoading, error, refetch } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const removeFromWishlistHandler = async (productId) => {
    try {
      await removeFromWishlist(productId).unwrap();
      refetch();
      toast.success('Product removed from wishlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Product added to cart');
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>

      {!userInfo ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <p>Please <Link to="/login" className="text-primary font-bold hover:underline">sign in</Link> to view your wishlist.</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error?.data?.message || error.error}</span>
        </div>
      ) : wishlistItems?.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
          <p>Your wishlist is empty.</p>
          <Link to="/" className="text-primary font-bold hover:underline">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems?.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-lg font-semibold mb-2 hover:text-primary transition-colors duration-300">
                    {product.name}
                  </h2>
                </Link>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    return (
                      <svg
                        key={index}
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 ${starValue <= product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    );
                  })}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.numReviews} reviews)
                  </span>
                </div>
                <p className="text-xl font-bold text-primary mb-2">${product.price}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCartHandler(product)}
                    className="flex-1 bg-primary text-white py-1 px-3 rounded hover:bg-primary-dark text-sm"
                    disabled={product.countInStock === 0}
                  >
                    {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => removeFromWishlistHandler(product._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishlistScreen;