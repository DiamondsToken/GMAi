// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <--- import
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
} from '../services/authFunction';
import { useAuth } from '../Context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      toast.success('Login avvenuto con successo!');
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
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-md p-6 border rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">
          {isLoginMode ? 'Login' : 'Registrati'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              className="w-full border px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              className="w-full border px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 w-full rounded"
          >
            {isLoginMode ? 'Login' : 'Registrati'}
          </button>
        </form>

        <button
          onClick={handleGoogleLogin}
          className="mt-4 bg-red-600 text-white px-4 py-2 w-full rounded"
        >
          Accedi con Google
        </button>

        <div className="mt-4 text-sm text-center">
          <span>
            {isLoginMode ? 'Non hai un account?' : 'Hai già un account?'}
          </span>{' '}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-blue-600 underline"
          >
            {isLoginMode ? 'Registrati' : 'Vai al login'}
          </button>
        </div>
      </div>
    </div>
  );
}
