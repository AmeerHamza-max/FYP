/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Zap, ArrowRight, Shield, Star, X, Loader2 } from 'lucide-react';

// Components
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer'; 
import Modal from '../../components/Shared/Modal';
import Login from '../Auth/Login';

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const isAnnual = queryParams.get('billing') !== 'monthly'; 
  const isLoginOpen = location.hash === '#login';

  const toggleBilling = () => {
    const newBilling = isAnnual ? 'monthly' : 'annual';
    navigate(`?billing=${newBilling}${location.hash}`, { replace: true });
  };

  const closeModals = () => navigate(location.pathname + location.search);

  // --- Purchase Logic: Redirecting to Checkout ---
  const handleLaunchPlan = (plan) => {
    if (plan.name === "Enterprise") {
      navigate('/contact');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      // Agar token nahi hai to login modal kholo
      navigate('#login');
      return;
    }

    // Yahan hum API call nahi kar rahe, balki Checkout page pe bhej rahe hain
    // 'state' ke andar hum wo saara data bhej rahe hain jo checkout page ko chahiye
    navigate('/checkout', { 
      state: { 
        planName: plan.name, 
        price: plan.price,
        billingCycle: isAnnual ? 'annual' : 'monthly' 
      } 
    });
  };

  const plans = [
    {
      name: "Starter",
      price: isAnnual ? "49" : "59",
      desc: "Perfect for emerging brands starting their journey.",
      features: ["5 Campaign Credits", "Basic AI Discovery", "Standard Support", "Email Reports"],
      highlight: false
    },
    {
      name: "Pro",
      price: isAnnual ? "149" : "179",
      desc: "Advanced tools for rapidly growing businesses.",
      features: ["Unlimited Campaigns", "Full AI Vetting", "Priority Support", "ROI Dashboard", "Custom Contract Builder"],
      highlight: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Tailored solutions for global organizations.",
      features: ["Dedicated Account Manager", "White-label Reports", "API Access", "Manual Creator Audit"],
      highlight: false
    }
  ];

  return (
    <div className="bg-white min-h-screen selection:bg-[#42C8F5] selection:text-white flex flex-col">
      <Header onLoginClick={() => navigate('#login')} />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-44 pb-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#42C8F5]/5 to-transparent -z-10" />
          
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full mb-8"
            >
              <Star size={14} className="text-[#42C8F5] fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Transparent Pricing</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-8 text-[#0f1121]">
              Scale your <span className="text-[#42C8F5]">Influence.</span>
            </h1>

            {/* Toggle Billing */}
            <div className="flex items-center justify-center gap-6 mt-12">
              <span className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all ${!isAnnual ? 'text-black scale-110' : 'text-slate-400'}`}>Monthly</span>
              <button 
                onClick={toggleBilling}
                className="w-16 h-9 bg-[#0f1121] rounded-full relative p-1.5 transition-all shadow-lg shadow-[#42C8F5]/10"
              >
                <motion.div 
                  animate={{ x: isAnnual ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-6 h-6 bg-[#42C8F5] rounded-full shadow-inner"
                />
              </button>
              <span className={`text-[11px] font-black uppercase tracking-[0.3em] transition-all ${isAnnual ? 'text-black scale-110' : 'text-slate-400'}`}>
                Yearly <span className="text-[#42C8F5] ml-2 text-[9px] bg-[#42C8F5]/10 px-2 py-1 rounded-md">Save 20%</span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative p-10 rounded-[3.5rem] border transition-all duration-500 group ${
                  plan.highlight 
                  ? 'bg-[#0f1121] text-white border-[#0f1121] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] scale-105 z-10' 
                  : 'bg-slate-50 text-[#0f1121] border-slate-100 hover:bg-white hover:shadow-2xl hover:border-transparent'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#42C8F5] text-black px-8 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-[#42C8F5]/30">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-12">
                  <h3 className={`text-xs font-black uppercase tracking-[0.4em] mb-6 italic ${plan.highlight ? 'text-[#42C8F5]' : 'text-slate-400'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black italic opacity-50">$</span>
                    <span className="text-8xl font-black tracking-tighter uppercase italic leading-none">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${plan.highlight ? 'text-slate-500' : 'text-slate-400'}`}>
                        /mo
                      </span>
                    )}
                  </div>
                  <p className={`mt-8 text-[13px] leading-relaxed font-bold uppercase tracking-tight opacity-70`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="space-y-5 mb-14">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-xl flex items-center justify-center transition-colors shadow-sm ${plan.highlight ? 'bg-[#42C8F5] text-black' : 'bg-black text-white'}`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.1em]">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleLaunchPlan(plan)}
                  disabled={loading}
                  className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlight 
                    ? 'bg-[#42C8F5] text-black hover:bg-white hover:shadow-[#42C8F5]/20' 
                    : 'bg-[#0f1121] text-white hover:bg-[#42C8F5] hover:text-black'
                  }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <>Launch Plan <ArrowRight size={16} /></>}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-24 bg-slate-50/50 border-y border-slate-100 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-8 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-[#42C8F5]/10 rounded-[2rem] flex items-center justify-center shrink-0">
                <Shield className="text-[#42C8F5]" size={36} />
              </div>
              <div>
                <h4 className="font-black uppercase italic tracking-tight text-xl text-[#0f1121]">Vault Security</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Stripe & Escrow Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-8 p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-20 h-20 bg-[#42C8F5]/10 rounded-[2rem] flex items-center justify-center shrink-0">
                <Zap className="text-[#42C8F5]" size={36} />
              </div>
              <div>
                <h4 className="font-black uppercase italic tracking-tight text-xl text-[#0f1121]">Zero Lock-in</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2">Cancel anytime instantly</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* REFINED MODAL SYSTEM */}
      <AnimatePresence>
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={closeModals}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] bg-white"
            >
              <button 
                onClick={closeModals} 
                className="absolute top-8 right-8 text-slate-400 hover:text-white transition-all z-[70] bg-slate-100 hover:bg-[#42C8F5] p-3 rounded-full hover:rotate-90 shadow-sm"
              >
                <X size={24} />
              </button>
              
              <div className="max-h-[92vh] overflow-y-auto custom-scrollbar flex flex-col">
                <div className="w-full">
                   <Login isModal={true} />
                </div>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pricing;