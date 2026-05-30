'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 200 }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      // Fibonacci sphere distribution — cinematic feel
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      const radius = 3.5;

      pos[i * 3]     = radius * Math.cos(theta) * Math.sin(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Deep Blue → Electric Cyan palette
      const mix = Math.random();
      color.setHSL(0.55 + mix * 0.1, 0.9, 0.6);
      cols[i * 3]     = color.r;
      cols[i * 3 + 1] = color.g;
      cols[i * 3 + 2] = color.b;
    }
    return [pos, cols];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow rotation (parallax depth)
    meshRef.current.rotation.y += 0.0012;
    meshRef.current.rotation.x += 0.0006;

    // Gentle cursor-follow parallax
    const targetX = (mouse.x * viewport.width) / 18;
    const targetY = (mouse.y * viewport.height) / 18;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.04;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.04;

    // Subtle pulse
    const t = state.clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.4) * 0.025);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticlesBackground() {
  // Adaptive particle count — GPU-friendly on mobile
  const [particleCount, setParticleCount] = useState(250);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const isLowPower =
        typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0;
      if (w < 640 || isLowPower) {
        setParticleCount(70);       // mobile
      } else if (w < 1024) {
        setParticleCount(150);      // tablet
      } else {
        setParticleCount(250);      // desktop
      }
    };
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // Respect reduced-motion preference
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (reducedMotion) {
    return <div className="absolute inset-0 z-0 bg-[#030303]" />;
  }

  return (
    <div className="absolute inset-0 z-0 bg-[#030303]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}              /* cap pixel ratio — perf on HiDPI mobile */
        frameloop="always"
        gl={{ antialias: false, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <Particles count={particleCount} />
      </Canvas>
    </div>
  );
}
