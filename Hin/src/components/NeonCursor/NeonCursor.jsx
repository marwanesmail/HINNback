"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import "./NeonCursor.css";

const NeonCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
    });
  }, []);

  const handleMouseDown = useCallback(() => setIsClicking(true), []);
  const handleMouseUp = useCallback(() => setIsClicking(false), []);

  const handleMouseOver = useCallback((e) => {
    const target = e.target;
    if (target.matches('a, button, input, [data-hover="true"]')) {
      setIsHovering(true);
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    setIsHovering(false);
  }, []);

  useEffect(() => {
    const options = { passive: true };

    window.addEventListener("mousemove", handleMouseMove, options);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
    };
  }, [handleMouseMove, handleMouseOver, handleMouseOut]);

  const cursorVariants = useMemo(
    () => ({
      main: {
        x: position.x - 10,
        y: position.y - 10,
        scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
      },
      trail: {
        x: position.x - 20,
        y: position.y - 20,
      },
      glow: {
        x: position.x - 30,
        y: position.y - 30,
      },
    }),
    [position.x, position.y, isClicking, isHovering]
  );

  const transitionConfig = useMemo(
    () => ({
      type: "spring",
      damping: 25,
      stiffness: 350,
      mass: 0.5,
    }),
    []
  );

  return (
    <div className="neon-cursor-container">
      <motion.div
        className="cursor-main"
        animate={cursorVariants.main}
        transition={transitionConfig}
      />

      <motion.div
        className="cursor-trail"
        animate={cursorVariants.trail}
        transition={{
          ...transitionConfig,
          damping: 30,
          stiffness: 200,
          mass: 0.8,
        }}
      />

      <motion.div
        className="cursor-glow"
        animate={cursorVariants.glow}
        transition={{
          ...transitionConfig,
          damping: 40,
          stiffness: 150,
          mass: 1,
        }}
      />
    </div>
  );
};

export default NeonCursor;
