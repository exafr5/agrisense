import React, { useState } from "react";
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
  HelpCircle 
} from "lucide-react";

interface DiseaseModalProps {
  disease: LibraryDisease | DiagnosisResult;
  onClose: () => void;
}

export default function DiseaseModal({ disease, onClose }: DiseaseModalProps) {
  const [resultMode, setResultMode] = useState<"simple" | "detailed">("simple");

  const isHealthyResult = 'isHealthy' in disease ? disease.isHealthy : false;
  const severityValue = disease.severity;
  const displayName = 'diseaseName' in disease ? disease.diseaseName : disease.name;

  // Severity color mapping
  const severityColors = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
    Healthy: "bg-green-50 text-green-700 border-green-200",
  };

  const currentSeverityColor = severityColors[severityValue] || "bg-gray-50 text-gray-700 border-gray-200";

  // Filter treatments for simple mode (prioritize Immediate Actions and Organic / Natural solutions)
  const simpleTreatments = disease.treatments.filter(t => 
    t.category.toLowerCase().includes("immediate") || 
    t.category.toLowerCase().includes("organic") || 
    t.category.toLowerCase().includes("natural") ||
    t.category.toLowerCase().includes("solution") ||
    t.category.toLowerCase().includes("practice") ||
    t.category.toLowerCase().includes("prevention")
  );

  // If no simple categories match, use all of them
  const treatmentsToDisplay = resultMode === "simple" && simpleTreatments.length > 0 
    ? simpleTreatments 
    : disease.treatments;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-background border border-surface-high rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Photo or Placeholder */}
        <div className="relative h-48 sm:h-60 overflow-hidden bg-primary-dark shrink-0">
          {disease.imageUrl ? (
            <img 
              src={disease.imageUrl} 
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
              {resultMode === "detailed" && 'confidence' in disease && (
                <span className="text-[10px] bg-primary/80 border border-primary-light font-mono px-2 py-0.5 rounded-full flex items-center gap-1 text-primary-fixed">
                  <Sparkles size={10} />
                  {(disease as any).confidence}% Match Confidence
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">{displayName}</h3>
            {resultMode === "detailed" && disease.scientificName && disease.scientificName !== "N/A" && (
              <p className="font-mono text-xs italic text-emerald-300 tracking-wide mt-1 flex items-center gap-1">
                <Activity size={12} /> Scientific Pathogen: {disease.scientificName}
              </p>
            )}
          </div>
        </div>

        {/* Mode Selector Tab Bar */}
        <div className="bg-surface-low border-b border-surface-high/65 px-6 py-3 flex items-center justify-between shrink-0 gap-4 flex-wrap">
          <div className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
            <BookOpen size={14} className="text-primary" />
            Display Configuration:
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
              {disease.description}
            </p>
          </div>

          {/* Section: Symptoms */}
          <div>
            <h4 className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-3.5">
              <AlertTriangle size={15} className="text-highlight" />
              {resultMode === "simple" ? "How to Spot It" : "Key Diagnostic Symptoms"}
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {disease.symptoms.map((symptom, i) => (
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
            
            {resultMode === "simple" && disease.treatments.length > simpleTreatments.length && (
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

