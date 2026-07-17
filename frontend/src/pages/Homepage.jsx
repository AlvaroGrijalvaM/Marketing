import {useState, useEffect} from "react";
import {company} from "../data/companyData";
const placeholderImage = "";
import {loadImage} from "../utils/imageLoader";

export default function Homepage(){
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroError, setHeroError] = useState(false);

  // Async function to load the hero image
  useEffect(() => {
    async function loadHeroImage() {
      try {
        await loadImage(placeholderImage);
        setHeroLoaded(true);
      } catch {
        setHeroError(true);
      }
    }
    loadHeroImage();
  }, []);

  return (
    <div className="w-full">
      <section className="relative w-full">
        {!heroLoaded && !heroError && (
          <div className="w-full h-72 md:h-96 bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-sm">Cargando imagen...</span>
          </div>
        )}
        {heroError && (
          <div className="w-full h-72 md:h-96 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No se pudo cargar la imagen</span>
          </div>
        )}
        <img
          src={placeholderImage}
          alt="Equipo de marketing"
          className={`w-full h-72 md:h-96 object-cover ${heroLoaded ? "block" : "hidden"}`}
          onLoad={() => setHeroLoaded(true)}
          onError={() => setHeroError(true)}
        />
      </section>

      <section className="page-container">
        <h2 className="heading-section">Bienvenidos a {company.name}</h2>
        <p className="text-body mb-4">
          Somos una agencia de marketing digital dedicada a impulsar el crecimiento de
          empresas y emprendedores. Combinamos creatividad, estrategia y tecnología para
          conectar tu marca con la audiencia correcta.
        </p>
        <p className="text-body">
          Desde la gestión de redes sociales hasta campañas publicitarias y producción
          de contenido visual, ofrecemos soluciones integrales adaptadas a tus objetivos
          de negocio. Trabajamos contigo para construir una presencia digital sólida y
          resultados medibles.
        </p>
      </section>
    </div>
  );
}
