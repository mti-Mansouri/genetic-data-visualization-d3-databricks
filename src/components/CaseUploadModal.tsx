import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type{ AppDispatch } from '../app/store';
import { fetchPatientIndex } from '../features/genomics/genomicsSlice';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CaseUploadModal({ isOpen, onClose }: ModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleUpload = async () => {
    setIsUploading(true);
    
    // SIMULATE BACKEND PROCESSING:
    // 1. Send file to FastAPI
    // 2. FastAPI parses VCF and saves to Supabase
    // 3. Return success
    await new Promise(r => setTimeout(r, 2500)); 
    
    setIsUploading(false);
    onClose();
    
    // REFRESH SIDEBAR:
    // Since we added a new patient, we tell Redux to re-fetch the index
    dispatch(fetchPatientIndex());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl overflow-hidden"
          >
            {isUploading && (
              <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-full h-full bg-pin-red"
                  />
                </div>
                <h3 className="text-xl font-black italic tracking-tighter mb-2">Processing Sequence...</h3>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Cross-referencing with ClinVar & gnomAD</p>
              </div>
            )}

            <h3 className="text-3xl font-black tracking-tighter mb-2">Import Case</h3>
            <p className="text-gray-400 text-sm mb-10 font-medium">Upload a VCF or CSV file to start the clinical interpretation.</p>
            
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              className={`border-2 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center transition-all cursor-pointer
                ${dragActive ? 'border-pin-red bg-pin-red/5' : 'border-gray-100 bg-gray-50'}`}
            >
              <div className="text-4xl mb-4">🧬</div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Drop sequencing data here</p>
              <input type="file" className="hidden" id="vcf-upload" onChange={handleUpload} />
              <label htmlFor="vcf-upload" className="mt-6 px-8 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-pin-red transition-colors">
                Select File
              </label>
            </div>

            <div className="mt-10 flex justify-between items-center">
               <p className="text-[9px] text-gray-300 font-bold uppercase w-1/2">Files are processed securely and compliant with HIPAA data standards.</p>
               <button onClick={onClose} className="text-xs font-bold text-gray-400 hover:text-pin-red transition-colors uppercase tracking-widest">Cancel</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}