/**
 * Script para obtener el Refresh Token de Gmail OAuth2.
 *
 * Requisitos previos:
 * 1. Ir a https://console.cloud.google.com/
 * 2. Crear un proyecto o seleccionar uno existente
 * 3. Ir a "APIs & Services" > "Library" y habilitar "Gmail API"
 * 4. Ir a "APIs & Services" > "Credentials"
 * 5. Crear credenciales OAuth 2.0 Client ID (tipo "Desktop application")
 * 6. Agregar "http://localhost:3000" como URI de redirección autorizada
 * 7. Copiar el Client ID y Client Secret
 *
 * Uso:
 *   node scripts/getGmailToken.js
 *
 * Sigue las instrucciones en pantalla.
 */

const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log("\n=== OBTENER REFRESH TOKEN DE GMAIL ===\n");

  const clientId = await askQuestion("Ingresa tu GMAIL_CLIENT_ID: ");
  const clientSecret = await askQuestion("Ingresa tu GMAIL_CLIENT_SECRET: ");

  if (!clientId.trim() || !clientSecret.trim()) {
    console.error("\nError: Debes proporcionar ambos valores.");
    rl.close();
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId.trim(),
    clientSecret.trim(),
    "http://localhost:3000"
  );

  // Generar URL de autorización
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent"  // Fuerza a mostrar la pantalla de consentimiento para obtener refresh token
  });

  console.log("\n1. Abre la siguiente URL en tu navegador:");
  console.log(authUrl);
  console.log("\n2. Inicia sesión con tu cuenta de Gmail y acepta los permisos.");
  console.log("3. Serás redirigido a http://localhost:3000/?code=... (la página no cargará, está bien)");
  console.log("4. Copia el código 'code' de la URL (después de ?code= hasta antes de &scope=)");

  const code = await askQuestion("\nPega el código aquí: ");

  if (!code.trim()) {
    console.error("\nError: No se proporcionó un código.");
    rl.close();
    process.exit(1);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\n=== TOKENS OBTENIDOS ===\n");
    console.log("Access Token:", tokens.access_token);
    console.log("\nRefresh Token:", tokens.refresh_token);
    console.log("\nExpiry Date:", tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : "N/A");

    if (!tokens.refresh_token) {
      console.log("\n⚠️  No se obtuvo refresh_token. Asegúrate de que:");
      console.log("   - La URL de autorización incluyó 'prompt=consent'");
      console.log("   - Es la primera vez que autorizas esta aplicación");
      console.log("   - Si ya autorizaste antes, revoca el acceso en:");
      console.log("     https://myaccount.google.com/permissions");
      console.log("   Luego ejecuta el script nuevamente.");
    } else {
      console.log("\n✅ Copia estos valores a tu archivo .env:");
      console.log(`GMAIL_USER=tu-email@gmail.com`);
      console.log(`GMAIL_CLIENT_ID=${clientId.trim()}`);
      console.log(`GMAIL_CLIENT_SECRET=${clientSecret.trim()}`);
      console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    }
  } catch (error) {
    console.error("\nError al obtener el token:", error.message);
  }

  rl.close();
}

main();