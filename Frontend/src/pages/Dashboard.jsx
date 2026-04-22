import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import { fetchQuestions } from '../features/api';
import authService from '../features/auth/authService'; // <-- ADD THIS
import axios from 'axios';

import ModuleGrid from '../components/dashboard/ModuleGrid';
import QuizView from '../components/dashboard/QuizView';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState(null);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setIsLoading(false);
      }
    };
    getQuestions();
  }, []);

//  const handleLogout = () => {
//   dispatch(logoutUser()); // This clears Redux AND LocalStorage
//   navigate('/login');
// }

const handleLogout = () => {
    // 1. Clear LocalStorage
    authService.logout();

    // 2. Clear Redux
    dispatch(logoutUser()); 

    // 3. Delete old token from Axios
    delete axios.defaults.headers.common['Authorization'];

    // 4. Force a hard refresh to physically wipe browser memory
    window.location.href = '/login';
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-[#1A2533] bg-[#E5F1F0]">Preparing Environment...</div>;

  return (
    <>
      {!selectedRound ? (
        <ModuleGrid 
          user={user} 
          questions={questions} 
          onModuleSelect={(roundName) => setSelectedRound(roundName)} 
          onLogout={handleLogout} 
        />
      ) : (
        <QuizView 
          user={user} 
          questions={questions} 
          selectedRound={selectedRound} 
          setSelectedRound={setSelectedRound} 
        />
      )}
    </>
  );
}