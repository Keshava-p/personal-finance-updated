import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { auth } from '../services/api.js';

interface User {
  id: string;
  name: string;
  email: string;
  // Add other user fields as needed
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (name: string, email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await auth.getMe();
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            // If getMe fails, clear the invalid token
            localStorage.removeItem('token');
            setUser(null);
          }
        } else {
          // No token, ensure user is set to null
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        // Only set loading to false after we've completed the auth check
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const data = await auth.login(email, password);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        // If user data is included in the login response, use it
        if (data.user) {
          setUser(data.user);
        } else {
          // Otherwise, fetch the user data
          const userData = await auth.getMe();
          setUser(userData);
        }
        return { success: true, token: data.token, user: data.user };
      }
      return { 
        success: false, 
        error: data?.error || 'Invalid response from server' 
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed. Please try again.' 
      };
    }
  };

  const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  window.location.href = "/login";  // <-- IMMEDIATE REDIRECT
};


  const register = async (name: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await auth.register({ name, email, password });
      // After successful registration, log the user in automatically
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        // If user data is included in the registration response, use it
        if (response.user) {
          setUser(response.user);
          return { 
            success: true, 
            token: response.token, 
            user: response.user 
          };
        } else {
          // Otherwise, fetch the user data
          const userData = await auth.getMe();
          setUser(userData);
          return { 
            success: true, 
            token: response.token, 
            user: userData 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'Registration failed: Invalid response from server' 
      };
    } catch (error: any) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading
  }), [user, login, register, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};