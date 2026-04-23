/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, BarChart2, ShieldCheck, Target, Send, 
    Zap, Users, Film, Hash, Globe, MessageSquare 
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import * as influencerService from '../../api/influencerApi';

// ── Niche → fallback icon map ─────────────────────────────────────────
const NICHE_ICONS = {
    'Food':           'https://cdn-icons-png.flaticon.com/512/3565/3565418.png',
    'Fashion':        'https://cdn-icons-png.flaticon.com/512/2965/2965250.png',
    'Tech Review':    'https://cdn-icons-png.flaticon.com/512/428/428931.png',
    'Gaming':         'https://cdn-icons-png.flaticon.com/512/3408/3408506.png',
    'Fitness':        'https://cdn-icons-png.flaticon.com/512/2964/2964514.png',
    'Lifestyle':      'https://cdn-icons-png.flaticon.com/512/2619/2619556.png',
    'Beauty':         'https://cdn-icons-png.flaticon.com/512/1998/1998053.png',
    'Travel':         'https://cdn-icons-png.flaticon.com/512/2798/2798031.png',
    'Finance':        'https://cdn-icons-png.flaticon.com/512/2705/2705135.png',
    'Education':      'https://cdn-icons-png.flaticon.com/512/1998/1998592.png',
    'Music':          'https://cdn-icons-png.flaticon.com/512/1384/1384024.png',
    'Photography':    'https://cdn-icons-png.flaticon.com/512/1042/1042339.png',
    'Health':         'https://cdn-icons-png.flaticon.com/512/3004/3004655.png',
    'DIY & Crafts':   'https://cdn-icons-png.flaticon.com/512/1087/1087815.png',
    'Parenting':      'https://cdn-icons-png.flaticon.com/512/3536/3536417.png',
    'Sports':         'https://cdn-icons-png.flaticon.com/512/2552/2552795.png',
    'Business':       'https://cdn-icons-png.flaticon.com/512/1570/1570952.png',
    'Art':            'https://cdn-icons-png.flaticon.com/512/1361/1361730.png',
    'Pet Influencer': 'https://cdn-icons-png.flaticon.com/512/1998/1998587.png',
    'Dance':          'https://cdn-icons-png.flaticon.com/512/3132/3132049.png',
    'Comedy':         'https://cdn-icons-png.flaticon.com/512/2729/2729007.png',
};

const GENERIC_AVATAR = 'https://cdn-icons-png.flaticon.com/512/847/847969.png';
const getFallbackAvatar = (niche) => NICHE_ICONS[niche] || GENERIC_AVATAR;

