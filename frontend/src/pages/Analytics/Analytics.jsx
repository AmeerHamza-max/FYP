/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    TrendingUp, Users, Target, DollarSign, Zap, Award,
    BarChart2, Activity, ArrowUpRight, ArrowDownRight,
    RefreshCw, CheckCircle
} from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import campaignService from '../../api/campaignService';
import { fetchInfluencerAnalytics } from '../../api/influencerApi';

const COLORS = ['#22d3ee', '#4ade80', '#f59e0b', '#6366f1', '#f43f5e', '#a78bfa', '#fb923c'];

// ── Animated Counter ─────────────────────────────────────────────────
const AnimatedCounter = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const end = parseFloat(value) || 0;
        let startTime = null;
        const duration = 1600;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(parseFloat((end * eased).toFixed(decimals)));
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [value, decimals]);

    return (
        <span>
            {prefix}
            {display.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    );
};

// ── Custom Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#161a31] border border-cyan-500/20 rounded-2xl px-4 py-3 shadow-2xl">
            {label && <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">{label}</p>}
            {payload.map((entry, i) => (
                <p key={i} className="text-sm font-bold" style={{ color: entry.color || '#22d3ee' }}>
                    {entry.name}:{' '}
                    <span className="text-white">
                        {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                    </span>
                </p>
            ))}
        </div>
    );
};

// ── KPI Card ─────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, prefix = '', suffix = '', decimals = 0, sub, trend, color, delay = 0 }) => {
    const isPositive = (trend ?? 0) >= 0;
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay }}
            className="relative bg-[#161a31] rounded-[1.5rem] p-6 border border-white/5 overflow-hidden group hover:shadow-xl transition-all duration-300"
            style={{ boxShadow: `0 4px 24px 0 ${color}12` }}
        >
            <div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[50px] opacity-15 group-hover:opacity-25 transition-opacity"
                style={{ background: color }}
            />
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${color}18`, border: `1.5px solid ${color}30` }}
                    >
                        <Icon size={18} style={{ color }} />
                    </div>
                    {trend !== undefined && (
                        <span className={`flex items-center gap-0.5 text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                            {Math.abs(trend)}x
                        </span>
                    )}
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className="text-3xl font-black text-white tracking-tighter leading-none">
                    <AnimatedCounter value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
                </p>
                {sub && <p className="text-[11px] text-slate-500 mt-2 font-medium">{sub}</p>}
            </div>
        </motion.div>
    );
};

// ── Section Header ────────────────────────────────────────────────────
const SectionHeader = ({ title, sub, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay }}
        className="mb-5 mt-12"
    >
        <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.28em] flex items-center gap-3">
            <span className="w-1 h-4 bg-cyan-500 rounded-full" />
            {title}
        </h2>
        {sub && <p className="text-slate-400 text-xs mt-1 ml-4 font-medium">{sub}</p>}
    </motion.div>
);

// ── Chart Card ────────────────────────────────────────────────────────
const ChartCard = ({ children, delay = 0, className = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay }}
        className={`bg-[#161a31] rounded-[1.5rem] p-6 border border-white/5 shadow-lg ${className}`}
    >
        {children}
    </motion.div>
);

const ChartLabel = ({ children }) => (
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] mb-5">{children}</p>
);

// ── Divider ───────────────────────────────────────────────────────────
const Divider = () => <div className="h-px bg-slate-200 my-2" />;

