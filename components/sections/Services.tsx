"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Button, Eyebrow } from "@/components/ui/Button";
import { services, business } from "@/lib/content";
export function Experience() {
  return (
    <section className="experience wrap section" id="experience">
      <Reveal>
        <Eyebrow>THE DETAIL CLINIC EXPERIENCE</Eyebrow>
      </Reveal>
      <div className="intro-grid">
        <Reveal>
          <h2>
            NOT JUST CLEAN.
            <br />
            <span className="muted">A WHOLE NEW FEELING.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            That first drive after a proper detail. The fresh interior. The way
            the light catches the paint. The feeling of getting your car back.
          </p>
          <p>
            We’re here for that. With honest communication, hard work, and care
            you can see in every detail.
          </p>
          <a href="/about-us" className="text-link" title="Get to know Detail Clinic">
            Get to know Detail Clinic <ArrowUpRight size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
export function Services() {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const service = services[selected];
  return (
    <section className="services section" id="services">
      <div className="wrap">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>OUR SERVICES</Eyebrow>
            <h2>
              EVERY SURFACE.
              <br />
              EVERY STANDARD.
            </h2>
          </div>
          <p>
            From your daily driver to your pride and joy.
            <br />
            Find the right care for your vehicle.
          </p>
        </Reveal>
        <div className="service-grid">
          {services.slice(0, 3).map((item, i) => (
            <Reveal key={item.name} delay={i * 0.08}>
              <a className="service-card" href={business.booking} title={`Book ${item.name} at Detail Clinic`}>
                <div className="service-photo">
                  <Image
                    src={item.image}
                    alt={`Detail Clinic ${item.name} work`}
                    title={`Detail Clinic ${item.name} — La Crosse, WI`}
                    fill
                    sizes="(max-width:700px) 90vw, 32vw"
                  />
                  <span className="photo-overlay" />
                  <span className="service-number">0{i + 1}</span>
                  <span className="card-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </div>
                <div className="service-info">
                  <p className="eyebrow">{item.price}</p>
                  <h3>{item.name}</h3>
                  <p>{item.tag}</p>
                  <span className="service-more">
                    Explore package <ArrowRight size={14} />
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="specialty-links">
          {services.slice(3).map((item, i) => (
            <a href={business.booking} key={item.name} title={`Book ${item.name} at Detail Clinic`}>
              <span>0{i + 4}</span>
              <h3>{item.name}</h3>
              <ArrowUpRight size={20} />
            </a>
          ))}
        </div>
        <div className="showcase" id="detailing">
          <div className="showcase-copy">
            <Eyebrow>A CLOSER LOOK</Eyebrow>
            <div
              className="showcase-tabs"
              role="tablist"
              aria-label="Explore detailing services"
            >
              {services.slice(0, 5).map((item, i) => (
                <button
                  type="button"
                  role="tab"
                  id={`service-tab-${i}`}
                  aria-controls="service-panel"
                  aria-selected={selected === i}
                  tabIndex={selected === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (
                      ["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)
                    ) {
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 4
                            : (selected + (e.key === "ArrowRight" ? 1 : 4)) % 5;
                      setSelected(next);
                      document.getElementById(`service-tab-${next}`)?.focus();
                    }
                  }}
                  key={item.name}
                  onClick={() => setSelected(i)}
                >
                  <span>0{i + 1}</span>
                  {item.name}
                  <ArrowUpRight size={16} />
                </button>
              ))}
            </div>
          </div>
          <div
            id="service-panel"
            role="tabpanel"
            aria-labelledby={`service-tab-${selected}`}
            className="showcase-visual"
          >
              <motion.div
                key={selected}
                initial={{
                  opacity: 0,
                  clipPath: reduced ? "none" : "inset(0 100% 0 0)",
                }}
                animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: reduced ? 0.01 : 0.45 }}
                className="showcase-slide"
              >
                <Image
                  src={service.image}
                  alt={`A closer look at ${service.name.toLowerCase()} by Detail Clinic`}
                  title={`Detail Clinic ${service.name}`}
                  fill
                  sizes="(max-width:800px) 90vw, 60vw"
                />
                <div className="showcase-caption">
                  <span>0{selected + 1} / DETAIL CLINIC</span>
                  <h3>{service.tag}</h3>
                  <p>{service.description}</p>
                  <Button>Explore this service</Button>
                </div>
              </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
