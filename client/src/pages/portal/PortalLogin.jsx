import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

export default function PortalLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginCrew } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/portal/login', { portal_code: code });
      loginCrew(res.data.token, res.data.crew);
      navigate('/portal/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">Crew Portal</h1>
        <p className="text-sm text-slate-500 mb-6">Enter your access code to log in</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Access Code</label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-center text-lg tracking-widest font-mono"
              placeholder="Enter your code"
              required
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-900 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
        <p className="text-xs text-slate-400 mt-4 text-center">
          Contact your studio manager for your access code
        </p>
      </div>
    </div>
  );
}
