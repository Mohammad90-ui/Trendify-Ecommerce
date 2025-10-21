import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation, useCreateProductMutation } from '../slices/productsApiSlice';
import { toast } from 'react-toastify';

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  
  const { data, isLoading, error, refetch } = useGetProductsQuery({ pageNumber });
  
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        refetch();
        toast.success('Product deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
        toast.success('Product created successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-primary text-white px-4 py-2 rounded flex items-center hover:bg-primary-dark transition-colors duration-300"
          disabled={loadingCreate}
        >
          <FaPlus className="mr-2" /> Create Product
        </button>
      </div>
      
      {loadingDelete && (
        <div className="flex justify-center items-center h-12">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
      
      {loadingCreate && (
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
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">NAME</th>
                  <th className="py-3 px-4 text-left">PRICE</th>
                  <th className="py-3 px-4 text-left">CATEGORY</th>
                  <th className="py-3 px-4 text-left">BRAND</th>
                  <th className="py-3 px-4 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">{product._id}</td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">${product.price}</td>
                    <td className="py-3 px-4">{product.category}</td>
                    <td className="py-3 px-4">{product.brand}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <Link to={`/admin/product/${product._id}/edit`} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => deleteHandler(product._id)}
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
          
          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                {[...Array(data.pages).keys()].map((x) => (
                  <Link
                    key={x + 1}
                    to={`/admin/productlist/${x + 1}`}
                    className={`px-4 py-2 border ${x + 1 === data.page ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                  >
                    {x + 1}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProductListScreen;