import React, { useState, useEffect } from 'react';
import {
  Shield,
  User,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Megaphone,
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  Skull,
  CheckCircle2,
  Building2,
  Clock,
  Zap,
  ShieldAlert
} from 'lucide-react';
import { IssueReportForm } from './components/IssueReportForm';
import { IssueList } from './components/IssueList';
import { IssueDetail } from './components/IssueDetail';
import { AdminDashboard } from './components/AdminDashboard';
import { NewsLayer } from './components/NewsLayer';
import { ImpactDashboard } from './components/ImpactDashboard';
import { RewardsVault } from './components/RewardsVault';

import { motion, AnimatePresence } from 'motion/react';

type View = 'landing' | 'feed' | 'report' | 'admin' | 'user-login' | 'admin-login';
type Theme = 'landing' | 'user' | 'admin';

// ─── Nav Item ──────────────────────────────────────────────────────────────---
const NavItem = ({ icon: Icon, label, active, onClick, theme }: any) => {
  const activeClass = 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]';
  const hoverClass = 'hover:text-emerald-600 hover:bg-emerald-50';
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${active ? activeClass : `text-slate-500 ${hoverClass}`
        }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
};

// ─── Landing Page (Green + Black) ─────────────────────────────────────────--
const LandingPage = ({ setView }: { setView: (v: View) => void }) => (
  <>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
  >
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[150px] rounded-full -z-10" />
    <div className="absolute top-20 left-20 w-80 h-80 bg-green-700/5 blur-[100px] rounded-full -z-10" />
    <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-400/5 blur-[120px] rounded-full -z-10" />

    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-8 max-w-5xl"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Join the Civic Revolution
      </div>
      <h2 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.9]">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Your Voice,</span> <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600" style={{ textShadow: '0 0 50px rgba(74,222,128,0.3)' }}>Our Action.</span>
      </h2>
      <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed">
        A silent problem is a persistent tragedy. Speak up, report critical issues, and help us save lives through collective action.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10">
        <button
          onClick={() => setView('user-login')}
          className="w-full sm:w-auto px-12 py-6 bg-green-500 text-black rounded-full font-bold text-xl hover:bg-green-400 transition-all shadow-[0_0_50px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 group active:scale-95"
        >
          Enter as Citizen <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
        <button
          onClick={() => setView('admin-login')}
          className="w-full sm:w-auto px-12 py-6 bg-black/70 text-white border border-white/20 rounded-full font-bold text-xl hover:bg-black/85 transition-all flex items-center justify-center gap-3 active:scale-95"
        >
          <Shield className="w-6 h-6 text-emerald-400" /> Admin Access
        </button>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
    >
      <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">Scroll for Community Impact</p>
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-px h-16 bg-gradient-to-b from-green-500/50 to-transparent" 
      />
    </motion.div>
  </motion.div>

  <NewsLayer />

  {/* Why CivicConnect Matters — blended, no box */}
  <div className="w-full py-28 px-6 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-400/8 blur-[100px] rounded-full pointer-events-none" />
    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center mb-4"
      >
        <AlertTriangle className="w-10 h-10 text-emerald-500" />
      </motion.div>
      <motion.h3 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight"
      >
        Why CivicConnect <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Matters</span>
      </motion.h3>
      <motion.p 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xl text-slate-500 leading-relaxed font-medium max-w-3xl mx-auto"
      >
        Every year, thousands of lives are impacted by structural neglect, pothole-related accidents, and healthcare crises that could have been avoided with faster reporting and bureaucratic transparency. Our platform is dedicated to bridging that gap.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10"
      >
        {[
          { label: 'Fatalities Prevented', value: '12', icon: <Skull className="w-6 h-6" /> },
          { label: 'Active Reports', value: '154', icon: <Megaphone className="w-6 h-6" /> },
          { label: 'Resolved in Vizag', value: '42', icon: <CheckCircle2 className="w-6 h-6" /> }
        ].map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-3 py-2">
            <div className="text-emerald-500 mb-1">{stat.icon}</div>
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-600 to-emerald-800">{stat.value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</div>
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-8 pt-4"
      >
        <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-transparent to-emerald-200" />
        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-[-3px]" />
        <div className="h-px flex-1 max-w-xs bg-gradient-to-l from-transparent to-emerald-200" />
      </motion.div>
    </div>
  </div>
  </>
);

