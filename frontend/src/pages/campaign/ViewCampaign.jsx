/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import campaignService from '../../api/campaignService';

const ViewCampaign = ({ campaignId, campaign: initialCampaign, onClose, onModify, onDelete }) => {
    const [campaign, setCampaign] = useState(initialCampaign || null);
    const [loading, setLoading] = useState(!initialCampaign);

    useEffect(() => {
        const targetId = campaignId || initialCampaign?._id;
        
        if (targetId && !initialCampaign) {
            const fetchDetail = async () => {
                try {
                    setLoading(true);
                    const res = await campaignService.getCampaignById(targetId);
                    setCampaign(res.data);
                } catch (err) {
                    console.error("Error fetching campaign details:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
        }
    }, [campaignId, initialCampaign]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );

    if (!campaign) return null;

    const getPlatformIcon = (platform) => {
        const p = platform?.toLowerCase();
        if (p === 'tiktok') return <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.34-.14-3.41.37-.75.33-1.37.92-1.84 1.58-.86 1.22-1.06 2.82-.54 4.22.31.91.93 1.69 1.69 2.25.99.76 2.24 1.05 3.48.81 1.11-.18 2.1-.8 2.73-1.74.52-.73.77-1.61.76-2.51-.01-4.03-.01-8.06-.01-12.1z" /></svg>;
        if (p === 'instagram') return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-white text-slate-900 font-sans"
        >
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Back Button & Top Actions */}
                <div className="flex justify-between items-center mb-8">
                    <button 
                        onClick={onClose}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-bold transition-all border border-slate-200 shadow-sm cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Campaigns
                    </button>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => onModify(campaign._id)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] text-purple-400 border border-purple-500/30 rounded-lg text-sm font-bold hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" strokeWidth="2" /></svg>
                            Edit
                        </button>
                        <button 
                            onClick={() => onDelete(campaign._id)}
                            className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] text-red-400 border border-red-500/30 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" /></svg>
                            Delete
                        </button>
                    </div>
                </div>

                {/* Main Card Section (Dark Blue) */}
                <div className="bg-[#1e293b] rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Badges */}
                        <div className="flex gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20 uppercase tracking-widest flex items-center gap-2">
                                {getPlatformIcon(campaign.platform)} {campaign.platform || 'Social'}
                            </span>
                            <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20 uppercase tracking-widest">
                                {campaign.status || 'Active'}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight max-w-4xl">
                            {campaign.title}
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-3xl mb-12 font-light">
                            {campaign.description}
                        </p>

                        {/* Info Grid - Changed to 3 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-auto">
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Budget</p>
                                    <p className="text-2xl font-bold text-cyan-400">${Number(campaign.budget || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deadline</p>
                                    <p className="text-lg font-bold text-white">
                                        {campaign.deadline ? new Date(campaign.deadline).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 flex items-start gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Audience</p>
                                    <p className="text-sm font-bold text-white leading-tight">{campaign.audience || 'Target Audience Details'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Recommendations Section */}
                <div className="mt-12 bg-[#1e293b] rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-2xl font-bold mb-8">
                            <span className="text-cyan-400">✨</span>
                            <h2 className="text-white">AI-Recommended <span className="text-cyan-400">Influencers</span></h2>
                        </div>
                        
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="py-4">
                                <svg className="w-16 h-16 text-slate-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <p className="text-slate-400 font-medium italic">Finding matches for {campaign.title}...</p>
                            </div>

                            <button className="bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-black py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] cursor-pointer uppercase text-xs tracking-[0.2em]">
                                Browse Influencers
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </motion.div>
    );
};

export default ViewCampaign;