// Allowed budget options (whitelist)
const ALLOWED_BUDGETS = new Set([
  "$5,000", "$10,000", "$15,000", "$20,000", "Más de $20,000"
]);

// Suspicious / spammy patterns (case-insensitive)
const SPAM_KEYWORDS = [
  // English spam keywords
  /buy\s+now/i, /click\s+here/i, /free\s+money/i, /earn\s+money/i,
  /work\s+from\s+home/i, /limited\s+time/i, /act\s+now/i, /congratulations/i,
  /you.ve\s+won/i, /casino/i, /viagra/i, /cryptocurrency/i, /bitcoin/i,
  /seo\s+services/i, /guest\s+post/i, /backlink/i, /cheap\s+price/i,
  /discount\s+offer/i, /click\s+below/i, /subscribe\s+now/i,
  // Spanish spam keywords
  /compra\s+ya/i, /haz\s+clic/i, /dinero\s+fácil/i, /gana\s+dinero/i,
  /trabaja\s+desde\s+casa/i, /tiempo\s+limitado/i, /actúa\s+ahora/i,
  /felicidades\s+has\s+ganado/i, /has\s+ganado/i, /casino\s+en\s+línea/i,
  /criptomonedas/i, /barato/i, /oferta\s+especial/i, /descuento/i,
  /suscríbete\s+ahora/i, /hazte\s+rico/i, /inversión\s+garantizada/i,
  /ganancias\s+sin\s+riesgo/i, /sin\s+inversión/i, /dinero\s+rápido/i,
  /publicidad/i, /promociona/i, /posicionamiento\s+web/i,
  /enlaces\s+entrantes/i, /enlaces\s+de\s+retorno/i
];

// Disposable / temporary email domain patterns
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "tempmail.com", "throwaway.com",
  "yopmail.com", "sharklasers.com", "trashmail.com", "10minutemail.com",
  "mailnator.com", "getnada.com", "temp-mail.org", "fakeinbox.com",
  "maildrop.cc", "dispostable.com", "mailnesia.com", "spamgourmet.com",
  "mytemp.email", "tempemail.net", "burnermail.io", "inboxkitten.com"
]);

