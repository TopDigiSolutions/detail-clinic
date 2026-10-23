"use client";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button, Eyebrow } from "@/components/ui/Button";
import { business } from "@/lib/content";
import { useReducedMotion } from "@/lib/useReducedMotion";

export function TransformVehicle() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduced) {
      video.pause();
      return;
    }

    video.play().catch(() => {});

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }, { threshold: 0.2 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className="transform-vehicle section"
      id="transform-vehicle"
      aria-label="Transform Your Vehicle"
    >
      <div className="wrap transform-grid">
        <Reveal className="transform-copy">
          <Eyebrow>THE DETAIL CLINIC DIFFERENCE</Eyebrow>
          <h2>Transform Your Vehicle</h2>
          <div className="transform-text">
            <p>
              Looking for expert automotive detailing in La Crosse? Detail Clinic
              brings the shine to you — fast, easy, and professional. We work
              around your schedule and guarantee a spotless, showroom finish every
              time.
            </p>
            <p>
              Whether you need a full detail, deep interior cleaning, exterior
              wash, multi-stage paint correction, or ceramic coating, we’ve got
              you covered. Hundreds of happy clients trust Detail Clinic for
              results that last.
            </p>
            <p>
              Book today and see why we’re La Crosse’s favorite automotive care
              and detailing team.
            </p>
          </div>
          <div className="transform-actions">
            <Button href={business.booking}>Book your detail</Button>
            <a href="#services" className="text-link" title="Explore our detailing services">
              Explore our services <ArrowUpRight size={17} />
            </a>
          </div>
        </Reveal>

        <Reveal className="transform-media" delay={0.15}>
          <div className="transform-video-wrapper">
            <video
              ref={videoRef}
              src="/videos/suv.mp4"
              muted
              playsInline
              loop
              autoPlay
              preload="metadata"
              className="transform-video"
              aria-label="SUV detailing transformation video"
            />
            <div className="transform-badge">
              <span>PRECISION CARE</span>
              <p>Vehicle Transformation in Motion</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
