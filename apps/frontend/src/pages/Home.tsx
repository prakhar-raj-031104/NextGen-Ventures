import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Hero } from "../components/Hero";
import { HorizontalProjects } from "../components/HorizontalProjects";
import { PlatformMarquee } from "../components/PlatformMarquee";
import { PlatformShowcase } from "../components/PlatformShowcase";
import { ProcessRail } from "../components/ProcessRail";
import { ServicesPreview } from "../components/ServicesPreview";
import { Testimonials } from "../components/Testimonials";
import { fallbackProjects, fallbackServices, platformNames } from "../data/fallback";
import { api } from "../lib/api";
import type { Project, Service } from "../types";

export default function Home() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let active = true;

    void api.getServices().then((items) => {
      if (active) setServices(items);
    });

    void api.getProjects().then((items) => {
      if (active) setProjects(items);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <PlatformMarquee items={platformNames} />
      <div className="section-bg-warm">
        <ServicesPreview services={services} />
      </div>
      <HorizontalProjects projects={projects} />
      <div className="section-bg-warm">
        <PlatformShowcase />
      </div>
      <div className="section-bg-near">
        <ProcessRail />
      </div>
      <div className="section-bg-mid">
        <Testimonials />
      </div>
      <div className="section-bg-deep">
        <section className="section-shell closing-cta">
          <div data-reveal="left">
            <p className="eyebrow">Ready to build?</p>
            <h2>Bring your marketplace, website, or product idea into one serious build.</h2>
          </div>
          <Link className="button button--dark" to="/contact" data-reveal="right">
            Contact Us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
