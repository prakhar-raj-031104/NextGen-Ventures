import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HorizontalProjects } from "../components/HorizontalProjects";
import { fallbackProjects } from "../data/fallback";
import { api } from "../lib/api";
import type { Project } from "../types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let active = true;
    void api.getProjects().then((items) => {
      if (active) setProjects(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Our Work — NextGen Ventures | Case Studies & Portfolio</title>
        <meta name="description" content="Explore NextGen Ventures' portfolio — marketplace operations, UI/UX design, website builds, and full-stack applications delivered for real brands." />
        <meta property="og:title" content="Our Work — NextGen Ventures Portfolio" />
        <meta property="og:description" content="Case studies across marketplace growth, UI/UX design, website development, and custom applications." />
        <meta property="og:url" content="https://nextgenventures.in/projects" />
      </Helmet>
      <section className="page-hero section-shell">
        <div data-reveal="left">
          <p className="eyebrow">Selected Work</p>
          <h1>Deep-dive case studies from every engagement we've shipped.</h1>
        </div>
        <p data-reveal="right">
          Marketplace operations, UI/UX overhauls, custom web applications, and brand storefronts —
          each project built with a clear brief, a measurable outcome, and a team that ships.
        </p>
      </section>

      <HorizontalProjects projects={projects} />

      <section className="section-shell project-grid-section">
        <div className="project-grid">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="project-card-link"
              aria-label={`View case study: ${project.title}`}
            >
              <article className="project-card" data-reveal data-card-interactive>
                <div
                  className="project-card__image"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                />
                <div className="project-card__body">
                  <p className="eyebrow">
                    {project.category} / {project.year}
                  </p>
                  <h2>{project.title}</h2>
                  <p>{project.impact}</p>
                  <div className="platform-chips">
                    {project.platforms.map((platform) => (
                      <span key={platform}>{platform}</span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell closing-cta">
        <div data-reveal="left">
          <p className="eyebrow">Next Case Study</p>
          <h2>Your Amazon, Myntra, Flipkart, website, or application build can live here.</h2>
        </div>
        <Link className="button button--dark" to="/contact" data-reveal="right">
          Start with NextGen Ventures
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
