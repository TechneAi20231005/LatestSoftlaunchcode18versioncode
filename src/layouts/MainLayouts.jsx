import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';

function MainLayouts({ isAuthenticated }) {
  return (
    <>
      {isAuthenticated ? (
        <>
          <div className="main px-lg-4 px-md-4">
            <Header />
            <div className="body d-flex py-lg-3 py-md-2">
              <Outlet />
            </div>
          </div>
        </>
      ) : (
        <>
          <Outlet />
        </>
      )}
    </>
  );
}

export default memo(MainLayouts);
