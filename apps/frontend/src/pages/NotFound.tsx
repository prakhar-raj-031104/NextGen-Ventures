import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="section-shell not-found">
      <p className="eyebrow">404</p>
      <h1>Page not found.</h1>
      <p>The page you're looking for doesn't exist or may have been moved.</p>
      <Link className="button button--dark" to="/">
        <ArrowLeft size={18} aria-hidden="true" />
        Back to Home
      </Link>
    </section>
  );
}
