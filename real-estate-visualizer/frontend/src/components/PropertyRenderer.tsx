import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface PropertyRendererProps {
  propertyData: {
    type: '2d' | '3d';
    style: string;
    rooms: Array<{
      name: string;
      width: number;
      height: number;
      depth: number;
      position: [number, number, number];
    }>;
    materials: {
      floor: string;
      walls: string;
      ceiling: string;
    };
  };
  onRenderComplete?: (imageData: string) => void;
}

const Room: React.FC<{
  room: any;
  materials: any;
  isSelected: boolean;
  onClick: () => void;
}> = ({ room, materials, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[room.width, room.height, room.depth]}
      position={room.position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <meshStandardMaterial
        color={isSelected ? '#ff6b35' : materials.walls}
        transparent
        opacity={0.8}
      />
      <Text
        position={[0, room.height / 2 + 0.1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>
    </Box>
  );
};

const Property3D: React.FC<PropertyRendererProps> = ({ propertyData, onRenderComplete }) => {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const { gl } = useThree();

  useEffect(() => {
    // Capture render when component mounts
    const timer = setTimeout(() => {
      if (onRenderComplete) {
        const canvas = gl.domElement;
        const imageData = canvas.toDataURL('image/png');
        onRenderComplete(imageData);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [gl, onRenderComplete]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      <Environment preset="apartment" />
      
      {/* Floor */}
      <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color={propertyData.materials.floor} />
      </Box>
      
      {/* Rooms */}
      {propertyData.rooms.map((room, index) => (
        <Room
          key={index}
          room={room}
          materials={propertyData.materials}
          isSelected={selectedRoom === index}
          onClick={() => setSelectedRoom(selectedRoom === index ? null : index)}
        />
      ))}
      
      {/* Decorative elements */}
      <Sphere position={[5, 2, 5]} args={[0.5]}>
        <meshStandardMaterial color="#ffd700" />
      </Sphere>
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={20}
      />
    </>
  );
};

const PropertyRenderer: React.FC<PropertyRendererProps> = ({ propertyData, onRenderComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [renderMode, setRenderMode] = useState<'2d' | '3d'>('3d');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [propertyData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <span className="ml-4 text-lg">Rendering property...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={() => setRenderMode('2d')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            renderMode === '2d'
              ? 'bg-blue-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          2D View
        </button>
        <button
          onClick={() => setRenderMode('3d')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            renderMode === '3d'
              ? 'bg-blue-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          3D View
        </button>
      </div>

      {renderMode === '3d' ? (
        <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
          <Property3D propertyData={propertyData} onRenderComplete={onRenderComplete} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <p className="text-gray-600">2D Floor Plan View</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyRenderer;
