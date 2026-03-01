/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, LayoutDashboard, LogOut, User, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 
  const menuRef = useRef(null);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch { return null; }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      try {
        const parsedUser = savedUser ? JSON.parse(savedUser) : null;
        if (JSON.stringify(user) !== JSON.stringify(parsedUser)) {
          setUser(parsedUser);
        }
      } catch { setUser(null); }
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [location, user]);

  const navLinks = useMemo(() => [
    { name: 'Home', path: '/' },
    { name: 'Campaigns', path: '/campaigns' },
    { name: 'Influencers', path: '/influencers' },
    { name: 'Analytics', path: '/analytics' },
  ], []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = "/"; 
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[100] py-4 bg-[#0f1121]/90 border-b border-white/5 shadow-2xl backdrop-blur-xl"
      style={{ fontFamily: '"Inter", sans-serif' }} // Sabse professional font
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-[#1a1f3d] to-[#0f1121] rounded-xl flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(66,200,245,0.2)] group-hover:border-[#42C8F5]/50 transition-all duration-500"
          >
            <Zap size={20} className="text-[#42C8F5] group-hover:scale-110 transition-transform" />
          </motion.div>
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-extrabold uppercase italic leading-none text-white tracking-tighter">Grow Business</span>
            <span className="text-[7px] md:text-[8px] font-bold tracking-[0.4em] uppercase text-[#42C8F5]/60">With Influencers</span>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden lg:flex items-center gap-10">
          {user && navLinks.map((link) => (
            <Link key={link.name} to={link.path} className="relative group">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.2em] transition-all ${
                location.pathname === link.path ? 'text-[#42C8F5]' : 'text-slate-400 group-hover:text-white'
              }`}>
                {link.name}
              </span>
              {location.pathname === link.path && (
                <motion.div layoutId="underline" className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#42C8F5] shadow-[0_0_10px_#42C8F5]" />
              )}
            </Link>
          ))}
        </div>

        {/* ACTIONS / DROPDOWN */}
        <div className="flex items-center gap-6">
          <AnimatePresence mode="wait">
            {user ? (
              <div className="relative" ref={menuRef}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="relative group p-[1px] rounded-full bg-gradient-to-tr from-[#42C8F5]/50 to-transparent"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0f1121] flex items-center justify-center border border-white/10 group-hover:border-[#42C8F5]/50 transition-all overflow-hidden">
                    <span className="text-[#42C8F5] font-bold text-xs uppercase tracking-widest">
                      {user.name ? user.name.substring(0, 2) : 'GB'}
                    </span>
                  </div>
                </motion.button>

                {/* --- PROFESSIONAL PROFILE CARD --- */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 mt-5 w-64 bg-[#111427] border border-white/10 rounded-[20px] shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl z-[110] overflow-hidden"
                    >
                      {/* Header Section */}
                      <div className="px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                        <h4 className="text-white font-bold text-sm tracking-tight truncate leading-tight">
                          {user.name || 'User'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest">Active Member</span>
                        </div>
                      </div>

                      {/* Menu List */}
                      <div className="p-2">
                        <button 
                          onClick={() => { navigate('/profile'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <User size={16} className="text-slate-400 group-hover:text-[#42C8F5] transition-colors" />
                          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white uppercase tracking-widest">Profile</span>
                        </button>

                        <button 
                          onClick={() => { navigate('/dashboard'); setIsUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <LayoutDashboard size={16} className="text-slate-400 group-hover:text-[#42C8F5] transition-colors" />
                          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white uppercase tracking-widest">Dashboard</span>
                        </button>

                        <div className="my-2 h-[1px] bg-white/5 mx-2" />

                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-500 transition-all group"
                        >
                          <LogOut size={16} />
                          <span className="text-[11px] font-semibold uppercase tracking-widest">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="bg-[#42C8F5] text-[#0f1121] px-7 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(66,200,245,0.3)]"
              >
                Sign In
              </motion.button>
            )}
          </AnimatePresence>

          <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;