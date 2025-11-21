// Auth Types
export interface User {
  user_id: number;
  username: string;
  email?: string;
}

export interface LoginResponse {
  access_token: string;
  username: string;
}

export interface RegisterResponse {
  msg: string;
  user_id: number;
  username: string;
}

// Analysis Types
export interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface DetectedDates {
  admission: string;
  discharge: string;
}

export interface StructuredMeta {
  detected_patient_name: string;
  detected_patient_id: string;
  detected_age: string;
  detected_gender: string;
  detected_dates: DetectedDates;
  detected_hospital: string;
  detected_gst_number: string;
  detected_address: string;
}

export interface ValidationFlag {
  id: string;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  description: string;
  evidence: string;
  created_at: string;
}

export interface ValidationSummary {
  compliance_score: number;
  issues_found: string[];
  recommendations: string[];
}

export interface ConfidenceScores {
  ocr_confidence: number;
  extraction_confidence: number;
  overall_confidence: number;
}

export interface AnalysisResponse {
  file_id: string;
  extracted_id: string;
  file: {
    filename: string;
    storage_path: string;
    uploaded_at: string;
    size: number;
  };
  raw_text: string;
  structured: {
    line_items: LineItem[];
    meta: StructuredMeta;
  };
  validation: {
    flags: ValidationFlag[];
    summary: ValidationSummary;
  };
  analysis_details: {
    summary: ValidationSummary;
    details: {
      checks: {
        has_patient_info: boolean;
        has_dates: boolean;
        has_amounts: boolean;
        has_line_items: boolean;
      };
    };
  };
  confidence_scores: ConfidenceScores;
  report: {
    report_path: string;
    report_type: 'html' | 'pdf' | null;
  };
}
