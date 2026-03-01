/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';

const CreateCampaign = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        platform: 'Instagram',
        budget: '',
        deadline: '',
        niche: '',
        status: 'Pending'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await campaignService.createCampaign(formData);
            navigate('/campaigns');
        } catch (err) {
            console.error("Error:", err);
            alert(err.response?.data?.msg || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#020617] text-slate-700 font-sans selection:bg-blue-100">
            <Header />

            <main className="flex-grow flex items-center justify-center p-6 md:p-12 mt-20 relative overflow-hidden">
                
                {/* Background Glows */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/15 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/15 blur-[120px] rounded-full" />
                </div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-3xl bg-white border border-white/10 rounded-[2.5rem] p-8 md:p-14 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] relative z-10"
                >
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Create <span className="text-blue-600">New Campaign</span>
                        </h1>
                        <p className="text-slate-600 mt-2 font-medium text-base">
                            Enter the strategic details for your next big launch.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Campaign Title */}
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                                <label className="text-[14px] font-bold text-slate-800 ml-1">Campaign Title</label>
                                <input 
                                    required name="title" value={formData.title} onChange={handleChange}
                                    placeholder="e.g. Summer Collection 2026"
                                    // text-slate-900 and font-semibold for maximum readability
                                    className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400 placeholder:font-normal"
                                />
                            </motion.div>

                            {/* Niche */}
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                                <label className="text-[14px] font-bold text-slate-800 ml-1">Niche / Category</label>
                                <input 
                                    required name="niche" value={formData.niche} onChange={handleChange}
                                    placeholder="e.g. Lifestyle, Tech"
                                    className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </motion.div>
                        </div>

                        {/* Description */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                            <label className="text-[14px] font-bold text-slate-800 ml-1">Brief Description</label>
                            <textarea 
                                required name="description" value={formData.description} onChange={handleChange}
                                rows="3"
                                placeholder="What are your goals for this campaign?"
                                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 resize-none"
                            />
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Platform */}
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                                <label className="text-[14px] font-bold text-slate-800 ml-1">Select Platform</label>
                                <div className="relative">
                                    <select 
                                        name="platform" value={formData.platform} onChange={handleChange}
                                        className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-bold text-slate-900 outline-none cursor-pointer focus:border-blue-600 appearance-none"
                                    >
                                        <option>Instagram</option>
                                        <option>TikTok</option>
                                        <option>YouTube</option>
                                        <option>Facebook</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-900">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Budget */}
                            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                                <label className="text-[14px] font-bold text-slate-800 ml-1">Budget Allocation ($)</label>
                                <input 
                                    required type="number" name="budget" value={formData.budget} onChange={handleChange}
                                    placeholder="Enter amount"
                                    className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10"
                                />
                            </motion.div>
                        </div>

                        {/* Deadline */}
                        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 max-w-[280px]">
                            <label className="text-[14px] font-bold text-slate-800 ml-1">Target Deadline</label>
                            <input 
                                required type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                                className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-bold text-slate-900 outline-none transition-all focus:border-blue-600 cursor-pointer"
                            />
                        </motion.div>

                        {/* Footer Actions */}
                        <div className="pt-10 flex flex-row items-center justify-end gap-6 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => navigate('/campaigns')} 
                                className="text-[15px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                Cancel
                            </button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit" disabled={loading}
                                className="px-10 py-4 bg-blue-600 text-white font-bold text-[15px] rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Launch Campaign'}
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default CreateCampaign;