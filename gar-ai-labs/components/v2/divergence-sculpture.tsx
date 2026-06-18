'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Lightformer, AdaptiveDpr } from '@react-three/drei'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'

/**
 * The Gar AI Labs logo rendered in 3D: a glass ring (the "seed") from which a
 * bundle of parallel strands rises, leans, and fans apart at the tips — a
 * sprout. It doubles as the non-ergodic thesis: trajectories that start
 * bundled at one origin and diverge into many futures. A faint cloud of finer
 * strands behind the bright bundle hints at the unrealized possibilities,
 * while travelling light pulses read as live forecast sampling.
 */

const AMBER = '#E8A24A'
const BRONZE = '#C07A16'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const BASE_Y = -1.55
const HEIGHT = 3.05

// ---- main logo strands: bundled base -> lean right -> fan + curl at tips ----
type MainStrand = {
  geometry: THREE.TubeGeometry
  curve: THREE.CatmullRomCurve3
  brightness: number
}

function buildMainStrands(): MainStrand[] {
  const N = 6
  const strands: MainStrand[] = []
  for (let i = 0; i < N; i++) {
    const f = i / (N - 1) // 0..1 across the bundle
    const baseX = -0.12 + (f - 0.5) * 0.14
    const baseZ = (f - 0.5) * 0.16
    // outer strands lean + fan further to the right
    const lean = 0.5 + f * 1.15
    const depth = (f - 0.5) * 0.5
    const pts: THREE.Vector3[] = []
    const steps = 10
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const ease = Math.pow(t, 1.7)
      let x = baseX + lean * ease
      let y = BASE_Y + t * HEIGHT
      const z = baseZ + depth * ease
      // gentle curl/hook near the tip
      if (t > 0.78) {
        const k = (t - 0.78) / 0.22
        x += 0.12 * k
        y += 0.16 * k
      }
      pts.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    const geometry = new THREE.TubeGeometry(curve, 90, 0.045, 8, false)
    strands.push({ geometry, curve, brightness: 0.9 + f * 0.7 })
  }
  return strands
}

// ---- faint "possible futures" cloud behind the bundle ----
function buildCloud(seed: number): THREE.TubeGeometry[] {
  const rng = mulberry32(seed)
  const geos: THREE.TubeGeometry[] = []
  const COUNT = 46
  for (let i = 0; i < COUNT; i++) {
    const baseAngle = rng() * Math.PI * 2
    const u = rng()
    const spread = 0.2 + Math.pow(u, 2.4) * 2.6
    const pts: THREE.Vector3[] = []
    const steps = 8
    for (let s = 0; s <= steps; s++) {
      const t = s / steps
      const radius = spread * Math.pow(t, 1.6)
      const ang = baseAngle + (rng() - 0.5) * 0.8 * t
      const x = Math.cos(ang) * radius * 0.7 + 0.25 * Math.pow(t, 1.7)
      const y = BASE_Y + t * (HEIGHT + 0.3)
      // push the cloud mostly behind the bright bundle
      const z = -0.5 - Math.abs(Math.sin(ang)) * radius * 0.6 + (rng() - 0.5) * 0.2
      pts.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(pts)
    geos.push(new THREE.TubeGeometry(curve, 50, 0.01, 5, false))
  }
  return geos
}

function Pulses({ curves }: { curves: THREE.CatmullRomCurve3[] }) {
  const refs = useRef<(Mesh | null)[]>([])
  const config = useMemo(() => {
    const rng = mulberry32(42)
    return curves.map((curve) => ({
      curve,
      speed: 0.1 + rng() * 0.14,
      offset: rng(),
    }))
  }, [curves])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    config.forEach((c, i) => {
      const mesh = refs.current[i]
      if (!mesh) return
      const p = (t * c.speed + c.offset) % 1
      const pt = c.curve.getPointAt(p)
      mesh.position.set(pt.x, pt.y, pt.z)
      const fade = Math.sin(p * Math.PI)
      mesh.scale.setScalar(0.5 + fade * 0.8)
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity = 0.15 + fade * 0.85
    })
  })

  return (
    <>
      {config.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el
          }}
        >
          {/* eslint-disable-next-line react/no-unknown-property */}
          <sphereGeometry args={[0.045, 16, 16]} />
          {/* eslint-disable-next-line react/no-unknown-property */}
          <meshStandardMaterial
            color="#ffe2b0"
            emissive={AMBER}
            emissiveIntensity={2.6}
            toneMapped={false}
            transparent
          />
        </mesh>
      ))}
    </>
  )
}

