"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Eyebrow } from "@/components/ui/Button";
export function Film() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) element.pause();
    });
    observer.observe(element);
    const visibility = () => { if (document.hidden) element.pause(); };
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  async function toggle() {
    if (!video.current) return;
    if (playing) {
      video.current.pause();
      setPlaying(false);
    } else {
      setLoaded(true);
      if (!loaded) video.current.src = "/videos/studio-film.webm";
      try {
        await video.current.play();
        setPlaying(true);
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <section className="film" aria-label="A look inside Detail Clinic">
      <Image
        src="/images/studio.webp"
        alt="A Mercedes in the Detail Clinic studio under geometric inspection lights"
        title="A look inside the Detail Clinic studio"
        fill
        sizes="100vw"
      />
      <video
        ref={video}
        onPause={() => setPlaying(false)}
        className={loaded ? "film-video visible" : "film-video"}
        muted
        playsInline
        loop
        preload="none"
        poster={loaded ? "/images/studio-preview.webp" : undefined}
        aria-label="Slow cinematic movement through Detail Clinic studio photographs"
      />
      <div className="film-shade" />
      <div className="film-content wrap">
        <Eyebrow>IT’S MORE THAN A SERVICE.</Eyebrow>
        <h2>
          MORE THAN CLEAN.
          <br />
          PROPERLY <span className="serif">cared for.</span>
        </h2>
        <button
          className="film-play"
          onClick={toggle}
          aria-label={playing ? "Pause studio film" : "Play studio film"}
        >
          {playing ? <Pause size={20} /> : <Play size={20} />}
          <span>
            {failed
              ? "FILM UNAVAILABLE"
              : playing
                ? "PAUSE STUDIO FILM"
                : "PLAY STUDIO FILM"}
            <small aria-hidden="true">A film of our studio photography</small>
          </span>
        </button>
      </div>
      <span className="film-bottom">THE DETAIL CLINIC STANDARD</span>
    </section>
  );
}
