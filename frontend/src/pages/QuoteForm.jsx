import {useState} from "react";
import {Link} from "react-router-dom";

const budgetOptions=["$5,000", "$10,000", "$15,000", "$20,000", "Más de $20,000"];
const API_URL=import.meta.env.VITE_API_URL || "";

export default function QuoteForm(){
  const [formData, setFormData]=useState({
    nombre: "", apellido: "", email: "", telefono: "", negocio: "", sitioWeb: "",
    redesSociales: "", acercaDe: "", servicio: "", expectativas: "", presupuesto: "",
    comoSupiste: "", honeypot: ""  // honeypot field (hidden from users)
  });

  const [errors, setErrors]=useState({});
  const [showModal, setShowModal]=useState(false);
  const [submitted, setSubmitted]=useState(false);
  const [sending, setSending]=useState(false);
  const [apiError, setApiError]=useState("");
  const [successMessage, setSuccessMessage]=useState("");

  // Frontend validation
  function validateForm(){
    const newErrors={};

    if (!formData.nombre.trim()){
      newErrors.nombre="El nombre es obligatorio.";
    }else if (formData.nombre.trim().length<2){
      newErrors.nombre="El nombre debe tener al menos 2 caracteres.";
    }else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/.test(formData.nombre.trim())){
      newErrors.nombre="El nombre solo debe contener letras y espacios.";
    }

    if (!formData.apellido.trim()){
      newErrors.apellido="El apellido es obligatorio.";
    }else if (formData.apellido.trim().length<2){
      newErrors.apellido="El apellido debe tener al menos 2 caracteres.";
    }else if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/.test(formData.apellido.trim())){
      newErrors.apellido="El apellido solo debe contener letras y espacios.";
    }

    if (!formData.email.trim()){
      newErrors.email="El correo electrónico es obligatorio.";
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email)){
      newErrors.email="El formato del correo electrónico no es válido.";
    }

    if (formData.telefono.trim()){
      const cleaned=formData.telefono.replace(/[\s\-\(\)\.\+]/g, "");
      if (cleaned.length<10){
        newErrors.telefono="El teléfono debe tener al menos 10 dígitos.";
      }else if (cleaned.length>15){
        newErrors.telefono="El teléfono tiene demasiados dígitos.";
      }else if (!/^\d+$/.test(cleaned)){
        newErrors.telefono="El teléfono solo debe contener números.";
      }
    }

    if (formData.sitioWeb.trim()){
      if (!/^https?:\/\/.+/i.test(formData.sitioWeb)){
        newErrors.sitioWeb="El sitio web debe iniciar con http:// o https://.";
      }else{
        try{
          new URL(formData.sitioWeb);
        }catch{
          newErrors.sitioWeb="El formato de la URL no es válido.";
        }
      }
    }

    if (!formData.acercaDe.trim()){
      newErrors.acercaDe="Este campo es obligatorio.";
    }else if (formData.acercaDe.trim().length<10){
      newErrors.acercaDe="Describe tu negocio con al menos 10 caracteres.";
    }

    if (!formData.servicio.trim()){
      newErrors.servicio="Este campo es obligatorio.";
    }else if (formData.servicio.trim().length<2){
      newErrors.servicio="El servicio debe tener al menos 2 caracteres.";
    }

    if (!formData.presupuesto){
      newErrors.presupuesto="Selecciona un presupuesto.";
    }

    if (!formData.comoSupiste.trim()){
      newErrors.comoSupiste="Este campo es obligatorio.";
    }else if (formData.comoSupiste.trim().length<2){
      newErrors.comoSupiste="Indica cómo te enteraste (mín. 2 caracteres).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length===0;
  }

  const handleChange=(e)=>{
    const {name, value}=e.target;
    setFormData((prev)=>({...prev, [name]: value}));
    // Clear error for this field when user starts typing
    if (errors[name]){
      setErrors((prev)=>({...prev, [name]: ""}));
    }
    if (apiError){
      setApiError("");
    }
    if (successMessage){
      setSuccessMessage("");
    }
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validateForm()){
      return;
    }

    setShowModal(true);
  };

  const confirmSubmit=async ()=>{
    setShowModal(false);
    setSending(true);
    setApiError("");
    setSuccessMessage("");

    try{
      const response=await fetch(`${API_URL}/api/yessara-web/send-quote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });

      const result=await response.json();

      if (!response.ok){
        if (result.errors){
          // Merge server errors with any existing client errors
          setErrors((prev)=>({...prev, ...result.errors}));
          setApiError("Corrige los errores marcados en el formulario.");
        }else{
          setApiError(result.message || "Error al enviar la solicitud.");
        }
        setSending(false);
        return;
      }

      setSubmitted(true);
    }catch(error){
      setApiError("Error de conexión. Verifica que el servidor esté funcionando.");
      setSending(false);
    }
  };

  const cancelSubmit=()=>{
    setShowModal(false);
  };

  // Helper to render input with error styling
  function inputStyle(hasError){
    return {
      borderColor: hasError ? "#dc2626" : "var(--border)",
      background: "var(--bg)",
      color: "var(--text-h)"
    };
  }

  // Helper to render a field with absolute-positioned error message
  function renderField(children, errorMsg){
    return (
      <div style={{position: "relative"}}>
        {children}
        {errorMsg && (
          <p style={{
            position: "absolute",
            bottom: "-18px",
            left: "0",
            fontSize: "11px",
            color: "#dc2626",
            margin: 0,
            whiteSpace: "nowrap"
          }}>
            ⚠️ {errorMsg}
          </p>
        )}
      </div>
    );
  }

  // Count validation errors (non-empty strings)
  const errorCount=Object.values(errors).filter((v) => v && v.length>0).length;

  // Determine apiError icon
  function apiErrorIcon(msg){
    if (!msg) return "";
    if (msg.includes("conexión")) return "🔌";
    return "❌";
  }

  if (submitted){
    return(
      <div className="page-container">
        <h1 className="heading-page">Solicitud enviada</h1>
        <div className="mb-6 p-4 rounded-lg border text-sm" style={{borderColor: "#86efac", background: "#f0fdf4", color: "#166534"}}>
          <p className="font-semibold">✅ Solicitud enviada correctamente</p>
          <p className="mt-1">Gracias por contactarnos. Te responderemos a la brevedad posible.</p>
        </div>
        <Link to="../" className="btn-regular">Volver a contacto</Link>
      </div>
    );
  }

  return(
    <div className="page-container">
      <Link to="../" className="inline-block text-sm link-accent mb-6">← Volver a contacto</Link>
      <h1 className="heading-page">Solicitud de servicios</h1>

      {/* Success message (non-submitted state, e.g. after partial success) */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-lg border text-sm" style={{borderColor: "#86efac", background: "#f0fdf4", color: "#166534"}}>
          ✅ {successMessage}
        </div>
      )}

      <div className="border border-[var(--border)] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Honeypot field — hidden from real users, visible to bots */}
          <div style={{position: "absolute", left: "-9999px", opacity: 0}} aria-hidden="true">
            <label htmlFor="honeypot">No llenar</label>
            <input type="text" id="honeypot" name="honeypot" value={formData.honeypot} onChange={handleChange} tabIndex={-1} autoComplete="off"/>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Nombre completo
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {renderField(
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre"
                    required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.nombre)}
                  />,
                  errors.nombre
                )}
              </div>
              <div>
                {renderField(
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido"
                    required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.apellido)}
                  />,
                  errors.apellido
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Correo electrónico
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            {renderField(
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com"
                required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.email)}
              />,
              errors.email
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Teléfono</label>
            {renderField(
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+52 123 456 7890"
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.telefono)}
              />,
              errors.telefono
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Nombre de tu negocio</label>
            {renderField(
              <input type="text" name="negocio" value={formData.negocio} onChange={handleChange} placeholder="Nombre de tu empresa o emprendimiento"
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.negocio)}
              />,
              errors.negocio
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Sitio web</label>
            {renderField(
              <input type="url" name="sitioWeb" value={formData.sitioWeb} onChange={handleChange} placeholder="https://tusitio.com"
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.sitioWeb)}
              />,
              errors.sitioWeb
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Redes sociales</label>
            {renderField(
              <input type="text" name="redesSociales" value={formData.redesSociales} onChange={handleChange} placeholder="@tuusuario"
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.redesSociales)}
              />,
              errors.redesSociales
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Cuéntanos acerca de tu negocio
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            {renderField(
              <textarea name="acercaDe" value={formData.acercaDe} onChange={handleChange} rows={4} placeholder="Describe tu negocio, giro, productos o servicios..."
                required className="w-full px-4 py-2.5 rounded-lg border text-sm resize-y" style={inputStyle(!!errors.acercaDe)}
              />,
              errors.acercaDe
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿En qué servicio estás interesad@?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            {renderField(
              <input type="text" name="servicio" value={formData.servicio} onChange={handleChange} placeholder="Ej. Manejo de redes, Branding, etc."
                required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.servicio)}
              />,
              errors.servicio
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Qué esperas de nuestra agencia?</label>
            {renderField(
              <textarea name="expectativas" value={formData.expectativas} onChange={handleChange} rows={3} placeholder="Cuéntanos qué resultados esperas lograr..."
                className="w-full px-4 py-2.5 rounded-lg border text-sm resize-y" style={inputStyle(!!errors.expectativas)}
              />,
              errors.expectativas
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Cuál es tu presupuesto?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            {renderField(
              <select name="presupuesto" value={formData.presupuesto} onChange={handleChange} required
                className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.presupuesto)}
              >
                <option value="" disabled>Selecciona un presupuesto</option>
                {budgetOptions.map((opt)=>(
                  <option key={opt} value={opt}>{opt} MXN</option>
                ))}
              </select>,
              errors.presupuesto
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Cómo te enteraste de nosotros?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            {renderField(
              <input type="text" name="comoSupiste" value={formData.comoSupiste} onChange={handleChange} placeholder="Ej. Instagram, Google, Recomendación..."
                required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.comoSupiste)}
              />,
              errors.comoSupiste
            )}
          </div>
          <div className="pt-4">
            <button type="submit" className="btn-regular" disabled={sending}>
              {sending ? "Enviando..." : "Enviar"}
            </button>

            {/* Error summary below the button */}
            {(apiError || errorCount>0) && (
              <div className="mt-4 p-3 rounded-lg border text-sm" style={{borderColor: "#fca5a5", background: "#fef2f2", color: "#991b1b"}}>
                {errorCount>0 && (
                  <p className="font-semibold mb-1">⚠️ Hay {errorCount} error(es) en el formulario</p>
                )}
                {apiError && (
                  <p className="mt-1">{apiErrorIcon(apiError)} {apiError}</p>
                )}
              </div>
            )}
          </div>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[var(--bg)] rounded-xl p-8 max-w-md mx-4 shadow-xl border" style={{borderColor: "var(--border)"}}>
            <h2 className="heading-section text-center mb-4">¿Enviar solicitud?</h2>
            <p className="text-body text-sm mb-6 text-center">
              ¿Estás seguro de que deseas enviar esta solicitud? Recibirás una respuesta pronto.
            </p>
            <div className="flex justify-center gap-4">
              <button type="button" onClick={cancelSubmit} className="btn-regular">Cancelar</button>
              <button type="button" onClick={confirmSubmit} className="btn-regular" disabled={sending}>
                {sending ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}