// ─── Login Form ──────────────────────────────────────────────────────────────
const LoginForm = ({
  role,
  onAuth,
}: {
  role: 'user' | 'admin';
  onAuth: (e: React.FormEvent, role: 'user' | 'admin', data: any, isSignUp: boolean) => void;
}) => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const isAdmin = role === 'admin';
  const accentBorder = 'border-emerald-100';
  const accentGlow = '0 8px 40px rgba(16,185,129,0.08)';
  const activeTabClass = 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
  const submitClass = 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_4px_20px_rgba(16,185,129,0.2)]';
  const iconColor = 'text-emerald-500';
  const iconBg = 'bg-emerald-50 border-emerald-100';
  const focusBorder = 'focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100';

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto mt-12">
      <div
        className={`bg-white border ${accentBorder} rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden`}
        style={{ boxShadow: accentGlow }}
      >
        {/* Icon + Title */}
        <div className="relative text-center mb-8">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 ${iconBg} border`}>
            {isAdmin ? <Shield className={`w-10 h-10 ${iconColor}`} /> : <User className={`w-10 h-10 ${iconColor}`} />}
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isAdmin ? 'Admin Gateway' : 'Citizen Portal'}
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            {isAdmin ? 'Access the command center with admin credentials' : 'Join the community or sign in to your account'}
          </p>
        </div>

        {/* Tab Toggle — only for user portal */}
        {!isAdmin && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-8">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${!isSignUp ? activeTabClass : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isSignUp ? activeTabClass : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Sub-label for tab context */}
        {!isAdmin && (
          <p className="text-xs text-slate-400 text-center -mt-4 mb-6">
            {isSignUp ? '✦ Create a new account to start reporting issues' : '✦ Welcome back — sign in to continue'}
          </p>
        )}

        <form onSubmit={(e) => onAuth(e, role, loginData, isSignUp)} className="space-y-5 relative">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type="email"
                className={`w-full bg-slate-50 border border-slate-200 pl-12 pr-4 py-4 rounded-2xl outline-none transition-all text-slate-800 placeholder:text-slate-400 text-sm ${focusBorder}`}
                placeholder={isAdmin ? 'admin@civicconnect.com' : 'you@example.com'}
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                className={`w-full bg-slate-50 border border-slate-200 pl-12 pr-12 py-4 rounded-2xl outline-none transition-all text-slate-800 placeholder:text-slate-400 text-sm ${focusBorder}`}
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group ${submitClass}`}
            >
              {isAdmin ? 'Access Portal' : isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center relative">
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAdmin
              ? 'Use your admin credentials to access the portal.'
              : isSignUp ? 'Already have an account? Switch to Sign In above.'
                : "New here? Switch to Sign Up above to get started!"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Admin Portal Wrapper ──────────────────────────────────────────────────
const AdminPortalWrapper = ({ user, onSelectIssue }: { user: any, onSelectIssue: (id: number) => void }) => {
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'feed' | 'dashboard'>('dashboard');
  const [activeCorp, setActiveCorp] = useState<string>('all'); // 'all', 'GVMC', 'VMRDA'

  useEffect(() => {
    // Fetch global stats for Hero (ignoring role filtering to get total system state)
    fetch('/api/analytics').then(res => res.json()).then(setGlobalStats);
  }, []);

  const isAdmin = user?.role === 'superadmin';
  // If not superadmin, restrict sidebar options somewhat or just let them view what they're allowed
  // For demonstration, standard admins see their assigned corp.
  
  const corporations = [
    { id: 'all',    name: 'Global Overview',   shortName: 'All Corps',  icon: LayoutDashboard },
    { id: 'GVMC',  name: 'Greater Visakhapatnam Municipal Corporation', shortName: 'GVMC',  icon: Building2 },
    { id: 'VMRDA', name: 'Visakhapatnam Metropolitan Region Development Authority', shortName: 'VMRDA', icon: Building2 },
    { id: 'EDPCL', name: 'Eastern Power Distribution Company Ltd.',      shortName: 'EDPCL', icon: Zap },
    { id: 'POLICE',name: 'City Police',         shortName: 'POLICE', icon: ShieldAlert }
  ];

  return (
    <div className="space-y-6">
      {/* Global Hero Summary Section */}
      <div className="relative p-8 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700" style={{ boxShadow: '0 8px 40px rgba(16,185,129,0.2)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[120px] rounded-full -mr-48 -mt-48 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/20 blur-[80px] rounded-full -ml-32 -mb-32 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
           <div>
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest mb-4">
               <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
               Central Monitoring System — Live
             </div>
             <h2 className="text-4xl font-bold text-white tracking-tighter">System <span className="text-emerald-200">Overview</span></h2>
             <p className="text-emerald-100 mt-2 text-sm max-w-lg">Real-time aggregation of all reported issues across all interconnected municipal corporations.</p>
           </div>
           
           <div className="flex bg-white/10 p-1.5 rounded-2xl border border-white/20">
              <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'dashboard' ? 'bg-white text-emerald-700 shadow-lg' : 'text-white/70 hover:text-white'}`}>Dashboards</button>
              <button onClick={() => setActiveTab('feed')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'feed' ? 'bg-white text-emerald-700 shadow-lg' : 'text-white/70 hover:text-white'}`}>Live Issue Feed</button>
           </div>
        </div>

        {/* Global Metrics Row */}
        {globalStats ? (
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Issues', value: globalStats.total, icon: AlertTriangle, color: 'text-amber-300' },
              { label: 'Not Started',  value: globalStats.notStarted ?? (globalStats.total - globalStats.resolved - (globalStats.inProgress ?? globalStats.pending)), icon: Clock, color: 'text-slate-300' },
              { label: 'In Progress',  value: globalStats.inProgress ?? globalStats.pending, icon: Shield, color: 'text-blue-200' },
              { label: 'Resolved',     value: globalStats.resolved, icon: CheckCircle2, color: 'text-emerald-200' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 border border-white/20 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-sm">
                 <div className={`p-3 rounded-xl bg-white/10 ${stat.color}`}><stat.icon className="w-5 h-5" /></div>
                 <div>
                   <p className="text-2xl font-bold text-white">{stat.value ?? 0}</p>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{stat.label}</p>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-20 flex flex-col justify-center text-white/60 font-medium text-sm animate-pulse">Aggregating global telemetry...</div>
        )}
      </div>

      {/* Main Two Column Layout for Dashboards */}
      {activeTab === 'dashboard' && (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-68 shrink-0 flex flex-col gap-1.5 bg-slate-900 rounded-[2.5rem] p-4 h-fit shadow-xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-4 pt-2 pb-3">Dashboards</h3>
            {corporations.map(corp => (
               <button
                 key={corp.id}
                 onClick={() => setActiveCorp(corp.id)}
                 className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all ${
                   activeCorp === corp.id
                     ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                     : 'text-slate-300 hover:bg-white/5 hover:text-white'
                 }`}
               >
                 <corp.icon className="w-4 h-4 shrink-0" />
                 <div className="min-w-0">
                   <p className="text-xs font-bold truncate">{corp.shortName}</p>
                   {activeCorp !== corp.id && (
                     <p className="text-[10px] text-slate-500 truncate hidden lg:block">{corp.name.substring(0, 28)}{corp.name.length > 28 ? '…' : ''}</p>
                   )}
                 </div>
               </button>
            ))}
          </div>
          
          {/* Dashboard Content */}
          <div className="flex-1 min-w-0">
             <AdminDashboard user={user} corporation={activeCorp} />
          </div>
        </div>
      )}

      {/* Live Feed fallback */}
      {activeTab === 'feed' && (
         <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-6 lg:p-10 shadow-sm">
           <IssueList onSelect={onSelectIssue} isAdmin={true} userRole={user.role} />
         </div>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────--
export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [adminSubView, setAdminSubView] = useState<'feed' | 'dashboard'>('feed');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Derive current theme
  const theme: Theme = user?.role === 'admin' ? 'admin' : user?.role === 'user' ? 'user' : 'landing';

  useEffect(() => {
    if (!user && (view === 'feed' || view === 'report' || view === 'admin')) {
      setView('landing');
    } else if (user && view === 'landing') {
      setView(user.role === 'admin' ? 'admin' : 'feed');
    }
  }, [user, view]);

  const handleAuth = async (e: React.FormEvent, role: 'user' | 'admin', data: any, isSignUp: boolean) => {
    e.preventDefault();
    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const bodyPayload = isSignUp
        ? { email: data.email, password: data.password, role }
        : { email: data.email, password: data.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload),
      });

      if (res.ok) {
        if (isSignUp) {
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: data.email, password: data.password }),
          });
          if (loginRes.ok) {
            const result = await loginRes.json();
            setUser(result.user);
            localStorage.setItem('user', JSON.stringify(result.user));
            localStorage.setItem('token', result.token);
            setView(result.user.role === 'admin' ? 'admin' : 'feed');
          }
        } else {
          const result = await res.json();

          // Emergency Override: Grant immediate admin access to the provided credentials
          // This ensures the user can login even if server-side seeding hasn't triggered yet on Vercel
          if (result.user.email === 'harshithsai597@gmail.com') {
            result.user.role = 'admin';
          }

          // Ensure role matches what was requested at login page
          if (result.user.role !== role) {
            alert(`Access Denied: This account is registered as ${result.user.role.toUpperCase()}, not ${role.toUpperCase()}.`);
            return;
          }
          setUser(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('token', result.token);
          setView(result.user.role === 'admin' ? 'admin' : 'feed');
        }
      } else {
        const err = await res.json();
        alert(err.error || (isSignUp ? 'Registration failed. Email may already be in use.' : 'Invalid credentials. Try signing up first!'));
      }
    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setView('landing');
  };

  // Colors per theme — unified green theme across all roles
  const logoGlow = 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]';
  const accentText = 'text-emerald-600';
  const roleTextColor = 'text-emerald-600';
  const avatarBg = 'bg-emerald-50 border-emerald-200 text-emerald-700';
  const headerBg = 'bg-white/95 border-emerald-100 shadow-[0_1px_20px_rgba(16,185,129,0.06)]';
  const rootBg = 'bg-[#f0fdf4]';

  return (
    <div className={`min-h-screen ${rootBg} theme-${theme} flex flex-col selection:bg-white/20`}>
      {/* ── Header ── */}
      <header className={`backdrop-blur-md border-b sticky top-0 z-40 ${headerBg}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setView(user ? (user.role === 'admin' ? 'admin' : 'feed') : 'landing')}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform ${logoGlow}`}>
              <Megaphone className="w-7 h-7 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Civic<span className={accentText}>Connect</span>
            </h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <NavItem icon={LayoutDashboard} label="Command Center" active={view === 'admin'} onClick={() => setView('admin')} theme={theme} />
                ) : (
                  <NavItem icon={LayoutDashboard} label="Feed" active={view === 'feed'} onClick={() => setView('feed')} theme={theme} />
                )}
                {user.role === 'user' && (
                  <NavItem icon={PlusCircle} label="Report" active={view === 'report'} onClick={() => setView('report')} theme={theme} />
                )}
                <div className="w-px h-8 bg-white/10 mx-3" />
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex flex-col items-end">
                    <p className="text-sm font-bold text-slate-800 leading-tight">{user.email.split('@')[0]}</p>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${roleTextColor}`}>{user.role}</p>
                  </div>
                  <div className="relative group/profile">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${avatarBg}`}>
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-[#111] border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all z-50">
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                        <p className="text-sm text-white font-bold truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('user-login')}
                  className="px-6 py-2.5 text-slate-700 font-bold hover:text-emerald-600 transition-all"
                >
                  Citizen Login
                </button>
                <button
                  onClick={() => setView('admin-login')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-slate-800 border border-emerald-200 rounded-2xl font-bold hover:bg-emerald-100 transition-all"
                >
                  <Shield className="w-4 h-4 text-red-400" /> Admin
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-3 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden p-6 bg-white border-t border-emerald-100 space-y-3 overflow-hidden"
            >
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <NavItem icon={LayoutDashboard} label="Command Center" active={view === 'admin'} onClick={() => { setView('admin'); setIsMenuOpen(false); }} theme={theme} />
                  ) : (
                    <NavItem icon={LayoutDashboard} label="Feed" active={view === 'feed'} onClick={() => { setView('feed'); setIsMenuOpen(false); }} theme={theme} />
                  )}
                  {user.role === 'user' && (
                    <NavItem icon={PlusCircle} label="Report" active={view === 'report'} onClick={() => { setView('report'); setIsMenuOpen(false); }} theme={theme} />
                  )}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center gap-3 px-5 py-3">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${avatarBg}`}>
                        {user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{user.email.split('@')[0]}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${roleTextColor}`}>{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-bold rounded-2xl"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <NavItem icon={User} label="Citizen Login" active={view === 'user-login'} onClick={() => { setView('user-login'); setIsMenuOpen(false); }} theme="landing" />
                  <NavItem icon={Shield} label="Admin Login" active={view === 'admin-login'} onClick={() => { setView('admin-login'); setIsMenuOpen(false); }} theme="admin" />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-12">
        {view === 'landing' && <LandingPage setView={setView} />}

        {/* User Feed (green theme) */}
        {view === 'feed' && (
          <div className="space-y-12">
            {user?.role === 'user' && (
              <>
                <ImpactDashboard user={user} />
                <RewardsVault user={user} />
              </>
            )}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h2 className="text-5xl font-bold text-slate-900 tracking-tighter">
                  Community <span className="text-emerald-500">Pulse</span>
                </h2>
                <p className="text-slate-500 mt-4 text-lg">Real-time civic reporting and resolution tracking. Your voice, amplified.</p>
              </div>
              {user?.role === 'user' && (
                <button
                  onClick={() => setView('report')}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-[2rem] font-bold hover:bg-emerald-600 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-3 group"
                >
                  <PlusCircle className="w-6 h-6" />
                  <span>Report Issue</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              )}
            </div>
            <IssueList onSelect={(id) => setSelectedIssueId(id)} />
          </div>
        )}

        {/* Report Form */}
        {view === 'report' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto"
          >
            <IssueReportForm onSuccess={() => setView('feed')} />
          </motion.div>
        )}

        {/* Admin View (red theme) */}
        {view === 'admin' && (
          <AdminPortalWrapper user={user} onSelectIssue={(id) => setSelectedIssueId(id)} />
        )}

        {/* Login pages */}
        {view === 'user-login' && <LoginForm role="user" onAuth={handleAuth} />}
        {view === 'admin-login' && <LoginForm role="admin" onAuth={handleAuth} />}
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white py-10 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${logoGlow}`}>
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900 font-bold tracking-tight">CivicConnect</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 CivicConnect • Empowering Citizens for a Better Tomorrow</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-emerald-600 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-emerald-600 text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* ── Issue Detail Modal ── */}
      <AnimatePresence>
        {selectedIssueId && (
          <IssueDetail
            issueId={selectedIssueId}
            onClose={() => setSelectedIssueId(null)}
            isAdmin={user?.role === 'admin'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
