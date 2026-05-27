
import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Service } from "../types";
import { SectionHeading } from "./SectionHeading";

gsap.registerPlugin(ScrollTrigger);

type ServicesPreviewProps = {
  services: Service[];
};

export const ServicesPreview = ({ services }: ServicesPreviewProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 56, autoAlpha: 0, scale: 0.95 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: { amount: 0.55, from: "start" },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 82%",
            once: true
          }
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section-shell services-preview">
      <SectionHeading
        eyebrow="Services"
        title="A focused team for commerce, design, and software delivery."
        copy="Six tightly scoped service lines — each with clear deliverables, proven platforms, and a direct path from brief to launch."
      />

      <div className="services-grid" ref={gridRef}>
        {services.map((service, index) => (
          <article
            className="service-card"
            key={service.slug}
            data-card-interactive
            style={{ "--service-accent": service.accent } as React.CSSProperties}
          >
            <div className="service-card__media-wrap">
              <span className="service-card__index">{String(index + 1).padStart(2, "0")}</span>
              <div
                className="service-card__media"
                style={{
                  backgroundImage: service.imageUrl ? `url(${service.imageUrl})` : undefined
                }}
                role="img"
                aria-label={service.title}
              />
            </div>

            <div className="service-card__body">
              <p className="eyebrow">{service.kicker}</p>
              <h3>{service.title}</h3>
              <p>{service.summary}</p>
            </div>

            <Link
              className="service-card__cta"
              to={`/services/${service.slug}`}
              aria-label={`Learn about ${service.title}`}
            >
              <span>View service</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};
