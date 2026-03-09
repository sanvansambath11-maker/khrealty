import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Send, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../components/ui/sheet";

const navItems = [
  { label: "ទំព័រដើម", path: "/" },
  { label: "អចលនទ្រព្យ", path: "/properties" },
  { label: "ផ្ទះបុរី", path: "/properties?type=borey" },
  { label: "ខុនដូ", path: "/properties?type=condo" },
  { label: "ដីលក់", path: "/properties?type=land" },
  { label: "អំពីយើង", path: "/#why-choose-us" },
  { label: "ទំនាក់ទំនង", path: "/#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState("KH");
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path.startsWith("/#")) return false;
    return location.pathname + location.search === path;
  };

  const handleNavClick = (path) => {
    setMobileOpen(false);
    if (path.startsWith("/#")) {
      const id = path.replace("/#", "");
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <header
      data-testid="main-header"
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" data-testid="header-logo" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#0F2A44] flex items-center justify-center">
            <span className="text-[#C9A227] font-bold text-lg font-['Poppins']">KH</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[#0F2A44] font-semibold text-lg font-['Poppins'] tracking-tight">
              KH Realty
            </span>
            <span className="block text-[10px] text-slate-500 tracking-widest uppercase -mt-0.5">
              Cambodia Property
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" data-testid="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => handleNavClick(item.path)}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive(item.path)
                  ? "text-[#C9A227]"
                  : "text-[#0F2A44] hover:text-[#C9A227]"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            data-testid="language-toggle"
            onClick={() => setLang(lang === "EN" ? "KH" : "EN")}
            className="hidden md:flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#0F2A44] border border-gray-200 hover:border-[#C9A227] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            {lang}
          </button>

          {/* Call button */}
          <a
            href="tel:+85512345678"
            data-testid="call-button"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0F2A44] border border-[#0F2A44] hover:bg-[#0F2A44] hover:text-white transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            ទូរស័ព្ទឥឡូវនេះ
          </a>

          {/* Telegram button */}
          <a
            href="https://t.me/khrealty"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="telegram-button"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#C9A227] text-[#0F2A44] hover:bg-[#D4B03B] transition-all duration-300"
          >
            <Send className="w-4 h-4" />
            តេឡេក្រាម
          </a>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" data-testid="mobile-menu-trigger">
                <Menu className="w-5 h-5 text-[#0F2A44]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white">
              <SheetTitle className="text-[#0F2A44] font-['Poppins']">ម៉ឺនុយ</SheetTitle>
              <nav className="flex flex-col gap-1 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    data-testid={`mobile-nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                    className={`px-3 py-3 text-sm font-medium transition-colors border-b border-gray-50 ${isActive(item.path)
                        ? "text-[#C9A227]"
                        : "text-[#0F2A44] hover:text-[#C9A227]"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-3 mt-6 px-3">
                <a
                  href="tel:+85512345678"
                  data-testid="mobile-call-button"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[#0F2A44] border border-[#0F2A44] transition-all"
                >
                  <Phone className="w-4 h-4" /> ទូរស័ព្ទឥឡូវនេះ
                </a>
                <a
                  href="https://t.me/khrealty"
                  data-testid="mobile-telegram-button"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium bg-[#C9A227] text-[#0F2A44] transition-all"
                >
                  <Send className="w-4 h-4" /> តេឡេក្រាម
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
