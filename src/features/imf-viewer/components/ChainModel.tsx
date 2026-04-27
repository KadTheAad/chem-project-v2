import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

export type MaterialType = 'polyethene' | 'pvc' | 'kevlar';

interface ChainModelProps {
  materialType: MaterialType;
}

const CHAIN_COUNT = 3;
const SEGMENTS_PER_CHAIN = 20;
const CHAIN_SPACING = 1.5;

// Generates a simple wavy line to represent a polymer chain
const generateChainPoints = (yOffset: number, isRigid: boolean, phaseOffset: number) => {
  const points = [];
  const amplitude = isRigid ? 0.1 : 0.4;
  const frequency = isRigid ? 0.5 : 1.5;

  for (let i = 0; i <= SEGMENTS_PER_CHAIN; i++) {
    const x = (i - SEGMENTS_PER_CHAIN / 2) * 0.5;
    // Abstract representation of a backbone
    const y = yOffset + Math.sin(x * frequency + phaseOffset) * amplitude;
    const z = isRigid ? 0 : Math.cos(x * frequency * 0.8 + phaseOffset) * amplitude * 0.5;
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
};

// Generates connection lines between chains to represent IMFs
const generateIMFLines = (
    chains: THREE.Vector3[][], 
    strength: 'weak' | 'medium' | 'strong'
) => {
    const lines = [];
    const connectionCount = strength === 'weak' ? 5 : strength === 'medium' ? 10 : 18;
    
    for (let c = 0; c < chains.length - 1; c++) {
        const topChain = chains[c];
        const bottomChain = chains[c + 1];
        
        for (let i = 0; i < connectionCount; i++) {
            // Pick somewhat matching points along the chains
            const idx = Math.floor((i / connectionCount) * (SEGMENTS_PER_CHAIN - 2)) + 1;
            
            // Add a little randomness
            const offsetIdx = Math.max(0, Math.min(SEGMENTS_PER_CHAIN, idx + (Math.floor(Math.random() * 3) - 1)));
            
            lines.push([topChain[idx].toArray(), bottomChain[offsetIdx].toArray()]);
        }
    }
    return lines;
}

const DynamicChains: React.FC<{ materialType: MaterialType }> = ({ materialType }) => {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);

  const isRigid = materialType === 'kevlar';
  const isSemiRigid = materialType === 'pvc';
  
  // Create base geometry points
  const baseChains = useMemo(() => {
    const chains = [];
    for (let i = 0; i < CHAIN_COUNT; i++) {
      const yOffset = (1 - i) * CHAIN_SPACING;
      // Kevlar is straight/aligned, others are wavy
      chains.push(generateChainPoints(yOffset, isRigid || isSemiRigid, i * Math.PI / 2));
    }
    return chains;
  }, [isRigid, isSemiRigid]);

  // Generate IMFs
  const imfLines = useMemo(() => {
     let strength: 'weak' | 'medium' | 'strong' = 'weak';
     if (materialType === 'pvc') strength = 'medium';
     if (materialType === 'kevlar') strength = 'strong';
     
     return generateIMFLines(baseChains, strength);
  }, [baseChains, materialType]);

  // Determine styles
  const chainColor = materialType === 'kevlar' ? '#fcd34d' : materialType === 'pvc' ? '#4ade80' : '#94a3b8';
  const chainWidth = materialType === 'kevlar' ? 4 : 2;
  
  const imfColor = materialType === 'kevlar' ? '#ef4444' : materialType === 'pvc' ? '#2dd4bf' : '#cbd5e1';
  const imfOpacity = materialType === 'kevlar' ? 0.8 : materialType === 'pvc' ? 0.5 : 0.2;
  const imfDash = materialType === 'kevlar' ? false : true;

  // Animate chains for non-rigid materials
  useFrame((_, delta) => {
    time.current += delta;
    if (!groupRef.current || isRigid) return;

    // We can't easily animate the dre/Line points dynamically without re-rendering,
    // so we'll just add a slight wobble to the whole group to represent flexibility
    const wobbleSpeed = isSemiRigid ? 0.5 : 2;
    const wobbleAmount = isSemiRigid ? 0.05 : 0.15;
    
    groupRef.current.position.y = Math.sin(time.current * wobbleSpeed) * wobbleAmount;
    groupRef.current.position.z = Math.cos(time.current * wobbleSpeed * 0.8) * wobbleAmount;
  });

  return (
    <group ref={groupRef}>
      {/* Render Chains */}
      {baseChains.map((points, i) => (
        <Line 
          key={`chain-${i}`}
          points={points}
          color={chainColor}
          lineWidth={chainWidth}
        />
      ))}
      
      {/* Render IMFs */}
      {imfLines.map((linePts, i) => (
         <Line 
           key={`imf-${i}`}
           points={linePts}
           color={imfColor}
           lineWidth={1}
           transparent
           opacity={imfOpacity}
           dashed={imfDash}
           dashSize={0.2}
           gapSize={0.1}
         />
      ))}
    </group>
  );
};

const ChainModel: React.FC<ChainModelProps> = ({ materialType }) => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={1} />
        
        <DynamicChains materialType={materialType} />

        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
};

export default ChainModel;
