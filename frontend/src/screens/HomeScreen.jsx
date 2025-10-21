import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Discover Amazing Products",
      subtitle: "Shop the latest trends with unbeatable prices",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&crop=center",
      cta: "Shop Now"
    },
    {
      title: "Quality You Can Trust",
      subtitle: "Premium products from trusted brands",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop&crop=center",
      cta: "Explore"
    },
    {
      title: "Fast & Free Shipping",
      subtitle: "Get your orders delivered quickly",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1200&h=600&fit=crop&crop=center",
      cta: "Learn More"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addToCartHandler = (product) => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-secondary-50 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] overflow-hidden hero-pattern">

        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-700/60"></div>
            <div className="container mx-auto px-4 h-full flex items-center relative z-10">
              <div className="max-w-2xl text-white animate-slide-up">
                <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-primary-100">
                  {slide.subtitle}
                </p>
                <Link to="/#products" className="btn-primary text-lg px-8 py-4 animate-bounce-subtle">
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Search Results Header */}
      {keyword && (
        <div className="bg-secondary-50 py-8 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-secondary-900 mb-2">
                  Search Results for "{keyword}"
                </h2>
                <p className="text-secondary-600">
                  {data?.products?.length || 0} products found
                </p>
              </div>
              <Link to="/" className="btn-secondary">
                Clear Search
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section id="products" className="py-16 bg-white transition-colors duration-300">
        <div className="container mx-auto px-4">
          {!keyword && (
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Discover our carefully curated collection of premium products at unbeatable prices
              </p>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-secondary-600 font-medium">Loading amazing products...</p>
            </div>
          ) : error ? (
            <div className="bg-accent-50 border border-accent-200 text-accent-800 px-6 py-4 rounded-xl max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <strong className="font-semibold">Oops!</strong>
              </div>
              <p>{error?.data?.message || error.error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data.products.map((product, index) => (
                  <div
                    key={product._id}
                    className="card group animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product._id}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </Link>

                      {/* Quick Actions Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Link
                            to={`/product/${product._id}`}
                            className="bg-white text-secondary-900 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => addToCartHandler(product)}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                            disabled={product.countInStock === 0}
                          >
                            {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>

                      {/* Stock Status Badge */}
                      {product.countInStock === 0 && (
                        <div className="absolute top-4 left-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Out of Stock
                        </div>
                      )}

                      {/* Sale Badge */}
                      {product.price < 100 && (
                        <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Sale
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                              <svg
                                key={index}
                                className={`h-4 w-4 ${
                                  starValue <= product.rating ? 'text-warning-400' : 'text-secondary-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            );
                          })}
                        </div>
                        <span className="text-sm text-secondary-600 ml-2">
                          ({product.numReviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-primary-600">
                            ${product.price}
                          </span>
                          {product.price < 100 && (
                            <span className="text-sm text-secondary-500 line-through">
                              ${(product.price * 1.2).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCartHandler(product)}
                          className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={product.countInStock === 0}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Button */}
                    {data.page > 1 && (
                      <Link
                        to={keyword ? `/search/${keyword}/page/${data.page - 1}` : `/page/${data.page - 1}`}
                        className="flex items-center px-4 py-2 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Previous
                      </Link>
                    )}

                    {/* Page Numbers */}
                    <div className="flex space-x-1">
                      {[...Array(data.pages).keys()].map((x) => {
                        const pageNum = x + 1;
                        const isCurrentPage = pageNum === data.page;

                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === data.pages ||
                          (pageNum >= data.page - 1 && pageNum <= data.page + 1)
                        ) {
                          return (
                            <Link
                              key={pageNum}
                              to={keyword ? `/search/${keyword}/page/${pageNum}` : `/page/${pageNum}`}
                              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                isCurrentPage
                                  ? 'bg-primary-600 text-white shadow-medium'
                                  : 'bg-white text-secondary-700 border border-secondary-300 hover:bg-secondary-50'
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        } else if (
                          (pageNum === data.page - 2 && data.page > 3) ||
                          (pageNum === data.page + 2 && data.page < data.pages - 2)
                        ) {
                          return (
                            <span key={pageNum} className="px-2 py-2 text-secondary-500">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Next Button */}
                    {data.page < data.pages && (
                      <Link
                        to={keyword ? `/search/${keyword}/page/${data.page + 1}` : `/page/${data.page + 1}`}
                        className="flex items-center px-4 py-2 text-secondary-700 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-50 transition-colors duration-200"
                      >
                        Next
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Product Showcase Section */}
      {!keyword && data?.products?.length > 0 && (
        <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-secondary-900 mb-4 animate-slide-up">
                Featured Collection
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                Handpicked items that define style and quality
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {data.products.slice(0, 4).map((product, index) => (
                <div
                  key={product._id}
                  className="card group animate-fade-in hover:shadow-large transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <Link to={`/product/${product._id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Link
                        to={`/product/${product._id}`}
                        className="bg-white text-secondary-900 px-6 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors duration-200 animate-bounce-subtle"
                      >
                        View Product
                      </Link>
                    </div>

                    {/* Sale Badge */}
                    {product.price < 100 && (
                      <div className="absolute top-4 right-4 bg-success-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600">
                        ${product.price}
                      </span>
                      <button
                        onClick={() => addToCartHandler(product)}
                        className="bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition-colors duration-200"
                        disabled={product.countInStock === 0}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!keyword && (
        <section className="py-16 bg-secondary-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-display font-bold text-secondary-900 mb-4 animate-slide-up">
                Why Choose Trendify?
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                We're committed to providing the best shopping experience with quality products and exceptional service
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center card p-8 animate-fade-in" style={{ animationDelay: '0ms' }}>
                <div
                  className="w-full h-32 bg-cover bg-center rounded-lg mb-6"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=200&fit=crop&crop=center')`
                  }}
                ></div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Free Shipping</h3>
                <p className="text-secondary-600">Free delivery on all orders over $50</p>
              </div>

              <div className="text-center card p-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <div
                  className="w-full h-32 bg-cover bg-center rounded-lg mb-6"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&crop=center')`
                  }}
                ></div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">Quality Guarantee</h3>
                <p className="text-secondary-600">100% satisfaction guarantee on all products</p>
              </div>

              <div className="text-center card p-8 animate-fade-in" style={{ animationDelay: '400ms' }}>
                <div
                  className="w-full h-32 bg-cover bg-center rounded-lg mb-6"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&crop=center')`
                  }}
                ></div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2">24/7 Support</h3>
                <p className="text-secondary-600">Round the clock customer support</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomeScreen;
