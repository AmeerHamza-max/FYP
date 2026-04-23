/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authService';
import { ArrowRight, Loader2, Sparkles, CheckCircle, Eye, EyeOff, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Register = ({ isModal = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(formData);
      console.log("Registration Success:", res);

      // Show success popup
      setShowSuccessPopup(true);

      // 3 second baad popup band aur login pe redirect
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorMsg = err.msg || (typeof err === 'string' ? err : "Connection failed or email already exists");
      console.error("Full Error Object:", err);
      alert(`⚠️ Registration Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
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
              initial={{ scale: 0.7, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl px-10 py-12 flex flex-col items-center gap-5 max-w-sm w-full mx-4 relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#42C8F5] opacity-10 blur-[60px]" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-900 opacity-5 blur-[60px]" />

              {/* Icon */}
              <motion.div
                initial={{ rotate: -20, scale: 0.5 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200 relative z-10"
              >
                <PartyPopper size={36} className="text-[#42C8F5]" />
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center relative z-10"
              >
                <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">
                  You're In! 🎉
                </h4>
                <div className="h-1 w-10 bg-[#42C8F5] mx-auto mt-2 mb-3 rounded-full" />
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Account created successfully.<br />Redirecting to Sign In...
                </p>
              </motion.div>

              {/* Progress bar */}
              <motion.div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden relative z-10">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-[#42C8F5] rounded-full"
                />
              </motion.div>

              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest relative z-10">
                Auto redirect in 3s
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page */}
      <div className={`${!isModal ? 'min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4' : 'w-full'}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`flex flex-col md:flex-row overflow-hidden w-full ${!isModal ? 'max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100' : ''}`}
        >
          {/* Left Side */}
          <div className="md:w-5/12 bg-slate-900 p-10 flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#42C8F5] opacity-10 blur-[100px]" />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-12 h-12 bg-[#42C8F5] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[#42C8F5]/20 relative z-10">
              <Sparkles size={24} className="fill-current text-white" />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-black tracking-tighter leading-none uppercase italic mb-8 relative z-10">
              Scale your <br /> <span className="text-[#42C8F5]">Brand Fast.</span>
            </motion.h2>
            <div className="space-y-5 relative z-10">
              {['1M+ Vetted Influencers', 'ROI Focused Campaigns'].map((text, i) => (
                <motion.div key={i} variants={itemVariants} className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <CheckCircle size={16} className="text-[#42C8F5]" /> {text}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="w-full md:w-7/12 p-8 md:p-14 bg-white">
            <div className="mb-10">
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Register</h3>
              <div className="h-1.5 w-12 bg-[#42C8F5] mt-3 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

              <motion.div variants={itemVariants}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Business Name</label>
                <input
                  type="text"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Work Email</label>
                <input
                  type="email"
                  autoComplete="new-password"
                  readOnly
                  onFocus={(e) => e.target.removeAttribute('readOnly')}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    readOnly
                    onFocus={(e) => e.target.removeAttribute('readOnly')}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900 pr-14"
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5] transition-colors p-2 cursor-pointer z-20">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-[#42C8F5] transition-all flex items-center justify-center gap-3 mt-6 cursor-pointer shadow-xl shadow-slate-200"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span className="uppercase text-xs tracking-[0.2em]">Register Yourself</span>
                    <ArrowRight size={18} className="text-[#42C8F5]" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-slate-50 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Already a partner? <button onClick={() => navigate('/login')} className="text-slate-900 font-black underline underline-offset-4 hover:text-[#42C8F5] transition-colors cursor-pointer">Sign In</button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Register;