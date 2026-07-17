import {useState, useEffect} from "react";
import {useParams, Link} from "react-router-dom";
import {services, clients} from "../data/serviceData";
import {loadImage} from "../utils/imageLoader";

export default function ServicePage(){
  const {slug}=useParams();
  const [serviceImageLoaded, setServiceImageLoaded] = useState(false);
  const [serviceImageError, setServiceImageError] = useState(false);
  const [clientImagesLoaded, setClientImagesLoaded] = useState({});
  const [clientImagesError, setClientImagesError] = useState({});

  const service=services.find((s) => s.slug===slug);
  const serviceClients = service ? clients.filter((c) => c.id_servicio === service.id) : [];

  // Async function to load the service image
  useEffect(() => {
    if (!service) return;
    async function loadServiceImage() {
      if (!service.image) {
        setServiceImageError(true);
        return;
      }
      try {
        await loadImage(service.image);
        setServiceImageLoaded(true);
      } catch {
        setServiceImageError(true);
      }
    }
    loadServiceImage();
  }, [service]);

  // Async function to load each client's image
  useEffect(() => {
    if (serviceClients.length === 0) return;
    async function loadClientImages() {
      const loadPromises = serviceClients.map(async (client) => {
        if (!client.image) {
          setClientImagesError((prev) => ({...prev, [client.id]: true}));
          return;
        }
        try {
          await loadImage(client.image);
          setClientImagesLoaded((prev) => ({...prev, [client.id]: true}));
        } catch {
          setClientImagesError((prev) => ({...prev, [client.id]: true}));
        }
      });
      await Promise.all(loadPromises);
    }
    loadClientImages();
  }, [serviceClients]);

  if (!service) return null;

  return(
    <div className="page-container">
      <Link to="../" className="inline-block text-sm link-accent mb-6">← Volver a servicios</Link>

      {/* Service image with async loading */}
      {!serviceImageLoaded && !serviceImageError && (
        <div className="w-full h-56 rounded-xl mb-6 bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400 text-sm">Cargando imagen...</span>
        </div>
      )}
      {serviceImageError && (
        <div className="w-full h-56 rounded-xl mb-6 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Imagen no disponible</span>
        </div>
      )}
      <img src={service.image || ""} alt={service.name}
        className={`w-full h-56 object-cover rounded-xl mb-6 ${serviceImageLoaded ? "block" : "hidden"}`}
        onLoad={() => setServiceImageLoaded(true)} onError={() => setServiceImageError(true)}
      />

      <h1 className="heading-page">{service.name}</h1>
      <p className="text-body">{service.description}</p>

      {serviceClients.length > 0 && (
        <section className="mt-12">
          <h2 className="heading-section mb-6">Nuestros clientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {serviceClients.map((client) => (
              <div key={client.id} className="flex flex-col items-center p-4 rounded-xl bg-white/50 border border-[var(--border)]">
                {!clientImagesLoaded[client.id] && !clientImagesError[client.id] && (
                  <div className="w-full max-w-[200px] h-24 bg-gray-200 animate-pulse rounded mb-2" />
                )}
                {clientImagesError[client.id] && (
                  <div className="w-full max-w-[200px] h-24 bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Sin imagen</span>
                  </div>
                )}
                <img src={client.image || ""} alt={client.name}
                  className={`w-full max-w-[200px] h-auto mb-2 ${clientImagesLoaded[client.id] ? "block" : "hidden"}`}
                  onLoad={() => setClientImagesLoaded((prev) => ({...prev, [client.id]: true}))}
                  onError={() => setClientImagesError((prev) => ({...prev, [client.id]: true}))}
                />
                {client.url ? (
                  <a href={client.url} target="_blank" rel="noopener noreferrer" className="link-accent font-medium">@{client.name}</a>
                ) : (
                  <span className="font-medium text-[var(--text)]">@{client.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}