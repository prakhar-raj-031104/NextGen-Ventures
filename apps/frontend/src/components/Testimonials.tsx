import { SectionHeading } from "./SectionHeading";

const testimonials = [
  {
    quote:
      "NextGen Ventures built us a platform that genuinely made legal services approachable. The flows are clean, the interface is fast, and our clients can now complete trademark and company filing journeys without needing to call us first.",
    author: "Rajesh Verma",
    role: "Founder",
    company: "MeraTM Legal Platform"
  },
  {
    quote:
      "Our travel website went from a static brochure to a full booking experience. Customers can now browse packages, plan itineraries, and send enquiries in one seamless flow. The response from our clients was immediate.",
    author: "Suresh Pandey",
    role: "Director",
    company: "Om Travels Satna"
  },
  {
    quote:
      "The website they built for us communicates trust and compliance exactly the way we needed. Investors land on our page and immediately see a professional, RBI-aware advisory firm — not just another financial website.",
    author: "Amit Jain",
    role: "Managing Director",
    company: "Hindustan FinServe"
  }
];

export const Testimonials = () => (
  <section className="section-shell testimonials-section">
    <SectionHeading
      eyebrow="Client Feedback"
      title="Words from teams that have shipped with us."
    />
    <div className="testimonials-grid">
      {testimonials.map((item) => (
        <article key={item.author} className="testimonial-card" data-card-interactive>
          <span className="quote-mark" aria-hidden="true">"</span>
          <p className="testimonial-quote">{item.quote}</p>
          <div className="testimonial-author">
            <div className="testimonial-author-text">
              <strong>{item.author}</strong>
              <span>{item.role}, {item.company}</span>
            </div>
          </div>
        </article>
      ))}
    </div>
  </section>
);
