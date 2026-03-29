import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages import kar rahe hain (Make sure ye pages src/pages/ folder main hon)
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-blue-500/30 font-sans">
        <Routes>
          {/* Routes ab active hain */}
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;