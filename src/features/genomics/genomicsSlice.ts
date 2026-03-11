import { createSlice,type  PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {type Variant, mockVariants } from '../../api/mockData';

interface GenomicsState {
  variants: Variant[];
  selectedVariant: Variant | null;
  aiAnalyses: Record<string, string>; // CACHE: Maps Variant ID to Analysis Text
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: GenomicsState = {
  variants: mockVariants,
  selectedVariant: null,
  aiAnalyses: {},
  status: 'idle',
};

export const fetchAIAnalysis = createAsyncThunk(
  'genomics/fetchAIAnalysis',
  async (variant: Variant) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      id: variant.id,
      text: `Analysis for ${variant.gene} (${variant.mutation}): This variant is classified under ACMG guidelines as ${variant.impact === 'High' ? 'Pathogenic' : 'Uncertain'}. Strong clinical evidence suggests correlation with ${variant.phenotypes.join(', ')}.`
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIAnalysis.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAIAnalysis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Save the result to our dictionary cache using the variant ID
        state.aiAnalyses[action.payload.id] = action.payload.text; 
      });
  },
});

export const { selectVariant } = genomicsSlice.actions;
export default genomicsSlice.reducer;