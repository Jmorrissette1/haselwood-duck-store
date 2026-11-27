"use client";

import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

type Point3 = [number, number, number];

// X, Z, collision radius.
export const CAMP_OBSTACLES: Point3[] = [
  [-7, 22, 2.5], // First tent
  [-7, 29, 2.5], // Second tent
  [5, 28, 1.2], // Campfire
  [5, 31, 1.4], // First seat
  [8, 28, 1.4], // Second seat
  [-6, 35, 2.3], // Camp sign
];

const TENT_DOOR = new Float32Array([
  -1.85, 0.08, 1.81, 1.85, 0.08, 1.81, 0, 2.3, 1.81,
]);

function Tent({ color }: { color: string }) {
  const roofAngle = Math.atan2(2.4, 2);

  return (
    <group>
      {/* Groundsheet */}
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[4, 0.12, 3.6]} />
        <meshStandardMaterial color="#423b30" />
      </mesh>

      {/* Two sloping canvas panels */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[side, 1.2, 0]}
          rotation={[0, 0, -side * roofAngle]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3.125, 0.12, 3.6]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>
      ))}

      {/* Dark triangular entrance */}
      <mesh>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[TENT_DOOR, 3]} />
        </bufferGeometry>
        <meshBasicMaterial color="#302d27" />
      </mesh>
    </group>
  );
}

function Campfire() {
  return (
    <group>
      {/* Stone fire ring */}
      {Array.from({ length: 10 }, (_, index) => {
        const angle = (index / 10) * Math.PI * 2;

        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.95, 0.2, Math.sin(angle) * 0.95]}
            castShadow
          >
            <dodecahedronGeometry args={[0.28, 0]} />
            <meshStandardMaterial color="#77776c" flatShading />
          </mesh>
        );
      })}

      {/* Crossed firewood */}
      {[Math.PI / 4, -Math.PI / 4].map((angle) => (
        <mesh
          key={angle}
          position={[0, 0.22, 0]}
          rotation={[Math.PI / 2, 0, angle]}
          castShadow
        >
          <cylinderGeometry args={[0.16, 0.2, 1.4, 7]} />
          <meshStandardMaterial color="#64432e" flatShading />
        </mesh>
      ))}

      {/* Stylized flames */}
      <mesh position={[0, 0.85, 0]}>
        <coneGeometry args={[0.48, 1.3, 7]} />
        <meshStandardMaterial
          color="#ff822b"
          emissive="#ef5420"
          emissiveIntensity={0.8}
          flatShading
        />
      </mesh>

      <mesh position={[0.12, 0.65, 0.22]}>
        <coneGeometry args={[0.24, 0.9, 6]} />
        <meshStandardMaterial
          color="#ffe377"
          emissive="#ffc13b"
          emissiveIntensity={0.8}
          flatShading
        />
      </mesh>

      <pointLight
        position={[0, 1.3, 0]}
        color="#ffb45c"
        intensity={5}
        distance={7}
        decay={2}
      />
    </group>
  );
}

function SignArtwork() {
  const texture = useLoader(TextureLoader, "/images/duck-logo-horizontal.png");

  const image = texture.image as { width: number; height: number };
  const aspect = image.width / image.height;
  const width = Math.min(4, 1.15 * aspect);
  const height = width / aspect;

  return (
    <>
      {/* Artwork on both sides of the sign */}
      {[1, -1].map((side) => (
        <mesh
          key={side}
          position={[0, 2.8, side * 0.101]}
          rotation={[0, side === 1 ? 0 : Math.PI, 0]}
        >
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      ))}
    </>
  );
}

function CampSign() {
  return (
    <group>
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 1.5, 0]} castShadow>
          <boxGeometry args={[0.22, 3, 0.22]} />
          <meshStandardMaterial color="#71513b" />
        </mesh>
      ))}

      <mesh position={[0, 2.8, 0]} castShadow>
        <boxGeometry args={[4.4, 1.5, 0.2]} />
        <meshStandardMaterial color="#fff6de" />
      </mesh>

      <Suspense fallback={null}>
        <SignArtwork />
      </Suspense>
    </group>
  );
}

export default function BaseCamp({
  groundHeight,
}: {
  groundHeight: (x: number, z: number) => number;
}) {
  return (
    <group>
      <group position={[-7, groundHeight(-7, 22), 22]}>
        <Tent color="#d88c47" />
      </group>

      <group position={[-7, groundHeight(-7, 29), 29]}>
        <Tent color="#688c8d" />
      </group>

      <group position={[5, groundHeight(5, 28), 28]}>
        <Campfire />
      </group>

      {/* Log seats */}
      {[
        [5, 31, 0],
        [8, 28, Math.PI / 2],
      ].map(([x, z, angle], index) => (
        <mesh
          key={index}
          position={[x, groundHeight(x, z) + 0.35, z]}
          rotation={[0, angle, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.32, 0.38, 2.4, 9]} />
          <meshStandardMaterial color="#846044" flatShading />
        </mesh>
      ))}

      <group position={[-6, groundHeight(-6, 35), 35]}>
        <CampSign />
      </group>
    </group>
  );
}
