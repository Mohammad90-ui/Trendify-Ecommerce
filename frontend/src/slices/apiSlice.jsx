import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://trendify-ecommerce-1.onrender.com',
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/api/users/refresh', api, extraOptions);
    if (refreshResult.data) {
      // Retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult.error.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.';
      }
      // If refresh fails, logout the user
      api.dispatch(logout());
      return refreshResult;
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
