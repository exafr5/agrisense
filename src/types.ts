import { LanguageCode } from "./utils/translations";
export type { LanguageCode };

export interface TreatmentCategory {
  category: string;
  steps: string[];
}

export interface DiagnosisResult {
  isHealthy: boolean;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: 'High' | 'Moderate' | 'Low' | 'Healthy';
  description: string;
  symptoms: string[];
  treatments: TreatmentCategory[];
  imageUrl?: string;
  createdAt: string;
}

export interface LibraryDisease {
  id: string;
  name: string;
  scientificName: string;
  crop: string;
  severity: 'High' | 'Moderate' | 'Low';
  description: string;
  symptoms: string[];
  treatments: TreatmentCategory[];
  imageUrl: string;
}

export interface ScanHistoryItem extends DiagnosisResult {
  id: string;
}

export interface FarmerProfile {
  name: string;
  region: string;
  primaryCrops: string[];
  offlineMode: boolean;
  highContrast: boolean;
  language?: LanguageCode;
}

