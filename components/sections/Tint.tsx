"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { Sun, Eye, SlidersHorizontal } from "lucide-react";
import { Button, Eyebrow } from "@/components/ui/Button";
import { business } from "@/lib/content";
import { Reveal } from "@/components/animations/Reveal";
const VehicleScene = dynamic(
  () => import("@/components/animations/VehicleScene"),
  { ssr: false },
);
export function Tint() {
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { margin: "250px", once: true });
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 26 });
  const [level, setLevel] = useState(35);
  return (
    <section className="tint section" id="tint" ref={ref}>
      <div className="wrap">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>WINDOW TINT</Eyebrow>
            <h2>
              A LITTLE DARKER.
              <br />A LOT MORE <span className="serif">you.</span>
            </h2>
          </div>
          <div className="tint-intro">
            <p>
              A subtle change that makes a statement. Tell us your vehicle make
              and which windows you’d like tinted. We’ll take it from there.
            </p>
            <Button href={business.contact}>Get a tint quote</Button>
          </div>
        </Reveal>
        <div className="tint-stage">
          <div className="tint-backdrop" aria-hidden="true">
            A NEW PERSPECTIVE
          </div>
          {near && (
            <VehicleScene
              mode="tint"
              progress={progress}
              level={level}
              reduced={!!reduced}
            />
          )}
          <span className="tint-badge">
            <Sun size={16} /> {level}% TINT PREVIEW
          </span>
        </div>
        <div className="tint-controls">
          <div>
            <SlidersHorizontal size={20} />
            <span>
              FIND YOUR SHADE<small>Choose a level to explore</small>
            </span>
          </div>
          <div
            className="tint-options"
            role="group"
            aria-label="Window tint preview level"
          >
            {[35, 50, 70].map((value) => (
              <button
                key={value}
                aria-pressed={level === value}
                onClick={() => setLevel(value)}
              >
                <i style={{ opacity: value / 100 }} />
                {value}%
              </button>
            ))}
          </div>
          <span className="tint-explainer">
            <Eye size={17} />
            Higher % = darker glass
          </span>
        </div>
        <p className="tint-disclaimer">
          Illustrative visualization, not a film specification or installation
          recommendation. Ask our team about available films and suitable
          options for your vehicle.
        </p>
      </div>
    </section>
  );
}
