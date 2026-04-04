import React, { useState, useEffect } from 'react';
import { ThumbsUp, MapPin, AlertCircle, ChevronRight, Search, Flame, Skull } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export interface Issue {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  votes: number;
  photo_url: string;
  created_at?: string;
  createdAt?: string;
  locality: string;
  is_high_priority: boolean;
  severity: string;
}

interface IssueCardProps {
  issue: Issue;
  isAdmin: boolean;
  onSelect: (id: number) => void;
  onVote: (id: number, e: React.MouseEvent) => void;
}

const VOTE_HIGHLIGHT_THRESHOLD = 10;

export const IssueCard: React.FC<IssueCardProps> = ({ issue, isAdmin, onSelect, onVote }) => {
  const isHighVoted = issue.votes >= VOTE_HIGHLIGHT_THRESHOLD;
  const isCritical = issue.severity === 'critical';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={() => onSelect(issue.id)}
      className={`group relative rounded-[2.5rem] overflow-hidden transition-all cursor-pointer ${isCritical
        ? 'critical-glow'
        : isHighVoted || issue.is_high_priority
          ? 'high-priority-glow'
          : isAdmin
            ? 'admin-glow-card'
            : 'glass-card'
        }`}
    >
      {/* Top accent bar */}
      {isCritical && (
        <div className="w-full h-1.5 bg-gradient-to-r from-red-600 via-red-400 to-red-600 animate-pulse" />
      )}

      {issue.photo_url && (
        <div className="h-60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
          <img
            src={issue.photo_url}
            alt={issue.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${isCritical ? 'grayscale-[0.3] group-hover:grayscale-0' : ''}`}
          />
          <div className="absolute bottom-4 left-6 z-20 flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest status-${issue.status}`}>
              {issue.status.replace('_', ' ')}
            </span>
            {isCritical && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-red-500/40">
                <Skull className="w-3 h-3" /> FATALITY RISK
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-8 space-y-4">
        <div className="flex justify-between items-start gap-4">
          <h3 className={`font-bold text-2xl line-clamp-2 leading-tight transition-colors ${isCritical ? 'text-white' : isHighVoted || issue.is_high_priority ? 'text-red-300 group-hover:text-red-200' : 'text-white group-hover:text-red-400'
            }`}>
            {issue.title}
          </h3>
          <div className="flex items-center gap-1.5 shrink-0 mt-1">
            {isCritical && <Skull className="w-5 h-5 text-red-500 animate-bounce" />}
            {isHighVoted && (
              <Flame className={`w-5 h-5 fill-current animate-pulse ${isAdmin ? 'text-red-400' : 'text-yellow-400'}`} />
            )}
          </div>
        </div>

        {!issue.photo_url && (
          <div className="flex gap-2">
            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest status-${issue.status}`}>
              {issue.status.replace('_', ' ')}
            </span>
            {isCritical && (
              <span className="px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest">
                CRITICAL
              </span>
            )}
          </div>
        )}

        <p className="text-slate-400 text-base line-clamp-3 leading-relaxed">{issue.description}</p>

        <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            <MapPin className={`w-4 h-4 ${isCritical || isAdmin ? 'text-red-500' : 'text-yellow-500'}`} /> {issue.locality}
          </span>
          <span className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
            {formatDistanceToNow(new Date(issue.createdAt || issue.created_at))} ago
          </span>
        </div>

        <div className="pt-6 flex items-center justify-between border-t border-white/5 mt-2">
          <button
            onClick={(e) => onVote(issue.id, e)}
            disabled={isAdmin}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl transition-all text-sm font-bold ${isAdmin
              ? 'bg-white/5 text-slate-500 cursor-not-allowed'
              : `bg-white/5 hover:bg-yellow-500 hover:text-black ${isHighVoted ? 'text-yellow-400' : ''}`
              }`}
          >
            <ThumbsUp className={`w-4 h-4 ${issue.votes > 0 ? 'fill-current' : ''}`} />
            <span>{issue.votes} Support</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400 group-hover:text-white transition-colors">
            <span className="text-xs font-bold uppercase tracking-widest">{isAdmin ? 'Action Required' : 'View Impact'}</span>
            <ChevronRight className={`w-4 h-4 ${isCritical ? 'text-red-500' : isAdmin ? 'text-red-400' : 'text-yellow-500'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const IssueList: React.FC<{ onSelect: (id: number) => void; isAdmin?: boolean, userRole?: string }> = ({ onSelect, isAdmin = false, userRole }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filter, setFilter] = useState({ state: '', district: '', category: '', status: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchIssues = async () => {
    const paramsObj: any = { ...filter };
    if (userRole) paramsObj.role = userRole;
    const params = new URLSearchParams(paramsObj);
    const res = await fetch(`/api/issues?${params}`);
    const data = await res.json();
    // Sort: high priority + most voted first
    const sorted = [...data].sort((a: Issue, b: Issue) => {
      if (a.is_high_priority && !b.is_high_priority) return -1;
      if (!a.is_high_priority && b.is_high_priority) return 1;
      return b.votes - a.votes;
    });
    setIssues(sorted);
  };

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const handleVote = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdmin) return;
    const res = await fetch(`/api/issues/${id}/vote`, { method: 'POST' });
    if (res.ok) fetchIssues();
    else {
      const err = await res.json();
      alert(err.error);
    }
  };

  const filteredIssues = issues.filter(issue =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topIssues = filteredIssues.filter(i => i.votes >= VOTE_HIGHLIGHT_THRESHOLD || i.is_high_priority);
  const regularIssues = filteredIssues.filter(i => i.votes < VOTE_HIGHLIGHT_THRESHOLD && !i.is_high_priority);

  return (
    <div className="space-y-8">
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search issues or areas..."
            className={`w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 rounded-2xl outline-none transition-all text-white ${isAdmin ? 'focus:border-red-500/50 focus:ring-red-500/10' : 'focus:border-yellow-500/50 focus:ring-yellow-500/10'
              }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="flex-1 md:flex-none bg-white/5 border border-white/10 text-slate-300 rounded-2xl px-4 py-4 text-sm outline-none focus:border-red-500/50 transition-all"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="" className="bg-black">All Categories</option>
            <option className="bg-black">Roads</option>
            <option className="bg-black">Sanitation</option>
            <option className="bg-black">Water Supply</option>
            <option className="bg-black">Electricity</option>
            <option className="bg-black">Public Safety</option>
          </select>
          <select
            className="flex-1 md:flex-none bg-white/5 border border-white/10 text-slate-300 rounded-2xl px-4 py-4 text-sm outline-none focus:border-red-500/50 transition-all"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="" className="bg-black">All Status</option>
            <option value="not_started" className="bg-black">Not Started</option>
            <option value="in_progress" className="bg-black">In Progress</option>
            <option value="resolved" className="bg-black">Resolved</option>
          </select>
        </div>
      </div>

      {/* High-priority / high-vote alert section */}
      {topIssues.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(234,179,8,0.1)',
                border: `1px solid ${isAdmin ? 'rgba(239,68,68,0.3)' : 'rgba(234,179,8,0.3)'}`
              }}>
              <Flame className={`w-4 h-4 fill-current animate-pulse ${isAdmin ? 'text-red-500' : 'text-yellow-500'}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${isAdmin ? 'text-red-400' : 'text-yellow-400'}`}>
                {isAdmin ? 'GVMC — Immediate Attention Required' : 'Community Alert — High-Priority Issues'}
              </span>
            </div>
            <div className={`flex-1 h-px bg-gradient-to-r ${isAdmin ? 'from-red-500/30' : 'from-yellow-500/30'} to-transparent`} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {topIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} isAdmin={isAdmin} onSelect={onSelect} onVote={handleVote} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular issues */}
      {regularIssues.length > 0 && (
        <div className="space-y-4">
          {topIssues.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">All Reports</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {regularIssues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} isAdmin={isAdmin} onSelect={onSelect} onVote={handleVote} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {filteredIssues.length === 0 && (
        <div className="text-center py-20 text-slate-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-bold text-lg">No issues found</p>
        </div>
      )}
    </div>
  );
};
