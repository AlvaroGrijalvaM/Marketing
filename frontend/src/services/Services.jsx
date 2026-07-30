import {useLocation, Outlet} from "react-router-dom";
import ServiceCarousel from "../components/ServiceCarousel";

export default function Services() {
  const location=useLocation();
  const pathname=location.pathname;
  const isIndex=pathname==="/services" || pathname==="/services/";

  // If not at the index, render the nested child route (ServicePage)
  if (!isIndex){
    return <Outlet/>;
  }

  return <ServiceCarousel/>;
}