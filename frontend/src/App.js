
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Sidebar from "./EnquiryProcess/Navbar"
import EnquiryTable from "./EnquiryTable"
//import Centers from "./MDModule/Centers"
import MDSidebar from "./MDModule/MDNavbar"
import HoHomePage from "./HOHomePage"
import Login from "./CenterManagers/Login"
import AdmissionSidebar from "./AdmissionProcess/SideBar"
import AdmissionForm from "./AdmissionProcess/Form"
// import RegisterEmployees from "./CenterManagers/RegisterEmployes"
import CMSidebar from "./CenterManagers/CMNavBar"
import EmployeeLoginForm from "./EmployeeLoginForm"
//import EmployeeList from "./CenterManagers/EmployeeList"
//import StudentJoiningStatus from "./StudentJoiningStatus"
import MdLogin from "./MDModule/MdLogin"
//import CenterAdmissions from "./MDModule/CenterAdmissions"
import AdmissionTable from "./AdmissionTable"



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
      <Route path  = "/enquiry-admission/:id" element = {<AdmissionForm/>}/>
      <Route path = "/login/:id" element = {<EmployeeLoginForm/>}/>
      <Route path = "/cm-navbar/:id" element = {<CMSidebar/>}/>
      <Route path = "/admission-process/:id" element = {<AdmissionSidebar/>}/>
      <Route path = "/navbar/:id" element = {<Sidebar/>}/>
      <Route path = "/md-login" element = {<MdLogin/>}/>
      <Route path = "/admissions/:id" element={<AdmissionTable/>}/>

   </Routes>
  </BrowserRouter>
   
  )
}

export default App