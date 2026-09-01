import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-harbor-800/95 backdrop-blur text-sand-50 border-b border-harbor-600">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          Stay<span className="text-gold-500">Nest</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="hover:text-aqua-400 transition-colors">Explore</Link>
          {user?.isHost && (
            <Link to="/host/dashboard" className="hover:text-aqua-400 transition-colors">Host dashboard</Link>
          )}
          {user && (
            <Link to="/my-bookings" className="hover:text-aqua-400 transition-colors">My trips</Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-aqua-300">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="px-3 py-1.5 rounded-full border border-harbor-600 hover:border-gold-500 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1.5 rounded-full hover:bg-harbor-700 transition-colors">Log in</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-full bg-gold-500 text-harbor-900 font-medium hover:bg-gold-600 transition-colors">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
