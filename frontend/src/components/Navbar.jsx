import {useState, useEffect} from "react";
import {Link, NavLink} from "react-router-dom";
import {company, navLinks} from "../data/companyData";
import logo from "../assets/logo.png";
import WhatsApp from "../assets/WhatsApp.png";
import Instagram from "../assets/Instagram.png";
import TikTok from "../assets/TikTok.png";

export default function Navbar(){
  const [visible, setVisible]=useState(true);
  const [lastScroll, setLastScroll]=useState(0);

  useEffect(()=>{
    const handleScroll=()=>{
      const currentScroll=window.scrollY;
      // Show if scrolling up or at top, hide if scrolling down & past threshold
      if (currentScroll<lastScroll || currentScroll<10){
        setVisible(true);
      } else if (currentScroll>lastScroll && currentScroll>80){
        setVisible(false);
      }
      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll, {passive: true});
    return ()=>window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-[#838661] shadow-sm transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex items-center justify-between px-6 py-3 container-wide">
        <div className="flex items-center gap-6">
          <Link to="home" className="flex-shrink-0"><img src={logo} alt={company.name} className="h-12 w-auto-0"/></Link>
          <ul className="hidden sm:flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <NavLink to={to} className={({isActive}) => `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                 isActive
                  ? "nav-link-active"
                  : "nav-link-inactive"
                }`}>{label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div id="social" className="flex items-center gap-3">
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
    </nav>
  );
}