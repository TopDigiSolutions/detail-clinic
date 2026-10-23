"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { business, nav } from "@/lib/content";
import { Button } from "@/components/ui/Button";
export function Logo({ homePath = "" }: { homePath?: string }) {
  return (
    <a href={`${homePath}#home`} className="logo" aria-label="Detail Clinic home" title="Detail Clinic – Home">
      <svg className="logo-mark" width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2.1" />
        <path d="M12 6.5v11M6.5 12h11" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
      </svg>
      <span className="logo-name">DETAIL CLINIC</span>
    </a>
  );
}
export function Header({ homePath = "" }: { homePath?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(homePath ? "/about-us" : "#home");
  const header = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const close = useCallback(() => {
    document.body.style.overflow = "";
    setClosing(true);
    toggle.current?.focus({ preventScroll: true });
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, reduced ? 0 : 180);
  }, [reduced]);
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 35);
      if (homePath) return;
      // The last destination above the reading line remains active through
      // intervening content, including the nested Detailing destination.
      const readingLine = Math.max(
        (header.current?.offsetHeight ?? 94) + 24,
        Math.min(window.innerHeight * 0.28, 240),
      );
      const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      let current = "#home";
      for (const [, href] of nav) {
        if (!href.startsWith("#")) continue;
        const target = document.querySelector(href);
        if (!target) continue;
        const scrollMargin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
        // Anchor offsets can exceed the reading line on short mobile screens.
        if (target.getBoundingClientRect().top <= Math.max(readingLine, scrollPadding + scrollMargin + 2)) {
          current = href;
        }
      }
      setActiveHref(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [homePath]);
  useEffect(() => {
    if (!open) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        panel.current?.querySelectorAll<HTMLElement>("a,button") ?? [],
      );
    focusable()[0]?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
      if (e.key === "Tab") {
        const elements = focusable();
        const first = elements[0],
          last = elements.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    const resize = () => {
      if (window.innerWidth > 1050) setOpen(false);
    };
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open, close]);
  return (
    <>
      <header ref={header} className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="header-inner">
          <Logo homePath={homePath} />
          <nav className="desktop-nav" aria-label="Main navigation">
            {nav.map(([label, href]) => (
              <a key={label} href={href.startsWith("#") ? `${homePath}${href}` : href} title={`Navigate to ${label}`} aria-current={activeHref === href ? (href.startsWith("#") ? "location" : "page") : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <a
              href={business.phoneHref}
              className="header-call"
              aria-label={`Call Detail Clinic at ${business.phone}`}
              title={`Call Detail Clinic at ${business.phone}`}
            >
              <Phone size={16} aria-hidden="true" />
              <span className="header-call-text">Call Us</span>
            </a>
            <Button className="header-book" />
          </div>
          <button
            className="menu-toggle"
            ref={toggle}
            aria-label="Open navigation"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              if (closeTimer.current) clearTimeout(closeTimer.current);
              setClosing(false);
              setOpen(true);
            }}
          >
            <span className="menu-current">{nav.find(([, href]) => href === activeHref)?.[0]}</span>
            <Menu />
          </button>
        </div>
      </header>
        {open && (
          <div
            ref={panel}
            className={`mobile-menu ${closing ? 'menu-closing' : ''}`}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-hidden={closing}
            inert={closing}
            aria-label="Navigation"
          >
            <div className="mobile-menu-top">
              <Logo homePath={homePath} />
              <button
                aria-label="Close navigation"
                onClick={close}
              >
                <X />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {nav.map(([label, href], i) => (
                <a href={href.startsWith("#") ? `${homePath}${href}` : href} key={label} title={`Navigate to ${label}`} aria-current={activeHref === href ? (href.startsWith("#") ? "location" : "page") : undefined} onClick={(event) => {
                  if (homePath || !href.startsWith("#")) {
                    close();
                    return;
                  }
                  event.preventDefault();
                  close();
                  // Jump after unlocking the page, without animating through the 3D section.
                  document.querySelector(href)?.scrollIntoView({ behavior: "instant" });
                  window.history.replaceState(null, "", href);
                }}>
                  <small>0{i + 1}</small>
                  {label}
                  <ArrowUpRight size={24} />
                </a>
              ))}
            </nav>
            <div className="mobile-menu-buttons">
              <a
                href={business.phoneHref}
                className="header-call mobile-menu-call"
                title={`Call Detail Clinic at ${business.phone}`}
              >
                <Phone size={16} aria-hidden="true" />
                <span>Call Us</span>
              </a>
              <Button />
            </div>
          </div>
        )}
      <div className="mobile-book">
        <a href={business.phoneHref} title={`Call Detail Clinic at ${business.phone}`}>
          <Phone size={17} />
          Call
        </a>
        <Button />
      </div>
    </>
  );
}
