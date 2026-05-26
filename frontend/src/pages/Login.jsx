import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      alert("Access Denied: Please verify your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
      {/* Background Neon Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-[440px] bg-slate-900/30 backdrop-blur-2xl border border-white/5 p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Wild Natural Products<span className="text-emerald-500 italic">.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em]">Identity Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <input 
              type="email" 
              placeholder="operator@wild.com"
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required 
            />
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-[0.98] uppercase tracking-widest text-xs">
            Login
          </button>
        </form>

        <p className="mt-10 text-center text-slate-500 text-xs">
          New User? <Link to="/signup" className="text-white font-bold hover:text-emerald-400 transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;