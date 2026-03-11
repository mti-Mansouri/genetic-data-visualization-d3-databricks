// Sidebar.tsx
export default function Sidebar() {
  return (
    <aside className="w-24 bg-pin-charcoal flex flex-col items-center py-10 z-20 shadow-2xl">
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-16 shadow-lg">
        <div className="w-3 h-3 bg-pin-red rounded-full"></div>
      </div>
      
      {/* Visual Indicator of "Health" */}
      <div className="flex flex-col gap-1 items-center">
        <div className="w-1 h-8 bg-pin-red/20 rounded-full overflow-hidden">
          <div className="w-full h-1/2 bg-pin-red"></div>
        </div>
        <span className="text-[8px] font-bold text-gray-600 uppercase vertical-text mt-4">System Live</span>
      </div>
    </aside>
  );
}