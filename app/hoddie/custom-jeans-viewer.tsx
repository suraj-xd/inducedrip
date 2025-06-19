"use client";

import type React from "react"; // Corrected import
import { useState, Suspense, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Html,
  Environment,
  Stage,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCircleIcon, CheckIcon } from "@phosphor-icons/react";
// import CircularPicker from "@/components/products/jeans/animation";
import ThreeDButton from "./3d-button";
import HoddieCircularPicker from "@/components/hoddie/animation";
import { useResizeAnimation } from "@/hooks/use-resize-animation";

interface POV {
  id: string;
  name: string;
  modelRotation: [number, number, number];
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

interface LiveCameraAngles {
  azimuthal: number;
  polar: number;
}

// New component to handle useFrame for OrbitControls
function ControlsUpdater({
  controlsRef,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}) {
  useFrame(() => {
    if (controlsRef.current?.enableDamping) {
      controlsRef.current.update();
    }
  });
  return null; // This component doesn't render anything itself
}

function Model({
  url,
  rotation,
  materialOverride,
}: {
  url: string;
  rotation: [number, number, number];
  materialOverride: boolean;
}) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        if (materialOverride) {
          child.material.color.setHex(0xbbbbbb);
          child.material.roughness = 0.6;
          child.material.metalness = 0.2;
        }
      }
    });
  }, [scene, materialOverride]);

  return (
    <group rotation={rotation}>
      <primitive object={scene} />
    </group>
  );
}

