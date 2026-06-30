import {Link} from "react-router-dom";

export default function NotFound(){
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Página no encontrada</h2>
        <p className="text-gray-600 max-w-md mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.<br/>Verifica la URL o vuelve al inicio.
        </p>
        <Link to="/home" className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Volver al inicio
        </Link>
    </div>
  );
}