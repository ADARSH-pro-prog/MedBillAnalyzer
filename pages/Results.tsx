import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AnalysisResponse } from '../types';
import { ROUTES } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar, PolarAngleAxis, LabelList
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  Calendar, 
  User, 
  MapPin, 
  FileText,
  ShieldCheck
} from 'lucide-react';

const Results: React.FC = () => {
  const location = useLocation();
  const data = location.state?.data as AnalysisResponse;

  if (!data) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const { structured, validation, confidence_scores } = data;

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
        case 'error': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300';
        case 'warning': return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300';
        case 'info': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300';
        default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
        case 'error': return <XCircle size={18} />;
        case 'warning': return <AlertTriangle size={18} />;
        case 'info': return <Info size={18} />;
        default: return <Info size={18} />;
    }
  };

  const confidenceData = [
    { name: 'OCR', value: confidence_scores.ocr_confidence * 100, fill: '#14b8a6' },
    { name: 'Extract', value: confidence_scores.extraction_confidence * 100, fill: '#0ea5e9' },
    { name: 'Overall', value: confidence_scores.overall_confidence * 100, fill: '#8b5cf6' },
  ];
  
  // Mock data for circular progress
  const scoreData = [{ name: 'Score', value: validation.summary.compliance_score * 100, fill: validation.summary.compliance_score > 0.8 ? '#10b981' : '#f59e0b' }];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-white/20">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                <ShieldCheck size={32} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analysis Report</h1>
                <p className="text-slate-500 dark:text-slate-400 font-mono text-xs mt-1 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded inline-block">{data.file_id}</p>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
             <div className="text-right">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Compliance Score</p>
                <div className="flex items-baseline gap-1 justify-end">
                    <span className={`text-4xl font-extrabold ${validation.summary.compliance_score > 0.8 ? 'text-green-500' : 'text-amber-500'}`}>
                        {(validation.summary.compliance_score * 100).toFixed(0)}
                    </span>
                    <span className="text-lg text-slate-400 font-medium">%</span>
                </div>
             </div>
             <div className="w-20 h-20">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="70%" outerRadius="100%" barSize={10} data={scoreData} startAngle={90} endAngle={-270}>
                        <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                 </ResponsiveContainer>
             </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Metadata & Confidence */}
        <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            
            {/* Confidence Chart */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                    AI Confidence
                </h3>
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={confidenceData} 
                            layout="vertical" 
                            margin={{ left: 0, right: 45, top: 0, bottom: 0 }} // Added right margin for labels
                        >
                            <XAxis type="number" domain={[0, 100] as [number, number]} hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={60} 
                                tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} 
                                axisLine={false} 
                                tickLine={false} 
                            />
                            <RechartsTooltip 
                                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
                            />
                            <Bar 
                                dataKey="value" 
                                radius={[0, 6, 6, 0]} 
                                barSize={20}
                                background={{ fill: 'rgba(148, 163, 184, 0.1)', radius: [0, 6, 6, 0] }} // Added background track
                            >
                                <LabelList 
                                    dataKey="value" 
                                    position="right" 
                                    formatter={(val: number) => `${val.toFixed(0)}%`} 
                                    style={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                />
                                {confidenceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Extracted Metadata */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 p-0 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white">Patient & Hospital</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 shrink-0">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Details</p>
                            <p className="font-semibold text-slate-900 dark:text-white text-lg">{structured.meta.detected_patient_name || 'Unknown'}</p>
                            <div className="flex gap-2 mt-1 text-sm text-slate-500">
                                <span>{structured.meta.detected_age || 'Age N/A'}</span>
                                <span>•</span>
                                <span>{structured.meta.detected_gender || 'Gender N/A'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 shrink-0">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Hospital</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{structured.meta.detected_hospital || 'Unknown Hospital'}</p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{structured.meta.detected_address}</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-500 shrink-0">
                            <Calendar size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timeline</p>
                            <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div>
                                    <span className="text-[10px] text-slate-400 block">ADMISSION</span>
                                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{structured.meta.detected_dates.admission || '--'}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 block">DISCHARGE</span>
                                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{structured.meta.detected_dates.discharge || '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Line Items & Validation */}
        <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Validation Flags */}
            {validation.flags.length > 0 && (
                <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-amber-50/30 dark:bg-amber-900/10 flex items-center gap-3">
                         <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg">
                             <AlertTriangle size={20} />
                         </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">
                            Attention Required ({validation.flags.length})
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {validation.flags.map((flag) => (
                            <div key={flag.id} className="p-5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className={`mt-0.5 p-1.5 rounded-full border ${getSeverityStyles(flag.severity)}`}>
                                    {getSeverityIcon(flag.severity)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{flag.rule}</p>
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getSeverityStyles(flag.severity)}`}>
                                            {flag.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{flag.description}</p>
                                    {flag.evidence && (
                                        <div className="mt-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-500 break-all">
                                            {flag.evidence}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Line Items Table */}
            <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                             <FileText size={20} />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">Extracted Line Items</h3>
                    </div>
                    <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-600 dark:text-slate-300">
                        {structured.line_items.length} Items
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 font-semibold tracking-wider">Description</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-wider">Qty</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-wider">Unit Price</th>
                                <th className="px-6 py-4 text-right font-semibold tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {structured.line_items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.description}</td>
                                    <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">{item.quantity}</td>
                                    <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400 font-mono">{item.unit_price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white font-mono">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                            {structured.line_items.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                        No line items could be clearly detected in this document.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        {structured.line_items.length > 0 && (
                             <tfoot className="bg-slate-50 dark:bg-slate-800/30 font-bold text-slate-900 dark:text-white">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right">Total Extracted Amount</td>
                                    <td className="px-6 py-4 text-right font-mono text-lg text-primary-600 dark:text-primary-400">
                                        {structured.line_items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Raw Text Toggle */}
            <details className="group glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <summary className="cursor-pointer p-4 flex items-center justify-between font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <span>View Raw OCR Text</span>
                    <div className="transition-transform duration-200 group-open:rotate-180">
                         <span className="text-xs px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded">Expand</span>
                    </div>
                </summary>
                <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                    <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">{data.raw_text}</pre>
                </div>
            </details>

        </div>
      </div>
    </div>
  );
};

export default Results;