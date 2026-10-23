"use client";

import { useEffect, useState } from "react";

/** Only critical above-the-fold assets gate the intro; lower-page media never do. */
export function Preloader() {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    let disposed = false;
    let exiting = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(callback, delay);
      timers.push(timer);
    };
    const finish = () => {
      if (disposed || exiting) return;
      exiting = true;
      setPhase("revealing");
      later(() => setPhase("done"), motion.matches ? 120 : 1000);
    };
    // A keyboard user can proceed immediately without navigating behind a curtain.
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Tab" || event.key === "Escape") finish();
    };
    const hero = document.querySelector<HTMLImageElement>(".hero-image img");
    const imageReady = hero?.decode().catch(() => undefined) ?? Promise.resolve();
    const fontsReady = document.fonts.ready.catch(() => undefined);
    const entrance = new Promise<void>((resolve) => later(resolve, motion.matches ? 0 : 900));
    void Promise.all([imageReady, fontsReady, entrance]).then(finish);
    later(finish, 3200);
    document.addEventListener("keydown", onKey);
    motion.addEventListener("change", finish);
    // Returning from the back-forward cache should never replay the intro.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) finish();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      document.removeEventListener("keydown", onKey);
      motion.removeEventListener("change", finish);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <>
      <div className="preloader" data-phase={phase} aria-hidden="true">
        <div className="preloader-curtain" />
        <div className="preloader-top"><span>DETAIL CLINIC</span><span>LA CROSSE, WI</span></div>
        <div className="preloader-center">
          <div className="preloader-wheel-stage">
            <svg className="preloader-wheel" viewBox="0 0 200 200" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="loader-alloy" x1="40" y1="25" x2="160" y2="180" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f3e8d1" /><stop offset=".42" stopColor="#c8b58f" /><stop offset=".7" stopColor="#6d6049" /><stop offset="1" stopColor="#e1d2b4" />
                </linearGradient>
                <radialGradient id="loader-tire">
                  <stop offset=".72" stopColor="#252627" /><stop offset=".84" stopColor="#111213" /><stop offset=".94" stopColor="#282a2b" /><stop offset="1" stopColor="#151617" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="94" fill="url(#loader-tire)" stroke="#3b3c3d" />
              <circle cx="100" cy="100" r="86" stroke="#ffffff0d" />
              <circle cx="100" cy="100" r="71" fill="#111213" stroke="url(#loader-alloy)" strokeWidth="4" />
              <circle cx="100" cy="100" r="55" fill="#262729" stroke="#414244" />
              <circle cx="100" cy="100" r="44" stroke="#77736a" strokeWidth="10" strokeDasharray="1 7" />
              <path d="M146 70 Q158 100 146 130 L135 125 Q144 100 135 75Z" fill="#c8b58f" />
              <g className="preloader-wheel-spin">
                <circle cx="100" cy="100" r="91" stroke="#606163" strokeWidth="2" strokeDasharray="1 14" opacity=".4" />
                {[0, 72, 144, 216, 288].map((angle) => (
                  <g key={angle} transform={`rotate(${angle} 100 100)`}>
                    <path d="M94 91 76 35 84 32 101 80 116 32 124 35 106 91Z" fill="url(#loader-alloy)" stroke="#e9dcc1" strokeWidth=".5" />
                  </g>
                ))}
                <circle cx="100" cy="100" r="19" fill="#222324" stroke="url(#loader-alloy)" strokeWidth="2" />
                {[0, 72, 144, 216, 288].map((angle) => (
                  <circle key={angle} cx="100" cy="86" r="2" fill="#c8b58f" transform={`rotate(${angle} 100 100)`} />
                ))}
              </g>
              <circle cx="100" cy="100" r="9" fill="#121314" />
              <text x="100" y="103" textAnchor="middle" fill="#c8b58f" fontSize="8" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic">DC</text>
              <path d="M35 58 A77 77 0 0 1 136 32" stroke="#fff" strokeOpacity=".18" strokeLinecap="round" />
            </svg>
            <div className="preloader-road"><span /></div>
          </div>
          <div className="preloader-wordmark"><span>DETAIL CLINIC</span></div>
          <p className="preloader-caption">PRECISION IN EVERY DETAIL.</p>
          <div className="preloader-track"><span /></div>
        </div>
        <div className="preloader-bottom"><span>AUTOMOTIVE DETAILING</span><span className="preloader-signature">Care. Craft. Clinic.</span></div>
      </div>
      <noscript><style>{`.preloader { display: none !important; }`}</style></noscript>
    </>
  );
}
