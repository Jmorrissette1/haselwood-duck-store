"use client";

import { useEffect, useMemo } from "react";
import { Color, Float32BufferAttribute, PlaneGeometry } from "three";
import BaseCamp, { CAMP_OBSTACLES } from "./BaseCamp";

type Point2 = [number, number];
type Point3 = [number, number, number];

// Connected routes starting at base camp.
const TRAILS: Point2[][] = [
  // Main trail: camp to the eastern hill.
  [
    [0, 26],
    [13, 24],
    [27, 15],
    [30, 0],
    [25, -17],
    [12, -28],
    [0, -26],
  ],

  // Western forest route.
  [
    [0, 26],
    [-15, 23],
    [-28, 10],
    [-26, -5],
    [-18, -20],
    [0, -26],
  ],

  // Connecting trail through the middle.
  [
    [-26, -5],
    [-12, 0],
    [0, 9],
    [14, 12],
    [27, 15],
  ],

  // Side trail to a hidden clearing.
  [
    [-18, -20],
    [-30, -24],
    [-40, -15],
  ],
];

const CLEARINGS: Point3[] = [
  [0, 26, 9],
  [25, -17, 7],
  [-40, -15, 6],
];

// Shared by the landscape, Jeep, camera, and collectibles.
export function getGroundHeight(x: number, z: number) {
  const rollingGround = Math.sin(x * 0.065) * Math.cos(z * 0.06) * 1.2;

  const easternHill = 6.5 * Math.exp(-((x - 25) ** 2 + (z + 17) ** 2) / 280);

  const westernHill = 4 * Math.exp(-((x + 27) ** 2 + (z - 3) ** 2) / 240);

  // Keep the spawn point level, blending into the surrounding hills.
  const campBlend = 1 - Math.exp(-(x * x + (z - 26) ** 2) / 120);

  return (rollingGround + easternHill + westernHill) * campBlend;
}

function distanceToSegment(x: number, z: number, start: Point2, end: Point2) {
  const dx = end[0] - start[0];
  const dz = end[1] - start[1];
  const lengthSquared = dx * dx + dz * dz;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((x - start[0]) * dx + (z - start[1]) * dz) /
        Math.max(lengthSquared, 0.001),
    ),
  );

  return Math.hypot(x - (start[0] + dx * t), z - (start[1] + dz * t));
}

export function isOnTrail(x: number, z: number) {
  if (
    CLEARINGS.some(([cx, cz, radius]) => Math.hypot(x - cx, z - cz) < radius)
  ) {
    return true;
  }

  return TRAILS.some((trail) =>
    trail.some((point, index) => {
      if (index === 0) return false;
      return distanceToSegment(x, z, trail[index - 1], point) < 4.5;
    }),
  );
}

// X, Z, radius. Used for both drawing and collision checks.
export const ROCKS: Point3[] = [
  [12, 22, 1.6],
  [-23, 9, 1.8],
  [22, -13, 2],
  [-8, -28, 1.3],
  [8, 5, 2.8],
  [-10, -6, 2.2],
];

export const OBSTACLES: Point3[] = [...ROCKS, ...CAMP_OBSTACLES];

// X, Z, scale. Keep the main trails free of tree trunks.
const TREE_CANDIDATES: Point3[] = [
  ...Array.from({ length: 32 }, (_, index): Point3 => {
    const angle = (index / 32) * Math.PI * 2;
    const radius = 39 + (index % 3) * 5;

    return [
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      0.9 + (index % 4) * 0.15,
    ];
  }),
  [-10, 10, 1.2],
  [-3, 15, 1],
  [6, -10, 1.3],
  [14, -5, 1.1],
];

export const TREES: Point3[] = TREE_CANDIDATES.filter(
  ([x, z]) => !isOnTrail(x, z),
);

export default function Terrain() {
  const geometry = useMemo(() => {
    const ground = new PlaneGeometry(180, 180, 144, 144);
    ground.rotateX(-Math.PI / 2);

    const positions = ground.getAttribute("position");
    const colors = new Float32Array(positions.count * 3);
    const color = new Color();

    for (let index = 0; index < positions.count; index++) {
      const x = positions.getX(index);
      const z = positions.getZ(index);

      positions.setY(index, getGroundHeight(x, z));

      color.set(isOnTrail(x, z) ? "#cba36b" : "#839d60");

      // Subtle, repeatable variation across the ground.
      color.multiplyScalar(0.97 + Math.sin(x * 0.4 + z * 0.3) * 0.03);

      colors[index * 3] = color.r;
      colors[index * 3 + 1] = color.g;
      colors[index * 3 + 2] = color.b;
    }

    ground.setAttribute("color", new Float32BufferAttribute(colors, 3));

    ground.computeVertexNormals();
    ground.computeBoundingSphere();

    return ground;
  }, []);

  useEffect(() => {
    return () => geometry.dispose();
  }, [geometry]);

  return (
    <group>
      {/* Hills and paths are part of the same surface. */}
      <mesh receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial vertexColors roughness={1} flatShading />
      </mesh>

      {ROCKS.map(([x, z, radius], index) => (
        <mesh
          key={`rock-${index}`}
          position={[x, getGroundHeight(x, z) + radius * 0.55, z]}
          scale={[radius, radius * 0.8, radius]}
          rotation={[0.2, index * 0.7, 0.15]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7a8177" flatShading />
        </mesh>
      ))}

      {TREES.map(([x, z, scale], index) => (
        <group
          key={`tree-${index}`}
          position={[x, getGroundHeight(x, z), z]}
          scale={scale}
        >
          <mesh position={[0, 1.1, 0]} castShadow>
            <boxGeometry args={[0.65, 2.2, 0.65]} />
            <meshStandardMaterial color="#71513b" />
          </mesh>

          <mesh position={[0, 3, 0]} castShadow>
            <coneGeometry args={[2, 4, 7]} />
            <meshStandardMaterial color="#365f43" flatShading />
          </mesh>

          <mesh position={[0, 4.7, 0]} castShadow>
            <coneGeometry args={[1.45, 3.2, 7]} />
            <meshStandardMaterial color="#47774c" flatShading />
          </mesh>
        </group>
      ))}

      {/* Yellow base-camp marker. */}
      <BaseCamp groundHeight={getGroundHeight} />
    </group>
  );
}
