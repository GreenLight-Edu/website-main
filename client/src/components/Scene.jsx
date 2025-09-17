import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Stars, Environment } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('./earth.glb');
  
  // Animate the model to rotate
  useFrame(() => {
    if (scene) {
      scene.rotation.y += 0.002;
    }
  });

  // The model from Sketchfab is a bit small, so we scale it up
  return <primitive object={scene} scale={1.2} />;
}

export default function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      {/* A soft ambient light to illuminate the entire scene */}
      <ambientLight intensity={0.5} />
      
      {/* A directional light to simulate the sun and create highlights */}
      <directionalLight position={[10, 10, 5]} intensity={1.5} />

      {/* THE KEY FIX IS HERE: The Environment component creates a virtual 'sky'
        that the PBR (Physically Based Rendering) material on the Earth model
        can reflect. This is what will make it visible and look realistic.
      */}
      <Environment preset="sunset" />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      <Suspense fallback={null}>
        <Model />
      </Suspense>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 2.5}
        maxPolarAngle={Math.PI / 2.5}
      />
    </Canvas>
  );
}