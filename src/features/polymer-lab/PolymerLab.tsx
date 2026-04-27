import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, Link2 } from 'lucide-react';
import Scene from './components/Scene';
import MonomerSelector from './components/MonomerSelector';
import { MONOMERS } from '../../data/monomers';

const PolymerLab: React.FC = () => {
  const [selectedMonomerId, setSelectedMonomerId] = useState<string>(MONOMERS[0].id);
  const [progress, setProgress] = useState(0);
  const [showIMFs, setShowIMFs] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectedMonomer = useMemo(() => 
    MONOMERS.find(m => m.id === selectedMonomerId) || MONOMERS[0]
  , [selectedMonomerId]);

  // Handle animation play
  React.useEffect(() => {
    let animationFrame: number;
    if (isPlaying) {
      const step = () => {
        setProgress(p => {
          if (p >= 1) {
            setIsPlaying(false);
            return 1;
          }
          return p + 0.005; // speed
        });
        animationFrame = requestAnimationFrame(step);
      };
      animationFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const handleSelectMonomer = (id: string) => {
    setSelectedMonomerId(id);
    setProgress(0);
    setShowIMFs(false);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    setShowIMFs(false);
  };

  return (
    <div className="absolute inset-0 bg-science-900">
      
      {/* Background 3D Viewer */}
      <div className="absolute inset-0">
         <Scene 
           monomer={selectedMonomer} 
           polymerizationProgress={progress} 
           showIMFs={showIMFs} 
         />
         
         {/* Dynamic Title Overlay */}
         <div className="absolute top-6 right-6 z-10 bg-science-900/80 backdrop-blur px-5 py-3 rounded-xl border border-science-700/50 shadow-xl">
             <span className="font-bold text-white text-lg">
               {progress < 0.5 ? selectedMonomer.name : selectedMonomer.polymerName}
             </span>
             {' '}
             <span className="ml-3 text-sm text-slate-400 font-mono">
              {progress < 0.5 ? selectedMonomer.formula : selectedMonomer.repeatUnitFormula}
             </span>
           </div>
         
         {/* Instructions Overlay */}
         <div className="absolute bottom-24 right-6 z-10 text-xs text-slate-500 bg-science-900/80 px-3 py-1.5 rounded backdrop-blur pointer-events-none border border-science-800">
           Drag to rotate • Scroll to zoom
         </div>
      </div>

      {/* Floating Controls Window */}
      <div className="absolute top-6 left-6 w-[340px] flex flex-col gap-4 z-10 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
        <div className="glass-card p-5 shadow-2xl">
           <MonomerSelector 
             selectedMonomerId={selectedMonomerId} 
             onSelect={handleSelectMonomer} 
           />
        </div>

        <div className="glass-card p-5 shadow-2xl">
           <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Reaction Control</h4>
            
            <div className="space-y-5">
             {/* Slider */}
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Monomers</span>
                  <span>Polymer Chain</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="1" 
                 step="0.01"
                 value={progress} 
                 onChange={(e) => {
                    setProgress(parseFloat(e.target.value));
                    setIsPlaying(false);
                 }}
                 className="w-full accent-emerald-500 h-2 bg-science-800 rounded-lg appearance-none cursor-pointer"
               />
             </div>

             {/* Buttons */}
             <div className="flex gap-2">
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 disabled={progress >= 1}
                 className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Play className="w-4 h-4" />
                 {isPlaying ? 'Pause' : 'Polymerize'}
               </button>
               <button 
                 onClick={handleReset}
                 className="flex items-center justify-center p-2.5 rounded-lg bg-science-800 border border-science-700 hover:bg-science-700 text-slate-300 transition-colors"
               >
                 <RotateCcw className="w-5 h-5" />
               </button>
             </div>
             
             {/* IMF Toggle */}
             <button
                onClick={() => setShowIMFs(!showIMFs)}
                disabled={progress < 0.8}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border font-medium transition-colors ${
                   progress < 0.8 ? 'opacity-50 cursor-not-allowed border-science-800 text-slate-600' :
                   showIMFs ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-science-800 border-science-700 text-slate-300 hover:bg-science-700'
                }`}
             >
                <Link2 className="w-4 h-4" />
                {showIMFs ? 'Hide Intermolecular Forces' : 'View Intermolecular Forces'}
              </button>
              <div className="rounded-lg border border-science-700 bg-science-900/60 p-3 text-xs leading-relaxed text-slate-300">
                <div><span className="text-slate-500">Repeat unit:</span> <span className="font-mono text-emerald-300">{selectedMonomer.repeatUnitFormula}</span></div>
                <div className="mt-1">{selectedMonomer.imfSummary}</div>
                <div className="mt-2 text-slate-500">
                  Simplified model: the C=C pi bond opens during addition polymerization; initiators, stereochemistry, and exact bond angles are not shown.
                </div>
              </div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default PolymerLab;
