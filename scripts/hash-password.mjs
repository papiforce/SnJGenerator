#!/usr/bin/env node
// Génère le hash SHA-256 (hex) d'un mot de passe, à coller dans
// VITE_ADMIN_PASSWORD_HASH du fichier .env.
//
// Usage : npm run hash-password -- "mon-mot-de-passe"

import { createHash } from "node:crypto";

const password = process.argv[2];

if (!password) {
  console.error('Usage : npm run hash-password -- "mon-mot-de-passe"');
  process.exit(1);
}

const hash = createHash("sha256").update(password, "utf8").digest("hex");

console.log("\nHash SHA-256 :\n");
console.log(hash);
console.log("\nÀ coller dans .env :\n");
console.log(`VITE_ADMIN_PASSWORD_HASH=${hash}\n`);
