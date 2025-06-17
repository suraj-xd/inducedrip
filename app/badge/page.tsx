'use client'

import React, { useRef, useState, useEffect, Suspense } from 'react'
import { Canvas, extend, useThree, useFrame } from '@react-three/fiber'
import { 
  BallCollider, 
  CuboidCollider, 
  Physics, 
  RigidBody, 
  useRopeJoint, 
  useSphericalJoint 
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import { OrbitControls, Environment, Text, Box, Plane, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, Zap, MousePointer } from 'lucide-react'

extend({ MeshLineGeometry, MeshLineMaterial })

interface BadgeData {
  name: string
  title: string
  company: string
  email: string
  id: string
}

function Badge3D({ badgeData, maxSpeed = 50, minSpeed = 10 }: { badgeData: BadgeData, maxSpeed?: number, minSpeed?: number }) {
  const band = useRef<THREE.Mesh>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const card = useRef<any>(null)
  
  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  
  const segmentProps = { 
    type: 'dynamic' as const, 
    canSleep: true, 
    angularDamping: 2, 
    linearDamping: 2 
  }
  
  const { width, height } = useThree((state) => state.size)
  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3(), 
    new THREE.Vector3()
  ]))
  const [dragged, drag] = useState<THREE.Vector3 | false>(false)
  const [hovered, hover] = useState(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 1.45, 0]])

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab'
      return () => void (document.body.style.cursor = 'auto')
    }
  }, [hovered, dragged])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ 
        x: vec.x - dragged.x, 
        y: vec.y - dragged.y, 
        z: vec.z - dragged.z 
      })
    }
    if (fixed.current) {
      ;[j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
        ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
      })
      
      curve.points[0].copy(j3.current.translation())
      curve.points[1].copy(j2.current.lerped || j2.current.translation())
      curve.points[2].copy(j1.current.lerped || j1.current.translation())
      curve.points[3].copy(fixed.current.translation())
      if (band.current && band.current.geometry) {
        // @ts-ignore - MeshLine geometry has setPoints method
        band.current.geometry.setPoints(curve.getPoints(32))
      }
      
      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation())
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
    }
  })

  curve.curveType = 'chordal'

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody 
          position={[2, 0, 0]} 
          ref={card} 
          {...segmentProps} 
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.9, 1.3, 0.05]} />
          
          {/* Modern Badge Card */}
          <group
            scale={1.6}
            position={[0, -1.3, 0]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              // @ts-ignore - Three.js pointer events
              e.target?.releasePointerCapture?.(e.pointerId)
              drag(false)
            }}
            onPointerDown={(e) => {
              // @ts-ignore - Three.js pointer events
              e.target?.setPointerCapture?.(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            }}
          >
            {/* Card Shadow */}
            <RoundedBox args={[1.85, 2.6, 0.02]} position={[0.02, -0.02, -0.06]} radius={0.1}>
              <meshBasicMaterial color="#00000020" transparent />
            </RoundedBox>

            {/* Main Card Body */}
            <RoundedBox args={[1.8, 2.55, 0.08]} position={[0, 0, 0]} radius={0.1}>
              <meshPhysicalMaterial 
                color="#ffffff" 
                clearcoat={1} 
                clearcoatRoughness={0.05} 
                roughness={0.02} 
                metalness={0.05}
                transparent
                opacity={0.98}
                transmission={0.05}
              />
            </RoundedBox>

            {/* Gradient Header */}
            <RoundedBox args={[1.8, 0.6, 0.085]} position={[0, 0.975, 0.001]} radius={0.1}>
              <meshBasicMaterial color="#6366f1" transparent opacity={0.9} />
            </RoundedBox>

            {/* Company Logo Circle */}
            <mesh position={[0, 1.1, 0.05]}>
              <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
              <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} />
            </mesh>

            {/* Logo Icon */}
            <mesh position={[0, 1.1, 0.06]}>
              <cylinderGeometry args={[0.08, 0.08, 0.01, 32]} />
              <meshPhysicalMaterial color="#6366f1" roughness={0.2} />
            </mesh>

            {/* Name */}
            <Text
              position={[0, 0.45, 0.045]}
              fontSize={0.11}
              color="#111827"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.6}
              letterSpacing={0.02}
            >
              {badgeData.name.toUpperCase()}
            </Text>

            {/* Title */}
            <Text
              position={[0, 0.25, 0.045]}
              fontSize={0.07}
              color="#4b5563"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.6}
              letterSpacing={0.01}
            >
              {badgeData.title}
            </Text>

            {/* Company */}
            <Text
              position={[0, 0.08, 0.045]}
              fontSize={0.07}
              color="#4b5563"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.6}
              letterSpacing={0.01}
            >
              {badgeData.company}
            </Text>

            {/* Email */}
            <Text
              position={[0, -0.15, 0.045]}
              fontSize={0.055}
              color="#6b7280"
              anchorX="center"
              anchorY="middle"
              maxWidth={1.6}
            >
              {badgeData.email}
            </Text>

            {/* Divider Line */}
            <Box args={[1.4, 0.005, 0.01]} position={[0, -0.35, 0.045]}>
              <meshBasicMaterial color="#e5e7eb" />
            </Box>

            {/* ID */}
            <Text
              position={[0, -0.55, 0.045]}
              fontSize={0.045}
              color="#9ca3af"
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.05}
            >
              ID: {badgeData.id}
            </Text>

            {/* QR Code Placeholder */}
            <Box args={[0.35, 0.35, 0.02]} position={[0, -0.9, 0.045]}>
              <meshBasicMaterial color="#111827" />
            </Box>
            
            {/* QR Code Inner Pattern */}
            <Box args={[0.25, 0.25, 0.025]} position={[0, -0.9, 0.05]}>
              <meshBasicMaterial color="#ffffff" />
            </Box>

            {/* Lanyard Attachment */}
            <RoundedBox args={[0.25, 0.08, 0.03]} position={[0, 1.22, 0.02]} radius={0.02}>
              <meshPhysicalMaterial color="#e5e7eb" roughness={0.3} metalness={0.7} />
            </RoundedBox>

            {/* Lanyard Hole */}
            <mesh position={[0, 1.22, 0.04]}>
              <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
              <meshBasicMaterial color="#111827" />
            </mesh>
          </group>
        </RigidBody>
      </group>
      
      {/* Modern Lanyard */}
      <mesh ref={band}>
        {/* @ts-ignore - MeshLine components from extend */}
        <meshLineGeometry />
        {/* @ts-ignore - MeshLine components from extend */}
        <meshLineMaterial 
          color="#6366f1" 
          depthTest={false} 
          resolution={[width, height]} 
          lineWidth={3}
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  )
}