export default function CustomJeansViewer() {
  const [modelUrl, setModelUrl] = useState<string | null>(
    "/glb/Gray_Comfort_Ensemble_0619094515_texture.glb"
  );
  const [error, setError] = useState<string | null>(null);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null!);

  const [povs, setPovs] = useState<POV[]>([]);
  const [povNameInput, setPovNameInput] = useState<string>("");
  const [isCustomPovActive, setIsCustomPovActive] = useState<boolean>(false);

  const [lightingIntensity, setLightingIntensity] = useState<number>(1.2);
  const [useSpotlightSetup, setUseSpotlightSetup] = useState<boolean>(true);
  const [materialOverride, setMaterialOverride] = useState<boolean>(false);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [liveCameraAngles, setLiveCameraAngles] =
    useState<LiveCameraAngles | null>(null);
  const [isCameraAnimating, setIsCameraAnimating] = useState<boolean>(false);
  
  // Use the global resize animation utility
  const { heightPercentage, triggerResizeAnimation } = useResizeAnimation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".glb") || file.name.endsWith(".gltf")) {
        const objectURL = URL.createObjectURL(file);
        setModelUrl(objectURL);
        setError(null);
        setModelRotation([0, 0, 0]);
        setIsCustomPovActive(false);
        setIsEditMode(false);
        if (
          modelUrl &&
          modelUrl !== "/assets/3d/duck.glb" &&
          modelUrl.startsWith("blob:")
        ) {
          URL.revokeObjectURL(modelUrl);
        }
      } else {
        setError("Invalid file type. Please upload a .glb or .gltf file.");
        setModelUrl(null);
      }
    }
  };

  const handleOrbitControlsChange = useCallback(() => {
    if (orbitControlsRef.current) {
      const azimuthal = orbitControlsRef.current.getAzimuthalAngle();
      const polar = orbitControlsRef.current.getPolarAngle();
      setLiveCameraAngles({
        azimuthal: (azimuthal * 180) / Math.PI,
        polar: (polar * 180) / Math.PI,
      });
    }
  }, []);

  const setViewPreset = useCallback(
    (
      preset: "front" | "back" | "top" | "left" | "right",
      onComplete?: () => void
    ) => {
      if (!orbitControlsRef.current) {
        if (onComplete) onComplete();
        return;
      }
      const controls = orbitControlsRef.current;

      const currentlyCustom = isCustomPovActive;
      const shouldTemporarilyDisableStageAdjust =
        !isEditMode && !isCameraAnimating;

      if (shouldTemporarilyDisableStageAdjust) {
        setIsCustomPovActive(true);
      }

      requestAnimationFrame(() => {
        if (!orbitControlsRef.current) {
          if (onComplete) onComplete();
          return;
        }
        switch (preset) {
          case "front":
            controls.setAzimuthalAngle(0);
            controls.setPolarAngle(Math.PI / 2);
            break;
          case "back":
            controls.setAzimuthalAngle(Math.PI);
            controls.setPolarAngle(Math.PI / 2);
            break;
          case "top":
            controls.setAzimuthalAngle(0);
            controls.setPolarAngle(0.01);
            break;
          case "left":
            controls.setAzimuthalAngle(-Math.PI / 2);
            controls.setPolarAngle(Math.PI / 2);
            break;
          case "right":
            controls.setAzimuthalAngle(Math.PI / 2);
            controls.setPolarAngle(Math.PI / 2);
            break;
        }
        handleOrbitControlsChange();

        if (onComplete) {
          setTimeout(onComplete, 150);
        }

        if (shouldTemporarilyDisableStageAdjust) {
          setTimeout(() => setIsCustomPovActive(currentlyCustom), 200);
        }
      });
    },
    [
      isCustomPovActive,
      isEditMode,
      handleOrbitControlsChange,
      isCameraAnimating,
    ]
  );

  const handleLoadDefault = () => {
    if (isCameraAnimating) return;
    if (
      modelUrl &&
      modelUrl !== "/assets/3d/duck.glb" &&
      modelUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl("/assets/3d/duck.glb");
    setError(null);
    setModelRotation([0, 0, 0]);
    setIsCustomPovActive(false);
    setIsEditMode(false);
    const input = document.getElementById("model-upload") as HTMLInputElement;
    if (input) input.value = "";

    setIsCameraAnimating(true);
    setViewPreset("front", () => {
      setIsCameraAnimating(false);
      if (orbitControlsRef.current) orbitControlsRef.current.enabled = true;
    });
  };

  const handleModelRotationChange = (axis: "x" | "y" | "z", value: string) => {
    const degrees = Number.parseFloat(value);
    if (isNaN(degrees)) return;
    const radians = (degrees * Math.PI) / 180;
    const newRotation = [...modelRotation] as [number, number, number];
    if (axis === "x") newRotation[0] = radians;
    else if (axis === "y") newRotation[1] = radians;
    else if (axis === "z") newRotation[2] = radians;
    setModelRotation(newRotation);
  };

  const handleAddPov = () => {
    if (!povNameInput.trim() || !orbitControlsRef.current?.object) return;
    const newPov: POV = {
      id: crypto.randomUUID(),
      name: povNameInput.trim(),
      modelRotation: [...modelRotation],
      cameraPosition: orbitControlsRef.current.object.position.toArray() as [
        number,
        number,
        number
      ],
      cameraTarget: orbitControlsRef.current.target.toArray() as [
        number,
        number,
        number
      ],
    };
    setPovs((prev) => [...prev, newPov]);
    setPovNameInput("");
  };

  const applyPov = (povId: string) => {
    if (isCameraAnimating) return;
    const pov = povs.find((p) => p.id === povId);
    if (!pov || !orbitControlsRef.current?.object) return;

    setIsCameraAnimating(true);
    setIsCustomPovActive(true);

    requestAnimationFrame(() => {
      if (!orbitControlsRef.current || !orbitControlsRef.current.object) {
        setIsCameraAnimating(false);
        return;
      }
      setModelRotation([...pov.modelRotation]);
      orbitControlsRef.current.object.position.set(...pov.cameraPosition);
      orbitControlsRef.current.target.set(...pov.cameraTarget);
      handleOrbitControlsChange();
      setTimeout(() => setIsCameraAnimating(false), 150);
    });
  };

  const handleEditButtonClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);

    // Trigger resize animation
    triggerResizeAnimation();

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
    setIsCustomPovActive(true);

    setViewPreset("back", () => {
      setIsEditMode(true);
      setIsCameraAnimating(false);
    });
  };

  const handleCancelEditClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);

    setIsEditMode(false);

    setViewPreset("front", () => {
      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }
      setIsCustomPovActive(false);
      setIsCameraAnimating(false);
    });
  };

  useEffect(() => {
    if (orbitControlsRef.current) {
      handleOrbitControlsChange();
    }
  }, [handleOrbitControlsChange]);

  useEffect(() => {
    return () => {
      if (
        modelUrl &&
        modelUrl !== "/assets/3d/duck.glb" &&
        modelUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  const stageAdjustCamera =
    !isEditMode && !isCustomPovActive && !isCameraAnimating ? 1.5 : false;

  return (
    <div
      className="h-full w-full bg-gradient-to-br from-[#ebebeb] to-[#f2f2f2] overflow-hidden relative max-h-[600px] transition-all duration-200 ease-in-out"
      style={{ 
        aspectRatio: "5/6.3",
        height: `${heightPercentage}%`
      }}
    >
      <div className={`flex flex-col items-center lg:sticky lg:top-8 h-full`}>
        <motion.div
          className="relative w-full overflow-hidden h-full"
          style={{ aspectRatio: "5/6.3" }}
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
                    <spotLight
                      position={[5, 5, 5]}
                      intensity={1}
                      angle={0.3}
                      penumbra={0.2}
                      castShadow
                    />
                    <spotLight
                      position={[-5, 5, 5]}
                      intensity={0.7}
                      angle={0.3}
                      penumbra={0.2}
                    />
                    <spotLight
                      position={[0, 5, -5]}
                      intensity={0.5}
                      angle={0.3}
                      penumbra={0.2}
                    />
                  </>
                )}
                {modelUrl ? (
                  <Model
                    url={modelUrl}
                    rotation={modelRotation}
                    materialOverride={materialOverride}
                  />
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
                <HoddieCircularPicker className="bg-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

useGLTF.preload("/assets/3d/duck.glb");
