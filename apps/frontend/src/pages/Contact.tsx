import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>Contact Us — NextGen Ventures | Start a Project</title>
        <meta name="description" content="Get in touch with NextGen Ventures. Tell us about your marketplace, marketing, website, or application project and we'll respond within one business day." />
        <meta property="og:title" content="Contact NextGen Ventures — Start a Project" />
        <meta property="og:description" content="Reach us for marketplace management, digital marketing, UI/UX design, website development, or application development enquiries." />
        <meta property="og:url" content="https://nextgenventures.in/contact" />
      </Helmet>
      <section className="page-hero section-shell contact-hero">
        <div data-reveal="left">
          <p className="eyebrow">Contact Us</p>
          <h1>Tell us what you want to launch, grow, automate, or redesign.</h1>
        </div>
        <p data-reveal="right">
          Whether it's marketplace management, digital marketing, a new website, product imaging,
          or a custom application — fill in the form and we'll respond within one business day.
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
