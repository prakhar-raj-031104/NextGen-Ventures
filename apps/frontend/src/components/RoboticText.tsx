import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%@><|_=~";

interface Props {
  text: string;
  className?: string;
  startDelay?: number;
  charDelay?: number;
  scrambleDuration?: number;
}

export const RoboticText = ({
  text,
  className = "",
  startDelay = 300,
  charDelay = 68,
  scrambleDuration = 210,
}: Props) => {
  const [state, setState] = useState<{ char: string; locked: boolean }[]>(
    () => text.split("").map(() => ({ char: "", locked: false }))
  );

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    text.split("").forEach((finalChar, i) => {
      const offset = startDelay + i * charDelay;

      const tick = (elapsed: number) => {
        if (cancelled) return;

        if (elapsed >= scrambleDuration || finalChar === " ") {
          setState((prev) =>
            prev.map((s, j) => (j === i ? { char: finalChar, locked: true } : s))
          );
          return;
        }

        setState((prev) =>
          prev.map((s, j) =>
            j === i
              ? { char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)], locked: false }
              : s
          )
        );
        timers.push(setTimeout(() => tick(elapsed + 45), 45));
      };

      timers.push(setTimeout(() => tick(0), offset));
    });

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [text, startDelay, charDelay, scrambleDuration]);

  return (
    <p className={`robotic-text ${className}`} aria-label={text}>
      {state.map(({ char, locked }, i) => (
        <span
          key={i}
          className={`robotic-char${locked ? " robotic-char--locked" : char ? " robotic-char--active" : ""}`}
          aria-hidden="true"
        >
          {char || " "}
        </span>
      ))}
    </p>
  );
};
  