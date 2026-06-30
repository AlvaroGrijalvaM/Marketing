import {Outlet} from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home(){
  return(
    <div className="min-h-[100dvh] flex flex-col pt-20">
      <Navbar/>
      <Breadcrumb/>
      <main className="flex-1 flex flex-col items-center"><Outlet/></main>
      <Footer/>
    </div>
  );
}