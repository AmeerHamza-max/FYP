/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';

const ViewCampaign = ({ campaignId, campaign: initialCampaign, onClose, onModify, onDelete }) => {
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(initialCampaign || null);
    const [loading, setLoading] = useState(!initialCampaign);

    useEffect(() => {
        const targetId = campaignId || initialCampaign?._id;
        const needsFreshFetch = !initialCampaign || !initialCampaign.selectedInfluencers?.[0]?.influencerId?.nickname;

        if (targetId && needsFreshFetch) {
            const fetchDetail = async () => {
                try {
                    setLoading(true);
                    const res = await campaignService.getCampaignById(targetId);
                    if (res) setCampaign(res);
                } catch (err) {
                    console.error("❌ Error fetching campaign:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [campaignId, initialCampaign]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"
            ></motion.div>
        </div>
    );

    if (!campaign) return null;

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase();
        return p === 'tiktok' ? "🎵" : p === 'youtube' ? "▶️" : "📱";
    };

    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
            <Header />
            
            <main className="flex-grow pt-20">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={cardVariants}
                    className="max-w-7xl mx-auto px-6 py-12"
                >
                    {/* Header Actions */}
                    <div className="flex justify-between items-center mb-8">
                        <button 
                            onClick={onClose} 
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all border border-slate-200 cursor-pointer"
                        >
                            Back to Campaigns
                        </button>
                        <div className="flex gap-3">
                            <button onClick={() => onModify(campaign._id)} className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] text-purple-400 border border-purple-500/30 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition-all cursor-pointer">
                                <Edit2 size={16} /> Edit
                            </button>
                            <button onClick={() => onDelete(campaign._id)} className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] text-red-400 border border-red-500/30 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>

                    {/* Main Campaign Card */}
                    <motion.div whileHover={{ scale: 1.01 }} className="bg-[#1e293b] rounded-[2.5rem] p-8 md:p-14 shadow-2xl">
                        <div className="flex gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20 uppercase tracking-widest flex items-center gap-2">
                                {getPlatformIcon(campaign.platform)} {campaign.platform || 'Social'}
                            </span>
                            <span className="px-4 py-1.5 bg-slate-700 text-slate-300 text-[10px] font-bold rounded-full border border-white/10 uppercase tracking-widest">
                                Budget: ${campaign.budget}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">{campaign.title}</h1>
                        <p className="text-slate-300 text-lg mb-12 leading-relaxed">{campaign.description}</p>
                    </motion.div>

                    {/* Influencers Section */}
                    <div className="mt-12 bg-slate-50 rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">✨ AI-Recommended <span className="text-cyan-600">Influencers</span></h2>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {campaign.selectedInfluencers?.length > 0 ? (
                                campaign.selectedInfluencers.map((inf, index) => {
                                    const influencerData = inf.influencerId || {};
                                    // Robust name logic
                                    const name = influencerData.nickname || influencerData.profile_username || "Creator";
                                    const avatarUrl = influencerData.avatar; 
                                    
                                    return (
                                        <motion.div 
                                            key={index} 
                                            whileHover={{ y: -8 }} 
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-cyan-500/40 hover:shadow-lg transition-all shadow-sm flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center gap-3 mb-4">
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                                                            {name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-slate-900 font-bold text-lg truncate w-40">{name}</h3>
                                                        <p className="text-xs text-cyan-600 font-bold">Match Score: {inf.ai_score}%</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 mb-6">
                                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                        <p className="text-slate-600 text-sm italic">"{inf.ai_summary || 'No summary available.'}"</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => navigate(`/influencer/${influencerData._id}`)}
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#1e293b] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer hover:bg-cyan-600"
                                            >
                                                <Eye size={16} /> View Details
                                            </button>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="col-span-3 text-center py-10 text-slate-400">No influencers found.</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default ViewCampaign;