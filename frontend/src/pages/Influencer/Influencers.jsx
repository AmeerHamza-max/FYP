/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Globe, Tag, Target, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { fetchAllInfluencers } from '../../api/influencerApi';

const Influencers = () => {
    const navigate = useNavigate();
    const [influencers, setInfluencers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [platform, setPlatform] = useState("All");
    const [category, setCategory] = useState("All");

    const loadData = useCallback(async () => {
        try {
            const result = await fetchAllInfluencers();
            setInfluencers(result.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); 
        return () => clearInterval(interval);
    }, [loadData]);

    const getFallbackAvatar = (niche) => {
        const categoryMap = {
            'Food': 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png',
            'Fashion': 'https://cdn-icons-png.flaticon.com/512/2965/2965250.png',
            'Tech Review': 'https://cdn-icons-png.flaticon.com/512/428/428931.png',
            'Gaming': 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png',
            'Fitness': 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
            'Lifestyle': 'https://cdn-icons-png.flaticon.com/512/2619/2619556.png',
            'Beauty': 'https://cdn-icons-png.flaticon.com/512/1998/1998053.png',
            'Travel': 'https://cdn-icons-png.flaticon.com/512/2798/2798031.png',
            'Finance': 'https://cdn-icons-png.flaticon.com/512/2705/2705135.png',
            'Education': 'https://cdn-icons-png.flaticon.com/512/1998/1998592.png',
            'Music': 'https://cdn-icons-png.flaticon.com/512/1384/1384024.png',
            'Photography': 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png',
            'Health': 'https://cdn-icons-png.flaticon.com/512/3004/3004655.png',
            'DIY & Crafts': 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
            'Parenting': 'https://cdn-icons-png.flaticon.com/512/3536/3536417.png',
            'Sports': 'https://cdn-icons-png.flaticon.com/512/2552/2552795.png',
            'Business': 'https://cdn-icons-png.flaticon.com/512/1570/1570952.png',
            'Art': 'https://cdn-icons-png.flaticon.com/512/1361/1361730.png',
            'Pet Influencer': 'https://cdn-icons-png.flaticon.com/512/1998/1998587.png',
            'Dance': 'https://cdn-icons-png.flaticon.com/512/3132/3132049.png',
            'Comedy': 'https://cdn-icons-png.flaticon.com/512/2729/2729007.png'
        };
        return categoryMap[niche] || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
    };

    const filteredInfluencers = influencers.filter(inf => {
        const matchesSearch = inf.nickname?.toLowerCase().includes(search.toLowerCase());
        const matchesPlatform = platform === "All" || inf.platform === platform;
        const matchesCategory = category === "All" || inf.niche === category;
        return matchesSearch && matchesPlatform && matchesCategory;
    });

    const displayedInfluencers = filteredInfluencers;

    const allNiches = [
        "Fashion", "Gaming", "Dance", "Fitness", "Beauty", 
        "Comedy", "Travel", "Tech Review", "Food", "DIY & Crafts", 
        "Lifestyle", "Photography", "Education", "Music", "Pet Influencer"
    ];

    const selectStyle = {
        backgroundColor: '#161a31',
        color: 'white'
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]"> 
            <Header />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    <div className="text-center mb-10">
                        <motion.h1 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-extrabold text-[#0f1121] tracking-tight"
                        >
                            Discover <span className="text-cyan-600">Influencers</span>
                        </motion.h1>
                        <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto font-medium">
                            Real-time creator analytics for smarter campaigns.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="relative group shadow-lg rounded-2xl overflow-hidden bg-[#161a31]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:text-cyan-300 z-10" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 bg-transparent text-white pl-12 pr-4 outline-none border-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm" 
                            />
                        </div>

                        <div className="relative group shadow-lg rounded-2xl overflow-hidden bg-[#161a31]">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 z-10" size={18} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={18} />
                            <select 
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                style={selectStyle}
                                className="w-full h-14 bg-transparent text-white pl-12 pr-10 outline-none border-none cursor-pointer appearance-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                            >
                                <option value="All" style={selectStyle}>All Platforms</option>
                                <option value="TikTok" style={selectStyle}>TikTok</option>
                                <option value="Facebook" style={selectStyle}>Facebook</option>
                                <option value="YouTube" style={selectStyle}>YouTube</option>
                                <option value="Instagram" style={selectStyle}>Instagram</option>
                            </select>
                        </div>

                        <div className="relative group shadow-lg rounded-2xl overflow-hidden bg-[#161a31]">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 z-10" size={18} />
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 z-10 pointer-events-none" size={18} />
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={selectStyle}
                                className="w-full h-14 bg-transparent text-white pl-12 pr-10 outline-none border-none cursor-pointer appearance-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                            >
                                <option value="All" style={selectStyle}>All Categories</option>
                                {allNiches.map(niche => (
                                    <option key={niche} value={niche} style={selectStyle}>{niche}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* --- UPDATED: 3 cards per row for large screens --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-slate-400 font-medium">
                                <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                Syncing Live Data...
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {displayedInfluencers.map((inf) => (
                                    <motion.div 
                                        key={inf._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-[#161a31] rounded-[2rem] p-6 border border-white/5 hover:shadow-2xl hover:shadow-cyan-900/20 transition-all duration-300 group flex flex-col h-full min-h-[420px]"
                                    >
                                        <div className="flex flex-col items-center text-center mb-6">
                                            <div className="relative mb-5">
                                                <img 
                                                    src={inf.avatar || getFallbackAvatar(inf.niche)} 
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
                                                    alt={inf.nickname}
                                                />
                                                <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0f1121] rounded-full flex items-center justify-center border border-white/10">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                                </div>
                                            </div>
                                            <h2 className="text-lg font-bold text-white truncate w-full px-2" title={inf.nickname}>
                                                {inf.nickname || 'Creator'}
                                            </h2>
                                            
                                            <span className="text-[10px] font-semibold text-cyan-400 uppercase bg-cyan-400/10 px-4 py-1.5 rounded-full border border-cyan-400/20 mt-3">
                                                {inf.platform}
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-8 mt-auto">
                                            <div className="bg-[#0f1121]/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Followers</p>
                                                <p className="text-white font-semibold text-base">{inf.follower_count?.toLocaleString() || 'N/A'}</p>
                                            </div>
                                            
                                            <div className="bg-[#0f1121]/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Engagement</p>
                                                <p className="text-green-400 font-semibold text-base">
                                                    {inf.engagement_rate || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => navigate(`/influencer/${inf._id}`)}
                                                className="flex-1 h-11 bg-[#0f1121] hover:bg-black text-slate-300 hover:text-white font-bold text-xs uppercase rounded-xl transition-all border border-white/10 flex items-center justify-center active:scale-95 cursor-pointer"
                                            >
                                                Details
                                            </button>
                                            
                                            <button 
                                                onClick={() => navigate(`/campaigns`)}
                                                className="flex-1 h-11 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center active:scale-95 border-b-4 border-cyan-700 active:border-b-0 cursor-pointer"
                                            >
                                                Campaigns
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Influencers;