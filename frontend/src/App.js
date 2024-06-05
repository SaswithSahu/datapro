
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import Sidebar from "./Navbar"
import EnquiryTable from "./EnquiryTable"
import Centers from "./Centers"




const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home" element = {<CenterHomePage/>}/>
      <Route path = "/navbar/:id" element = {<Sidebar/>}/>
      {/* <Route path = "/enquiry-table" element = {<EnquiryTable/>}/> */}
      <Route path = "/centers" element = {<Centers/>}/>
      <Route path = "/center/:id" element = {<EnquiryTable/>}/>
   </Routes>
  </BrowserRouter>
   
  )
}

export default App