import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../types";

gsap.registerPlugin(ScrollTrigger);

type HorizontalProjectsProps = {
  projects: Project[];
};

export const HorizontalProjects = ({ projects }: HorizontalProjectsProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const desktop = window.matchMedia("(min-width: 900px)").matches;

    if (reducedMotion || !desktop) {
      return;
    }

    const context = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.6}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });
    }, section);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => context.revert();
  }, [projects]);

  return (
    <section className="horizontal-projects" ref={sectionRef}>
      <div className="horizontal-heading" data-reveal="left">
        <p className="eyebrow">Selected Work</p>
        <h2>Real case studies. Measurable results.</h2>
        <Link className="text-link" to="/projects">
          View all projects
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <div className="project-track" ref={trackRef}>
        {projects.map((project) => (
          <article
            className="project-panel"
            key={project.slug}
            data-card-interactive
            style={{ "--project-color": project.color } as CSSProperties}
          >
            <div
              className="project-panel__image"
              style={{ backgroundImage: `url(${project.imageUrl})` }}
              role="img"
              aria-label={`${project.title} preview`}
            />
            <div className="project-panel__content">
              <div>
                <p className="eyebrow">
                  {project.client} / {project.year}
                </p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <div className="metric-row">
                {project.metrics.map((metric) => (
                  <span key={metric.label}>
                    <strong>{metric.value}</strong>
                    {metric.label}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
