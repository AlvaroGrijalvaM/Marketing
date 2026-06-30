/**
 * Middleware to validate the quote form submission data.
 * If validation fails, responds with a 400 status and the error details.
 * If validation passes, calls next() so the request continues to the route handler.
 */
function validateQuoteForm(req, res, next) {
  const data = req.body;
  const errors = {};

  // Nombre
  if (!data.nombre || !data.nombre.trim()) {
    errors.nombre = "El nombre es obligatorio.";
  } else if (data.nombre.trim().length < 2) {
    errors.nombre = "El nombre debe tener al menos 2 caracteres.";
  }

  // Apellido
  if (!data.apellido || !data.apellido.trim()) {
    errors.apellido = "El apellido es obligatorio.";
  } else if (data.apellido.trim().length < 2) {
    errors.apellido = "El apellido debe tener al menos 2 caracteres.";
  }

  // Email
  if (!data.email || !data.email.trim()) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "El formato del correo electrónico no es válido.";
  }

  // Acerca de
  if (!data.acercaDe || !data.acercaDe.trim()) {
    errors.acercaDe = "El campo 'Acerca de tu negocio' es obligatorio.";
  } else if (data.acercaDe.trim().length < 10) {
    errors.acercaDe = "Describe tu negocio con al menos 10 caracteres.";
  }

  // Servicio
  if (!data.servicio || !data.servicio.trim()) {
    errors.servicio = "El servicio de interés es obligatorio.";
  }

  // Presupuesto
  if (!data.presupuesto) {
    errors.presupuesto = "El presupuesto es obligatorio.";
  }

  // Cómo te enteraste
  if (!data.comoSupiste || !data.comoSupiste.trim()) {
    errors.comoSupiste = "Indica cómo te enteraste de nosotros.";
  }

  // Teléfono (opcional)
  if (data.telefono && data.telefono.trim()) {
    const cleanedPhone = data.telefono.replace(/[\s\-\(\)\+]/g, "");
    if (cleanedPhone.length < 10) {
      errors.telefono = "El teléfono debe tener al menos 10 dígitos.";
    } else if (!/^\d+$/.test(cleanedPhone)) {
      errors.telefono = "El teléfono solo debe contener números.";
    }
  }

  // Sitio web (opcional)
  if (data.sitioWeb && data.sitioWeb.trim()) {
    try {
      new URL(data.sitioWeb);
    } catch {
      errors.sitioWeb = "El formato de la URL del sitio web no es válido.";
    }
  }

  const errorKeys = Object.keys(errors);
  if (errorKeys.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación.",
      errors
    });
  }

  // No validation errors, continue to the route handler
  next();
}

module.exports = validateQuoteForm;