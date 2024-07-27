
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Sidebar from "./EnquiryProcess/Navbar"
import EnquiryTable from "./EnquiryTable"
import MDSidebar from "./MDModule/MDNavbar"
import HoHomePage from "./HOHomePage"
import Login from "./CenterManagers/Login"
import AdmissionSidebar from "./AdmissionProcess/SideBar"
import AdmissionForm from "./AdmissionProcess/Form"
import CMSidebar from "./CenterManagers/CMNavBar"
import EmployeeLoginForm from "./EmployeeLoginForm"
import MdLogin from "./MDModule/MdLogin"
import AdmissionTable from "./MDModule/AdmissionTable"
import AdminNavbar from "./AdminModule/AdminNavbar"
// import RevenueChart from "./MDModule/Revenue"
// import AllCourses from "./CenterManagers/AllCourses"
// import CenterCourses from "./CenterManagers/CenterCourses"
import AllCenterCourses from "./AllCenterCourses"
import WalkIns from "./Walkins"
import WalkinInfo from "./WalkinInfo"



const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home/:id" element = {<CenterHomePage/>}/>
      <Route path = "/ho-home" element = {<HoHomePage/>}/>
      <Route path = "/admin/:id" element = {<AdminNavbar/>}/>
      <Route path = "/demo" element = {<AllCenterCourses/>}/>
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
      <Route path = "/walk-ins" element = {<WalkIns/>}/>
      <Route path = "/co" element = {<WalkinInfo/>}/>

   </Routes>
  </BrowserRouter>
   
  )
}

export default App