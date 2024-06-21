
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Sidebar from "./EnquiryProcess/Navbar"
import EnquiryTable from "./EnquiryTable"
import Centers from "./MDModule/Centers"
import MDSidebar from "./MDModule/MDNavbar"
import HoHomePage from "./HOHomePage"
import Login from "./CenterManagers/Login"
import AdmissionSidebar from "./AdmissionProcess/SideBar"
import AdmissionForm from "./AdmissionProcess/Form"
import RegisterEmployees from "./CenterManagers/RegisterEmployes"
import CMSidebar from "./CenterManagers/CMNavBar"
import EmployeeLoginForm from "./EmployeeLoginForm"
import EmployeeList from "./CenterManagers/EmployeeList"



const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home/:id" element = {<CenterHomePage/>}/>
      <Route path = "/ho-home" element = {<HoHomePage/>}/>
      <Route path = "/center/:id" element = {<EnquiryTable/>}/>
      <Route path = "/md-navbar/:id" element = {<MDSidebar/>}/>
      <Route path = "/manager-login" element = {<Login/>}/>
    
      <Route path = "/login/:id" element = {<EmployeeLoginForm/>}/>
      <Route path = "/cm-navbar/:id" element = {<CMSidebar/>}/>
      <Route path = "/admission-process/:id" element = {<AdmissionSidebar/>}/>
      <Route path = "/navbar/:id" element = {<Sidebar/>}/>
      <Route path = "/demo" element = {<EmployeeList/>}/>
   </Routes>
  </BrowserRouter>
   
  )
}

export default App