import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { business } from "@/lib/content";
export function Button({
  children = "Book now",
  href = business.booking,
  secondary = false,
  className = "",
  title,
}: {
  children?: ReactNode;
  href?: string;
  secondary?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <a
      href={href}
      className={`button ${secondary ? "button-outline" : ""} ${className}`}
      title={title ?? (typeof children === "string" ? children : "Book now")}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
