import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleImg from "../../assets/images/forgot-password.svg";
import { postData } from "../../services/ForgetPasswordService/ResetPasswordService";
import * as Validation from "../Utilities/Validation";
import Alert from "../Common/Alert";
import { _base } from "../../settings/constants";
import InputGroup from 'react-bootstrap/InputGroup';


export default function ResetPassword({ location }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [userData, setUserData] = useState({ email: null });
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
  };

  const [passwordShown1, setPasswordShown1] = useState(false);
  const togglePasswordVisiblity1 = () => {
      setPasswordShown1(passwordShown1 ? false : true);
  };    
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    postData(userData).then((res) => {
      if (res.status == 200) {
        if (res.data.status === 1) {
          history(`/${_base}/`);
        } else {
          setNotify();
          setNotify({ type: "danger", message: res.data.message });
        }
      } else {
        setNotify();
        setNotify({ type: "danger", message: "Request Error" });
      }
    });
  };
  useEffect(() => {
    if (location && location.state) {
      setUserData((prevState) => ({
        ...prevState,
        email: location.state.email,
        otp: location.state.otp,
      }));
    }
  }, []);
  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      {notify && <Alert alertData={notify} />}
      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form onSubmit={submitHandler} className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center ">
            <img src={GoogleImg} className="w240 mb-4" alt="" />
            <h1>Reset password</h1>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">
                <b>New Password:</b>
              </label>
              <InputGroup className="">
                <input
                  type={passwordShown ? "text" : "password"}
                  className="form-control form-control-lg"
                  required
                  name="password"
                  id="password"
                  onChange={changeHandler}
                  onKeyPress={(e) => {
                    Validation.CharactersNumbersSpeicalOnly(e);
                  }}
                  minLength={8}
                  maxLength={12}
                />
                <InputGroup.Text>
                  <i
                    className="bi bi-eye-fill"
                    onClick={togglePasswordVisiblity}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">
                <b>Confirm Password:</b>
              </label>
              <InputGroup className="">
              <input
                type={passwordShown1 ? "text" : "password"}
                className="form-control form-control-lg"
                required
                name="confirm_password"
                id="confirm_password"
                onChange={changeHandler}
                onKeyPress={(e) => {
                  Validation.CharactersNumbersSpeicalOnly(e);
                }}
                minLength={8}
                maxLength={12}
              />
                  <InputGroup.Text>
                  <i
                    className="bi bi-eye-fill"
                    onClick={togglePasswordVisiblity1}
                  ></i>
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-lg btn-block btn-light lift text-uppercase"
            >
              Reset
            </button>
          </div>
          <div className="col-12 text-center mt-4">
            <span className="text-muted">
              <Link to={`/${_base}/`} className="text-secondary">
                Back to Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
