"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import DuckCollectibles, { TOTAL_DUCKS } from "./DuckCollectibles";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, OrthographicCamera, Vector3 } from "three";
import Terrain, { ROCKS, TREES, getGroundHeight, isOnTrail } from "./World";

type Point3 = [number, number, number];

type Controls = {
  keys: Set<string>;
  active: boolean;
  resetId: number;
};

const DRIVE_KEYS = new Set([
  "w",
  "a",
  "s",
  "d",
  "arrowup",
  "arrowleft",
  "arrowdown",
  "arrowright",
  " ",
]);

function Box({
  position,
  size,
  color,
}: {
  position: Point3;
  size: Point3;
  color: string;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

// The Jeep's front points toward negative Z.
function Jeep() {
  return (
    <group>
      {/* Wade's brown cowboy hat */}
      <group position={[-0.45, 2.4, -0.02]} rotation={[0, 0, -0.08]}>
        {/* Wide oval brim */}
        <mesh scale={[1.15, 1, 0.9]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.055, 16]} />
          <meshStandardMaterial color="#79502e" roughness={1} flatShading />
        </mesh>

        {/* Tapered crown */}
        <mesh position={[0, 0.16, 0]} scale={[1, 1, 0.85]} castShadow>
          <cylinderGeometry args={[0.18, 0.24, 0.29, 8]} />
          <meshStandardMaterial color="#895b35" roughness={1} flatShading />
        </mesh>

        {/* Dark leather hatband */}
        <mesh position={[0, 0.055, 0]} scale={[1, 1, 0.85]} castShadow>
          <cylinderGeometry args={[0.235, 0.245, 0.055, 12]} />
          <meshStandardMaterial color="#3f291c" roughness={1} />
        </mesh>
      </group>
      {/* Chassis, body, and hood */}
      <Box position={[0, 0.65, 0]} size={[2, 0.35, 3.7]} color="#292b29" />
      <Box position={[0, 1.05, 0]} size={[2.1, 0.65, 3.5]} color="#eab52c" />
      <Box position={[0, 1.47, -1.15]} size={[2, 0.3, 1.15]} color="#ffd34e" />

      {/* Rear body */}
      <Box position={[0, 1.5, 1.25]} size={[2.1, 0.65, 0.65]} color="#efb52b" />

      {/* Open cabin floor and seats */}
      <Box position={[0, 1.42, 0.25]} size={[1.7, 0.15, 1.8]} color="#343b36" />
      <Box
        position={[-0.48, 1.65, 0.55]}
        size={[0.65, 0.65, 0.35]}
        color="#333b36"
      />
      <Box
        position={[0.48, 1.65, 0.55]}
        size={[0.65, 0.65, 0.35]}
        color="#333b36"
      />

      {/* Windshield */}
      <Box
        position={[0, 1.95, -0.57]}
        size={[1.9, 0.85, 0.12]}
        color="#8bc8d2"
      />
      <Box
        position={[0, 2.4, -0.57]}
        size={[2.05, 0.12, 0.18]}
        color="#ffd34e"
      />

      {/* Rear roll bar */}
      <Box
        position={[-0.9, 1.95, 0.95]}
        size={[0.13, 1.1, 0.13]}
        color="#303630"
      />
      <Box
        position={[0.9, 1.95, 0.95]}
        size={[0.13, 1.1, 0.13]}
        color="#303630"
      />
      <Box
        position={[0, 2.5, 0.95]}
        size={[1.95, 0.13, 0.13]}
        color="#303630"
      />

      {/* Bumpers and grille */}
      <Box
        position={[0, 0.83, -1.95]}
        size={[2.35, 0.28, 0.3]}
        color="#424846"
      />
      <Box
        position={[0, 0.83, 1.95]}
        size={[2.35, 0.28, 0.3]}
        color="#424846"
      />
      <Box
        position={[0, 1.22, -1.79]}
        size={[1.1, 0.45, 0.08]}
        color="#303630"
      />

      {/* Headlights */}
      {[-0.78, 0.78].map((x) => (
        <mesh key={x} position={[x, 1.25, -1.82]}>
          <sphereGeometry args={[0.22, 12, 8]} />
          <meshStandardMaterial
            color="#fff4cd"
            emissive="#fff4cd"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}

      {/* Chunky tires */}
      {[-1.15, 1.15].map((x) =>
        [-1.2, 1.2].map((z) => (
          <group key={`${x}-${z}`} position={[x, 0.6, z]}>
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.62, 0.62, 0.45, 12]} />
              <meshStandardMaterial color="#252b2c" flatShading />
            </mesh>

            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.47, 12]} />
              <meshStandardMaterial color="#7b8587" metalness={0.35} />
            </mesh>
          </group>
        )),
      )}

      {/* Spare tire */}
      <mesh
        position={[0, 1.45, 1.98]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.55, 0.55, 0.35, 12]} />
        <meshStandardMaterial color="#252b2c" flatShading />
      </mesh>

      {/* Wade in the driver's seat */}
      <mesh position={[-0.45, 1.85, 0.1]} castShadow>
        <sphereGeometry args={[0.36, 12, 8]} />
        <meshStandardMaterial color="#ffe34d" flatShading />
      </mesh>

      <mesh position={[-0.45, 2.15, -0.02]} castShadow>
        <sphereGeometry args={[0.26, 12, 8]} />
        <meshStandardMaterial color="#ffe34d" flatShading />
      </mesh>

      <Box
        position={[-0.45, 2.1, -0.3]}
        size={[0.24, 0.1, 0.22]}
        color="#f38a2e"
      />
    </group>
  );
}

