import React from 'react';
import { Award, Download, Lock } from 'lucide-react';
import { motion } from 'motion/react';

const MILESTONES = [
  { target: 10, title: 'Civic Starter', points: 100 },
  { target: 40, title: 'Active Guardian', points: 400 },
  { target: 90, title: 'Civic Saviour', points: 900 },
];

export const RewardsVault = ({ user }: { user: any }) => {
  const userReports = user?.report_count || 0;

  return (
    <div className="bg-white border border-emerald-100 rounded-[2rem] p-8 mb-12 relative overflow-hidden shadow-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
      
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-emerald-500" />
        <h3 className="text-2xl font-bold text-slate-900">Rewards Vault</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MILESTONES.map((stone, idx) => {
          const isUnlocked = userReports >= stone.target;
          const progress = Math.min((userReports / stone.target) * 100, 100);
          
          return (
            <motion.div 
              key={stone.target}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl border transition-all ${isUnlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 opacity-70'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-emerald-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)]' : 'bg-slate-200 text-slate-400'}`}>
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isUnlocked ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {stone.target} Reports
                  </span>
                </div>
              </div>
              
              <h4 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-slate-900' : 'text-slate-500'}`}>{stone.title}</h4>
              
              {!isUnlocked ? (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-emerald-400" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 text-right">{userReports} / {stone.target}</p>
                </div>
              ) : (
                <button className="mt-4 w-full py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-200 transition-all flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
