import {Link, useLocation} from "react-router-dom";
import {services} from "../data/serviceData";

const pageNames={
  "/home": "Inicio",
  "/services": "Servicios",
  "/about": "Sobre nosotros",
  "/contact": "Contacto"
};

export default function Breadcrumb() {
  const location=useLocation();
  const pathname=location.pathname;

  const crumbs=[{label: "Inicio", to: "/home"}];

  if (pathname.includes("/services")){
    crumbs.push({label: "Servicios", to: "/services"});
    const slug=pathname.split("/services/")[1];
    if (slug){
      const service=services.find((s) => s.slug===slug);
      if (service){
        crumbs.push({label: service.name, to: pathname.slice(1)});
      }
    }
  } else if (pathname!=="/home"){
    const pageName=pageNames[pathname];
    if (pageName){
      crumbs.push({label: pageName, to: pathname.slice(1)});
    }
  }
  if (crumbs.length<=1) return null;

  return(
    <nav aria-label="Ruta de navegación" className="w-full bg-[var(--bg)] border-b border-[var(--brand-light-border)]">
      <ol className="flex flex-wrap items-center gap-2 px-6 py-2 container-wide text-sm" style={{color: "var(--brand-dark)"}}>
        {crumbs.map((crumb, index) => (
          <li key={crumb.to} className="flex items-center gap-2">
            {index>0 && <span className="text-[#9F8F7C]">›</span>}
            {index===crumbs.length-1 ? (
              <span className="font-medium link-accent">{crumb.label}</span>
            ) : (
              <Link to={crumb.to} className="link-accent transition-colors">{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
