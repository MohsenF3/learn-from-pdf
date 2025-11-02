"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";

export function useConfetti() {
  const fireworks = useCallback(() => {
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    let animationFrameId: number;

    const frame = () => {
      confetti({
        particleCount: 2 + Math.random() * 2,
        angle: 60,
        spread: 50 + Math.random() * 10,
        origin: { x: 0 },
        colors: ["#4ade80", "#22c55e", "#86efac"], // Green palette
      });

      // Right side burst
      confetti({
        particleCount: 2 + Math.random() * 2,
        angle: 120,
        spread: 50 + Math.random() * 10,
        origin: { x: 1 },
        colors: ["#4ade80", "#22c55e", "#86efac"],
      });

      if (Date.now() < end) {
        animationFrameId = requestAnimationFrame(frame);
      }
    };

    animationFrameId = requestAnimationFrame(frame);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { fireworks };
}
