import {Link, Outlet, useLocation} from "react-router-dom";
import {company} from "../data/companyData";

export default function Contact(){
  const location=useLocation();
  const isForm=location.pathname.includes("/contact/solicitar");

  if (isForm){
    return <Outlet/>;
  }

  return(
    <div className="page-container">
      <h1 className="heading-page">Contacto</h1>

      <p className="text-body mb-8">
        ¿Tienes un proyecto en mente? Escríbenos o contáctanos por nuestras redes sociales. Estaremos encantados
        de conocer tu idea y ayudarte a hacerla realidad.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="content-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{color: "var(--brand-heading)"}}>Correo electrónico</h2>
          <a href={`mailto:${company.email}`} className="link-accent text-sm">{company.email}</a>
        </div>
        <div className="content-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide mb-2" style={{color: "var(--brand-heading)"}}>WhatsApp</h2>
          <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="link-accent text-sm">{company.phone}</a>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="heading-section text-center">Síguenos en redes sociales</h2>
        <div className="flex justify-center gap-6 mt-6">
          <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="btn-regular">Instagram</a>
          <a href={company.tiktok} target="_blank" rel="noopener noreferrer" className="btn-regular">TikTok</a>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h2 className="heading-section text-center">O realiza tu solicitud aquí</h2>
        <Link to="solicitar" className="btn-regular">Solicitar servicios</Link>
      </div>
    </div>
  );
}
