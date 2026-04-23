/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/authService';
import { ArrowRight, Loader2, Zap, HelpCircle, Eye, EyeOff, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = ({ isModal = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      console.log("Login Response:", res);

      if (res && res.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        window.dispatchEvent(new Event('storage'));

        // Popup dikhao
        setShowSuccessPopup(true);

        // 2.8 second baad popup band aur redirect
        setTimeout(() => {
          setShowSuccessPopup(false);
          navigate('/');
        }, 2800);

      } else {
        alert("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorMsg = err.msg || (typeof err === 'string' ? err : "Invalid Credentials");
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="bg-white rounded-[2rem] shadow-2xl px-10 py-12 flex flex-col items-center gap-5 max-w-sm w-full mx-4 relative overflow-hidden"
            >
              {/* Glow effects */}
              <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#42C8F5] opacity-10 blur-[70px]" />
              <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-slate-900 opacity-5 blur-[70px]" />

              {/* Animated Icon */}
              <motion.div
                initial={{ rotate: -15, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200 relative z-10"
              >
                <Rocket size={36} className="text-[#42C8F5]" />
              </motion.div>

              {/* Welcome Text */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center relative z-10"
              >
                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                  Welcome Back! 👋
                </h4>
                <div className="h-1 w-10 bg-[#42C8F5] mx-auto mt-2 mb-3 rounded-full" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Login successful.<br />Taking you in...
                </p>
              </motion.div>

              {/* Progress Bar */}
              <motion.div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative z-10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.8, ease: "linear" }}
                  className="h-full bg-[#42C8F5] rounded-full"
                />
              </motion.div>

              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest relative z-10">
                Redirecting...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Login Page */}
      <div className={`${!isModal ? 'min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4' : 'w-full'}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`flex flex-col md:flex-row overflow-hidden w-full ${!isModal ? 'max-w-5xl bg-white rounded-[2.5rem] shadow-2xl min-h-[600px] border border-slate-100' : ''}`}
        >
          {/* Left Side: Branding */}
          <div className="md:w-1/2 bg-slate-900 p-10 md:p-14 flex flex-col justify-center items-start text-white relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#42C8F5] opacity-10 blur-[100px]" />
            <div className="w-12 h-12 bg-[#42C8F5] rounded-2xl flex items-center justify-center mb-8 shadow-xl relative z-10">
              <Zap size={24} className="fill-current text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic relative z-10">
              Empowering <br /> <span className="text-[#42C8F5]">Success.</span>
            </h2>
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-8 md:p-14 bg-white flex flex-col justify-center">
            <div className="mb-10 text-left">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Login</h3>
              <div className="h-1.5 w-12 bg-[#42C8F5] mt-3 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readOnly')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900 pr-14"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5] transition-colors p-2 z-20 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
                >
                  <HelpCircle size={14} className="group-hover:text-[#42C8F5] transition-colors" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Forgot password?</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-[#42C8F5] transition-all flex items-center justify-center gap-3 mt-4 shadow-xl shadow-slate-200 cursor-pointer"
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
                New here?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-slate-900 font-black underline underline-offset-4 hover:text-[#42C8F5] transition-colors cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;