'use client';
import { useState, useEffect, useRef } from 'react';

// Giorno attivo + swipe sinistra/destra per passare da un giorno all'altro.
export default function useSwipeGiorni(giorni) {
  const [attivo, setAttivo] = useState(giorni[0]?.id ?? null);
  // Da che parte entra il nuovo giorno: 'dx' arriva da destra (si va avanti), 'sx' da sinistra
  const [verso, setVerso] = useState(null);
  const primoRender = useRef(true);
  const inizioTocco = useRef(null);

  const indiceAttivo = giorni.findIndex((g) => g.id === attivo);

  function vaiAl(id) {
    const nuovo = giorni.findIndex((g) => g.id === id);
    if (nuovo === -1 || nuovo === indiceAttivo) return;
    setVerso(nuovo > indiceAttivo ? 'dx' : 'sx');
    setAttivo(id);
    window.scrollTo({ top: 0 });
  }

  // Tiene visibile nella barra la seduta attiva, anche quando si cambia con lo swipe
  useEffect(() => {
    if (primoRender.current) {
      primoRender.current = false;
      return;
    }
    document
      .getElementById(`seduta-${attivo}`)
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [attivo]);

  function onTouchStart(e) {
    // Non interferire con campi di testo, video e grafici (che hanno i loro gesti)
    if (e.touches.length !== 1 || e.target.closest('input, textarea, select, iframe, [data-no-swipe]')) {
      inizioTocco.current = null;
      return;
    }
    inizioTocco.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }

  function onTouchEnd(e) {
    const inizio = inizioTocco.current;
    inizioTocco.current = null;
    if (!inizio || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - inizio.x;
    const dy = e.changedTouches[0].clientY - inizio.y;
    // Gesto netto: almeno 60px e più orizzontale che verticale
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const prossimo = giorni[indiceAttivo + (dx < 0 ? 1 : -1)];
    if (prossimo) vaiAl(prossimo.id);
  }

  const classeAnimazione =
    verso === 'dx' ? 'entra-da-destra' : verso === 'sx' ? 'entra-da-sinistra' : 'apri';

  return { attivo, vaiAl, classeAnimazione, gesti: { onTouchStart, onTouchEnd } };
}
