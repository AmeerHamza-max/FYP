/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, CheckCircle2, DollarSign, TrendingUp, 
  ChevronRight, Zap, ArrowUpRight, Instagram, 
  Youtube, Film, Globe, Plus 
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, budget: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <Instagram size={16} />;
      case 'youtube': return <Youtube size={16} />;
      case 'tiktok': return <Film size={16} />;
      default: return <Globe size={16} />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await campaignService.getAllCampaigns();
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setRecentCampaigns(data.slice(0, 5));
        setStats({
          total: data.length,
          active: data.filter(c => c.status === 'Active').length,
          completed: data.filter(c => c.status === 'Completed').length,
          budget: data.reduce((acc, curr) => acc + (Number(curr.budget) || 0), 0)
        });
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20"> 
        
        {/* Title aur Create Button Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Business Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">Monitor your campaigns and track your performance</p>
          </div>
          <button 
            onClick={() => navigate('/create-campaign')}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus size={20} /> Create Campaign
          </button>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Campaigns" count={stats.total} icon={<Target />} path="/campaigns" />
          <StatCard title="Active Campaigns" count={stats.active} icon={<TrendingUp />} path="/campaigns" />
          <StatCard title="Completed" count={stats.completed} icon={<CheckCircle2 />} path="/campaigns" />
          <StatCard title="Total Budget" count={`$${stats.budget}`} icon={<DollarSign />} path="/billing" />
        </div>

        {/* Recent Campaigns Section */}
        <div className="bg-[#1e293b] p-8 rounded-[2rem] shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white">Recent Campaign Deployments</h2>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-cyan-400 font-bold flex items-center hover:gap-2 transition-all"
            >
              View All <ChevronRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {recentCampaigns.map((camp) => (
              <motion.div 
                key={camp._id}
                whileHover={{ x: 5 }}
                onClick={() => navigate(`/campaign/${camp._id}`)}
                className="group bg-[#334155] p-6 rounded-2xl transition-all flex items-center justify-between cursor-pointer hover:bg-[#475569]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-cyan-900 text-cyan-400 rounded-xl flex items-center justify-center">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{camp.title}</h3>
                    <p className="text-slate-300 text-sm mt-1">{camp.description || "No description provided."}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2.5 text-xs font-black bg-cyan-900 text-cyan-300 px-5 py-2.5 rounded-xl uppercase tracking-wider">
                    {getPlatformIcon(camp.platform)}
                    {camp.platform}
                  </span>
                  <p className="text-xl font-black text-white w-24 text-right">${camp.budget}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const StatCard = ({ title, count, icon, path }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -6 }}
      onClick={() => navigate(path)}
      className="bg-[#1e293b] p-8 rounded-[2rem] shadow-lg cursor-pointer relative overflow-hidden group hover:bg-[#334155]"
    >
      <div className="absolute top-4 right-4 text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight size={20} />
      </div>
      <div className="text-cyan-400 mb-4 bg-[#334155] w-12 h-12 flex items-center justify-center rounded-2xl">
        {icon}
      </div>
      <h2 className="text-3xl font-black text-white">{count}</h2>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{title}</p>
    </motion.div>
  );
};

export default Dashboard;