import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleImg from "../../assets/images/verify.svg";
import * as Validation from "../Utilities/Validation";
import Alert from "../Common/Alert";
import { _base } from "../../settings/constants";
import { postDataa } from "../../services/ForgetPasswordService/OtpService";
import { postData } from "../../services/ForgetPasswordService/ForgotPasswordService";


export default function StepAuthentication({ location }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [userData, setUserData] = useState({ email: null });
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown
  const [resendDisabled, setResendDisabled] = useState(true);
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const submitHandler = (e) => {
    if(e){
    e.preventDefault();
    // setShowAlert(prevState => ({...prevState,show:false}));
    postDataa(userData).then((res) => {
      if (res.status == 200) {
        if (res.data.status === 1) {
          history.push({
            pathname: `/${_base}/reset-password`,
            state: { email: userData.email, otp: userData.otp },
          });
        } else {
          setNotify();
          setNotify({ type: "danger", message: res.data.message });
        }
      }
    });
  }
  };

  const submitOtpHandler = (e) => {
    e.preventDefault();
    setNotify(null)
    postData(userData).then((res) => {
      if (res.status == 200) {
        if (res.data.status === 1) {
          setNotify({type: 'success', message:res.data.message});

        } else {
            setNotify({type: 'danger', message:res.data.message});
        }
      } else {
        setNotify();
        setNotify({type: 'danger', message:"Request Error"});
      }
    });
  };
  const handleResendClick = () => {
    // Implement the logic to resend the verification code here
    // For now, let's just simulate a success message
    setNotify({ type: "success", message: "New code sent successfully." });
    setResendDisabled(true);
  };


  useEffect(() => {
    if (location && location.state) {
      setUserData((prevState) => ({
        ...prevState,
        email: location.state.email,
      }));
    }
  }, []);
  useEffect(() => {
    // Countdown logic
    let timer = null;
    if (resendTimer > 0 && resendDisabled) {
      timer = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
      setResendTimer(60);
    }

    return () => clearInterval(timer);
  }, [resendTimer, resendDisabled]);

  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      {notify && <Alert alertData={notify} />}
      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form onSubmit={submitHandler} className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center mb-1 mb-lg-5">
            <img src={GoogleImg} className="w240 mb-4" alt="" />
            <h1>Verification</h1>
            <span>
              We sent a verification code. Enter the code you received in the
              field below.
            </span>
          </div>
          <div className="col">
            <div className="mb-2">
              <input
                type="text"
                className="form-control form-control-lg text-center"
                placeholder="Enter OTP"
                onChange={changeHandler}
                required
                name="otp"
                id="otp"
                maxLength={6}
                onKeyPress={(e) => {
                  Validation.NumbersOnly(e);
                }}
              />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className="btn btn-lg btn-block btn-light lift text-uppercase"
            >
              Verify Me
            </button>
          </div>
          </form>
          
          <div className="col-12 text-center mt-4">
              Haven't received it?..
            <span className="text-muted">
              {resendDisabled ? (
                `Resend the code in ${resendTimer} seconds.`
              ) : (
                <button
                type="submit"
                onClick={e=>{handleResendClick(e);submitOtpHandler(e)}}
                  style={{ border: "none", background: "none" }}
                  className="text-secondary"
                >
                  Resend a new code.
                </button>
              )}
            </span>
          </div>
      </div>
    </div>
  );
}
