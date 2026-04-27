export interface AtomData {
  element: 'C' | 'H' | 'Cl' | 'F' | 'O' | 'N';
  position: [number, number, number];
}

export interface BondData {
  from: number; // index in atoms array
  to: number;   // index in atoms array
  type: 'single' | 'double';
}

export interface MonomerConfig {
  id: string;
  name: string;
  polymerName: string;
  description: string;
  formula: string;
  repeatUnitFormula: string;
  imfSummary: string;
  atoms: AtomData[];
  bonds: BondData[];
  // Metadata for the polymerization animation
  doubleBondIndex: number; 
}

// Common atom colors for Three.js
export const ATOM_COLORS = {
  C: '#333333', // Dark Grey
  H: '#FFFFFF', // White
  Cl: '#4ADE80', // Green
  F: '#60A5FA', // Light Blue
  O: '#EF4444', // Red
  N: '#3B82F6', // Blue
};

export const ATOM_RADII = {
  C: 0.77,
  H: 0.37,
  Cl: 0.99,
  F: 0.71,
  O: 0.73,
  N: 0.75,
};

export const MONOMERS: MonomerConfig[] = [
  {
    id: 'ethene',
    name: 'Ethene',
    polymerName: 'Polyethene (PE)',
    formula: 'C₂H₄',
    repeatUnitFormula: '[-CH₂-CH₂-]ₙ',
    imfSummary: 'Nonpolar chains: mainly London dispersion forces.',
    description: 'The simplest alkene. In addition polymerization, the C=C pi bond opens so ethene units join into polyethene, a flexible plastic used in bags and packaging.',
    doubleBondIndex: 0,
    atoms: [
      { element: 'C', position: [-0.6, 0, 0] },
      { element: 'C', position: [0.6, 0, 0] },
      { element: 'H', position: [-1.2, 0.8, 0] },
      { element: 'H', position: [-1.2, -0.8, 0] },
      { element: 'H', position: [1.2, 0.8, 0] },
      { element: 'H', position: [1.2, -0.8, 0] },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' },
      { from: 1, to: 4, type: 'single' },
      { from: 1, to: 5, type: 'single' },
    ]
  },
  {
    id: 'chloroethene',
    name: 'Chloroethene',
    polymerName: 'Poly(chloroethene) / PVC',
    formula: 'C₂H₃Cl',
    repeatUnitFormula: '[-CH₂-CHCl-]ₙ',
    imfSummary: 'Polar C-Cl bonds: dipole-dipole attractions plus dispersion.',
    description: 'Contains a polar C-Cl bond. It forms poly(chloroethene), or PVC; unplasticized PVC is relatively rigid because polar attractions restrict chain movement.',
    doubleBondIndex: 0,
    atoms: [
      { element: 'C', position: [-0.6, 0, 0] },
      { element: 'C', position: [0.6, 0, 0] },
      { element: 'H', position: [-1.2, 0.8, 0] },
      { element: 'H', position: [-1.2, -0.8, 0] },
      { element: 'Cl', position: [1.4, 0.8, 0] }, // Chlorine atom
      { element: 'H', position: [1.2, -0.8, 0] },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' },
      { from: 1, to: 4, type: 'single' },
      { from: 1, to: 5, type: 'single' },
    ]
  },
  {
    id: 'tetrafluoroethene',
    name: 'Tetrafluoroethene',
    polymerName: 'Polytetrafluoroethene (PTFE)',
    formula: 'C₂F₄',
    repeatUnitFormula: '[-CF₂-CF₂-]ₙ',
    imfSummary: 'Very symmetrical chains: interchain attractions are dominated by dispersion.',
    description: 'All hydrogens are replaced by fluorine. It forms PTFE, a chemically resistant, low-friction polymer; the chain is highly symmetrical even though C-F bonds are polar.',
    doubleBondIndex: 0,
    atoms: [
      { element: 'C', position: [-0.6, 0, 0] },
      { element: 'C', position: [0.6, 0, 0] },
      { element: 'F', position: [-1.2, 0.8, 0] },
      { element: 'F', position: [-1.2, -0.8, 0] },
      { element: 'F', position: [1.2, 0.8, 0] },
      { element: 'F', position: [1.2, -0.8, 0] },
    ],
    bonds: [
      { from: 0, to: 1, type: 'double' },
      { from: 0, to: 2, type: 'single' },
      { from: 0, to: 3, type: 'single' },
      { from: 1, to: 4, type: 'single' },
      { from: 1, to: 5, type: 'single' },
    ]
  }
];
