"use client";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  MapPin,
  Star,
  ShieldCheck,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { business } from "@/lib/content";
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduced) {
      video.pause();
      return;
    }

    video.play().catch(() => { });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else {
        video.play().catch(() => { });
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => { });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [reduced]);

  return (
    <>
      <section id="home" className="hero" ref={ref}>
        <motion.div
          className="hero-image"
          style={{ y: reduced ? 0 : y }}
          initial={false}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <Image
            src="/images/studio.webp"
            alt="A detailed Mercedes under the inspection lights at Detail Clinic in La Crosse"
            title="The Detail Clinic studio — La Crosse, WI"
            fill
            priority
            sizes="100vw"
            quality={85}
          />
          <video
            ref={videoRef}
            className={`hero-video ${videoLoaded ? "visible" : ""}`}
            muted
            playsInline
            loop
            preload="none"
            onPlay={() => setVideoLoaded(true)}
            aria-label="Slow cinematic movement through Detail Clinic studio photographs"
          >
            <source src="/videos/studio-film.webm" type="video/webm" />
          </video>
          <div className="hero-photo-label">
            <span>THE DETAIL CLINIC STUDIO</span>
            <p>Precision care. Personal service.</p>
          </div>
        </motion.div>
        <div className="hero-shade" />
        <div className="hero-content wrap">
          <p className="eyebrow">
            <span />
            DETAILING. ELEVATED.
          </p>
          <h1>
            {["PRECISION", "IN EVERY", "DETAIL."].map((line, i) => (
              <span className={i === 2 ? "outline-text" : ""} key={line}>
                <span className="hero-line" style={{ animationDelay: `${i * .1}s` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <div className="hero-details">
            <p className="hero-description">
              For the love of the drive.
              <br />
              Professional auto detailing & window tint
              <br className="desktop-break" /> in La Crosse, Wisconsin.
            </p>
            <div className="button-row">
              <Button>Book your detail</Button>
              <a className="text-link" href="#services" title="Explore our services">
                Explore services <ArrowUpIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="hero-side">THE STANDARD IS IN THE DETAILS.</div>
        <div className="hero-bottom wrap">
          <a href="#experience" className="scroll-link" title="Scroll to discover more">
            <span>
              <ArrowDown size={15} />
            </span>
            SCROLL TO DISCOVER
          </a>
          <span className="hero-location">
            <MapPin size={14} />
            LA CROSSE, WISCONSIN
          </span>
          <span className="hero-index">
            01 <i /> 06
          </span>
        </div>
      </section>
      <div className="trust-bar">
        <div className="wrap trust-inner">
          <a href={business.reviews} className="rating" title="View Detail Clinic reviews on Google">
            <span className="google-g">G</span>
            <strong>5.0</strong>
            <div>
              <span className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={11} fill="currentColor" />
                ))}
              </span>
              <small>GOOGLE RATING · AS LISTED ON OUR SITE</small>
            </div>
          </a>
          <span>
            <ShieldCheck />
            Care without compromise
          </span>
          <span>
            <MessageCircle />
            Clear, honest communication
          </span>
          <span>
            <ScanLine />
            Every detail matters
          </span>
        </div>
      </div>
    </>
  );
}
function ArrowUpIcon() {
  return <span aria-hidden="true">↗</span>;
}
