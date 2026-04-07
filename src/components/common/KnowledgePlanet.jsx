import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';

// Simplex 3D Noise (Short Version)
const noiseGLSL = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }
`;

// Planet Surface Material Creator
const PlanetSurfaceMaterial = (color) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uLightPos: { value: new THREE.Vector3(10, 10, 10) },
    },
    vertexShader: `
      ${noiseGLSL}
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;
      void main() {
        // High frequency noise for fine detail
        float noise = snoise(position * 1.5) * 0.15;
        // Lower frequency for broad shapes
        noise += snoise(position * 0.5) * 0.2;
        vNoise = noise;
        
        // Displace the physical geometry
        vec3 displacedPosition = position + normalize(position) * noise;
        vPosition = (modelViewMatrix * vec4(displacedPosition, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal); // Approximation
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;
      uniform vec3 uColor;
      uniform vec3 uLightPos;
      void main() {
        vec3 lightDir = normalize(uLightPos - vPosition);
        float diff = max(dot(vNormal, lightDir), 0.0);
        
        // Color mapping based on noise altitude
        vec3 deepColor = uColor * 0.4;
        vec3 surfaceColor = uColor;
        vec3 peakColor = mix(uColor, vec3(1.0), 0.3);
        
        vec3 color = mix(deepColor, surfaceColor, smoothstep(-0.2, 0.1, vNoise));
        color = mix(color, peakColor, smoothstep(0.15, 0.3, vNoise));
        
        // Simple shadows in valleys
        float shadow = smoothstep(-0.3, 0.2, vNoise);
        
        gl_FragColor = vec4(color * (diff * shadow + 0.15), 1.0);
      }
    `,
  });
};

// Custom Atmospheric Glow Material
const AtmosphereMaterial = (color) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(color) },
      power: { value: 4.0 },
      multiplier: { value: 2.0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPositionNormal;
      uniform vec3 glowColor;
      uniform float power;
      uniform float multiplier;
      void main() {
        float intensity = pow(1.0 - dot(vNormal, vPositionNormal), power) * multiplier;
        gl_FragColor = vec4(glowColor, intensity);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
};

/**
 * Deterministic color generation based on string ID or name
 * Generates a vibrant HSL color that stays consistent for the same input
 */
export const getCategoryColor = (id, name) => {
  const seed = `${id}-${name}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const h = Math.abs(hash) % 360 / 360;
  const s = (65 + (Math.abs(hash >> 8) % 20)) / 100;
  const l = (60 + (Math.abs(hash >> 16) % 15)) / 100;
  
  // HSL to RGB conversion
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

function PlanetRings({ color, radius }) {
    return (
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
            <meshStandardMaterial 
                color={color} 
                transparent 
                opacity={0.4} 
                side={THREE.DoubleSide} 
                emissive={color} 
                emissiveIntensity={0.5}
            />
        </mesh>
    );
}

function GalaxyNode({ id, name, position, color, hasRings, ...props }) {
  const navigate = useNavigate();
  const [hovered, setHover] = useState(false);
  const textRef = useRef();
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state, delta) => {
    if (textRef.current) {
      textRef.current.quaternion.copy(state.camera.quaternion);
    }
    if (meshRef.current) {
        meshRef.current.rotation.y += delta * 0.5;
    }
    if (glowRef.current) {
        glowRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group position={position} {...props}>
      {/* Interaction Layer */}
      <mesh 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
        onClick={() => navigate(`/category/${id}`)}
      >
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The Core Planet Sphere with Procedural Terrain */}
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.8, 128, 128]} /> {/* Higher resolution for better displacement */}
        <primitive object={useMemo(() => PlanetSurfaceMaterial(color), [color])} attach="material" />
      </mesh>
      
      {/* Atmosphere Glow (Fresnel) */}
      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <primitive object={useMemo(() => AtmosphereMaterial(color), [color])} attach="material" />
      </mesh>

      {/* Surface Details (Cloud Layer / Noise) */}
      <mesh ref={glowRef} scale={[1.01, 1.01, 1.01]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.15} 
          alphaMap={null} // We could use a noise texture here
          wireframe={false}
        />
      </mesh>

      {hasRings && <PlanetRings color={color} radius={1.8} />}
      
      <Suspense fallback={null}>
        <Text
          ref={textRef}
          fontSize={0.45}
          maxWidth={3.2}
          textAlign="center"
          position={[0, 2.5, 0]} // Position text above the planet
          color="white"
          fontWeight="bold"
          outlineWidth={0.02}
          outlineColor="#000000"
          depthTest={false}
        >
          {name}
        </Text>
      </Suspense>

      {hovered && (
        <group>
            {/* Hover Selection Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.5, 0.02, 16, 100]} />
                <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>
        </group>
      )}
    </group>
  );
}

function ParticleGalaxy() {
  const pointsRef = useRef();
  const count = 6000;

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const szs = new Float32Array(count);
    const colorChoices = [
      new THREE.Color("#4f46e5"), // Indigo
      new THREE.Color("#7c3aed"), // Purple
      new THREE.Color("#0ea5e9"), // Sky Blue
      new THREE.Color("#ec4899"), // Pink
      new THREE.Color("#ffffff"), // Pure White
    ];

    for (let i = 0; i < count; i++) {
        // Spiral galaxy formula
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 40;
        const spin = radius * 0.2;
        
        pos[i * 3] = Math.cos(angle + spin) * radius + (Math.random() - 0.5) * 5;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
        pos[i * 3 + 2] = Math.sin(angle + spin) * radius + (Math.random() - 0.5) * 5;

        const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];
        cols[i * 3] = color.r;
        cols[i * 3 + 1] = color.g;
        cols[i * 3 + 2] = color.b;
        szs[i] = Math.random() * 0.2 + 0.05;
    }
    return { positions: pos, colors: cols, sizes: szs };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03;
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
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

function OrbitalPath({ radius }) {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
            <meshBasicMaterial color="white" transparent opacity={0.05} />
        </mesh>
    );
}

function GalaxyScene({ categories }) {
  const nodes = useMemo(() => {
    if (!categories) return [];
    return categories.map((cat, i) => {
        const angle = (i / categories.length) * Math.PI * 2;
        const radius = 10 + (i % 3) * 4; 
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * 4;
        
        return { 
          ...cat, 
          position: [x, y, z],
          color: getCategoryColor(cat.id, cat.name),
          radius,
          hasRings: true // Unified component: All planets have rings
        };
    });
  }, [categories]);

  return (
    <>
      <color attach="background" args={['#000308']} />
      
      {/* High-impact 3D Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={10} color="#ffffff" decay={1} distance={100} />
      <pointLight position={[20, 20, 20]} intensity={5} color="#4f46e5" />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      
      <OrbitControls 
          enableZoom={true} 
          maxDistance={50}
          minDistance={10}
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 1.5} 
          minPolarAngle={Math.PI / 3}
      />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <ParticleGalaxy />
        {nodes.map(node => (
          <group key={node.id}>
            <OrbitalPath radius={node.radius} />
            <GalaxyNode 
              id={node.id} 
              name={node.name} 
              position={node.position} 
              color={node.color}
              hasRings={node.hasRings}
            />
          </group>
        ))}
      </Float>
    </>
  );
}

export default function KnowledgePlanet({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full h-full bg-[#000000] relative overflow-hidden" id="knowledge-galaxy">
      
      {/* Background Nebula Glow - Enhanced for full canvas impact */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50" 
           style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b4b 0%, transparent 70%), radial-gradient(circle at 80% 20%, #44e5 0%, transparent 40%), radial-gradient(circle at 20% 80%, #701a75 0%, transparent 40%)'}}>
      </div>

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 24], fov: 45 }} shadows>
        <Suspense fallback={null}>
            <GalaxyScene categories={categories} />
        </Suspense>
      </Canvas>
    </div>
  );
}
