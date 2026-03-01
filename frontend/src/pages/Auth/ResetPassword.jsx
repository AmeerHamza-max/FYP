/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../api/authService';
import { motion } from 'framer-motion';
import { ShieldCheck, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setStatus('loading');
    setError('');

    try {
      // Backend call with token from URL and new password
      await resetPassword(token, password);
      setStatus('success');
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const errorMsg = err.msg || "Token is invalid or has expired. Please request a new link.";
      setError(errorMsg);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-6 selection:bg-[#42C8F5]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 border border-slate-100"
      >
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-100">
              <CheckCircle2 size={40} className="text-white -rotate-12" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">Password Updated</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Your account is now secure. <br/> Redirecting to login...</p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#42C8F5]/10 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="text-[#42C8F5]" size={32} />
            </div>

            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">
              New <span className="text-[#42C8F5]">Credentials</span>
            </h3>
            <p className="text-slate-400 text-sm font-medium mb-8">Set a strong password to regain access to your account.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5]/30 outline-none transition-all font-bold text-slate-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5]">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#42C8F5]/30 outline-none transition-all font-bold text-slate-900"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#42C8F5]">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">⚠️ {error}</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] bg-black text-white hover:bg-[#42C8F5] hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
              >
                {status === 'loading' ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;