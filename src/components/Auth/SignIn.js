import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { _base } from '../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../Common/Alert';
import { postLoginUser } from './AuthSices/loginAction';

export default function SignIn() {
  // // initial state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // redux state
  const notify = useSelector((loginSlice) => loginSlice.login.notify);

  // // local state
  const [isLoading, setIsLoading] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const data = new FormData(e.target);
    dispatch(postLoginUser(data)).then((success) => {
      if (success.payload?.status === 1) {
        const token = localStorage.getItem('jwt_token');
        const tokenExpirationTime = decodeToken(token).exp * 1000;
        localStorage.setItem('jwt_token_expiration', tokenExpirationTime);
        window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
      } else {
        setIsLoading(false);
      }
    });
  };

  const decodeToken = (token) => {
    // Decode JWT token payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const checkTokenExpiration = () => {
    const tokenExpirationTime = localStorage.getItem('jwt_token_expiration');
    const currentTime = new Date().getTime();

    if (tokenExpirationTime && currentTime > tokenExpirationTime) {
      // Token has expired, log out the user
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('jwt_token_expiration');
      localStorage.clear();
      // history(`${process.env.PUBLIC_URL}/`);
    }
  };

  const loadData = () => {
    if (
      localStorage.getItem('message_type') &&
      localStorage.getItem('message')
    ) {
      localStorage.setItem('message_type', null);
      localStorage.setItem('message', null);
    }
  };
  useEffect(() => {
    if (shouldNavigate) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
      setShouldNavigate(false); // Reset flag to prevent multiple navigations
    }
  }, [shouldNavigate, navigate]);
  useEffect(() => {
    loadData();
    checkTokenExpiration();
  }, []);

  return (
    <div>
      {notify && <Alert alertData={notify} />}

      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: '32rem' }}
      >
        <form onSubmit={submitHandler} className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center mb-1 mb-lg-5">
            <h1 style={{ fontFamily: 'Georgia, serif' }}>Sign In</h1>
          </div>

          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">
                <b>Username :</b>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="name@example.com"
                id="email_id"
                name="email_id"
                required
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <div className="form-label">
                <span className="d-flex justify-content-between align-items-center">
                  <b>Password :</b>
                  <Link
                    className="text-secondary"
                    to={`/${_base}/forget-password`}
                  >
                    Forgot Password?
                  </Link>
                </span>
              </div>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="***************"
                id="password"
                name="password"
                required
              />
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-lg btn-block btn-light lift text-uppercase"
              atl="signin"
            >
              SIGN IN
            </button>
          </div>

          <div className="col-12 text-center mt-4 mb-0">
            <span className="text-muted">
              <b>
                Powered By <span className="text-white">TECHNEAI PVT LTD</span>{' '}
                <br />V 2.0.0
              </b>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
