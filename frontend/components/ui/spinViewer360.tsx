"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface SpinViewer360Props {
  images: string[];
  alt: string;
}

/**
 * WHY: Provide a true drag-based 360 viewer when frame sequences are available.
 */
export const SpinViewer360 = ({ images, alt }: SpinViewer360Props) => {
  const validImages = useMemo(
    () => images.filter((src) => Boolean(src && src.trim())),
    [images],
  );
  const frameCount = validImages.length;
  const hasFrameSequence = frameCount > 1;

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const lastX = useRef(0);
  const pixelAccumulator = useRef(0);
  const spinRaf = useRef<number | null>(null);

  const stopSpin = useCallback(() => {
    if (spinRaf.current !== null) {
      cancelAnimationFrame(spinRaf.current);
      spinRaf.current = null;
    }
    setIsSpinning(false);
  }, []);

  const rotateBySteps = useCallback(
    (steps: number) => {
      if (frameCount <= 1) return;
      setCurrentFrame((prev) => {
        const next = (prev + steps) % frameCount;
        return next < 0 ? next + frameCount : next;
      });
    },
    [frameCount],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      stopSpin();
      lastX.current = e.clientX;
      pixelAccumulator.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [stopSpin],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !hasFrameSequence) return;
      const deltaX = e.clientX - lastX.current;
      lastX.current = e.clientX;
      pixelAccumulator.current += deltaX;

      const pixelsPerFrame = 10;
      const steps = Math.trunc(pixelAccumulator.current / pixelsPerFrame);
      if (steps !== 0) {
        rotateBySteps(steps);
        pixelAccumulator.current -= steps * pixelsPerFrame;
      }
    },
    [hasFrameSequence, isDragging, rotateBySteps],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleReset = useCallback(() => {
    stopSpin();
    setCurrentFrame(0);
  }, [stopSpin]);

  const handleSpin360 = useCallback(() => {
    if (!hasFrameSequence) return;

    stopSpin();
    setIsSpinning(true);

    const startFrame = currentFrame;
    const totalSteps = frameCount;
    const durationMs = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      const nextStep = Math.floor(progress * totalSteps);
      const nextFrame = (startFrame + nextStep) % frameCount;
      setCurrentFrame(nextFrame);

      if (progress < 1) {
        spinRaf.current = requestAnimationFrame(tick);
      } else {
        spinRaf.current = null;
        setIsSpinning(false);
      }
    };

    spinRaf.current = requestAnimationFrame(tick);
  }, [currentFrame, frameCount, hasFrameSequence, stopSpin]);

  const displayedImage = validImages[currentFrame] ?? validImages[0] ?? "";

  useEffect(() => {
    return () => {
      if (spinRaf.current !== null) {
        cancelAnimationFrame(spinRaf.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full lg:w-[420px] lg:sticky lg:top-24">
      <div
        className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-gray-100 p-6 aspect-square flex items-center justify-center select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={displayedImage}
          alt={alt}
          draggable={false}
          className="object-contain max-w-full max-h-full drop-shadow-xl"
        />

        {hasFrameSequence ? (
          <motion.div
            className="pointer-events-none absolute bottom-4 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm"
            animate={{ x: [-8, 8, -8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Drag to rotate 360
          </motion.div>
        ) : (
          <div className="pointer-events-none absolute bottom-4 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-sm">
            Add more angle images for real 360
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleSpin360}
          disabled={!hasFrameSequence || isSpinning}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Spin 360
        </button>
        <button
          onClick={handleReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95"
        >
          Reset view
        </button>
      </div>
    </div>
  );
};
