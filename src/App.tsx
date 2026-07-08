import React, { useState, useEffect, useRef } from "react";
import { Sprout, BookOpen, History, Sparkles, WifiOff, Camera, ArrowUpRight, HelpCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FarmerProfile, ScanHistoryItem, DiagnosisResult } from "./types";
import ScannerTab from "./components/ScannerTab";
import LibraryTab from "./components/LibraryTab";
import HistoryTab from "./components/HistoryTab";
import DiseaseModal from "./components/DiseaseModal";
import { TRANSLATIONS } from "./utils/translations";

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "library" | "history">("scan");
  
  // 1. Persisted Farmer Profile (Defaulting to Indian context)
  const [profile, setProfile] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem("agrisense_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure language is set
        if (!parsed.language) {
          parsed.language = "en";
        }
        return parsed;
      } catch (e) {
        // Fallback
      }
    }
    return {
      name: "Rajesh Kumar",
      region: "Punjab, India",
      primaryCrops: ["Rice", "Wheat", "Cotton", "Sugarcane"],
      offlineMode: false,
      highContrast: false,
      language: "en"
    };
  });

  // 2. Persisted Scan Histories
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem("agrisense_history");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  // Global FAB camera trigger
  const globalFileInputRef = useRef<HTMLInputElement>(null);
  const [fabDiagnosing, setFabDiagnosing] = useState(false);
  const [fabResult, setFabResult] = useState<DiagnosisResult | null>(null);
  const [showFabModal, setShowFabModal] = useState(false);
  const [fabError, setFabError] = useState<string | null>(null);

  // Sync profile to localStorage
  useEffect(() => {
    localStorage.setItem("agrisense_profile", JSON.stringify(profile));
  }, [profile]);

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem("agrisense_history", JSON.stringify(history));
  }, [history]);

  // Apply Sunlight High Contrast mode class
  useEffect(() => {
    if (profile.highContrast) {
      document.documentElement.classList.add("high-contrast-mode");
    } else {
      document.documentElement.classList.remove("high-contrast-mode");
    }
  }, [profile.highContrast]);

  const handleUpdateProfile = (updates: Partial<FarmerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const handleNewDiagnosis = (result: DiagnosisResult) => {
    const newItem: ScanHistoryItem = {
      ...result,
      id: "scan_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6)
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleRemoveHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // FAB Instant camera uploader handler
  const handleFabClick = () => {
    globalFileInputRef.current?.click();
  };

  const handleFabFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFabDiagnosing(true);
    setFabError(null);
    setActiveTab("scan"); // Focus scan tab

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
      });

      const base64 = await base64Promise;

      // Submit
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64,
          offlineSimulated: profile.offlineMode
        })
      });

      if (!response.ok) {
        throw new Error("Diagnosis failed. Check connection.");
      }

      const rawResult: DiagnosisResult = await response.json();
      
      const finalized = {
        ...rawResult,
        imageUrl: base64
      };

      // Add to history and display modal
      handleNewDiagnosis(finalized);
      setFabResult(finalized);
      setShowFabModal(true);

    } catch (err: any) {
      console.error(err);
      setFabError(err.message || "Diagnostics failed.");
      alert(err.message || "Failed to complete crop diagnosis.");
    } finally {
      setFabDiagnosing(false);
      // Clean target
      if (globalFileInputRef.current) {
        globalFileInputRef.current.value = "";
      }
    }
  };

  const currentLang = profile.language || "en";
  const t = TRANSLATIONS[currentLang];

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans transition-colors duration-200 selection:bg-primary-fixed/80 selection:text-primary-dark">
      
      {/* 1. Header (TopAppBar) */}
      <header className="fixed top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-surface-high h-16 flex justify-between items-center px-6 md:px-16 shadow-sm">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
            <Sprout size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-primary flex items-center gap-1 leading-none">
              AgriSense
            </h1>
            <span className="text-[9px] font-mono font-medium uppercase text-highlight tracking-widest block mt-0.5">
              {t.groundedInScience}
            </span>
          </div>
        </div>

        {/* Middle Area: Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-on-surface-variant">
          <button
            onClick={() => setActiveTab("scan")}
            className={`relative py-2.5 px-1 transition-colors font-semibold text-sm tracking-wide ${
              activeTab === "scan" ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {t.scan}
            {activeTab === "scan" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`relative py-2.5 px-1 transition-colors font-semibold text-sm tracking-wide ${
              activeTab === "library" ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {t.library}
            {activeTab === "library" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`relative py-2.5 px-1 transition-colors font-semibold text-sm tracking-wide ${
              activeTab === "history" ? "text-primary font-bold" : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {t.history}
            {activeTab === "history" && (
              <motion.div 
                layoutId="activeTabUnderline" 
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
              />
            )}
          </button>
        </nav>

        {/* Right Area: Profile Card / Status Indicators */}
        <div className="flex items-center gap-4">
          {profile.offlineMode && (
            <div className="hidden sm:flex items-center gap-1 text-[10px] bg-amber-500/10 text-amber-600 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold font-mono animate-pulse">
              <WifiOff size={11} />
              Offline Matcher
            </div>
          )}
        </div>
      </header>

      {/* 2. Main Content Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 pt-24 pb-28 md:pb-16">
        
        {/* Global Loading overlay if FAB camera triggers analysis */}
        {fabDiagnosing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <div className="bg-primary-dark/95 border border-primary-light/40 p-8 rounded-3xl text-center space-y-4 max-w-sm mx-4 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-highlight to-transparent shadow-[0_0_15px_#E8A33D] animate-scan" />
              <div className="w-12 h-12 rounded-full border-4 border-highlight/30 border-t-highlight animate-spin mx-auto" />
              <h3 className="font-serif text-lg font-bold text-highlight">{t.analyzingFoliage}</h3>
              <p className="text-xs text-gray-300 leading-normal">
                {t.runningModels}
              </p>
            </div>
          </div>
        )}

        {/* Render Active Tab Component */}
        <div className="min-h-[60vh] overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "scan" && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <ScannerTab 
                  onNewDiagnosis={handleNewDiagnosis}
                  offlineMode={profile.offlineMode}
                  language={currentLang}
                />
              </motion.div>
            )}

            {activeTab === "library" && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <LibraryTab />
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <HistoryTab 
                  historyItems={history}
                  onRemoveItem={handleRemoveHistoryItem}
                  onClearAll={handleClearHistory}
                  onNavigateToScan={() => setActiveTab("scan")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="bg-surface-low border-t border-surface-high/60 py-8 px-6 text-center text-xs text-on-surface-variant flex flex-col sm:flex-row justify-between items-center gap-4 max-w-6xl w-full mx-auto pb-28 md:pb-8">
        <div className="text-center sm:text-left space-y-1">
          <p className="font-serif font-bold text-primary text-sm flex items-center justify-center sm:justify-start gap-1">
            <Sprout size={14} /> AgriSense Core
          </p>
          <p className="opacity-70 font-medium">© 2026 AgriSense. {t.groundedInScience}.</p>
        </div>
        <div className="flex gap-4 font-semibold text-primary">
          <a href="#" onClick={(e) => { e.preventDefault(); alert("AgriSense values your operational privacy. All raw files are processed ephemeral on secured servers; cached reports reside purely inside your local browser context."); }} className="hover:underline">Privacy Charter</a>
          <span className="text-gray-300">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Terms of Use: This tool serves as an educational and advisory diagnostic. Real-world chemical applications should be verified against regional regulatory agricultural extension offices."); }} className="hover:underline">Farming Terms</a>
          <span className="text-gray-300">|</span>
          <a href="#" onClick={(e) => { e.preventDefault(); alert("Contact AgriSense Agricultural Extension Office support at: support@agrisense.gov"); }} className="hover:underline">Farmer Support</a>
        </div>
      </footer>

      {/* 4. BottomNavBar (Mobile Only Layout) */}
      <nav className="md:hidden fixed bottom-0 w-full z-45 bg-white border-t border-surface-high shadow-lg h-20 flex justify-around items-center px-4 rounded-t-2xl">
        <button
          onClick={() => setActiveTab("scan")}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
            activeTab === "scan" 
              ? "bg-primary text-white shadow-md font-bold scale-105" 
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <Camera size={18} />
          <span className="text-[10px] mt-1 font-medium">{t.scan}</span>
        </button>

        <button
          onClick={() => setActiveTab("library")}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
            activeTab === "library" 
              ? "bg-primary text-white shadow-md font-bold scale-105" 
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[10px] mt-1 font-medium">{t.library}</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl transition-all ${
            activeTab === "history" 
              ? "bg-primary text-white shadow-md font-bold scale-105" 
              : "text-on-surface-variant hover:text-primary"
          }`}
        >
          <History size={18} />
          <span className="text-[10px] mt-1 font-medium">{t.history}</span>
        </button>
      </nav>

      {/* 5. Floating Action Button (FAB) - Camera Hotlink */}
      <input 
        type="file"
        ref={globalFileInputRef}
        onChange={handleFabFileSelect}
        className="hidden"
        accept="image/*"
      />
      <button 
        onClick={handleFabClick}
        disabled={fabDiagnosing}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-highlight hover:bg-highlight/95 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-35 border border-white/20 disabled:opacity-50"
        title="Quick Photo Scan"
      >
        <Camera size={26} className="stroke-[2.5]" />
      </button>

      {/* FAB Diagnosis Result Modal popup */}
      {showFabModal && fabResult && (
        <DiseaseModal 
          disease={fabResult}
          onClose={() => setShowFabModal(false)}
        />
      )}
    </div>
  );
}
