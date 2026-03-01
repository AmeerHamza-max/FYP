/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { forgotPassword } from '../../api/authService'; 
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Backend call through authService
      const res = await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      // Rate limiter ya invalid email ka error handle karein
      const errorMsg = err.msg || (typeof err === 'string' ? err : "Too many attempts or invalid email.");
      setError(errorMsg);
      console.error("Forgot Password Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 selection:bg-[#42C8F5] selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 border border-slate-100"
      >
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 bg-[#42C8F5]/10 rounded-2xl flex items-center justify-center mb-8">
                <Mail className="text-[#42C8F5]" size={32} />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">
                Lost Your <br /> <span className="text-[#42C8F5]">Access?</span>
              </h3>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                Enter your registered work email and we'll dispatch a secure recovery link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Registered Email</label>
                  <input 
                    type="email" 
                    value={email}
                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5]/30 focus:outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                    placeholder="ceo@company.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-[11px] font-black uppercase tracking-wider ml-1">
                    ⚠️ {error}
                  </motion.p>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl ${
                    loading ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-black text-white hover:bg-[#42C8F5] hover:text-black shadow-black/10'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : "Dispatch Reset Link"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-200">
                <CheckCircle size={40} className="text-white -rotate-12" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-4">Check Your Inbox</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                A secure recovery link has been sent to <br />
                <span className="font-bold text-slate-900 underline decoration-[#42C8F5] decoration-2 underline-offset-4">{email}</span>
              </p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link expires in 1 Hour</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-10 pt-8 border-t border-slate-100">
          <Link to="/login" className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 hover:text-black transition-all tracking-[0.2em] uppercase">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;