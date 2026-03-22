import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user')); } catch { return null; }
  });
  const [crewUser, setCrewUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('crew_user')); } catch { return null; }
  });

  function loginAdmin(token, user) {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setAdminUser(user);
  }

  function logoutAdmin() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
  }

  function loginCrew(token, crew) {
    localStorage.setItem('crew_token', token);
    localStorage.setItem('crew_user', JSON.stringify(crew));
    setCrewUser(crew);
  }

  function logoutCrew() {
    localStorage.removeItem('crew_token');
    localStorage.removeItem('crew_user');
    setCrewUser(null);
  }

  return (
    <AuthContext.Provider value={{ adminUser, crewUser, loginAdmin, logoutAdmin, loginCrew, logoutCrew }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
