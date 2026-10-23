import Image from "next/image";
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { Button, Eyebrow } from "@/components/ui/Button";
import { business } from "@/lib/content";
import { Reveal } from "@/components/animations/Reveal";
export function Contact() {
  return (
    <section className="contact section wrap" id="contact">
      <Reveal className="section-heading">
        <div>
          <Eyebrow>RIGHT HERE IN LA CROSSE</Eyebrow>
          <h2>
            LET’S MAKE
            <br />
            YOUR CAR’S <span className="serif">day.</span>
          </h2>
        </div>
        <p className="contact-intro">
          Great care starts with a conversation. Tell us about your vehicle,
          explore your options, or stop by our La Crosse studio.
        </p>
      </Reveal>
      <div className="contact-grid">
        <div className="contact-info">
          <h3>Come say hello.</h3>
          <div>
            <MapPin />
            <p>
              <small>FIND THE STUDIO</small>
              {business.address}
              <br />
              {business.city}
              <a href={business.directions} title="Get directions to Detail Clinic">
                Get directions
                <ArrowUpRight size={15} />
              </a>
            </p>
          </div>
          <div>
            <Phone />
            <p>
              <small>GIVE US A CALL</small>
              <a className="phone" href={business.phoneHref} title={`Call Detail Clinic at ${business.phone}`}>
                {business.phone}
              </a>
            </p>
          </div>
          <div>
            <Mail />
            <p>
              <small>EMAIL US</small>
              <a className="email" href={business.emailHref} title={`Email Detail Clinic at ${business.email}`}>
                {business.email}
              </a>
            </p>
          </div>
          <div>
            <Clock />
            <p>
              <small>STUDIO HOURS</small>Monday – Sunday
              <br />
              8:00 AM – 6:00 PM
            </p>
          </div>
          <div className="contact-actions">
            <Button>Book your detail</Button>
            <a className="text-link" href={business.contact} title="Ask Detail Clinic a question">
              Ask a question
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
        <div className="contact-studio">
          <Image
            src="/images/studio.webp"
            alt="A Mercedes under the detailing studio's inspection lights"
            title="Detail Clinic studio — 1201 La Crosse St, La Crosse, WI"
            fill
            sizes="(max-width: 800px) 100vw, 55vw"
          />
          <a href={business.directions} className="map-address" title="Get directions to Detail Clinic studio">
            <span>
              VISIT THE STUDIO<small>1201 LA CROSSE ST · GET DIRECTIONS</small>
            </span>
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
