/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Routing ke liye
import { 
  BarChart3, TrendingUp, Target, Zap, ShieldCheck, 
  Globe, Activity, Fingerprint, Search, Layers, Cpu, ArrowUpRight
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';

const Analytics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#ffffff] text-slate-900 min-h-screen font-sans selection:bg-[#42C8F5] selection:text-white">
      <Header />
      
      <main className="pt-40">
        
        {/* 1. HERO SECTION */}
        <section className="px-6 max-w-7xl mx-auto text-center mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10"
          >
            <Cpu size={14} className="animate-pulse text-[#42C8F5]" /> Neural Engine v4.0
          </motion.div>
          <h1 className="text-7xl md:text-[9rem] font-black uppercase italic tracking-tighter leading-[0.85] mb-12 text-slate-950">
            Beyond <br /> <span className="text-[#42C8F5] underline decoration-8 underline-offset-[-10px]">Numbers.</span>
          </h1>
          <p className="text-slate-500 max-w-3xl mx-auto text-xl font-bold leading-relaxed italic uppercase tracking-tight">
            Deconstructing every metric to reveal the hidden ROI of your influencer ecosystem.
          </p>
        </section>

        {/* 2. STATS GRID */}
        <section className="px-6 max-w-7xl mx-auto mb-40">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard label="Daily Data Points" value="1.2B+" icon={Activity} />
              <StatCard label="Accuracy Rate" value="99.9%" icon={ShieldCheck} />
              <StatCard label="Active Nodes" value="450k" icon={Layers} />
              <StatCard label="Processing Speed" value="4ms" icon={Zap} />
           </div>
        </section>

        {/* 3. LIVE FEED SECTION (Black Contrast) */}
        <section className="bg-[#0a0a0a] py-32 mb-40 overflow-hidden rounded-[4rem] mx-4">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-32 items-center">
              <div>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic mb-8 text-white leading-none">
                  Deep <br /> <span className="text-[#42C8F5]">Demographics</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 leading-relaxed font-bold uppercase tracking-tight">
                  Our system filters out bots and inactive accounts to give you a crystalline view of human engagement.
                </p>
                <ul className="space-y-6">
                  <FeatureItem title="Audience Psychographics" desc="Behavioral patterns across 50+ interests." isDark={true} />
                  <FeatureItem title="Geographic Heatmaps" desc="Pinpoint city-level conversion hotspots." isDark={true} />
                  <FeatureItem title="Sentiment Analysis" desc="NLP-driven emotional tracking." isDark={true} />
                </ul>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-10 bg-[#42C8F5]/20 blur-[100px] rounded-full opacity-40" />
                <div className="relative border border-white/10 rounded-[3.5rem] p-10 bg-[#111111] shadow-2xl overflow-hidden">
                   <div className="relative z-10">
                      <div className="flex justify-between items-center mb-12">
                         <h4 className="text-[#42C8F5] font-black text-xs uppercase tracking-widest italic">Live Processing Feed</h4>
                         <div className="w-3 h-3 rounded-full bg-[#42C8F5] animate-ping" />
                      </div>
                      <div className="space-y-8">
                         {[80, 45, 95, 60].map((w, i) => (
                            <div key={i} className="h-4 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 whileInView={{ width: `${w}%` }}
                                 transition={{ duration: 1.5, delay: i * 0.2 }}
                                 className="h-full bg-[#42C8F5] shadow-[0_0_15px_rgba(66,200,245,0.5)]" 
                               />
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. THE INFRASTRUCTURE */}
        <section className="py-32 px-6 max-w-7xl mx-auto text-center">
           <div className="mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-slate-950">The Neural Network</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Scalable Social Intelligence</p>
           </div>
           <div className="grid md:grid-cols-3 gap-12 text-left">
              <TechBlock icon={Fingerprint} title="Identity Verification" desc="Automated KYC for creators using AI biometric patterns." />
              <TechBlock icon={Search} title="Discovery Engine" desc="Smart-matching algorithms connecting brands to intent." />
              <TechBlock icon={Globe} title="Cross-Platform Sync" desc="Unified data stream from all socials in real-time." />
           </div>
        </section>

        {/* 5. CALL TO ACTION - Professional URL Update */}
        <section className="px-6 py-40 max-w-6xl mx-auto">
           <div className="p-20 rounded-[4rem] bg-slate-900 relative overflow-hidden group shadow-2xl shadow-slate-200">
              <div className="absolute -right-20 -top-20 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <BarChart3 size={500} className="text-[#42C8F5]" />
              </div>
              <div className="relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
                <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white leading-none">
                  Ready to see <br /> <span className="text-[#42C8F5]">the truth?</span>
                </h2>
                <button 
                  onClick={() => navigate('/login')} // URL Professional Update
                  className="bg-[#42C8F5] text-slate-900 px-14 py-7 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white transition-all shadow-2xl flex items-center gap-3"
                >
                   Generate Full Report <ArrowUpRight size={20} />
                </button>
              </div>
           </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] hover:border-[#42C8F5] transition-all duration-500 group shadow-sm hover:shadow-xl hover:shadow-[#42C8F5]/10">
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#42C8F5] transition-colors">
      <Icon className="text-[#42C8F5] group-hover:text-white" size={24} />
    </div>
    <h3 className="text-5xl font-black italic tracking-tighter text-slate-900">{value}</h3>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{label}</p>
  </div>
);

const FeatureItem = ({ title, desc, isDark }) => (
  <li className="flex gap-5 items-start">
    <div className="mt-1.5 w-2 h-2 rounded-full bg-[#42C8F5] shadow-[0_0_10px_rgba(66,200,245,0.5)]" />
    <div>
      <h4 className={`font-black uppercase tracking-tight italic ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed font-bold uppercase tracking-tight">{desc}</p>
    </div>
  </li>
);

const TechBlock = ({ icon: Icon, title, desc }) => (
  <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 hover:bg-white hover:shadow-2xl transition-all group">
     <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:bg-slate-900">
        <Icon className="text-[#42C8F5]" size={32} />
     </div>
     <h3 className="text-2xl font-black uppercase italic mb-4 text-slate-900 leading-none">{title}</h3>
     <p className="text-slate-500 text-sm font-bold uppercase tracking-tight leading-relaxed">{desc}</p>
  </div>
);

export default Analytics;