/* eslint-disable */
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';
import ViewCampaign from './ViewCampaign';
import EditCampaign from './EditCampaign';

const Campaigns = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All");
    const [platform, setPlatform] = useState("All");

    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [editCampaignId, setEditCampaignId] = useState(null);

    // --- View aur Edit ID track karne ke liye logic ---
    useEffect(() => {
        const viewId = searchParams.get('id');
        const editId = searchParams.get('editId');
        
        if (viewId && campaigns.length > 0) {
            const found = campaigns.find(c => c._id === viewId);
            if (found) setSelectedCampaign(found);
        } else {
            setSelectedCampaign(null);
        }

        if (editId) {
            setEditCampaignId(editId);
        } else {
            setEditCampaignId(null);
        }
    }, [searchParams, campaigns]);

    const fetchCampaignData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await campaignService.getAllCampaigns({ 
                search, 
                status: status === "All" ? "" : status, 
                platform: platform === "All" ? "" : platform 
            });
            const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setCampaigns(data);
        } catch (err) {
            console.error("Data fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [search, status, platform]);

    useEffect(() => {
        fetchCampaignData();
    }, [fetchCampaignData]); 

    const handleOpenView = (camp) => setSearchParams({ id: camp._id });
    const handleOpenEdit = (id) => setSearchParams({ editId: id });

    const handleCloseModals = () => {
        setSearchParams({});
        fetchCampaignData();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this campaign?")) {
            try {
                await campaignService.deleteCampaign(id);
                setCampaigns(prev => prev.filter(c => c._id !== id));
                // Delete hone ke baad agar view modal khula hai toh usay band kar do
                if (searchParams.get('id')) {
                    handleCloseModals();
                }
            } catch (err) {
                alert("Failed to delete campaign.");
            }
        }
    };

    // --- Icon Helpers ---
    const getPlatformIcon = (p) => {
        switch(p?.toLowerCase()) {
            case 'instagram': return <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
            case 'tiktok': return <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-1.13-.32-2.34-.14-3.41.37-.75.33-1.37.92-1.84 1.58-.86 1.22-1.06 2.82-.54 4.22.31.91.93 1.69 1.69 2.25.99.76 2.24 1.05 3.48.81 1.11-.18 2.1-.8 2.73-1.74.52-.73.77-1.61.76-2.51-.01-4.03-.01-8.06-.01-12.1z" /></svg>;
            case 'youtube': return <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
            default: return null;
        }
    };

    const getStatusIcon = (s) => {
        switch(s?.toLowerCase()) {
            case 'active': return <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>;
            case 'pending': return <svg className="w-3 h-3 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
            case 'completed': return <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
            default: return null;
        }
    };

    // --- View Modal Screen ---
    if (searchParams.get('id') && selectedCampaign) {
        return (
            <ViewCampaign 
                campaign={selectedCampaign} 
                onClose={handleCloseModals} 
                onModify={handleOpenEdit}
                onDelete={handleDelete} // <--- FIXED: Adding delete logic here
            />
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#f8fafc] relative">
            <Header />

            <main className="flex-grow p-6 md:p-12 mt-20">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                                Campaign <span className="text-cyan-500 italic">Management</span>
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">Streamline your influencer workflow effortlessly</p>
                        </motion.div>
                        
                        <button onClick={() => navigate('/create-campaign')} className="bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-xl cursor-pointer shadow-lg hover:bg-cyan-300 transition-all">
                            + Create Campaign
                        </button>
                    </div>

                    {/* FILTERS SECTION */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Search campaigns..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                                className="w-full h-14 bg-[#1e293b] text-white rounded-2xl px-6 outline-none shadow-inner border border-transparent focus:border-cyan-500/50 transition-all" 
                            />
                        </div>

                        <div className="relative">
                            <select 
                                value={status} 
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-14 bg-[#1e293b] text-white rounded-2xl px-6 outline-none shadow-inner cursor-pointer appearance-none border border-transparent focus:border-cyan-500/50 transition-all"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>

                        <div className="relative">
                            <select 
                                value={platform} 
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full h-14 bg-[#1e293b] text-white rounded-2xl px-6 outline-none shadow-inner cursor-pointer appearance-none border border-transparent focus:border-cyan-500/50 transition-all"
                            >
                                <option value="All">All Platforms</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Instagram">Facebook</option>
                                <option value="YouTube">YouTube</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Campaign Cards */}
                    <div className="space-y-6">
                        {loading ? (
                            <div className="flex justify-center py-24 text-cyan-500 font-bold">Loading...</div>
                        ) : campaigns.length > 0 ? (
                            <AnimatePresence mode="popLayout">
                                {campaigns.map((camp) => (
                                    <motion.div key={camp._id} layout className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 group hover:border-cyan-500/40 transition-all shadow-xl">
                                        <div className="flex-1">
                                            <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{camp.title}</h2>
                                            <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2 font-light">{camp.description}</p>
                                            <div className="flex flex-wrap gap-3">
                                                <span className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-lg border border-cyan-500/20 uppercase tracking-wider">
                                                    {getPlatformIcon(camp.platform)} {camp.platform}
                                                </span>
                                                <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 uppercase tracking-wider">
                                                    {getStatusIcon(camp.status)} {camp.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-3 w-full lg:w-44">
                                            <button onClick={() => handleOpenView(camp)} className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                VIEW DETAILS
                                            </button>
                                            <button onClick={() => handleOpenEdit(camp._id)} className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-purple-400 text-xs font-bold border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                EDIT
                                            </button>
                                            <button onClick={() => handleDelete(camp._id)} className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-red-400 text-xs font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                DELETE
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        ) : (
                            <div className="text-center py-20 text-slate-500 font-bold">No campaigns match your filters.</div>
                        )}
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {editCampaignId && (
                    <EditCampaign 
                        campaignId={editCampaignId} 
                        onClose={handleCloseModals} 
                    />
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Campaigns;