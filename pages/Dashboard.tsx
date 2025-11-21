import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, FileCheck, AlertTriangle, CheckCircle2, TrendingUp, ArrowRight, Activity } from 'lucide-react';
import { ROUTES } from '../constants';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface Stats {
  total_analyzed: number;
  high_compliance: number;
  flagged_issues: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total_analyzed: 0,
    high_compliance: 0,
    flagged_issues: 0
  });

  // Mock data for the visual chart
  const chartData = [
    { name: 'Mon', value: 2 },
    { name: 'Tue', value: 5 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 4 },
    { name: 'Sat', value: 6 },
    { name: 'Sun', value: 9 },
  ];

  useEffect(() => {
    const storedStats = localStorage.getItem('medibill_dashboard_stats');
    if (storedStats) {
      setStats(JSON.parse(storedStats));
    }
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend }: any) => (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${bgClass} ${colorClass} ring-1 ring-inset ring-white/10`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
            <TrendingUp size={12} />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</h3>
      </div>
      {/* Background Decoration */}
      <div className="absolute -right-6 -bottom-6 opacity-5 transform group-hover:scale-110 transition-transform duration-500">
        <Icon size={120} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">Overview of your medical financial analysis.</p>
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
          Last updated: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        <StatCard 
          title="Total Analyzed" 
          value={stats.total_analyzed} 
          icon={FileCheck} 
          colorClass="text-blue-600 dark:text-blue-400" 
          bgClass="bg-blue-100 dark:bg-blue-900/30"
          trend="+12%" 
        />
        <StatCard 
          title="High Compliance" 
          value={stats.high_compliance} 
          icon={CheckCircle2} 
          colorClass="text-primary-600 dark:text-primary-400" 
          bgClass="bg-primary-100 dark:bg-primary-900/30"
          trend="+5%"
        />
        <StatCard 
          title="Flagged Issues" 
          value={stats.flagged_issues} 
          icon={AlertTriangle} 
          colorClass="text-amber-600 dark:text-amber-400" 
          bgClass="bg-amber-100 dark:bg-amber-900/30"
          trend="-2%"
        />
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        {/* Chart Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/20 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={20} className="text-primary-500" />
              Analysis Activity
            </h3>
             <select className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/50">
              <option>This Week</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.8)', 
                    backdropFilter: 'blur(8px)',
                    border: 'none', 
                    borderRadius: '12px', 
                    color: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                  }} 
                  itemStyle={{ color: '#2dd4bf' }}
                  cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                  dy={10}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVal)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Action / Empty State */}
        <div className="glass-card rounded-2xl p-8 text-center flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors group">
          <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <UploadCloud size={40} className="text-primary-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">New Analysis</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-[200px] mx-auto mb-8 leading-relaxed">
              Upload a medical bill to start extraction and compliance checks.
          </p>
          <Link 
              to={ROUTES.UPLOAD}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-primary-600 dark:hover:bg-primary-400 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
          >
              Start Upload <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;