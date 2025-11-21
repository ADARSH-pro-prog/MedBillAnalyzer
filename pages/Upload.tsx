import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, FileText, X, AlertCircle, Loader2, Check, ScanLine } from 'lucide-react';
import { ROUTES, API_BASE_URL } from '../constants';
import { AnalysisResponse } from '../types';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [forceOcr, setForceOcr] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('force_ocr', forceOcr.toString());

      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication required. Please login again.");

      const cleanBaseUrl = API_BASE_URL.replace(/\/$/, '').trim();
      const url = `${cleanBaseUrl}/api/files/upload-and-analyze`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
            'Bypass-Tunnel-Reminder': 'true',
        },
        mode: 'cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        body: formData
      });

      if (!response.ok) {
          let msg = `Analysis failed: ${response.statusText}`;
          try {
             const errData = await response.json();
             if (errData.msg) msg = errData.msg;
             else if (errData.error) msg = errData.error;
             else if (errData.message) msg = errData.message;
          } catch (e) {}
          throw new Error(msg);
      }

      const data: AnalysisResponse = await response.json();
      
      // Update local stats
      const storedStats = localStorage.getItem('medibill_dashboard_stats');
      let stats = storedStats ? JSON.parse(storedStats) : { total_analyzed: 0, high_compliance: 0, flagged_issues: 0 };
      
      stats.total_analyzed += 1;
      if (data.validation.summary.compliance_score > 0.8) stats.high_compliance += 1;
      stats.flagged_issues += data.validation.flags.length;
      
      localStorage.setItem('medibill_dashboard_stats', JSON.stringify(stats));
      
      navigate(ROUTES.RESULTS, { state: { data } });

    } catch (err: any) {
      console.error("Upload failed:", err);
      if (err.message === 'Failed to fetch') {
        setError('Network Error: Unable to reach server. Check your connection or the API URL.');
      } else {
        setError(err.message || "An unexpected error occurred during upload.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">Upload Document</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Upload a medical bill or receipt. Our AI will extract line items, validate costs, and check for compliance.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-8 shadow-2xl border border-white/20">
        {error && (
            <div className="mb-6 bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <AlertCircle size={20} className="shrink-0" />
                <span className="font-medium">{error}</span>
            </div>
        )}

        {!file ? (
            <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
                  relative group border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 cursor-pointer overflow-hidden
                  ${isDragging 
                    ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 scale-[1.02]' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }
                `}
            >
                <input 
                    type="file" 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf,.png,.jpg,.jpeg"
                />
                
                <div className={`
                  w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-lg
                  ${isDragging ? 'bg-primary-500 text-white scale-110' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-primary-500 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30'}
                `}>
                    <UploadIcon size={40} strokeWidth={1.5} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {isDragging ? 'Drop file here' : 'Click to upload or drag and drop'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                    PDF, PNG, or JPG (MAX. 10MB)
                </p>

                {/* Animated background ring effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-3xl" />
                </div>
            </div>
        ) : (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 flex items-center justify-between border border-slate-200 dark:border-slate-700 animate-fade-in">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shadow-sm">
                        <FileText size={32} />
                    </div>
                    <div>
                        <p className="font-bold text-lg text-slate-900 dark:text-white truncate max-w-xs">{file.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                <button 
                    onClick={() => setFile(null)}
                    className="p-3 rounded-xl bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all"
                    disabled={isUploading}
                >
                    <X size={24} />
                </button>
            </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
                <div className={`
                  w-6 h-6 rounded border flex items-center justify-center transition-colors
                  ${forceOcr 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 group-hover:border-primary-400'
                  }
                `}>
                  {forceOcr && <Check size={14} strokeWidth={3} />}
                </div>
                <input 
                    type="checkbox" 
                    checked={forceOcr}
                    onChange={(e) => setForceOcr(e.target.checked)}
                    className="hidden"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Force OCR Mode</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Recommended for scanned images</span>
                </div>
            </label>

            <button
                onClick={handleSubmit}
                disabled={!file || isUploading}
                className={`
                  w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all transform
                  ${!file || isUploading 
                    ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 hover:shadow-primary-500/30 hover:-translate-y-0.5'
                  }
                `}
            >
                {isUploading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Analyzing Document...</span>
                    </>
                ) : (
                    <>
                        <ScanLine size={20} />
                        <span>Run Analysis</span>
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;