import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, CheckCircle2, Clock, AlertTriangle, TrendingUp, Map as MapIcon, ArrowUpRight, Building2, Image as ImageIcon } from 'lucide-react';
import { IssueCard, Issue } from './IssueList';
import { HeatMap } from './MapComponents';
import { motion } from 'motion/react';

export const AdminDashboard: React.FC<{ user?: any, corporation?: string }> = ({ user, corporation }) => {
  const [stats, setStats] = useState<any>(null);
  const [issues, setIssues] = useState<any[]>([]);

  useEffect(() => {
    const roleQuery = user?.role ? `role=${user.role}` : '';
    const corpQuery = corporation && corporation !== 'all' ? `corporation=${corporation}` : '';
    const queryStr = [roleQuery, corpQuery].filter(Boolean).join('&');
    const finalQuery = queryStr ? `?${queryStr}` : '';
    
    fetch(`/api/analytics${finalQuery}`).then(res => res.json()).then(setStats);
    fetch(`/api/issues${finalQuery}`).then(res => res.json()).then(setIssues);
  }, [user, corporation]);

  if (!stats) return <div className="flex items-center justify-center h-64 text-emerald-600 font-bold animate-pulse">Synchronizing {corporation !== 'all' ? corporation : 'Global'} Telemetry...</div>;

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-emerald-200 p-4 rounded-2xl shadow-xl"
        >
          <p className="text-slate-900 font-bold mb-2">{label || payload[0].name}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color || entry.payload.fill || '#10b981' }} />
              <span className="text-slate-500">{entry.name}:</span>
              <span className="text-slate-900 font-bold">{entry.value}</span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-emerald-100 p-6 rounded-[2rem] relative overflow-hidden group hover:border-emerald-200 hover:shadow-md transition-all"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 blur-2xl -mr-8 -mt-8 transition-all group-hover:opacity-20`}></div>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">{value || 0}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-100 transition-all duration-500`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Building2 className="w-6 h-6 text-emerald-500" />
          {corporation === 'all' ? 'Global Live Analytics' : `${corporation} Operating Dashboard`}
        </h2>
        {user?.role === 'superadmin' && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 uppercase tracking-widest">
            {corporation === 'all' ? 'Monitoring All' : `Monitoring ${corporation}`}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Assigned" value={stats.total} icon={TrendingUp} color="bg-red-500" delay={0.1} />
        <StatCard title="Not Started" value={stats.total - stats.resolved - stats.pending} icon={AlertTriangle} color="bg-slate-500" delay={0.2} />
        <StatCard title="In Progress" value={stats.pending} icon={Clock} color="bg-amber-500" delay={0.3} />
        <StatCard title="Completed" value={stats.resolved} icon={CheckCircle2} color="bg-emerald-500" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-emerald-100 p-6 rounded-[2.5rem] hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
            Status Breakdown
          </h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {stats.byStatus.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="rgba(255,255,255,0.8)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">{value.replace('_', ' ')}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Category Distribution / Workload if "all" */}
        <motion.div
           initial={{ opacity: 0, x: 20, y: 20 }}
           animate={{ opacity: 1, x: 0, y: 0 }}
           transition={{ delay: 0.6 }}
           className="bg-white border border-emerald-100 p-6 rounded-[2.5rem] hover:border-emerald-200 hover:shadow-md transition-all"
        >
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">
            {corporation === 'all' ? 'Volume by Corporation' : 'Category Distribution'}
          </h3>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={corporation === 'all' ? stats.byCorporation : stats.byCategory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                     <stop offset="100%" stopColor="#047857" stopOpacity={0.3} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,185,129,0.1)" />
                 <XAxis dataKey={corporation === 'all' ? 'name' : 'category'} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16,185,129,0.05)' }} />
                 <Bar
                   dataKey="count"
                   name="Reports"
                   fill="url(#colorBar)"
                   radius={[6, 6, 0, 0]}
                   label={{ position: 'top', fill: '#059669', fontSize: 10, fontWeight: 'bold', formatter: (val: any) => val > 0 ? val : '' }}
                 />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Structured Issues Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-8"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0d0d0d] rounded-t-[2.5rem]">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
            Active Cases Registry
          </h3>
          <span className="px-3 py-1 bg-white/5 text-slate-400 text-xs font-bold rounded-xl">{issues.length} records found</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {issues.length > 0 ? (
            issues.map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                isAdmin={true} 
                onSelect={(id) => console.log('Selected', id)} 
                onVote={() => {}} 
              />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-slate-500 bg-[#0d0d0d] rounded-b-[2.5rem] border border-white/5">
              <p className="text-sm font-medium">No records found for this corporation.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