function DrivingScene({
  controls,
  onProgress,
}: {
  controls: RefObject<Controls>;
  onProgress: (count: number) => void;
}) {
  const jeepRef = useRef<Group>(null);
  const lastResetId = useRef(0);
  const car = useRef({ x: 0, z: 26, angle: -Math.PI / 2, speed: 0 });

  const follow = useRef(new Vector3(0, 0, 26));
  const target = useRef(new Vector3());
  const cameraOffset = useRef(new Vector3(22, 28, 22));

  const get = useThree((state) => state.get);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const camera = get().camera;

    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.max(6, Math.min(size.width / 46, size.height / 32));
      camera.updateProjectionMatrix();
    }
  }, [get, size.width, size.height]);

  // Keep a useful amount of terrain visible at different screen sizes.
  useEffect(() => {
    const camera = get().camera;

    if (camera instanceof OrthographicCamera) {
      camera.zoom = Math.max(6, Math.min(size.width / 46, size.height / 32));
      camera.updateProjectionMatrix();
    }
  }, [get, size.width, size.height]);

  useFrame((state, delta) => {
    const camera = state.camera;
    const jeep = jeepRef.current;

    if (!jeep) return;

    const dt = Math.min(delta, 0.05);
    const input = controls.current;
    const vehicle = car.current;

    if (input.resetId !== lastResetId.current) {
      vehicle.x = 0;
      vehicle.z = 26;
      vehicle.angle = -Math.PI / 2;
      vehicle.speed = 0;

      follow.current.set(0, 0, 26);
      lastResetId.current = input.resetId;
    }

    if (input.active) {
      const forward = input.keys.has("w") || input.keys.has("arrowup");
      const reverse = input.keys.has("s") || input.keys.has("arrowdown");
      const left = input.keys.has("a") || input.keys.has("arrowleft");
      const right = input.keys.has("d") || input.keys.has("arrowright");
      const braking = input.keys.has(" ");

      const onTrail = isOnTrail(vehicle.x, vehicle.z);
      const maxSpeed = onTrail ? 18 : 9;

      vehicle.speed += (Number(forward) - Number(reverse)) * 22 * dt;
      vehicle.speed *= Math.exp(-(braking ? 7 : onTrail ? 0.9 : 2.2) * dt);
      vehicle.speed = Math.max(-7, Math.min(maxSpeed, vehicle.speed));

      if (Math.abs(vehicle.speed) < 0.02) vehicle.speed = 0;

      const steering = Number(left) - Number(right);
      vehicle.angle +=
        steering *
        Math.sign(vehicle.speed) *
        Math.min(Math.abs(vehicle.speed) / 6, 1) *
        1.7 *
        dt;

      const nextX = vehicle.x - Math.sin(vehicle.angle) * vehicle.speed * dt;
      const nextZ = vehicle.z - Math.cos(vehicle.angle) * vehicle.speed * dt;

      // Simple circular collision checks for this first prototype.
      const hitsRock = ROCKS.some(
        ([x, z, radius]) => Math.hypot(nextX - x, nextZ - z) < radius + 1.8,
      );

      const hitsTree = TREES.some(
        ([x, z, scale]) => Math.hypot(nextX - x, nextZ - z) < 0.5 * scale + 1.8,
      );

      if (hitsRock || hitsTree || Math.hypot(nextX, nextZ) > 57) {
        vehicle.speed = 0;
      } else {
        vehicle.x = nextX;
        vehicle.z = nextZ;
      }
    } else {
      vehicle.speed = 0;
    }

    const groundHeight = getGroundHeight(vehicle.x, vehicle.z);

    const sin = Math.sin(vehicle.angle);
    const cos = Math.cos(vehicle.angle);

    // Sample the ground under the front and rear wheels.
    const frontHeight = getGroundHeight(
      vehicle.x - sin * 1.2,
      vehicle.z - cos * 1.2,
    );

    const rearHeight = getGroundHeight(
      vehicle.x + sin * 1.2,
      vehicle.z + cos * 1.2,
    );

    // Sample the ground under the right and left wheels.
    const rightHeight = getGroundHeight(
      vehicle.x + cos * 1.15,
      vehicle.z - sin * 1.15,
    );

    const leftHeight = getGroundHeight(
      vehicle.x - cos * 1.15,
      vehicle.z + sin * 1.15,
    );

    const pitch = Math.atan2(frontHeight - rearHeight, 2.4);
    const roll = Math.atan2(rightHeight - leftHeight, 2.3);

    jeep.position.set(vehicle.x, groundHeight + 0.08, vehicle.z);
    jeep.rotation.set(pitch, vehicle.angle, roll, "YXZ");

    // Look a little ahead in the direction the Jeep is traveling.
    target.current.set(
      vehicle.x - Math.sin(vehicle.angle) * vehicle.speed * 0.18,
      groundHeight,
      vehicle.z - Math.cos(vehicle.angle) * vehicle.speed * 0.18,
    );

    // Frame-rate-independent smoothing. The camera never rotates with steering.
    follow.current.lerp(target.current, 1 - Math.exp(-4 * dt));
    camera.position.copy(follow.current).add(cameraOffset.current);
    camera.lookAt(follow.current);
  });

  return (
    <>
      <color attach="background" args={["#bed1ba"]} />

      <hemisphereLight args={["#fff4db", "#516345", 2]} />

      <directionalLight
        position={[25, 45, 20]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-65}
        shadow-camera-right={65}
        shadow-camera-top={65}
        shadow-camera-bottom={-65}
        shadow-camera-near={1}
        shadow-camera-far={150}
        shadow-normalBias={0.08}
      />

      <Terrain />

      <DuckCollectibles
        vehicleRef={jeepRef}
        controls={controls}
        onProgress={onProgress}
      />

      <group
        ref={jeepRef}
        position={[0, 0, 26]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <Jeep />
      </group>
    </>
  );
}

