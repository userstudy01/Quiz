import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/auth/authSlice';
import { fetchQuestions } from '../features/api';
import ModuleGrid from '../components/dashboard/ModuleGrid';
import QuizView from '../components/dashboard/QuizView';

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    const getQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
      } catch (error) { console.error("Failed to fetch questions", error); }
      finally { setIsLoading(false); }
    };
    getQuestions();
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-medium text-[#1A2533] bg-[#E5F1F0]">Preparing Environment...</div>;

  return (
    <>
      {!selectedRound ? (
        <ModuleGrid 
          user={user} 
          questions={questions} 
          onModuleSelect={setSelectedRound} 
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