function Sculpture() {
  const group = useRef<Group>(null)
  const mainStrands = useMemo(() => buildMainStrands(), [])
  const cloud = useMemo(() => buildCloud(11), [])
  const pulseCurves = useMemo(
    () => mainStrands.map((s) => s.curve),
    [mainStrands],
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      // gentle rock so the logo stays readable (no full spin)
      group.current.rotation.y = Math.sin(t * 0.3) * 0.4
      group.current.rotation.x = Math.sin(t * 0.22) * 0.06
    }
  })

  return (
    <group ref={group}>
      {/* faint possible-futures cloud */}
      {cloud.map((geo, i) => (
        // eslint-disable-next-line react/no-unknown-property
        <mesh key={`c${i}`} geometry={geo}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <meshStandardMaterial
            color={BRONZE}
            emissive={AMBER}
            emissiveIntensity={0.3}
            roughness={0.5}
            metalness={0.1}
            transparent
            opacity={0.28}
          />
        </mesh>
      ))}

      {/* glass ring — the seed / circle of the logo */}
      <mesh position={[-0.32, BASE_Y + 0.92, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <torusGeometry args={[0.94, 0.055, 24, 96]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshPhysicalMaterial
          transmission={0.9}
          thickness={0.6}
          roughness={0.08}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.06}
          color="#fff1dd"
          emissive={AMBER}
          emissiveIntensity={0.35}
          attenuationColor="#ffd9a0"
          attenuationDistance={0.8}
          transparent
        />
      </mesh>

      {/* main bright strands (the sprout / divergent bundle) */}
      {mainStrands.map((strand, i) => (
        // eslint-disable-next-line react/no-unknown-property
        <mesh key={`m${i}`} geometry={strand.geometry}>
          {/* eslint-disable-next-line react/no-unknown-property */}
          <meshStandardMaterial
            color={BRONZE}
            emissive={AMBER}
            emissiveIntensity={strand.brightness}
            roughness={0.3}
            metalness={0.2}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* travelling forecast pulses along the bright strands */}
      <Pulses curves={pulseCurves} />

      {/* glowing seed where the strands originate */}
      <mesh position={[-0.12, BASE_Y, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <icosahedronGeometry args={[0.16, 2]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshStandardMaterial
          color={AMBER}
          emissive={AMBER}
          emissiveIntensity={2.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

export function DivergenceSculpture({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMappingExposure: 0.85 }}
        camera={{ position: [0, 0.35, 6.2], fov: 40 }}
      >
        <ambientLight intensity={0.4} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <pointLight position={[-4, 2, 4]} intensity={20} color={AMBER} distance={16} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <pointLight position={[5, -1, 2]} intensity={9} color="#bcd2ff" distance={18} />

        <Suspense fallback={null}>
          <Float speed={1.1} rotationIntensity={0.1} floatIntensity={0.45}>
            <Sculpture />
          </Float>
          <Environment resolution={256}>
            <Lightformer
              intensity={2.4}
              color="#fff4e2"
              position={[0, 4, -6]}
              scale={[12, 8, 1]}
            />
            <Lightformer
              intensity={1.6}
              color="#cfe0ff"
              position={[-6, 1, 2]}
              scale={[6, 10, 1]}
            />
          </Environment>
        </Suspense>

        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  )
}
