// import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// // Har request main token bhejne ka interceptor
// API.interceptors.request.use((req) => {
//   const adminInfo = JSON.parse(localStorage.getItem('adminUser'));
//   if (adminInfo?.token) {
//     req.headers.Authorization = `Bearer ${adminInfo.token}`;
//   }
//   return req;
// });

// export default API;

import axios from 'axios';

// 🔥 LOCALHOST KO HATAKAR VERCEL WALA LINK DAAL DIYA HAI
const API = axios.create({ baseURL: 'https://quiz-kappa-dusky.vercel.app/api' });

// Har request main token bhejne ka interceptor
API.interceptors.request.use((req) => {
  const adminInfo = JSON.parse(localStorage.getItem('adminUser'));
  if (adminInfo?.token) {
    req.headers.Authorization = `Bearer ${adminInfo.token}`;
  }
  return req;
});

export default API;