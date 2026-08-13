"use client";

import { motion, useReducedMotion } from "motion/react";

export function ParallaxFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}
