const serviceBeltItems = [
  "Website Development",
  "Web Application Development",
  "Software Development",
  "Full-Stack Engineering",
  "Mobile App Development",
  "UI / UX Design",
  "E-commerce Development",
  "API & Integrations",
  "Cloud & DevOps",
  "SaaS Platforms",
  "Custom Software Solutions",
  "Progressive Web Apps"
];

export const ServiceBelt = () => (
  <section className="service-belt" aria-label="What we build">
    <div className="service-belt__track">
      {[...serviceBeltItems, ...serviceBeltItems].map((item, index) => (
        <span key={`${item}-${index}`} className="service-belt__item">
          <span className="service-belt__dot" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  </section>
);
