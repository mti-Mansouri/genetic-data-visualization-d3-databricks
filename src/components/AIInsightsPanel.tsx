import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { selectVariant } from '../features/genomics/genomicsSlice';
// If you have fetchAIAnalysis in your slice (based on your test file), import it:
// import { fetchAIAnalysis } from '../features/genomics/genomicsSlice'; 
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsightsPanel() {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedVariant, aiAnalyses, status } = useSelector((state: RootState) => state.genomics);

  if (!selectedVariant) return null;

  const currentAnalysis = aiAnalyses[selectedVariant.id];

  const handleRunAnalysis = () => {
    // If you have the thunk from your genomics.test.ts, uncomment the import and use this:
    // dispatch(fetchAIAnalysis(selectedVariant));
    
    // For now, if the thunk isn't in your slice yet, you can add it to the slice later.
    console.log("Run AI Analysis for:", selectedVariant.id);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 120 }}
        className="absolute top-0 right-0 bottom-0 w-full md:w-[420px] z-50 p-4 md:p-6"
      >
        <div className="h-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
          <div className="p-8 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-pin-charcoal tracking-tighter">{selectedVariant.gene}</h2>
              <p className="text-pin-red font-mono font-bold text-xs uppercase">{selectedVariant.mutation}</p>
            </div>
            <button onClick={() => dispatch(selectVariant(null))} className="p-3 bg-gray-50 rounded-full hover:bg-pin-red hover:text-white transition-pinterest cursor-pointer">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6">
            <div className="bg-pin-charcoal rounded-[2rem] p-8 text-white min-h-[200px] flex flex-col justify-center">
              {status === 'loading' ? (
                <div className="space-y-4 animate-pulse">
                  <div className="h-2 bg-white/10 rounded-full w-full" />
                  <div className="h-2 bg-white/10 rounded-full w-2/3" />
                </div>
              ) : currentAnalysis ? (
                <p className="text-sm leading-relaxed text-gray-300 font-medium italic">"{currentAnalysis}"</p>
              ) : (
                <div className="text-center space-y-4">
                   <p className="text-xs text-gray-500 uppercase font-black tracking-widest">Awaiting Synthesis</p>
                   {/* FIX: Wired up the button click */}
                   <button 
                     onClick={handleRunAnalysis}
                     className="w-full bg-pin-red text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all cursor-pointer"
                   >
                     Request Interpretation
                   </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-pin-gray rounded-2xl">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">ClinVar Impact</p>
                <p className="text-xs font-bold">{selectedVariant.impact}</p>
              </div>
              <div className="p-4 bg-pin-gray rounded-2xl">
                <p className="text-[9px] font-black text-gray-400 uppercase mb-1">ACMG Score</p>
                <p className="text-xs font-bold">{(selectedVariant.severity * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}