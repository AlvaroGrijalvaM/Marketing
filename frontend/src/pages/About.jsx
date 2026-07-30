import {useState, useEffect} from "react";
import {company} from "../data/companyData";
import {loadImage} from "../utils/imageLoader";
const placeholderImage="";

export default function About(){
  const [imageLoaded, setImageLoaded]=useState(false);
  const [imageError, setImageError]=useState(false);

  // Async function to load the team image
  useEffect(() => {
    async function loadTeamImage() {
      try {
        await loadImage(placeholderImage);
        setImageLoaded(true);
      } catch {
        setImageError(true);
      }
    }
    loadTeamImage();
  }, []);

  return (
    <div className="page-container">
      <h1 className="heading-page">Sobre nosotros</h1>

      {!imageLoaded && !imageError && (
        <div className="w-full h-56 rounded-xl mb-8 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Cargando imagen...</span>
        </div>
      )}
      {imageError && (
        <div className="w-full h-56 rounded-xl mb-8 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">No se pudo cargar la imagen</span>
        </div>
      )}
      <img
        src={placeholderImage}
        alt="Nuestro equipo"
        className={`w-full h-56 rounded-xl mb-8 object-cover ${imageLoaded ? "block" : "hidden"}`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

      <div className="space-y-4 text-body animate-fadeIn">
        <p>
          {company.name} nació con la misión de ayudar a las marcas mexicanas a
          destacar en un entorno digital cada vez más competitivo. Creemos que cada
          negocio tiene una historia única que contar, y nuestra labor es darle voz
          a través de estrategias de marketing efectivas.
        </p>
        <p>
          Nuestro equipo está formado por especialistas en redes sociales, diseño,
          publicidad digital y fotografía profesional. Trabajamos de la mano con
          nuestros clientes, entendiendo sus necesidades y objetivos para crear
          campañas personalizadas que generen resultados reales.
        </p>
        <p>
          Con años de experiencia en el sector, hemos acompañado a empresas de
          distintos tamaños e industrias en su transformación digital. Nos apasiona
          lo que hacemos y nos comprometemos con la excelencia en cada proyecto.
        </p>
      </div>
    </div>
  );
}