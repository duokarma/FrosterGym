import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Dumbbell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';
import { supabaseConfigured } from '../lib/supabase';

export function Login() {
  const { session, loading: authLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName.trim()) {
          toast('error', 'Please enter your full name');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast('error', error.message);
        } else {
          if (supabaseConfigured) {
            toast('success', 'Account created! Please check your email to verify.');
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast('error', error.message);
        }
      }
    } catch {
      toast('error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signIn('demo@frostergym.com', 'demo');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Top Brand Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/20">
          <Dumbbell className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Froster Gym</h1>
        <p className="text-zinc-500 mt-2 text-center">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>
      </div>

      {/* Form Area */}
      <div className="px-6 pb-8 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="w-5 h-5" />}
              autoComplete="name"
              required
            />
          )}
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-5 h-5" />}
            inputMode="email"
            autoComplete="email"
            required={supabaseConfigured}
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 text-zinc-400 hover:text-zinc-200"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            }
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            required={supabaseConfigured}
            minLength={6}
          />
          <div className="pt-2">
            <Button type="submit" fullWidth size="lg" loading={loading}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </div>
        </form>

        {/* Demo mode shortcut */}
        {!supabaseConfigured && (
          <div className="mt-4">
            <div className="relative flex items-center justify-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <span className="relative bg-zinc-950 px-3 text-xs text-zinc-600">or</span>
            </div>
            <Button
              variant="secondary"
              fullWidth
              size="lg"
              onClick={handleDemoLogin}
              loading={loading}
            >
              Enter Demo Mode
            </Button>
            <p className="text-xs text-zinc-600 text-center mt-3">
              Supabase not connected — using demo data
            </p>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-8 text-center">
        <p className="text-xs text-zinc-600">Powered by Froster Gym Management</p>
      </div>
    </div>
  );
}
