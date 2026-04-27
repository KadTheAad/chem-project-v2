import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { ATOM_COLORS, ATOM_RADII } from '../../../data/monomers';
import type { AtomData, BondData, MonomerConfig } from '../../../data/monomers';

interface SceneProps {
  monomer: MonomerConfig;
  polymerizationProgress: number; // 0 to 1
  showIMFs: boolean;
}

const CHAIN_LENGTH = 5; // How many monomers to show in the chain
const MONOMER_SPACING = 3.6; // Base distance between separate monomers
const BACKBONE_SPACING = 1.15;
const SUBSTITUENT_DISTANCE = 0.95;

const SUBSTITUENTS_BY_MONOMER: Record<string, [AtomData['element'], AtomData['element']][]> = {
  ethene: [['H', 'H'], ['H', 'H']],
  chloroethene: [['H', 'H'], ['Cl', 'H']],
  tetrafluoroethene: [['F', 'F'], ['F', 'F']],
};

const Bond = ({
  start,
  end,
  color = '#9ca3af',
  radius = 0.08,
  opacity = 1,
}: {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  radius?: number;
  opacity?: number;
}) => {
  const p1 = new THREE.Vector3(...start);
  const p2 = new THREE.Vector3(...end);
  const distance = p1.distanceTo(p2);
  const position = p1.clone().add(p2).multiplyScalar(0.5);
  const orientation = new THREE.Matrix4();
  const offsetRotation = new THREE.Matrix4();
  orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
  offsetRotation.makeRotationX(Math.PI / 2);
  orientation.multiply(offsetRotation);
  const euler = new THREE.Euler().setFromRotationMatrix(orientation);

  return (
    <Cylinder args={[radius, radius, distance, 16]} position={position.toArray()} rotation={euler}>
      <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
    </Cylinder>
  );
};

const Atom = ({ element, position }: { element: AtomData['element']; position: [number, number, number] }) => (
  <Sphere args={[ATOM_RADII[element] * 0.42, 32, 32]} position={position}>
    <meshStandardMaterial color={ATOM_COLORS[element]} roughness={0.4} metalness={0.1} />
  </Sphere>
);

const Molecule = ({ atoms, bonds }: { atoms: AtomData[]; bonds: BondData[] }) => {
  return (
    <group>
      {bonds.map((bond, i) => {
        const fromAtom = atoms[bond.from];
        const toAtom = atoms[bond.to];
        const start = fromAtom.position;
        const end = toAtom.position;
        const offset: [number, number, number] = [0, 0, 0.09];

        if (bond.type === 'double') {
          return (
            <group key={`bond-${i}`}>
              <Bond
                start={[start[0], start[1], start[2] - offset[2]]}
                end={[end[0], end[1], end[2] - offset[2]]}
              />
              <Bond
                start={[start[0], start[1], start[2] + offset[2]]}
                end={[end[0], end[1], end[2] + offset[2]]}
              />
            </group>
          );
        }

        return <Bond key={`bond-${i}`} start={start} end={end} />;
      })}
      {atoms.map((atom, i) => (
        <Atom key={`atom-${i}`} element={atom.element} position={atom.position} />
      ))}
    </group>
  );
};

const MonomerSet = ({ monomer }: { monomer: MonomerConfig }) => (
  <group>
    {[-1, 0, 1].map((offset) => (
      <group key={offset} position={[offset * MONOMER_SPACING, 0, 0]}>
        <Molecule atoms={monomer.atoms} bonds={monomer.bonds} />
      </group>
    ))}
  </group>
);

const buildPolymerModel = (monomer: MonomerConfig): { atoms: AtomData[]; bonds: BondData[] } => {
  const substituents = SUBSTITUENTS_BY_MONOMER[monomer.id] ?? SUBSTITUENTS_BY_MONOMER.ethene;
  const atoms: AtomData[] = [];
  const bonds: BondData[] = [];
  const backboneCount = CHAIN_LENGTH * 2;
  const firstX = -((backboneCount - 1) * BACKBONE_SPACING) / 2;

  for (let i = 0; i < backboneCount; i++) {
    const x = firstX + i * BACKBONE_SPACING;
    const y = i % 2 === 0 ? 0.08 : -0.08;
    const backboneIndex = atoms.length;
    atoms.push({ element: 'C', position: [x, y, 0] });

    if (i > 0) {
      bonds.push({ from: backboneIndex - 3, to: backboneIndex, type: 'single' });
    }

    const unitCarbonIndex = i % 2;
    const [topElement, bottomElement] = substituents[unitCarbonIndex];
    const topIndex = atoms.length;
    atoms.push({ element: topElement, position: [x, y + SUBSTITUENT_DISTANCE, unitCarbonIndex === 0 ? 0.18 : -0.18] });
    bonds.push({ from: backboneIndex, to: topIndex, type: 'single' });

    const bottomIndex = atoms.length;
    atoms.push({ element: bottomElement, position: [x, y - SUBSTITUENT_DISTANCE, unitCarbonIndex === 0 ? -0.18 : 0.18] });
    bonds.push({ from: backboneIndex, to: bottomIndex, type: 'single' });
  }

  return { atoms, bonds };
};

const PolymerChain = ({ monomer, yOffset = 0 }: { monomer: MonomerConfig; yOffset?: number }) => {
  const model = useMemo(() => buildPolymerModel(monomer), [monomer]);
  const firstCarbon = model.atoms[0].position;
  const lastCarbon = model.atoms[(CHAIN_LENGTH * 2 - 1) * 3].position;

  return (
    <group position={[0, yOffset, 0]}>
      <Bond start={[firstCarbon[0] - 0.8, firstCarbon[1], firstCarbon[2]]} end={firstCarbon} opacity={0.35} />
      <Bond start={lastCarbon} end={[lastCarbon[0] + 0.8, lastCarbon[1], lastCarbon[2]]} opacity={0.35} />
      <Molecule atoms={model.atoms} bonds={model.bonds} />
    </group>
  );
};

const IMF_LINES = {
  ethene: { color: '#cbd5e1', opacity: 0.22 },
  chloroethene: { color: '#4ade80', opacity: 0.5 },
  tetrafluoroethene: { color: '#cbd5e1', opacity: 0.25 },
};

const IMFOverlay = ({ monomer }: { monomer: MonomerConfig }) => {
  const style = IMF_LINES[monomer.id as keyof typeof IMF_LINES] ?? IMF_LINES.ethene;

  return (
    <group>
      {Array.from({ length: CHAIN_LENGTH }).map((_, i) => {
        const x = (i - (CHAIN_LENGTH - 1) / 2) * BACKBONE_SPACING * 2;
        return (
          <Bond
            key={`imf-${i}`}
            start={[x, -0.7, 0.45]}
            end={[x, -2.05, 0.45]}
            color={style.color}
            radius={0.025}
            opacity={style.opacity}
          />
        );
      })}
    </group>
  );
};

const Scene: React.FC<SceneProps> = ({ monomer, polymerizationProgress, showIMFs }) => {
  const isPolymer = polymerizationProgress >= 0.5;

  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Environment preset="city" />

      <group position={[0, showIMFs && isPolymer ? 1.1 : 0, 0]}>
        {isPolymer ? <PolymerChain monomer={monomer} /> : <MonomerSet monomer={monomer} />}
        {showIMFs && isPolymer && (
          <>
            <PolymerChain monomer={monomer} yOffset={-2.8} />
            <IMFOverlay monomer={monomer} />
          </>
        )}
      </group>

      <OrbitControls 
        enablePan={false} 
        minDistance={3} 
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </Canvas>
  );
};

export default Scene;
