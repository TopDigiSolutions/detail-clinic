import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { business, photos } from "@/lib/content";
import { Button, Eyebrow } from "@/components/ui/Button";
import styles from "@/components/sections/About.module.css";

export const metadata: Metadata = {
  title: "About Us | Detail Clinic",
  description: "Built on honesty, clear communication, and quality work—done right the first time. Meet Detail Clinic in La Crosse, Wisconsin.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | Detail Clinic",
    description: "Learn about Detail Clinic, our story, and our commitment to honest vehicle care in La Crosse, Wisconsin.",
    url: "/about-us",
  },
};

export default function AboutUs() {
  return (
    <>
      <Header homePath="/" />
      <main id="main" className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={`${styles.container} ${styles.heroGrid}`}>
            <div className={styles.intro}>
              <Eyebrow>GOOD PEOPLE. GREAT CARE.</Eyebrow>
              <h1 id="about-title">About Us</h1>
              <p>Built on honesty, clear communication, and quality work—done right the first time.</p>
              <Button>Book now</Button>
            </div>
            <div className={styles.heroPhoto}>
              <Image src={photos.jeep} alt="Jeep Wrangler under the inspection lights at Detail Clinic" fill preload sizes="(max-width: 800px) 90vw, 45vw" />
              <div className={styles.photoCaption}>
                <span>THE DETAIL CLINIC STANDARD</span>
                <p>Personal care. Every vehicle.</p>
              </div>
            </div>
          </div>
        </section>
        <section aria-labelledby="why-choose-us">
          <div className={styles.container}>
            <div className={styles.storyGrid}>
              <div className={styles.story}>
                <Eyebrow>CARE WITHOUT COMPROMISE</Eyebrow>
                <h2 id="why-choose-us">Why choose us</h2>
                <div className={styles.paragraphs}>
                  <p>
                    Have you ever left your car somewhere for service and didn’t hear anything for
                    hours—only to get a sudden call saying your vehicle is ready and you need to rush
                    to pick it up? At Detail Clinic, we believe vehicle service should be stress-free,
                    not anxiety-inducing. Our process is built around clear communication and
                    transparency from start to finish, and we communicate with you well before your
                    vehicle is ready so you can plan accordingly.
                  </p>
                  <p>
                    At Detail Clinic, we believe in honesty, hard work, and doing the job right the
                    first time. We are a God-fearing, customer-first business that values trust,
                    transparency, and long-term relationships. Our experience, passion for vehicles,
                    and commitment to quality set us apart. When you choose Detail Clinic, you’re not
                    just getting a clean car—you’re choosing reliable service from people who truly
                    care about you and your vehicle.
                  </p>
                </div>
              </div>
              <aside className={styles.card} aria-label="Detail Clinic information">
                <Eyebrow>COME SAY HELLO</Eyebrow>
                <strong>Detail Clinic</strong>
                <p className={styles.address}>1201 La Crosse Street<br />La Crosse, Wisconsin</p>
                <p className={styles.services}>Premium detailing, PPF, ceramic paint protection, and window tinting.</p>
                <div className={styles.action}>
                  <Button>Book now</Button>
                </div>
                <a className={styles.phone} href={business.phoneHref}>{business.phone}</a>
              </aside>
            </div>
          </div>
        </section>
        <section className={styles.tinted} aria-labelledby="about-detail-clinic">
          <div className={styles.container}>
            <Eyebrow>OUR STORY</Eyebrow>
            <h2 id="about-detail-clinic">About Detail Clinic</h2>
            <div className={styles.paragraphs}>
              <p>
                Detail Clinic is a trusted automotive detailing shop located at 1201 La Crosse Street,
                La Crosse, Wisconsin, proudly serving the community for over four years. We specialize
                in premium interior and exterior detailing, paint protection film (PPF), ceramic paint
                protection services, and window tinting—designed to keep your vehicle looking its best
                and protected for the long haul. What began as a mobile detailing service has grown
                into a dedicated shop built on passion, precision, and care.
              </p>
              <p>
                We understand that your vehicle is more than just transportation—it’s an investment,
                a source of pride, and part of your daily life. That’s why every vehicle at Detail
                Clinic is treated as if it were our own. Using proven techniques, high-quality
                products, and meticulous attention to detail, we focus on delivering results you can
                see and service you can feel. When you trust Detail Clinic with your vehicle, you’re
                choosing experience, honesty, and a team that truly cares.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer homePath="/" />
    </>
  );
}
