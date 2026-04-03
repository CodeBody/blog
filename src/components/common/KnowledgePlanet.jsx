import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

function GalaxyNode({ id, name, position, color, ...props }) {
  const navigate = useNavigate();
  const [hovered, setHover] = useState(false);
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      // Keep text facing camera
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <group position={position} {...props}>
      {/* The Core Planet Sphere */}
      <mesh 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
        onClick={() => navigate(`/category/${id}`)}
        castShadow
      >
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : color} 
          emissive={hovered ? "#ffffff" : color}
          emissiveIntensity={hovered ? 0.8 : 0.4}
          roughness={0.1}
          metalness={0.9}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Internal "Core" Glow */}
      <mesh scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : color} transparent opacity={0.2} />
      </mesh>
      
      <Suspense fallback={null}>
        <Text
          ref={textRef}
          fontSize={0.45}
          maxWidth={3.2}
          textAlign="center"
          position={[0, 0, 0]}
          color="white"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor={hovered ? color : "#000000"}
          depthTest={false}
        >
          {name}
        </Text>
      </Suspense>

      {hovered && (
        <group>
            {/* Outer Protective Shell / Aura */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[1.8, 32, 32]} />
                <meshBasicMaterial color={color} transparent opacity={0.2} />
            </mesh>
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[1.85, 48, 48]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
            </mesh>
        </group>
      )}
    </group>
  );
}

function ParticleGalaxy() {
  const pointsRef = useRef();
  const count = 4000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const colorChoices = [
      new THREE.Color("#4f46e5"), // Indigo
      new THREE.Color("#7c3aed"), // Purple
      new THREE.Color("#0ea5e9"), // Sky Blue
      new THREE.Color("#ec4899"), // Pink
    ];

    for (let i = 0; i < count; i++) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 8 + Math.random() * 18;
        pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        pos[i * 3 + 2] = radius * Math.cos(phi);

        const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        cols[i * 3] = color.r;
        cols[i * 3 + 1] = color.g;
        cols[i * 3 + 2] = color.b;
    }
    return { positions: pos, colors: cols };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.z += delta * 0.03;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Stars radius={60} depth={50} count={3000} factor={6} saturation={0.5} fade speed={1.5} />
    </group>
  );
}

function GalaxyScene({ categories }) {
  const colorPalette = useMemo(() => [
    "#4f46e5", // Indigo
    "#7c3aed", // Deep Purple
    "#0ea5e9", // Sky Blue
    "#ec4899", // Vivid Pink
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#6366f1", // Slate Blue
  ], []);

  const nodes = useMemo(() => {
    if (!categories) return [];
    return categories.map((cat, i) => {
        const angle = (i / categories.length) * Math.PI * 2;
        const radius = 7 + (Math.random() - 0.5) * 4;
        const x = Math.cos(angle) * radius;
        const y = (Math.random() - 0.5) * 8;
        const z = Math.sin(angle) * radius;
        return { 
          ...cat, 
          position: [x, y, z],
          color: colorPalette[i % colorPalette.length] // Assign unique color from palette
        };
    });
  }, [categories, colorPalette]);

  return (
    <>
      <color attach="background" args={['#000000']} />
      
      {/* High-impact 3D Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={3} 
        color="#ffffff" 
        castShadow 
      />
      <pointLight position={[-10, 5, -10]} intensity={4} color="#4f46e5" />
      <pointLight position={[0, -10, 5]} intensity={3} color="#ec4899" />
      <spotLight position={[20, 20, 20]} angle={0.2} penumbra={1} intensity={5} color="#ffffff" castShadow />
      
      <OrbitControls 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.8} 
          maxPolarAngle={Math.PI} 
          minPolarAngle={0}
      />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <ParticleGalaxy />
        {nodes.map(node => (
          <GalaxyNode 
            key={node.id} 
            id={node.id} 
            name={node.name} 
            position={node.position} 
            color={node.color} // Pass-down color
          />
        ))}
      </Float>
    </>
  );
}

export default function KnowledgePlanet({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full h-[750px] bg-[#000000] relative overflow-hidden my-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)]" id="knowledge-galaxy">
      
      {/* Background Nebula Glow - Enhanced for full canvas impact */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50" 
           style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, transparent 70%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 40%), radial-gradient(circle at 20% 80%, #701a75 0%, transparent 40%)'}}>
      </div>

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 24], fov: 45 }} shadows>
        <Suspense fallback={null}>
            <GalaxyScene categories={categories} />
        </Suspense>
      </Canvas>

      {/* Subtle frame accents */}
      <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-white/5 pointer-events-none"></div>
    </div>
  );
}
