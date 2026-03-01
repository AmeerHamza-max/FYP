
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, CreditCard, ArrowLeft, Loader2, CheckCircle2, Globe, X, ArrowRight } from 'lucide-react';
import { subscribeToPlan } from '../../api/paymentService';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const MotionDiv = motion.div;

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0c1a]">
        <button onClick={() => navigate('/pricing')} className="text-white border border-white/20 px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest hover:bg-white/5 transition-all">
          Return to Store
        </button>
      </div>
    );
  }

  const handleFinalPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await subscribeToPlan({
        planName: state.planName,
        billingCycle: state.billingCycle,
        price: state.price
      });
      
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2500);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Transaction Declined.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0c1a] min-h-screen flex items-center justify-center font-sans antialiased text-white p-6 relative overflow-hidden">
      
      {/* Background Glow Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <MotionDiv 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 z-50 bg-white text-[#0a0c1a] px-8 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-blue-100"
          >
            <div className="bg-emerald-500 rounded-full p-1 text-white">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-black uppercase text-xs tracking-widest leading-none">Access Granted</p>
              <p className="text-[10px] opacity-60 mt-1">Setting up your workspace...</p>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div className="max-w-[1000px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* LEFT: Summary */}
        <div className="space-y-8">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-blue-200/40 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.3em]">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Store
          </button>
          
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
              Checkout <br /> <span className="text-blue-400/30 font-normal not-italic tracking-normal">Securely.</span>
            </h1>
            <div className="h-1 w-16 bg-blue-500/50" />
          </div>

          <div className="bg-blue-900/10 border border-blue-500/10 p-8 rounded-[2rem] space-y-6 backdrop-blur-sm">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest mb-1">Current Selection</p>
                <h3 className="text-2xl font-black italic uppercase text-blue-50">{state.planName}</h3>
              </div>
              <div className="text-right">
                <p className="text-4xl font-black italic text-white">${state.price}</p>
                <p className="text-[9px] font-bold text-blue-400/40 uppercase tracking-tighter italic">Total {state.billingCycle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: The Form */}
        <MotionDiv 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-10 md:p-14 text-[#0a0c1a] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)]"
        >
          <form onSubmit={handleFinalPayment} className="space-y-7">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cardholder Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 outline-none focus:border-blue-500 transition-all font-bold uppercase text-xs" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Payment Details</label>
              <div className="border border-slate-100 rounded-xl overflow-hidden focus-within:border-blue-500 transition-all">
                <div className="relative border-b border-slate-50">
                  <input required type="text" placeholder="Card Number" className="w-full bg-slate-50 px-5 py-4 outline-none font-bold text-xs tracking-[0.15em]" />
                  <CreditCard className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>
                <div className="flex bg-slate-50/50">
                  <input required type="text" placeholder="MM / YY" className="w-1/2 px-5 py-4 outline-none bg-transparent border-r border-slate-50 font-bold text-xs text-center" />
                  <input required type="text" placeholder="CVC" className="w-1/2 px-5 py-4 outline-none bg-transparent font-bold text-xs text-center" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading || showSuccess}
                className="w-full bg-[#0a0c1a] text-white py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] hover:bg-blue-950 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-xl"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : showSuccess ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <>Authorize Transaction <ArrowRight size={16} /></>
                )}
              </button>
            </div>

            <p className="text-[8px] text-center font-bold text-slate-400 uppercase tracking-[0.1em] leading-relaxed">
              Fully encrypted. No card data is stored on our servers.
            </p>
          </form>
        </MotionDiv>
      </div>
    </div>
  );
};

export default Checkout;