import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, User, Mail, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { apiFetch } from '../services/api';
import { ROUTES } from '../constants';
import { RegisterResponse } from '../types';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await apiFetch<RegisterResponse>('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      navigate(ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto animate-slide-up relative z-10">
      <div className="mb-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-400 to-primary-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-primary-500/40 ring-4 ring-white/20 dark:ring-white/5">
          <Activity size={36} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Join MediBill</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">Start your automated medical analysis</p>
      </div>

      <div className="w-full glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-blue-500 to-primary-400 opacity-80" />

        <h2 className="text-xl font-semibold mb-6 text-slate-900 dark:text-white">Create Account</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm text-red-600 dark:text-red-300 text-sm rounded-xl border border-red-100 dark:border-red-800/50 flex items-start gap-3 animate-fade-in">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <User size={20} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-500 transition-all outline-none"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-500 transition-all outline-none"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary-500 transition-colors">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl shadow-lg shadow-primary-500/30 font-semibold text-base transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <div className="flex items-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </div>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;