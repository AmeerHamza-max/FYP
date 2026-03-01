/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Phone, MapPin } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
// Aapka export kiya hua data
import { footerLinks, socialLinks, contactInfo } from '../../data/footerData';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#0f1121] text-white pt-20 pb-10 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-[#1a1f3d] rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(66,200,245,0.2)] group-hover:bg-[#42C8F5] transition-all duration-300">
                <Zap size={24} className="text-[#42C8F5] fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl uppercase tracking-tighter italic leading-none text-white">
                  Grow Business
                </span>
                <span className="text-[9px] text-slate-500 tracking-[0.2em] uppercase">
                  With Influencer
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Transform your business with AI-powered influencer marketing. Connect with top creators, launch data-driven campaigns, and achieve unprecedented growth.
            </p>
            
            {/* Contact Info from footerData */}
            <div className="space-y-4 pt-4 font-normal">
              <div className="flex items-center gap-3 text-slate-400 cursor-pointer hover:text-white transition-colors">
                <Mail size={16} className="text-[#42C8F5]" />
                <span className="text-sm">{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 cursor-pointer hover:text-white transition-colors">
                <Phone size={16} className="text-[#42C8F5]" />
                <span className="text-sm">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 cursor-pointer hover:text-white transition-colors">
                <MapPin size={16} className="text-[#42C8F5]" />
                <span className="text-sm">{contactInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Links Sections mapped from footerData */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Platform Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Platform</h4>
              <ul className="space-y-4">
                {footerLinks.platform.map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => handleNavigation(item.href)} 
                      className="text-slate-400 hover:text-[#42C8F5] transition-colors text-sm cursor-pointer outline-none"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => handleNavigation(item.href)} 
                      className="text-slate-400 hover:text-[#42C8F5] transition-colors text-sm cursor-pointer outline-none"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Legal</h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((item) => (
                  <li key={item.name}>
                    <button 
                      onClick={() => handleNavigation(item.href)} 
                      className="text-slate-400 hover:text-[#42C8F5] transition-colors text-sm cursor-pointer outline-none"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[11px] uppercase tracking-widest font-normal">
            © 2026 GROW BUSINESS. All rights reserved.
          </p>
          <div className="flex gap-8">
            {socialLinks.map((social) => (
              <a 
                key={social.label} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;