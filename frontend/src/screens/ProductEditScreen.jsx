import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      }).unwrap();
      toast.success('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success('Image uploaded successfully');
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to="/admin/productlist" className="flex items-center text-primary mb-4">
        <FaArrowLeft className="mr-1" /> Go Back
      </Link>

      <div className="flex justify-center">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

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
                <label htmlFor="price" className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  id="price"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 mb-2">Image</label>
                <input
                  type="text"
                  id="image"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
                <input
                  type="file"
                  id="image-file"
                  className="mt-2"
                  onChange={uploadFileHandler}
                />
                {loadingUpload && (
                  <div className="flex justify-center items-center h-8 mt-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="brand" className="block text-gray-700 mb-2">Brand</label>
                <input
                  type="text"
                  id="brand"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="countInStock" className="block text-gray-700 mb-2">Count In Stock</label>
                <input
                  type="number"
                  id="countInStock"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  id="category"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition-colors duration-300"
                disabled={loadingUpdate}
              >
                {loadingUpdate ? 'Updating...' : 'Update'}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductEditScreen;