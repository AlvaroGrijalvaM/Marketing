import {useLocation, Outlet} from "react-router-dom";
import ServiceCarousel from "../components/ServiceCarousel";

export default function Services() {
  const location=useLocation();
  const isIndex=location.pathname==="/services" || location.pathname==="/services/";

  return isIndex ? <ServiceCarousel/> : <Outlet/>;
}
