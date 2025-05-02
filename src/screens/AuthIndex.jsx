import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LeftSide from '../components/Auth/LeftSide';
import Page404 from '../components/Auth/Page404';
import ForgetPassword from '../components/Auth/ForgetPassword';
import SignIn from '../components/Auth/SignIn';

import ResetPassword from '../components/Auth/ResetPassword';
import StepAuthentication from '../components/Auth/StepAuthentication';
import { _base } from '../settings/constants';

class AuthIndex extends React.Component {
  render() {
    const shouldRedirectToMain =
      sessionStorage.length > 0 || localStorage.length > 0;
    console.log('shouldRedirectToMain', shouldRedirectToMain);
    return (
      <>
        <>
          <div className="main ">
            <div className="body d-flex">
              <div className="container-xxl mt-lg-4">
                <div className="d-flex justify-content-center align-items-center mt-5 px-lg-5 mx-lg-5">
                  <LeftSide />
                  <Routes>
                    <Route path="/*" element={<SignIn />} />
                    <Route
                      exact
                      path={`/${_base}/forget-password`}
                      element={<ForgetPassword />}
                    />
                    <Route
                      exact
                      path={`/${_base}/reset-password`}
                      element={<ResetPassword />}
                    />
                    <Route
                      exact
                      path={`/${_base}/otp`}
                      element={<StepAuthentication />}
                    />
                    <Route path="*" element={<Page404 />} />{' '}
                  </Routes>
                </div>
              </div>
            </div>
          </div>
        </>
      </>
    );
  }
}

export default AuthIndex;
