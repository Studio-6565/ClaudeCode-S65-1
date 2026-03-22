import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/portal/dashboard', label: 'Dashboard' },
  { to: '/portal/projects', label: 'My Projects' },
  { to: '/portal/schedule', label: 'My Schedule' },
  { to: '/portal/availability', label: 'Availability' },
];

export default function PortalLayout({ children }) {
  const { crewUser, logoutCrew } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logoutCrew();
    navigate('/portal');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-lg">Crew Portal</span>
          {crewUser && <span className="text-slate-300 text-sm ml-3">Hi, {crewUser.name}</span>}
        </div>
        <nav className="flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-white/20 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="ml-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors">
            Sign out
          </button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
