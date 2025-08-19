import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate login process
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === 'portfolio') {
        // Successful login logic
        console.log('Login successful');
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl transform rotate-6"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="bg-gray-800/50 p-4 rounded-full">
                  <FaShieldAlt className="h-12 w-12 text-blue-400" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 mt-2">Portfolio Management System</p>
        </div>

        {/* Login form */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="Enter your username"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 ${isLoading
                  ? 'bg-blue-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 hover:shadow-lg'
                  }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </div>
                ) : (
                  'Login to Dashboard'
                )}
              </button>
            </form>
          </div>

          {/* Security footer */}
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-t border-white/10 p-4 text-center">
            <div className="flex items-center justify-center text-sm text-gray-400">
              <FaShieldAlt className="h-4 w-4 mr-1 text-green-500" />
              Secure Admin Portal
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Portfolio Admin. Restricted Access.
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
