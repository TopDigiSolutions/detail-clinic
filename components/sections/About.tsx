import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./About.module.css";

export function About() {
  return (
    <section className={styles.section} id="about" aria-labelledby="about-heading">
      <div className={styles.container}>
        <div className={styles.summary}>
          <div>
            <h2 id="about-heading">About Us</h2>
            <p>
              At Detail Clinic, we believe vehicle service should be stress-free, not anxiety-inducing.
              Our process is built around clear communication and transparency from start to finish.
            </p>
            <p>
              We believe in honesty, hard work, and doing the job right the first time—so you’re not
              just getting a clean car, you’re choosing reliable service from people who truly care
              about you and your vehicle.
            </p>
          </div>
          <div className={styles.action}>
            <Link className="button" href="/about-us">
              Read our story
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
