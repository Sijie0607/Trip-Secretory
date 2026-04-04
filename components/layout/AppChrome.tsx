"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/modals/AuthModal";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fullscreenPrototype =
    pathname === "/" || (pathname?.startsWith("/prototype") ?? false);

  if (fullscreenPrototype) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar
        onLoginClick={() => setAuthModalOpen(true)}
        isLoggedIn={isLoggedIn}
      />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={() => setIsLoggedIn(true)}
      />
    </>
  );
}
