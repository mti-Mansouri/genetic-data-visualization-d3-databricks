import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchAIAnalysis, selectVariant } from '../features/genomics/genomicsSlice';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsightsPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedVariant, aiAnalyses, status } = useSelector((state: RootState) => state.genomics);

  if (!selectedVariant) return null;

  // Retrieve cached analysis for this specific variant
  const currentAnalysis = aiAnalyses[selectedVariant.id];

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
        // Added mobile responsive width (w-full md:w-[450px])
        className="absolute top-0 right-0 bottom-0 w-full md:w-[450px] z-50 p-4 md:p-6 pointer-events-auto"
      >
        <div className="h-full bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          
          <div className="p-6 md:p-10 pb-4 md:pb-6 flex justify-between items-start bg-white z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-pin-charcoal tracking-tighter">{selectedVariant.gene}</h2>
              <p className="text-pin-red font-mono font-bold mt-1 uppercase tracking-widest">{selectedVariant.mutation}</p>
            </div>
            <button 
              onClick={() => dispatch(selectVariant(null))} 
              className="bg-gray-100 p-3 rounded-full hover:bg-pin-red hover:text-white transition-all text-gray-500 shadow-sm"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 md:px-10 pb-10 space-y-6 md:space-y-8">
            
            {/* Show button ONLY if we don't have a cached analysis and aren't loading */}
            {!currentAnalysis && status !== 'loading' && (
              <button 
                onClick={() => dispatch(fetchAIAnalysis(selectedVariant))}
                className="w-full bg-pin-red text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-pin-dark-red transition-all shadow-xl shadow-red-500/20"
              >
                🚀 Run AI Interpretation
              </button>
            )}

            <div className="bg-pin-charcoal rounded-[2rem] p-6 md:p-8 text-white min-h-[150px] md:min-h-[200px]">
              {status === 'loading' && !currentAnalysis ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-2 bg-white/20 rounded-full w-full"></div>
                  <div className="h-2 bg-white/20 rounded-full w-3/4"></div>
                  <p className="text-pin-red text-[10px] font-black uppercase mt-6">Decoding Genomics...</p>
                </div>
              ) : currentAnalysis ? (
                <p className="text-sm leading-relaxed text-gray-300 font-medium">{currentAnalysis}</p>
              ) : (
                <p className="text-sm text-gray-500 italic text-center">Ready for clinical synthesis...</p>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}