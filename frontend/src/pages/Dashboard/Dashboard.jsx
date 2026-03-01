/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Location add kiya active state check karne ke liye
import { motion, AnimatePresence } from 'framer-motion'; 
import { 
  LayoutDashboard, Users, Zap, BarChart3, Settings, 
  LogOut, Plus, ArrowUpRight, Search, Bell, ChevronDown, User, CreditCard, Sparkles
} from 'lucide-react';
import campaignService from '../../api/campaignService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Current URL track karne ke liye
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Ameer Hamza', email: 'hamza@grow.ai' };

  useEffect(() => { 
    fetchCampaigns(); 
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Smooth logout navigation
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex font-['Inter',sans-serif] antialiased text-slate-600 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#42C8F5]/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] -z-10"></div>

      {/* --- Sidebar --- */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen z-20">
        <div className="p-8 flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#42C8F5] shadow-xl shadow-black/20 font-black shrink-0">
            <Zap size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 tracking-tighter text-lg leading-none italic uppercase">Grow Business</span>
            <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">With Influencer</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <NavItem 
            icon={<LayoutDashboard size={18}/>} 
            label="Overview" 
            active={location.pathname === '/dashboard'} 
            onClick={() => navigate('/dashboard')} 
          />
          <NavItem 
            icon={<Users size={18}/>} 
            label="AI Match List" 
            active={location.pathname === '/influencers'}
            onClick={() => navigate('/influencers')} 
          />
          <NavItem 
            icon={<Zap size={18}/>} 
            label="Campaigns" 
            active={location.pathname.includes('/campaign')}
            onClick={() => navigate('/dashboard')} 
          />
          <NavItem 
            icon={<BarChart3 size={18}/>} 
            label="Analytics" 
            active={location.pathname === '/analytics'}
            onClick={() => navigate('/analytics')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-slate-900 transition-all text-sm font-semibold rounded-xl hover:bg-slate-50"
          >
            <Settings size={18} /> Settings
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1">
        
        {/* Simple Top Nav */}
        <header className="h-20 bg-white/40 backdrop-blur-md border-b border-slate-100 px-8 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative group">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#42C8F5] transition-colors" />
               <input type="text" placeholder="Search influencers..." className="bg-slate-100/50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#42C8F5]/20 w-80 transition-all" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:bg-white hover:shadow-sm rounded-xl transition-all group">
               <Bell size={20} className="group-hover:text-slate-900 transition-colors" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 p-1.5 pr-3 bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all active:scale-95"
              >
                <div className="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-[12px] font-bold text-[#42C8F5] shadow-inner italic">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter font-bold">Business Admin</p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 border-b border-slate-50 mb-1">
                       <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                    </div>
                    <DropdownItem icon={<User size={16}/>} label="My Profile" onClick={() => navigate('/profile')} />
                    <DropdownItem icon={<CreditCard size={16}/>} label="Billing" onClick={() => navigate('/billing')} />
                    <div className="h-px bg-slate-50 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full p-2.5 text-red-500 hover:bg-red-50 transition-all text-xs font-bold rounded-xl">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-10">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Growth Hub</h1>
              <p className="text-sm text-slate-400 font-medium">Manage your engine and influencer nodes.</p>
            </motion.div>
            <button 
              onClick={() => navigate('/create-campaign')}
              className="bg-slate-900 hover:bg-[#42C8F5] text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 shadow-xl shadow-slate-200 group active:scale-95"
            >
              <Sparkles size={18} className="group-hover:animate-spin" /> New Campaign
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SimpleStat label="Total Reach" value="1.2M" trend="+12.5%" />
            <SimpleStat label="AI Identified" value="42" trend="Matches" />
            <SimpleStat label="Conversion" value="4.8%" trend="+0.4%" />
          </div>

          {/* Table Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/60 backdrop-blur-sm border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center text-slate-900">
              <h2 className="font-bold tracking-tight">Active Campaign Tracks</h2>
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-[#42C8F5] rounded-full animate-pulse"></span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50">
                    <th className="px-8 py-5 font-bold">Campaign Entity</th>
                    <th className="px-8 py-5 font-bold">Niche</th>
                    <th className="px-8 py-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50/50">
                  {loading ? (
                    <tr><td colSpan="3" className="py-20 text-center text-sm font-bold text-slate-300 tracking-widest animate-pulse">SYNCHRONIZING ENGINE...</td></tr>
                  ) : campaigns.length === 0 ? (
                    <tr><td colSpan="3" className="py-10 text-center text-xs font-bold text-slate-400">No active deployments found.</td></tr>
                  ) : campaigns.map((camp) => (
                    <tr key={camp._id} className="hover:bg-white transition-all group">
                      <td className="px-8 py-5 text-slate-900 cursor-pointer" onClick={() => navigate(`/campaign/${camp._id}`)}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#42C8F5] transition-all group-hover:bg-[#42C8F5] group-hover:text-white">
                              <Zap size={18} />
                           </div>
                           <div>
                             <span className="text-sm font-bold block tracking-tight group-hover:text-[#42C8F5] transition-colors">{camp.title}</span>
                             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter italic">{camp.platform}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-wider">{camp.niche}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => navigate(`/campaign/${camp._id}`)} className="p-2.5 bg-slate-50 group-hover:bg-slate-900 text-slate-400 group-hover:text-[#42C8F5] rounded-xl transition-all active:scale-90">
                          <ArrowUpRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

// --- Updated Sub-Components with onClick logic ---
const SimpleStat = ({ label, value, trend }) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-default">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</p>
    <div className="flex items-baseline gap-3 mt-3">
      <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter">{value}</h3>
      <span className="text-[10px] font-extrabold text-[#42C8F5] bg-[#42C8F5]/5 px-2 py-0.5 rounded-lg">{trend}</span>
    </div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-sm font-bold ${
      active 
      ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' 
      : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span className="tracking-tight">{label}</span>
  </div>
);

const DropdownItem = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 w-full p-2.5 text-slate-600 hover:bg-slate-50 transition-all text-xs font-semibold rounded-xl"
  >
    {icon} {label}
  </button>
);

export default Dashboard;