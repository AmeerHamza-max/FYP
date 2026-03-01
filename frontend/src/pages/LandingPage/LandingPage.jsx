/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Minus, Zap, CheckCircle, ArrowRight, Globe, ShieldCheck, BarChart3, Users } from 'lucide-react';

// External Components
import Hero from '../../components/Hero/hero'; 
import Modal from '../../components/Shared/Modal';
import Login from '../Auth/Login';
import Register from '../Auth/Register'; 
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

// Data Imports
import { features, faqs } from '../../data/landingData';

// --- Helper Components ---

const FeatureCard = ({ feature, index }) => {
  const IconComponent = feature.icon;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-2xl transition-all duration-500 group cursor-pointer"
    >
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 group-hover:bg-[#42C8F5] group-hover:text-white transition-all duration-300 mb-6">
        <IconComponent size={24} />
      </div>
      <h3 className="text-lg font-black mb-2 uppercase tracking-tight italic">{feature.title}</h3>
      <p className="text-slate-500 text-xs leading-relaxed font-medium">{feature.desc}</p>
    </motion.div>
  );
};

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="py-2">
    <button onClick={onClick} className="w-full flex items-center justify-between py-6 text-left group transition-all outline-none">
      <span className={`text-lg md:text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-[#42C8F5]' : 'text-slate-200 group-hover:text-white'}`}>
        {faq.q}
      </span>
      <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 border-[#42C8F5] text-[#42C8F5]' : 'border-white/10 text-slate-500'}`}>
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }} 
          animate={{ height: "auto", opacity: 1 }} 
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <p className="text-slate-400 text-sm pb-8 leading-relaxed max-w-2xl">
            {faq.a}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- Main Landing Page Component ---

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFaq, setActiveFaq] = useState(null);

  const isLoginOpen = location.hash === '#login';
  const isRegisterOpen = location.hash === '#register';

  const handleScrollTo = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeModals = () => navigate(location.pathname);

  return (
    <div className="bg-white text-slate-900 selection:bg-[#42C8F5] selection:text-white">
      
      <Header 
        onLoginClick={() => navigate('#login')} 
        onPlatformClick={() => handleScrollTo('platform')}
      />

      <Hero 
        onLoginClick={() => navigate('#register')}
        onLearnMore={() => handleScrollTo('platform')}
      />

      {/* 3. Social Proof Marquee */}
      <section className="py-16 border-y border-slate-50 overflow-hidden bg-slate-50/30">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">
          Trusted by Next-Gen Global Brands
        </p>
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="flex space-x-16 whitespace-nowrap justify-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700"
        >
          {['SAMSUNG', 'ADOBE', 'NIKE', 'TESLA', 'SONY'].map(brand => (
            <span key={brand} className="text-2xl font-black tracking-tighter text-slate-900">{brand}</span>
          ))}
        </motion.div>
      </section>

      {/* 4. Features Grid */}
      <section id="platform" className="py-24 px-6 max-w-7xl mx-auto scroll-mt-24">
        <div className="max-w-3xl mb-16">
            <span className="text-[#42C8F5] font-black uppercase tracking-widest text-[10px]">Core Capabilities</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none uppercase italic mt-4">
              Engineered for <span className="text-[#42C8F5] underline underline-offset-8 decoration-4">Performance.</span>
            </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} index={i} />
          ))}
        </div>
      </section>

      {/* --- REPLACED: AI INFRASTRUCTURE SECTION (English Only) --- */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-black uppercase italic leading-none tracking-tighter">
              Scalable <span className="text-[#42C8F5]">Growth</span> <br /> Architecture.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              Our platform leverages high-performance React architecture and intelligent data filtering to process influencer metrics in milliseconds. Experience a seamless workflow designed for modern marketing teams.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {[
                { text: 'Global Reach', icon: Globe },
                { text: 'Secure Logic', icon: ShieldCheck },
                { text: 'Advanced ROI', icon: BarChart3 },
                { text: 'Verified Leads', icon: Users }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <item.icon size={20} className="text-[#42C8F5]" />
                  <span className="font-bold text-[10px] uppercase tracking-tighter">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#42C8F5] blur-[120px] opacity-10 rounded-full" />
            {/* Using a high-quality abstract collaboration image instead of a dashboard */}
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
              alt="Strategic Collaboration" 
              className="relative rounded-[2rem] shadow-2xl border border-white/20 z-10 grayscale hover:grayscale-0 transition-all duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* --- IMAGE SHOWCASE: Abstract Tech & Growth (English Only) --- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Empowering Digital Ecosystems</h2>
            <div className="h-1 w-20 bg-[#42C8F5] mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600", // Modern Tech Work
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600", // Team Strategy
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600"  // Success/Growth
          ].map((url, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10 }}
              className="h-80 rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer"
            >
              <img src={url} alt="Showcase" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. FAQ Section (English Only) */}
      <section id="faq" className="py-20 bg-[#0A0F1A] text-white rounded-[3rem] mx-4 md:mx-20 px-6 relative overflow-hidden shadow-2xl mb-20 scroll-mt-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#42C8F5] opacity-10 blur-[100px]" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none italic">
              Knowledge <span className="text-[#42C8F5]">Base</span>
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Technical Documentation</p>
          </div>
          <div className="divide-y divide-white/5 border-t border-white/5">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} isOpen={activeFaq === i} onClick={() => setActiveFaq(activeFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (English Only) --- */}
      <section className="py-24 text-center px-6">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#42C8F5] p-16 rounded-[4rem] text-[#0A0F1A] relative overflow-hidden group shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-8 leading-none">Ready to revolutionize <br /> your marketing?</h2>
            <button 
              onClick={() => navigate('#register')}
              className="bg-[#0A0F1A] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-4 mx-auto"
            >
              Launch Your Campaign <ArrowRight size={20} />
            </button>
          </div>
          <Zap className="absolute -bottom-10 -right-10 text-[#0A0F1A]/5 w-64 h-64 rotate-12 pointer-events-none" />
        </motion.div>
      </section>

      <Footer onLinkClick={(path) => navigate(path)} />

      {/* Auth Modals */}
      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <div className="relative p-2">
          <button onClick={closeModals} className="absolute top-6 right-8 text-slate-300 hover:text-black text-2xl z-50">✕</button>
          <Login isModal={true} />
        </div>
      </Modal>

      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <div className="relative p-2">
          <button onClick={closeModals} className="absolute top-6 right-8 text-slate-300 hover:text-black text-2xl z-50">✕</button>
          <Register isModal={true} />
        </div>
      </Modal>

    </div>
  );
};

export default LandingPage;