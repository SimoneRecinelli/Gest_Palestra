# Gestionale Palestra

App per te e il tuo PT: lui carica la scheda (esercizi con serie, ripetizioni,
recupero, video, nota) e tu la consulti e aggiungi le tue note personali,
separate dalle sue.

Stack, tutto a costo zero e senza carta di credito:
- **Next.js** — frontend + backend nello stesso progetto
- **Neon** — database Postgres + variabili d'ambiente
- **Backblaze B2** — storage dei video
- **Vercel** — hosting/deploy

---

## 1. Crea il database su Neon

1. Vai su https://neon.tech, registrati (no carta richiesta)
2. Crea un progetto, scegli la regione più vicina a te (es. Frankfurt)
3. Nel pannello "Connection Details" copia la **connection string** completa
   (comincia con `postgresql://...`)
4. Vai su "SQL Editor" e incolla tutto il contenuto del file `schema.sql`
   di questo progetto, poi esegui

## 2. Crea lo storage su Backblaze B2

1. Vai su https://www.backblaze.com/sign-up/cloud-storage, registrati (no carta)
2. Crea un bucket, impostalo come **pubblico** in lettura (serve per far
   partire i video senza passaggi extra)
3. Annota il **nome del bucket** e la **regione** (es. `eu-central-003`,
   la trovi vicino al nome del bucket)
4. Vai su "App Keys" → "Add a New Application Key", crea una chiave con
   accesso al bucket appena creato, e annota **keyID** e **applicationKey**
   (l'applicationKey si vede una sola volta, salvala subito)

## 3. Configura il progetto in locale

1. Rinomina `.env.example` in `.env.local`
2. Compila tutti i valori:
   - `DATABASE_URL` → la connection string di Neon
   - `NEXTAUTH_SECRET` → genera con `openssl rand -base64 32` (o una stringa
     lunga e casuale a piacere)
   - `NEXTAUTH_URL` → lascia `http://localhost:3000` per ora
   - `B2_KEY_ID`, `B2_APPLICATION_KEY`, `B2_REGION`, `B2_BUCKET_NAME` → dai
     passaggi precedenti
3. Installa le dipendenze:
   ```
   npm install
   ```
4. Avvia in locale:
   ```
   npm run dev
   ```
   L'app è su http://localhost:3000

## 4. Crea i due utenti (tu e il PT)

Non c'è una pagina di registrazione pubblica, di proposito: siete solo in
due, li create voi a mano nel database.

1. Genera l'hash della password:
   ```
   node scripts/hash-password.js "la-password-del-pt"
   ```
   Copia la stringa lunga che stampa.
2. Nell'SQL Editor di Neon, inserisci il PT:
   ```sql
   INSERT INTO utenti (email, password_hash, nome, ruolo)
   VALUES ('pt@esempio.it', 'INCOLLA_QUI_HASH', 'Nome PT', 'pt');
   ```
3. Ripeti per te stesso, con `ruolo` uguale a `'atleta'`:
   ```
   node scripts/hash-password.js "la-tua-password"
   ```
   ```sql
   INSERT INTO utenti (email, password_hash, nome, ruolo)
   VALUES ('tu@esempio.it', 'INCOLLA_QUI_HASH', 'Il tuo nome', 'atleta');
   ```

Ora potete accedere entrambi da `/login`. Il PT, dalla dashboard, crea una
scheda inserendo la tua email, poi aggiunge giorni ed esercizi (con video).
Tu vedi la scheda e scrivi le tue note su ogni esercizio.

## 5. Deploy online (Vercel)

1. Crea un repository su GitHub e caricaci il codice (`git init`, `git add .`,
   `git commit`, poi collega il repo remoto e fai push)
2. Vai su https://vercel.com, registrati con l'account GitHub (no carta)
3. "Add New Project" → seleziona il repository
4. Prima del deploy, aggiungi le stesse variabili di `.env.local` nelle
   impostazioni del progetto Vercel (Settings → Environment Variables),
   con `NEXTAUTH_URL` uguale all'URL che Vercel ti assegna
   (es. `https://gestionale-palestra.vercel.app`)
5. Deploy. Ad ogni `git push` successivo, Vercel aggiorna il sito da solo

## Note tecniche

- I video vengono caricati direttamente dal browser del PT a Backblaze B2
  tramite un URL firmato temporaneo, senza passare dal server: evita i
  limiti di dimensione dei file sulle funzioni serverless di Vercel
- Le tue note personali stanno in una tabella separata (`note_atleta`):
  quando il PT aggiorna un esercizio, non toccano mai le tue note
- Progetto Neon: se resta inattivo per giorni entra in stand-by e si
  risveglia da solo alla prima richiesta (qualche centinaio di ms in più,
  nessuna azione manuale richiesta)
