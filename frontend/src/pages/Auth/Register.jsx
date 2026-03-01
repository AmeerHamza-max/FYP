/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/authService';
import { ArrowRight, Loader2, Sparkles, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = ({ isModal = false }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Debugging ke liye: Form data check karein
    console.log("Submitting Data:", formData);

    try {
      const res = await registerUser(formData);
      console.log("Registration Success:", res);
      
      // Success Alert
      alert(res.msg || "Registration successful!");
      navigate('/login');
    } catch (err) {
      /**
       * Yahan masla hota hai. Backend kabhi msg bhejta hai, kabhi nahi.
       * Hum dono handle karenge.
       */
      const errorMsg = err.msg || (typeof err === 'string' ? err : "Connection failed or email already exists");
      console.error("Full Error Object:", err);
      alert(`⚠️ Registration Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants (Wohi hain jo aapne diye thay) ---
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
    <div className={`${!isModal ? 'min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4' : 'w-full'}`}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`flex flex-col md:flex-row overflow-hidden w-full ${!isModal ? 'max-w-5xl bg-white rounded-[2.5rem] shadow-2xl border border-slate-100' : ''}`}
      >
        {/* Left Side (Same) */}
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

        {/* Right Side (Same) */}
        <div className="w-full md:w-7/12 p-8 md:p-14 bg-white">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Register</h3>
            <div className="h-1.5 w-12 bg-[#42C8F5] mt-3 rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <motion.div variants={itemVariants}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Business Name</label>
              <input type="text" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900" placeholder="Acme Corp" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Work Email</label>
              <input type="email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900" placeholder="ceo@company.com" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Security Token</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5] outline-none transition-all font-bold text-slate-900 pr-14" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5] transition-colors p-2 cursor-pointer z-20">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl hover:bg-[#42C8F5] transition-all flex items-center justify-center gap-3 mt-6 cursor-pointer shadow-xl shadow-slate-200">
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span className="uppercase text-xs tracking-[0.2em]">Start Growing</span> 
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
  );
};

export default Register;