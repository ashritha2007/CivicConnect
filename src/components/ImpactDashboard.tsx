import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Award, Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

const mockData = [
  { name: 'Jan W1', issues: 60, resolved: 40 },
  { name: 'Jan W3', issues: 90, resolved: 60 },
  { name: 'Feb W1', issues: 120, resolved: 75 },
  { name: 'Feb W3', issues: 150, resolved: 90 },
  { name: 'Mar W1', issues: 165, resolved: 120 },
  { name: 'Mar W3', issues: 180, resolved: 140 },
  { name: 'Apr W1', issues: 145, resolved: 120 },
  { name: 'Apr W3', issues: 110, resolved: 95 },
  { name: 'May W1', issues: 95, resolved: 90 },
  { name: 'May W3', issues: 90, resolved: 85 },
  { name: 'Jun W1', issues: 85, resolved: 80 },
  { name: 'Jun W3', issues: 75, resolved: 70 },
  { name: 'Jul W1', issues: 65, resolved: 60 },
];

export const ImpactDashboard = ({ user }: { user: any }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Chart Section */}
      <div className="lg:col-span-2 bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">Impact Overview</h3>
            <p className="text-slate-400 text-sm">City-wide resolution trends</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>
            <span className="text-xs font-bold text-slate-300">Reported</span>
            <span className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] ml-3"></span>
            <span className="text-xs font-bold text-slate-300">Resolved</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#555" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#555" tick={{ fill: '#888', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              />
              <Line 
                type="linear" 
                dataKey="issues" 
                stroke="#ef4444" 
                strokeWidth={3} 
                style={{ filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))' }}
                dot={{ r: 3, fill: '#ef4444', strokeWidth: 0, filter: 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.8))' }} 
                activeDot={{ r: 6, fill: '#ef4444', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 10px rgba(239, 68, 68, 1))' }} 
                isAnimationActive={true} 
                animationDuration={1200} 
                animationEasing="ease-in-out" 
              />
              <Line 
                type="linear" 
                dataKey="resolved" 
                stroke="#22c55e" 
                strokeWidth={3} 
                style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' }}
                dot={{ r: 3, fill: '#22c55e', strokeWidth: 0, filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.8))' }} 
                activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 1))' }} 
                isAnimationActive={true} 
                animationDuration={1200} 
                animationEasing="ease-in-out" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col gap-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(234,179,8,0.1)] flex-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[50px] -mr-16 -mt-16"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-yellow-500 font-bold text-sm uppercase tracking-wider">Your Impact</p>
              <h4 className="text-3xl font-bold text-white">{user?.points || 0} <span className="text-lg text-yellow-500 font-normal">pts</span></h4>
            </div>
          </div>
          <p className="text-slate-400 text-sm">Every valid report earns you 10 points. Reach milestones to earn verified certificates.</p>
        </div>

        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] p-6 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">Local MTTR</p>
              <h4 className="text-3xl font-bold text-white">48<span className="text-lg text-slate-500 font-normal">hrs</span></h4>
            </div>
          </div>
          <p className="text-slate-500 text-sm">Mean Time To Resolution in your locality has improved by 12% this month.</p>
        </div>
      </div>
    </div>
  );
};