// SQL injection patterns
const SQL_INJECTION_PATTERNS = [
  /(\bSELECT\b.*\bFROM\b)/i,
  /(\bINSERT\b.*\bINTO\b)/i,
  /(\bUPDATE\b.*\bSET\b)/i,
  /(\bDELETE\b.*\bFROM\b)/i,
  /(\bDROP\b.*\bTABLE\b)/i,
  /(\bUNION\b.*\bSELECT\b)/i,
  /(\bALTER\b.*\bTABLE\b)/i,
  /(\bCREATE\b.*\bTABLE\b)/i,
  /(\bEXEC\b|\bEXECUTE\b)/i,
  /(\bOR\b.*\d+\s*=\s*\d+)/i,
  /('?\s*OR\s+1\s*=\s*1)/i,
  /('?\s*OR\s+'?'\s*=\s*')/i,
  /(--)/,
  /(\/\*)/,
  /(\bLOAD_FILE\b)/i,
  /(\bINTO\s+OUTFILE\b)/i,
  /(\bINTO\s+DUMPFILE\b)/i,
  /(\bCHAR\b\s*\()/i,
  /(\bCONVERT\b\s*\()/i,
  /(\bWAITFOR\b.*\bDELAY\b)/i,
  /(\bPG_SLEEP\b)/i,
  /(\bSLEEP\b\s*\()/i,
  /(\bBENCHMARK\b\s*\()/i
];

// Maximum lengths per field
const MAX_LENGTHS = {
  nombre: 50,
  apellido: 50,
  email: 254,
  telefono: 20,
  negocio: 100,
  sitioWeb: 500,
  redesSociales: 200,
  acercaDe: 2000,
  servicio: 200,
  expectativas: 2000,
  presupuesto: 50,
  comoSupiste: 200
};

/**
 * Sanitize a string by stripping HTML tags and trimming whitespace.
 */
function sanitize(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")   // strip HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // strip control chars (except tab, newline)
    .trim();
}

/**
 * Check if a string looks like gibberish (repetitive patterns or excessive consonants).
 */
function isGibberish(value) {
  const str = value.toLowerCase().replace(/\s+/g, "");
  if (str.length < 4) return false;

  // Check for repetitive patterns like "aaaaaa", "asdfasdf", "123123"
  const repetitivePattern = /(.)\1{4,}/; // same char 5+ times
  if (repetitivePattern.test(str)) return true;

  // Check for keyboard walks like "asdf", "qwerty", "zxcv"
  const keyboardWalks = /(asdf|qwerty|zxcv|qwert|werty|asdfg|zxcvb)/i;
  if (keyboardWalks.test(str)) return true;

  // Check for excessive consonants (no vowels) in a row (ignore digits)
  const lettersOnly = str.replace(/[0-9]/g, "");
  const consonantRun = lettersOnly.replace(/[aeiouáéíóúü]/g, " ").split(" ").some(seg => seg.length >= 8);
  if (consonantRun) return true;

  // Check for excessive same character repetition
  const charCounts = {};
  for (const ch of str) {
    charCounts[ch] = (charCounts[ch] || 0) + 1;
  }
  const maxFreq = Math.max(...Object.values(charCounts));
  if (maxFreq / str.length > 0.6 && str.length > 6) return true;

  return false;
}

/**
 * Count the number of URLs in a string.
 */
function countUrls(value) {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = value.match(urlPattern);
  return matches ? matches.length : 0;
}

/**
 * Check if a string contains spam keywords.
 */
function containsSpamKeywords(value) {
  return SPAM_KEYWORDS.some(pattern => pattern.test(value));
}

/**
 * Check if a string contains SQL injection patterns.
 */
function containsSqlInjection(value) {
  return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Validate a name field (nombre, apellido) — only letters, spaces, accents.
 */
function isValidName(value) {
  return /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/.test(value);
}

function validateQuoteForm(req, res, next) {
  const data = req.body;
  const errors = {};

  // ============================================================
  // ANTI-SPAM: Honeypot check
  // ============================================================
  if (data.honeypot && data.honeypot.trim()) {
    // Honeypot was filled — likely a bot
    return res.status(400).json({
      success: false,
      message: "Errores de validación.",
      errors: { honeypot: "Detectado como spam." }
    });
  }

  // ============================================================
  // Helper: sanitize and validate a text field
  // ============================================================
  function processField(key, label, { required = false, minLen = 0, maxLen, nameCheck = false, allowUrls = true } = {}) {
    const rawValue = data[key];
    const value = sanitize(rawValue);

    // Required check
    if (required && !value) {
      errors[key] = `${label} es obligatorio.`;
      return null;
    }

    // If optional and empty, skip further checks
    if (!required && !value) {
      return null;
    }

    // Max length check
    if (maxLen && value.length > maxLen) {
      errors[key] = `${label} no debe exceder ${maxLen} caracteres.`;
      return null;
    }

    // Min length check
    if (minLen && value.length < minLen) {
      errors[key] = `${label} debe tener al menos ${minLen} caracteres.`;
      return null;
    }

    // Name format check (only letters, spaces, accents)
    if (nameCheck && !isValidName(value)) {
      errors[key] = `${label} solo debe contener letras y espacios.`;
      return null;
    }

    // Gibberish check
    if (value.length >= 4 && isGibberish(value)) {
      errors[key] = `${label} contiene caracteres no válidos o repetitivos.`;
      return null;
    }

    // Spam keyword check
    if (value.length >= 10 && containsSpamKeywords(value)) {
      errors[key] = `${label} contiene palabras no permitidas.`;
      return null;
    }

    // SQL injection check
    if (containsSqlInjection(value)) {
      errors[key] = `${label} contiene caracteres no permitidos.`;
      return null;
    }

    // URL count check (limit URLs in text fields to prevent spam)
    if (!allowUrls) {
      const urlCount = countUrls(value);
      if (urlCount > 0) {
        errors[key] = `${label} no debe contener enlaces.`;
        return null;
      }
    } else {
      const urlCount = countUrls(value);
      if (urlCount > 3) {
        errors[key] = `${label} tiene demasiados enlaces.`;
        return null;
      }
    }

    return value;
  }

  // ============================================================
  // FIELD VALIDATIONS
  // ============================================================

  // Nombre
  processField("nombre", "El nombre", {
    required: true, minLen: 2, maxLen: MAX_LENGTHS.nombre, nameCheck: true
  });

  // Apellido
  processField("apellido", "El apellido", {
    required: true, minLen: 2, maxLen: MAX_LENGTHS.apellido, nameCheck: true
  });

  // Email
  const emailRaw = data.email;
  const email = sanitize(emailRaw);
  if (!email) {
    errors.email = "El correo electrónico es obligatorio.";
  } else if (email.length > MAX_LENGTHS.email) {
    errors.email = "El correo electrónico no debe exceder 254 caracteres.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = "El formato del correo electrónico no es válido.";
  } else {
    // Check for disposable email domains
    const domain = email.split("@")[1]?.toLowerCase();
    if (domain && DISPOSABLE_DOMAINS.has(domain)) {
      errors.email = "No se permiten correos electrónicos temporales.";
    }
    // Check for SQL injection in email
    if (containsSqlInjection(email)) {
      errors.email = "El correo electrónico contiene caracteres no permitidos.";
    }
  }

  // Teléfono (opcional)
  const phoneRaw = data.telefono;
  const phone = sanitize(phoneRaw);
  if (phone) {
    if (phone.length > MAX_LENGTHS.telefono) {
      errors.telefono = "El teléfono no debe exceder 20 caracteres.";
    } else {
      const cleanedPhone = phone.replace(/[\s\-\(\)\.\+]/g, "");
      if (cleanedPhone.length < 10) {
        errors.telefono = "El teléfono debe tener al menos 10 dígitos.";
      } else if (cleanedPhone.length > 15) {
        errors.telefono = "El teléfono tiene demasiados dígitos.";
      } else if (!/^\d+$/.test(cleanedPhone)) {
        errors.telefono = "El teléfono solo debe contener números.";
      }
    }
  }

  // Negocio (opcional)
  processField("negocio", "El nombre del negocio", {
    required: false, minLen: 0, maxLen: MAX_LENGTHS.negocio
  });

  // Sitio web (opcional)
  const webRaw = data.sitioWeb;
  const web = sanitize(webRaw);
  if (web) {
    if (web.length > MAX_LENGTHS.sitioWeb) {
      errors.sitioWeb = "El sitio web no debe exceder 500 caracteres.";
    } else if (!/^https?:\/\/.+/i.test(web)) {
      errors.sitioWeb = "El sitio web debe iniciar con http:// o https://.";
    } else {
      try {
        new URL(web);
      } catch {
        errors.sitioWeb = "El formato de la URL del sitio web no es válido.";
      }
    }
  }

  // Redes sociales (opcional)
  processField("redesSociales", "Las redes sociales", {
    required: false, minLen: 0, maxLen: MAX_LENGTHS.redesSociales
  });

  // Acerca de
  processField("acercaDe", "El campo 'Acerca de tu negocio'", {
    required: true, minLen: 10, maxLen: MAX_LENGTHS.acercaDe, allowUrls: false
  });

  // Servicio
  processField("servicio", "El servicio de interés", {
    required: true, minLen: 2, maxLen: MAX_LENGTHS.servicio
  });

  // Expectativas (opcional)
  processField("expectativas", "Las expectativas", {
    required: false, minLen: 0, maxLen: MAX_LENGTHS.expectativas, allowUrls: false
  });

  // Presupuesto — must match one of the allowed options exactly
  const budgetRaw = data.presupuesto;
  const budget = sanitize(budgetRaw);
  if (!budget) {
    errors.presupuesto = "El presupuesto es obligatorio.";
  } else if (!ALLOWED_BUDGETS.has(budget)) {
    errors.presupuesto = "El presupuesto seleccionado no es válido.";
  }

  // Cómo te enteraste
  processField("comoSupiste", "Indica cómo te enteraste de nosotros", {
    required: true, minLen: 2, maxLen: MAX_LENGTHS.comoSupiste
  });

  // ============================================================
  // RESPONSE
  // ============================================================
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