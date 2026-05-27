import type { ReactNode } from "react";
import { Footer } from "./navigation/Footer";
import { Header } from "./navigation/Header";
import { WhatsAppButton } from "./WhatsAppButton";

type LayoutProps = {
  children: ReactNode;
};

export const Layout = ({ children }: LayoutProps) => (
  <>
    <Header />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);
