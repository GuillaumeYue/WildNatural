import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authApi';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert("Account Registered in Database");
      navigate('/login');
    } catch (err) {
      alert("Registration failed: System rejected input.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      
      <div className="relative w-full max-w-[440px] bg-slate-900/30 backdrop-blur-2xl border border-white/5 p-12 rounded-[2.5rem] shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">
            Wild Natural Products<span className="text-emerald-500 italic">.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.5em]">Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input 
              type="text" placeholder="Full Name"
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:border-emerald-500/50 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
            />
          </div>
          <div className="space-y-1">
            <input 
              type="email" placeholder="Email"
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:border-emerald-500/50 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required 
            />
          </div>
          <div className="space-y-1">
            <input 
              type="password" placeholder="Password"
              className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 px-6 text-white placeholder-slate-700 focus:border-emerald-500/50 transition-all outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required 
            />
          </div>

          <button className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest text-xs mt-4">
            Create Account
          </button>
        </form>

        <p className="mt-10 text-center text-slate-500 text-xs">
          Already verified? <Link to="/login" className="text-emerald-400 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;