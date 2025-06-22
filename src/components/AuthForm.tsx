import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus,
  LogIn,
  AlertCircle,
  Loader2,
  Heart
} from 'lucide-react';

export const AuthForm: React.FC = () => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    age: '',
    gender: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isSignUp && !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      let result;
      if (isSignUp) {
        result = await signUp(
          formData.username,
          formData.password,
          formData.fullName,
          formData.age ? parseInt(formData.age) : undefined,
          formData.gender || undefined
        );
      } else {
        result = await signIn(formData.username, formData.password);
      }

      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-eldercare-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo-Photoroom.png" 
              alt="ElderCare Logo" 
              className="w-24 h-24 object-contain"
            />
          </div>
          <h1 className="text-3xl font-nunito font-bold text-eldercare-secondary mb-2">
            Welcome to ElderCare
          </h1>
          <p className="text-base font-opensans text-eldercare-text italic">
            "Because our elders deserve the best."
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-lg border border-eldercare-primary/20 p-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-2 bg-eldercare-primary/10 rounded-full">
              {isSignUp ? (
                <UserPlus size={24} className="text-eldercare-primary" aria-hidden="true" />
              ) : (
                <LogIn size={24} className="text-eldercare-primary" aria-hidden="true" />
              )}
            </div>
            <h2 className="text-2xl font-nunito font-bold text-eldercare-secondary">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-opensans text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-base font-opensans font-medium text-eldercare-secondary mb-2">
                Username *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-eldercare-text-light" aria-hidden="true" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-base font-opensans font-medium text-eldercare-secondary mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-eldercare-text-light" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-eldercare-text-light hover:text-eldercare-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign Up Additional Fields */}
            {isSignUp && (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-base font-opensans font-medium text-eldercare-secondary mb-2">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-base font-opensans font-medium text-eldercare-secondary mb-2">
                    Age (Optional)
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    placeholder="Enter your age"
                    disabled={loading}
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-base font-opensans font-medium text-eldercare-secondary mb-2">
                    Gender (Optional)
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-base font-opensans border-2 border-eldercare-primary/20 rounded-lg focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:border-eldercare-primary transition-all duration-200"
                    disabled={loading}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-eldercare-primary hover:bg-eldercare-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-opensans font-bold text-lg min-h-touch transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-eldercare-primary focus:ring-offset-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden="true" />
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  {isSignUp ? (
                    <UserPlus size={20} aria-hidden="true" />
                  ) : (
                    <LogIn size={20} aria-hidden="true" />
                  )}
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign In/Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-base font-opensans text-eldercare-text">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
                setFormData({
                  username: '',
                  password: '',
                  fullName: '',
                  age: '',
                  gender: ''
                });
              }}
              className="mt-2 text-eldercare-primary hover:text-eldercare-primary-dark font-opensans font-semibold text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-eldercare-primary rounded px-2 py-1"
              disabled={loading}
            >
              {isSignUp ? 'Sign In Instead' : 'Create New Account'}
            </button>
          </div>

          {/* Demo Credentials */}
          {!isSignUp && (
            <div className="mt-6 p-4 bg-eldercare-background/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Heart size={16} className="text-eldercare-primary mt-1 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-opensans text-eldercare-text">
                    <strong>Demo Login:</strong><br />
                    Username: <code className="bg-gray-100 px-1 rounded">shelly</code><br />
                    Password: <code className="bg-gray-100 px-1 rounded">password123</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Supabase Status */}
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle size={16} className="text-green-600 mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-opensans text-green-700">
                  <strong>✅ Connected to Supabase!</strong><br />
                  Your data will be saved securely in the database.
                </p>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-4 p-4 bg-eldercare-background/50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Heart size={16} className="text-eldercare-primary mt-1 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-opensans text-eldercare-text">
                  <strong>Need help?</strong> Contact your caregiver or call our support line at{' '}
                  <a 
                    href="tel:1-800-ELDERCARE" 
                    className="text-eldercare-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-eldercare-primary rounded"
                  >
                    1-800-ELDERCARE
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};