"use client";

import { useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { getGroundHeight } from "./World";

// X and Z positions. Some ducks require leaving the dirt loop.
const DUCK_SPOTS: [number, number][] = [
  [26, 0],
  [0, -26],
  [-26, 0],
  [0, 34],
  [14, 12],
  [-16, -12],
  [32, 18],
  [-30, -24],
];

export const TOTAL_DUCKS = DUCK_SPOTS.length;

type CollectionProps = {
  vehicleRef: RefObject<Group | null>;
  controls: RefObject<{
    active: boolean;
    resetId: number;
  }>;
  onProgress: (count: number) => void;
};

export default function DuckCollectibles({
  vehicleRef,
  controls,
  onProgress,
}: CollectionProps) {
  const markers = useRef(new Map<number, Group>());
  const collected = useRef(new Set<number>());
  const lastResetId = useRef(0);

  useFrame(({ clock }) => {
    const input = controls.current;

    // Restart the collection whenever the player resets the game.
    if (input.resetId !== lastResetId.current) {
      lastResetId.current = input.resetId;
      collected.current.clear();

      markers.current.forEach((marker) => {
        marker.visible = true;
      });

      onProgress(0);
      return;
    }

    const jeep = vehicleRef.current;
    if (!jeep) return;

    let pickedUpDuck = false;
    const time = clock.elapsedTime;

    DUCK_SPOTS.forEach(([x, z], index) => {
      if (collected.current.has(index)) return;

      const marker = markers.current.get(index);
      if (!marker) return;

      // A gentle bob and rotation make collectibles easy to spot.
      marker.position.y =
        getGroundHeight(x, z) + 0.45 + Math.sin(time * 2 + index) * 0.15;
      marker.rotation.y = time * 0.6 + index;

      const distance = Math.hypot(jeep.position.x - x, jeep.position.z - z);

      if (input.active && distance < 2.8) {
        collected.current.add(index);
        marker.visible = false;
        pickedUpDuck = true;
      }
    });

    // Update React only when something is collected, not every frame.
    if (pickedUpDuck) {
      onProgress(collected.current.size);
    }
  });

  return (
    <group>
      {DUCK_SPOTS.map(([x, z], index) => (
        <group
          key={index}
          position={[x, getGroundHeight(x, z) + 0.45, z]}
          ref={(group) => {
            if (group) {
              markers.current.set(index, group);
            } else {
              markers.current.delete(index);
            }
          }}
        >
          {/* Body */}
          <mesh position={[0, 0.35, 0]} scale={[0.65, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[1, 12, 8]} />
            <meshStandardMaterial color="#ffdc35" flatShading />
          </mesh>

          {/* Head */}
          <mesh position={[0, 0.95, -0.35]} castShadow>
            <sphereGeometry args={[0.42, 12, 8]} />
            <meshStandardMaterial color="#ffe65a" flatShading />
          </mesh>

          {/* Beak */}
          <mesh position={[0, 0.85, -0.78]} castShadow>
            <boxGeometry args={[0.42, 0.16, 0.35]} />
            <meshStandardMaterial color="#f58a26" />
          </mesh>

          {/* Eyes */}
          {[-0.28, 0.28].map((eyeX) => (
            <mesh key={eyeX} position={[eyeX, 1.05, -0.61]}>
              <sphereGeometry args={[0.065, 8, 6]} />
              <meshStandardMaterial color="#202524" />
            </mesh>
          ))}

          {/* A small golden halo underneath the collectible */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[0.8, 1, 24]} />
            <meshBasicMaterial color="#fff1a3" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
