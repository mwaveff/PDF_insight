import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  UploadCloud,
  FileText,
  Download,
  AlertCircle,
  Loader2,
  Sparkles,
  Building2,
  Users,
  Calendar,
  Coins,
  Copy,
  Check,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Code2
} from 'lucide-react';
import { InsightSchema, type InsightData } from './types/schema';
import Background from './Background';
const LOADING_STEPS = [
  "Weryfikacja struktury pliku PDF...",
  "Ekstrakcja warstwy tekstowej i metadanych...",
  "Analiza semantyczna i wykrywanie encji...",
  "Walidacja schematu JSON..."
];

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<InsightData | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual');

  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Dozwolone są wyłącznie pliki PDF.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Maksymalny rozmiar pliku wynosi 10 MB.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setData(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || `Błąd serwera (${response.status})`);
      }

      const rawJson = await response.json();
      const validated = InsightSchema.parse(rawJson);
      setData(validated);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#a855f7', '#38bdf8']
      });
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd podczas analizy.');
    } finally {
      setLoading(false);
    }
  };

  const copyJson = () => {
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.document.fileName.replace('.pdf', '')}_insight.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-24 overflow-x-hidden">

      {/* Живой анимированный Canvas-фон */}
      <Background />

      {/* Обязательно relative z-10, чтобы контент был поверх фона */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-16 space-y-10">

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/20 text-xs font-medium text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Document Intelligence</span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              PDF <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200 bg-clip-text text-transparent">Insight</span>
            </h1>
          </div>

          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            Błyskawiczna analiza, podsumowanie oraz automatyczna ekstrakcja kluczowych danych z dokumentów w czasie rzeczywistym.
          </p>
        </motion.header>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className={`relative group rounded-3xl border transition-all duration-300 p-10 sm:p-14 text-center cursor-pointer overflow-hidden backdrop-blur-xl ${
            isDragOver 
              ? 'border-indigo-500/80 bg-indigo-950/30 shadow-[0_0_40px_rgba(99,102,241,0.25)] scale-[1.01]' 
              : 'border-slate-800/80 bg-slate-900/40 hover:border-indigo-500/40 hover:bg-slate-900/60 shadow-[0_8px_32px_rgba(0,0,0,0.36)]'
          }`}
        >
          {/* Subtle hover glow inside card */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <input
            type="file"
            accept=".pdf"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <div className="relative z-10 w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:border-indigo-400/50 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="relative z-10 text-slate-100 font-semibold text-lg sm:text-xl">
            Upuść plik PDF tutaj lub <span className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4 group-hover:text-indigo-300">wybierz z dysku</span>
          </h3>
          <p className="relative z-10 text-xs text-slate-500 mt-2">
            Maksymalny rozmiar pliku: 10 MB (obsługiwany format: PDF)
          </p>
        </motion.div>

        {/* Selected File & Action Bar */}
        <AnimatePresence>
          {file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl backdrop-blur-xl"
            >
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Przetwarzanie...</span>
                  </>
                ) : (
                  <>
                    <span>Uruchom analizę</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-3 p-4 rounded-2xl bg-red-950/30 border border-red-900/50 text-red-200 text-sm shadow-xl"
            >
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-300">Wystąpił błąd</p>
                <p className="text-red-400/90 text-xs mt-0.5">{error}</p>
              </div>
              <button
                onClick={handleAnalyze}
                className="flex items-center gap-1 text-xs text-red-300 hover:text-white underline pt-0.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Ponów
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Progress State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800 text-center space-y-4"
          >
            <div className="inline-block relative">
              <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {LOADING_STEPS[loadingStep]}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Średni czas oczekiwania: poniżej 30 sekund
              </p>
            </div>
          </motion.div>
        )}

        {/* Results Panel */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Result Container */}
              <div className="rounded-3xl bg-slate-900/40 border border-slate-800/90 shadow-2xl backdrop-blur-md overflow-hidden">

                {/* Panel Header & Navigation */}
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {data.type}
                      </span>
                      <span className="text-xs text-slate-400">
                        {data.document.pages} {data.document.pages === 1 ? 'strona' : 'stron'} • {data.document.language.toUpperCase()}
                      </span>
                      {data.document.date && (
                        <span className="text-xs text-slate-400">• {data.document.date}</span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">{data.document.title}</h2>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Switcher Tab */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => setActiveTab('visual')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          activeTab === 'visual' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Karty</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('json')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                          activeTab === 'json' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>
                    </div>

                    <button
                      onClick={downloadJson}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white transition shadow-lg shadow-emerald-950"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Eksport</span>
                    </button>
                  </div>
                </div>

                {/* Content: Visual Cards */}
                {activeTab === 'visual' && (
                  <div className="p-6 space-y-6">
                    {/* Summary */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Podsumowanie dokumentu
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                        {data.summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-400" /> Kluczowe ustalenia
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        {data.keyPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-850">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Entities & Amounts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Podmioty i osoby */}
                      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Organizacje
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {data.entities.organizations.length > 0 ? (
                            data.entities.organizations.map((org, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                                {org}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-600 italic">Brak zidentyfikowanych podmiotów</span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pt-2">
                          <Users className="w-3.5 h-3.5 text-indigo-400" /> Osoby
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {data.entities.people.length > 0 ? (
                            data.entities.people.map((person, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200">
                                {person}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-600 italic">Brak osób</span>
                          )}
                        </div>
                      </div>

                      {/* Kwoty i Daty */}
                      <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-850 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> Wartości finansowe
                        </h4>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {data.amounts.length > 0 ? (
                            data.amounts.map((amt, i) => (
                              <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                <span className="text-slate-400 truncate pr-2">{amt.context}</span>
                                <span className="font-semibold text-emerald-400 shrink-0">
                                  {amt.value.toLocaleString()} {amt.currency}
                                </span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-slate-600 italic">Brak kwot</span>
                          )}
                        </div>

                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pt-2">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Istotne Terminy
                        </h4>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                          {data.dates.length > 0 ? (
                            data.dates.map((dt, i) => (
                              <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                                <span className="text-slate-400 truncate pr-2">{dt.context}</span>
                                <span className="font-semibold text-slate-200 shrink-0">{dt.date}</span>
                              </div>
                            ))
                          ) : (
                            <span className="text-xs text-slate-600 italic">Brak terminów</span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Keywords */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Słowa kluczowe</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {data.keywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-950/60 border border-indigo-800/40 text-indigo-300">
                            #{kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Content: JSON Code View */}
                {activeTab === 'json' && (
                  <div className="p-6 relative">
                    <button
                      onClick={copyJson}
                      className="absolute top-8 right-8 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Skopiowano' : 'Kopiuj'}</span>
                    </button>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-850 text-slate-300 text-xs overflow-x-auto max-h-[500px] leading-relaxed font-mono">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}