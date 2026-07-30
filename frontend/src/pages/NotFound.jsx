import {Link} from "react-router-dom";

export default function NotFound(){
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl sm:text-9xl font-bold mb-4" style={{color: "var(--accent)"}}>404</h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{color: "var(--text-h)"}}>Página no encontrada</h2>
      <p className="max-w-md mb-8" style={{color: "var(--text)"}}>
        Lo sentimos, la página que buscas no existe o ha sido movida.<br/>
        Verifica la URL o vuelve al inicio.
      </p>
      <Link to="/home" className="btn-regular">Volver al inicio</Link>
    </div>
  );
}