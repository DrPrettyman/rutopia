"use client";

import { useEffect, useRef } from "react";

/** Sprite strips built from public/ComputerGifs by scripts/build-title-sprites.py. */
const LETTERS = ["R", "U", "T", "O", "P", "I", "A"];
// Must match the GIFs and --animate-title-frames in globals.css.
const TITLE_FRAMES = 37;
const TITLE_FRAME_MS = 30;

/**
 * The flashing-computer title. Each letter is a CSS-animated sprite strip
 * rather than a GIF, so it can start on a random frame (a negative
 * animation-delay), chosen after hydration so server and client HTML match.
 */
export function TitleLetters() {
  const strips = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    for (const el of strips.current) {
      if (!el) continue;
      const frame = Math.floor(Math.random() * TITLE_FRAMES);
      el.style.animationDelay = `-${frame * TITLE_FRAME_MS}ms`;
    }
  }, []);

  return (
    <span aria-hidden className="flex justify-center gap-1 sm:gap-2">
      {LETTERS.map((letter, i) => (
        <span key={letter} className="relative aspect-square w-[13%] max-w-36 overflow-hidden">
          <span
            ref={(el) => {
              strips.current[i] = el;
            }}
            className="absolute inset-y-0 left-0 animate-title-frames motion-reduce:animate-none"
            style={{
              width: `${TITLE_FRAMES * 100}%`,
              backgroundImage: `url(/title/${letter}.webp)`,
              backgroundSize: "100% 100%",
            }}
          />
        </span>
      ))}
    </span>
  );
}
