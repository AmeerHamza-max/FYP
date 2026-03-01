import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // URL update karne ke liye
import { Zap, Instagram, Twitter, Linkedin, Github } from 'lucide-react';

export const BrandSection = ({ fadeInUp }) => {
  const navigate = useNavigate();

  // Social links handle karne ke liye function
  const handleSocialClick = (platform) => {
    // Aap yahan actual URLs bhi daal sakte hain
    console.log(`Navigating to ${platform}`);
    navigate(`/social/${platform.toLowerCase()}`);
  };

  return (
    <motion.div className="md:col-span-5" {...fadeInUp}>
      {/* Logo Area - Clicking this takes you home */}
      <div 
        onClick={() => navigate('/')} 
        className="flex items-center gap-3 mb-8 group cursor-pointer w-fit"
      >
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-black/20">
          <Zap size={28} className="text-[#42C8F5] fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black uppercase italic tracking-tighter leading-none text-slate-900">
            Grow Business
          </span>
          <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            With Influencer
          </span>
        </div>
      </div>

      <p className="text-slate-400 text-xl font-medium max-w-sm mb-12 leading-relaxed">
        Empowering the next generation of brands through <span className="text-slate-900 font-bold">AI-verified</span> influence.
      </p>

      {/* Social Icons with URL updates */}
      <div className="flex gap-4">
        {[
          { Icon: Instagram, name: 'Instagram' },
          { Icon: Twitter, name: 'Twitter' },
          { Icon: Linkedin, name: 'Linkedin' },
          { Icon: Github, name: 'Github' }
        ].map((item, i) => (
          <motion.button 
            key={i} 
            onClick={() => handleSocialClick(item.name)}
            whileHover={{ y: -5, scale: 1.1 }} 
            className="w-14 h-14 rounded-2xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-[#42C8F5] hover:border-slate-900 transition-all cursor-pointer bg-white"
          >
            <item.Icon size={22} />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};