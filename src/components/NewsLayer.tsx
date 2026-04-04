import React, { useRef } from 'react';
import { ExternalLink, AlertTriangle, Droplets, Zap, ShieldAlert, Skull, Activity, Info } from 'lucide-react';
import { motion, useInView } from 'motion/react';

// Serious Mock Data for Critical Awareness
const CRITICAL_NEWS = [
  {
    id: 1,
    category: 'Roads',
    title: 'Potholes killed 9,438 from 2020 to 2024: Govt',
    description: 'Potholes claimed 9,438 lives over five years, from 2020 to 2024, according to govt data. Uttar Pradesh alone reported 5,127 of these fatalities.',
    source: 'Times of India',
    date: 'Recent Report',
    image: 'https://m.economictimes.com/thumb/msid-128311160,width-1600,height-900,resizemode-4,imgsize-366492/waterlogged-potholes-in-thane.jpg',
    icon: <AlertTriangle className="w-4 h-4" />,
    severity: 'critical',
    impact: '9,438 Lives Lost',
    link: 'https://timesofindia.indiatimes.com/india/potholes-killed-9438-from-2020-to-2024-govt/articleshow/128279774.cms'
  },
  {
    id: 2,
    category: 'Electrical',
    title: '32 people killed in electrical mishaps in districts since 2022',
    description: 'Electrical mishaps also claimed the lives of five animals during this period, highlighting severe neglect in electrical infrastructure maintenance.',
    source: 'The Hindu',
    date: 'Recent Report',
    image: 'https://expertlywrapped.files.wordpress.com/2012/08/indias-power-grid.jpg',
    icon: <Zap className="w-4 h-4" />,
    severity: 'critical',
    impact: '32 Fatalities',
    link: 'https://www.thehindu.com/news/national/kerala/32-people-killed-in-electrical-mishaps-in-districts-since-2022/article67473686.ece'
  },
  {
    id: 3,
    category: 'Water',
    title: 'Indore: Families grieve contaminated tap water deaths in India city',
    description: 'Officials in Indore say four people have died after drinking contaminated water but families allege the toll is higher as the water crisis worsens.',
    source: 'BBC News',
    date: 'Recent Report',
    image: 'https://groundup.org.za/media/uploads/images/photographers/Ashraf%20Hendricks/capestorm-20240408-6v2a2364hr.jpg',
    icon: <Droplets className="w-4 h-4" />,
    severity: 'critical',
    impact: 'Multiple Deaths',
    link: 'https://www.bbc.com/news/articles/c98jy990l37o'
  },
  {
    id: 4,
    category: 'Sanitation',
    title: 'Bengaluru Garbage Crisis: Lack of Sanitation Affects Health',
    description: 'The ongoing garbage crisis and lack of proper sanitation in Bengaluru\'s urban areas has led to severe community health issues and outbreaks.',
    source: 'NDTV',
    date: 'Recent Report',
    image: 'https://www.tribuneindia.com/sortd-service/imaginary/v22-01/jpg/large/high?url=dGhldHJpYnVuZS1zb3J0ZC1wcm8tcHJvZC1zb3J0ZC9tZWRpYTZjMzIxNzkwLTRlN2YtMTFlZi05OGRlLTFkNTM0OTA4ODgyMy5qcGc=',
    icon: <ShieldAlert className="w-4 h-4" />,
    severity: 'critical',
    impact: 'Health Crisis',
    link: 'https://www.ndtv.com/health/bengaluru-garbage-crisis-how-lack-of-sanitation-in-urban-areas-affects-community-health-11116947'
  }
];

const NewsCard: React.FC<{ news: any; index: number }> = ({ news, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`block cursor-pointer group relative rounded-[2.5rem] overflow-hidden border bg-white transition-all hover:bg-slate-50 ${
        news.severity === 'critical' ? 'border-emerald-200 shadow-[0_4px_20px_rgba(16,185,129,0.15)]' : 'border-slate-200 shadow-xl'
      }`}
    >
      <div className="h-64 overflow-hidden relative border-b border-slate-100">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        <div className="absolute top-6 left-6 z-10 flex gap-2">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 backdrop-blur-md shadow-sm border ${
            news.severity === 'critical' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-white/90 border-slate-200 text-slate-800'
          }`}>
            {news.severity === 'critical' ? <Skull className="w-3 h-3" /> : <Activity className="w-3 h-3" />}
            {news.severity.toUpperCase()}
          </div>
          <div className="px-4 py-1.5 rounded-full bg-white/90 border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-slate-700 backdrop-blur-md shadow-sm">
            {news.category}
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <div className="flex items-center gap-2 text-white font-bold text-sm mb-2 drop-shadow-md">
             <Activity className="w-4 h-4 animate-pulse text-emerald-400" />
             {news.impact}
          </div>
        </div>
      </div>

      <div className="p-8 flex flex-col h-full">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
          <span>{news.source}</span>
          <span>{news.date}</span>
        </div>
        
        <h4 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
          {news.title}
        </h4>
        
        <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
          {news.description}
        </p>
        
        <div className="pt-6 border-t border-slate-100 mt-auto flex items-center justify-between">
          <span
            className="flex items-center gap-2 text-xs font-bold text-slate-500 group-hover:text-emerald-600 transition-colors group/link"
          >
            DOCUMENTED REPORT <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
          </span>
          <span className="text-slate-400 group-hover:text-emerald-600 transition-colors">
            <Info className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.a>
  );
};

export const NewsLayer = () => {
  const containerRef = useRef(null);
  
  return (
    <div ref={containerRef} className="w-full bg-emerald-50 py-32 px-6 border-t border-emerald-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/30 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-sm"
        >
          <AlertTriangle className="w-4 h-4" /> Critical Civic Awareness Radar
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter mb-6"
        >
          Community <span className="text-emerald-500" style={{ textShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>Impact.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-600 max-w-2xl mx-auto font-medium"
        >
          Documenting the real-world consequences of civic neglect. These aren't just statistics; they are reminders of why your voice matters.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {CRITICAL_NEWS.map((news, idx) => (
          <NewsCard key={news.id} news={news} index={idx} />
        ))}
      </div>

      {/* Warning Footer */}
      <div className="max-w-3xl mx-auto mt-24 p-8 rounded-3xl bg-white border border-emerald-100 text-center shadow-lg">
        <p className="text-emerald-600 text-xs font-bold uppercase tracking-[0.2em] mb-4">Urgent Call to Action</p>
        <p className="text-slate-700 text-lg font-medium leading-relaxed italic">
          "The cost of inaction is too high. Every report you file could be a life saved."
        </p>
      </div>
    </div>
  );
};
