require("dotenv").config();
const express=require("express");
const cors=require("cors");
const nodemailer=require("nodemailer");
const validateQuoteForm=require("./middleware/validateQuoteForm");
const app=express();

app.use(cors());
app.use(express.json());

// Nodemailer transport with SMTP
const transporter=nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// POST request to send quote form (with validation middleware)
app.post("/api/yessara-web/send-quote", validateQuoteForm, async (req, res) => {
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
    let rowIndex = 0;
    for (const [key, label] of Object.entries(fieldLabels)) {
      const value = formData[key] || "No especificado";
      const bgColor = rowIndex % 2 === 0 ? "#FFF8EF" : "#F9F4E8";
      fieldsHtml += `
        <tr>
          <td style="padding: 10px 14px; border: 1px solid #E8E0D0; font-weight: 600; background: ${bgColor}; color: #644D37; font-size: 13px;">${label}</td>
          <td style="padding: 10px 14px; border: 1px solid #E8E0D0; background: ${bgColor}; color: #9F8F7C; font-size: 13px;">${value}</td>
        </tr>
      `;
      rowIndex++;
    }
    const htmlContent = `
      <div style="background: #F0EBE0; padding: 30px 16px;">
        <div style="
          font-family: 'Open Sans', system-ui, 'Segoe UI', Roboto, Arial, sans-serif;
          max-width: 560px;
          margin: 0 auto;
          background: #FFF8EF;
          border: 1px solid #46472A;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(70,71,42,0.1), 0 4px 6px -2px rgba(70,71,42,0.05);
          overflow: hidden;
        ">
          <!-- Header banner -->
          <div style="
            background: #46472A;
            padding: 24px 28px 20px;
            border-bottom: 3px solid #838661;
          ">
            <h2 style="
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 22px;
              font-weight: 600;
              color: #FFF8EF;
              margin: 0;
              letter-spacing: -0.3px;
            ">
              Nueva solicitud de servicios
            </h2>
          </div>

          <!-- Body -->
          <div style="padding: 20px 28px 8px;">
            <p style="color: #9F8F7C; font-size: 14px; line-height: 1.6; margin: 0 0 18px;">
              Se ha recibido una nueva solicitud de servicios desde el formulario web. A continuación se muestran los datos proporcionados:
            </p>

            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr>
                  <th style="
                    padding: 10px 14px;
                    background: #838661;
                    color: #FFF8EF;
                    font-weight: 600;
                    text-align: left;
                    border: 1px solid #838661;
                    border-radius: 6px 0 0 0;
                    font-size: 13px;
                  ">Campo</th>
                  <th style="
                    padding: 10px 14px;
                    background: #838661;
                    color: #FFF8EF;
                    font-weight: 600;
                    text-align: left;
                    border: 1px solid #838661;
                    border-radius: 0 6px 0 0;
                    font-size: 13px;
                  ">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${fieldsHtml}
              </tbody>
            </table>

            <div style="
              margin-top: 22px;
              padding: 14px 16px;
              background: rgba(131, 134, 97, 0.08);
              border-left: 3px solid #838661;
              border-radius: 6px;
            ">
              <p style="
                color: #644D37;
                font-size: 13px;
                line-height: 1.5;
                margin: 0;
                font-family: Georgia, 'Times New Roman', serif;
              ">
                💡 Se recomienda contactar al cliente a la brevedad posible para dar seguimiento a esta solicitud.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="
            border-top: 1px solid #46472A;
            padding: 16px 28px;
            text-align: center;
          ">
            <p style="
              color: #838661;
              font-size: 11px;
              line-height: 1.5;
              margin: 0;
              font-family: Georgia, 'Times New Roman', serif;
              letter-spacing: 0.5px;
            ">
              Este correo fue generado automáticamente desde el formulario de solicitud de servicios.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email via SMTP
    const info=await transporter.sendMail({
      from: `"Yessara Creative Web" <${process.env.MAIL_FROM}>`,
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