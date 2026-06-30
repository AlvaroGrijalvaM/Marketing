import {Link} from "react-router-dom";
import {company, navLinks} from "../data/companyData";
import logo from "../assets/logo.png";
import WhatsApp from "../assets/WhatsApp.png";
import Instagram from "../assets/Instagram.png";
import TikTok from "../assets/TikTok.png";

export default function Footer(){
  return (
    <footer className="bg-[#838661] text-[#FFF8EF] mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-10 container-wide text-left">
        <div className="flex flex-col gap-4">
          <img src={logo} alt={company.name} className="h-16 w-auto self-start"/>
          <div id="social" className="flex gap-3">
            <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-2 rounded-full social-icon-bg transition-colors">
              <img src={WhatsApp} alt="WhatsApp" className="w-5 h-5 brightness-0 invert"/>
            </a>
            <a href={company.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full social-icon-bg transition-colors">
              <img src={Instagram} alt="Instagram" className="w-5 h-5 brightness-0 invert"/>
            </a>
            <a href={company.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="p-2 rounded-full social-icon-bg transition-colors">
              <img src={TikTok} alt="TikTok" className="w-5 h-5 brightness-0 invert"/>
            </a>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#FFF8EF] mb-3">Contacto</h2>
          <ul className="space-y-2 text-sm text-[#FFF8EF] opacity-80">
            <li>
              <a href={`mailto:${company.email}`} className="hover:opacity-100 transition-opacity">{company.email}</a>
            </li>
            <li>
              <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">{company.phone}</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[#FFF8EF] mb-3">Navegación</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="home" className="text-[#FFF8EF] opacity-80 hover:opacity-100 transition-opacity">Inicio</Link>
            </li>
            {navLinks.map(({label, to}) => (
              <li key={to}>
                <Link to={to} className="text-[#FFF8EF] opacity-80 hover:opacity-100 transition-opacity">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[#FFF8EF]/20 py-4 text-center text-sm text-[#FFF8EF] opacity-60">
        © 2026 {company.name}. Todos los derechos reservados.
      </div>
    </footer>
  );
}