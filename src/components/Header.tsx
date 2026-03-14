import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { selectVariant } from '../features/genomics/genomicsSlice';
import type { Variant } from '../types/genomics'; // FIX: Imported the Variant type

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  
  // FIX: Safely extract variants from the currently active case in the cache
  const { activeCaseId, casesCache } = useSelector((state: RootState) => state.genomics);
  const activeCase = activeCaseId ? casesCache[activeCaseId] : null;
  const variants: Variant[] = activeCase ? activeCase.variants : [];

  const filteredResults = searchTerm 
    ? variants.filter((v: Variant) => // FIX: Added type to 'v'
        v.gene.toLowerCase().includes(searchTerm.toLowerCase()) || 
        v.mutation.toLowerCase().includes(searchTerm.toLowerCase())
      ) 
    : [];

  return (
    <header className="mb-6 md:mb-8 flex justify-start items-center z-10 w-full">
      <div className="relative w-full md:w-96">
        <div className="group relative">
          <input 
            type="text"
            placeholder="Search genes, variants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-transparent py-3 px-6 rounded-2xl shadow-sm focus:outline-none focus:border-pin-red/20 focus:ring-4 focus:ring-pin-red/5 transition-all duration-300 text-sm font-medium"
          />
          <div className="absolute right-4 top-3.5 text-gray-300 group-focus-within:text-pin-red transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {filteredResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            {filteredResults.map((v: Variant) => ( // FIX: Added type to 'v'
              <div 
                key={v.id}
                onClick={() => {
                  dispatch(selectVariant(v));
                  setSearchTerm('');
                }}
                className="px-6 py-4 hover:bg-pin-gray/50 cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <p className="font-bold text-pin-charcoal group-hover:text-pin-red transition-colors">{v.gene}</p>
                  <p className="text-[10px] text-gray-400 font-mono uppercase mt-0.5">{v.mutation}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${v.impact === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  {v.impact}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}