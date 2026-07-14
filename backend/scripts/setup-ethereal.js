/**
 * Genera una cuenta SMTP de prueba en Ethereal Email
 * y muestra las credenciales para copiar al .env
 */
const nodemailer = require("nodemailer");

async function main() {
  // Generate a test SMTP account at ethereal.email
  const testAccount = await nodemailer.createTestAccount();

  console.log("=== Credenciales SMTP de prueba (Ethereal Email) ===\n");
  console.log("SMTP_HOST=" + testAccount.smtp.host);
  console.log("SMTP_PORT=" + testAccount.smtp.port);
  console.log("SMTP_USER=" + testAccount.user);
  console.log("SMTP_PASS=" + testAccount.pass);
  console.log("SMTP_SECURE=" + (testAccount.smtp.secure ? "true" : "false"));
  console.log("MAIL_TO=" + testAccount.user);
  console.log("\nURL para ver correos: https://ethereal.email/login");
  console.log("User: " + testAccount.user);
  console.log("Pass: " + testAccount.pass);
  console.log("\nCopia estos valores a backend/.env para hacer pruebas.");

  // Also send a test email to confirm
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: `"Test" <${testAccount.user}>`,
    to: testAccount.user,
    subject: "Prueba de configuración SMTP",
    text: "Si ves esto en Ethereal, la configuración SMTP funciona correctamente.",
  });

  console.log("\n✓ Correo de prueba enviado correctamente.");
  console.log("📧 URL para verlo: " + nodemailer.getTestMessageUrl(info));
}

main().catch(console.error);