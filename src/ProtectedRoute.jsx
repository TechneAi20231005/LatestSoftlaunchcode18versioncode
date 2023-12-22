import React from "react";
import { Route, Redirect } from "react-router-dom";

const isAuthenticated = () => {
  // Implement your authentication logic here, e.g., check if the user is logged in
  // You can use a state management library (e.g., Redux) or any authentication context
  // For this example, we'll assume you have a function that returns the user's authentication status
  return true; // Replace this with your actual authentication check
};

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

export default ProtectedRoute;
