import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './context/AuthContext';
import EditPost from './pages/EditPosts';
import Home from './pages/Home';
import './App.css'
import Leaderboard from './pages/Leaderboard';
import PostPage from './pages/PostPage';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/editPost/:id" element={<EditPost />} />
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
