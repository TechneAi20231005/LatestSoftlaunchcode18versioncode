import React from 'react'
import { Route, Routes, Switch } from 'react-router-dom'
import LeftSide from '../components/Auth/LeftSide'
import Page404 from '../components/Auth/Page404'
import ForgetPassword from '../components/Auth/ForgetPassword'
import SignIn from '../components/Auth/SignIn'
import Signup from '../components/Auth/Signup'
import ResetPassword from '../components/Auth/ResetPassword'
import StepAuthentication from '../components/Auth/StepAuthentication'
import { _base } from '../settings/constants'
import Sidebar from '../components/Common/Sidebar'
import MainIndex from './MainIndex'

class AuthIndex extends React.Component {
  render () {
    const shouldRedirectToMain = sessionStorage.length > 0 || localStorage.length > 0;

    return (
      <>
      {shouldRedirectToMain ? (
        <>
          <Sidebar />
          <MainIndex />
        </>
      ):(<>
      <div className='main p-2 py-3 p-xl-5 '>
        <div className='body d-flex p-0 p-xl-5'>
          <div className='container-xxl'>
            <div className='row g-0'>
                
              {/* Render Sidebar and MainIndex if there is data in sessionStorage or localStorage */}
          
                <LeftSide/>
              <Routes>
                {/* Define routes within AuthIndex */}
                <Route path='/*' element={<SignIn/>} />
            
                <Route path='*' element={<Page404 />} />{' '}
                {/* Catch-all route for 404 */}
              </Routes>
            
            </div>
          </div>
        </div>
      </div>
      </>
      )}
      </>
    )
  }
}

export default AuthIndex
