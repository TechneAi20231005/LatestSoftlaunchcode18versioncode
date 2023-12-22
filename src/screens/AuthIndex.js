import React from "react";
import { Route,Routes,Switch } from "react-router-dom";
import LeftSide from "../components/Auth/LeftSide";
import Page404 from "../components/Auth/Page404";
import ForgetPassword from "../components/Auth/ForgetPassword";
import SignIn from "../components/Auth/SignIn";
import Signup from "../components/Auth/Signup";
import ResetPassword from "../components/Auth/ResetPassword";
import StepAuthentication from "../components/Auth/StepAuthentication";
import {_base} from "../settings/constants"

class AuthIndex extends React.Component{
    render(){        
        return(
            
            <div className="main p-2 py-3 p-xl-5 " >
                <div className="body d-flex p-0 p-xl-5">
                    <div className="container-xxl">
                        <div className="row g-0">
                            <LeftSide />                
                            
                            <SignIn/>
                             
                            {/* <Route path="/forget-password" element={<ForgetPassword/>} />
                            <Route path= "/otp" element={<StepAuthentication/>} />
                            <Route path= "/reset-password" element={<ResetPassword/>} /> */}
                            {/* <Route path={`${process.env.PUBLIC_URL}/sign-up`} element={Signup} />
                            
                            
                            <Route path={`${process.env.PUBLIC_URL}/page-404`} element={Page404} /> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AuthIndex;