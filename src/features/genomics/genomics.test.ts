import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import genomicsReducer, { fetchAIAnalysis, selectVariant } from './genomicsSlice';

const mockVariant = {
  id: 'v-test-1',
  gene: 'BRCA1',
  mutation: 'c.5266dup',
  impact: 'High' as const,
  phenotypes: ['Breast Cancer'],
  severity: 0.9
};

describe('Genomics Redux Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { genomics: genomicsReducer },
    });
  });

  it('should set the initial state correctly', () => {
    const state = store.getState().genomics;
    
    expect(state.patientIndex).toHaveLength(0);
    expect(Object.keys(state.casesCache)).toHaveLength(0);
    expect(state.activeCaseId).toBeNull();
    expect(state.selectedVariant).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('should update selectedVariant when a user clicks a node', () => {
    store.dispatch(selectVariant(mockVariant));
    
    const state = store.getState().genomics;
    expect(state.selectedVariant?.gene).toBe(mockVariant.gene);
    expect(state.aiAnalyses[mockVariant.id]).toBeUndefined(); 
  });

  it('should handle the AI analysis lifecycle (Pending -> Fulfilled)', async () => {
    const promise = store.dispatch(fetchAIAnalysis(mockVariant));
    
    expect(store.getState().genomics.status).toBe('loading');
    
    await promise;
    
    const state = store.getState().genomics;
    const analysisResult = state.aiAnalyses[mockVariant.id];
    
    expect(state.status).toBe('succeeded');
    expect(analysisResult).toBeDefined(); 
    expect(analysisResult).toContain(mockVariant.gene);
    expect(analysisResult).toContain('ACMG');
  });
});