import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SiteLoader } from "./components/SiteLoader";
import { useLenis } from "./hooks/useLenis";
import { useInteractiveCards } from "./hooks/useInteractiveCards";
import { usePageAnimations } from "./hooks/usePageAnimations";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ServiceDetail from "./pages/ServiceDetail";
import Services from "./pages/Services";

export default function App() {
  const location = useLocation();

  useLenis();
  useInteractiveCards();
  usePageAnimations();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname]);

  return (
    <>
      <SiteLoader />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
