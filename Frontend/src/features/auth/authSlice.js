import { createSlice } from '@reduxjs/toolkit';

// LocalStorage se user check karo (page refresh hone par session bachane ke liye)
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user ? user : null, // Agar local storage main hai toh set karo, warna null
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    // Yahan hum manual login/logout reducers bana rahe hain (Thunks baad main use kar sakte hain)
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload; // Payload main backend se aaya user object aur token hoga
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logoutUser: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    }
  },
});

export const { reset, loginSuccess, logoutUser } = authSlice.actions;
export default authSlice.reducer;