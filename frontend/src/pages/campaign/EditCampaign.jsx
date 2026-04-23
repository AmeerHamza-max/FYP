/* eslint-disable */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import campaignService from "../../api/campaignService";

const EditCampaign = ({ onClose, campaignId }) => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    platform: "TikTok",
    budget: "",
    deadline: "",
    niche: ""
  });

  // Fetch campaign data
  useEffect(() => {
    if (!campaignId) return;

    const loadCampaign = async () => {
      try {
        setFetching(true);
        const res = await campaignService.getCampaignById(campaignId);
        const data = res; // service normalized data return karti hai

        const formatted = {
          title: data?.title || "",
          description: data?.description || "",
          platform: data?.platform || "TikTok",
          budget: data?.budget || "",
          niche: data?.niche || "",
          deadline: data?.deadline
            ? new Date(data.deadline).toISOString().split("T")[0]
            : ""
        };

        setFormData(formatted);
        setOriginalData(formatted);
      } catch (err) {
        console.error("Campaign fetch failed:", err);
        onClose();
      } finally {
        setFetching(false);
      }
    };

    loadCampaign();
  }, [campaignId, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await campaignService.updateCampaign(campaignId, formData);
      onClose();
    } catch (err) {
      alert(err.response?.data?.msg || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[150]">
        <div className="text-white font-bold text-lg">
          Loading campaign...
        </div>
      </div>
    );
  }

  const isCriteriaChanged =
    originalData &&
    (formData.niche !== originalData.niche ||
      formData.platform !== originalData.platform);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">

      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl p-10 z-20"
      >

        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-xs text-cyan-500 font-bold tracking-widest uppercase">
              Update Mode
            </p>
            <h2 className="text-3xl font-bold text-slate-900 italic">
              Edit Campaign
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 text-xl flex items-center gap-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Title */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border-b-2 border-slate-200 focus:border-cyan-400 outline-none pb-3 text-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border-b-2 border-slate-200 focus:border-cyan-400 outline-none pb-3"
            />
          </div>

          {/* Platform & Niche */}
          <div className="grid grid-cols-2 gap-6">

            {/* Platform */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-200 focus:border-cyan-400 outline-none pb-3"
              >
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="All">All</option>
              </select>
            </div>

            {/* Niche */}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">
                Niche
              </label>
              <input
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                required
                className="w-full border-b-2 border-slate-200 focus:border-cyan-400 outline-none pb-3"
              />
              {isCriteriaChanged && (
                <p className="text-xs text-orange-400 mt-1">
                  ⚠️ Changing niche refreshes influencers
                </p>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-8 border-t">

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-slate-400 hover:text-red-500 flex items-center gap-2"
            >
              ← Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`px-10 py-4 rounded-full text-xs font-bold tracking-widest shadow-lg flex items-center gap-2 ${
                loading
                  ? "bg-slate-200 text-slate-400"
                  : "bg-slate-900 text-cyan-400 hover:bg-cyan-500 hover:text-white"
              }`}
            >
              {loading ? "Saving..." : "Update Campaign"}
              {!loading && <ArrowRight size={16} />}
            </button>

          </div>

        </form>

      </motion.div>
    </div>
  );
};

export default EditCampaign;