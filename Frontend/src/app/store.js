import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // Future main hum questionsReducer aur evaluationReducer bhi yahan add karenge
  },
});