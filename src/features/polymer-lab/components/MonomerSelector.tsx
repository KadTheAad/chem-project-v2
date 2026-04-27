import React from 'react';
import { MONOMERS } from '../../../data/monomers';

interface MonomerSelectorProps {
  selectedMonomerId: string;
  onSelect: (id: string) => void;
}

const MonomerSelector: React.FC<MonomerSelectorProps> = ({ selectedMonomerId, onSelect }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Select Monomer</h4>
      <div className="flex flex-col gap-2">
        {MONOMERS.map(monomer => (
          <button
            key={monomer.id}
            onClick={() => onSelect(monomer.id)}
            className={`text-left p-3 rounded-lg border transition-all ${
              selectedMonomerId === monomer.id
                ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                : 'bg-science-800 border-science-700 hover:bg-science-700'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`font-bold ${selectedMonomerId === monomer.id ? 'text-emerald-400' : 'text-slate-200'}`}>
                {monomer.name}
              </span>
              <span className="font-mono text-xs text-slate-500 bg-science-900 px-2 py-0.5 rounded">
                {monomer.formula}
              </span>
            </div>
             {selectedMonomerId === monomer.id && (
               <div className="mt-2 space-y-1 text-xs leading-relaxed text-slate-300">
                 <p>{monomer.description}</p>
                 <p><span className="text-slate-500">Polymer:</span> {monomer.polymerName}</p>
               </div>
             )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonomerSelector;
