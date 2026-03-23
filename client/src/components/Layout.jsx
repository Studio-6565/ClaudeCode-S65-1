import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/projects', label: 'Projects' },
  { to: '/schedule', label: 'Calendar' },
  { to: '/crew', label: 'Crew' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/clients', label: 'Clients' },
];

export default function Layout({ children }) {
  const { adminUser, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logoutAdmin();
    navigate('/login');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111' }}>
      {/* Top Nav */}
      <nav style={{ backgroundColor: '#000', borderBottom: '1px solid #1f1f1f', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '56px', gap: '16px' }}>

            {/* Logo */}
            <NavLink to="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.04em' }}>studio</span>
              <span style={{ color: '#ED1C24', fontWeight: 900, fontSize: '0.8rem' }}>65</span>
            </NavLink>

            <div style={{ width: '1px', height: '20px', backgroundColor: '#2a2a2a', flexShrink: 0 }} />

            {/* Desktop nav */}
            <div className="hidden md:flex" style={{ gap: '2px', flex: 1 }}>
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  style={({ isActive }) => ({
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    backgroundColor: isActive ? '#ED1C24' : 'transparent',
                    color: isActive ? '#fff' : '#888',
                  })}
                  onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { if (e.currentTarget.style.backgroundColor !== 'rgb(237, 28, 36)') e.currentTarget.style.color = '#888'; }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div style={{ flex: 1 }} className="md:hidden" />

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <span style={{ fontSize: '12px', color: '#555' }} className="hidden md:block">{adminUser?.name}</span>
              <button
                onClick={handleLogout}
                className="hidden md:block"
                style={{ fontSize: '12px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#555'}
              >
                Sign out
              </button>

              {/* Hamburger - mobile */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="md:hidden"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: '4px', fontSize: '20px' }}
              >
                {menuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ backgroundColor: '#0a0a0a', borderTop: '1px solid #1f1f1f', padding: '8px 20px 16px' }}
               className="md:hidden">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMenuOpen(false)}
                style={({ isActive }) => ({
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#fff' : '#888',
                  backgroundColor: isActive ? '#ED1C24' : 'transparent',
                  marginBottom: '2px',
                })}
              >
                {item.label}
              </NavLink>
            ))}
            <div style={{ borderTop: '1px solid #222', marginTop: '8px', paddingTop: '8px' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', fontSize: '14px', padding: '8px 12px' }}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>
        {children}
      </main>
    </div>
  );
}
