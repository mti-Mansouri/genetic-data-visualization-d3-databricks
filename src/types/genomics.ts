export interface Variant {
  id: string;
  gene: string;
  mutation: string;
  impact: 'High' | 'Moderate' | 'Low';
  phenotypes: string[];
  severity: number; // 0 to 1
}

export interface PatientCase {
  id: string;
  patientName: string;
  caseType: 'WES' | 'WGS' | 'Panel';
  date: string;
  variants: Variant[]; 
}