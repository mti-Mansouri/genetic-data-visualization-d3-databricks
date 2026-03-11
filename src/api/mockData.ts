export interface Variant {
  id: string;
  gene: string;
  mutation: string;
  impact: 'High' | 'Moderate' | 'Low';
  phenotypes: string[];
  description: string;
}

export const mockVariants: Variant[] = [
  {
    id: 'v1',
    gene: 'BRCA1',
    mutation: 'c.5095C>T',
    impact: 'High',
    phenotypes: ['Breast Cancer', 'Ovarian Cancer', 'DNA Repair'],
    description: 'A critical pathogenic variant in the BRCT domain. Associated with high hereditary risk and sensitivity to PARP inhibitors.'
  },
  {
    id: 'v2',
    gene: 'TP53',
    mutation: 'p.Arg175H',
    impact: 'High',
    phenotypes: ['Li-Fraumeni', 'Osteosarcoma', 'Adrenal Cancer'],
    description: 'This hotspot mutation destabilizes the p53 protein structure, leading to loss of tumor suppression functions.'
  },
  {
    id: 'v3',
    gene: 'LDLR',
    mutation: 'c.1246C>T',
    impact: 'Moderate',
    phenotypes: ['Hypercholesterolemia', 'Xanthoma', 'Early CAD'],
    description: 'Affects the binding of LDL particles. Requires early clinical intervention for cardiovascular risk management.'
  }
];