import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const usePageAnimations = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const context = gsap.context(() => {
      const compactViewport = window.matchMedia("(max-width: 700px)").matches;
      const sideOffset = compactViewport ? 28 : 72;

      // ── Section headings — cascade: eyebrow → title → copy ────────────
      gsap.utils.toArray<HTMLElement>("[data-section-heading]").forEach((heading) => {
        const children = Array.from(heading.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { x: -sideOffset, autoAlpha: 0, filter: "blur(8px)" },
          {
            x: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: heading,
              start: "top 87%",
              once: true
            }
          }
        );
      });

      // ── Individual [data-reveal] elements — float in from sides ───────
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element, index) => {
        const requestedDirection = element.dataset.reveal;
        const direction =
          requestedDirection === "right" ? 1 : requestedDirection === "left" ? -1 : index % 2 ? 1 : -1;

        gsap.fromTo(
          element,
          { x: direction * sideOffset, y: 16, autoAlpha: 0, filter: "blur(10px)" },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true
            }
          }
        );
      });

      // ── Generic [data-stagger] containers ─────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((container) => {
        const children = Array.from(container.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { y: 36, autoAlpha: 0, filter: "blur(8px)" },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.13,
            ease: "expo.out",
            scrollTrigger: {
              trigger: container,
              start: "top 87%",
              once: true
            }
          }
        );
      });

      // ── Scale-in elements ──────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-scale]").forEach((element) => {
        gsap.fromTo(
          element,
          { scale: 0.92, autoAlpha: 0, filter: "blur(6px)" },
          {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%",
              once: true
            }
          }
        );
      });

      // ── Stat counter animations ────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
        const raw = element.dataset.count ?? "0";
        const target = parseFloat(raw);
        const suffix = element.dataset.suffix ?? "";
        const prefix = element.dataset.prefix ?? "";

        const obj = { value: 0 };
        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          },
          onUpdate() {
            const rounded = Number.isInteger(target)
              ? Math.round(obj.value)
              : obj.value.toFixed(1);
            element.textContent = `${prefix}${rounded}${suffix}`;
          }
        });
      });

      // ── Process cards — spring landing from below ──────────────────────
      gsap.utils.toArray<HTMLElement>(".process-rail").forEach((rail) => {
        const cards = Array.from(rail.querySelectorAll<HTMLElement>("article"));
        gsap.fromTo(
          cards,
          { y: 80, scale: 0.88, autoAlpha: 0 },
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.85,
            ease: "back.out(1.4)",
            stagger: 0.14,
            scrollTrigger: {
              trigger: rail,
              start: "top 83%",
              once: true
            }
          }
        );
      });

      // ── Testimonial cards — fan in: left · bottom · right ─────────────
      gsap.utils.toArray<HTMLElement>(".testimonials-grid").forEach((grid) => {
        const cards = Array.from(grid.querySelectorAll<HTMLElement>(".testimonial-card"));
        const fromStates = [
          { x: -70, y: 24, rotate: -3, autoAlpha: 0 },
          { x: 0,   y: 70, rotate:  0, autoAlpha: 0, scale: 0.93 },
          { x:  70, y: 24, rotate:  3, autoAlpha: 0 }
        ];

        cards.forEach((card, i) => {
          const from = fromStates[i] ?? { y: 50, autoAlpha: 0 };
          gsap.fromTo(
            card,
            from,
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 1,
              ease: "expo.out",
              delay: i * 0.13,
              scrollTrigger: {
                trigger: grid,
                start: "top 84%",
                once: true
              }
            }
          );
        });
      });

      // ── Parallax on hero visual ────────────────────────────────────────
      const heroVisual = document.querySelector<HTMLElement>(".hero-visual");
      if (heroVisual) {
        gsap.to(heroVisual, {
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.4
          }
        });
      }

      // ── Horizontal line reveal for section borders ─────────────────────
      gsap.utils
        .toArray<HTMLElement>(".process-section, .closing-cta, .service-fit")
        .forEach((element) => {
          gsap.fromTo(
            element,
            { "--border-progress": "0%" },
            {
              "--border-progress": "100%",
              ease: "none",
              scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "top 60%",
                scrub: true
              }
            }
          );
        });
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, [location.pathname]);
};
