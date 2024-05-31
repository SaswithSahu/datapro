
import "./index.css"
import { FaBuilding } from "react-icons/fa";
const Home = () =>{
    return (
        <div className="home-page">
         
            <nav className="navbar navbar-light" style={{marginLeft:"40px"}}>
            <a class="navbar-brand" href="/">
                <img src="https://media.licdn.com/dms/image/D560BAQFEeDUK_-l7Rg/company-logo_200_200/0/1681768294128/datapro_solutions_logo?e=2147483647&v=beta&t=VMnJz2SlaAxEm7jeVRC8VD_QLaCbsRANLH8G87RlKqQ" width="100" height="100" alt="home-logo"/>
            </a>
            </nav>
            <div className = "home-page-body">
            <a href="/center-home"  style={{textDecoration:"none",color:"black"}}>
            <div className = "center-name-card">
                    <FaBuilding className="icon"/>
                    <h1>Head Office</h1>
                </div>
            </a>
            <a href = "/center-home"  style={{textDecoration:"none",color:"black"}}>
            <div className = "center-name-card">
                <FaBuilding className="icon"/>
                    <h1>DWK</h1>
                </div>
            </a>
            <a href = "/center-home" style={{textDecoration:"none",color:"black"}}>
            <div className = "center-name-card">
                <FaBuilding className="icon"/>
                    <h1>MVP</h1>
                </div>
            </a>
            </div>
        </div>
    )
}

export default Home 