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
  
  const data = legalContent[type] || legalContent['privacy']; 
  
  const queryParams = new URLSearchParams(location.search);
  const isInquiryOpen = queryParams.get('inquiry') === 'open';

  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [type]);

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
      const inquiryLabel = type ? type.toUpperCase() : 'GENERAL';

      const response = await inquiryService.submit({
        name: formData.name,
        email: formData.email,
        company: `Legal Inquiry: ${inquiryLabel}`,
        message: formData.message
      });

      if (response.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
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
    privacy: <FileText className="text-[#42C8F5]" size={26} />,
    terms: <ShieldCheck className="text-[#42C8F5]" size={26} />,
    security: <Lock className="text-[#42C8F5]" size={26} />
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen font-sans selection:bg-[#42C8F5] selection:text-white">
      <Header />
      
      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Tabs */}
          <div className="flex gap-3 mb-10 border-b border-slate-100 pb-3 overflow-x-auto">
            {Object.keys(legalContent).map((key) => (
              <button
                key={key}
                onClick={() => navigate(`/legal/${key}`)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                  type === key
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
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

              {/* Header */}
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#42C8F5]/10 rounded-xl">
                    {icons[type] || icons.privacy}
                  </div>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 text-slate-900">
                  {data.title.split(' ')[0]}{' '}
                  <span className="text-[#42C8F5]">
                    {data.title.split(' ').slice(1).join(' ')}
                  </span>
                </h1>

                <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                  <span>Official Documentation</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span className="text-slate-600">Updated: Feb 2026</span>
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-14 mb-24">
                {data.sections.map((item, i) => (
                  <section key={i} className="relative pl-10 group">
                    
                    <div className="absolute left-0 top-0 text-xs font-mono text-slate-300 group-hover:text-[#42C8F5] transition">
                      {String(i + 1).padStart(2, '0')}
                    </div>

                    <div className="absolute left-3 top-5 bottom-0 w-[1px] bg-slate-100 group-hover:bg-[#42C8F5]/30 transition" />

                    <h2 className="text-xl md:text-2xl font-semibold mb-2 text-slate-900">
                      {item.h}
                    </h2>

                    <p className="text-slate-600 text-base leading-relaxed max-w-2xl">
                      {item.p}
                    </p>
                  </section>
                ))}
              </div>

              {/* Action Card */}
              <div className="p-10 rounded-3xl bg-[#0a0a0a] text-white shadow-xl">
                <h3 className="text-2xl font-semibold mb-3">
                  Regulatory Inquiry
                </h3>

                <p className="text-slate-400 mb-6 max-w-md text-sm leading-relaxed">
                  If you require formal clarification regarding our legal framework,
                  please launch the inquiry portal.
                </p>

                <button 
                  onClick={() => toggleInquiryPortal(true)}
                  className="bg-[#42C8F5] text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white transition"
                >
                  Launch Inquiry Portal
                </button>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={isInquiryOpen} onClose={() => toggleInquiryPortal(false)}>
        <div className="p-4 max-h-[85vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-[#42C8F5]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="text-[#42C8F5]" size={20} />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900">Legal Desk</h2>
            <p className="text-sm text-slate-500 mt-1">Grow Business Compliance Division</p>
          </div>

          {status === 'success' ? (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 text-center">
              <div className="w-16 h-16 bg-[#42C8F5] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={30} className="text-black" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">Email Sent</h3>
              <p className="text-slate-500 text-sm mt-1">Stored & delivered successfully</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              <input 
                required 
                type="text" 
                placeholder="Full Name"
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-[#42C8F5] outline-none text-sm" 
              />

              <input 
                required 
                type="email" 
                placeholder="Email Address"
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-[#42C8F5] outline-none text-sm" 
              />

              <textarea 
                required 
                rows="4" 
                placeholder="Describe your inquiry..."
                value={formData.message} 
                onChange={(e) => setFormData({...formData, message: e.target.value})} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:border-[#42C8F5] outline-none text-sm resize-none" 
              />

              <button 
                type="submit" 
                disabled={status === 'sending'} 
                className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#42C8F5] hover:text-black transition"
              >
                {status === 'sending' ? 'Sending...' : 'Send Inquiry'}
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