import { Button, Eyebrow } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";
export function Packages() {
  return (
    <section className="packages section" id="packages">
      <div className="wrap">
        <Reveal className="section-heading">
          <div>
            <Eyebrow>THE RIGHT CARE. CLEAR PRICING.</Eyebrow>
            <h2>
              YOUR NEXT
              <br />
              <span className="muted">FRESH START.</span>
            </h2>
          </div>
          <p>
            Choose your starting point.
            <br />
            Explore the full package details and book online.
          </p>
        </Reveal>
        <div className="package-grid">
          {[
            {
              title: "Interior",
              price: "150",
              text: "A fresh start for the space inside.",
              label: "01 / INTERIOR CARE",
            },
            {
              title: "Full service",
              price: "200",
              text: "Interior and exterior, together.",
              label: "02 / THE COMPLETE FEELING",
            },
            {
              title: "Specialty",
              price: null,
              text: "Ceramic coating, paint correction, and additional services.",
              label: "03 / GO A LITTLE FURTHER",
            },
          ].map((item, i) => (
            <Reveal
              key={item.title}
              className={`package ${i === 1 ? "featured" : ""}`}
              delay={i * 0.08}
            >
              {i === 1 && <span className="package-ribbon">INSIDE & OUT</span>}
              <p className="eyebrow">{item.label}</p>
              <h3>{item.title}</h3>
              {item.price ? (
                <p className="price">
                  <small>Starting at</small>
                  <span>
                    <sup>$</sup>
                    {item.price}
                  </span>
                </p>
              ) : (
                <p className="price custom-price">
                  <small>Tailored to your vehicle</small>
                  <span>Let’s talk.</span>
                </p>
              )}
              <p className="package-description">{item.text}</p>
              <Button secondary={i !== 1}>
                {item.price ? "Book this service" : "Explore services"}
              </Button>
            </Reveal>
          ))}
        </div>
        <p className="pricing-note">
          Final pricing varies with vehicle size and condition. View the booking
          platform for current package inclusions and add-ons.
        </p>
      </div>
    </section>
  );
}
