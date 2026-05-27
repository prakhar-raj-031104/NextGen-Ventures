import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const rows = [
  {
    title: "Marketplace Operations",
    text: "Catalog control, listing health, pricing checks, ad spend views, and campaign calendars for Amazon, Myntra, and Flipkart."
  },
  {
    title: "Experience Design",
    text: "High-conversion journeys, component libraries, visual systems, motion behavior, and prototype-ready product screens."
  },
  {
    title: "Full-Stack Delivery",
    text: "React interfaces, Express APIs, Prisma data models, PostgreSQL storage, and production deployment foundations."
  }
];

export const PlatformShowcase = () => (
  <section className="section-shell platform-showcase">
    <SectionHeading
      eyebrow="Operating Model"
      title="Built like a partner, structured like a product team."
      copy="NextGen Ventures covers strategy, design, engineering, analytics, and iteration so each project has a clear path from brief to launch."
    />

    <div className="showcase-grid">
      <div className="showcase-device" data-scale>
        <div className="device-window">
          <div className="device-nav">
            <span />
            <span />
            <span />
          </div>
          <div className="device-list">
            <div>
              <strong>Amazon Listing Quality</strong>
              <span>86%</span>
            </div>
            <div>
              <strong>Myntra Creative Readiness</strong>
              <span>94%</span>
            </div>
            <div>
              <strong>Flipkart Price Watch</strong>
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>

      <div className="showcase-list">
        {rows.map((row) => (
          <article key={row.title} data-reveal="right" data-card-interactive>
            <CheckCircle2 size={22} aria-hidden="true" />
            <div>
              <h3>{row.title}</h3>
              <p>{row.text}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
