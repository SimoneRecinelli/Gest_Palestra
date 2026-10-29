'use client';
import { useState } from 'react';
import Piatto from './Piatto';

// Miniatura quadrata dell'esercizio: ricavata dal link YouTube, altrimenti il disco del gruppo muscolare.
export default function Anteprima({ videoUrl, colore = '#5C6169' }) {
  const [errore, setErrore] = useState(false);
  const id = videoUrl?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  )?.[1];
  const url = id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg` : null;
  const eVerticale = /\/shorts\//.test(videoUrl || '');

  return (
    <div className="relative w-[76px] h-[76px] shrink-0 rounded-[12px] overflow-hidden bg-chalk">
      {url && !errore ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setErrore(true)}
          className={`w-full h-full object-cover ${eVerticale ? 'scale-[1.75]' : ''}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${colore}22` }}>
          <Piatto colore={colore} size={34} />
        </div>
      )}
    </div>
  );
}
