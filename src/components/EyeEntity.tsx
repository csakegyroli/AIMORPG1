"use client";

import { useEffect, useState, type CSSProperties } from "react";

type EyeEntityProps = { mode?: "scene" | "compact"; label?: string; className?: string };
type Gaze = { x: number; y: number; duration: number };

/** Shared canonical Eye visual. Every placement uses the same source artwork and gaze behavior. */
export function EyeEntity({ mode = "scene", label = "A Szem — Varoth megfigyelője", className = "" }: EyeEntityProps) {
  const [gaze, setGaze] = useState<Gaze>({ x: 0, y: 0, duration: 0.8 });
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;
    let disposed = false;

    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const schedule = () => {
      clearTimer();
      if (disposed || media.matches) return;
      timer = window.setTimeout(() => {
        if (disposed || media.matches) return;
        // Irregular, bounded gaze targets with occasional returns to the resting focus.
        const choices = [
          { x: -5, y: 0 }, { x: 5, y: -3 }, { x: 1, y: 4 }, { x: -2, y: -4 },
          { x: 4, y: 2 }, { x: 0, y: 0 }, { x: -4, y: 2 }, { x: 2, y: -1 },
        ];
        const target = choices[Math.floor(Math.random() * choices.length)];
        const scale = mode === "scene" ? 1 : 0.8;
        setGaze({ x: target.x * scale, y: target.y * scale, duration: 0.48 + Math.random() * 0.72 });
        schedule();
      }, 850 + Math.random() * 2250);
    };

    const onMotionPreferenceChange = () => {
      clearTimer();
      if (media.matches) {
        setGaze({ x: 0, y: 0, duration: 0 });
      } else {
        schedule();
      }
    };

    if (!media.matches) schedule();
    media.addEventListener("change", onMotionPreferenceChange);
    return () => {
      disposed = true;
      clearTimer();
      media.removeEventListener("change", onMotionPreferenceChange);
    };
  }, [mode]);

  return <span className={`eye-entity eye-entity--${mode} ${className}`} role="img" aria-label={label}>
    <img className="eye-entity-art" src="/assets/world/eye-canonical.webp" alt="" draggable={false} />
    <span className="eye-entity-gaze" aria-hidden="true" style={{ "--eye-x": `${gaze.x}px`, "--eye-y": `${gaze.y}px`, "--eye-duration": `${gaze.duration}s` } as CSSProperties}>
      <span className="eye-entity-iris"><span className="eye-entity-pupil" /></span>
    </span>
  </span>;
}

export function EyeMark({ className = "" }: { className?: string }) {
  return <svg className={`eye-mark ${className}`} viewBox="0 0 48 32" aria-hidden="true" focusable="false">
    <path d="M2 16C8 7 15 3 24 3s16 4 22 13c-6 9-13 13-22 13S8 25 2 16Z" fill="none" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="24" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2.3" />
    <circle cx="24" cy="16" r="3.4" fill="currentColor" />
  </svg>;
}
