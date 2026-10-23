"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import {
  useScroll,
  useInView,
  useMotionValueEvent,
} from "motion/react";
import { Sparkles, ArrowDown } from "lucide-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Eyebrow } from "@/components/ui/Button";
import { detailAnimation, DETAIL_CLEAN_START, DETAIL_CLEAN_END } from "@/lib/detailAnimation";

const VehicleScene = dynamic(
  () => import("@/components/animations/VehicleScene"),
  { ssr: false }
);

export function Transformation() {
  const ref     = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const near = useInView(ref, { margin: "800px", once: true });
  const [activeStage, setActiveStage] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const stage = detailAnimation(latest).stage;
    setActiveStage((prev) => (prev !== stage ? stage : prev));
  });

  const handleStageClick = (index: number) => {
    if (!ref.current) return;
    const top = ref.current.offsetTop;
    const height = ref.current.offsetHeight - window.innerHeight;
    const stops = [0, (DETAIL_CLEAN_START + DETAIL_CLEAN_END) / 2, DETAIL_CLEAN_END];
    const targetY = top + stops[index] * height;
    window.scrollTo({ top: targetY, behavior: "smooth" });
  };

  return (
    <section
      ref={ref}
      className="transformation"
      aria-label="Vehicle transformation demonstration"
    >
      <div className="transformation-sticky">
        <div className="wrap">
          <div className="section-heading">
            <div>
              <Eyebrow>THE TRANSFORMATION</Eyebrow>
              <h2>
                SEE THE <span className="muted">DIFFERENCE.</span>
              </h2>
            </div>
            <p>
              A different finish. A different feeling.
              <br />
              <span className="small">
                Scroll to rotate: road contamination → ceramic mirror gloss
              </span>
            </p>
          </div>

          <div className="car-stage">
            <span className="stage-word" aria-hidden="true">
              {reduced ? "REFINED" : activeStage === 0 ? "DIRTY" : activeStage === 1 ? "RESTORE" : "CERAMIC"}
            </span>
            <div className="stage-floor" />

            {near && <VehicleScene
              mode="detail"
              progress={scrollYProgress}
              reduced={!!reduced}
            />}

            <span className="car-corner">
              <Sparkles size={16} />
              REAL STUDIO TRANSFORMATION
            </span>
            <span className="car-note">50/50 CORRECTION &amp; CERAMIC FINISH</span>
          </div>

          <div
            className="stage-progress"
            role="tablist"
            aria-label="Transformation stages"
          >
            {["Before", "The transformation", "After"].map((text, i) => (
              <button
                key={text}
                type="button"
                role="tab"
                aria-selected={activeStage === i}
                className={`stage-tab ${activeStage === i ? "active" : ""}`}
                onClick={() => handleStageClick(i)}
              >
                <span>0{i + 1}</span>
                {text}
              </button>
            ))}
            <ArrowDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}
