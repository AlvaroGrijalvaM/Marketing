import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Homepage from "./pages/Homepage";
import Services from "./services/Services";
import ServicePage from "./components/ServicePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import QuoteForm from "./pages/QuoteForm";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate replace to="home"/>}/>
        <Route path="/" element={<Home/>}>
          <Route path="home" element={<Homepage/>}/>
          <Route path="services" element={<Services/>}>
            <Route path=":slug" element={<ServicePage/>}/>
          </Route>
          <Route path="about" element={<About/>}/>
          <Route path="contact" element={<Contact/>}>
            <Route path="solicitar" element={<QuoteForm/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}