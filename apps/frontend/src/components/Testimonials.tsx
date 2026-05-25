import { SectionHeading } from "./SectionHeading";

const testimonials = [
  {
    quote:
      "They rebuilt our entire Flipkart catalog in three weeks. Listing quality went from 62% to 91% and the dashboard gives our team real-time visibility we never had before.",
    author: "Priya Sharma",
    role: "Growth Manager",
    company: "Nexa Appliances"
  },
  {
    quote:
      "The website they delivered is genuinely the best in our category. Motion feels intentional, the CMS is clean, and we launched on schedule with zero rework.",
    author: "Rohan Mehta",
    role: "Founder",
    company: "KindleLeaf Wellness"
  },
  {
    quote:
      "We handed over a mess of spreadsheets. They handed back a working dashboard. Our ops team now runs entirely on it every single day.",
    author: "Ananya Gupta",
    role: "Head of Operations",
    company: "Aurora Home"
  }
];

export const Testimonials = () => (
  <section className="section-shell testimonials-section">
    <SectionHeading
      eyebrow="Client Feedback"
      title="Words from teams that have shipped with us."
    />
    <div className="testimonials-grid" data-stagger>
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
