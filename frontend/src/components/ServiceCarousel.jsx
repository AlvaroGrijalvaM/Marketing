import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {services} from "../data/serviceData";
import {loadImage} from "../utils/imageLoader";

export default function ServiceCarousel() {
  const [current, setCurrent]=useState(0);
  const [fade, setFade]=useState(true);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const total = services.length;
  const service=services[current];

  // Preload images for the current service using loadImage promise
  useEffect(() => {
    async function loadServiceImage() {
      if (!service.image) {
        setImagesLoaded((prev) => ({...prev, [current]: false}));
        return;
      }
      try {
        await loadImage(service.image);
        setImagesLoaded((prev) => ({...prev, [current]: true}));
      } catch {
        setImagesLoaded((prev) => ({...prev, [current]: false}));
      }
    }
    loadServiceImage();
  }, [current, service]);

  const changeSlide=(index)=>{
    setFade(false);
    setTimeout(()=>{
      setCurrent(index);
      setFade(true);
    }, 300);
  };

  const prev=() => changeSlide((current-1+total)%total);
  const next=() => changeSlide((current+1)%total);

  // Auto-slide every 5 seconds
  useEffect(()=>{
    const interval=setInterval(()=>{
      changeSlide((current+1)%total);
    }, 5000);
    return ()=>clearInterval(interval);
  }, [current, total]);

  return(
    <section className="w-full max-w-3xl mx-auto px-4 py-8">
      <h1 className="heading-page mb-6">Nuestros servicios</h1>

      <div className="relative bg-[var(--bg)] rounded-xl shadow-md overflow-hidden border border-[var(--brand-light-border)]">
        <div className={`transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
          {imagesLoaded[current] === undefined && (
            <div className="w-full h-56 bg-gray-200 animate-pulse" />
          )}
          {imagesLoaded[current] === false && (
            <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Imagen no disponible</span>
            </div>
          )}
          <img
            src={service.image || ""}
            alt={service.name}
            className={`w-full h-56 object-cover ${imagesLoaded[current] ? "block" : "hidden"}`}
          />

          <div className="p-6 flex flex-col items-center gap-4">
            <h2 className="heading-section text-center">{service.name}</h2>
            <p className="text-body text-sm">{service.description}</p>
            <Link to={service.slug} className="btn-regular">
              Ver más
            </Link>
          </div>
        </div>

        <button type="button" onClick={prev} aria-label="Servicio anterior"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 shadow font-bold transition-colors" style={{color: "var(--brand-dark)"}}
        >
          ‹
        </button>
        <button type="button" onClick={next} aria-label="Siguiente servicio"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 shadow font-bold transition-colors" style={{color: "var(--brand-dark)"}}
        >
          ›
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {services.map((s, i) => (
          <button key={s.id} type="button" aria-label={`Ir a ${s.name}`} onClick={() => changeSlide(i)}
            className={`w-3 h-3 rounded-full transition-colors border ${i===current ? "bg-[var(--accent)] border-[var(--accent)]" : "bg-[var(--bg)] border-[var(--border)]"}`}
          />
        ))}
      </div>
    </section>
  );
}