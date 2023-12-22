import React, { Children } from 'react'
import { Navigate } from 'react-router-dom'

const Auth = (props) => {

    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');
    
    return isAuthenticated ? ( <Component /> ) : ( <Navigate to='/' /> );

}

export default Auth
