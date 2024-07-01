import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { Spinner, Modal } from 'react-bootstrap';
import Alert from '../../components/Common/Alert';
import { _attachmentUrl, _base, attachmentUrl } from '../../settings/constants';
import ProfileImg from '../../assets/images/profile_av.png';
import UserService from '../../services/MastersService/UserService';
import * as Validation from '../../components/Utilities/Validation';
import InputGroup from 'react-bootstrap/InputGroup';

function Profile() {
  const [state, setState] = useState(null);

  const [inputState, setInputState] = useState({
    firstNameErr: '',
    middleNameErr: '',
    lastNameErr: '',
    emailErr: '',
    userNameErr: '',
    contactNoErr: '',
    whatsappErr: '',
    passwordErr: '',
    confirmed_PassErr: '',
    roleErr: '',
    designationErr: '',
    departmentErr: ''
  });
  const history = useNavigate();
  const [notify, setNotify] = useState();
  const [data, setData] = useState();
  const comm = ['EMAIL', 'WHATS_APP', 'SMS'];

  const [whatsapp, setWhatsapp] = useState(false);

  const [password, setPassword] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [passwordShown1, setPasswordShown1] = useState(false);
  const togglePasswordVisiblity1 = () => {
    setPasswordShown1(passwordShown1 ? false : true);
  };
  const handleConfirmedPassword = (event) => {
    if (event.target.value == password) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  };

  const [passwordError, setPasswordError] = useState(null);
  const [passwordValid, setPasswordValid] = useState(false);
  const handlePasswordValidation = (e) => {
    if (e.target.value === '') {
      setInputState({ ...state, passwordErr: 'Please Select Password' });
    } else {
      setInputState({ ...state, passwordErr: '' });
    }
    setPassword(e.target.value);
    const passwordValidation = e.target.value;
    if (passwordValidation.length > '12') {
      setPasswordError('Enter Password min. 6 & max. 12');
      setPasswordValid(true);
    } else if (passwordValidation.length < '6') {
      setPasswordError('Enter Password min. 6 & max. 12');
      setPasswordValid(true);
    } else {
      setPasswordError('');
      setPasswordValid(false);
    }
  };

  const [emailError, setEmailError] = useState(null);
  const [mailError, setMailError] = useState(false);
  const handleEmail = (e) => {
    const email = e.target.value;
    const emailRegex =
      /^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
    if (emailRegex.test(email) === false) {
      setEmailError('Invalid Email');
      setMailError(true);
    } else {
      setEmailError('');
      setMailError(false);
    }
  };

  const [contactError, setContactError] = useState(null);
  const [contactErr, setContactErr] = useState(false);
  const [contactNumber, setContactNumber] = useState(null);
  const handleContact = (e) => {
    const contactNumber = e.target.value;
    setContactNumber(contactNumber);
    if (
      contactNumber.charAt(0) == '9' ||
      contactNumber.charAt(0) == '8' ||
      contactNumber.charAt(0) == '7' ||
      contactNumber.charAt(0) == '6'
    ) {
      setContactErr(false);
      setContactError('');
    } else if (contactNumber.length === 10) {
      setContactErr(true);
      setContactError('Invalid Mobile Number');
    } else {
      setContactError('');
    }
  };

  const [whatsappError, setWhatsappError] = useState(null);
  const [whatsappValid, setWhatsappValid] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(null);
  const navigate = useNavigate();
  const handleWhatsapp = (e) => {
    const whatsappNumber = e.target.value;
    setWhatsappNumber(whatsappNumber);
    if (
      whatsappNumber.charAt(0) == '9' ||
      whatsappNumber.charAt(0) == '8' ||
      whatsappNumber.charAt(0) == '7' ||
      whatsappNumber.charAt(0) == '6'
    ) {
      setWhatsappError('');
      setWhatsappValid(false);
    } else {
      setWhatsappError('Invalid Whatsapp Number');
      setWhatsappValid(true);
    }
  };

  const handleAccountChange = async (e) => {
    e.preventDefault();
    setNotify(null);
    const formData = new FormData(e.target);
    var flag = 1;
    var a = JSON.stringify(Object.fromEntries(formData));

    if (mailError == true) {
      alert('Enter valid email');
      return false;
    } else if (contactErr == true) {
      alert('Enter valid Mobile Number');
      return false;
    } else if (confirmPasswordError == true) {
      alert('Enter valid password');
      return false;
    } else if (whatsappValid == true) {
      alert('Enter valid Whatsapp Number');
      return false;
    } else if (mailError == false || contactErr == true) {
      if (flag === 1) {
        await new UserService()
          .updateAccountDetails(localStorage.getItem('id'), formData)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status == 1) {
                const data = res.data.data;

                setNotify({ type: 'success', message: res.data.message });
                setTimeout(() => {
                  navigate(`/${_base}/Dashboard`, {
                    state: {
                      alert: { type: 'success', message: res.data.message }
                    }
                  });
                }, 3000);
              } else {
                setNotify({ type: 'danger', message: res.data.message });
              }
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          });
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    new UserService()
      .updatePasswordDetails(localStorage.getItem('id'), formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            localStorage.clear();
            // localStorage.clear();
            localStorage.setItem('message_type', 'success');
            localStorage.setItem(
              'message',
              'Password updated !!! Please login to confirm'
            );

            window.location.href = `/${_base}`;
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      });
  };

  const loadData = async (e) => {
    new UserService().getUserById(localStorage.getItem('id')).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          res.data.data.profile_picture =
            'http://3.108.206.34/TSNewBackend/' + res.data.data.profile_picture;
          setData(res.data.data);
        }
      }
    });
  };
  const fileChangedHandler = (e) => {
    let file_size = e.target.files[0].size;
    if (file_size > 2000000) {
      alert('Please select file size less than 2 MB');
      document.getElementById('profile_picture').value = '';
    }
    let a = e.target.files[0].name;
    let b = a.lastIndexOf('.');
    let imageFile = a.substring(b);
    if (imageFile == '.jpg' || imageFile == '.png' || imageFile == '.jpeg') {
    } else {
      alert('Please Upload jpg, jepg and png Image');
      document.getElementById('profile_picture').value = '';
    }
  };

  const handlePreferredComm = (e) => {
    if (e.target.value === 'WHATS_APP') {
      setWhatsapp(true);
    } else {
      setWhatsapp(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [whatsapp]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="User Profile" />

      {notify && <Alert alertData={notify} />}
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white"></div>
            <div className="card-body text-center p-0 ">
              <div
                style={{
                  height: '9.5rem',
                  backgroundImage:
                    ' linear-gradient(to top, #484c7f, #525796, #5c62ae, #666ec7, #7179e0)',
                  clipPath: 'polygon(50% 14%, 100% 2%, 100% 100%, 0 100%, 0 0)',
                  transform: 'rotateX(180deg)'
                }}
              ></div>
              <img
                className="avatar lg rounded-circle img-thumbnail"
                src={data && data.profile_picture}
                alt="profile"
                style={{
                  height: '11.375rem',
                  width: '9.375rem',
                  position: 'relative',
                  marginTop: '-6.25rem'
                }}
              />
              <div className="p-3">
                <div className="d-flex justify-content-center mt-2">
                  <h5>
                    <b>{data && data.first_name + '  ' + data.last_name}</b>
                  </h5>
                </div>

                <div
                  className="d-flex justify-content-center"
                  style={{
                    color: '#2E86C1',
                    fontSize: '1.125rem',
                    fontWeight: '500'
                  }}
                >
                  <p style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
                    {data && data.email_id}
                  </p>
                </div>

                <center>
                  <span
                    className="badge bg-primary"
                    style={{ fontSize: '0.938rem', borderRadius: '50px' }}
                  >
                    {data && data.role_name}
                  </span>
                </center>
              </div>
            </div>
          </div>

          {/* <div className="card shadow mt-2">
            <div className="card-header bg-primary text-white">
              <h5 style={{ textAlign: "center" }}>Your Departments</h5>
            </div>
            <div className="card-body text-center p-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Deparment</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.department.length > 0 &&
                    data.department.map((d, i) => {
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>
                            {d.department_name}
                            {d.is_default == 1 && (
                              <span
                                className="badge bg-success ml-1"
                                style={{ marginLeft: "0.625rem" }}
                              >
                                Default
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div> */}

          <div className="card shadow mt-2">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Your Departments</h5>{' '}
              {/* Added mb-0 class to remove margin */}
            </div>
            <div className="card-body p-0">
              {' '}
              {/* Removed unnecessary text-center class */}
              <div className="table-responsive">
                <table className="table table-bordered mb-0">
                  {' '}
                  {/* Added mb-0 class to remove margin */}
                  <thead>
                    <tr>
                      <th className="text-center">Sr</th>
                      <th className="text-center">Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.department.length > 0 &&
                      data.department.map((d, i) => (
                        <tr key={i}>
                          <td className="text-center">{i + 1}</td>{' '}
                          {/* Center align Sr column */}
                          <td>{d.department_name}</td>
                          {/* Render badge if department is default */}
                          <td className="text-center">
                            {d.is_default === 1 && (
                              <span className="badge bg-success">Default</span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5>Account Details</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAccountChange} method="post">
                <div className="deadline-form">
                  <div className="row">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="user_name"
                        name="user_name"
                        value={(data && data.user_name) || ''}
                        readOnly={true}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Profile Picture
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="profile_picture"
                        name="profile_picture"
                        accept=".jpg,.jpeg,.png"
                        onChange={fileChangedHandler}
                      />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        defaultValue={data && data.first_name}
                        required={true}
                        readOnly={true}
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        defaultValue={data && data.last_name}
                        required={true}
                        readOnly={true}
                      />
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Email Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="email_id"
                        name="email_id"
                        onChange={handleEmail}
                        defaultValue={data && data.email_id}
                        required
                      />
                    </div>
                    {emailError && (
                      <small
                        style={{
                          color: 'red',
                          position: 'absolute',
                          right: '85%'
                        }}
                      >
                        {emailError}
                      </small>
                    )}
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Contact No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contact_no"
                        name="contact_no"
                        autoComplete="off"
                        maxLength={10}
                        onChange={(e) => {
                          handleContact(e);
                        }}
                        onKeyPress={(e) => {
                          Validation.mobileNumbersOnly(e);
                        }}
                        defaultValue={data && data.contact_no}
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                      {contactError && (
                        <small style={{ color: 'red', right: '45%' }}>
                          {contactError}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Whatsapp No
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="whats_app_contact_no"
                        name="whats_app_contact_no"
                        autoComplete="off"
                        minLength={10}
                        maxLength={10}
                        onChange={handleWhatsapp}
                        onKeyPress={(e) => {
                          Validation.mobileNumbersOnly(e);
                        }}
                        defaultValue={data && data.whats_app_contact_no}
                        required={whatsapp}
                        onPaste={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          return false;
                        }}
                      />
                      {whatsappError && (
                        <small style={{ color: 'red', right: '45%' }}>
                          {whatsappError}
                        </small>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Preferred Communication :
                      </label>
                      <select
                        type="text"
                        className="form-control"
                        id="preferred_communication"
                        name="preferred_communication"
                        onChange={handlePreferredComm}
                      >
                        {comm.map((opt) => {
                          if (data && data.preferred_communication === opt) {
                            return (
                              <option value={opt} selected>
                                {opt.replace('_', ' ')}
                              </option>
                            );
                          } else {
                            return (
                              <option value={opt}>
                                {opt.replace('_', '')}
                              </option>
                            );
                          }
                        })}
                        defaultValue={data && data.preferred_communication}
                      </select>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        New Password
                      </label>
                      <InputGroup className="">
                        <input
                          className="form-control"
                          id="password"
                          name="password"
                          type={passwordShown1 ? 'text' : 'password'}
                          minLength={6}
                          maxLength={12}
                          onChange={(e) => handlePasswordValidation(e)}
                          onKeyPress={(e) => {
                            Validation.password(e);
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          onCopy={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                        />
                        <InputGroup.Text>
                          <i
                            className="bi bi-eye-fill"
                            onClick={togglePasswordVisiblity1}
                          ></i>
                        </InputGroup.Text>
                      </InputGroup>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label font-weight-bold">
                        Confirm Password
                      </label>
                      <InputGroup>
                        <input
                          type={passwordShown ? 'text' : 'password'}
                          className="form-control"
                          id="confirm_password"
                          name="confirm_password"
                          minLength={6}
                          maxLength={12}
                          onChange={handleConfirmedPassword}
                          onPaste={(e) => {
                            e.preventDefault();
                            return false;
                          }}
                          onCopy={(e) => {
                            e.preventDefault();
                            return false;
                          }}
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
                </div>

                {confirmPasswordError && (
                  <span
                    style={{ color: 'red', position: 'absolute', right: '15%' }}
                  >
                    Password Not matched
                  </span>
                )}

                <div className="mt-3" style={{ textAlign: 'right' }}>
                  <button
                    type="submit"
                    className="btn btn-primary text-white"
                    style={{ backgroundColor: '#484C7F' }}
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
