import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

// Request main JWT token bhejne ke liye helper
const getAuthConfig = (thunkAPI) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};

// 1. Fetch all questions from backend
export const fetchQuestions = async () => {
  const response = await axios.get(API_URL + 'questions', getAuthConfig());
  return response.data;
};

// 2. Submit evaluation (scores) to backend
export const submitEvaluation = async (evaluationData) => {
  const response = await axios.post(API_URL + 'evaluations', evaluationData, getAuthConfig());
  return response.data;
};

// client/src/features/api.js ke bottom main add karo:

export const fetchProgress = async (moduleName) => {
  const response = await axios.get(API_URL + 'evaluations/' + encodeURIComponent(moduleName), getAuthConfig());
  return response.data;
};

export const saveProgress = async (data) => {
  const response = await axios.post(API_URL + 'evaluations/save', data, getAuthConfig());
  return response.data;
};