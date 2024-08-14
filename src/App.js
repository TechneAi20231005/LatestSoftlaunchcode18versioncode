// Importing required dependencies and components
import React, { useEffect, useState } from 'react';

import { _base } from './settings/constants';
import Sidebar from './components/Common/Sidebar';
import AuthIndex from './screens/AuthIndex';
import MainIndex from './screens/MainIndex';

import useOnlineStatus from './components/Utilities/useOnlineStatus';

import './App.css';

// Main application component
const App = () => {
  // State to manage the token (password) using useState hook
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const onlineStatus = useOnlineStatus();
  const [checkUrl, setCheckUrl] = useState(false);
  const checkBaseUrl = () => {
    let base = `/${_base}/`;
    if (base === window.location.pathname) {
      localStorage.clear();
      localStorage.clear();
      setToken(null);
      setCheckUrl(false);
    } else if (base !== window.location.pathname && localStorage.length === 6) {
      localStorage.clear();
      localStorage.clear();
      setToken(null);
      setCheckUrl(null);
      setCheckUrl(false);
      window.location.href = `${process.env.PUBLIC_URL}/`;
    } else {
      setCheckUrl(true);
    }
  };
  // useEffect hook to check token expiration on component mount
  useEffect(() => {
    checkBaseUrl();
    // Function to check token expiration
    const checkTokenExpiration = () => {
      const tokenExpirationTime = localStorage.getItem('jwt_token_expiration');
      const currentTime = new Date().getTime();
      // Check if token expiration time exists and if it is in the past
      if (
        tokenExpirationTime &&
        Number(currentTime) > Number(tokenExpirationTime)
      ) {
        // Token has expired, log out the user and clear relevant data
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('jwt_token_expiration');
        localStorage.clear();
        // Redirect user to the login page
        window.location.href = `${process.env.PUBLIC_URL}/`;
      }
    };

    // Set up an interval to periodically check token expiration
    const interval = setInterval(checkTokenExpiration(), 3600000); // Change the interval duration as needed (e.g., 10000 ms = 10 seconds)

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, [checkUrl]);

  return (
    <>
      <div id="mytask-layout" className="theme-indigo">
        {/* && localStorage.length == 0 && checkUrl == false  */}
        {!token && <AuthIndex />}

        {token &&
          onlineStatus &&
          checkUrl === true &&
          localStorage.length > 6 && (
            <>
              <Sidebar />
              <MainIndex />
            </>
          )}
        {token && onlineStatus === false && (
          <h1 className="mt-4">
            {' '}
            Looks like you're offline 🔴🔴🔴 Please check your internet
            connection{' '}
          </h1>
        )}
      </div>
    </>
  );
};

export default App;