export default function BadgePage() {
  const [badgeData, setBadgeData] = useState<BadgeData>({
    name: 'Alex Rivera',
    title: 'Senior Product Designer',
    company: 'Vertex Industries',
    email: 'alex.rivera@vertex.co',
    id: 'VX2024'
  })

  const handleInputChange = (field: keyof BadgeData, value: string) => {
    setBadgeData(prev => ({ ...prev, [field]: value }))
  }

  const generateRandomId = () => {
    const prefix = badgeData.company.substring(0, 2).toUpperCase()
    const year = new Date().getFullYear().toString().slice(-2)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    const id = `${prefix}${year}${random}`
    setBadgeData(prev => ({ ...prev, id }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start min-h-screen">
          
          {/* Left Panel - Modern Minimal */}
          <div className="xl:sticky xl:top-8 space-y-8">
            
            {/* Header */}
            <div className="text-center xl:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm text-white/80 font-medium">Interactive 3D Experience</span>
              </div>
              
              <h1 className="text-5xl xl:text-6xl font-light text-white mb-4 tracking-tight">
                Digital
                <span className="block font-semibold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  ID Badge
                </span>
              </h1>
              
              <p className="text-xl text-white/60 font-light leading-relaxed max-w-lg">
                Create your personalized event badge with physics-based interactions and real-time updates.
              </p>
            </div>

            {/* Form Card */}
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
              <CardContent className="p-8 space-y-6">
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 font-medium">Live Preview Active</span>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm font-medium">Full Name</Label>
                      <Input
                        value={badgeData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white/70 text-sm font-medium">Job Title</Label>
                      <Input
                        value={badgeData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Your role"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm font-medium">Company</Label>
                    <Input
                      value={badgeData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white/70 text-sm font-medium">Email</Label>
                    <Input
                      type="email"
                      value={badgeData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@company.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 space-y-2">
                      <Label className="text-white/70 text-sm font-medium">Badge ID</Label>
                      <Input
                        value={badgeData.id}
                        onChange={(e) => handleInputChange('id', e.target.value)}
                        placeholder="ID"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-purple-400 focus:ring-purple-400/20"
                      />
                    </div>
                    <div className="pt-7">
                      <Button 
                        onClick={generateRandomId}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-10"
                      >
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border-purple-300/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MousePointer className="w-4 h-4 text-purple-300" />
                  <span className="text-white font-medium">How to interact</span>
                </div>
                
                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>Click and drag the badge to move it around</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span>Watch the lanyard follow realistic physics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                    <span>Edit fields to see live updates on the badge</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - 3D Canvas */}
          <div className="h-[70vh] xl:h-screen bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 12], fov: 30 }}>
              <Suspense fallback={null}>
                <Physics debug={false} interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
                  <Badge3D badgeData={badgeData} />
                </Physics>
                <Environment preset="studio" />
                <ambientLight intensity={0.3} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366f1" />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  )
}
