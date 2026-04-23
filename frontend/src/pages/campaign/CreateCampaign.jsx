/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';
import { ChevronDown, Check } from 'lucide-react';

// ─── Data ───────────────────────────────────────────────────────────────────

const PLATFORMS = [
  {
    value: 'All',
    label: 'All Platforms',
    icon: '🌐',
    color: 'from-slate-500 to-slate-700',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
  },
  {
    value: 'TikTok',
    label: 'TikTok',
    icon: '🎵',
    color: 'from-pink-500 to-rose-600',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
  },
  {
    value: 'YouTube',
    label: 'YouTube',
    icon: '▶️',
    color: 'from-red-500 to-red-700',
    bg: 'bg-red-50',
    text: 'text-red-700',
  },
];

const NICHES = [
  { label: 'Food',        icon: 'https://cdn-icons-png.flaticon.com/512/3565/3565418.png' },
  { label: 'Fashion',     icon: 'https://cdn-icons-png.flaticon.com/512/2965/2965250.png' },
  { label: 'Tech Review', icon: 'https://cdn-icons-png.flaticon.com/512/428/428931.png' },
  { label: 'Gaming',      icon: 'https://cdn-icons-png.flaticon.com/512/3408/3408506.png' },
  { label: 'Fitness',     icon: 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png' },
  { label: 'Lifestyle',   icon: 'https://cdn-icons-png.flaticon.com/512/2619/2619556.png' },
  { label: 'Beauty',      icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998053.png' },
  { label: 'Travel',      icon: 'https://cdn-icons-png.flaticon.com/512/2798/2798031.png' },
  { label: 'Finance',     icon: 'https://cdn-icons-png.flaticon.com/512/2705/2705135.png' },
  { label: 'Education',   icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998592.png' },
  { label: 'Music',       icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384024.png' },
  { label: 'Photography', icon: 'https://cdn-icons-png.flaticon.com/512/1042/1042339.png' },
  { label: 'Health',      icon: 'https://cdn-icons-png.flaticon.com/512/3004/3004655.png' },
  { label: 'DIY & Crafts',icon: 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png' },
  { label: 'Parenting',   icon: 'https://cdn-icons-png.flaticon.com/512/3536/3536417.png' },
  { label: 'Sports',      icon: 'https://cdn-icons-png.flaticon.com/512/2552/2552795.png' },
  { label: 'Business',    icon: 'https://cdn-icons-png.flaticon.com/512/1570/1570952.png' },
  { label: 'Art',         icon: 'https://cdn-icons-png.flaticon.com/512/1361/1361730.png' },
  { label: 'Pet Influencer', icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998587.png' },
  { label: 'Dance',       icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132049.png' },
  { label: 'Comedy',      icon: 'https://cdn-icons-png.flaticon.com/512/2729/2729007.png' },
];

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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 flex items-center justify-between outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300 cursor-pointer"
      >
        {selected ? (
          <span className="flex items-center gap-2.5">
            <img src={selected.icon} alt={selected.label} className="w-5 h-5 object-contain" />
            <span className="text-[15px] font-semibold text-slate-900">{selected.label}</span>
          </span>
        ) : (
          <span className="text-[15px] font-normal text-slate-300">Select a category</span>
        )}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400" />
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden"
          >
            <div className="p-2 grid grid-cols-2 gap-1 max-h-64 overflow-y-auto custom-scroll">
              {NICHES.map((niche, i) => (
                <motion.button
                  key={niche.label}
                  type="button"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.018, duration: 0.18 }}
                  onClick={() => { onChange(niche.label); setOpen(false); }}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer group
                    ${value === niche.label
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-slate-50 border border-transparent'
                    }`}
                >
                  <img src={niche.icon} alt={niche.label} className="w-5 h-5 object-contain flex-shrink-0" />
                  <span className={`text-[13px] font-semibold truncate ${value === niche.label ? 'text-blue-700' : 'text-slate-700'}`}>
                    {niche.label}
                  </span>
                  {value === niche.label && (
                    <Check size={13} className="ml-auto text-blue-600 flex-shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Platform Selector ───────────────────────────────────────────────────────

const PlatformSelector = ({ value, onChange }) => {
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
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 flex items-center justify-between outline-none transition-all focus:border-blue-600 hover:border-slate-300 cursor-pointer"
      >
        <span className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{selected.icon}</span>
          <span className="text-[15px] font-semibold text-slate-900">{selected.label}</span>
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} className="text-slate-400" />
        </motion.span>
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/60 overflow-hidden p-2 flex flex-col gap-1"
          >
            {PLATFORMS.map((platform, i) => (
              <motion.button
                key={platform.value}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.18 }}
                onClick={() => { onChange(platform.value); setOpen(false); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer
                  ${value === platform.value
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-slate-50 border border-transparent'
                  }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${platform.bg} flex-shrink-0`}>
                  {platform.icon}
                </span>
                <span className={`text-[14px] font-semibold ${value === platform.value ? 'text-blue-700' : 'text-slate-700'}`}>
                  {platform.label}
                </span>
                {value === platform.value && (
                  <Check size={14} className="ml-auto text-blue-600 flex-shrink-0" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: 'All',
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

    if (!campaignService || typeof campaignService.createCampaign !== 'function') {
      console.error("DEBUG ERROR: createCampaign is not defined", campaignService);
      alert("Configuration Error: Campaign service is missing.");
      setLoading(false);
      return;
    }

    try {
      await campaignService.createCampaign(formData);
      navigate('/campaigns');
    } catch (err) {
      console.error("DEBUG ERROR: API call failed", err);
      const errorMsg = err.response?.data?.msg || "Failed to create campaign.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const inputClasses = "w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300 placeholder:font-normal";

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-700 font-sans selection:bg-blue-100">
      <Header />
      <main className="flex-grow flex items-center justify-center p-6 md:p-12 mt-20 relative overflow-hidden">
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
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                <label className="text-[14px] font-bold text-slate-800 ml-1">Campaign Title</label>
                <input
                  required name="title" value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Summer Collection 2026"
                  className={inputClasses}
                />
              </motion.div>

              {/* Niche Dropdown */}
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                <label className="text-[14px] font-bold text-slate-800 ml-1">Niche / Category</label>
                <NicheDropdown
                  value={formData.niche}
                  onChange={(val) => setFormData({ ...formData, niche: val })}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
              <label className="text-[14px] font-bold text-slate-800 ml-1">Brief Description</label>
              <textarea
                required name="description" value={formData.description}
                onChange={handleChange} rows="3"
                placeholder="What are your goals for this campaign?"
                className="w-full p-5 bg-slate-50 border-2 border-slate-200 rounded-xl text-[15px] font-semibold text-slate-900 outline-none transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 resize-none placeholder:text-slate-300 placeholder:font-normal"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Platform Dropdown */}
              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                <label className="text-[14px] font-bold text-slate-800 ml-1">Select Platform</label>
                <PlatformSelector
                  value={formData.platform}
                  onChange={(val) => setFormData({ ...formData, platform: val })}
                />
              </motion.div>

              <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2">
                <label className="text-[14px] font-bold text-slate-800 ml-1">Budget Allocation ($)</label>
                <input
                  required type="number" name="budget" value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  className={inputClasses}
                />
              </motion.div>
            </div>

            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="space-y-2 max-w-[280px]">
              <label className="text-[14px] font-bold text-slate-800 ml-1">Target Deadline</label>
              <input
                required type="date" name="deadline" value={formData.deadline}
                onChange={handleChange}
                className="w-full h-12 bg-slate-50 border-2 border-slate-200 rounded-xl px-5 text-[15px] font-bold text-slate-900 outline-none transition-all focus:border-blue-600 cursor-pointer"
              />
            </motion.div>

            <div className="pt-10 flex flex-row items-center justify-end gap-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/campaigns')}
                className="text-[15px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-blue-600 text-white font-bold text-[15px] rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
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