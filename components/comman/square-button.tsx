import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
export function BlackButton({
  onClick,
  disabled,
  children,
  icon,
  variant = "black",
  ...props
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant: "black" | "white";
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 font-ppMondwest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2",
        variant === "black" && "bg-black text-white",
        variant === "white" && "bg-white text-black"
      )}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}