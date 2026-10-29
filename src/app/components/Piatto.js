// Un disco visto di fronte: l'unico simbolo ricorrente dell'app.
export default function Piatto({ colore = '#D42B1E', size = 16, foro = '#FAFAF7', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      <circle cx="12" cy="12" r="12" fill={colore} />
      <circle cx="12" cy="12" r="4" fill={foro} />
    </svg>
  );
}
