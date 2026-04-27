import React, { useState } from 'react';
import ChainModel from './components/ChainModel';
import type { MaterialType } from './components/ChainModel';
import MaterialSelector from './components/MaterialSelector';

const IMFViewer: React.FC = () => {
  const [material, setMaterial] = useState<MaterialType>('polyethene');

  return (
    <div className="absolute inset-0 bg-science-900">
      
      {/* Background 3D Viewer */}
      <div className="absolute inset-0">
        <ChainModel materialType={material} />

        {/* Legend */}
        <div className="absolute bottom-24 right-6 z-10 bg-science-900/80 backdrop-blur p-4 rounded-xl border border-science-700/50 text-xs text-slate-300 space-y-3 shadow-xl">
           <div className="font-bold text-white mb-2 border-b border-science-700 pb-1">Visual Guide</div>
           <div className="flex items-center gap-3">
              <div className="w-6 h-1 bg-slate-400 rounded-full"></div> 
              <span>Polymer Backbone</span>
           </div>
           <div className="flex items-center gap-3 opacity-80">
              <div className="w-6 border-b-2 border-dashed border-slate-300"></div> 
               <span>London Dispersion Forces</span>
           </div>
           <div className="flex items-center gap-3 opacity-80">
              <div className="w-6 border-b-2 border-dashed border-teal-400"></div> 
              <span>Dipole-Dipole Forces</span>
           </div>
           <div className="flex items-center gap-3 opacity-80">
              <div className="w-6 border-b-2 border-red-500"></div> 
               <span>Hydrogen Bonding</span>
           </div>
        </div>
      </div>

      {/* Floating Controls Window */}
      <div className="absolute top-6 left-6 w-[340px] z-10 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar glass-card p-5 shadow-2xl">
         <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Compare Forces</h4>
         <MaterialSelector selectedId={material} onSelect={setMaterial} />
         <p className="mt-4 rounded-lg border border-science-700 bg-science-900/60 p-3 text-xs leading-relaxed text-slate-500">
           All molecular substances have London dispersion forces. The colored links emphasize additional or especially important interchain attractions in this simplified model.
         </p>
      </div>

    </div>
  );
};

export default IMFViewer;
