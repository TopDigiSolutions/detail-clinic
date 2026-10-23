"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
export function Comparison({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  const [value, setValue] = useState(50);
  const id = useId();
  return (
    <div className="comparison">
      <Image
        src={after}
        alt={`${label}, after detailing`}
        title={`${label} — after Detail Clinic detailing`}
        fill
        sizes="(max-width:700px) 90vw, 50vw"
      />
      <div
        className="comparison-before"
        style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`${label}, before detailing`}
          title={`${label} — before Detail Clinic detailing`}
          fill
          sizes="(max-width:700px) 90vw, 50vw"
        />
      </div>
      <span className="comparison-label left">BEFORE</span>
      <span className="comparison-label right">AFTER</span>
      <div className="comparison-divider" style={{ left: `${value}%` }}>
        <span>
          <ChevronsLeftRight size={22} />
        </span>
      </div>
      <label className="sr-only" htmlFor={id}>
        {label}: before and after comparison
      </label>
      <input
        id={id}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        aria-valuetext={`${value}% before image visible`}
        className="comparison-input"
      />
      <span className="comparison-hint">DRAG TO DISCOVER</span>
    </div>
  );
}
