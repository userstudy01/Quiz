import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard'; 
import Questions from './pages/Questions'; 
import Candidates from './pages/Candidates';
import Login from './pages/Login'; // 🔥 Ye naya page import kiya hai

// Layout component banaya taaki Login page par Sidebar na dikhe
function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex bg-white min-h-screen">
      {/* Agar page /login nahi hai, tabhi Sidebar dikhao */}
      {!isLoginPage && <Sidebar />}
      
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/candidates" element={<Candidates />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;