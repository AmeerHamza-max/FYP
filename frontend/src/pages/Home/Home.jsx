/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hero from '../../components/Hero/hero';
import Modal from '../../components/Shared/Modal';
import Login from '../Auth/Login';
import Register from '../Auth/Register'; // Register bhi add kar diya

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if URL has #login or #register
  const isLoginOpen = location.hash === '#login';
  const isRegisterOpen = location.hash === '#register';

  const closeModals = () => navigate('/'); // URL wapis clean kar dega

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- Clean Navbar --- */}
      <nav className="flex justify-between items-center px-10 py-8 fixed top-0 w-full z-40 bg-white/60 backdrop-blur-xl border-b border-gray-50">
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#42C8F5] font-black italic shadow-lg shadow-black/10 transition-transform group-hover:scale-110">
            G
          </div>
          <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">
            Grow Business <span className="text-[#42C8F5] text-[10px] align-top ml-1">WITH INFLUENCERS</span>
          </span>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => navigate('#login')} // URL update to #login
            className="text-sm font-bold text-slate-500 hover:text-[#42C8F5] transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('#register')} // URL update to #register
            className="bg-slate-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-[#42C8F5] transition-all cursor-pointer shadow-xl shadow-slate-200 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="pt-20">
        <Hero onLoginClick={() => navigate('#register')} />
      </main>

      {/* --- Login Modal --- */}
      <Modal isOpen={isLoginOpen} onClose={closeModals}>
        <div className="relative p-2">
          <button 
            onClick={closeModals} 
            className="absolute top-6 right-8 text-slate-300 hover:text-black text-2xl cursor-pointer z-50 transition-colors"
          >✕</button>
          <Login isModal={true} />
        </div>
      </Modal>

      {/* --- Register Modal --- */}
      <Modal isOpen={isRegisterOpen} onClose={closeModals}>
        <div className="relative p-2">
          <button 
            onClick={closeModals} 
            className="absolute top-6 right-8 text-slate-300 hover:text-black text-2xl cursor-pointer z-50 transition-colors"
          >✕</button>
          <Register isModal={true} />
        </div>
      </Modal>

    </div>
  );
};

export default Home;