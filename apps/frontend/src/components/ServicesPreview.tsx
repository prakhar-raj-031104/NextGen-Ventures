import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Service } from "../types";
import { SectionHeading } from "./SectionHeading";

type ServicesPreviewProps = {
  services: Service[];
};

export const ServicesPreview = ({ services }: ServicesPreviewProps) => (
  <section className="section-shell services-preview">
    <SectionHeading
      eyebrow="Services"
      title="A focused team for commerce, design, and software delivery."
      copy="Four tightly scoped service lines — each with clear deliverables, proven platforms, and a direct path from brief to launch."
    />

    <div className="services-grid" data-stagger>
      {services.map((service, index) => (
        <article className="service-card" key={service.slug} data-card-interactive>
          <span className="service-card__index">{String(index + 1).padStart(2, "0")}</span>
          <div
            className="service-card__media"
            style={{
              backgroundImage: service.imageUrl ? `url(${service.imageUrl})` : undefined,
              borderColor: "var(--orange)"
            }}
          />
          <div>
            <p className="eyebrow">{service.kicker}</p>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
          </div>
          <Link to={`/services/${service.slug}`} aria-label={`Learn about ${service.title}`}>
            <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
        </article>
      ))}
    </div>
  </section>
);
