import { useState } from "react";
import { Search, Filter, Sparkles, BookOpen, ChevronRight, RefreshCw, AlertTriangle } from "lucide-react";
import { LibraryDisease } from "../types";
import { PRESET_DISEASES } from "../data/diseases";
import DiseaseModal from "./DiseaseModal";

export default function LibraryTab() {
  const [diseases, setDiseases] = useState<LibraryDisease[]>(PRESET_DISEASES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCropFilter, setSelectedCropFilter] = useState("All");
  const [selectedDisease, setSelectedDisease] = useState<LibraryDisease | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filters
  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCropFilter === "All") return matchesSearch;
    return matchesSearch && d.crop.toLowerCase().includes(selectedCropFilter.toLowerCase());
  });

  // Extract individual crops for filtering
  const cropSet = new Set<string>();
  diseases.forEach((d) => {
    // Split on "/", ",", "and" to get clean, separate crop categories
    const parts = d.crop.split(/[\/,]|\band\b/i).map((c) => c.trim());
    parts.forEach((p) => {
      if (p) {
        const capitalized = p.charAt(0).toUpperCase() + p.slice(1);
        cropSet.add(capitalized);
      }
    });
  });
  const uniqueCrops = ["All", ...Array.from(cropSet)];

  // Handle dynamic disease generation using Gemini if not found
  const handleAIGenerateDisease = async () => {
    if (!searchTerm.trim()) return;
    setIsGenerating(true);
    setAiError(null);

    try {
      // Trigger API to generate details for search query
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Create a professional agricultural library profile for the crop disease: "${searchTerm}". Do not make a diagnosis on a leaf, but provide the generalized scientific facts.`,
          offlineSimulated: false
        })
      });

      if (!response.ok) {
        throw new Error("Failed to consult agricultural intelligence.");
      }

      const rawData = await response.json();
      
      const newDisease: LibraryDisease = {
        id: rawData.diseaseName.toLowerCase().replace(/\s+/g, "_"),
        name: rawData.diseaseName,
        scientificName: rawData.scientificName || "Unknown Pathogen",
        crop: rawData.cropName || "General Crop",
        severity: (rawData.severity === "Healthy" ? "Low" : rawData.severity) as 'High' | 'Moderate' | 'Low',
        description: rawData.description,
        symptoms: rawData.symptoms || [],
        treatments: rawData.treatments || [],
        imageUrl: "" // Dynamic results don't have default prepackaged photos
      };

      // Add to diseases list so it displays instantly
      setDiseases(prev => [newDisease, ...prev]);
      setSelectedDisease(newDisease);
      setSearchTerm("");
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to find database record. Reverting to local search.");
    } finally {
      setIsGenerating(false);
    }
  };

  const severityColors = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Header */}
      <div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">Foliar Disease Library</h2>
        <p className="text-on-surface-variant text-sm">
          Browse and research recognized threats, pathogen profiles, and evidence-based treatments.
        </p>
      </div>

      {/* Control Area: Search & Filters */}
      <div className="bg-white border border-surface-high rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search diseases, pathogens or crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-surface-high rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-gray-400"
            />
          </div>

          {/* Crop Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-on-surface-variant flex items-center gap-1 font-semibold uppercase mr-1">
              <Filter size={12} /> Crop:
            </span>
            {uniqueCrops.map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCropFilter(crop)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCropFilter === crop 
                    ? "bg-primary text-white shadow-sm" 
                    : "bg-background border border-surface-high text-on-surface-variant hover:bg-surface-low"
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic AI Generation Banner if no matches found */}
        {filteredDiseases.length === 0 && searchTerm.trim().length > 0 && (
          <div className="bg-primary/5 border border-primary/25 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 animate-fadeIn">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-sm text-primary">
                <Sparkles size={16} className="text-highlight fill-highlight/15" />
                No local records for "{searchTerm}"
              </div>
              <p className="text-xs text-on-surface-variant">
                Would you like AgriSense AI to dynamically compile a biological pathology sheet for this condition?
              </p>
            </div>
            <button
              onClick={handleAIGenerateDisease}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={12} className="animate-spin" />
                  Compiling...
                </>
              ) : (
                <>
                  <Sparkles size={12} />
                  Compile with AI
                </>
              )}
            </button>
          </div>
        )}

        {aiError && (
          <div className="bg-red-50 border border-red-150 rounded-xl p-3 text-xs text-red-800 flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-600 shrink-0" />
            <p className="font-medium">{aiError}</p>
          </div>
        )}
      </div>

      {/* Disease Grid */}
      {filteredDiseases.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDiseases.map((d) => (
            <div 
              key={d.id}
              onClick={() => setSelectedDisease(d)}
              className="bg-white border border-surface-high rounded-2xl overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Photo Area */}
              <div className="h-44 sm:h-48 bg-primary-dark overflow-hidden relative">
                {d.imageUrl ? (
                  <img 
                    src={d.imageUrl} 
                    alt={d.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center p-4 text-primary-fixed/40">
                    <BookOpen size={36} className="mb-2" />
                    <span className="font-serif text-xs">AI Compiled Record</span>
                  </div>
                )}
                {/* Crop Badge */}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-surface-high text-primary font-bold text-[10px] px-2 py-0.5 rounded-md">
                  {d.crop}
                </span>
              </div>

              {/* Info text */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <span className={`text-[9px] font-mono tracking-wider uppercase border px-2 py-0.5 rounded-full ${severityColors[d.severity]}`}>
                      {d.severity} Severity
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-primary group-hover:text-primary-light transition-colors leading-snug">
                    {d.name}
                  </h3>
                  <p className="font-mono text-[10px] italic text-on-surface-variant">
                    {d.scientificName}
                  </p>
                  <p className="text-xs text-on-surface-variant line-clamp-3 leading-relaxed pt-1">
                    {d.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-primary font-bold">
                  <span>View Treatment Protocol</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-surface-high rounded-2xl">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-on-surface font-semibold">No diseases match your search parameters</p>
          <p className="text-xs text-on-surface-variant mt-1">Try selecting another filter or searching a different term.</p>
        </div>
      )}

      {/* Disease Detail Modal */}
      {selectedDisease && (
        <DiseaseModal 
          disease={selectedDisease}
          onClose={() => setSelectedDisease(null)}
        />
      )}
    </div>
  );
}
