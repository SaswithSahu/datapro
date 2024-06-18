
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Sidebar from "./EnquiryProcess/Navbar"
import EnquiryTable from "./EnquiryTable"
import Centers from "./Centers"
import MDSidebar from "./MDModule/MDNavbar"
import HoHomePage from "./HOHomePage"
import Login from "./Login"
import AdmissionSidebar from "./AdmissionProcess/SideBar"


const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home" element = {<CenterHomePage/>}/>
      <Route path = "/ho-home" element = {<HoHomePage/>}/>
      <Route path = "/navbar/:id" element = {<Sidebar/>}/>
      {/* <Route path = "/enquiry-table" element = {<EnquiryTable/>}/> */}
      <Route path = "/centers" element = {<Centers/>}/>
      <Route path = "/center/:id" element = {<EnquiryTable/>}/>
      <Route path = "/md-navbar/:id" element = {<MDSidebar/>}/>
      <Route path = "/login" element = {<Login/>}/>
      <Route path = "/admission-process/:id" element = {<AdmissionSidebar/>}/>
   </Routes>
  </BrowserRouter>
   
  )
}

export default App