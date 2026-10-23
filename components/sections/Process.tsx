"use client";
import { useEffect, useRef } from "react";
import { Search, Droplets, Sparkles, ShieldCheck, Flag } from "lucide-react";
import { Eyebrow } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
import { useInView, useReducedMotion } from "motion/react";
const steps = [
  {
    name: "Inspect",
    text: "Start with a conversation about your vehicle and what matters to you.",
    icon: Search,
  },
  {
    name: "Prepare",
    text: "Set the right expectations and agree on the work before it begins.",
    icon: Droplets,
  },
  {
    name: "Detail",
    text: "Give each surface focused attention, with the agreed service guiding the work.",
    icon: Sparkles,
  },
  {
    name: "Protect",
    text: "Discuss finishing and protection options that suit your vehicle.",
    icon: ShieldCheck,
  },
  {
    name: "Reveal",
    text: "Take a closer look together. Then enjoy the drive home.",
    icon: Flag,
  },
];
export function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const near = useInView(section, { margin: "600px", once: true });
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!near || reduced) return;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!track.current || !section.current) return;
          gsap.to(track.current, {
            x: () =>
              -(
                track.current!.scrollWidth -
                section.current!.clientWidth +
                100
              ),
            ease: "none",
            scrollTrigger: {
              trigger: section.current,
              start: "top 100px",
              end: "+=900",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        },
      );
      cleanup = () => mm.revert();
    })();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [near, reduced]);
  return (
    <section className="process section" ref={section}>
      <div className="wrap">
        <Reveal>
          <Eyebrow>CARE, FROM START TO FINISH</Eyebrow>
          <h2>
            THE DETAIL CLINIC
            <br />
            <span className="muted">PROCESS.</span>
          </h2>
        </Reveal>
      </div>
      <div className="process-viewport">
        <div className="process-track" ref={track}>
          {steps.map((step, i) => (
            <article className="process-step" key={step.name}>
              <div className="process-step-top">
                <span>0{i + 1}</span>
                <step.icon size={25} />
              </div>
              <div className="process-rule" />
              <h3>{step.name}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
