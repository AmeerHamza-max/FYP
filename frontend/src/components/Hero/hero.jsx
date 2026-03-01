import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Ab ESLint tang nahi karega
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login');
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center text-center px-6 bg-white relative overflow-hidden">
      
      {/* Background Graphic */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[600px] h-[600px] bg-[#42C8F5]/5 rounded-full blur-[120px] -z-10 pointer-events-none"
      />

      {/* Main Title */}
      <div className="overflow-hidden">
        <motion.h1 
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "circOut" }}
          className="text-[12vw] leading-[0.85] font-black tracking-tighter text-slate-900 uppercase italic"
        >
          Scale <br /> Faster.
        </motion.h1>
      </div>

      {/* Punchy Text */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-lg font-bold text-slate-400 max-w-md tracking-tight uppercase"
      >
        Grow Business with Influencers. <br />
        <span className="text-slate-900 font-black italic">AI-Powered Growth.</span>
      </motion.p>

      {/* CTA Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="mt-12 group flex items-center gap-4 cursor-pointer outline-none"
      >
        <span className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white transition-all group-hover:bg-[#42C8F5] group-hover:shadow-lg group-hover:shadow-[#42C8F5]/40">
          <ArrowRight size={24} />
        </span>
        <div className="text-left">
            <span className="block font-black uppercase tracking-widest text-xs text-slate-400 leading-none">Ready?</span>
            <span className="font-black uppercase tracking-widest text-sm text-slate-900">Get Started</span>
        </div>
      </motion.button>

    </section>
  );
};

export default Hero;