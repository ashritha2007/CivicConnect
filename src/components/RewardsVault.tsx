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
    <div className="bg-[#050505] border border-white/5 rounded-[2rem] p-8 mb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500/0 via-yellow-500 to-yellow-500/0" />
      
      <div className="flex items-center gap-3 mb-8">
        <Award className="w-8 h-8 text-yellow-500" />
        <h3 className="text-2xl font-bold text-white">Rewards Vault</h3>
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
              className={`p-6 rounded-2xl border transition-all ${isUnlocked ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/5 border-white/5 opacity-70'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isUnlocked ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 'bg-black text-slate-500'}`}>
                  {isUnlocked ? <Award className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold uppercase tracking-wider ${isUnlocked ? 'text-yellow-500' : 'text-slate-500'}`}>
                    {stone.target} Reports
                  </span>
                </div>
              </div>
              
              <h4 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-slate-400'}`}>{stone.title}</h4>
              
              {!isUnlocked ? (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-black rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-yellow-500/50" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 text-right">{userReports} / {stone.target}</p>
                </div>
              ) : (
                <button className="mt-4 w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-sm font-bold rounded-lg border border-yellow-500/20 transition-all flex items-center justify-center gap-2">
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
