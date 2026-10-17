"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { HomeCarouselPhoto } from "@/lib/aplec-2026-returns";

export function AplecHomePhotoCarousel({ slides }: { slides: HomeCarouselPhoto[] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (slides.length < 2 || paused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, reducedMotion, slides.length]);

  if (slides.length === 0) return null;
  const currentSlide = activeSlide % slides.length;
  const slide = slides[currentSlide];
  const navigate = (direction: number) => {
    setPaused(true);
    setActiveSlide((current) => (current % slides.length + direction + slides.length) % slides.length);
  };

  return (
    <div className="aplec-reviu-home-photo" onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
        }
      }}>
      <div className="aplec-reviu-home-slide" role="group" aria-roledescription="diapositiva"
        aria-label={`${slide.title}, fotografia ${currentSlide + 1} de ${slides.length}`}>
        <Image src={slide.src} alt={slide.title} width={1600} height={900}
          sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1448px) calc((100vw - 48px) * 0.6), 840px" />
      </div>
      <p className="aplec-reviu-home-caption" aria-live={paused ? "polite" : "off"} aria-atomic="true">
        <span>{slide.time}</span>{slide.title}
      </p>
      {slides.length > 1 && (
        <div className="aplec-reviu-home-controls" aria-label="Navegació de fotografies">
          <button type="button" onClick={() => navigate(-1)} aria-label="Fotografia anterior">←</button>
          <span aria-live={paused ? "polite" : "off"}>{currentSlide + 1} / {slides.length}</span>
          <button type="button" onClick={() => navigate(1)} aria-label="Fotografia següent">→</button>
          {!reducedMotion && (
            <button type="button" className="aplec-reviu-home-pause"
              onClick={() => setPaused((current) => !current)}
              aria-label={paused ? "Reprèn el carrusel" : "Pausa el carrusel"}>
              {paused ? "Continua" : "Pausa"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
