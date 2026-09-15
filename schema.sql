-- Schema completo del database (per un'installazione da zero).
-- Se hai già eseguito una versione precedente di questo schema,
-- usa invece migrazione-pesi.sql per aggiungere solo la parte nuova.

CREATE TYPE ruolo_utente AS ENUM ('pt', 'atleta');

CREATE TABLE utenti (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nome TEXT NOT NULL,
  ruolo ruolo_utente NOT NULL,
  creato_il TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE schede (
  id SERIAL PRIMARY KEY,
  titolo TEXT NOT NULL,
  atleta_id INTEGER NOT NULL REFERENCES utenti(id),
  pt_id INTEGER NOT NULL REFERENCES utenti(id),
  attiva BOOLEAN DEFAULT true,
  creata_il TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE giorni (
  id SERIAL PRIMARY KEY,
  scheda_id INTEGER NOT NULL REFERENCES schede(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordine INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE esercizi (
  id SERIAL PRIMARY KEY,
  giorno_id INTEGER NOT NULL REFERENCES giorni(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  serie INTEGER,
  ripetizioni TEXT,
  recupero TEXT,
  video_url TEXT,
  note_pt TEXT,
  ordine INTEGER NOT NULL DEFAULT 0
);

-- Le note dell'atleta sono in una tabella separata apposta:
-- così quando il PT aggiorna un esercizio non tocca mai le tue note personali.
CREATE TABLE note_atleta (
  id SERIAL PRIMARY KEY,
  esercizio_id INTEGER NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  atleta_id INTEGER NOT NULL REFERENCES utenti(id),
  testo TEXT,
  aggiornata_il TIMESTAMPTZ DEFAULT now(),
  UNIQUE(esercizio_id, atleta_id)
);

-- Diario pesi: ogni riga è una serie registrata dall'atleta durante
-- un allenamento. Più righe nello stesso giorno = più serie di quell'esercizio.
CREATE TABLE log_pesi (
  id SERIAL PRIMARY KEY,
  esercizio_id INTEGER NOT NULL REFERENCES esercizi(id) ON DELETE CASCADE,
  atleta_id INTEGER NOT NULL REFERENCES utenti(id),
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  peso_kg NUMERIC,
  ripetizioni_fatte TEXT,
  creato_il TIMESTAMPTZ DEFAULT now()
);
