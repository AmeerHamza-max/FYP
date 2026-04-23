/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, Zap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { fetchAllInfluencers } from '../../api/influencerApi';

// ─── Data ────────────────────────────────────────────────────────────────────

const PLATFORMS = [
    { value: 'All',       label: 'All Platforms', icon: '🌐' },
    { value: 'TikTok',    label: 'TikTok',        icon: '🎵' },
    { value: 'YouTube',   label: 'YouTube',        icon: '▶️' },
    { value: 'Instagram', label: 'Instagram',      icon: '📸' },
    { value: 'Twitter',   label: 'Twitter / X',    icon: '🐦' },
];

const NICHES = [
    { label: 'Food',           icon: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png' },
    { label: 'Fashion',        icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965250.png' },
    { label: 'Tech Review',    icon: 'https://cdn-icons-png.flaticon.com/512/428/428931.png' },
    { label: 'Gaming',         icon: 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png' },
    { label: 'Fitness',        icon: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png' },
    { label: 'Lifestyle',      icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619556.png' },
    { label: 'Beauty',         icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998053.png' },
    { label: 'Travel',         icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798031.png' },
    { label: 'Finance',        icon: 'https://cdn-icons-png.flaticon.com/512/2705/2705135.png' },
    { label: 'Education',      icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998592.png' },
    { label: 'Music',          icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384024.png' },
    { label: 'Photography',    icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png' },
    { label: 'Health',         icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004655.png' },
    { label: 'DIY & Crafts',   icon: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
    { label: 'Parenting',      icon: 'https://cdn-icons-png.flaticon.com/512/3536/3536417.png' },
    { label: 'Sports',         icon: 'https://cdn-icons-png.flaticon.com/512/2552/2552795.png' },
    { label: 'Business',       icon: 'https://cdn-icons-png.flaticon.com/512/1570/1570952.png' },
    { label: 'Art',            icon: 'https://cdn-icons-png.flaticon.com/512/1361/1361730.png' },
    { label: 'Pet Influencer', icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998587.png' },
    { label: 'Dance',          icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132049.png' },
    { label: 'Comedy',         icon: 'https://cdn-icons-png.flaticon.com/512/2729/2729007.png' },
];

const NICHE_ICONS = Object.fromEntries(NICHES.map(n => [n.label, n.icon]));

// ─── Platform Dropdown ───────────────────────────────────────────────────────

const PlatformDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = PLATFORMS.find(p => p.value === value) || PLATFORMS[0];

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="w-full h-14 bg-[#161a31] rounded-2xl px-4 flex items-center gap-3 outline-none border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg"
            >
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base flex-shrink-0">
                    {selected.icon}
                </span>
                <span className="text-sm font-semibold text-white flex-1 text-left">{selected.label}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-slate-500" />
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-[#1e2340] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden p-2 flex flex-col gap-1"
                    >
                        {PLATFORMS.map((p, i) => (
                            <motion.button
                                key={p.value}
                                type="button"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.15 }}
                                onClick={() => { onChange(p.value); setOpen(false); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer
                                    ${value === p.value ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                            >
                                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base flex-shrink-0">
                                    {p.icon}
                                </span>
                                <span className={`text-sm font-semibold ${value === p.value ? 'text-cyan-400' : 'text-slate-300'}`}>
                                    {p.label}
                                </span>
                                {value === p.value && <Check size={14} className="ml-auto text-cyan-400 flex-shrink-0" />}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Niche Dropdown ──────────────────────────────────────────────────────────

const NicheDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const selected = NICHES.find(n => n.label === value);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen(p => !p)}
                className="w-full h-14 bg-[#161a31] rounded-2xl px-4 flex items-center gap-3 outline-none border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg"
            >
                {selected ? (
                    <>
                        <img src={selected.icon} alt={selected.label} className="w-6 h-6 object-contain flex-shrink-0" />
                        <span className="text-sm font-semibold text-white flex-1 text-left">{selected.label}</span>
                    </>
                ) : (
                    <>
                        <span className="w-6 h-6 flex items-center justify-center text-base flex-shrink-0">🏷️</span>
                        <span className="text-sm font-semibold text-white flex-1 text-left">All Categories</span>
                    </>
                )}
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-slate-500" />
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-[#1e2340] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden p-2"
                    >
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => { onChange('All'); setOpen(false); }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer mb-1
                                ${value === 'All' ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <span className="w-5 h-5 flex items-center justify-center text-base">🏷️</span>
                            <span className={`text-sm font-semibold ${value === 'All' ? 'text-cyan-400' : 'text-slate-300'}`}>All Categories</span>
                            {value === 'All' && <Check size={13} className="ml-auto text-cyan-400 flex-shrink-0" />}
                        </motion.button>

                        <div className="grid grid-cols-2 gap-1 max-h-60 overflow-y-auto">
                            {NICHES.map((niche, i) => (
                                <motion.button
                                    key={niche.label}
                                    type="button"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.015 }}
                                    onClick={() => { onChange(niche.label); setOpen(false); }}
                                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer
                                        ${value === niche.label ? 'bg-cyan-500/15 border border-cyan-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                >
                                    <img src={niche.icon} alt={niche.label} className="w-5 h-5 object-contain flex-shrink-0" />
                                    <span className={`text-[12px] font-semibold truncate ${value === niche.label ? 'text-cyan-400' : 'text-slate-300'}`}>
                                        {niche.label}
                                    </span>
                                    {value === niche.label && <Check size={11} className="ml-auto text-cyan-400 flex-shrink-0" />}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── AI Score Badge ──────────────────────────────────────────────────────────

const AiScoreBadge = ({ score }) => {
    if (score === undefined || score === null) return null;
    const style = score >= 70 ? 'text-green-400 bg-green-400/10 border-green-400/20'
                : score >= 50 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                :               'text-slate-400 bg-slate-400/10 border-slate-400/20';
    return (
        <span className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full border ${style}`}>
            <Zap size={9} />
            AI {score}
        </span>
    );
};

// ─── Influencer Card ─────────────────────────────────────────────────────────

const InfluencerCard = ({ inf, index }) => {
    const navigate = useNavigate();
    const avatar = inf.avatar || NICHE_ICONS[inf.niche] || 'https://cdn-icons-png.flaticon.com/512/847/847969.png';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: Math.min(index * 0.03, 0.3) }}
            className="bg-[#161a31] rounded-[2rem] p-6 border border-white/5 hover:shadow-2xl hover:shadow-cyan-900/20 hover:border-white/10 transition-all duration-300 flex flex-col h-full min-h-[420px]"
        >
            {/* Avatar + name */}
            <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-4">
                    <img
                        src={avatar}
                        className="w-24 h-24 rounded-full object-cover border-4 border-white/10"
                        alt={inf.nickname}
                        onError={(e) => { e.target.src = NICHE_ICONS[inf.niche] || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'; }}
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#0f1121] rounded-full flex items-center justify-center border border-white/10">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>

                <h2 className="text-base font-bold text-white truncate w-full px-2" title={inf.nickname}>
                    {inf.nickname || 'Creator'}
                </h2>

                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                    <span className="text-[10px] font-semibold text-cyan-400 uppercase bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                        {inf.platform}
                    </span>
                    {inf.niche && (
                        <span className="text-[10px] font-semibold text-slate-400 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            {inf.niche}
                        </span>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-2.5 mb-6 mt-auto">
                <div className="bg-[#0f1121]/50 p-3.5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Followers</p>
                    <p className="text-white font-semibold text-sm">{inf.follower_count?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="bg-[#0f1121]/50 p-3.5 rounded-2xl border border-white/5 flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Engagement</p>
                    <p className="text-green-400 font-semibold text-sm">{inf.engagement_rate || 'N/A'}</p>
                </div>
                {/* AI Score — sirf tab dikhao jab ho */}
                {inf.ai_score !== undefined && inf.ai_score !== null && (
                    <div className="bg-[#0f1121]/50 p-3.5 rounded-2xl border border-white/5 flex justify-between items-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">AI Score</p>
                        <AiScoreBadge score={inf.ai_score} />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => navigate(`/influencer/${inf._id}`)}
                    className="flex-1 h-11 bg-[#0f1121] hover:bg-black text-slate-300 hover:text-white font-bold text-xs uppercase rounded-xl transition-all border border-white/10 flex items-center justify-center active:scale-95 cursor-pointer"
                >
                    Details
                </button>
                <button
                    onClick={() => navigate('/campaigns')}
                    className="flex-1 h-11 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold text-xs uppercase rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center active:scale-95 border-b-4 border-cyan-700 active:border-b-0 cursor-pointer"
                >
                    Campaigns
                </button>
            </div>
        </motion.div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const Influencers = () => {
    // Dono tabs ke liye alag state — separate API calls
    const [allData, setAllData] = useState([]);   // type=all  (sab related)
    const [aiData,  setAiData]  = useState([]);   // type=ai   (sirf AI analyzed)
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [platform, setPlatform] = useState('All');
    const [category, setCategory] = useState('All');
    const [activeTab, setActiveTab] = useState('all');

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            // Dono ek saath fetch karo
            const [allRes, aiRes] = await Promise.all([
                fetchAllInfluencers({ type: 'all' }),
                fetchAllInfluencers({ type: 'ai'  }),
            ]);

            setAllData(Array.isArray(allRes?.data) ? allRes.data : []);
            setAiData( Array.isArray(aiRes?.data)  ? aiRes.data  : []);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, [loadData]);

    // ── Frontend filter (search + platform + category) ───────────────
    const applyFilters = (list) => list.filter(inf => {
        const matchSearch   = !search || inf.nickname?.toLowerCase().includes(search.toLowerCase());
        const matchPlatform = platform === 'All' || inf.platform === platform;
        const matchCategory = category === 'All' || inf.niche === category;
        return matchSearch && matchPlatform && matchCategory;
    });

    const displayList = applyFilters(activeTab === 'all' ? allData : aiData);

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            <Header />

            <main className="flex-grow pt-32 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* ── Page Title ──────────────────────────────── */}
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

                    {/* ── Tabs ─────────────────────────────────────── */}
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        {/* All Influencers — us user ki campaigns se related sab */}
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border
                                ${activeTab === 'all'
                                    ? 'bg-[#161a31] text-white border-white/10 shadow-lg'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Users size={15} />
                            All Influencers
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-500'}`}>
                                {allData.length}
                            </span>
                        </button>

                        {/* AI Based — sirf jinke ai_score > 0, sorted by score */}
                        <button
                            onClick={() => setActiveTab('ai')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer border
                                ${activeTab === 'ai'
                                    ? 'bg-[#161a31] text-white border-white/10 shadow-lg'
                                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <Zap size={15} />
                            AI Based
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === 'ai' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-100 text-slate-500'}`}>
                                {aiData.length}
                            </span>
                        </button>
                    </div>

                    {/* ── Filters ──────────────────────────────────── */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="relative group shadow-lg rounded-2xl overflow-hidden bg-[#161a31] border border-white/5 hover:border-cyan-500/30 transition-all">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-focus-within:text-cyan-300 z-10" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-14 bg-transparent text-white pl-12 pr-4 outline-none border-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
                            />
                        </div>
                        <PlatformDropdown value={platform} onChange={setPlatform} />
                        <NicheDropdown value={category} onChange={setCategory} />
                    </div>

                    {/* ── Result count ─────────────────────────────── */}
                    {!loading && (
                        <p className="text-slate-400 text-xs font-semibold mb-6 ml-1">
                            Showing <span className="text-white font-black">{displayList.length}</span> influencer{displayList.length !== 1 ? 's' : ''}
                            {activeTab === 'ai' && <span className="text-cyan-400 ml-1.5">· sorted by AI score</span>}
                        </p>
                    )}

                    {/* ── Cards ────────────────────────────────────── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            <div className="col-span-full text-center py-20 text-slate-400 font-medium">
                                <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
                                Syncing Live Data...
                            </div>
                        ) : displayList.length === 0 ? (
                            <div className="col-span-full text-center py-20">
                                <p className="text-slate-400 font-semibold text-lg">No influencers found</p>
                                <p className="text-slate-500 text-sm mt-2">
                                    {activeTab === 'ai'
                                        ? 'Koi AI analyzed influencer nahi mila — pehle campaign search karo'
                                        : 'Try adjusting your filters'
                                    }
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                {displayList.map((inf, i) => (
                                    <InfluencerCard key={inf._id} inf={inf} index={i} />
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