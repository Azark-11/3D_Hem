"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { CartButton } from "./CartButton";
import { CartDrawer } from "./CartDrawer";

export function Navbar() {
  const t = useTranslations("nav");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navLinks = [
    { href: "/butik", label: t("shop") },
    { href: "/om-oss", label: t("about") },
    { href: "/kontakt", label: t("contact") },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#2a2a2a] bg-[#0a0a0a]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="font-bold text-xl tracking-tight text-[#f5f1e8] hover:text-[#ff6b1a] transition-colors"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              3D<span className="text-[#ff6b1a]">HEM</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-wide uppercase text-[#f5f1e8]/70 hover:text-[#ff6b1a] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <CartButton onClick={() => setCartOpen(true)} />
              <button
                className="md:hidden text-[#f5f1e8] hover:text-[#ff6b1a] transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Meny"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#2a2a2a] bg-[#0a0a0a]">
            <nav className="flex flex-col px-4 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium uppercase tracking-wide text-[#f5f1e8]/70 hover:text-[#ff6b1a] transition-colors py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
