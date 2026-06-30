import {useState} from "react";
import {Link} from "react-router-dom";

const budgetOptions=["$5,000", "$10,000", "$15,000", "$20,000", "Más de $20,000"];

const API_URL=import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function QuoteForm(){
  const [formData, setFormData]=useState({
    nombre: "", apellido: "", email: "", telefono: "", negocio: "", sitioWeb: "",
    redesSociales: "", acercaDe: "", servicio: "", expectativas: "", presupuesto: "", comoSupiste: ""
  });

  const [errors, setErrors]=useState({});
  const [showModal, setShowModal]=useState(false);
  const [submitted, setSubmitted]=useState(false);
  const [sending, setSending]=useState(false);
  const [apiError, setApiError]=useState("");

  // Frontend validation
  function validateForm(){
    const newErrors={};

    if (!formData.nombre.trim()){
      newErrors.nombre="El nombre es obligatorio.";
    }else if (formData.nombre.trim().length<2){
      newErrors.nombre="El nombre debe tener al menos 2 caracteres.";
    }

    if (!formData.apellido.trim()){
      newErrors.apellido="El apellido es obligatorio.";
    }else if (formData.apellido.trim().length<2){
      newErrors.apellido="El apellido debe tener al menos 2 caracteres.";
    }

    if (!formData.email.trim()){
      newErrors.email="El correo electrónico es obligatorio.";
    }else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)){
      newErrors.email="El formato del correo electrónico no es válido.";
    }

    if (formData.telefono.trim()){
      const cleaned=formData.telefono.replace(/[\s\-\(\)\+]/g, "");
      if (cleaned.length<10){
        newErrors.telefono="El teléfono debe tener al menos 10 dígitos.";
      }else if (!/^\d+$/.test(cleaned)){
        newErrors.telefono="El teléfono solo debe contener números.";
      }
    }

    if (formData.sitioWeb.trim()){
      try{
        new URL(formData.sitioWeb);
      }catch{
        newErrors.sitioWeb="El formato de la URL no es válido.";
      }
    }

    if (!formData.acercaDe.trim()){
      newErrors.acercaDe="Este campo es obligatorio.";
    }else if (formData.acercaDe.trim().length<10){
      newErrors.acercaDe="Describe tu negocio con al menos 10 caracteres.";
    }

    if (!formData.servicio.trim()){
      newErrors.servicio="Este campo es obligatorio.";
    }

    if (!formData.presupuesto){
      newErrors.presupuesto="Selecciona un presupuesto.";
    }

    if (!formData.comoSupiste.trim()){
      newErrors.comoSupiste="Este campo es obligatorio.";
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
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    setApiError("");

    if (!validateForm()){
      return;
    }

    setShowModal(true);
  };

  const confirmSubmit=async ()=>{
    setShowModal(false);
    setSending(true);
    setApiError("");

    try{
      const response=await fetch(`${API_URL}/api/send-quote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData)
      });

      const result=await response.json();

      if (!response.ok){
        if (result.errors){
          setErrors(result.errors);
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

  if (submitted){
    return(
      <div className="page-container">
        <h1 className="heading-page">Solicitud enviada</h1>
        <p className="text-body mb-6">Gracias por contactarnos. Te responderemos a la brevedad posible.</p>
        <Link to="../" className="btn-regular">Volver a contacto</Link>
      </div>
    );
  }

  return(
    <div className="page-container">
      <Link to="../" className="inline-block text-sm link-accent mb-6">← Volver a contacto</Link>
      <h1 className="heading-page">Solicitud de servicios</h1>

      {apiError && (
        <div className="mb-6 p-4 rounded-lg border text-sm" style={{borderColor: "#fca5a5", background: "#fef2f2", color: "#991b1b"}}>
          {apiError}
        </div>
      )}

      <div className="border border-[var(--border)] rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Nombre completo
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre"
                  required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.nombre)}
                />
                {errors.nombre && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.nombre}</p>}
              </div>
              <div>
                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} placeholder="Apellido"
                  required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.apellido)}
                />
                {errors.apellido && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.apellido}</p>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Correo electrónico
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="correo@ejemplo.com"
              required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.email)}
            />
            {errors.email && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Teléfono</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+52 123 456 7890"
              className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.telefono)}
            />
            {errors.telefono && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.telefono}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Nombre de tu negocio</label>
            <input type="text" name="negocio" value={formData.negocio} onChange={handleChange} placeholder="Nombre de tu empresa o emprendimiento"
              className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.negocio)}
            />
            {errors.negocio && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.negocio}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Sitio web</label>
            <input type="url" name="sitioWeb" value={formData.sitioWeb} onChange={handleChange} placeholder="https://tusitio.com"
              className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.sitioWeb)}
            />
            {errors.sitioWeb && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.sitioWeb}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Redes sociales</label>
            <input type="text" name="redesSociales" value={formData.redesSociales} onChange={handleChange} placeholder="@tuusuario"
              className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.redesSociales)}
            />
            {errors.redesSociales && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.redesSociales}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>Cuéntanos acerca de tu negocio
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <textarea name="acercaDe" value={formData.acercaDe} onChange={handleChange} rows={4} placeholder="Describe tu negocio, giro, productos o servicios..."
              required className="w-full px-4 py-2.5 rounded-lg border text-sm resize-y" style={inputStyle(!!errors.acercaDe)}
            />
            {errors.acercaDe && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.acercaDe}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿En qué servicio estás interesad@?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <input type="text" name="servicio" value={formData.servicio} onChange={handleChange} placeholder="Ej. Manejo de redes, Branding, etc."
              required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.servicio)}
            />
            {errors.servicio && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.servicio}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Qué esperas de nuestra agencia?</label>
            <textarea name="expectativas" value={formData.expectativas} onChange={handleChange} rows={3} placeholder="Cuéntanos qué resultados esperas lograr..."
              className="w-full px-4 py-2.5 rounded-lg border text-sm resize-y" style={inputStyle(!!errors.expectativas)}
            />
            {errors.expectativas && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.expectativas}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Cuál es tu presupuesto?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <select name="presupuesto" value={formData.presupuesto} onChange={handleChange} required
              className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.presupuesto)}
            >
              <option value="" disabled>Selecciona un presupuesto</option>
              {budgetOptions.map((opt)=>(
                <option key={opt} value={opt}>{opt} MXN</option>
              ))}
            </select>
            {errors.presupuesto && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.presupuesto}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: "var(--brand-heading)"}}>¿Cómo te enteraste de nosotros?
              <span className="text-xs" style={{color: "var(--text)"}}>(obligatorio)</span>
            </label>
            <input type="text" name="comoSupiste" value={formData.comoSupiste} onChange={handleChange} placeholder="Ej. Instagram, Google, Recomendación..."
              required className="w-full px-4 py-2.5 rounded-lg border text-sm" style={inputStyle(!!errors.comoSupiste)}
            />
            {errors.comoSupiste && <p className="text-xs mt-1" style={{color: "#dc2626"}}>{errors.comoSupiste}</p>}
          </div>
          <div className="pt-4">
            <button type="submit" className="btn-regular" disabled={sending}>
              {sending ? "Enviando..." : "Enviar"}
            </button>
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