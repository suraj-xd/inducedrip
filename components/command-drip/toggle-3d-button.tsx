import { motion } from "framer-motion";
import { CubeFocusIcon, PerspectiveIcon } from "@phosphor-icons/react";

export default function Toggle3DButton({
  showIn3D,
  setShowIn3D,
}: {
  showIn3D: boolean;
  setShowIn3D: (showIn3D: boolean) => void;
}) {
  return (
    <motion.button
      onClick={() => setShowIn3D(!showIn3D)}
      className="border w-full flex justify-center items-center gap-2 bg-white text-black p-4 text-xs uppercase font-semibold tracking-[1.1px]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {showIn3D ? (
        <>
          <PerspectiveIcon size={16} />
          Back to 2D
        </>
      ) : (
        <>
          <CubeFocusIcon size={16} />
          View in 3D
        </>
      )}
    </motion.button>
  );
}
