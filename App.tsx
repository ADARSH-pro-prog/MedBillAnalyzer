import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Results from './pages/Results';
import Layout from './components/Layout';
import { ROUTES } from './constants';
import { User, LoginResponse } from './types';
import { apiFetch } from './services/api';

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 dark:text-white">Loading...</div>;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const profileData = await apiFetch<{profile: User}>('/profile', { token, method: 'GET' });
          setUser(profileData.profile);
        } catch (error) {
          console.error("Session expired", error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = (data: LoginResponse) => {
    localStorage.setItem('token', data.access_token);
    setUser({ user_id: 0, username: data.username }); // ID gets updated on next profile fetch or we can use 0 for now
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      <Router>
        <Layout user={user} onLogout={logout}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.REGISTER} element={<Register />} />
            
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.UPLOAD}
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.RESULTS}
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;