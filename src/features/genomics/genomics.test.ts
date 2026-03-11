import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import genomicsReducer, { fetchAIAnalysis, selectVariant } from './genomicsSlice';
import { mockVariants } from '../../api/mockData';

describe('Genomics Redux Slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: { genomics: genomicsReducer },
    });
  });

  it('should set the initial state correctly', () => {
    const state = store.getState().genomics;
    expect(state.variants).toHaveLength(mockVariants.length);
    expect(state.selectedVariant).toBeNull();
    expect(state.status).toBe('idle');
  });

  it('should update selectedVariant when a user clicks a node', () => {
    const variant = mockVariants[0];
    store.dispatch(selectVariant(variant));
    
    const state = store.getState().genomics;
    expect(state.selectedVariant?.gene).toBe(variant.gene);
    expect(state.aiAnalysis).toBeNull(); // Should reset analysis on new selection
  });

  it('should handle the AI analysis lifecycle (Pending -> Fulfilled)', async () => {
    const variant = mockVariants[0];
    
    // 1. Dispatch the "AI Fetch"
    const promise = store.dispatch(fetchAIAnalysis(variant));
    
    // 2. Check "Loading" state immediately
    expect(store.getState().genomics.status).toBe('loading');
    
    // 3. Wait for the mock timer to finish
    await promise;
    
    // 4. Check "Succeeded" state and data
    const state = store.getState().genomics;
    expect(state.status).toBe('succeeded');
    expect(state.aiAnalysis).toContain(variant.gene);
    expect(state.aiAnalysis).toContain('ACMG');
  });
});