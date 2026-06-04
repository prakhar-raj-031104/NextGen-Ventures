import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowUpRight, ExternalLink, Quote } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fallbackProjects } from "../data/fallback";
import { api } from "../lib/api";
import type { Project } from "../types";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void api.getProjects().then((items) => {
      if (active) setProjects(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    if (projects.length > 0 && !project) {
      navigate("/projects", { replace: true });
    }
  }, [project, projects, navigate]);

  useLayoutEffect(() => {
    if (!project || !pageRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Hero content stagger in
      gsap.fromTo(
        ".pd-hero__content > *",
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.13, delay: 0.25 }
      );

      // Metrics strip
      gsap.fromTo(
        ".pd-metric",
        { y: 32, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.1,
          scrollTrigger: { trigger: ".pd-metrics", start: "top 82%", once: true }
        }
      );

      // Overview text
      gsap.fromTo(
        ".pd-overview__text",
        { x: -44, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: ".pd-overview", start: "top 78%", once: true }
        }
      );

      // Overview sidebar
      gsap.fromTo(
        ".pd-overview__sidebar",
        { x: 44, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1, duration: 1, ease: "expo.out", delay: 0.1,
          scrollTrigger: { trigger: ".pd-overview", start: "top 78%", once: true }
        }
      );

      // Deliverables list items
      gsap.fromTo(
        ".pd-deliverable",
        { x: -20, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".pd-deliverables", start: "top 82%", once: true }
        }
      );

      // Platform link chips
      gsap.fromTo(
        ".pd-platform-link",
        { y: 16, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".pd-platform-links", start: "top 86%", once: true }
        }
      );

      // Review card
      gsap.fromTo(
        ".pd-review-card",
        { y: 40, autoAlpha: 0, scale: 0.97 },
        {
          y: 0, autoAlpha: 1, scale: 1, duration: 1, ease: "expo.out",
          scrollTrigger: { trigger: ".pd-review-card", start: "top 82%", once: true }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [project]);

  if (!project) return null;

  return (
    <>
      <Helmet>
        <title>{project.title} — {project.client} | NextGen Ventures</title>
        <meta name="description" content={project.summary} />
        <meta property="og:title" content={`${project.title} — ${project.client}`} />
        <meta property="og:description" content={project.summary} />
        <meta property="og:image" content={project.imageUrl} />
        <meta property="og:url" content={`https://nextgenventures.in/projects/${project.slug}`} />
      </Helmet>

      <div ref={pageRef} className="project-detail">
        {/* ── Hero ──────────────────────────────────────────── */}
        <div
          className="pd-hero"
          style={{ backgroundImage: `url(${project.imageUrl})` }}
        >
          <div
            className="pd-hero__overlay"
            style={{ "--pd-color": project.color } as CSSProperties}
          />
          <div className="pd-hero__content">
            <Link to="/projects" className="pd-back">
              <ArrowLeft size={16} aria-hidden="true" />
              Back to Projects
            </Link>
            <div className="pd-hero__meta">
              <span className="eyebrow">{project.category}</span>
              <span className="pd-hero__year">{project.year}</span>
            </div>
            <h1>{project.title}</h1>
            <p className="pd-hero__client">{project.client}</p>
            {project.liveUrl && (
              <a
                className="pd-hero__live"
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>View Live Site</span>
                <ExternalLink size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        {/* ── Metrics strip ─────────────────────────────────── */}
        <div
          className="pd-metrics"
          style={{ "--pd-color": project.color } as CSSProperties}
        >
          {project.metrics.map((metric) => (
            <div key={metric.label} className="pd-metric">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>

        {/* ── Overview ──────────────────────────────────────── */}
        <section className="section-shell pd-overview">
          <div className="pd-overview__text">
            <p className="eyebrow">Project Overview</p>
            <h2>What we built and why it matters.</h2>
            <p>{project.summary}</p>
            <p className="pd-impact">{project.impact}</p>

            {/* Deliverables */}
            <div className="pd-deliverables">
              <h3>Deliverables</h3>
              <ul>
                {project.services.map((s) => (
                  <li key={s} className="pd-deliverable">{s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pd-overview__sidebar">
            <div className="pd-sidebar-block">
              <h4>Platforms &amp; Stack</h4>
              <div className="platform-chips">
                {project.platforms.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
            </div>

            <div className="pd-sidebar-block">
              <h4>Services Delivered</h4>
              <div className="platform-chips">
                {project.services.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>

            <div className="pd-sidebar-block">
              <h4>Year</h4>
              <p className="pd-sidebar-value">{project.year}</p>
            </div>

            {/* Platform links */}
            {project.links && project.links.length > 0 && (
              <div className="pd-sidebar-block pd-platform-links">
                <h4>Live on These Platforms</h4>
                <div className="pd-platform-link-list">
                  {project.links.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pd-platform-link"
                    >
                      <ExternalLink size={12} aria-hidden="true" />
                      {link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {project.liveUrl && !project.links && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-live-link"
              >
                <span>View Live Site</span>
                <ExternalLink size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </section>

        {/* ── Client Review ─────────────────────────────────── */}
        {project.review && (
          <section className="section-shell pd-review-section">
            <article className="pd-review-card" style={{ "--pd-color": project.color } as CSSProperties}>
              <Quote size={32} className="pd-review-card__quote-icon" aria-hidden="true" />
              <div className="pd-review-card__stars" aria-label={`${project.review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <svg key={n} width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"
                    className={n <= project.review!.rating ? "star star--filled" : "star star--empty"}>
                    <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502z" />
                  </svg>
                ))}
              </div>
              <p className="pd-review-card__text">"{project.review.text}"</p>
              <div className="pd-review-card__author">
                <div className="pd-review-card__avatar" aria-hidden="true">
                  {project.review.author.charAt(0)}
                </div>
                <div>
                  <strong>{project.review.author}</strong>
                  <span>{project.review.role}, {project.review.company}</span>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── Closing CTA ───────────────────────────────────── */}
        <section className="section-shell closing-cta">
          <div data-reveal="left">
            <p className="eyebrow">Start Your Project</p>
            <h2>Ready to build something like this for your brand?</h2>
          </div>
          <Link className="button button--dark" to="/contact" data-reveal="right">
            Start with NextGen Ventures
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
