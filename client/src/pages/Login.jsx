import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      loginAdmin(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#000' }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-baseline justify-center gap-1 mb-8">
          <span className="text-white font-black" style={{ fontSize: '2.5rem', letterSpacing: '-0.04em' }}>studio</span>
          <span className="font-black" style={{ fontSize: '1.4rem', color: '#ED1C24', WebkitTextStroke: '0.5px #ED1C24', letterSpacing: '-0.02em' }}>65</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Sign in</h2>
          <p className="text-sm text-slate-500 mb-6">Admin portal</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#ED1C24' }}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': '#ED1C24' }}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#ED1C24' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Default: admin@studio.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
