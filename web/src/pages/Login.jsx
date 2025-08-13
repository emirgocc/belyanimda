import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { APP_CONFIG } from '../config/config';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password) {
      toast.error('Kullanıcı adı ve şifre gereklidir');
      return;
    }

    setIsLoggingIn(true);
    
    try {
      const result = await login(credentials);
      
      if (result.success) {
        toast.success('Giriş başarılı');
      } else {
        toast.error(result.message || 'Giriş başarısız');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">KB</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Panel
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {APP_CONFIG.APP_NAME}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Kullanıcı Adı
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input-field mt-1"
                placeholder="Kullanıcı adınızı girin"
                value={credentials.username}
                onChange={handleInputChange}
                disabled={isLoggingIn}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                placeholder="Şifrenizi girin"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={isLoggingIn}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full btn-primary py-3 text-lg"
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Giriş yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Geliştirme Ortamı</p>
              <p className="text-xs text-blue-600 mt-1">
                Kullanıcı adı: <code className="bg-blue-100 px-1 rounded">admin</code>
              </p>
              <p className="text-xs text-blue-600">
                Şifre: <code className="bg-blue-100 px-1 rounded">admin123</code>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
