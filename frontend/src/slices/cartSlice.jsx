import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Stripe' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Calculate prices
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      
      // Calculate shipping price (free shipping for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Calculate tax price (15% tax)
      state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
      
      // Calculate total price
      state.totalPrice = (
        state.itemsPrice +
        state.shippingPrice +
        state.taxPrice
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      
      // Calculate prices
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
      
      // Calculate shipping price (free shipping for orders over $100)
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      
      // Calculate tax price (15% tax)
      state.taxPrice = Number((0.15 * state.itemsPrice).toFixed(2));
      
      // Calculate total price
      state.totalPrice = (
        state.itemsPrice +
        state.shippingPrice +
        state.taxPrice
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;