import React from 'react';
import type { MaterialType } from './ChainModel';

interface MaterialConfig {
  id: MaterialType;
  name: string;
  imfType: string;
  imfStrength: string;
  properties: string;
  color: string;
}

const MATERIALS: MaterialConfig[] = [
  {
    id: 'polyethene',
    name: 'Polyethene',
    imfType: 'London Dispersion Forces',
    imfStrength: 'Weak',
    properties: 'Flexible and moldable, with a comparatively low softening/melting range. Nonpolar chains can slide past each other relatively easily because their main attractions are weak temporary dipoles.',
    color: 'bg-slate-500'
  },
  {
    id: 'pvc',
    name: 'Poly(chloroethene) / PVC',
    imfType: 'Dipole-dipole plus dispersion',
    imfStrength: 'Medium',
    properties: 'Unplasticized PVC is rigid and durable. Polar C-Cl bonds create permanent dipoles, adding stronger interchain attractions to the dispersion forces present in all polymers.',
    color: 'bg-emerald-500'
  },
  {
    id: 'kevlar',
    name: 'Kevlar',
    imfType: 'Hydrogen Bonding',
    imfStrength: 'Strong',
    properties: 'Extremely high tensile strength and rigidity. Hydrogen bonding between amide groups, plus rigid aromatic chains, helps hold aligned chains together; Kevlar decomposes rather than melting cleanly.',
    color: 'bg-amber-500'
  }
];

interface MaterialSelectorProps {
  selectedId: MaterialType;
  onSelect: (id: MaterialType) => void;
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {MATERIALS.map(mat => (
          <button
            key={mat.id}
            onClick={() => onSelect(mat.id)}
            className={`p-3 rounded-lg border text-center transition-all ${
              selectedId === mat.id
                ? 'bg-science-700 border-science-500 shadow-lg scale-[1.02]'
                : 'bg-science-800 border-science-700 hover:bg-science-700/80'
            }`}
          >
            <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${mat.color} ${selectedId === mat.id ? 'shadow-[0_0_10px_currentColor]' : ''}`} />
            <span className={`text-sm font-bold block ${selectedId === mat.id ? 'text-white' : 'text-slate-400'}`}>
              {mat.name}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-science-900/50 p-4 rounded-xl border border-science-700/50 mt-4 min-h-[160px]">
        {MATERIALS.map(mat => (
          <div key={mat.id} className={selectedId === mat.id ? 'block' : 'hidden'}>
             <h4 className="text-lg font-bold text-white mb-2">{mat.name}</h4>
             
             <div className="flex gap-4 mb-3">
               <div>
                  <span className="block text-xs text-slate-500 uppercase">Main Attractions</span>
                  <span className="text-sm text-blue-400 font-medium">{mat.imfType}</span>
               </div>
               <div>
                  <span className="block text-xs text-slate-500 uppercase">Strength</span>
                  <span className={`text-sm font-bold ${
                    mat.imfStrength === 'Weak' ? 'text-slate-400' :
                    mat.imfStrength === 'Medium' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>{mat.imfStrength}</span>
               </div>
             </div>

             <p className="text-sm text-slate-300 leading-relaxed">
               {mat.properties}
             </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialSelector;
