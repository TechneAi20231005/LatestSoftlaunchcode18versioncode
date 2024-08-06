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
      localStorage.length > 0 || localStorage.length > 0;
    console.log('shouldRedirectToMain', shouldRedirectToMain);
    return (
      <>
        <>
          <div className="main p-2 py-3 p-xl-5 ">
            <div className="body d-flex p-0 p-xl-5">
              <div className="container-xxl">
                <div className="row g-0">
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
