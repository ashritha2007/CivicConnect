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
      <div className="lg:col-span-2 bg-white border border-emerald-100 rounded-[2rem] p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Impact Overview</h3>
            <p className="text-slate-500 text-sm">City-wide resolution trends</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>
            <span className="text-xs font-bold text-slate-600">Reported</span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] ml-3"></span>
            <span className="text-xs font-bold text-slate-600">Resolved</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16,185,129,0.1)" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderColor: '#a7f3d0', borderRadius: '12px', color: '#0f172a' }}
                itemStyle={{ color: '#0f172a' }}
                cursor={{ stroke: 'rgba(16,185,129,0.1)', strokeWidth: 1 }}
              />
              <Line 
                type="linear" 
                dataKey="issues" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }}
                dot={{ r: 3, fill: '#f59e0b', strokeWidth: 0, filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.4))' }} 
                activeDot={{ r: 6, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.6))' }} 
                isAnimationActive={true} 
                animationDuration={1200} 
                animationEasing="ease-in-out" 
              />
              <Line 
                type="linear" 
                dataKey="resolved" 
                stroke="#10b981" 
                strokeWidth={3} 
                style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.4))' }}
                dot={{ r: 3, fill: '#10b981', strokeWidth: 0, filter: 'drop-shadow(0 0 5px rgba(16, 185, 129, 0.4))' }} 
                activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))' }} 
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
        <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-6 shadow-md flex-1 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -mr-16 -mt-16"></div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider">Your Impact</p>
              <h4 className="text-3xl font-bold text-slate-900">{user?.points || 0} <span className="text-lg text-emerald-500 font-normal">pts</span></h4>
            </div>
          </div>
          <p className="text-slate-600 text-sm">Every valid report earns you 10 points. Reach milestones to earn verified certificates.</p>
        </div>

        <div className="bg-white border border-emerald-100 rounded-[2rem] p-6 shadow-md flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Local MTTR</p>
              <h4 className="text-3xl font-bold text-slate-900">48<span className="text-lg text-slate-400 font-normal">hrs</span></h4>
            </div>
          </div>
          <p className="text-slate-600 text-sm">Mean Time To Resolution in your locality has improved by 12% this month.</p>
        </div>
      </div>
    </div>
  );
};
