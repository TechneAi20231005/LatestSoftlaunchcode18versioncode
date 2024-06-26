import React, { Suspense, memo } from 'react';
import { Outlet } from 'react-router-dom';

// // static import
import Sidebar from '../components/Common/Sidebar';
import Header from '../components/Common/Header';
import LeftSide from '../components/Auth/LeftSide';
import { SuspenseLoader } from '../components/custom/loader';

function MainLayouts({ isAuthenticated, setScreenPreLoading }) {
  return (
    <>
      {isAuthenticated ? (
        <>
          <Sidebar />
          <div className="main px-lg-4 px-md-4 position-relative">
            <Header />
            <Suspense fallback={<SuspenseLoader />}>
              <div className="py-lg-3 py-md-2">
                <Outlet />
              </div>
            </Suspense>
          </div>
        </>
      ) : (
        <Suspense fallback={<SuspenseLoader />}>
          <div className="main d-flex justify-content-around align-items-center">
            <LeftSide />
            <Outlet context={[setScreenPreLoading]} />
          </div>
        </Suspense>
      )}
    </>
  );
}

export default memo(MainLayouts);
