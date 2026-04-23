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

    /* FIXED VIEW */
    const handleOpenView = (camp) => {

        const params = new URLSearchParams(searchParams);
        params.set('id', camp._id);
        setSearchParams(params);

    };

    /* FIXED EDIT */
    const handleOpenEdit = (id) => {

        const params = new URLSearchParams(searchParams);
        params.set('editId', id);
        setSearchParams(params);

    };

    const handleCloseModals = () => {

        setSearchParams({});
        setSelectedCampaign(null);
        setEditCampaignId(null);
        fetchCampaignData();

    };

    const handleDelete = async (id) => {

        if (window.confirm("Are you sure you want to delete this campaign?")) {

            try {

                await campaignService.deleteCampaign(id);

                setCampaigns(prev => prev.filter(c => c._id !== id));

                if (searchParams.get('id')) {
                    handleCloseModals();
                }

            } catch (err) {

                alert("Failed to delete campaign.");

            }

        }

    };

    const handleStatusChange = async (id, newStatus) => {

        try {

            await campaignService.updateCampaign(id, { status: newStatus });

            setCampaigns(prev =>
                prev.map(c =>
                    c._id === id ? { ...c, status: newStatus } : c
                )
            );

        } catch (err) {

            alert("Failed to update status");

        }

    };

    const getPlatformIcon = (p) => {

        switch (p?.toLowerCase()) {

            case 'tiktok':
                return <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72v4.44c-1.13-.32-2.34-.14-3.41.37-.75.33-1.37.92-1.84 1.58-.86 1.22-1.06 2.82-.54 4.22.31.91.93 1.69 1.69 2.25.99.76 2.24 1.05 3.48.81 1.11-.18 2.1-.8 2.73-1.74.52-.73.77-1.61.76-2.51-.01-4.03-.01-8.06-.01-12.1z" /></svg>;

            case 'youtube':
                return <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;

            default:
                return null;

        }

    };

    const getStatusIcon = (s) => {

        switch (s?.toLowerCase()) {

            case 'active':
                return <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>;

            case 'pending':
                return <svg className="w-3 h-3 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3" /></svg>;

            case 'completed':
                return <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;

            default:
                return null;

        }

    };

    if (searchParams.get('id') && selectedCampaign) {

        return (
            <ViewCampaign
                campaign={selectedCampaign}
                onClose={handleCloseModals}
                onModify={handleOpenEdit}
                onDelete={handleDelete}
            />
        );

    }

    return (

        <div className="min-h-screen flex flex-col bg-[#f8fafc] relative">

            <Header />

            <main className="flex-grow p-6 md:p-12 mt-20">

                <div className="max-w-7xl mx-auto">

                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">

                        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>

                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                                Campaign <span className="text-cyan-500 italic">Management</span>
                            </h1>

                            <p className="text-slate-500 mt-2 font-medium">
                                Streamline your influencer workflow effortlessly
                            </p>

                        </motion.div>

                        <button
                            onClick={() => navigate('/create-campaign')}
                            className="bg-cyan-400 text-slate-900 font-bold py-3 px-8 rounded-xl cursor-pointer shadow-lg hover:bg-cyan-300 transition-all"
                        >
                            + Create Campaign
                        </button>

                    </div>

                    <div className="space-y-6">

                        {loading ? (

                            <div className="flex justify-center py-24 text-cyan-500 font-bold">
                                Loading...
                            </div>

                        ) : campaigns.length > 0 ? (

                            <AnimatePresence mode="popLayout">

                                {campaigns.map((camp) => (

                                    <motion.div
                                        key={camp._id}
                                        layout
                                        className="bg-[#1e293b] rounded-[2rem] p-8 border border-white/5 flex flex-col lg:flex-row justify-between items-center gap-6 group hover:border-cyan-500/40 transition-all shadow-xl"
                                    >

                                        <div className="flex-1">

                                            <h2 className="text-2xl font-bold text-white mb-3">
                                                {camp.title}
                                            </h2>

                                            <p className="text-slate-400 text-sm mb-6">
                                                {camp.description}
                                            </p>

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

                                            <button
                                                onClick={() => handleOpenView(camp)}
                                                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-cyan-400 text-xs font-bold border border-cyan-500/30 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                VIEW DETAILS
                                            </button>

                                            <button
                                                onClick={() => handleOpenEdit(camp._id)}
                                                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-purple-400 text-xs font-bold border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                EDIT
                                            </button>

                                            <select
                                                value={camp.status}
                                                onChange={(e) => handleStatusChange(camp._id, e.target.value)}
                                                className="w-full py-3 rounded-xl bg-slate-800 text-yellow-400 text-xs font-bold border border-yellow-500/30 hover:bg-yellow-500 hover:text-white transition-all cursor-pointer text-center"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Completed">Completed</option>
                                            </select>

                                            <button
                                                onClick={() => handleDelete(camp._id)}
                                                className="w-full py-3 flex items-center justify-center gap-2 rounded-xl bg-slate-800 text-red-400 text-xs font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                DELETE
                                            </button>

                                        </div>

                                    </motion.div>

                                ))}

                            </AnimatePresence>

                        ) : (

                            <div className="text-center py-20 text-slate-500 font-bold">
                                No campaigns match your filters.
                            </div>

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