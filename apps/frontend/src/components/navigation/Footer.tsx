import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="site-footer">
    {/* Ghost watermark */}
    <span className="footer-watermark" aria-hidden="true">NextGen</span>

    <div className="footer-body">

      {/* Brand + tagline */}
      <div className="footer-brand">
        <Link to="/" className="footer-brand-mark">
          <span className="brand-icon">NG</span>
          <span className="footer-brand-name">NextGen Ventures</span>
        </Link>
        <p className="footer-tagline">
          A focused digital studio in Bengaluru, building commerce systems,
          premium interfaces, and full-stack products for ambitious brands.
        </p>
        <Link className="footer-cta" to="/contact">
          Start a Project
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {/* Link columns */}
      <nav className="footer-links" aria-label="Footer navigation">

        <div className="footer-col">
          <h3>Studio</h3>
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/projects">Work</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h3>Capabilities</h3>
          <Link to="/services/marketplace-growth">Marketplace Growth</Link>
          <Link to="/services/digital-marketing">Digital Marketing</Link>
          <Link to="/services/ui-ux-design">UI / UX Design</Link>
          <Link to="/services/website-design-development">Website Development</Link>
          <Link to="/services/ecommerce-imaging">E-commerce Imaging</Link>
          <Link to="/services/application-development">App Development</Link>
        </div>

        <div className="footer-col">
          <h3>Portal</h3>
          <Link to="/client-portal">Client Portal</Link>
          <Link to="/internship">Internship</Link>
          <a href="mailto:hello@nextgenventures.in">hello@nextgenventures.in</a>
        </div>

        <div className="footer-col">
          <h3>Connect</h3>
          <a href="mailto:hello@nextgenventures.in">hello@nextgenventures.in</a>
          <a
            href="https://linkedin.com/company/nextgenventures"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://instagram.com/nextgenventures"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <span>Bengaluru, India</span>
        </div>

      </nav>
    </div>

    {/* Bottom bar */}
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} NextGen Ventures · All rights reserved</span>
      <span>Designed &amp; Built in Bengaluru</span>
      <span>Commerce · Design · Engineering</span>
    </div>
  </footer>
);
