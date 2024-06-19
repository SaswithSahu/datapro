import React from 'react';
import { useParams } from 'react-router-dom';
//import StudentDetailsView from '../StudentDetailsView';
import Centers from '../Centers';
import ManagerRegistration from '../ManagerRegistration';
import EnquiresAndAdmissions from '../EnquiresAndAdmissions';

const MDSidebar = () => {
    const {id} = useParams()
    return (
        <div className="container-fluid" style={{height:"100vh"}}>
            <div className="row flex-nowrap">
                <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark" style={{height:"100vh"}}>
                    <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                        <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                            <span className="fs-5 d-none d-sm-inline">Datapro<br/>Computers</span>
                        </a>
                        <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                            <li className="nav-item">
                                <a href="/md-navbar/centers" className="nav-link align-middle px-0">
                                    <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Enquiries</span>
                                </a>
                            </li>
                            <li>
                                <a href="/md-navbar/admissions" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Admissions</span> </a>
                            </li>
                            <li>
                                <a href="/md-navbar/register-managers" className="nav-link px-0 align-middle">
                                    <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Register Managers</span> </a>
                            </li>
                            
                        </ul>
                        <hr />
                        <div className="dropdown pb-4">
                            <a href="/" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                                <span className="d-none d-sm-inline mx-1">loser</span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                                <li><a className="dropdown-item" href="/">New project...</a></li>
                                <li><a className="dropdown-item" href="/">Settings</a></li>
                                <li><a className="dropdown-item" href="/">Profile</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="/">Sign out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col py-3" style={{height:"100vh",overflow:"auto"}}>
                 {id === 'centers' && <Centers/>}
                 {id === 'register-managers' && <ManagerRegistration/>}
                 {id === 'admissions' && <EnquiresAndAdmissions/>}
                </div>
            </div>
        </div>
    );
}

export default MDSidebar;
