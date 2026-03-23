import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⬛' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/crew', label: 'Crew', icon: '🎬' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/schedule', label: 'Schedule', icon: '📅' },
  { to: '/invoices', label: 'Invoices', icon: '💰' },
];

export default function Layout({ children }) {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutAdmin();
    navigate('/login');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 flex flex-col shrink-0" style={{ backgroundColor: '#000' }}>
        <div className="p-5 border-b border-zinc-800">
          {/* Studio 65 logo mark */}
          <div className="flex items-baseline gap-0.5">
            <span className="text-white font-black tracking-tight" style={{ fontSize: '1.35rem', letterSpacing: '-0.03em' }}>studio</span>
            <span className="font-black" style={{ fontSize: '0.85rem', color: '#ED1C24', WebkitTextStroke: '0.5px #ED1C24', letterSpacing: '-0.01em' }}>65</span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{adminUser?.name}</p>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                }`
              }
              style={({ isActive }) => isActive ? { backgroundColor: '#ED1C24' } : {}}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
