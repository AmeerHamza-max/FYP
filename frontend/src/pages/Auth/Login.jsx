/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authService';
import { ArrowRight, Loader2, Zap, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ isModal = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Backend call
      const res = await loginUser({ email, password });
      
      console.log("Login Response:", res); // Debugging ke liye

      /**
       * FIX: authService pehle hi response.data bhej rahi hai.
       * Isliye hum res.data.token ki bajaye sirf res.token use karenge.
       */
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        window.dispatchEvent(new Event('storage'));
        navigate('/'); 
      } else {
        alert("Login failed: No token received");
      }
      
    } catch (err) {
      // Backend se jo error message aa raha hai woh dikhayein
      console.error("Login Error:", err);
      const errorMsg = err.msg || (typeof err === 'string' ? err : "Invalid Credentials");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${!isModal ? 'min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4' : 'w-full'}`}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className={`flex flex-col md:flex-row overflow-hidden w-full ${!isModal ? 'max-w-5xl bg-white rounded-[2.5rem] shadow-2xl min-h-[600px] border border-slate-100' : ''}`}
      >
        {/* --- Left Side: Branding --- */}
        <div className="md:w-1/2 bg-slate-900 p-10 md:p-14 flex flex-col justify-center items-start text-white relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#42C8F5] opacity-10 blur-[100px]" />
          <div className="w-12 h-12 bg-[#42C8F5] rounded-2xl flex items-center justify-center mb-8 shadow-xl relative z-10">
            <Zap size={24} className="fill-current text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic relative z-10">
            Empowering <br /> <span className="text-[#42C8F5]">Success.</span>
          </h2>
        </div>

        {/* --- Right Side: Form --- */}
        <div className="w-full md:w-1/2 p-8 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-10 text-left">
            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Login</h3>
            <div className="h-1.5 w-12 bg-[#42C8F5] mt-3 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
              <input 
                type="email" 
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900"
                placeholder="email@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900 pr-14"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5] transition-colors p-2 z-20"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex justify-start">
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')} 
                className="group flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-all"
              >
                <HelpCircle size={14} className="group-hover:text-[#42C8F5] transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Forgot password?</span>
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-[#42C8F5] transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-slate-200"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span className="uppercase text-xs tracking-[0.2em]">Sign In</span> 
                  <ArrowRight size={18} className="text-[#42C8F5]" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              New here? <button onClick={() => navigate('/register')} className="text-slate-900 font-black underline underline-offset-4 hover:text-[#42C8F5] transition-colors cursor-pointer">Register Now</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;