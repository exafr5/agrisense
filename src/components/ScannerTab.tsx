import React, { useState, useRef } from "react";
import { Camera, FileText, Upload, Sparkles, Check, RefreshCw, AlertTriangle, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DiagnosisResult, LanguageCode } from "../types";
import { TRANSLATIONS } from "../utils/translations";
import DiagnosticChat from "./DiagnosticChat";
import DiseaseModal from "./DiseaseModal";
import { PRESET_DISEASES } from "../data/diseases";

interface ScannerTabProps {
  onNewDiagnosis: (result: DiagnosisResult) => void;
  offlineMode: boolean;
  language?: LanguageCode;
}

export default function ScannerTab({ onNewDiagnosis, offlineMode, language = "en" }: ScannerTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisResult | null>(null);
  const [diagnosticMode, setDiagnosticMode] = useState<"photo" | "chat">("photo");
  const [showResultModal, setShowResultModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language];

  // Default mockup leaf image
  const DEFAULT_LEAF_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDTLklxllDm4TixyWPAS21jubyizji3zSuIrW7MLF5O2Cb0EsiCCbJmcm0J-pj66_7sfwtw1Dq2Vj3IcLieGbeQ9obHCOgrms2r9mR0RcifyvzEXM7R8gixTAdQUNB07MSpywFHRqNDiZBEQGeNumbMhYg6NEdlYe3R_9qJepMDXS5WhKq0h00-03Gv_MQeusYKnfqBT0VHQtBnd1T97b9ygga4oxp8Q050LFKT53ufTi4L2TUhoW6ezCG11D4KCc5AugBeiJ0UHr8";

  // Function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const processDiagnosis = async (imageB64: string | null, textDescription: string | null) => {
    setIsDiagnosing(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageB64,
          description: textDescription,
          offlineSimulated: offlineMode,
          language
        })
      });

      if (!response.ok) {
        throw new Error("Diagnosis request failed. Please check network and try again.");
      }

      const data: DiagnosisResult = await response.json();
      
      // If we uploaded an image, let's attach the previewUrl to the result
      const finalizedResult = {
        ...data,
        imageUrl: previewUrl || imageB64 || undefined
      };

      setActiveDiagnosis(finalizedResult);
      onNewDiagnosis(finalizedResult);
      setShowResultModal(true);

      // Reset file selection
      setSelectedFile(null);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during diagnostics.");
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file.");
      return;
    }
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Convert and send
    try {
      const base64 = await fileToBase64(file);
      await processDiagnosis(base64, null);
    } catch (err) {
      setErrorMessage("Failed to process image file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelectClick = () => {
    fileInputRef.current?.click();
  };

  // View prepackaged Early Blight details on demo card click
  const viewDemoDisease = () => {
    const earlyBlight = PRESET_DISEASES.find(d => d.id === "early_blight");
    if (earlyBlight) {
      setActiveDiagnosis({
        isHealthy: false,
        cropName: earlyBlight.crop,
        diseaseName: earlyBlight.name,
        scientificName: earlyBlight.scientificName,
        confidence: 87,
        severity: earlyBlight.severity,
        description: earlyBlight.description,
        symptoms: earlyBlight.symptoms,
        treatments: earlyBlight.treatments,
        imageUrl: earlyBlight.imageUrl,
        createdAt: new Date().toISOString()
      });
      setShowResultModal(true);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero / Scanning Arena */}
      <section className="relative flex flex-col items-center justify-center text-center py-6 sm:py-12">
        <div className="max-w-3xl w-full">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-highlight bg-highlight/10 px-3 py-1 rounded-full mb-3 inline-block">
            {offlineMode ? t.localFallbackActive : t.groundedInScience}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-primary tracking-tight leading-tight">
            {t.headline} <span className="text-highlight">{t.headlineHighlight}</span>
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mx-auto mb-6">
            {t.subheadline}
          </p>

          {/* Segmented Button Picker to switch modes */}
          <div className="relative flex justify-center p-1 bg-surface-low rounded-2xl max-w-xs mx-auto mb-8 border border-surface-high overflow-hidden">
            <button
              onClick={() => setDiagnosticMode("photo")}
              className={`relative z-10 flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                diagnosticMode === "photo" 
                  ? "text-white" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Camera size={14} />
              {t.foliagePhoto}
              {diagnosticMode === "photo" && (
                <motion.div
                  layoutId="activeSubTabBg"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
            <button
              onClick={() => setDiagnosticMode("chat")}
              className={`relative z-10 flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                diagnosticMode === "chat" 
                  ? "text-white" 
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <FileText size={14} />
              {t.aiAgronomistChat}
              {diagnosticMode === "chat" && (
                <motion.div
                  layoutId="activeSubTabBg"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-md"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
            </button>
          </div>

          {/* Mode Switch Renderer */}
          <AnimatePresence mode="wait">
            {diagnosticMode === "photo" ? (
              <motion.div
                key="photo"
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Interactive Scanner Box */}
                <div className="relative mx-auto max-w-md w-full">
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleFileSelectClick}
                    className={`group relative aspect-square overflow-hidden rounded-3xl border-2 cursor-pointer shadow-xl transition-all duration-300 bg-white ${
                      isDragOver ? "border-highlight bg-surface-low scale-102" : "border-surface-high hover:border-primary-light"
                    }`}
                  >
                    {/* Image preview vs Mockup Leaf */}
                    <img 
                      src={previewUrl || DEFAULT_LEAF_IMAGE} 
                      alt="Leaf scan candidate" 
                      className="w-full h-full object-cover select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Scanning Ray Line Overlay */}
                    {(isDiagnosing || !previewUrl) && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-highlight to-transparent shadow-[0_0_15px_#E8A33D] animate-scan" style={{ animationDuration: isDiagnosing ? "1.5s" : "3.5s" }} />
                    )}

                    {/* Float Diagnostics Card Overlay (Only visible on initial placeholder) */}
                    {!previewUrl && !isDiagnosing && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          viewDemoDisease();
                        }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hover:scale-105 active:scale-98 transition-transform"
                      >
                        <div className="bg-white/95 backdrop-blur-md border-2 border-primary px-5 py-3 rounded-2xl shadow-2xl flex flex-col items-center text-center gap-0.5">
                          <span className="font-mono text-[9px] text-highlight uppercase tracking-widest font-bold">Diagnosing...</span>
                          <div className="flex items-baseline gap-1">
                            <span className="font-serif text-xl font-bold text-primary">87%</span>
                            <span className="font-sans text-[10px] text-on-surface-variant font-medium">confidence</span>
                          </div>
                          <span className="font-serif text-sm font-bold text-primary">Early Blight</span>
                          <span className="text-[9px] text-primary underline mt-1 font-semibold flex items-center gap-0.5">
                            Click to View Details <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Drag-and-drop indicator sheet */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6">
                      <Upload size={40} className="mb-2 text-highlight animate-bounce" />
                      <p className="font-bold text-sm">{t.dropPhoto}</p>
                      <p className="text-xs text-gray-300 mt-1">{t.supportsFormat}</p>
                    </div>

                    {/* Loading State Overlay */}
                    {isDiagnosing && (
                      <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
                        <RefreshCw size={44} className="text-highlight animate-spin mb-3" />
                        <p className="font-serif text-lg font-bold text-highlight">{t.analyzingFoliage}</p>
                        <p className="text-xs text-gray-300 mt-1.5 animate-pulse">{t.runningModels}</p>
                      </div>
                    )}
                  </div>

                  {/* Decorative Corner Accents */}
                  <div className="absolute -top-3 -right-3 w-10 h-10 border-t-4 border-r-4 border-highlight rounded-tr-xl pointer-events-none" />
                  <div className="absolute -bottom-3 -left-3 w-10 h-10 border-b-4 border-l-4 border-highlight rounded-bl-xl pointer-events-none" />
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="max-w-md mx-auto mt-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs flex gap-2 items-center">
                    <AlertTriangle size={16} className="shrink-0 text-red-600" />
                    <p className="text-left font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Action Trigger Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                    className="hidden"
                    accept="image/*"
                  />
                  <button 
                    onClick={handleFileSelectClick}
                    disabled={isDiagnosing}
                    className="bg-primary hover:bg-primary-dark text-white h-12 px-7 rounded-xl font-semibold text-sm hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <Camera size={18} />
                    {t.startPhotoScan}
                  </button>
                  <button 
                    onClick={() => setDiagnosticMode("chat")}
                    disabled={isDiagnosing}
                    className="border-2 border-primary text-primary h-12 px-7 rounded-xl font-semibold text-sm hover:bg-surface-low transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <FileText size={18} />
                    {t.describeSymptoms}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -15 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl mx-auto w-full"
              >
                <DiagnosticChat 
                  offlineMode={offlineMode}
                  language={language}
                  onNewDiagnosis={onNewDiagnosis}
                  onOpenReport={(res) => {
                    setActiveDiagnosis(res);
                    setShowResultModal(true);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 2. How it Works / Science in your pocket */}
      <section className="bg-surface-low border border-surface-high/60 rounded-3xl p-6 sm:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">Science in your pocket</h3>
            <p className="text-on-surface-variant text-sm">Three simple steps to protect your livelihood and stop outbreaks.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-surface-high rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary-fixed text-primary-dark flex items-center justify-center mb-4 font-bold text-sm">
                01
              </div>
              <h4 className="font-serif text-lg font-bold text-primary mb-2">Snap Photo</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Take a clear photo of the leaf spot or lesion under direct daylight. Ensure the focus captures the texture of the diseased patch.
              </p>
            </div>

            <div className="bg-white border border-surface-high rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-accent-orange/20 text-accent-brown flex items-center justify-center mb-4 font-bold text-sm">
                02
              </div>
              <h4 className="font-serif text-lg font-bold text-primary mb-2">AI Diagnosis</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Our database evaluates color gradients, spotting patterns, and crop species indicators to isolate the biological pathogen instantly.
              </p>
            </div>

            <div className="bg-white border border-surface-high rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-primary-light/10 text-primary-light flex items-center justify-center mb-4 font-bold text-sm">
                03
              </div>
              <h4 className="font-serif text-lg font-bold text-primary mb-2">Treat Organically</h4>
              <p className="text-on-surface-variant text-xs leading-relaxed">
                Obtain detailed step-by-step physical, cultural, organic, and chemical procedures to suppress disease vectors and protect healthy crops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why AgriSense / Glove friendly */}
      <section className="bg-primary text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
        {/* Background ambient accent */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-light/15 rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-highlight bg-white/10 px-2.5 py-1 rounded-full mb-2 inline-block">
                Tailored Field Ergonomics
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">Built for the field, not the office.</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0 h-max text-highlight">
                  <Check size={16} />
                </div>
                <div>
                  <h5 className="font-bold">High-Contrast UI</h5>
                  <p className="text-white/70 text-xs mt-0.5">Calibrated and tested for maximum readability in high-glare conditions under blazing open sunlight.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0 h-max text-highlight">
                  <Check size={16} />
                </div>
                <div>
                  <h5 className="font-bold">Offline-Ready Intelligence</h5>
                  <p className="text-white/70 text-xs mt-0.5">Supports simulated matches and cached regional disease databases for working in deep remote valleys lacking cellular network.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-1.5 bg-white/10 rounded-lg shrink-0 h-max text-highlight">
                  <Check size={16} />
                </div>
                <div>
                  <h5 className="font-bold">Glove-Friendly Touch Targets</h5>
                  <p className="text-white/70 text-xs mt-0.5">Massive buttons, click-areas, and gestures designed to be highly tactile for busy hands during intense labor.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-72 shrink-0 self-stretch hidden md:flex items-center justify-center p-6 bg-white/5 border border-white/15 rounded-2xl backdrop-blur-sm">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl border border-dashed border-white/30 flex items-center justify-center mx-auto text-highlight/80 text-3xl">
                🧑‍🌾
              </div>
              <p className="font-serif italic text-sm text-gray-200">"Saving yields, one leaf scan at a time."</p>
              <div className="text-[10px] text-gray-400 font-mono">AgriSense Core v1.4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis Report Detail Modal */}
      {showResultModal && activeDiagnosis && (
        <DiseaseModal 
          disease={activeDiagnosis}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
}
