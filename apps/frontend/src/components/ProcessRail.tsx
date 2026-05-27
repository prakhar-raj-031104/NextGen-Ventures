import { SectionHeading } from "./SectionHeading";

const steps = [
  {
    title: "Discover",
    text: "Audit the business, current platforms, customer journeys, and technical limits."
  },
  {
    title: "Design",
    text: "Create the product structure, UI direction, motion language, and launch-ready content system."
  },
  {
    title: "Develop",
    text: "Build the React frontend, API layer, PostgreSQL database, integrations, and admin workflows."
  },
  {
    title: "Grow",
    text: "Measure performance, improve conversion, and expand marketplace or product capabilities."
  }
];

export const ProcessRail = () => (
  <section className="section-shell process-section">
    <SectionHeading
      eyebrow="Process"
      title="Simple enough to follow, detailed enough to ship properly."
    />

    <div className="process-rail">
      {steps.map((step, index) => (
        <article key={step.title} data-card-interactive>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </article>
      ))}
    </div>
  </section>
);
