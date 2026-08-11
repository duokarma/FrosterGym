import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, SlidersHorizontal, User, Calendar, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';

export function Login() {
  const { session, loading: authLoading, signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;
  if (session) return <Navigate to="/app" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast('error', error.message);
      }
    } catch {
      toast('error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex bg-[#0B0B0A] font-sans overflow-hidden">
      
      {/* Luxurious Background with Gradient Fade */}
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-0 bg-[url('/FrosterGym/login-bg.jpg')] bg-cover bg-center lg:bg-right opacity-80" />
         <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black via-black/90 to-transparent lg:to-black/30" />
      </div>

      {/* Left Column: Pitch & Branding (Hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-center px-12 xl:px-24">
         
         <div className="border border-[rgba(255,255,255,0.08)]/80 rounded-full px-4 py-1.5 inline-flex items-center gap-2 text-xs font-medium text-zinc-300 w-fit mb-12 bg-[#0B0B0A]/50 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E2C46B]" />
            Welcome Back
         </div>

         <div className="mb-4">
            <h1 className="text-3xl text-zinc-300 font-light tracking-wide">
               Welcome to
            </h1>
            <h2 className="text-6xl xl:text-7xl font-serif text-[#E2C46B] tracking-wider mt-2">
               FROSTER GYM
            </h2>
         </div>
         
         <p className="text-[#A7A39A] text-lg mb-16 max-w-md">
            Manage your gym. Elevate every workout.
         </p>

         <div className="space-y-8 mb-16">
            <div className="flex items-start gap-5">
               <div className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)]/80 bg-[#0B0B0A]/50 flex items-center justify-center shrink-0">
                  <SlidersHorizontal className="w-5 h-5 text-zinc-300" />
               </div>
               <div>
                  <h3 className="text-[#F4F1E8] font-medium mb-1">Smart Dashboard</h3>
                  <p className="text-[#706D66] text-sm">Real-time insights at a glance</p>
               </div>
            </div>

            <div className="flex items-start gap-5">
               <div className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)]/80 bg-[#0B0B0A]/50 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-zinc-300" />
               </div>
               <div>
                  <h3 className="text-[#F4F1E8] font-medium mb-1">Member First</h3>
                  <p className="text-[#706D66] text-sm">Build stronger fitness communities</p>
               </div>
            </div>

            <div className="flex items-start gap-5">
               <div className="w-12 h-12 rounded-xl border border-[rgba(255,255,255,0.08)]/80 bg-[#0B0B0A]/50 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-zinc-300" />
               </div>
               <div>
                  <h3 className="text-[#F4F1E8] font-medium mb-1">Grow Your Business</h3>
                  <p className="text-[#706D66] text-sm">Data-driven decisions that matter</p>
               </div>
            </div>
         </div>



      </div>

      {/* Right Column: Login Card */}
      <div className="w-full lg:w-1/2 relative z-10 flex flex-col items-center justify-center p-6 lg:p-12">
         
         {/* Mobile Logo Header (Hidden on Desktop) */}
         <div className="lg:hidden mb-10 text-center">
             <h1 className="text-4xl font-serif text-[#E2C46B] tracking-wider">
               FROSTER GYM
            </h1>
         </div>

         <div className="bg-[#0B0B0A]/80 backdrop-blur-2xl border border-[rgba(255,255,255,0.08)]/60 rounded-[2.5rem] p-8 md:p-12 w-full max-w-[460px] shadow-lg shadow-black/20">
            
            <div className="w-16 h-16 bg-[#E2C46B] rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(229,211,179,0.15)] overflow-hidden">
               <img src="/FrosterGym/froaster-logo.png" alt="Froaster Fitness" className="w-12 h-12 object-contain" />
            </div>
            
            <h2 className="text-2xl text-[#F4F1E8] font-bold text-center mb-1">
               FROSTER GYM
            </h2>
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#706D66] text-center uppercase mb-10">
               EXCLUSIVE ACCESS
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#A7A39A] uppercase mb-2 ml-1">
                     Email Address
                  </label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#706D66] group-focus-within:text-[#E2C46B] transition-colors">
                        <Mail className="h-5 w-5" />
                     </div>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="block w-full pl-11 pr-4 py-3.5 bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#F4F1E8] placeholder-zinc-600 focus:outline-none focus:border-[#E5D3B3] focus:ring-1 focus:ring-[#E5D3B3] transition-all text-sm"
                        required
                     />
                  </div>
               </div>

               <div>
                  <label className="block text-[11px] font-bold tracking-wider text-[#A7A39A] uppercase mb-2 ml-1">
                     Password
                  </label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#706D66] group-focus-within:text-[#E2C46B] transition-colors">
                        <Lock className="h-5 w-5" />
                     </div>
                     <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="block w-full pl-11 pr-12 py-3.5 bg-[#11110F] border border-[rgba(255,255,255,0.08)] rounded-xl text-[#F4F1E8] placeholder-zinc-600 focus:outline-none focus:border-[#E5D3B3] focus:ring-1 focus:ring-[#E5D3B3] transition-all text-sm"
                        required
                     />
                     <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#706D66] hover:text-zinc-300 transition-colors"
                        tabIndex={-1}
                     >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </button>
                  </div>
               </div>

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#E2C46B] hover:bg-[#d4c1a0] text-black font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-8 active:scale-[0.98] disabled:opacity-70"
               >
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                  {!loading && <ArrowRight className="w-4 h-4" />}
               </button>
            </form>

            <p className="text-[10px] font-bold tracking-widest text-zinc-600 text-center uppercase mt-8">
               DATA IS SECURED
            </p>

         </div>
      </div>

      {/* Footer Bar */}
      <div className="absolute bottom-6 w-full flex justify-center z-20 px-6">
         <div className="bg-[#0B0B0A]/90 backdrop-blur-md border border-[rgba(255,255,255,0.08)]/80 rounded-full px-6 py-3.5 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-[11px] font-medium tracking-wide">
            <div className="flex items-center gap-2 text-[#A7A39A]">
               <Lock className="w-3.5 h-3.5 text-[#706D66]" />
               © 2026 Froster Gym. All rights reserved.
            </div>
            <div className="text-zinc-200">
               Powered by Duokarma
            </div>
         </div>
      </div>

    </div>
  );
}
