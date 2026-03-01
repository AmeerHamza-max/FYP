/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Send, MessageSquare, MapPin, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { submitContactMessage } from '../api/contactService';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      await submitContactMessage(formData);
      setStatus({ loading: false, success: true, error: null });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white flex flex-col font-sans selection:bg-[#42C8F5] selection:text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#42C8F5]/5 blur-[120px] rounded-full opacity-30" />
      </div>

      <main className="flex-grow pt-28 pb-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section - Reduced Sizes */}
          <div className="mb-12">
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-[#42C8F5] font-bold tracking-[0.2em] uppercase text-[9px] mb-3 block"
            >
              Contact Support
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight"
            >
              Let's craft your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#42C8F5] to-white italic">vision.</span>
            </motion.h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Info Cards - Smaller Text */}
            <div className="lg:col-span-4 space-y-6">
              <ContactInfoCard icon={<Mail size={16} />} title="Email Support" value="ameerhamzathebest11@gmail.com" />
              <ContactInfoCard icon={<MapPin size={16} />} title="Our Studio" value="Sargodha, Punjab, Pakistan" />
              <ContactInfoCard icon={<Phone size={16} />} title="Voice Call" value="+92 327 1338388" />
            </div>

            {/* Form Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8 bg-white rounded-[32px] p-8 md:p-10 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputWrapper label="Full Name">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      name="name" type="text" required value={formData.name} onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#42C8F5] focus:ring-1 focus:ring-[#42C8F5]/10 transition-all text-slate-800 text-xs font-medium placeholder:text-slate-300" 
                    />
                  </InputWrapper>

                  <InputWrapper label="Email Address">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      name="email" type="email" required value={formData.email} onChange={handleChange}
                      placeholder="hello@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#42C8F5] focus:ring-1 focus:ring-[#42C8F5]/10 transition-all text-slate-800 text-xs font-medium placeholder:text-slate-300" 
                    />
                  </InputWrapper>
                </div>

                <InputWrapper label="Message">
                  <MessageSquare className="absolute left-3 top-3 text-slate-400" size={16} />
                  <textarea 
                    name="message" required rows="4" value={formData.message} onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:border-[#42C8F5] focus:ring-1 focus:ring-[#42C8F5]/10 transition-all text-slate-800 text-xs font-medium resize-none placeholder:text-slate-300" 
                  />
                </InputWrapper>

                <div className="flex items-center justify-between pt-2">
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-tight">
                    Reply time: ~24 Hours
                  </p>
                  <button 
                    disabled={status.loading} 
                    className="bg-[#05070a] text-white px-8 py-3 rounded-xl font-bold uppercase tracking-[0.15em] text-[10px] hover:bg-[#42C8F5] hover:text-black transition-all active:scale-95 disabled:opacity-50"
                  >
                    {status.loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

                <AnimatePresence>
                  {status.success && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-600 font-bold text-[9px] text-center uppercase tracking-widest pt-2">
                      ✓ Message Sent Successfully
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

// Compact Info Cards
const ContactInfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-4 group">
    <div className="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center border border-white/5 group-hover:border-[#42C8F5]/30 transition-all shadow-lg text-[#42C8F5]">
      {icon}
    </div>
    <div>
      <p className="text-slate-500 text-[8px] uppercase tracking-widest font-bold mb-0.5">{title}</p>
      <h4 className="text-white font-semibold text-xs tracking-tight">{value}</h4>
    </div>
  </div>
);

const InputWrapper = ({ label, children }) => (
  <div className="relative">
    <label className="text-slate-500 text-[9px] font-bold uppercase tracking-widest mb-1.5 block ml-1">{label}</label>
    <div className="relative">{children}</div>
  </div>
);

export default Contact;