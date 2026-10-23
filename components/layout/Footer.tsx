"use client";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowUpRight, Phone, MessageSquare, Mail, MapPin } from "lucide-react";
import { Logo } from "./Header";
import { Button } from "@/components/ui/Button";
import { business, nav, photos } from "@/lib/content";

export function FinalCTA() {
  const reduced = useReducedMotion();

  const lineVariants: Variants = {
    hidden: { opacity: 0, x: reduced ? 0 : -80 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: reduced ? 0.01 : 0.8,
        delay: reduced ? 0 : i * 0.12,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta-photo">
        <Image
          src={photos.jeep}
          alt="Jeep Wrangler with a reflective finish in the Detail Clinic studio"
          title="Detail Clinic — Precision in Every Detail"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
        />
        <div className="final-photo-caption">
          <span>THE DETAIL CLINIC STANDARD</span>
          <p>A finish worth a second look.</p>
        </div>
      </div>
      <motion.div
        className="wrap"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.p
          custom={0}
          variants={lineVariants}
          className="eyebrow"
        >
          <span />
          EXCEPTIONAL CARE. EVERY DETAIL.
        </motion.p>
        <h2 id="final-cta-title">
          <motion.span
            custom={1}
            variants={lineVariants}
            className="final-cta-line"
          >
            YOUR NEXT
          </motion.span>
          <motion.span
            custom={2}
            variants={lineVariants}
            className="final-cta-line"
          >
            DRIVE
          </motion.span>
          <motion.span
            custom={3}
            variants={lineVariants}
            className="final-cta-line serif"
          >
            starts here.
          </motion.span>
        </h2>
        <motion.div
          custom={4}
          variants={lineVariants}
          className="final-cta-bottom"
        >
          <p>
            A fresh interior. A flawless first impression. Give your vehicle
            the attention it deserves.
          </p>
          <div className="button-row">
            <Button>Book your detail</Button>
            <Button href={business.contact} secondary>
              Let’s talk
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
export function Footer({ homePath = "" }: { homePath?: string }) {
  return (
    <footer className="footer">
      <div className="wrap">
      <div className="footer-main">
        <div>
          <Logo homePath={homePath} />
          <p>
            Professional auto detailing.
            <br />
            Proudly in La Crosse, Wisconsin.
          </p>
          <div className="footer-icons">
            <a aria-label="Call Detail Clinic" title="Call Detail Clinic" href={business.phoneHref}>
              <Phone size={18} />
            </a>
            <a aria-label="Text Detail Clinic" title="Text Detail Clinic" href="sms:+16087975137">
              <MessageSquare size={18} />
            </a>
            <a aria-label="Email Detail Clinic" title="Email Detail Clinic" href={business.emailHref}>
              <Mail size={18} />
            </a>
            <a
              aria-label="Detail Clinic on Google Maps"
              title="Detail Clinic on Google Maps"
              href={business.reviews}
            >
              <MapPin size={18} />
            </a>
          </div>
        </div>
        <div className="footer-nav">
          <p>EXPLORE</p>
          {nav.slice(1).map(([name, href]) => (
            <a key={name} href={href.startsWith("#") ? `${homePath}${href}` : href} title={`Navigate to ${name}`}>
              {name}
            </a>
          ))}
        </div>
        <div className="footer-contact">
          <p>COME SAY HELLO</p>
          <address>
            {business.address}
            <br />
            {business.city}
          </address>
          <a href={business.phoneHref} title={`Call Detail Clinic at ${business.phone}`}>{business.phone}</a>
          <a href={business.emailHref} title={`Email Detail Clinic at ${business.email}`}>{business.email}</a>
          <a className="text-link" href={business.booking} title="Book your detail online">
            Book now
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Detail Clinic. All rights reserved.
        </span>
        <a href={business.reviews} title="Find Detail Clinic on Google">Find us on Google ↗</a>
        <a href="/credits" title="Image and model credits">Image & model credits</a>
        <a href={homePath ? "#main" : "#home"} title="Back to top of page">Back to top ↑</a>
      </div>
      </div>
    </footer>
  );
}
