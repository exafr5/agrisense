import { useState } from "react";
import { Trash2, Search, Calendar, ChevronRight, HelpCircle, History, Sparkles, AlertCircle } from "lucide-react";
import { ScanHistoryItem } from "../types";
import DiseaseModal from "./DiseaseModal";

interface HistoryTabProps {
  historyItems: ScanHistoryItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onNavigateToScan: () => void;
}

export default function HistoryTab({ historyItems, onRemoveItem, onClearAll, onNavigateToScan }: HistoryTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<ScanHistoryItem | null>(null);

  // Search filter
  const filteredHistory = historyItems.filter((item) => {
    return item.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.diseaseName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const severityColors = {
    High: "bg-red-50 text-red-700 border-red-200",
    Moderate: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
    Healthy: "bg-green-50 text-green-700 border-green-200",
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Date unknown";
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-primary mb-1">Diagnosis History</h2>
          <p className="text-on-surface-variant text-sm">
            Access past plant pathology profiles and action checklists saved locally on this device.
          </p>
        </div>

        {historyItems.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your entire local scan history? This action is irreversible.")) {
                onClearAll();
              }
            }}
            className="text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            Purge All
          </button>
        )}
      </div>

      {/* History Grid / List */}
      {historyItems.length > 0 ? (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="bg-white border border-surface-high rounded-2xl p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text"
                placeholder="Search history by crop or disease name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-surface-high rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-on-surface placeholder:text-gray-400"
              />
            </div>
          </div>

          {filteredHistory.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white border border-surface-high rounded-2xl p-4 flex gap-4 hover:shadow-md hover:border-primary-light transition-all cursor-pointer group relative overflow-hidden"
                >
                  {/* Left: Picture Preview */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-primary-dark">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.cropName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex flex-col items-center justify-center text-primary-fixed/30 p-2 text-center">
                        <Calendar size={20} className="mb-1" />
                        <span className="text-[8px] font-mono leading-tight">Text Profile</span>
                      </div>
                    )}
                  </div>

                  {/* Middle: Core Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-background border border-surface-high text-primary font-bold text-[9px] px-1.5 py-0.5 rounded-md">
                          {item.cropName}
                        </span>
                        <span className={`text-[8px] font-mono tracking-wider uppercase border px-1.5 py-0.5 rounded-full ${severityColors[item.severity]}`}>
                          {item.severity}
                        </span>
                      </div>
                      
                      <h3 className="font-serif text-base font-bold text-primary truncate group-hover:text-primary-light transition-colors">
                        {item.diseaseName}
                      </h3>
                      
                      <p className="text-on-surface-variant text-[11px] line-clamp-1">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-medium pt-1">
                      <Calendar size={11} />
                      <span>{formatDate(item.createdAt)}</span>
                    </div>
                  </div>

                  {/* Right: Prune Item Action */}
                  <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      title="Delete entry"
                    >
                      <Trash2 size={13} />
                    </button>
                    <ChevronRight size={16} className="text-gray-300 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-surface-high rounded-2xl">
              <AlertCircle size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-on-surface font-semibold text-sm">No local search results found</p>
              <p className="text-xs text-on-surface-variant mt-1">Try modifying your query.</p>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white border border-surface-high rounded-3xl max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center mx-auto mb-4">
            <History size={28} />
          </div>
          <h3 className="font-serif text-lg font-bold text-primary">No local histories registered</h3>
          <p className="text-on-surface-variant text-xs max-w-sm mx-auto mt-2 leading-relaxed">
            Your leaf scan and symptom records are securely cached on this device browser. Once you run your first diagnostic, the reports will populate here.
          </p>
          <button
            onClick={onNavigateToScan}
            className="mt-6 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all inline-flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            Start Your First Diagnosis
          </button>
        </div>
      )}

      {/* History Detail Modal */}
      {selectedItem && (
        <DiseaseModal 
          disease={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
