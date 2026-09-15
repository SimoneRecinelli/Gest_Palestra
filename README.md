# Diario Allenamento

Aggiornamento del progetto: nuova interfaccia grafica, sedute organizzate a
tab, e un diario pesi per registrare le serie fatte in palestra.

Stack in produzione: Next.js + Vercel (hosting) + Neon (database) +
Supabase Storage (video).

## Se stai partendo da zero

Segui questi passaggi in ordine: crea un progetto Neon ed esegui
`schema.sql` nel suo SQL Editor, crea un progetto Supabase con un bucket
pubblico per i video (Storage -> New bucket -> attiva "Public bucket"),
copia `.env.example` in `.env.local` e compilalo con i tuoi valori, poi:

```
npm install
npm run dev
```

Crea i due utenti (tu e il PT) con lo script già presente:

```
node scripts/hash-password.js "la-password-scelta"
```

e incolla l'hash ottenuto in una query su Neon:

```sql
INSERT INTO utenti (email, password_hash, nome, ruolo)
VALUES ('email@esempio.it', 'INCOLLA_QUI_HASH', 'Nome', 'atleta');
-- ripeti con ruolo 'pt' per il personal trainer
```

## Se stai aggiornando il progetto già online (il tuo caso)

Il tuo database ha già le tabelle di base. Ti manca solo il diario pesi:

1. Apri l'SQL Editor di Neon ed esegui **solo** il contenuto di
   `migrazione-pesi.sql` (non rieseguire `schema.sql`, altrimenti otterrai
   un errore perché le altre tabelle esistono già)
2. Sostituisci l'intera cartella del progetto sul tuo computer con questa
   (o copia i file uno per uno rispettando gli stessi percorsi)
3. Reinstalla le dipendenze, perché sono cambiate (via Tailwind CSS per la
   grafica, via Backblaze, dentro Supabase — che però hai già configurato):
   ```
   npm install
   ```
4. Verifica che il tuo `.env.local` abbia le variabili Supabase (le hai
   già, sono le stesse che hai messo su Vercel)
5. Prova in locale:
   ```
   npm run dev
   ```
6. Quando sei soddisfatto, carica su GitHub e lascia che Vercel rifaccia
   il deploy da solo:
   ```
   git add .
   git commit -m "Nuova interfaccia e diario pesi"
   git push
   ```

Le variabili d'ambiente su Vercel restano le stesse che hai già impostato
(non serve toccarle), a meno che tu non le abbia già ripulite da quelle di
Backblaze — in quel caso non ti servono comunque più.

## Cosa c'è di nuovo

- **Sedute a tab**: ogni scheda mostra tutte le sue sedute (i "giorni") come
  schede cliccabili in alto, invece di un elenco lungo
- **Diario pesi**: sotto ogni esercizio puoi registrare al volo il peso e le
  ripetizioni di ogni serie fatta; il PT le vede (in sola lettura) per
  aggiustare la scheda nel tempo
- **Consigli del PT**: il campo note dell'esercizio è ora presentato come
  suggerimento su come eseguirlo, distinto dalle tue note personali
- **Grafica**: interfaccia rifatta con Tailwind CSS, due font (Oswald per i
  titoli, Inter per il testo), pensata per essere letta velocemente dal
  telefono in palestra
