import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Text, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Programmatic Shield Emblem
const Shield = ({ groupRef, materialRef }: any) => {
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    // Shield path inspired by a classic gym emblem
    s.moveTo(0, 1.2);
    s.lineTo(1.2, 1.2);
    s.quadraticCurveTo(1.2, -0.5, 0, -1.8);
    s.quadraticCurveTo(-1.2, -0.5, -1.2, 1.2);
    s.lineTo(0, 1.2);
    return s;
  }, []);

  const extrudeSettings = {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05
  };

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Outer metallic shield */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial 
          ref={materialRef}
          color="#1a1a1a" 
          metalness={1} 
          roughness={0.15} 
          envMapIntensity={0} // starts at 0, animated by GSAP
        />
      </mesh>
      {/* Inner dark cutout for contrast */}
      <mesh position={[0, -0.1, 0.11]} receiveShadow>
        <extrudeGeometry args={[shape, { ...extrudeSettings, depth: 0.02, bevelSize: 0.02 }]} />
        <meshStandardMaterial color="#000000" metalness={0.6} roughness={0.8} />
      </mesh>
    </group>
  );
};

const SceneController = ({ onTimelineComplete }: { onTimelineComplete: () => void }) => {
  const { camera } = useThree();
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const emblemRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const text1MatRef = useRef<THREE.MeshStandardMaterial>(null);
  const text2MatRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    // Initial camera & object states for the blackout start
    camera.position.set(0, 0, 4);
    if (emblemRef.current) {
        emblemRef.current.position.y = 0.5;
        emblemRef.current.rotation.y = -Math.PI / 2; // Face completely sideways
        emblemRef.current.rotation.x = 0.2; // Slight tilt
    }
    if (text1MatRef.current) text1MatRef.current.opacity = 0;
    if (text2MatRef.current) text2MatRef.current.opacity = 0;
    
    if (spotLightRef.current) {
        spotLightRef.current.intensity = 0;
        spotLightRef.current.position.set(-6, 3, 2);
    }
    
    const tl = gsap.timeline();

    // 0.2s: Ambient/Environment kicks in slowly
    if (materialRef.current) {
        tl.to(materialRef.current, {
            envMapIntensity: 2.5,
            duration: 1.5,
            ease: "power2.inOut"
        }, 0.2);
    }

    // 0.4s: Emblem smoothly rotates into view
    if (emblemRef.current) {
        tl.to(emblemRef.current.rotation, {
            y: 0,
            x: 0,
            duration: 1.8,
            ease: "power3.out"
        }, 0.4);
    }

    // 0.7s: Cinematic sweeping spotlight across the metal
    if (spotLightRef.current) {
        tl.to(spotLightRef.current, {
            intensity: 100,
            duration: 0.5,
            ease: "power1.in"
        }, 0.7);
        tl.to(spotLightRef.current.position, {
            x: 6,
            y: -3,
            duration: 2.5,
            ease: "power2.inOut"
        }, 0.7);
    }

    // 1.0s: Camera pulls back slightly for a reveal effect
    tl.to(camera.position, {
        z: 6,
        duration: 2,
        ease: "power2.out"
    }, 1.0);

    // 1.2s: Wordmark fades in
    if (text1MatRef.current) {
        tl.to(text1MatRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        }, 1.2);
    }

    // 1.5s: Tagline fades in
    if (text2MatRef.current) {
        tl.to(text2MatRef.current, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        }, 1.5);
    }

    // 2.5s: Trigger smooth dissolve into the website
    tl.to({}, {
        duration: 0.1,
        onComplete: () => {
            onTimelineComplete();
        }
    }, 2.5);

    return () => {
        tl.kill();
    }
  }, [camera, onTimelineComplete]);

  return (
    <>
      <ambientLight intensity={0.1} />
      <spotLight 
        ref={spotLightRef} 
        color="#eab308" 
        distance={25} 
        angle={0.6} 
        penumbra={1} 
        decay={2}
      />
      
      {/* Subtle background atmosphere */}
      <Sparkles count={40} scale={10} size={1.5} speed={0.1} opacity={0.15} color="#ffffff" />
      
      <group position={[0, 0.5, 0]}>
         <Shield groupRef={emblemRef} materialRef={materialRef} />
         
         <Text 
           position={[0, -2.5, 0]} 
           fontSize={0.8} 
           letterSpacing={0.1}
           anchorX="center"
           anchorY="middle"
         >
           FROASTER GYM
           <meshStandardMaterial ref={text1MatRef} color="#ffffff" metalness={0.8} roughness={0.2} transparent />
         </Text>

         <Text 
           position={[0, -3.2, 0]} 
           fontSize={0.25} 
           letterSpacing={0.25}
           anchorX="center"
           anchorY="middle"
         >
           WHERE FAT MEETS ITS FATE
           <meshStandardMaterial ref={text2MatRef} color="#eab308" metalness={0.5} roughness={0.3} transparent />
         </Text>
      </group>
    </>
  )
}

export default function CinematicLoader({ onComplete }: { onComplete: () => void }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const handleTimelineComplete = () => {
    setIsFadingOut(true);
    // Smooth 1.2s dissolve transition
    setTimeout(() => {
        onComplete();
    }, 1200);
  };

  if (!hasWebGL) {
    useEffect(() => {
      const timer = setTimeout(() => handleTimelineComplete(), 2000);
      return () => clearTimeout(timer);
    }, []);
    return (
      <div className={`fixed inset-0 z-[100] bg-[#000000] flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        <img src="/logo.png" alt="Froaster Gym" className="h-20 object-contain invert brightness-200 mb-6 animate-pulse" />
        <div className="text-xl font-bebas tracking-widest text-[#eab308]">WHERE FAT MEETS ITS FATE</div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-[#020202] transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      <div className={`absolute bottom-8 right-8 text-[#444] text-[9px] uppercase font-bold tracking-widest transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
        PREPARING EXPERIENCE...
      </div>

      <Suspense fallback={null}>
        <Canvas 
           dpr={[1, 1.5]}
           gl={{ antialias: false, powerPreference: "high-performance" }}
           camera={{ fov: 45 }}
        >
          <Environment preset="city" />
          <SceneController onTimelineComplete={handleTimelineComplete} />
        </Canvas>
      </Suspense>
    </div>
  );
}
