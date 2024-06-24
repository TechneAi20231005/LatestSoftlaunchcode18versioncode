import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';

// // static import
import useOnlineStatus from './components/Utilities/useOnlineStatus';
import { RenderIf } from './utils';
import { REACT_APP_ROOT_URL } from './config/envConfig';
import { guestRoutes, userRoutes } from './routes';
import MainLayouts from './layouts/MainLayouts';
import { MainLoader } from './components/custom/loader';
import './App.css';

const App = () => {
  // // Initial state
  const onlineStatus = useOnlineStatus();
  const tokenPresent = localStorage.getItem('jwt_token');

  // // redux state
  const { isAuth } = useSelector((state) => state.login);

  // // local state
  const [appRoutes, setAppRoutes] = useState([]);
  const [screenLoading, setScreenLoading] = useState(false);

  // useEffect hook for set routes on component mount
  useEffect(() => {
    if (tokenPresent || isAuth) {
      setAppRoutes(userRoutes);
    } else {
      setAppRoutes(guestRoutes);
    }
  }, [tokenPresent, isAuth]);

  // useEffect hook to check token expiration on component mount
  useEffect(() => {
    const checkTokenExpiration = () => {
      const tokenExpirationTime = localStorage.getItem('jwt_token_expiration');
      const currentTime = new Date().getTime();
      if (
        tokenExpirationTime &&
        Number(currentTime) > Number(tokenExpirationTime)
      ) {
        localStorage.clear();
        localStorage.clear();
      }
    };
    const interval = setInterval(checkTokenExpiration(), 3600000);
    return () => {
      clearInterval(interval);
    };
  }, [window.location.pathname]);

  // // preloader
  useLayoutEffect(() => {
    setScreenLoading(true);
    setTimeout(() => {
      setScreenLoading(false);
    }, 2000);
  }, []);

  const mainContent = appRoutes.map((route) => {
    return route.component ? (
      <Route
        key={route.name}
        path={`/${REACT_APP_ROOT_URL}${route.path}`}
        exact={route.exact}
        name={route.name}
        element={<route.component />}
      />
    ) : (
      route.redirectRoute && (
        <Route
          path="*"
          key={route.name}
          element={<Navigate to={`/${REACT_APP_ROOT_URL}${route.path}`} />}
        />
      )
    );
  });

  return (
    <>
      <RenderIf render={screenLoading}>
        <MainLoader />
      </RenderIf>
      <div
        id="mytask-layout"
        className={`${screenLoading ? 'd_hide' : 'theme-indigo'}`}
      >
        <Routes>
          <Route element={<MainLayouts isAuthenticated={tokenPresent} />}>
            {mainContent}
          </Route>
        </Routes>

        {tokenPresent && onlineStatus === false && (
          <h1 className="mt-4">
            Looks like you're offline 🔴🔴🔴 Please check your internet
            connection{' '}
          </h1>
        )}
      </div>
    </>
  );
};

export default App;
// updated by Rushikesh harkare 01/08/2023