// ── Avatar Component ──────────────────────────────────────────────────
const InfluencerAvatar = ({ avatar, niche, nickname, size = 'lg' }) => {
    const [hasError, setHasError] = useState(!avatar);

    const sizeClasses = size === 'lg'
        ? 'w-24 h-24 md:w-32 md:h-32'
        : 'w-16 h-16';

    if (!hasError && avatar) {
        return (
            <img
                src={avatar}
                alt={nickname}
                onError={() => setHasError(true)}
                className={`${sizeClasses} rounded-full object-cover border-4 border-white shadow-xl`}
            />
        );
    }

    const fallback = getFallbackAvatar(niche);
    return (
        <div className={`${sizeClasses} rounded-full border-4 border-white shadow-xl bg-slate-100 flex items-center justify-center overflow-hidden`}>
            <img
                src={fallback}
                alt={niche || 'Creator'}
                className="w-12 h-12 md:w-16 md:h-16 object-contain opacity-70"
            />
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────
const InfluencerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [influencer, setInfluencer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInfluencer = async () => {
            try {
                setLoading(true);
                const response = await influencerService.fetchInfluencerDetail(id);
                setInfluencer(response.data || response);
            } catch (err) {
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };
        fetchInfluencer();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
                <Target size={40} className="text-slate-900" />
            </motion.div>
        </div>
    );

    if (!influencer) return null;

    return (
        <div className="min-h-screen bg-[#F4F7FE] text-slate-900 font-sans">
            <Header />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto px-6 pt-24 pb-20"
            >
                {/* ── Header Section ── */}
                <div className="flex justify-between items-end mb-12">
                    <div className="flex items-center gap-6">

                        <InfluencerAvatar
                            avatar={influencer.avatar}
                            niche={influencer.niche}
                            nickname={influencer.nickname}
                            size="lg"
                        />

                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest mb-3 transition-all cursor-pointer"
                            >
                                <ArrowLeft size={16} /> Back to Insights
                            </button>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                                {influencer.nickname}
                            </h1>
                            <p className="text-slate-500 mt-1 font-medium flex items-center gap-2 text-sm">
                                <Globe size={13} /> @{influencer.profile_username}
                            </p>
                        </div>
                    </div>

                    {/* ✅ Profile URL pe redirect */}
                    <button
                        onClick={() => window.open(influencer.profile_url, '_blank')}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                    >
                        View Profile <Send size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* ── Main Stats Card ── */}
                    <div className="md:col-span-8 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                            <BarChart2 size={16} /> Performance Metrics
                        </h3>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                                    <Users size={14} /> Total Audience
                                </p>
                                <p className="text-4xl font-black">
                                    {influencer.follower_count?.toLocaleString() || 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-slate-400 text-sm font-semibold flex items-center gap-2">
                                    <Zap size={14} /> Engagement Rate
                                </p>
                                <p className="text-4xl font-black text-cyan-600">
                                    {influencer.engagement_rate || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Target size={14} /> AI Performance Score
                            </p>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${influencer.ai_score || 0}%` }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-slate-900 rounded-full"
                                />
                            </div>
                            <p className="text-right font-black text-sm mt-2">
                                {influencer.ai_score || 0} / 100
                            </p>
                        </div>
                    </div>

                    {/* ── AI Sidebar ── */}
                    <div className="md:col-span-4 bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <ShieldCheck size={16} /> AI Executive Intelligence
                        </h3>
                        <p className="text-base leading-relaxed text-slate-300 italic mb-8">
                            "{influencer.ai_summary || 'No AI summary available for this influencer.'}"
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between border-b border-slate-700 pb-4">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <MessageSquare size={15} /> Sentiment
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    influencer.sentiment === 'Positive'        ? 'bg-emerald-500/20 text-emerald-400' :
                                    influencer.sentiment === 'Very Positive'   ? 'bg-emerald-500/20 text-emerald-400' :
                                    influencer.sentiment === 'High Engagement' ? 'bg-cyan-500/20 text-cyan-400'       :
                                    influencer.sentiment === 'Neutral'         ? 'bg-amber-500/20 text-amber-400'     :
                                    'bg-rose-500/20 text-rose-400'
                                }`}>
                                    {influencer.sentiment || 'N/A'}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-slate-700 pb-4">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Globe size={15} /> Platform
                                </span>
                                <span className="font-bold">{influencer.platform || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-700 pb-4">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Hash size={15} /> Niche
                                </span>
                                <span className="font-bold">{influencer.niche || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between border-b border-slate-700 pb-4">
                                <span className="text-slate-400 flex items-center gap-2">
                                    <Film size={15} /> Total Videos
                                </span>
                                <span className="font-bold">{influencer.total_videos || 'N/A'}</span>
                            </div>

                            {influencer.brand_fit && (
                                <div className="flex justify-between">
                                    <span className="text-slate-400 flex items-center gap-2">
                                        <ShieldCheck size={15} /> Brand Fit
                                    </span>
                                    <span className="font-bold text-cyan-400">{influencer.brand_fit}</span>
                                </div>
                            )}
                        </div>

                        {/* ✅ Profile URL link bhi sidebar mein */}
                        {influencer.profile_url && (
                            <a
                                href={influencer.profile_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                <Globe size={13} /> Open Profile
                            </a>
                        )}
                    </div>

                </div>
            </motion.main>
            <Footer />
        </div>
    );
};

export default InfluencerProfile;