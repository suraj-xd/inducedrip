import { motion } from "framer-motion";

export default function MotionFadeVarientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const fadeVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };

  const fadeTransition = {
    duration: 0.4,
    ease: [0.4, 0.0, 0.2, 1],
  };
  return (
    <motion.div
      key="3d-viewer"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={fadeTransition as any}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
