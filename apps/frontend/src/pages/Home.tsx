import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Hero } from "../components/Hero";
import { HorizontalProjects } from "../components/HorizontalProjects";
import { ServiceConfigurator } from "../components/ServiceConfigurator";
import { SectionHeading } from "../components/SectionHeading";
import { PlatformMarquee } from "../components/PlatformMarquee";
import { PlatformShowcase } from "../components/PlatformShowcase";
import { ProcessRail } from "../components/ProcessRail";
import { ServiceBelt } from "../components/ServiceBelt";
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
      <Helmet>
        <title>NextGen Ventures | Marketplace Growth, Design & Digital Marketing — Bengaluru</title>
        <meta name="description" content="NextGen Ventures — Bengaluru's digital studio for Amazon, Flipkart, Myntra marketplace growth, digital marketing, UI/UX design, website development, and full-stack applications." />
        <meta property="og:title" content="NextGen Ventures | Marketplace Growth, Design & Digital Marketing" />
        <meta property="og:description" content="Full-service digital studio: marketplace management, Google Ads, social media, website development, UI/UX design, and custom applications for ambitious brands." />
        <meta property="og:url" content="https://nextgenventures.in" />
      </Helmet>
      <ServiceBelt />
      <Hero />
      <PlatformMarquee items={platformNames} />
      <div className="section-bg-warm">
        <ServicesPreview services={services} />
      </div>
      <HorizontalProjects projects={projects} />

      <section className="section-shell" id="build">
        <SectionHeading
          eyebrow="Build Your Package"
          title="Tell us what you need — get an instant estimate."
          copy="Choose a service, pick your add-ons like WhatsApp, payments, social or API integration, and we'll tailor a package and price for you."
        />
        <ServiceConfigurator />
      </section>

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
            <h2>Bring your marketplace, marketing, website, or product idea to NextGen Ventures.</h2>
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
