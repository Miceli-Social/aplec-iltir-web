"use client";

import { useEffect, useState } from "react";

const slides = [
  {
    eyebrow: "El per què",
    title: "La democràcia també es cultiva.",
    body: [
      "Els pobles tenen coneixement, energia i iniciativa. Quan aquestes capacitats es troben, s’organitzen i disposen d’espais estables, poden transformar la vida quotidiana.",
      "Iltiŕ connecta l’escala més propera amb els reptes que compartim com a territori.",
    ],
  },
  {
    eyebrow: "Més enllà de la trobada",
    title: "L’Aplec és un punt de trobada dins d’un procés més llarg.",
    body: [
      "La preparació de l’Aplec obre espais perquè els pobles comparteixin què els preocupa, què estan fent i en quins moments té sentit col·laborar.",
      "La trobada és important, però també ho són les relacions, els grups de treball i els acords que continuen abans i després.",
    ],
  },
  {
    eyebrow: "El territori que ja existeix",
    title: "Partim de la vida i l’experiència dels pobles.",
    body: [
      "Als tres municipis ja hi ha persones, entitats, espais i iniciatives que cuiden la vida comunitària. La proposta no és substituir-les ni dirigir-les.",
      "Volem que sigui més fàcil conèixer-se, compartir informació i trobar col·laboracions quan siguin útils.",
    ],
  },
  {
    eyebrow: "Compartir sense uniformitzar",
    title: "Cada poble decideix què necessita i què vol compartir.",
    body: [
      "Moltes qüestions es poden treballar directament dins del municipi. Quan un repte és compartit o coordinar-se pot reforçar el procés, les sectorials ofereixen un espai per fer-ho.",
      "L’objectiu no és que tot segueixi el mateix recorregut, sinó que la informació circuli i que la gent pugui decidir amb més coneixement.",
    ],
  },
];

export function ManifestoSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      14000,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const slide = slides[active];
  return (
    <section
      id="relat"
      className="manifesto manifesto-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="section-number">{String(active + 1).padStart(2, "0")}</span>
      <div className="manifesto-title">
        <span className="eyebrow">{slide.eyebrow}</span>
        <h2>{slide.title}</h2>
      </div>
      <div className="manifesto-copy" aria-live="polite">
        {slide.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="slide-controls">
          <div>
            {slides.map((item, index) => (
              <button
                type="button"
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
                aria-label={`Mostra: ${item.title}`}
                key={item.title}
              />
            ))}
          </div>
          <button type="button" className="pause-button" onClick={() => setPaused((value) => !value)}>
            {paused ? "Continuar" : "Pausa"}
          </button>
        </div>
      </div>
    </section>
  );
}
