-- Esegui SOLO questo file nell'SQL Editor di Neon: il tuo database ha già
-- utenti, schede, giorni, esercizi e note_atleta. Manca solo il diario pesi.

CREATE TABLE log_pesi (
  id SERIAL PRIMARY KEY,
  esercizio_id INTEGER NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  atleta_id INTEGER NOT NULL REFERENCES utenti(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  peso_kg NUMERIC,
  ripetizioni_fatte TEXT,
  creato_il TIMESTAMPTZ DEFAULT now()
);
