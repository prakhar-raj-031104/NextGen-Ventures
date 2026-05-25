import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "../components/ContactForm";
import { fallbackServices } from "../data/fallback";
import { api } from "../lib/api";
import type { Service } from "../types";

export default function Contact() {
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
      <section className="page-hero section-shell contact-hero">
        <div data-reveal="left">
          <p className="eyebrow">Contact Us</p>
          <h1>Tell us what you want to launch, improve, automate, or redesign.</h1>
        </div>
        <p data-reveal="right">
          Use the form for ecommerce marketplace support, UI UX design, website design, or complete
          web application development enquiries.
        </p>
      </section>

      <section className="section-shell contact-section">
        <div className="contact-aside" data-reveal="left" data-card-interactive>
          <h2>NextGen Ventures</h2>
          <p>
            Tell us what you want to build, improve, or automate. We'll review your brief and
            respond within one business day with next steps.
          </p>
          <div className="contact-methods">
            <a href="mailto:hello@nextgenventures.in">
              <Mail size={18} aria-hidden="true" />
              hello@nextgenventures.in
            </a>
            <span>
              <MapPin size={18} aria-hidden="true" />
              Bengaluru, India
            </span>
          </div>
        </div>

        <ContactForm services={services} />
      </section>
    </>
  );
}
