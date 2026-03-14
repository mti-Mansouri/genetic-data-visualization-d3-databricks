import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { PatientCase, Variant } from '../../types/genomics';

interface GenomicsState {
  patientIndex: { id: string; internal_id: string; last_date: string }[];
  casesCache: Record<string, PatientCase>; // Cache: CaseID -> Full Case Data
  activeCaseId: string | null;
  selectedVariant: Variant | null;
  aiAnalyses: Record<string, string>; // Cache: VariantID -> Text
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: GenomicsState = {
  patientIndex: [],
  casesCache: {},
  activeCaseId: null,
  selectedVariant: null,
  aiAnalyses: {},
  status: 'idle',
};

// --- ASYNC THUNKS ---

// 1. Fetch the sidebar list (The Index)
export const fetchPatientIndex = createAsyncThunk(
  'genomics/fetchIndex',
  async () => {
    await new Promise(r => setTimeout(r, 800)); 
    return [
      { id: 'p1', internal_id: 'Patient-XJ9', last_date: '2024-03-10' },
      { id: 'p2', internal_id: 'Patient-RT4', last_date: '2024-03-12' },
    ];
  }
);

// 2. Fetch a specific case (The Big Data)
export const fetchPatientCase = createAsyncThunk(
  'genomics/fetchCase',
  async (caseId: string, { getState }) => {
    const state = getState() as { genomics: GenomicsState };
    // CACHE CHECK: If we already have this case, return it from the cache
    if (state.genomics.casesCache[caseId]) {
      return state.genomics.casesCache[caseId];
    }

    await new Promise(r => setTimeout(r, 1000));
    return {
      id: caseId,
      patientName: caseId === 'p1' ? "Patient-XJ9" : "Patient-RT4",
      variants: [
        { id: `v-${caseId}-1`, gene: 'BRCA1', mutation: 'c.5266dup', impact: 'High', phenotypes: ['Breast Cancer'], severity: 0.9 },
        { id: `v-${caseId}-2`, gene: 'TP53', mutation: 'p.Arg175H', impact: 'High', phenotypes: ['Li-Fraumeni'], severity: 0.95 }
      ]
    } as PatientCase;
  }
);

// 3. NEW: Fetch AI Analysis
export const fetchAIAnalysis = createAsyncThunk(
  'genomics/fetchAIAnalysis',
  async (variant: Variant) => {
    // Simulate API call to FastAPI/Databricks
    await new Promise(r => setTimeout(r, 1500));
    return {
      id: variant.id,
      text: `ACMG Classification: Pathogenic. The ${variant.mutation} variant in ${variant.gene} shows high clinical significance based on population frequency. Strongly associated with ${variant.phenotypes.join(', ')}.`
    };
  }
);

export const genomicsSlice = createSlice({
  name: 'genomics',
  initialState,
  reducers: {
    selectVariant: (state, action: PayloadAction<Variant | null>) => {
      state.selectedVariant = action.payload;
    },
    clearCache: (state) => {
      state.casesCache = {};
      state.aiAnalyses = {};
    }
  },
  extraReducers: (builder) => {
    builder
      // Index fetch
      .addCase(fetchPatientIndex.fulfilled, (state, action) => {
        state.patientIndex = action.payload;
      })
      // Case fetch
      .addCase(fetchPatientCase.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPatientCase.fulfilled, (state, action) => {
        state.activeCaseId = action.payload.id;
        state.casesCache[action.payload.id] = action.payload;
        state.status = 'succeeded';
      })
      // AI Analysis fetch
      .addCase(fetchAIAnalysis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAIAnalysis.fulfilled, (state, action) => {
        state.aiAnalyses[action.payload.id] = action.payload.text;
        state.status = 'succeeded';
      });
  }
});

export const { selectVariant, clearCache } = genomicsSlice.actions;
export default genomicsSlice.reducer;