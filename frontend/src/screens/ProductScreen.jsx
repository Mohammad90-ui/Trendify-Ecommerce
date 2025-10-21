import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import { useAddToWishlistMutation } from '../slices/usersApiSlice';
import { addToCart } from '../slices/cartSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();
  const [addToWishlist, { isLoading: loadingWishlist }] = useAddToWishlistMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const addToWishlistHandler = async () => {
    if (!userInfo) {
      toast.error('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }
    
    try {
      await addToWishlist(productId).unwrap();
      toast.success('Product added to wishlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review submitted');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/" className="text-primary hover:underline mb-4 inline-block">
        &larr; Go Back
      </Link>

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {/* Product Image */}
            <div className="col-span-1">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Product Info */}
            <div className="col-span-1">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
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
              <p className="text-xl font-bold mb-2">${product.price}</p>
              <p className="text-gray-700 mb-4">{product.description}</p>
            </div>

            {/* Add to Cart */}
            <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
              <div className="border-b pb-2 mb-2">
                <div className="flex justify-between mb-2">
                  <span>Price:</span>
                  <span className="font-bold">${product.price}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Status:</span>
                  <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {product.countInStock > 0 && (
                <div className="mb-4">
                  <label htmlFor="qty" className="block mb-2">Quantity</label>
                  <select
                    id="qty"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed mb-2"
                disabled={product.countInStock === 0}
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
              
              <button
                className="w-full border border-primary text-primary py-2 px-4 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={addToWishlistHandler}
                disabled={loadingWishlist}
              >
                {loadingWishlist ? 'Adding...' : 'Add to Wishlist'}
              </button>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                {product.reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review._id} className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex items-center mb-2">
                          <strong className="mr-2">{review.name}</strong>
                          <div className="flex">
                            {[...Array(5)].map((_, index) => {
                              const starValue = index + 1;
                              return (
                                <svg
                                  key={index}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${starValue <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              );
                            })}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                {userInfo ? (
                  <form onSubmit={submitReviewHandler}>
                    <div className="mb-4">
                      <label htmlFor="rating" className="block mb-2">Rating</label>
                      <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                        required
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="comment" className="block mb-2">Comment</label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows="4"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={loadingReview}
                    >
                      {loadingReview ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-600">
                    Please <Link to="/login" className="text-primary hover:underline">sign in</Link> to write a review
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductScreen;