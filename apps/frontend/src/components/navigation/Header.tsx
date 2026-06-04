import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Get Estimate", href: "/estimate" },
  { label: "Projects", href: "/projects" },
  { label: "Internship", href: "/internship" },
  { label: "Contact", href: "/contact" },
  { label: "Client Portal", href: "/client-portal" },
  { label: "Admin", href: "/admin" }
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>

      <Link className="brand-mark" to="/" aria-label="NextGen Ventures home">
        <span className="brand-icon">NG</span>
        <span className="brand-text">
          <strong>NextGen Ventures</strong>
          <small className="brand-meta">Est. 2026 · Bengaluru</small>
        </span>
      </Link>

      <nav className={`primary-nav ${open ? "primary-nav--open" : ""}`} aria-label="Primary">
        {navItems.map((item) => (
          <NavLink key={item.href} to={item.href}>
            {item.label}
          </NavLink>
        ))}
        <Link className="header-cta nav-mobile-cta" to="/contact">
          <span className="status-dot" aria-hidden="true" />
          Start a Project
        </Link>
      </nav>

      <Link className="header-cta" to="/contact">
        <span className="status-dot" aria-hidden="true" />
        Start a Project
        <ArrowUpRight size={15} strokeWidth={2.5} aria-hidden="true" />
      </Link>

      <button
        className="icon-button menu-button"
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
};
