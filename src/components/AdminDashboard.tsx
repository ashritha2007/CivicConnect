import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  CheckCircle2, Clock, AlertTriangle, TrendingUp,
  Building2, Zap, ShieldAlert, LayoutDashboard,
  RefreshCw, Activity, BarChart2 as BarChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IssueCard } from './IssueList';

// ─── Corporation Config ────────────────────────────────────────────────────────
export const CORP_CONFIG: Record<string, {
  label: string;
  shortName: string;
  icon: React.ElementType;
  gradient: string;
  accent: string;
  badge: string;
  categories: string[];
  image?: string;
}> = {
  all: {
    label: 'Global System Overview',
    shortName: 'All Corporations',
    icon: LayoutDashboard,
    gradient: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    categories: [],
  },
  GVMC: {
    label: 'Greater Visakhapatnam Municipal Corporation',
    shortName: 'GVMC',
    icon: Building2,
    gradient: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    categories: ['Sanitation', 'Water Supply', 'Garbage'],
    image: 'https://upload.wikimedia.org/wikipedia/pam/6/65/GVMC-logo.jpg'
  },
  VMRDA: {
    label: 'Visakhapatnam Metropolitan Region Development Authority',
    shortName: 'VMRDA',
    icon: Building2,
    gradient: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    categories: ['Roads', 'Infrastructure', 'Pothole'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7kaZsv-NOar0aaNoSa4hO-7CnFg971gXc4g&s'
  },
  EDPCL: {
    label: 'Eastern Power Distribution Company Ltd.',
    shortName: 'EDPCL',
    icon: Zap,
    gradient: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    categories: ['Electricity', 'Electrical'],
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC4a39KClgzDQ7VJ8PCybFVejPwurCWjQl0w&s'
  },
  POLICE: {
    label: 'City Police',
    shortName: 'City Police',
    icon: ShieldAlert,
    gradient: 'from-emerald-600 to-teal-700',
    accent: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    categories: ['Public Safety'],
    image: 'https://upload.wikimedia.org/wikipedia/en/e/ea/Appolice%28emblem%29.png'
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white border border-slate-100 p-6 rounded-[2rem] relative overflow-hidden group hover:shadow-md transition-all"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 opacity-10 blur-2xl -mr-8 -mt-8 transition-all group-hover:opacity-20 ${colorClass}`} />
    <div className="flex justify-between items-start relative z-10">
      <div>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
        <h3 className="text-4xl font-bold text-slate-900 mt-2 tracking-tight">{value ?? 0}</h3>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 group-hover:bg-slate-100 transition-all">
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl text-sm">
        <p className="font-bold text-slate-900 mb-1">{label || payload[0].name}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.payload?.fill || '#10b981' }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-bold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


// ─── Main AdminDashboard ───────────────────────────────────────────────────────
export const AdminDashboard: React.FC<{ user?: any; corporation?: string }> = ({ user, corporation = 'all' }) => {
  const [stats, setStats] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const config = CORP_CONFIG[corporation] || CORP_CONFIG['all'];
  const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const corpParam = corporation && corporation !== 'all' ? `corporation=${corporation}` : '';
      const [statsRes, issuesRes] = await Promise.all([
        fetch(`/api/analytics${corpParam ? `?${corpParam}` : ''}`),
        fetch(`/api/issues${corpParam ? `?${corpParam}` : ''}`),
      ]);
      const [statsData, issuesData] = await Promise.all([statsRes.json(), issuesRes.json()]);
      setStats(statsData);
      setIssues(Array.isArray(issuesData) ? issuesData : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [corporation]);

  // Initial load + auto-refresh every 60 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse">
          Loading {corporation !== 'all' ? config.shortName : 'Global'} dashboard…
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={corporation}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* ── Dashboard Header ── */}
        <div className={`relative p-6 rounded-[2rem] overflow-hidden bg-gradient-to-br ${config.gradient}`}
          style={{ boxShadow: '0 4px 30px rgba(0,0,0,0.12)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <config.icon className="w-5 h-5 text-white/80" />
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
                  {corporation === 'all' ? 'Super Admin — Global System Overview' : `${config.shortName} Operations Command`}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                {config.label}
              </h2>
              {corporation !== 'all' && config.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {config.categories.map(cat => (
                    <span key={cat} className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {config.image && (
                <div className="w-14 h-14 rounded-full bg-white p-1 overflow-hidden shadow-lg border-2 border-white/20">
                  <img src={config.image} alt={config.shortName} className="w-full h-full object-contain" />
                </div>
              )}
              <button
                onClick={fetchData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all border border-white/20"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Issues" value={stats.total} icon={TrendingUp} colorClass="bg-indigo-500" delay={0.05} />
            <StatCard title="Not Started" value={stats.notStarted ?? (stats.total - stats.resolved - stats.inProgress)} icon={AlertTriangle} colorClass="bg-slate-500" delay={0.1} />
            <StatCard title="In Progress" value={stats.inProgress ?? stats.pending} icon={Clock} colorClass="bg-blue-500" delay={0.15} />
            <StatCard title="Completed" value={stats.resolved} icon={CheckCircle2} colorClass="bg-emerald-500" delay={0.2} />
          </div>
        )}

        {/* ── Charts Row ── */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution Pie */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status Distribution</h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byStatus}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={85}
                      paddingAngle={4}
                      dataKey="count" nameKey="status"
                    >
                      {stats.byStatus.map((_: any, i: number) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="bottom" height={36} iconType="circle"
                      formatter={(v) => <span className="text-slate-600 text-[10px] font-bold uppercase tracking-wider">{String(v).replace(/_/g, ' ')}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Volume by Category / Corporation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white border border-slate-100 p-6 rounded-[2rem] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-6">
                <BarChartIcon className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  {corporation === 'all' ? 'Volume by Corporation' : 'Category Breakdown'}
                </h3>
              </div>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={corporation === 'all' ? stats.byCorporation : stats.byCategory}
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="corpBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                      dataKey={corporation === 'all' ? 'name' : 'category'}
                      stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false}
                      tick={{ fill: '#94a3b8' }}
                    />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
                    <Bar
                      dataKey="count" name="Reports"
                      fill="url(#corpBarGrad)" radius={[6, 6, 0, 0]}
                      label={{ position: 'top', fill: '#059669', fontSize: 10, fontWeight: 'bold', formatter: (v: any) => v > 0 ? v : '' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        {/* ── Issue Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm"
        >
          {/* Table Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                {corporation === 'all' ? 'All Active Cases' : `${config.shortName} Issue Registry`}
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">
                {issues.length} record{issues.length !== 1 ? 's' : ''} found
                {corporation !== 'all' && (
                  <span className="ml-2 text-slate-300">—</span>
                )}
                {corporation !== 'all' && (
                  <span className="ml-1 text-slate-400">filtered to {config.shortName} responsibility</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse`} />
              Auto-refresh: 60s
            </div>
          </div>

          {/* Table */}
          {issues.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {issues.map(issue => (
                  <IssueCard
                    key={issue.id || issue._id}
                    issue={issue}
                    isAdmin={true}
                    onSelect={() => {}}
                    onVote={() => {}}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-slate-400" />
              </div>
              <p className="text-slate-500 font-bold text-sm">No issues found</p>
              <p className="text-slate-400 text-xs mt-1">
                {corporation !== 'all'
                  ? `No ${config.shortName} issues are currently in the system.`
                  : 'The system is clear of all reports.'}
              </p>
            </div>
          )}

          {/* Last updated footer */}
          <div className="px-6 py-3 border-t border-slate-50 flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            <RefreshCw className="w-3 h-3" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
