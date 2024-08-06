import React from 'react';

const withTokenExpirationCheck = (WrappedComponent) => {
  return function WithTokenExpirationCheck(props) {
    const checkTokenExpiration = () => {
      const tokenExpirationTime = localStorage.getItem(
        'jwt_token_expiration'
      );
      const currentTime = new Date().getTime();
      return currentTime > Number(tokenExpirationTime);
    };

    // Check token expiration during each render
    if (checkTokenExpiration()) {
      localStorage.clear(); // Clear the session data
      window.location.href = `${process.env.PUBLIC_URL}/`; // Redirect to login page
      return null; // Return null to prevent rendering of the WrappedComponent
    }

    return <WrappedComponent {...props} />;
  };
};

export default withTokenExpirationCheck;
