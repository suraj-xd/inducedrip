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
import { motion, AnimatePresence } from "framer-motion";
import ThreeDButton from "@/components/command-drip/3d-button";
import CircularPickerHat from "./hat-patch-selector";
import { useResizeAnimation } from "@/hooks/use-resize-animation";

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

const modelUrl = "/glb/Black_Cap.glb";

export default function ThreeDHatViewer() {

  const [modelRotation, setModelRotation] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null!);

  const [isCustomPovActive, setIsCustomPovActive] = useState<boolean>(false);

  const lightingIntensity = 1.2;
  const useSpotlightSetup = true;
  const materialOverride = false;

  // Use the global resize animation utility
  const { heightPercentage, triggerResizeAnimation } = useResizeAnimation();

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [liveCameraAngles, setLiveCameraAngles] =
    useState<LiveCameraAngles | null>(null);
  const [isCameraAnimating, setIsCameraAnimating] = useState<boolean>(false);


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


  const handleEditButtonClick = () => {
    if (isCameraAnimating) return;
    setIsCameraAnimating(true);

    // Trigger resize animation
    triggerResizeAnimation();

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }
    setIsCustomPovActive(true);

    setViewPreset("right", () => {
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
                <CircularPickerHat className="bg-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {!isEditMode ? (
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-[100]">
          <ThreeDButton className="px-5 py-3" onClick={handleEditButtonClick}>
            Try on Patch
          </ThreeDButton>
        </div>
      ) : (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center z-[1000]">
          <ThreeDButton className="px-5 py-3" onClick={handleCancelEditClick}>
            Done
          </ThreeDButton>
        </div>
      )}
      {/* </div> */}
    </div>
  );
}

useGLTF.preload(modelUrl);
