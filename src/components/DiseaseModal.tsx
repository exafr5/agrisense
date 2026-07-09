import React, { useState, useEffect } from "react";
import { LibraryDisease, DiagnosisResult } from "../types";
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Leaf, 
  Sparkles, 
  HeartPulse, 
  ShieldAlert, 
  CheckCircle2, 
  BookOpen, 
  Activity, 
  HelpCircle,
  Volume2,
  VolumeX,
  Languages,
  Loader2
} from "lucide-react";

interface DiseaseModalProps {
  disease: LibraryDisease | DiagnosisResult;
  onClose: () => void;
}

export default function DiseaseModal({ disease, onClose }: DiseaseModalProps) {
  const [resultMode, setResultMode] = useState<"simple" | "detailed">("simple");
  const [activeDisease, setActiveDisease] = useState<LibraryDisease | DiagnosisResult>(disease);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isHindi, setIsHindi] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up any speaking voice when closing
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const isHealthyResult = 'isHealthy' in activeDisease ? activeDisease.isHealthy : false;
  const severityValue = activeDisease.severity;
  const displayName = 'diseaseName' in activeDisease ? activeDisease.diseaseName : activeDisease.name;

  // Severity color mapping
  const severityColors = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
    Healthy: "bg-green-50 text-green-700 border-green-200",
  };

  const currentSeverityColor = severityColors[severityValue] || "bg-gray-50 text-gray-700 border-gray-200";

  // Filter treatments for simple mode (prioritize Immediate Actions and Organic / Natural solutions)
  const simpleTreatments = activeDisease.treatments.filter(t => 
    t.category.toLowerCase().includes("immediate") || 
    t.category.toLowerCase().includes("organic") || 
    t.category.toLowerCase().includes("natural") ||
    t.category.toLowerCase().includes("solution") ||
    t.category.toLowerCase().includes("practice") ||
    t.category.toLowerCase().includes("prevention") ||
    t.category.includes("कार्रवाई") ||
    t.category.includes("समाधान") ||
    t.category.includes("नियंत्रण") ||
    t.category.includes("बचाव")
  );

  // If no simple categories match, use all of them
  const treatmentsToDisplay = resultMode === "simple" && simpleTreatments.length > 0 
    ? simpleTreatments 
    : activeDisease.treatments;

  // Speak Up handler
  const handleSpeakUp = () => {
    if (!window.speechSynthesis) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();

    const cropName = 'cropName' in activeDisease ? activeDisease.cropName : activeDisease.crop;
    const voiceLang = isHindi ? "hi-IN" : "en-IN";

    let speechText = "";
    if (isHindi) {
      speechText = `बीमारी का नाम: ${displayName}. फसल का प्रकार: ${cropName}. विवरण: ${activeDisease.description}. `;
      if (activeDisease.symptoms.length > 0) {
        speechText += `प्रमुख लक्षण इस प्रकार हैं: ${activeDisease.symptoms.join(". ")}. `;
      }
      speechText += `उपचार के तरीके इस प्रकार हैं: `;
      activeDisease.treatments.forEach(t => {
        speechText += `${t.category}: ${t.steps.join(". ")}. `;
      });
    } else {
      speechText = `Disease: ${displayName}. Crop: ${cropName}. Description: ${activeDisease.description}. `;
      if (activeDisease.symptoms.length > 0) {
        speechText += `The main symptoms are: ${activeDisease.symptoms.join(". ")}. `;
      }
      speechText += `The recommended treatment steps are: `;
      activeDisease.treatments.forEach(t => {
        speechText += `${t.category}: ${t.steps.join(". ")}. `;
      });
    }

    // Clean up any markdown syntax
    const cleanSpeechText = speechText.replace(/[*#_`~]/g, "").trim();

    const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
    utterance.lang = voiceLang;

    // Try to get a high quality matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(isHindi ? "hi" : "en"));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.rate = 0.85; // slightly slower for better comprehensibility for farmers

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Toggle dynamic Hindi translation
  const handleTranslateToggle = async () => {
    if (isHindi) {
      // Revert to original English / system default
      setActiveDisease(disease);
      setIsHindi(false);
      if (isSpeaking && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      return;
    }

    setIsTranslating(true);
    if (isSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const response = await fetch("/api/translate-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diagnosis: disease,
          targetLanguage: "hi"
        })
      });

      if (!response.ok) {
        throw new Error("Translation request failed");
      }

      const data = await response.json();
      setActiveDisease(data);
      setIsHindi(true);
    } catch (err) {
      console.error("Translation failed:", err);
      alert("Unable to complete translation at this moment. Please check your internet connection.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-surface-high rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Photo or Placeholder */}
        <div className="relative h-48 sm:h-60 overflow-hidden bg-primary-dark shrink-0">
          {activeDisease.imageUrl ? (
            <img 
              src={activeDisease.imageUrl} 
              alt={displayName} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-primary-fixed/30 bg-gradient-to-br from-primary to-primary-dark p-6">
              <Leaf size={56} className="stroke-1 mb-2 animate-pulse" />
              <p className="font-serif text-base">No image available for this diagnosis</p>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors border border-white/20"
            aria-label="Close report"
          >
            <X size={20} />
          </button>

          {/* Core metadata overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border ${currentSeverityColor}`}>
                {severityValue} Severity
              </span>
              {resultMode === "detailed" && 'confidence' in activeDisease && (
                <span className="text-[10px] bg-primary/80 border border-primary-light font-mono px-2 py-0.5 rounded-full flex items-center gap-1 text-primary-fixed">
                  <Sparkles size={10} />
                  {(activeDisease as any).confidence}% Match Confidence
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">{displayName}</h3>
            {resultMode === "detailed" && activeDisease.scientificName && activeDisease.scientificName !== "N/A" && (
              <p className="font-mono text-xs italic text-emerald-300 tracking-wide mt-1 flex items-center gap-1">
                <Activity size={12} /> Scientific Pathogen: {activeDisease.scientificName}
              </p>
            )}
          </div>
        </div>

        {/* Mode Selector Tab Bar */}
        <div className="bg-surface-low border-b border-surface-high/65 px-6 py-3 flex items-center justify-between shrink-0 gap-4 flex-wrap">
          {/* Audio & Translation Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Speak Up Button */}
            <button
              id="btn-speak-up"
              onClick={handleSpeakUp}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border cursor-pointer ${
                isSpeaking 
                  ? "bg-amber-500 text-white border-amber-500 animate-pulse" 
                  : "bg-white text-primary border-surface-high hover:bg-gray-50 hover:border-primary-light"
              }`}
            >
              {isSpeaking ? <VolumeX size={14} className="animate-bounce" /> : <Volume2 size={14} />}
              {isSpeaking ? "Stop Voice (आवाज़ रोकें)" : "Speak Up (बोलें)"}
            </button>

            {/* Translate Button */}
            <button
              id="btn-translate-hindi"
              onClick={handleTranslateToggle}
              disabled={isTranslating}
              className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border cursor-pointer disabled:opacity-75 ${
                isHindi 
                  ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700" 
                  : "bg-white text-primary border-surface-high hover:bg-gray-50 hover:border-primary-light"
              }`}
            >
              {isTranslating ? (
                <Loader2 size={14} className="animate-spin text-primary" />
              ) : (
                <Languages size={14} />
              )}
              {isTranslating ? "Translating..." : isHindi ? "Read in English" : "Translate to Hindi (हिंदी अनुवाद)"}
            </button>
          </div>

          <div className="p-0.5 bg-white rounded-xl flex border border-surface-high shadow-sm shrink-0">
            <button
              onClick={() => setResultMode("simple")}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                resultMode === "simple"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Leaf size={13} />
              Simple (सरल)
            </button>
            <button
              onClick={() => setResultMode("detailed")}
              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                resultMode === "detailed"
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <Sparkles size={13} />
              Detailed (विस्तृत)
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Uncertainty Warning Banner */}
          {(activeDisease as any).isUncertain && (
            <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-950 shadow-sm">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="font-bold text-sm">Low Confidence / Diagnosis Uncertainty (कम विश्वास रिपोर्ट)</h5>
                <p className="text-xs mt-1 leading-relaxed font-semibold text-amber-900">
                  {(activeDisease as any).uncertaintyWarning || "The diagnostic features detected are somewhat ambiguous. Please verify symptoms against other healthy leaves or consult a local agricultural officer."}
                </p>
              </div>
            </div>
          )}
          
          {/* Friendly Guidance Banner in Simple Mode */}
          {resultMode === "simple" ? (
            <div className="bg-emerald-50/40 border border-emerald-100/80 rounded-xl p-3.5 flex items-start gap-3">
              <span className="text-xl mt-0.5">🌾</span>
              <div>
                <h5 className="text-emerald-900 font-bold text-xs uppercase tracking-wide">Farmer-Friendly Guide</h5>
                <p className="text-emerald-800 text-xs leading-relaxed mt-0.5">
                  We have simplified this report to highlight natural remedies and critical direct steps. 
                  Tap <strong>Detailed Mode</strong> above for botanical pathogens and chemical specifications.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-primary-fixed/20 border border-primary-light/40 rounded-xl p-3.5 flex items-start gap-3">
              <span className="text-xl mt-0.5">🔬</span>
              <div>
                <h5 className="text-primary-dark font-bold text-xs uppercase tracking-wide">Agronomist Specification Sheet</h5>
                <p className="text-primary-dark text-xs leading-relaxed mt-0.5">
                  Viewing full botanical details, confidence metrics, and complete biological and prevention protocols.
                </p>
              </div>
            </div>
          )}

          {/* Section: Overview description */}
          <div className="bg-white border border-surface-high rounded-xl p-5 shadow-sm">
            <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2.5">
              <Info size={15} />
              {resultMode === "simple" ? "About This Issue" : "Agricultural Summary & Pathology"}
            </h4>
            <p className="text-on-surface-variant text-sm leading-relaxed font-medium">
              {activeDisease.description}
            </p>
          </div>

          {/* Section: Symptoms */}
          <div>
            <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-3.5">
              <AlertTriangle size={15} className="text-highlight" />
              {resultMode === "simple" ? "How to Spot It" : "Key Diagnostic Symptoms"}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeDisease.symptoms.map((symptom, i) => (
                <li 
                  key={i} 
                  className={`flex gap-3 text-sm p-3.5 rounded-xl border shadow-sm transition-all ${
                    resultMode === "simple" 
                      ? "bg-amber-50/20 border-amber-100/70" 
                      : "bg-white border-surface-high/65"
                  }`}
                >
                  <CheckCircle2 size={16} className={`shrink-0 mt-0.5 ${resultMode === "simple" ? "text-amber-600" : "text-primary"}`} />
                  <span className="text-on-surface font-medium leading-relaxed">{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Treatments */}
          <div className="space-y-4">
            <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2">
              <HeartPulse size={15} />
              {resultMode === "simple" ? "Cure & Care Steps (कृषि समाधान)" : "Grounded Remediation Protocols"}
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {treatmentsToDisplay.map((t, idx) => {
                // Assign category icon and styling
                let CatIcon = ShieldCheck;
                let bgHeader = "bg-primary-fixed/40 text-primary-dark border-primary-light/40";
                
                if (t.category.toLowerCase().includes("immediate")) {
                  CatIcon = ShieldAlert;
                  bgHeader = "bg-red-50 text-red-800 border-red-200/60";
                } else if (t.category.toLowerCase().includes("organic") || t.category.toLowerCase().includes("solution") || t.category.toLowerCase().includes("natural")) {
                  CatIcon = Leaf;
                  bgHeader = "bg-emerald-50 text-emerald-800 border-emerald-200/60";
                } else if (t.category.toLowerCase().includes("cultural") || t.category.toLowerCase().includes("practice") || t.category.toLowerCase().includes("prevention")) {
                  CatIcon = Info;
                  bgHeader = "bg-amber-50 text-amber-800 border-amber-200/60";
                }

                return (
                  <div key={idx} className="bg-white border border-surface-high rounded-xl overflow-hidden shadow-sm hover:shadow transition-shadow">
                    <div className={`px-4 py-3 font-bold text-xs uppercase tracking-wider border-b flex items-center gap-2 ${bgHeader}`}>
                      <CatIcon size={14} />
                      {t.category}
                    </div>
                    <ul className="p-3.5 divide-y divide-gray-100 text-sm">
                      {t.steps.map((step, sIdx) => (
                        <li key={sIdx} className="py-2.5 px-1.5 flex gap-3 text-on-surface-variant">
                          <span className="font-mono text-primary font-bold text-xs bg-primary-fixed/30 px-1.5 py-0.5 rounded shrink-0 h-fit">
                            0{sIdx + 1}
                          </span>
                          <p className="flex-1 leading-relaxed font-medium">{step}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            {resultMode === "simple" && activeDisease.treatments.length > simpleTreatments.length && (
              <p className="text-center text-xs text-on-surface-variant italic mt-2">
                * Some advanced chemical or specialized control protocols are hidden. Switch to <strong>Detailed Mode</strong> above to view them.
              </p>
            )}
          </div>
        </div>

        {/* Footer Area */}
        <div className="bg-surface-low border-t border-surface-high px-6 py-4 flex justify-between items-center text-xs text-on-surface-variant shrink-0">
          <span className="font-mono flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isHealthyResult ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"}`} />
            {isHealthyResult ? "Status: Healthy (स्वस्थ)" : "Status: Remediation Required (उपचार आवश्यक)"}
          </span>
          <button 
            onClick={onClose}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

