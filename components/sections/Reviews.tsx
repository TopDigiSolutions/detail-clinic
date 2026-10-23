"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ArrowLeft, ArrowRight, Star, ArrowUpRight } from "lucide-react";
import { business } from "@/lib/content";
import { Eyebrow } from "@/components/ui/Button";
const reviews = [
  { name: "Erich Gunthel", quote: "Great customer service" },
  { name: "Kanina Shabani", quote: "fair prices and does a good job" },
  { name: "San López", quote: "Everything was explained in advance" },
];
export function Reviews() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section className="reviews section wrap" aria-label="Customer reviews">
      <div className="reviews-heading">
        <Eyebrow>THE WORD AROUND TOWN</Eyebrow>
        <a className="text-link" href={business.reviews} title="Read Detail Clinic reviews on Google">
          Read Google reviews
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="review-layout">
        <div className="review-rating">
          <span>
            5.0<span className="rating-dot">/5</span>
          </span>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={18} fill="currentColor" />
            ))}
          </div>
          <p>GOOGLE RATING</p>
          <small>As displayed on our current website.</small>
        </div>
        <div className="review-quote" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: reduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="quote-mark" aria-hidden="true">
                “
              </span>
              <blockquote>{reviews[index].quote}</blockquote>
              <p className="review-name">
                {reviews[index].name}
                <span>GOOGLE REVIEW EXCERPT · FROM OUR WEBSITE</span>
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="review-controls">
            <span>
              0{index + 1}
              <i />0{reviews.length}
            </span>
            <button
              aria-label="Previous review"
              onClick={() =>
                setIndex((index + reviews.length - 1) % reviews.length)
              }
            >
              <ArrowLeft size={18} />
            </button>
            <button
              aria-label="Next review"
              onClick={() => setIndex((index + 1) % reviews.length)}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
