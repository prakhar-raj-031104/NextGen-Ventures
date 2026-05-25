import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "../components/SectionHeading";
import { fallbackServices } from "../data/fallback";
import { api } from "../lib/api";
import type { Service } from "../types";

export default function Services() {
  const [services, setServices] = useState<Service[]>(fallbackServices);

  useEffect(() => {
    let active = true;
    void api.getServices().then((items) => {
      if (active) setServices(items);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <section className="page-hero section-shell">
        <div data-reveal="left">
          <p className="eyebrow">Services</p>
          <h1>Marketplace growth, UI UX design, websites, and full-stack application development.</h1>
        </div>
        <p data-reveal="right">
          NextGen Ventures supports ecommerce businesses selling on Amazon, Myntra, and Flipkart while
          also designing and developing complete websites and custom applications.
        </p>
      </section>

      <section className="section-shell service-detail-list">
        {services.map((service, index) => (
          <article
            className="service-detail"
            key={service.slug}
            style={{ "--accent": service.accent } as CSSProperties}
            data-reveal
            data-card-interactive
          >
            <div
              className="service-detail__media"
              style={{ backgroundImage: service.imageUrl ? `url(${service.imageUrl})` : undefined }}
            />
            <div className="service-detail__content">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{service.kicker}</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <div className="deliverables">
                {service.deliverables.map((item) => (
                  <span key={item}>
                    <Check size={16} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>
              <div className="platform-chips">
                {service.platforms.map((platform) => (
                  <span key={platform}>{platform}</span>
                ))}
              </div>
              <Link
                className="service-detail__cta"
                to={`/services/${service.slug}`}
              >
                View Plans
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section-shell service-fit">
        <SectionHeading
          eyebrow="Best Fit"
          title="Built for founders, ecommerce managers, and teams replacing manual workflows."
        />
        <div className="fit-grid" data-stagger>
          <article data-card-interactive>
            <h3>For marketplace brands</h3>
            <p>
              Launch, organize, and optimize listings with full visibility across SKU performance,
              campaign health, pricing, and inventory across Amazon, Myntra, and Flipkart.
            </p>
          </article>
          <article data-card-interactive>
            <h3>For service companies</h3>
            <p>
              Get a premium website with strong content hierarchy, polished motion, clear conversion
              paths, and a backend-ready enquiry system from day one.
            </p>
          </article>
          <article data-card-interactive>
            <h3>For software ideas</h3>
            <p>
              Turn complex workflows into clean, scalable web applications with React, typed APIs,
              Prisma data models, and PostgreSQL — built for real daily use.
            </p>
          </article>
        </div>
        <Link className="button button--dark" to="/contact" data-reveal>
          Plan a Build
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </>
  );
}
