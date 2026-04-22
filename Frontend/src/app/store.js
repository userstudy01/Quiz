// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     // Future main hum questionsReducer aur evaluationReducer bhi yahan add karenge
//   },
// });

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// 1. Combine all reducers into one
const appReducer = combineReducers({
  auth: authReducer,
  // Future slices: questions: questionsReducer,
});

// 2. Create a Root Reducer to handle global reset
const rootReducer = (state, action) => {
  // If the action is logout, we set state to 'undefined'
  // This forces Redux to reset every single slice to its initial state
  if (action.type === 'auth/logoutUser') {
    state = undefined;
    localStorage.removeItem('user'); // Double check removal
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});