"use client"

import type React from "react" // Corrected import
import { useState, Suspense, useRef, useEffect, useCallback } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Html, Environment, Stage } from "@react-three/drei"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import CircularPicker from "./animation"
import { Check, CheckIcon } from "@phosphor-icons/react"

interface POV {
  id: string
  name: string
  modelRotation: [number, number, number]
  cameraPosition: [number, number, number]
  cameraTarget: [number, number, number]
}

interface LiveCameraAngles {
  azimuthal: number
  polar: number
}

// New component to handle useFrame for OrbitControls
function ControlsUpdater({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl> }) {
  useFrame(() => {
    if (controlsRef.current?.enableDamping) {
      controlsRef.current.update()
    }
  })
  return null // This component doesn't render anything itself
}

function Model({
  url,
  rotation,
  materialOverride,
}: { url: string; rotation: [number, number, number]; materialOverride: boolean }) {
  const { scene } = useGLTF(url)

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        if (materialOverride) {
          child.material.color.setHex(0xbbbbbb)
          child.material.roughness = 0.6
          child.material.metalness = 0.2
        }
      }
    })
  }, [scene, materialOverride])

  return (
    <group rotation={rotation}>
      <primitive object={scene} />
    </group>
  )
}

export default function HoddieViewerPage() {
  const [modelUrl, setModelUrl] = useState<string | null>("/hoodie/white-hoodie.glb")
  const [error, setError] = useState<string | null>(null)
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([0, 0, 0])
  const orbitControlsRef = useRef<OrbitControlsImpl>(null!)

  const [povs, setPovs] = useState<POV[]>([])
  const [povNameInput, setPovNameInput] = useState<string>("")
  const [isCustomPovActive, setIsCustomPovActive] = useState<boolean>(false)

  const [lightingIntensity, setLightingIntensity] = useState<number>(0.2)
  const [useSpotlightSetup, setUseSpotlightSetup] = useState<boolean>(true)
  const [materialOverride, setMaterialOverride] = useState<boolean>(true)

  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [liveCameraAngles, setLiveCameraAngles] = useState<LiveCameraAngles | null>(null)
  const [isCameraAnimating, setIsCameraAnimating] = useState<boolean>(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
        const objectURL = URL.createObjectURL(file)
        setModelUrl(objectURL)
        setError(null)
        setModelRotation([0, 0, 0])
        setIsCustomPovActive(false)
        setIsEditMode(false)
        if (modelUrl && modelUrl !== "/assets/3d/duck.glb" && modelUrl.startsWith("blob:")) {
          URL.revokeObjectURL(modelUrl)
        }
      } else {
        setError("Invalid file type. Please upload a .glb or .gltf file.")
        setModelUrl(null)
      }
    }
  }

  const handleOrbitControlsChange = useCallback(() => {
    if (orbitControlsRef.current) {
      const azimuthal = orbitControlsRef.current.getAzimuthalAngle()
      const polar = orbitControlsRef.current.getPolarAngle()
      setLiveCameraAngles({
        azimuthal: (azimuthal * 180) / Math.PI,
        polar: (polar * 180) / Math.PI,
      })
    }
  }, [])

  const setViewPreset = useCallback(
    (preset: "front" | "back" | "top" | "left" | "right", onComplete?: () => void) => {
      if (!orbitControlsRef.current) {
        if (onComplete) onComplete()
        return
      }
      const controls = orbitControlsRef.current

      const currentlyCustom = isCustomPovActive
      const shouldTemporarilyDisableStageAdjust = !isEditMode && !isCameraAnimating

      if (shouldTemporarilyDisableStageAdjust) {
        setIsCustomPovActive(true)
      }

      requestAnimationFrame(() => {
        if (!orbitControlsRef.current) {
          if (onComplete) onComplete()
          return
        }
        switch (preset) {
          case "front":
            controls.setAzimuthalAngle(0)
            controls.setPolarAngle(Math.PI / 2)
            break
          case "back":
            controls.setAzimuthalAngle(Math.PI)
            controls.setPolarAngle(Math.PI / 2)
            break
          case "top":
            controls.setAzimuthalAngle(0)
            controls.setPolarAngle(0.01)
            break
          case "left":
            controls.setAzimuthalAngle(-Math.PI / 2)
            controls.setPolarAngle(Math.PI / 2)
            break
          case "right":
            controls.setAzimuthalAngle(Math.PI / 2)
            controls.setPolarAngle(Math.PI / 2)
            break
        }
        handleOrbitControlsChange()

        if (onComplete) {
          setTimeout(onComplete, 150)
        }

        if (shouldTemporarilyDisableStageAdjust) {
          setTimeout(() => setIsCustomPovActive(currentlyCustom), 200)
        }
      })
    },
    [isCustomPovActive, isEditMode, handleOrbitControlsChange, isCameraAnimating],
  )

  const handleLoadDefault = () => {
    if (isCameraAnimating) return
    if (modelUrl && modelUrl !== "/assets/3d/duck.glb" && modelUrl.startsWith("blob:")) {
      URL.revokeObjectURL(modelUrl)
    }
    setModelUrl("/assets/3d/duck.glb")
    setError(null)
    setModelRotation([0, 0, 0])
    setIsCustomPovActive(false)
    setIsEditMode(false)
    const input = document.getElementById("model-upload") as HTMLInputElement
    if (input) input.value = ""

    setIsCameraAnimating(true)
    setViewPreset("front", () => {
      setIsCameraAnimating(false)
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true
    })
  }

  const handleModelRotationChange = (axis: "x" | "y" | "z", value: string) => {
    const degrees = Number.parseFloat(value)
    if (isNaN(degrees)) return
    const radians = (degrees * Math.PI) / 180
    const newRotation = [...modelRotation] as [number, number, number]
    if (axis === "x") newRotation[0] = radians
    else if (axis === "y") newRotation[1] = radians
    else if (axis === "z") newRotation[2] = radians
    setModelRotation(newRotation)
  }

  const handleAddPov = () => {
    if (!povNameInput.trim() || !orbitControlsRef.current?.object) return
    const newPov: POV = {
      id: crypto.randomUUID(),
      name: povNameInput.trim(),
      modelRotation: [...modelRotation],
      cameraPosition: orbitControlsRef.current.object.position.toArray() as [number, number, number],
      cameraTarget: orbitControlsRef.current.target.toArray() as [number, number, number],
    }
    setPovs((prev) => [...prev, newPov])
    setPovNameInput("")
  }

  const applyPov = (povId: string) => {
    if (isCameraAnimating) return
    const pov = povs.find((p) => p.id === povId)
    if (!pov || !orbitControlsRef.current?.object) return

    setIsCameraAnimating(true)
    setIsCustomPovActive(true)

    requestAnimationFrame(() => {
      if (!orbitControlsRef.current || !orbitControlsRef.current.object) {
        setIsCameraAnimating(false)
        return
      }
      setModelRotation([...pov.modelRotation])
      orbitControlsRef.current.object.position.set(...pov.cameraPosition)
      orbitControlsRef.current.target.set(...pov.cameraTarget)
      handleOrbitControlsChange()
      setTimeout(() => setIsCameraAnimating(false), 150)
    })
  }

  const handleEditButtonClick = () => {
    if (isCameraAnimating) return
    setIsCameraAnimating(true)

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false
    }
    setIsCustomPovActive(true)

    setViewPreset("back", () => {
      setIsEditMode(true)
      setIsCameraAnimating(false)
    })
  }

  const handleCancelEditClick = () => {
    if (isCameraAnimating) return
    setIsCameraAnimating(true)

    setIsEditMode(false)

    setViewPreset("front", () => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true
      }
      setIsCustomPovActive(false)
      setIsCameraAnimating(false)
    })
  }

  useEffect(() => {
    if (orbitControlsRef.current) {
      handleOrbitControlsChange()
    }
  }, [handleOrbitControlsChange])

  useEffect(() => {
    return () => {
      if (modelUrl && modelUrl !== "/assets/3d/duck.glb" && modelUrl.startsWith("blob:")) {
        URL.revokeObjectURL(modelUrl)
      }
    }
  }, [modelUrl])

  const stageAdjustCamera = !isEditMode && !isCustomPovActive && !isCameraAnimating ? 1.5 : false

  return (
    <div className="relative flex flex-col-reverse md:flex-col items-center min-h-screen bg-muted/40 p-4 md:p-8 overflow-hidden">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          className={`space-y-8 transition-opacity duration-300 ${isEditMode || isCameraAnimating ? "opacity-5 pointer-events-none" : "opacity-100"}`}
        >
          <Card>
            <CardHeader>
              <CardTitle>3D Object Viewer</CardTitle>
              <CardDescription>Upload a GLB or GLTF file.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                id="model-upload"
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileChange}
                disabled={isCameraAnimating}
              />
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={handleLoadDefault}
                disabled={isCameraAnimating}
              >
                Load Default Duck & Reset
              </Button>
              <Button onClick={handleEditButtonClick} className="px-8 py-3 text-lg my-5" disabled={isCameraAnimating}>
                Edit
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-semibold mb-3">Camera Presets</h3>
                <div className="flex flex-wrap gap-2">
                  {["Front", "Back", "Top", "Left", "Right"].map((name) => (
                    <Button
                      variant="outline"
                      size="sm"
                      key={name}
                      onClick={() => {
                        if (isCameraAnimating) return
                        setIsCameraAnimating(true)
                        setViewPreset(name.toLowerCase() as any, () => setIsCameraAnimating(false))
                      }}
                      disabled={isCameraAnimating}
                    >
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-3">Model Rotation (Degrees)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["x", "y", "z"] as const).map((axis, i) => (
                    <div key={axis}>
                      <Label htmlFor={`rot-${axis}`} className="uppercase">
                        {axis}-axis
                      </Label>
                      <Input
                        id={`rot-${axis}`}
                        type="number"
                        step="any"
                        value={Number.parseFloat(((modelRotation[i] * 180) / Math.PI).toFixed(2))}
                        onChange={(e) => handleModelRotationChange(axis, e.target.value)}
                        className="mt-1"
                        disabled={isCameraAnimating || isEditMode}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-3">Live Camera View (Degrees)</h3>
                {liveCameraAngles ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-2 border rounded-md bg-background">
                    <div>
                      <span className="font-medium text-muted-foreground">Azimuthal:</span>{" "}
                      {liveCameraAngles.azimuthal.toFixed(1)}°
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Polar:</span>{" "}
                      {liveCameraAngles.polar.toFixed(1)}°
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Interact with model to see live values.</p>
                )}
              </div>
              <div>
                <h3 className="text-base font-semibold mb-3">Lighting & Materials</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="light-intensity">Env Intensity: {lightingIntensity.toFixed(1)}</Label>
                    <Input
                      id="light-intensity"
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={lightingIntensity}
                      onChange={(e) => setLightingIntensity(Number.parseFloat(e.target.value))}
                      disabled={isCameraAnimating}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="spotlights"
                      checked={useSpotlightSetup}
                      onChange={(e) => setUseSpotlightSetup(e.target.checked)}
                      disabled={isCameraAnimating}
                    />
                    <Label htmlFor="spotlights">Spotlight Setup</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="material-override"
                      checked={materialOverride}
                      onChange={(e) => setMaterialOverride(e.target.checked)}
                      disabled={isCameraAnimating}
                    />
                    <Label htmlFor="material-override">Override Dark Materials</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Custom Points of View</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Label htmlFor="pov-name">POV Name</Label>
                  <Input
                    id="pov-name"
                    value={povNameInput}
                    onChange={(e) => setPovNameInput(e.target.value)}
                    className="mt-1"
                    disabled={isCameraAnimating}
                  />
                </div>
                <Button onClick={handleAddPov} disabled={isCameraAnimating || !povNameInput.trim()}>
                  Add POV
                </Button>
              </div>
              {povs.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {povs.map((p) => (
                    <Button
                      key={p.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => applyPov(p.id)}
                      disabled={isCameraAnimating}
                    >
                      {p.name}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className={`flex flex-col items-center lg:sticky lg:top-8 h-max`}>
          <motion.div
            className="relative w-full max-w-xl overflow-hidden border"
            style={{ aspectRatio: "4 / 5" }}
            animate={{ zIndex: isEditMode ? 20 : 10 }}
            transition={{ duration: 0.1 }}
          >
            <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
              <ControlsUpdater controlsRef={orbitControlsRef} />
              <Suspense
                fallback={
                  <Html center className="text-foreground">
                    Loading...
                  </Html>
                }
                key={modelUrl}
              >
                <Stage
                  environment="city"
                  intensity={lightingIntensity}
                  adjustCamera={stageAdjustCamera}
                  shadows={{ type: "contact", opacity: 0.2, blur: 2 }}
                >
                  <ambientLight intensity={0.4} />
                  {useSpotlightSetup && (
                    <>
                      <spotLight position={[5, 5, 5]} intensity={1} angle={0.3} penumbra={0.2} castShadow />
                      <spotLight position={[-5, 5, 5]} intensity={0.7} angle={0.3} penumbra={0.2} />
                      <spotLight position={[0, 5, -5]} intensity={0.5} angle={0.3} penumbra={0.2} />
                    </>
                  )}
                  {modelUrl ? (
                    <Model url={modelUrl} rotation={modelRotation} materialOverride={materialOverride} />
                  ) : (
                    <Html center>No model</Html>
                  )}
                </Stage>
              </Suspense>
              <OrbitControls
                ref={orbitControlsRef}
                makeDefault
                minDistance={0.5}
                maxDistance={30}
                onChange={handleOrbitControlsChange}
                enableDamping
                dampingFactor={0.1}
                enabled={!isEditMode && !isCameraAnimating}
              />
              <Environment preset="city" />
            </Canvas>

            <AnimatePresence>
              {isEditMode && !isCameraAnimating && (
                <motion.div
                  className="absolute inset-0 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CircularPicker className="bg-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="mt-6 w-full max-w-xl flex justify-center gap-4">
            {isEditMode &&
              <>
                <Button
                  onClick={handleCancelEditClick}
                  variant="outline"
                  className="px-8 py-3 text-lg"
                  disabled={isCameraAnimating}
                  size={"sm"}
                >
                  <CheckIcon/>
                  Done
                </Button>
                {/* <Button
                  onClick={() => {
                    if (isCameraAnimating) return
                    setIsCameraAnimating(true)
                    setIsCustomPovActive(true)
                    setViewPreset("back", () => {
                      setIsCameraAnimating(false)
                    })
                  }}
                  variant="secondary"
                  className="px-6 py-3"
                  disabled={isCameraAnimating}
                  size={"sm"}
                >
                  View Back
                </Button> */}
              </>
            }
          </div>
          <footer
            className={`mt-8 text-center text-sm text-muted-foreground transition-opacity duration-300 ${isEditMode || isCameraAnimating ? "opacity-30 pointer-events-none" : "opacity-100"}`}
          >
            <p>Drag to rotate, scroll to zoom. Use controls for specific views.</p>
          </footer>
        </div>
      </div>
    </div>
  )
}

useGLTF.preload("/assets/3d/duck.glb")
