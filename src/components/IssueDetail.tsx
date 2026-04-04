import React, { useState, useEffect } from 'react';
import { X, Clock, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { Building2, Landmark, ShieldCheck, Skull, Flame, AlertTriangle } from 'lucide-react';


export const IssueDetail: React.FC<{ issueId: number; onClose: () => void; isAdmin?: boolean }> = ({ issueId, onClose, isAdmin }) => {
  const [data, setData] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`/api/issues/${issueId}/details`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => { fetchData(); }, [issueId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    const token = localStorage.getItem('token');
    await fetch(`/api/issues/${issueId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ text: comment, role: isAdmin ? 'admin' : 'user' }),
    });
    setComment('');
    fetchData();
  };

  const updateStatus = async (status: string) => {
    setUpdating(true);
    const note = prompt('Add a progress note (optional):');
    const token = localStorage.getItem('token');
    await fetch(`/api/issues/${issueId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ status, note }),
    });
    fetchData();
    setUpdating(false);
  };

  if (!data) return null;
  const { issue, timeline, comments } = data;

  const handleAssignCorporation = async (corp: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/issues/${issueId}/assign`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ corporation: corp }),
      });
      await fetchData();
    } finally {
      setUpdating(false);
    }
  };


  // Theme-aware accent colors
  const accent = 'green';
  const isCritical = issue.severity === 'critical';
  const accentText = isCritical ? 'text-red-600' : 'text-emerald-600';
  const accentText2 = isCritical ? 'text-red-700' : 'text-emerald-600';
  const topBar = isCritical 
    ? 'bg-gradient-to-r from-red-600 via-red-400 to-red-600'
    : 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500';
  const sendBtn = 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.2)]';
  const inputFocus = 'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl"
    >
      <motion.div
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`bg-white w-full max-w-6xl max-h-[92vh] rounded-[3.5rem] overflow-hidden shadow-2xl border flex flex-col relative ${
          isCritical ? 'border-red-200' : 'border-emerald-100'
        }`}
      >
        {/* Accent top bar */}
        <div className={`absolute top-0 left-0 w-full h-1.5 ${topBar} ${isCritical ? 'animate-pulse' : ''}`} />

        {/* Header */}
        <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-[80%]">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isCritical ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : `status-${issue.status}`
              }`}>
                {isCritical ? 'CRITICAL ALERT' : issue.status.replace('_', ' ')}
              </span>
              {(issue.is_high_priority || isCritical) && (
                <span className={`${isCritical ? 'text-red-600 animate-bounce' : 'text-emerald-600'} text-[10px] font-bold uppercase tracking-widest flex items-center gap-2`}>
                  {isCritical ? <Skull className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {isCritical ? 'EXTREME FATALITY RISK' : 'High Priority Case'}
                </span>
              )}
            </div>
            <h2 className={`text-4xl font-bold tracking-tighter ${isCritical ? 'text-slate-900' : 'text-slate-900'}`}>
              {issue.title}
            </h2>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-slate-700">
                <MapPin className={`w-4 h-4 ${accentText2}`} /> {issue.locality}, {issue.district}
              </span>
              <span className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 text-slate-700">
                <Calendar className={`w-4 h-4 ${accentText2}`} /> {format(new Date(issue.createdAt || issue.created_at), 'PPP')}
              </span>
              {issue.assigned_corporation && (
                <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600">
                  <Building2 className={`w-4 h-4 ${accentText2}`} /> {issue.assigned_corporation}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-5 bg-slate-50 hover:bg-slate-100 rounded-[2rem] transition-all border border-slate-200 group active:scale-95">
            <X className="w-7 h-7 text-slate-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left column */}
            <div className="lg:col-span-3 space-y-10">
              {issue.photo_url && (
                <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-md">
                  <img src={issue.photo_url} className="w-full object-cover" alt="Issue" />
                </div>
              )}
              <div className="space-y-4">
                <h4 className={`text-xs font-bold uppercase tracking-widest ${accentText2}`}>Problem Description</h4>
                <p className="text-slate-700 text-lg leading-relaxed">{issue.description}</p>
              </div>

              {!isAdmin && issue.status === 'resolved' && (
                <div className="p-8 mt-6 bg-gradient-to-r flex items-center gap-6 from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 rounded-[2rem]">
                  <div className="w-16 h-16 shrink-0 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-emerald-400 font-bold mb-2">Issue Resolved</h4>
                    <p className="text-emerald-500/80 text-sm leading-relaxed">
                      Thank you for reporting! You have successfully contributed to 
                      <strong className="text-emerald-400"> 1.2% </strong>
                      of the infrastructure improvements in <strong className="text-emerald-300">{issue.locality}</strong> this year.
                    </p>
                  </div>
                </div>
              )}

              {isAdmin && (
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-sm space-y-6">
                  <h4 className="text-sm font-bold text-slate-500 flex items-center gap-3 uppercase tracking-widest">
                    <Landmark className="w-5 h-5 text-emerald-500" /> Corporation Management
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Assign Agency <span className="text-emerald-500">*</span></p>
                      <select
                        disabled={updating}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm outline-none transition-all text-slate-800 disabled:opacity-50 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                        value={issue.assigned_corporation || ''}
                        onChange={(e) => handleAssignCorporation(e.target.value)}
                      >
                        <option value="">Pending Assignment</option>
                        <option value="GVMC">GVMC (Municipal)</option>
                        <option value="VMRDA">VMRDA (Urban Dev)</option>
                        <option value="CP">City Police</option>
                        <option value="EPDCL">EPDCL (Electricity)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Current Handling</p>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700 font-bold text-sm">{issue.assigned_corporation || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-2">
                    {issue.status === 'not_started' && (
                      <button
                        disabled={updating}
                        onClick={() => updateStatus('in_progress')}
                        className="px-4 py-2 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Start Work
                      </button>
                    )}
                    {issue.status !== 'resolved' && (
                      <button
                        disabled={updating}
                        onClick={() => updateStatus('resolved')}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Timeline */}
              <div className="space-y-6">
                <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${accentText}`}>
                  <Clock className="w-4 h-4" /> Progress Timeline
                </h4>
                <div className="space-y-8 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                  {timeline.map((item: any) => (
                    <div key={item.id} className="relative pl-10">
                      <div
                        className={`absolute left-0 top-1 w-8 h-8 rounded-full border-4 border-white shadow-lg ${item.status === 'resolved' ? 'bg-emerald-500' : item.status === 'in_progress' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                      />
                      <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">{item.status.replace('_', ' ')}</p>
                      <p className="text-[10px] text-slate-500 font-medium">{format(new Date(item.createdAt || item.created_at), 'PPP p')}</p>
                      {item.note && (
                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">"{item.note}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion */}
              <div className="space-y-6">
                <h4 className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${accentText}`}>
                  <MessageSquare className="w-4 h-4" /> Community Discussion
                </h4>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {comments.map((c: any) => (
                    <div
                      key={c.id}
                      className={`p-5 rounded-2xl text-sm ${c.user_role === 'admin' ? 'ml-6' : ''} border`}
                      style={
                        c.user_role === 'admin'
                          ? { background: '#f0fdf4', borderColor: '#bbf7d0' }
                          : { background: '#f8fafc', borderColor: '#f1f5f9' }
                      }
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${c.user_role === 'admin' ? 'text-emerald-600' : 'text-emerald-600'}`}>
                          {c.user_role}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{format(new Date(c.createdAt || c.created_at), 'p')}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{c.text}</p>
                    </div>
                  ))}

                </div>
                <form onSubmit={handleAddComment} className="flex gap-3 pt-4">
                  <input
                    type="text"
                    placeholder="Contribute to discussion..."
                    className={`flex-1 bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl text-sm outline-none transition-all text-slate-800 placeholder:text-slate-400 ${inputFocus}`}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button type="submit" className={`p-4 rounded-2xl transition-all shadow-lg ${sendBtn}`}>
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
