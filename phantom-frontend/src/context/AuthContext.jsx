import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      api.get('/api/auth/me')
        .then(response => {
          const verifiedUser = {
            id: response.data._id,
            name: response.data.name,
            role: response.data.role
          };
          localStorage.setItem('user', JSON.stringify(verifiedUser));
          setUser(verifiedUser);
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password, role) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password, role });
      
      localStorage.setItem('token', response.data.token);
      
      const userData = {
        id: response.data._id,
        name: response.data.name,
        role: response.data.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      
      localStorage.setItem('token', response.data.token);
      
      const userData = {
        id: response.data._id,
        name: response.data.name,
        role: response.data.role
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, role: userData.role };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

      const headings = { fontFamily: '"Clash Display", ui-sans-serif, system-ui, sans-serif' };
    const body = { fontFamily: '"General Sans", ui-sans-serif, system-ui, sans-serif' };
    const mono = { fontFamily: '"JetBrains Mono", ui-monospace, monospace' };
    return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};