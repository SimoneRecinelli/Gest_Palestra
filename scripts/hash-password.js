// Uso: node scripts/hash-password.js "la-password-che-vuoi"
// Stampa l'hash da incollare nella colonna password_hash quando crei un utente.
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Uso: node scripts/hash-password.js "la-tua-password"');
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log(hash);
});
