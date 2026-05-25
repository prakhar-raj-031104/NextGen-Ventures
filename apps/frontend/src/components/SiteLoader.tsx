import { useEffect, useState } from "react";

export const SiteLoader = () => {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setMounted(false);
      return;
    }

    const start = performance.now();
    const duration = 1800;
    let frame = 0;
    let exitTimer = 0;
    let unmountTimer = 0;

    const tick = (time: number) => {
      const elapsed = time - start;
      const raw = elapsed / duration;
      // ease-out cubic so it decelerates near 100
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      const nextProgress = Math.min(100, Math.round(eased * 100));
      setProgress(nextProgress);

      if (nextProgress < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }

      exitTimer = window.setTimeout(() => setExiting(true), 300);
      unmountTimer = window.setTimeout(() => setMounted(false), 1100);
    };

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  const pct = String(progress).padStart(3, "0");

  return (
    <div
      className={`site-loader${exiting ? " site-loader--exit" : ""}`}
      role="status"
      aria-label="NextGen Ventures loading"
    >
      {/* Corner labels */}
      <span className="loader-corner loader-corner--tl">Est. 2026</span>
      <span className="loader-corner loader-corner--tr">{pct}%</span>
      <span className="loader-corner loader-corner--bl">Bengaluru, India</span>
      <span className="loader-corner loader-corner--br">nextgenventures.in</span>

      {/* Center brand */}
      <div className="loader-stage">
        <div className="loader-mark" aria-hidden="true">
          <span>NG</span>
        </div>

        <div className="loader-wordmark" aria-hidden="true">
          <div className="loader-word-row">
            <span className="loader-word loader-word--a">NEXTGEN</span>
          </div>
          <div className="loader-word-row">
            <span className="loader-word loader-word--b">VENTURES</span>
          </div>
        </div>

        <div className="loader-rule" aria-hidden="true" />

        <p className="loader-tagline" aria-hidden="true">
          Commerce &nbsp;·&nbsp; Design &nbsp;·&nbsp; Engineering
        </p>
      </div>

      {/* Progress bar */}
      <div className="loader-track" aria-hidden="true">
        <span
          className="loader-fill"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
};
