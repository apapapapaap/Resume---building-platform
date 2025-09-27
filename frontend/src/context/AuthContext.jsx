import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';
import { setToken, removeToken, isAuthenticated } from '../utils/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user for test routes
const getMockTestUser = () => ({
  id: 1,
  email: 'test@example.com',
  fullName: 'Test User',
  isTestUser: true,
  created_at: new Date().toISOString()
});

// Helper function to check if current route is a test route
const isTestRoute = (path = window.location.pathname) => {
  const testRoutes = ['/test', '/working-form', '/resume-test.html', '/simple-test.html'];
  return testRoutes.some(route => path.startsWith(route)) || 
         path.startsWith('/test-');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const currentPath = window.location.pathname;
    
    console.log('🔍 AuthContext initializing for path:', currentPath);
    
    // COMPLETE BYPASS FOR TEST ROUTES
    if (isTestRoute(currentPath)) {
      console.log('🎯 Test route detected - providing mock user:', currentPath);
      setUser(getMockTestUser());
      setLoading(false);
      return;
    }

    // Normal authentication flow for non-test routes
    try {
      if (isAuthenticated()) {
        console.log('🔑 Token found - fetching user profile...');
        await fetchUser();
      } else {
        console.log('🚫 No valid token found');
        setLoading(false);
      }
    } catch (error) {
      console.error('🚨 Auth initialization error:', error);
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      console.log('📡 Fetching user profile from API...');
      
      // Add timeout to prevent hanging API calls
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.warn('⏰ API request timed out after 5 seconds');
      }, 5000);

      const response = await API.get('/auth/profile', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('✅ User profile fetched successfully:', response.data);
      setUser(response.data);
      
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error.message);
      
      // Only logout if not on test route and not an abort error
      if (!isTestRoute() && error.name !== 'AbortError') {
        console.log('🔄 Logging out due to fetch error...');
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await API.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      console.log('✅ Login successful:', user);
      return { success: true };
    } catch (error) {
      console.error('❌ Login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      console.log('📝 Attempting registration for:', email);
      const response = await API.post('/auth/register', { 
        email, 
        password, 
        fullName 
      });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);
      console.log('✅ Registration successful:', user);
      return { success: true };
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    const currentPath = window.location.pathname;
    
    // Prevent logout on test routes
    if (isTestRoute(currentPath)) {
      console.log('🎯 Skipping logout on test route:', currentPath);
      return;
    }
    
    console.log('👋 Logging out user...');
    removeToken();
    setUser(null);
  };

  // Enhanced isAuthenticated that considers test routes
  const isUserAuthenticated = () => {
    if (isTestRoute()) {
      return true; // Always authenticated on test routes
    }
    return !!user;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: isUserAuthenticated()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
