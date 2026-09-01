import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', isHost: false });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl text-harbor-900 mb-6">Create your account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text" required placeholder="Full name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15 outline-none focus:border-gold-500"
        />
        <input
          type="email" required placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15 outline-none focus:border-gold-500"
        />
        <input
          type="password" required minLength={6} placeholder="Password (6+ characters)"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-harbor-800/15 outline-none focus:border-gold-500"
        />
        <label className="flex items-center gap-2 text-sm text-harbor-700">
          <input
            type="checkbox" checked={form.isHost}
            onChange={(e) => setForm({ ...form, isHost: e.target.checked })}
          />
          I want to host stays on StayNest
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit" disabled={submitting}
          className="w-full py-3 rounded-xl bg-harbor-900 text-sand-50 font-semibold hover:bg-harbor-800 transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-sm text-harbor-700">
        Already have an account? <Link to="/login" className="text-harbor-900 font-medium underline">Log in</Link>
      </p>
    </div>
  );
}