export default function DrivingGame() {
  const [ducksFound, setDucksFound] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const controls = useRef<Controls>({
    keys: new Set(),
    active: false,
    resetId: 0,
  });

  useEffect(() => {
    function stop() {
      controls.current.keys.clear();
      controls.current.active = false;
    }

    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", stop);

    return () => {
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-300">
            Duck hunt
          </p>

          <p className="mt-1 text-xl font-black text-white">
            {ducksFound} / {TOTAL_DUCKS} ducks found
          </p>
        </div>

        <p role="status" className="text-sm text-stone-300">
          {ducksFound === TOTAL_DUCKS
            ? "You found every duck! Keep exploring or restart."
            : "Explore at your own pace. Some ducks are off the trail."}
        </p>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p id="game-controls" className="text-sm text-stone-300">
          Click the course · WASD / arrows to drive · Space to brake
        </p>

        <button
          type="button"
          onClick={() => {
            controls.current.keys.clear();
            controls.current.resetId += 1;
            gameRef.current?.focus();
            controls.current.active = true;
          }}
          className="rounded-full bg-yellow-300 px-5 py-2 text-sm font-bold text-stone-950 hover:bg-yellow-200"
        >
          Reset Jeep
        </button>
      </div>

      <div
        ref={gameRef}
        tabIndex={0}
        role="group"
        aria-label="Wade’s off-road driving game"
        aria-describedby="game-controls"
        onPointerDown={(event) => {
          event.currentTarget.focus();
          controls.current.active = true;
        }}
        onFocus={() => {
          controls.current.active = true;
        }}
        onBlur={() => {
          controls.current.keys.clear();
          controls.current.active = false;
        }}
        onKeyDown={(event) => {
          if (event.ctrlKey || event.metaKey || event.altKey) return;

          const key = event.key.toLowerCase();

          if (DRIVE_KEYS.has(key)) {
            event.preventDefault();
            controls.current.keys.add(key);
          }
        }}
        onKeyUp={(event) => {
          const key = event.key.toLowerCase();

          if (DRIVE_KEYS.has(key)) {
            event.preventDefault();
            controls.current.keys.delete(key);
          }
        }}
        className="h-[420px] overflow-hidden rounded-3xl border border-white/20 outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 sm:h-[560px]"
      >
        <Canvas
          orthographic
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [22, 28, 48],
            zoom: 16,
            near: 0.1,
            far: 250,
          }}
          fallback={
            <p className="p-8 text-white">
              This game needs a browser with WebGL support.
            </p>
          }
        >
          <DrivingScene controls={controls} onProgress={setDucksFound} />
        </Canvas>
      </div>

      <p className="mt-3 text-sm text-stone-400">
        Desktop prototype · Grass slows you down · Rocks and tree trunks block
        your path · Tab leaves the game
      </p>
    </div>
  );
}
