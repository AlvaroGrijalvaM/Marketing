require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const validateQuoteForm = require("./middleware/validateQuoteForm");
const app = express();

app.use(cors());
app.use(express.json());

// Nodemailer transport with Gmail OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_USER,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN
  }
});

// POST request to send quote form (with validation middleware)
app.post("/api/send-quote", validateQuoteForm, async (req, res) => {
  try {
    const formData = req.body;

    // Build HTML email content with all form data
    const fieldLabels = {
      nombre: "Nombre",
      apellido: "Apellido",
      email: "Correo electrónico",
      telefono: "Teléfono",
      negocio: "Nombre del negocio",
      sitioWeb: "Sitio web",
      redesSociales: "Redes sociales",
      acercaDe: "Acerca del negocio",
      servicio: "Servicio de interés",
      expectativas: "Expectativas",
      presupuesto: "Presupuesto",
      comoSupiste: "¿Cómo te enteraste?"
    };
    let fieldsHtml = "";
    for (const [key, label] of Object.entries(fieldLabels)) {
      const value = formData[key] || "No especificado";
      fieldsHtml += `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #ddd; font-weight: bold; background: #f9f9f9;">${label}</td>
          <td style="padding: 8px 12px; border: 1px solid #ddd;">${value}</td>
        </tr>
      `;
    }
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #46472A; border-bottom: 2px solid #46472A; padding-bottom: 10px;">
          Nueva solicitud de servicios
        </h2>
        <p style="color: #555;">Se ha recibido una nueva solicitud de servicios desde el formulario web.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr>
              <th style="padding: 10px 12px; border: 1px solid #ddd; background: #46472A; color: #fff; text-align: left;">Campo</th>
              <th style="padding: 10px 12px; border: 1px solid #ddd; background: #46472A; color: #fff; text-align: left;">Valor</th>
            </tr>
          </thead>
          <tbody>
            ${fieldsHtml}
          </tbody>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Este correo fue generado automáticamente desde el formulario de solicitud de servicios.
        </p>
      </div>
    `;

    // Send email via Gmail OAuth2
    const info=await transporter.sendMail({
      from: `"${process.env.GMAIL_USER}" <${process.env.GMAIL_USER}>`,
      to: process.env.MAIL_TO,
      subject: `Nueva solicitud de servicios - ${formData.nombre} ${formData.apellido}`,
      html: htmlContent
    });

    res.status(200).json({
      success: true,
      message: "Solicitud enviada correctamente.",
      data: { messageId: info.messageId }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error al enviar la solicitud.",
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});