import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wrap any route element with this to require login (optionally, host status)
export default function ProtectedRoute({ children, hostOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-10 text-center text-harbor-700">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (hostOnly && !user.isHost) return <Navigate to="/" replace />;

  return children;
}
