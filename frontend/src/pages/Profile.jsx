/* eslint-disable no-unused-vars */
import React, { useState } from 'react'; // useEffect nikaal diya kyunki ab zaroorat nahi
import { motion } from 'framer-motion'; 
import { Mail, User, Calendar, Clock, BarChart3, Activity, Zap, CheckCircle2, LogOut } from 'lucide-react';

// Header aur Footer components
import Header from '../components/Header/Header'; 
import Footer from '../components/Footer/Footer'; 

// Aapki Axios/Service file se import
import { getCurrentUser, logoutUser } from '../api/authService'; 

const Profile = () => {
  // ERROR FIX: useEffect ki bajaye seedha useState mein initializer function use karein
  const [userData, setUserData] = useState(() => {
    return getCurrentUser(); // Yeh page load hote hi data utha lega bina cascading render ke
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Active Member";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Agar user login nahi hai ya data nahi mila
  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Header />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <p className="font-black tracking-[0.3em] uppercase opacity-50 text-[#0f1121] text-sm">Session Expired</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="mt-6 px-8 py-3 bg-[#0f1121] text-white font-bold uppercase text-[10px] rounded-full"
          >
            Back to Login
          </button>
        </motion.div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans relative overflow-hidden">
      
      {/* Landing Page style abstract background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#f0f9ff] to-transparent -z-10" />
      <div className="absolute top-40 -right-20 w-96 h-96 bg-[#42C8F5]/10 rounded-full blur-[120px] -z-10" />

      <Header />

      <main className="flex-grow pt-32 pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-4 mb-2">
                <div className="h-[2px] w-12 bg-[#42C8F5]" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#42C8F5]">Verified Account</span>
              </div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter text-[#0f1121]">
                My <span className="text-[#42C8F5]">Profile</span>
              </h1>
            </motion.div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logoutUser}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <LogOut size={14} />
              Terminate Session
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: IDENTITY CARD */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4"
            >
              <div className="bg-[#161a31] border border-[#0f1121]/5 rounded-[40px] p-10 relative overflow-hidden shadow-2xl group">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#42C8F5]/20 rounded-full blur-[80px]" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="w-36 h-36 bg-gradient-to-tr from-[#42C8F5] to-[#1e6a85] rounded-full p-[2px] shadow-[0_0_40px_rgba(66,200,245,0.2)]">
                      <div className="w-full h-full bg-[#0f1121] rounded-full flex items-center justify-center text-5xl font-black text-[#42C8F5]">
                        {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    </div>
                  </div>

                  <h2 className="text-3xl font-black uppercase italic tracking-tight text-white leading-none text-center">
                    {userData.name}
                  </h2>
                  
                  <div className="mt-4 flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-2xl">
                    <CheckCircle2 size={16} className="text-[#42C8F5]" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#42C8F5]">{userData.role || "Standard User"}</span>
                  </div>

                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10" />
                  <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">ID: {userData.id || userData._id}</p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE: INFO & STATS */}
            <div className="lg:col-span-8 space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#161a31] border border-[#0f1121]/5 rounded-[40px] p-8 md:p-10 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-10 text-white">
                  <User className="text-[#42C8F5]" size={22} />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em]">Account Credentials</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <InfoCard label="Full Legal Name" value={userData.name} status="Active" icon={<User />} />
                  <InfoCard label="Email Address" value={userData.email} status="Verified" icon={<Mail />} />
                  <InfoCard label="System Permission" value={userData.role} status="Role" icon={<Zap />} />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-[#161a31] border border-[#0f1121]/5 rounded-[40px] p-8 md:p-10 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-10 text-white">
                  <BarChart3 className="text-[#42C8F5]" size={22} />
                  <h3 className="text-sm font-black uppercase tracking-[0.3em]">Quick Overview</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StatCard label="Account Status" value="Online" icon={<Activity />} />
                  <StatCard label="Security Level" value="High" icon={<CheckCircle2 />} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Reusable Info Card
const InfoCard = ({ label, value, status, icon }) => (
  <div className="bg-[#0f1121]/60 border border-white/5 p-6 rounded-[24px] hover:border-[#42C8F5]/30 transition-all group">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 bg-[#161a31] rounded-xl flex items-center justify-center text-[#42C8F5] border border-white/5 shadow-inner">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-sm font-bold text-white tracking-tight capitalize">{value || "N/A"}</p>
        </div>
      </div>
      <div className="px-4 py-1.5 bg-[#42C8F5]/10 border border-[#42C8F5]/20 rounded-lg self-start md:self-center">
        <span className="text-[8px] font-black text-[#42C8F5] uppercase tracking-widest">{status}</span>
      </div>
    </div>
  </div>
);

// Reusable Stat Card
const StatCard = ({ label, value, icon }) => (
  <div className="bg-[#0f1121]/60 border border-white/5 p-8 rounded-[30px] flex items-center justify-between group hover:border-[#42C8F5]/20 transition-all">
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</p>
      <p className="text-4xl font-black text-white italic">{value}</p>
    </div>
    <div className="w-14 h-14 bg-[#42C8F5]/10 rounded-2xl flex items-center justify-center text-[#42C8F5] group-hover:bg-[#42C8F5] group-hover:text-[#0f1121] transition-all duration-500 shadow-lg">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

export default Profile;