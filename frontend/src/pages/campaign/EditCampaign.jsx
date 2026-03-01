/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import campaignService from '../../api/campaignService';

const EditCampaign = ({ onClose, campaignId }) => {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '', description: '', platform: 'Instagram', budget: '', deadline: '', niche: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await campaignService.getCampaignById(campaignId);
                const data = res.data;
                if (data.deadline) data.deadline = new Date(data.deadline).toISOString().split('T')[0];
                setFormData(data);
            } catch (err) {
                onClose();
            } finally {
                setFetching(false);
            }
        };
        loadData();
    }, [campaignId, onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await campaignService.updateCampaign(campaignId, formData);
            onClose();
        } catch (err) {
            alert("Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6 overflow-hidden">
            {/* Background Overlay: Just Blur, No Dark Tint */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-white/5 backdrop-blur-2xl cursor-pointer"
            />

            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                // max-h-[90vh] aur overflow-y-auto taake scroll ho sake
                className="relative w-full max-w-4xl bg-white md:rounded-[3rem] shadow-2xl z-20 overflow-y-auto max-h-screen md:max-h-[90vh] scrollbar-hide"
            >
                <div className="p-8 md:p-16">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <span className="text-cyan-500 font-bold text-xs tracking-[0.3em] uppercase">Settings</span>
                            <h2 className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">
                                Edit Campaign
                            </h2>
                        </div>
                        <button onClick={onClose} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-full transition-all group">
                            <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Section 1: Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            <div className="space-y-3 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Campaign Title</label>
                                <input 
                                    required 
                                    value={formData.title} 
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                    className="w-full text-xl font-medium text-slate-800 bg-transparent border-b-2 border-slate-100 focus:border-cyan-400 outline-none pb-4 transition-all"
                                    placeholder="Enter campaign title..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Niche</label>
                                <input 
                                    required 
                                    value={formData.niche} 
                                    onChange={(e) => setFormData({...formData, niche: e.target.value})} 
                                    className="w-full text-lg font-medium text-slate-800 bg-transparent border-b-2 border-slate-100 focus:border-cyan-400 outline-none pb-4 transition-all"
                                    placeholder="e.g. Lifestyle, Tech..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Budget (USD)</label>
                                <input 
                                    type="number"
                                    required 
                                    value={formData.budget} 
                                    onChange={(e) => setFormData({...formData, budget: e.target.value})} 
                                    className="w-full text-lg font-medium text-slate-800 bg-transparent border-b-2 border-slate-100 focus:border-cyan-400 outline-none pb-4 transition-all"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea 
                                    rows="4" 
                                    required 
                                    value={formData.description} 
                                    onChange={(e) => setFormData({...formData, description: e.target.value})} 
                                    className="w-full text-lg font-light text-slate-600 bg-slate-50/50 rounded-3xl p-6 border border-slate-100 focus:border-cyan-400 focus:bg-white outline-none transition-all leading-relaxed"
                                    placeholder="Describe your campaign goals..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                                <input 
                                    type="date"
                                    required 
                                    value={formData.deadline} 
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})} 
                                    className="w-full text-lg font-medium text-slate-800 bg-transparent border-b-2 border-slate-100 focus:border-cyan-400 outline-none pb-4 transition-all"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-50">
                            <p className="text-slate-400 text-sm italic font-light">Last updated: Just now</p>
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="flex-1 md:flex-none px-14 py-5 bg-slate-900 text-cyan-400 rounded-full text-xs font-black tracking-[0.2em] shadow-xl hover:bg-cyan-500 hover:text-white transition-all uppercase"
                                >
                                    {loading ? "Saving..." : "Update Campaign"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default EditCampaign;