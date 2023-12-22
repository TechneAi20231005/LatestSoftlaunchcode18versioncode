// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import GoogleImg from "../../assets/images/google.svg";
// import Logo from "../../assets/images/logo.jpeg";
// import { _base } from "../../settings/constants";

// import { postData } from "../../services/loginService";
// import Alert from "../Common/Alert";

// export default function SignIn() {
//   const history = useNavigate();
//   const [notify, setNotify] = useState(null);

//   const submitHandler = (e) => {
//     setNotify(null);
//     e.preventDefault();
//     const data = new FormData(e.target);
//     postData(data).then((res) => {
//       if (res.status === 200) {
//         if (res.data.status === 1) {
//           const data = res.data.data;
//           const token = res.data.token;

//           Object.keys(data).map((key) => {
//             sessionStorage.setItem(key, data[key]);
//             localStorage.setItem(key, data[key]);
//           });
//           sessionStorage.setItem("jwt_token", token);
//           localStorage.setItem("jwt_token", token);
//           // console.log(res.data.data);
//           // foreach
//           // sessionStorage.setItem('id',res.data.data.id);
//           // sessionStorage.setItem('tenant_id',res.data.data.tenant_id);
//           // sessionStorage.setItem('token',res.data.data.token);
//           // sessionStorage.setItem('name',res.data.data.name);
//           // sessionStorage.setItem('email',res.data.data.email);
//           // sessionStorage.setItem('profile_picture',res.data.data.profile_picture);

//           // localStorage.setItem('id',res.data.data.id);
//           // localStorage.setItem('tenant_id',res.data.data.tenant_id);
//           // localStorage.setItem('token',res.data.data.token);
//           // localStorage.setItem('email',res.data.data.email);
//           // localStorage.setItem('profile_picture',res.data.data.profile_picture);

//           window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
//           var returnValue = {
//             show: true,
//             type: "success",
//             message: "Logged In !!!",
//           };

//           history.push({
//             pathname: `${process.env.PUBLIC_URL}/Dashboard`,
//             state: { alert: { type: "success", message: res.data.message } },
//           });
//         } else {
//           setNotify();
//           setNotify({ type: "danger", message: res.data.message });
//         }
//       } else {
//         setNotify({ type: "danger", message: "Permission not assigned !!!" });
//       }
//     });
//   };

//   const loadData = () => {
//     if (
//       sessionStorage.getItem("message_type") &&
//       sessionStorage.getItem("message")
//     ) {
//       setNotify({
//         type: sessionStorage.getItem("message_type"),
//         message: sessionStorage.getItem("message"),
//       });
//       sessionStorage.setItem("message_type", null);
//       sessionStorage.setItem("message", null);
//     }zz
//   };
//   useEffect(() => {
//     loadData();
//   }, []);

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleImg from "../../assets/images/google.svg";
import Logo from "../../assets/images/logo.jpeg";
import { _base } from "../../settings/constants";

import { postData } from "../../services/loginService";
import Alert from "../Common/Alert";

export default function SignIn() {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  
  const submitHandler = (e) => {
    setNotify(null);
    e.preventDefault();
    const data = new FormData(e.target);
    postData(data).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const data = res.data.data;
          const token = res.data.token;

          Object.keys(data).map((key) => {
            sessionStorage.setItem(key, data[key]);
            localStorage.setItem(key, data[key]);
          });
          Object.keys(data.access).map((key) => {
            sessionStorage.setItem(key, data.access[key]);
            localStorage.setItem(key, data.access[key]);
          });

          sessionStorage.setItem("jwt_token", token);
          localStorage.setItem("jwt_token", token);

          // Set token expiration time
          const tokenExpirationTime = decodeToken(token).exp * 1000;
          localStorage.setItem("jwt_token_expiration", tokenExpirationTime);

          window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
          var returnValue = {
            show: true,
            type: "success",
            message: "Logged In !!!",
          };

          history({
            pathname: `${process.env.PUBLIC_URL}/Dashboard`,
            state: { alert: { type: "success", message: res.data.message } },
          });
        } else {
          setNotify();
          setNotify({ type: "danger", message: res.data.message });
        }
      } else {
        setNotify({ type: "danger", message: "Permission not assigned !!!" });
      }
    });
  };

  const decodeToken = (token) => {
    // Decode JWT token payload
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const checkTokenExpiration = () => {
    const tokenExpirationTime = localStorage.getItem("jwt_token_expiration");
    const currentTime = new Date().getTime();

    if (tokenExpirationTime && currentTime > tokenExpirationTime) {
      // Token has expired, log out the user
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("jwt_token_expiration");
      sessionStorage.clear();
      history(`${process.env.PUBLIC_URL}/`);
    }
  };

  const loadData = () => {
    if (
      sessionStorage.getItem("message_type") &&
      sessionStorage.getItem("message")
    ) {
      setNotify({
        type: sessionStorage.getItem("message_type"),
        message: sessionStorage.getItem("message"),
      });
      sessionStorage.setItem("message_type", null);
      sessionStorage.setItem("message", null);
    }
  };

  useEffect(() => {
    loadData();
    checkTokenExpiration();
  }, []);

  return (
    <div
      className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg"
      style={{ marginTop: "0px", height: "200%" }}
    >
      {notify && <Alert alertData={notify} />}

      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form onSubmit={submitHandler} className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center mb-1 mb-lg-5">
            <h1 style={{fontFamily:"Georgia, serif"}}>Sign In</h1>
            {/* <span>Free access to our dashboard.</span> */}
          </div>
          {/* <div className="col-12 text-center mb-4">
                            <a className="btn btn-lg btn-outline-secondary btn-block" href="#!">
                                <span className="d-flex justify-content-center align-items-center">
                                    <img className="avatar xs me-2" src={GoogleImg} alt="Imag Description" />
                                    Sign in with Google
                                </span>
                            </a>
                            <span className="dividers text-muted mt-4">OR</span>
                        </div> */}
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
          {/* <div className="col-12">

                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                <label className="form-check-label" for="flexCheckDefault">
                                    Remember me
                                </label>
                            </div>
                        </div> */}
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-lg btn-block btn-light lift text-uppercase"
              atl="signin"
            >
              SIGN IN
            </button>
          </div>
          {/* <div className="col-12 text-center mt-4">
                            <span className="text-muted">Forget your password ? <b><Link to="sign-up" className="text-secondary">Reset Password</Link>
                            </b></span>
                        </div> */}
          <div className="col-12 text-center mt-4 mb-0">
            <span className="text-muted">
              <b>
                Powered By <span className="text-white">TECHNEAI PVT LTD</span>{" "}
                <br />V 2.0.0
              </b>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
