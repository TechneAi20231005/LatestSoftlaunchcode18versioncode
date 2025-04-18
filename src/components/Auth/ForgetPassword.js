import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoogleImg from '../../assets/images/forgot-password.svg';
import { postData } from '../../services/ForgetPasswordService/ForgotPasswordService';
import * as Validation from '../Utilities/Validation';
import Alert from '../Common/Alert';
import { _base } from '../../settings/constants';
import UserService from '../../services/MastersService/UserService';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils';

export default function ForgetPassword() {
  const history = useNavigate();
  const [emailCount, setEmailCount] = useState(null);
  const [count] = useState(null);
  const [userData, setUserData] = useState({ email: null });
  const [submitting, setSubmitting] = useState(false);
  const loadData = useCallback(async () => {
    var temp = [];
    var count = 0;
    await new UserService()
      .getUser()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            temp = res.data.data;
            for (var i = 0; i < temp.length; i++) {
              if (temp[i].email_id === userData.email) {
                count = count + 1;
              }
            }
            setEmailCount(count);
          } else {
            toast.error(res.data.message);
          }
        } else {
          toast.error(res.message);
        }
      })
      .catch((error) => errorHandler(error));
  }, [userData.email]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    setEmailCount(count);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await postData(userData);
      if (res.status === 200) {
        if (res.data.status === 1) {
          history(
            {
              pathname: `/${_base}/otp`
            },
            { state: { email: userData.email } }
          );
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error('Request Error');
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [emailCount, loadData]);

  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div
        className="w-100 p-3 px-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: '32rem' }}
      >
        <form onSubmit={submitHandler} className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center mb-1 mb-lg-5">
            <img src={GoogleImg} className="w240 mb-4" alt="" />
            <h1>Forgot password?</h1>
            <span>
              Enter the email address you used when you joined and we'll send
              you instructions to reset your password.
            </span>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <label className="form-label">
                <b>Email address or Contact Number:</b>
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                required
                name="email"
                id="email"
                onChange={changeHandler}
                onKeyPress={(e) => {
                  Validation.CharactersNumbersSpeicalOnly(e);
                }}
              />
            </div>
            {emailCount > 1 && (
              <div className="mt-2">
                <label className="form-label">Username:</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  required
                  name="username"
                  id="username"
                />
              </div>
            )}
          </div>
          <div className="col-12 text-center mt-4">
            <button
              disabled={submitting}
              type="submit"
              onClick={(e) => {
                if (
                  emailCount > 1 &&
                  document.getElementById('username').value === ''
                ) {
                  alert(
                    'This email-id is registered more than ' +
                      emailCount +
                      ' times Please enter your Username'
                  );
                  e.preventDefault();
                }
              }}
              className="btn btn-lg btn-block btn-light lift text-uppercase"
            >
              SUBMIT
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
