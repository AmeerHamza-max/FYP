import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const NavLinks = ({ title, links, fadeInUp }) => {
  const navigate = useNavigate();

  const handleLinkClick = (item) => {
    // String ko URL friendly banane ke liye (e.g., "About Us" -> "/about-us")
    const path = `/${item.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(path);
    window.scrollTo(0, 0); // Click karne par page top par chala jaye
  };

  return (
    <div>
      {/* Title with Sky Blue accent */}
      <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#42C8F5] mb-10">
        {title}
      </h4>
      
      <ul className="space-y-5">
        {links.map((item) => (
          <motion.li 
            key={item} 
            variants={fadeInUp} 
            className="group flex items-center gap-2 cursor-pointer"
            onClick={() => handleLinkClick(item)}
          >
            {/* Animated hover line */}
            <span className="w-0 h-[1.5px] bg-[#42C8F5] group-hover:w-4 transition-all duration-300" />
            
            <button className="text-slate-400 font-bold uppercase text-[11px] tracking-widest group-hover:text-slate-900 transition-colors text-left outline-none">
              {item}
            </button>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};