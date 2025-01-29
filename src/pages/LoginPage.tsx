// LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
} from '../services/authFunction';
import { useAuth } from '../Context/AuthContext';
import logo from '../logo1.png'; // Import del logo

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      toast.success('Operazione avvenuta con successo!');
      navigate('/');
    } catch (error: any) {
      toast.error('Errore: ' + (error.message || ''));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Accesso con Google avvenuto con successo!');
      navigate('/');
    } catch (error: any) {
      toast.error('Errore: ' + (error.message || ''));
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLoginMode ? 'Accedi' : 'Registrati'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci la tua email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci la tua password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {isLoginMode ? 'Accedi' : 'Registrati'}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.2H42V20H24v8h11.3c-1.7 4.5-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.2l6.3-6.3C34.6 5.1 29.6 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.3 4.9C14.4 15.3 18.5 13 24 13c3.1 0 5.9 1.2 8.1 3.2l6.3-6.3C34.6 5.1 29.6 3 24 3 16.5 3 10.2 7.6 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.3-6.3C29.6 35.3 26.6 36 24 36c-5.5 0-10.2-3.6-11.8-8.6l-6.4 4.9C10.2 40.4 16.5 45 24 45z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.2H42V20H24v8h11.3c-0.5 1.6-1.7 3-3.3 3-2.5 0-4.6-2-4.6-4.5 0-2.5 2.1-4.5 4.6-4.5 1.2 0 2.3 0.5 3.1 1.3l2.2-2.2C30.4 16.7 27.1 15 24 15c-5.4 0-10.3 3-13.1 7.4l6.4 4.9c1.2-1.9 3-3.2 5.1-3.2 2.5 0 4.6 2 4.6 4.5 0 2.5-2.1 4.5-4.6 4.5-1.2 0-2.3-0.5-3.1-1.3l-2.2 2.2C13.6 34.9 18.5 38 24 38c3.1 0 6.2-1.2 8.5-3.5l6.3 6.3C34.6 43.9 29.6 45 24 45c-11.1 0-20-8.9-20-20s8.9-20 20-20c1.3 0 2.7 0.1 4 0.4z"
              />
            </svg>
            Accedi con Google
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <span>
            {isLoginMode ? 'Non hai un account?' : 'Hai già un account?'}
          </span>{' '}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 hover:underline"
          >
            {isLoginMode ? 'Registrati' : 'Accedi'}
          </button>
        </div>
      </div>
    </div>
  );
}
