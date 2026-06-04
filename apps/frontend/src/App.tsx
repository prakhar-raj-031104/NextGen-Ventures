import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SiteLoader } from "./components/SiteLoader";
import { useLenis } from "./hooks/useLenis";
import { useInteractiveCards } from "./hooks/useInteractiveCards";
import { usePageAnimations } from "./hooks/usePageAnimations";
import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const Internship = lazy(() => import("./pages/Internship"));
const Estimate = lazy(() => import("./pages/Estimate"));
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  const location = useLocation();

  useLenis();
  useInteractiveCards();
  usePageAnimations();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  // The control panel runs standalone — no marketing header/footer chrome.
  if (location.pathname.startsWith("/admin")) {
    return (
      <Suspense fallback={null}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <>
      <SiteLoader />
      <Layout>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/client-portal" element={<ClientPortal />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/estimate" element={<Estimate />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </>
  );
}