// ── Main ──────────────────────────────────────────────────────────────
const Analytics = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [kpi, setKpi]             = useState({});
    const [charts, setCharts]       = useState({});
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [lastRefresh, setLastRefresh] = useState(new Date());

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [campRes, infRes] = await Promise.all([
                campaignService.getAllCampaigns(),
                fetchInfluencerAnalytics(),
            ]);

            const data = Array.isArray(campRes?.data)
                ? campRes.data
                : Array.isArray(campRes?.data?.data)
                    ? campRes.data.data
                    : Array.isArray(campRes)
                        ? campRes
                        : [];

            setCampaigns(data);
            setKpi(infRes?.kpi    || {});
            setCharts(infRes?.charts || {});
            setLastRefresh(new Date());
        } catch (err) {
            console.error('Analytics load error:', err);
            setError('Could not load analytics. Please retry.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // ── Loading ──────────────────────────────────────────────────────
    if (loading) return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-5">
                        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
                        <div className="absolute inset-0 rounded-full border-4 border-t-cyan-500 border-transparent animate-spin" />
                        <div className="absolute inset-2.5 rounded-full border-4 border-r-cyan-300 border-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }} />
                        <BarChart2 size={16} className="text-cyan-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-slate-800 font-black text-sm uppercase tracking-widest">Loading Analytics</p>
                    <p className="text-slate-400 text-xs mt-1">Crunching your numbers...</p>
                </div>
            </main>
            <Footer />
        </div>
    );

    // ── Error ────────────────────────────────────────────────────────
    if (error) return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-4">{error}</p>
                    <button onClick={loadData} className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-cyan-500 transition-all cursor-pointer text-sm">
                        Retry
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );

    // ── KPI values ───────────────────────────────────────────────────
    const total          = kpi.totalCampaigns     ?? campaigns.length;
    const active         = kpi.activeCampaigns    ?? 0;
    const completed      = kpi.completedCampaigns ?? 0;
    const pending        = kpi.pendingCampaigns   ?? 0;
    const totalBudget    = kpi.totalBudget        ?? campaigns.reduce((s, c) => s + (Number(c.budget) || 0), 0);
    const avgBudget      = total ? totalBudget / total : 0;
    const completionRate = kpi.completionRate     ?? (total ? parseFloat(((completed / total) * 100).toFixed(1)) : 0);
    const totalInf       = kpi.totalInfluencers   ?? 0;
    const avgAiScore     = kpi.avgAiScore         ?? 0;

    // ── ROI — backend se seedha, sirf multiplier dikhao (1.8x, 7.2x)
    // % wali display hata di — confusing thi aur minus aati thi
    const roiMultiplier = kpi.roiMultiplier ?? 0;   // e.g. 7.24
    const emv           = kpi.estimatedEMV  ?? 0;
    // Radar mein use ke liye percentage chahiye — sirf wahan
    const roiPct        = kpi.estimatedROI  ?? 0;

    // ── Chart data ───────────────────────────────────────────────────

    const budgetTrendRaw = charts.budgetTrend ?? [];
    const budgetData = budgetTrendRaw.length > 0
        ? budgetTrendRaw.map(b => ({
            name:   (b.name ?? b.title ?? b.month ?? b.date ?? b._id ?? '').slice(0, 12),
            Budget: Number(b.Budget ?? b.budget ?? b.amount ?? 0),
        }))
        : campaigns
            .filter(c => Number(c.budget) > 0)
            .map(c => ({
                name:   (c.title ?? 'Untitled').slice(0, 12) + (c.title?.length > 12 ? '…' : ''),
                Budget: Number(c.budget) || 0,
            }));

    const statusColorMap = { active: '#22d3ee', completed: '#4ade80', pending: '#f59e0b' };
    const statusRaw  = charts.statusDistribution ?? [];
    const statusData = statusRaw.length > 0
        ? statusRaw
            .map(s => ({
                name:  s.name ?? s._id ?? 'Unknown',
                value: s.value ?? s.count ?? 0,
                color: s.color ?? statusColorMap[(s._id ?? '').toLowerCase()] ?? '#6366f1',
            }))
            .filter(s => s.value > 0)
        : [
            { name: 'Active',    value: active,    color: '#22d3ee' },
            { name: 'Completed', value: completed, color: '#4ade80' },
            { name: 'Pending',   value: pending,   color: '#f59e0b' },
          ].filter(s => s.value > 0);

    const platformRaw  = charts.platformBreakdown ?? [];
    const platformData = platformRaw.length > 0
        ? platformRaw.map(p => ({ name: p._id ?? p.platform ?? 'Unknown', value: p.count ?? 0 }))
        : Object.entries(
            campaigns.reduce((acc, c) => {
                const p = c.platform ?? 'Unknown';
                acc[p] = (acc[p] || 0) + 1;
                return acc;
            }, {})
          ).map(([name, value]) => ({ name, value }));

    const nicheRaw  = charts.nicheBreakdown ?? [];
    const nicheData = (nicheRaw.length > 0
        ? nicheRaw.map(n => ({
            name:      (n._id ?? n.niche ?? 'Unknown').slice(0, 13),
            Campaigns: n.campaigns ?? n.count ?? 0,
            Budget:    n.totalBudget ?? n.budget ?? 0,
        }))
        : Object.entries(
            campaigns.reduce((acc, c) => {
                const n = c.niche ?? c.category;
                if (n) {
                    if (!acc[n]) acc[n] = { campaigns: 0, budget: 0 };
                    acc[n].campaigns++;
                    acc[n].budget += Number(c.budget) || 0;
                }
                return acc;
            }, {})
          ).map(([niche, d]) => ({
            name:      niche.slice(0, 13),
            Campaigns: d.campaigns,
            Budget:    d.budget,
          }))
    ).sort((a, b) => b.Budget - a.Budget).slice(0, 8);

    const infPlatforms = platformRaw.map(p => ({
        _id:   p._id ?? p.platform ?? 'Unknown',
        count: p.count ?? 0,
    }));

    const radarData = [
        { subject: 'AI Score',   value: avgAiScore },
        { subject: 'Completion', value: completionRate },
        { subject: 'ROI',        value: Math.min(Math.max(roiPct, 0), 100) },
        { subject: 'Budget Eff', value: Math.min((avgBudget / 10000) * 100, 100) },
        { subject: 'Activity',   value: total > 0 ? Math.min((active / total) * 100, 100) : 0 },
        { subject: 'Scale',      value: Math.min((totalInf / 50) * 100, 100) },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
            <Header />

            <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* ── Page Header ─────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                                    <BarChart2 size={18} className="text-cyan-400" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900 uppercase">
                                    Analytics <span className="text-cyan-500">Hub</span>
                                </h1>
                            </div>
                            <p className="text-slate-400 text-xs font-medium ml-[3.25rem]">
                                Enterprise intelligence · Updated {lastRefresh.toLocaleTimeString()}
                            </p>
                        </div>
                        <button
                            onClick={loadData}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer self-start md:self-auto shadow-lg uppercase tracking-widest"
                        >
                            <RefreshCw size={13} />
                            Refresh
                        </button>
                    </motion.div>

                    {/* ── KPI Row 1 ────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <KpiCard icon={Target}      label="Total Campaigns"   value={total}     color="#22d3ee" delay={0.05} />
                        <KpiCard icon={Activity}    label="Active Campaigns"  value={active}    color="#4ade80" delay={0.10} />
                        <KpiCard icon={CheckCircle} label="Completed"         value={completed} color="#f59e0b" delay={0.15} />
                        <KpiCard icon={Users}       label="Influencers Found" value={totalInf}  color="#6366f1" delay={0.20} />
                    </div>

                    {/* ── KPI Row 2 ────────────────────────────────── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <KpiCard icon={DollarSign} label="Total Budget"    value={totalBudget}    prefix="$"   decimals={0}  color="#f43f5e" delay={0.25} />
                        {/* ROI — multiplier style: 1.8x, 7.2x — percent nahi */}
                        <KpiCard icon={TrendingUp} label="ROI Multiplier"  value={roiMultiplier}  suffix="x"   decimals={2}  trend={roiMultiplier} color="#a78bfa" delay={0.30} sub={`Est. EMV $${emv.toLocaleString()}`} />
                        <KpiCard icon={Award}      label="Completion Rate" value={completionRate} suffix="%"   decimals={1}  color="#fb923c" delay={0.35} sub={`${completed} of ${total} done`} />
                        <KpiCard icon={Zap}        label="Avg AI Score"    value={avgAiScore}     decimals={1}              color="#22d3ee" delay={0.40} sub="Out of 100" />
                    </div>

                    <Divider />

                    {/* ── Campaign Intelligence ─────────────────────── */}
                    <SectionHeader title="Campaign Intelligence" sub="Budget allocation & multi-dimensional performance" delay={0.3} />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

                        <ChartCard delay={0.35} className="lg:col-span-2">
                            <ChartLabel>Budget Allocation by Campaign</ChartLabel>
                            {budgetData.length === 0 ? (
                                <div className="h-[250px] flex items-center justify-center text-slate-500 text-sm">No campaign budget data yet</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={budgetData}>
                                        <defs>
                                            <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" />
                                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="Budget" stroke="#22d3ee" strokeWidth={2.5} fill="url(#bg1)" dot={{ fill: '#22d3ee', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>

                        <ChartCard delay={0.40}>
                            <ChartLabel>Performance Radar</ChartLabel>
                            <ResponsiveContainer width="100%" height={250}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="#ffffff10" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 700 }} />
                                    <Radar dataKey="value" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.12} strokeWidth={2} />
                                    <Tooltip content={<CustomTooltip />} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </div>

                    <Divider />

                    {/* ── Distribution ─────────────────────────────── */}
                    <SectionHeader title="Distribution Breakdown" sub="Campaign status, platform & niche spread" delay={0.4} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">

                        <ChartCard delay={0.45}>
                            <ChartLabel>Campaign Status</ChartLabel>
                            {statusData.length === 0 ? (
                                <div className="h-[210px] flex items-center justify-center text-slate-500 text-sm">No data</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={210}>
                                    <PieChart>
                                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={4} dataKey="value">
                                            {statusData.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>

                        <ChartCard delay={0.50}>
                            <ChartLabel>Platform Distribution</ChartLabel>
                            {platformData.length === 0 ? (
                                <div className="h-[210px] flex items-center justify-center text-slate-500 text-sm">No data</div>
                            ) : (
                                <ResponsiveContainer width="100%" height={210}>
                                    <PieChart>
                                        <Pie data={platformData} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={4} dataKey="value">
                                            {platformData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </ChartCard>

                        <ChartCard delay={0.55}>
                            <ChartLabel>Budget Summary</ChartLabel>
                            <div className="flex flex-col justify-between h-[210px] py-2">
                                <div className="text-center">
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Avg per Campaign</p>
                                    <p className="text-4xl font-black text-white tracking-tighter">
                                        <AnimatedCounter value={avgBudget} prefix="$" decimals={0} />
                                    </p>
                                </div>
                                <div className="space-y-3 mt-4">
                                    {[
                                        { label: 'Total Budget',   value: `$${totalBudget.toLocaleString()}`,  color: 'text-white' },
                                        { label: 'Estimated EMV',  value: `$${emv.toLocaleString()}`,          color: 'text-green-400' },
                                        { label: 'ROI Multiplier', value: `${roiMultiplier}x`,                 color: 'text-cyan-400' },
                                    ].map((row, i) => (
                                        <div key={i} className="flex items-center justify-between px-1">
                                            <span className="text-[11px] text-slate-400 font-bold">{row.label}</span>
                                            <span className={`text-[11px] font-black ${row.color}`}>{row.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </ChartCard>
                    </div>

                    <Divider />

                    {/* ── Niche Intelligence ───────────────────────── */}
                    <SectionHeader title="Niche Intelligence" sub="Top categories by campaign count & budget" delay={0.5} />
                    <ChartCard delay={0.55} className="mb-5">
                        <ChartLabel>Niche / Category Performance</ChartLabel>
                        {nicheData.length === 0 ? (
                            <div className="h-[230px] flex items-center justify-center text-slate-500 text-sm">No niche data available</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={230}>
                                <BarChart data={nicheData} barSize={18} barGap={5}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left"  tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }} />
                                    <Bar yAxisId="left"  dataKey="Campaigns" fill="#22d3ee" radius={[5, 5, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="Budget"    fill="#6366f1" radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </ChartCard>

                    <Divider />

                    {/* ── Influencer Pool ──────────────────────────── */}
                    <SectionHeader title="Influencer Pool" sub="Global database statistics" delay={0.6} />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <ChartCard delay={0.65}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total in Database</p>
                            <p className="text-5xl font-black text-white tracking-tighter">
                                <AnimatedCounter value={totalInf} />
                            </p>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Verified influencers</p>
                        </ChartCard>

                        <ChartCard delay={0.70}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Avg AI Score</p>
                            <p className="text-5xl font-black text-cyan-400 tracking-tighter">
                                <AnimatedCounter value={avgAiScore} decimals={1} />
                            </p>
                            <p className="text-xs text-slate-500 mt-2 font-medium">Out of 100</p>
                        </ChartCard>

                        <ChartCard delay={0.75}>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Platform Split</p>
                            <div className="space-y-3">
                                {infPlatforms.length === 0 ? (
                                    <p className="text-slate-500 text-xs">No platform data</p>
                                ) : infPlatforms.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-400 w-20 truncate">{p._id}</span>
                                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((p.count / (total || 1)) * 100, 100)}%` }}
                                                transition={{ delay: 0.85 + i * 0.1, duration: 0.9 }}
                                                className="h-full rounded-full"
                                                style={{ background: COLORS[i % COLORS.length] }}
                                            />
                                        </div>
                                        <span className="text-xs font-black text-white w-6 text-right">{p.count}</span>
                                    </div>
                                ))}
                            </div>
                        </ChartCard>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Analytics;