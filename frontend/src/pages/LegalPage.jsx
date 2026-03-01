/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { legalContent } from '../data/legalData';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Modal from '../components/Shared/Modal';
import { ShieldCheck, FileText, Lock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import inquiryService from '../api/inquiryService';

const LegalPage = () => {
  const { type } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  // Content fetch karna based on URL param
  const data = legalContent[type] || legalContent['privacy']; 
  
  // URL Query Params se Modal state check karna
  const queryParams = new URLSearchParams(location.search);
  const isInquiryOpen = queryParams.get('inquiry') === 'open';

  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Scroll to top when type changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

  // Modal open/close handler
  const toggleInquiryPortal = (open) => {
    if (open) {
      navigate(`${location.pathname}?inquiry=open`, { replace: true });
    } else {
      navigate(location.pathname, { replace: true });
      setStatus('idle');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    
    try {
      // Safe check for 'type' to avoid "undefined toUpperCase" error
      const inquiryLabel = type ? type.toUpperCase() : 'GENERAL';

      const response = await inquiryService.submit({
        name: formData.name,
        email: formData.email,
        company: `Legal Inquiry: ${inquiryLabel}`, // Map to your Schema's 'company' field
        message: formData.message
      });

      if (response.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Modal auto-close
        setTimeout(() => {
          toggleInquiryPortal(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Nodemailer submission failed:", error);
      setStatus('idle');
      alert(error.message || "Server communication failed.");
    }
  };

  const icons = {
    privacy: <FileText className="text-[#42C8F5]" size={32} />,
    terms: <ShieldCheck className="text-[#42C8F5]" size={32} />,
    security: <Lock className="text-[#42C8F5]" size={32} />
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans selection:bg-[#42C8F5] selection:text-white">
      <Header />
      
      <main className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Navigation Tabs */}
          <div className="flex gap-4 mb-12 border-b border-slate-100 pb-4 overflow-x-auto scrollbar-hide">
            {Object.keys(legalContent).map((key) => (
              <button
                key={key}
                onClick={() => navigate(`/legal/${key}`)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg transition-all ${
                  type === key ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          <AnimatePresence mode='wait'>
            <motion.div 
              key={type}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Document Header */}
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-[#42C8F5]/10 rounded-2xl shadow-sm">{icons[type] || icons.privacy}</div>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-8 text-slate-900">
                  {data.title.split(' ')[0]} <br />
                  <span className="text-[#42C8F5]">{data.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                   <span>Official Documentation</span>
                   <span className="w-1 h-1 bg-slate-300 rounded-full" />
                   <span className="text-slate-900">Updated: Feb 2026</span>
                </div>
              </div>

              {/* Policy Sections */}
              <div className="space-y-20 mb-32">
                {data.sections.map((item, i) => (
                  <section key={i} className="relative pl-12 group">
                    <div className="absolute left-0 top-0 text-[10px] font-black text-slate-200 group-hover:text-[#42C8F5] transition-colors tracking-tighter font-mono">
                      // 0{i + 1}
                    </div>
                    <div className="absolute left-4 top-6 bottom-0 w-[1px] bg-slate-100 group-hover:bg-[#42C8F5]/20 transition-all" />
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-slate-900 italic">{item.h}</h2>
                    <p className="text-slate-500 text-lg leading-relaxed font-medium max-w-3xl">{item.p}</p>
                  </section>
                ))}
              </div>

              {/* Action Card */}
              <div className="p-12 rounded-[3rem] bg-[#0a0a0a] text-white relative overflow-hidden shadow-2xl border border-white/5 group">
                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ShieldCheck size={180} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-black uppercase italic mb-4">Regulatory Inquiry</h3>
                  <p className="text-slate-400 mb-8 max-w-md text-sm font-medium leading-relaxed">
                    If you require formal clarification regarding our legal framework, please launch the inquiry portal.
                  </p>
                  <button 
                    onClick={() => toggleInquiryPortal(true)}
                    className="bg-[#42C8F5] text-black px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-xl shadow-[#42C8F5]/20"
                  >
                    Launch Inquiry Portal
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* --- INQUIRY MODAL --- */}
      <Modal isOpen={isInquiryOpen} onClose={() => toggleInquiryPortal(false)}>
        <div className="p-4 max-h-[85vh] overflow-y-auto scrollbar-hide">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-[#42C8F5]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#42C8F5]/20">
              <MessageSquare className="text-[#42C8F5]" size={24} />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">Legal Desk</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Grow Business Compliance Division</p>
          </div>

          {status === 'success' ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 text-center">
              <div className="w-20 h-20 bg-[#42C8F5] rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#42C8F5]/20">
                <CheckCircle2 size={40} className="text-black -rotate-12" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">Email Dispatched</h3>
              <p className="text-slate-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Logged in Database & Mailbox</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Legal Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:border-[#42C8F5] outline-none font-bold text-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
                <input 
                  required 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:border-[#42C8F5] outline-none font-bold text-slate-900 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea 
                  required 
                  rows="4" 
                  value={formData.message} 
                  onChange={(e) => setFormData({...formData, message: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 focus:border-[#42C8F5] outline-none font-medium text-slate-700 transition-all resize-none" 
                />
              </div>
              <button 
                type="submit" 
                disabled={status === 'sending'} 
                className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#42C8F5] hover:text-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {status === 'sending' ? "Transmitting..." : <>Dispatch Inquiry <Send size={14} /></>}
              </button>
            </form>
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default LegalPage;