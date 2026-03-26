import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Subscribe from './pages/Subscribe';
import Charities from './pages/Charities';
import Draws from './pages/Draws';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-purple" /></div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/subscribe" element={<PrivateRoute><Subscribe /></PrivateRoute>} />
          <Route path="/charities" element={<PrivateRoute><Charities /></PrivateRoute>} />
          <Route path="/draws" element={<PrivateRoute><Draws /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminPanel /></AdminRoute></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
