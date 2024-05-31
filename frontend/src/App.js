
import Home from "./Home"
import CenterHomePage from "./CenterHomePage"
import {BrowserRouter,Route,Routes} from "react-router-dom"
import EnquiryForm from "./EnquiryForm"

const App = () =>{
  return(
  <BrowserRouter>
    <Routes>
      <Route path = "/" element = {<Home/>}/>
      <Route path = "/center-home" element = {<CenterHomePage/>}/>
      <Route path = "/enquiry-form" element = {<EnquiryForm/>}/>

   </Routes>
  </BrowserRouter>
   
  )
}

export default App