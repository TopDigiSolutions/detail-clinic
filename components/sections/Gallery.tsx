"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X, Plus } from "lucide-react";
import { Reveal } from "@/components/animations/Reveal";
import { Eyebrow } from "@/components/ui/Button";
import { Comparison } from "@/components/ui/Comparison";
import { photos } from "@/lib/content";
const work = [
  {
    src: photos.suv,
    category: "Exterior",
    title: "Everyday SUV. Exceptional care.",
    alt: "Dark Hyundai SUV outside the Detail Clinic studio",
  },
  {
    src: photos.jeep,
    category: "Exterior",
    title: "Ready for the next adventure",
    alt: "Jeep Wrangler under the inspection lights at Detail Clinic",
  },
  {
    src: photos.interior,
    category: "Interior",
    title: "A fresh start inside",
    alt: "Clean Hyundai steering wheel and center console",
  },
  {
    src: photos.exterior,
    category: "Exterior",
    title: "Ready for the road",
    alt: "Red Chevrolet Camaro at Detail Clinic",
  },
  {
    src: "/images/gallery3-1-f3613ec0-8a1c-432a-9390-a87d2f079a7e.webp",
    category: "Interior",
    title: "Care in every corner",
    alt: "Warm leather interior from the Detail Clinic gallery",
  },
];
export function Gallery() {
  const [filter, setFilter] = useState("All work");
  const [zoom, setZoom] = useState<(typeof work)[number] | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const selected = work.filter(
    (item) => filter === "All work" || item.category === filter,
  );
  return (
    <section className="gallery section wrap" id="gallery">
      <Reveal className="section-heading">
        <div>
          <Eyebrow>THE WORK SPEAKS</Eyebrow>
          <h2>
            REAL CARS.
            <br />
            REAL <span className="muted">DIFFERENCE.</span>
          </h2>
        </div>
        <a
          className="text-link"
          href="https://www.detailcliniclacrosse.com/gallery"
          title="View the full Detail Clinic photo gallery"
        >
          View original gallery
          <ArrowUpRight size={18} />
        </a>
      </Reveal>
      <div className="gallery-filters" role="group" aria-label="Filter gallery">
        {[
          "All work",
          "Interior",
          "Exterior",
          "Full Detail",
          "Tint",
          "Paint Correction",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            aria-pressed={filter === item}
          >
            {item}
          </button>
        ))}
      </div>
      {(filter === "All work" || filter === "Exterior") && (
        <div className="comparison-grid">
          <div>
            <Comparison
              before={photos.before}
              after={photos.after}
              label="Exterior running board"
            />
            <p>
              <span>01 / EXTERIOR DETAILS</span>Small details. Visible change.
            </p>
          </div>
          <div>
            <Comparison
              before="/images/gallery4-2-before-27b2a875-f995-4fe7-a3b5-2282e79faa95.webp"
              after="/images/gallery4-2-after-9db3e1b5-f088-4d5d-b6b6-76c4766e5072.webp"
              label="Exterior finish"
            />
            <p>
              <span>02 / THE FINISH</span>See it for yourself.
            </p>
          </div>
        </div>
      )}
      <div className="work-grid">
        {selected.map((item) => (
          <button
            className="work-photo"
            key={item.src}
            onClick={() => {
              setZoom(item);
              dialog.current?.showModal();
            }}
              aria-label={`Enlarge ${item.category} ${item.title}`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              title={item.title}
              fill
              sizes="(max-width:700px) 90vw, 30vw"
            />
            <span>
              <small>{item.category}</small>
              {item.title}
            </span>
            <Plus className="work-plus" size={23} />
          </button>
        ))}
      </div>
      {selected.length === 0 && (
        <div className="gallery-empty">
          <p>Looking for {filter.toLowerCase()} inspiration?</p>
          <p>
            Our published gallery doesn’t identify a dedicated{" "}
            {filter.toLowerCase()} collection yet. Ask us to see relevant work
            for your vehicle.
          </p>
          <a className="text-link" href="#contact" title="Contact the Detail Clinic team">
            Talk with our team
            <ArrowUpRight size={18} />
          </a>
        </div>
      )}
      <p className="gallery-note">
        Actual Detail Clinic photographs. Before and after photos retain their
        original perspectives.
      </p>
      <dialog
        ref={dialog}
        className="lightbox"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="lightbox-close"
          aria-label="Close image"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {zoom && (
          <div className="lightbox-image">
            <Image src={zoom.src} alt={zoom.alt} title={zoom.title} fill sizes="90vw" />
            <p>{zoom.title}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
