"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { type MotionValue, useMotionValueEvent } from "motion/react";
import {
  ChevronsLeftRight,
  ShieldCheck,
  Zap,
  Disc,
  X,
} from "lucide-react";

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  tag: string;
  description: string;
  icon: typeof ShieldCheck;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "paint",
    x: 28,
    y: 48,
    tag: "PAINT CORRECTION",
    title: "50/50 Optical Defect Removal",
    description:
      "Precision dual-action machine compounding eliminates 90%+ of micro-scratches, swirl marks, and oxidation to restore deep clarity.",
    icon: Zap,
  },
  {
    id: "ceramic",
    x: 68,
    y: 38,
    tag: "SURFACE PROTECTION",
    title: "9H Ceramic Coating",
    description:
      "Multi-year hydrophobic barrier delivering extreme water beading, chemical resistance, and liquid-mirror reflection under studio lighting.",
    icon: ShieldCheck,
  },
  {
    id: "wheels",
    x: 52,
    y: 65,
    tag: "WHEEL & TIRE CARE",
    title: "Iron Decontamination & Dressing",
    description:
      "Brake dust breakdown with pH-neutral chemistry, ceramic rim face sealing, and UV-inhibiting satin tire nourishment.",
    icon: Disc,
  },
];

interface Props {
  progress: MotionValue<number>;
  reduced?: boolean;
  stage: number;
  onStageChange: (stage: number) => void;
}

export function TransformationShowcase({
  progress,
  reduced = false,
  stage,
  onStageChange,
}: Props) {
  // sliderPosition: 0 to 100 representing reveal boundary (0 = all before, 100 = all after)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isInteracting, setIsInteracting] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [mode, setMode] = useState<"stages" | "slider">("stages");
  const containerRef = useRef<HTMLDivElement>(null);



  // Sync with scroll progression when not actively dragging slider
  useMotionValueEvent(progress, "change", (latest) => {
    if (reduced || isInteracting) return;
    const nextStage = latest < 0.32 ? 0 : latest < 0.72 ? 1 : 2;
    if (nextStage !== stage) {
      setMode("stages");
      onStageChange(nextStage);
    }
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest(".hotspot-trigger") ||
        (e.target as HTMLElement).closest(".hotspot-card")) {
      return;
    }
    setIsInteracting(true);
    setMode("slider");
    updateSlider(e.clientX);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isInteracting) {
      setIsInteracting(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // pointer capture already released
      }
    }
  };

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setMode("slider");
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setMode("slider");
      setSliderPos((prev) => Math.min(100, prev + 5));
    } else if (e.key === "Escape") {
      setActiveHotspot(null);
    }
  };

  return (
    <div
      className={`transformation-showcase mode-${mode}`}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Interactive vehicle detailing before and after transformation"
    >
      {/* Visual Image Stage */}
      <div className="showcase-viewport">
        {/* Base Layer: Stage 03 After (Refined Ceramic Finish) */}
        <div className="showcase-layer layer-after">
          <Image
            src="/images/transformation-after.webp"
            alt="Porsche sports car with full paint correction and mirror-like ceramic coating finish"
            title="After: Full paint correction and ceramic coating by Detail Clinic"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="showcase-img"
          />
        </div>

        {/* Middle Layer: Stage 02 The Transformation (50/50 Compound & Polish) */}
        {mode === "stages" && (
          <div
            className={`showcase-layer layer-stage2 ${stage === 1 ? "active" : ""}`}
          >
            <Image
              src="/images/transformation-stage2.webp"
              alt="Porsche during multi-stage paint correction with 50/50 test tape line and inspection light"
              title="During: Multi-stage paint correction by Detail Clinic"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="showcase-img"
            />
          </div>
        )}

        {/* Top Layer: Stage 01 Before (Defects, Swirls & Oxidation) */}
        <div
          className={`showcase-layer layer-before ${mode === "stages" && stage === 0 ? "active" : ""}`}
          style={
            mode === "slider"
              ? { clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }
              : undefined
          }
        >
          <Image
            src="/images/transformation-before.webp"
            alt="Porsche before detailing with paint swirl marks, road contamination and brake dust"
            title="Before: Paint swirls, road contamination — Detail Clinic paint correction"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="showcase-img"
          />
        </div>

        {/* Interactive Split-Slider Curtain Handle (active in slider mode) */}
        {mode === "slider" && (
          <div
            className="showcase-divider"
            style={{ left: `${sliderPos}%` }}
            aria-hidden="true"
          >
            <div className="divider-line" />
            <div className="divider-handle">
              <ChevronsLeftRight size={18} />
            </div>
          </div>
        )}

        {/* Mode & Inspection Hotspots Overlay */}
        <div className="showcase-hotspots" aria-label="Detailing inspection points">
          {HOTSPOTS.map((spot) => {
            const Icon = spot.icon;
            const isSelected = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                className={`hotspot-anchor ${isSelected ? "selected" : ""}`}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              >
                <button
                  type="button"
                  className="hotspot-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isSelected ? null : spot);
                  }}
                  aria-expanded={isSelected}
                  aria-label={`Inspect ${spot.title}`}
                >
                  <span className="hotspot-pulse" />
                  <span className="hotspot-core">
                    <Icon size={13} />
                  </span>
                </button>

                {isSelected && (
                  <div
                    className="hotspot-card"
                    role="dialog"
                    aria-label={spot.title}
                  >
                    <div className="hotspot-header">
                      <span className="hotspot-tag">{spot.tag}</span>
                      <button
                        type="button"
                        className="hotspot-close"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveHotspot(null);
                        }}
                        aria-label="Close inspection detail"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <h4 className="hotspot-title">{spot.title}</h4>
                    <p className="hotspot-desc">{spot.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View Mode Switcher Pill */}
        <div className="showcase-controls-overlay">
          <div className="view-mode-toggle" role="tablist" aria-label="Showcase view type">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "stages"}
              className={`mode-btn ${mode === "stages" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setMode("stages");
              }}
            >
              Stage View
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "slider"}
              className={`mode-btn ${mode === "slider" ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setMode("slider");
              }}
            >
              Split Comparison
            </button>
          </div>

          <span className="showcase-hint">
            {mode === "slider"
              ? "DRAG CURTAIN TO COMPARE"
              : "SCROLL OR SELECT STAGES BELOW"}
          </span>
        </div>
      </div>

      {/* Hidden range input for assistive technology */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPos}
        onChange={(e) => {
          setMode("slider");
          setSliderPos(Number(e.target.value));
        }}
        className="sr-only"
        aria-label="Before and after split curtain percentage"
      />
    </div>
  );
}
