import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { login } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import logoUrl from '../assets/logo.svg';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login: setToken } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setError('');
    try {
      const res = await login(data);
      setToken(res.data.token);
      // Store passwordChanged flag so dashboard can prompt on first login
      localStorage.setItem('passwordChanged', res.data.passwordChanged ? 'true' : 'false');
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-accent-light flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={logoUrl} alt="Logo" className="h-16 w-auto mx-auto mb-3" onError={(e) => { e.target.style.display='none'; }} />
          <h1 className="text-xl font-bold text-secondary-800">Admin Login</h1>
          <p className="text-secondary-500 text-sm">Noor Premier School</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Username</label>
            <input {...register('username', { required: true })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Password</label>
            <input {...register('password', { required: true })} type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" disabled={isSubmitting} className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors">
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
