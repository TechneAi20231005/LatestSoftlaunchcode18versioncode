import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { _base, userSessionData } from "../../settings/constants";
import UserService from "../../services/MastersService/UserService";
import Dropdown from "react-bootstrap/Dropdown";
import Avatar1 from "../../assets/images/xs/avatar1.jpg";
import ProfileImg from "../../assets/images/profile_av.png";
import { Link } from "react-router-dom";
import {
  getNotification, markedReadNotification, getAllmarkAllAsReadNotification
} from "../../services/NotificationService/NotificationService";
import TenantService from '../../services/MastersService/TenantService'
import Select from 'react-select'
import Alert from "./Alert";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";

export default function Header() {


  const [tenantId, setTenantId] = useState()
  const [tenantDropdown, setTenantDropdown] = useState()
  const [showDropdown, setShowDropdown] = useState()

  const [notify, setNotify] = useState(null);

  const history = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationHeight, setNotificationHeight] = useState(200);
  const [refreshInterval, setRefreshInterval] = useState(5000 || 0);
  const [show, setShow] = useState(false);
  const [approvedNotifications, setApprovedNotifications] = useState()
  const userId = userSessionData.userId
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);


  const loadNotifcation = () => {
    getNotification().then((res) => {
      if (res.status === 200) {
        setNotifications(null);
        setApprovedNotifications(null)
        if(res.data.data !== null){
        if (res?.data?.data?.result) {
          var length = res.data.data.result.length;
          var height = 0;
          setNotifications(res.data.data.result);
          setApprovedNotifications(res.data.data.for_me)
          if (parseInt(length) > 0 && parseInt(length) <= 5) {
            height = 100;

          }
        }
      }
    });
  };

  const handleReadNotification = (e, id) => {
    markedReadNotification(id).then((res) => {
      loadNotifcation();
    });
  };

  function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    // window.location.reload();
    window.location.href = `${process.env.PUBLIC_URL}/`;
    // var returnValue = { show: true, type: "success", message: "Log Out !!!" };
    // history({
    //     pathname:`${process.env.PUBLIC_URL}/`,
    //     state: { showAlert: true, alertData: returnValue }
    // });
  }


  const handleMarkAllNotification = (e) => {
    getAllmarkAllAsReadNotification(userId).then((res) => {
      loadNotifcation();
    });
  };

  const [showNotificationIcon, setShowNotificationIcon] = useState(true);
  const handleShowNotificationIcon = () => {
    setShowNotificationIcon((prev) => !prev);
  };

  const [data, setData] = useState(null);
  const loadData = async (e) => {

    new UserService().getUserById(localStorage.getItem("id")).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setTenantId(res.data.data.tenant_id)
          res.data.data.profile_picture =
            "http://3.108.206.34/TSNewBackend/" +
            res.data.data.profile_picture;
          setData(res.data.data);
        }
      }
    })
    new TenantService().getTenant().then(res => {
      if (res.status === 200 && res.data.status === 1) {
        const temp = res.data.data.filter(d => d.is_active == 1)
        setTenantDropdown(
          temp.map(d => ({ value: d.id, label: d.company_name }))
        )
      }
    })
    await new ManageMenuService().getRole(sessionStorage.getItem("role_id")).then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        const temp = res.data.data.filter(d => d.menu_id === 33);
        if(temp[0]?.can_read === 1){

          setShowDropdown(true)
        } else {
          setShowDropdown(false)
        }
      }
    })
  }


  const handleTenantLogin = async (e) => {
    const form = { tenant_id: e.value }
    await new TenantService().switchTenant(form).then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        setNotify({ type: "success", message: res.data.message });
      } else {
        setNotify({ type: "danger", message: res.data.message });

      }
    })
  }
  useEffect(() => {
    loadData();
  }, [showApprovedOnly]);

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(loadNotifcation(), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval]);
  return (
    <div className="header">
      <nav className="navbar py-4">
        <div className="container-xxl">
          <div className="h-right d-flex align-items-center mr-5 mr-lg-0 order-1">
            {notify && <Alert alertData={notify} />}
            <Dropdown className="notifications" style={{ zIndex: -100 }}
              onClick={() => { loadNotifcation() }}
            >
              {showNotificationIcon && (
                <Dropdown.Toggle
                  as="a"
                  className="nav-link dropdown-toggle pulse"
                  style={{ zIndex: -200 }}
                >
                  <i className="icofont-alarm fs-4" style={{ zIndex: -100, color: "#484c7f" }}>
                    <span
                      className="notification-count"
                      style={{
                        backgroundColor: "#ff1843",
                        borderRadius: "50%",
                        position: "absolute",
                        bottom: "1.8rem",
                        right: "1rem",
                        fontWeight: "bold",
                        fontSize: "20px",
                        padding: "0.3rem",
                        color: "white",
                      }}
                    >
                      {notifications && notifications.length}
                    </span>
                  </i>
                  <span className="pulse-ring" style={{ zIndex: -100 }}></span>
                </Dropdown.Toggle>
              )}


              <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0">
                <div className="card border-0" style={{ width: '40rem' }}>
                  <div className="card-header border-0 p-3">
                    <h5 className="mb-0 font-weight-light d-flex justify-content-between">
                      <span>Notifications : {showApprovedOnly === true ? <span>Approved Only By Me</span> : <span>View All Notifications</span>}</span>
                      {notifications && (
                        <span className="badge text-white">
                          {notifications.length}
                        </span>
                      )}
                      {!notifications && (
                        <span className="badge text-white">0</span>
                      )}
                    </h5>
                  </div>
                  <div className="tab-content card-body">
                    {showApprovedOnly ? <div className="tab-pane fade show active">
                      <ul
                        className="list-unstyled list mb-0"
                        style={{ height: `${notificationHeight}px` }}
                      >
                        {approvedNotifications &&
                          approvedNotifications.length > 0 &&
                          approvedNotifications.map((ele, index) => {
                            const date = ele.created_at.split(" ")[0]
                            const time = ele.created_at.split(" ")[1]

                            return (
                              <li
                                className="py-2 mb-1 border-bottom"
                                key={index}
                              >
                                {/* <a href="#!" className="d-flex">
                                                                <img className="avatar rounded-circle" src={Avatar1} alt="" />
                                                                <div className="flex-fill ms-2">
                                                                    <p className="d-flex justify-content-between mb-0 ">
                                                                            <span className="font-weight-bold">Dylan Hunter</span> 
                                                                            <small>2MIN</small></p>
                                                                    <span className="">Added  2021-02-19 my-Task ui/ux Design 
                                                                        <span className="badge bg-success">Review</span>
                                                                    </span>
                                                                </div>
                                                            </a> */}
                                <div
                                  className="flex-fill ms-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  {ele.url && (
                                    <Link to={`/${_base}/${ele.url}`}>
                                      <p
                                        className="d-flex justify-content-between mb-0"
                                        onClick={(e) =>
                                          handleReadNotification(e, ele.id)
                                        }
                                      >
                                        <span className="font-weight-bold">
                                          <span className="fw-bold badge bg-primary p-2" >  {`Date : ${date}`}</span>
                                          <span className="fw-bold badge bg-danger p-2" style={{ marginLeft: '10px' }}>  {`Time : ${time}`}</span>
                                          <br />
                                          {ele.message}
                                        </span>

                                      </p>

                                    </Link>
                                  )}

                                  {!ele.url && (
                                    <p
                                      className="d-flex justify-content-between mb-0"
                                      onClick={(e) =>
                                        handleReadNotification(e, ele.id)
                                      }
                                    >
                                      <span className="font-weight-bold">
                                        {ele.message}{date}
                                      </span>
                                    </p>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div> :
                      <div className="tab-pane fade show active">
                        <ul
                          className="list-unstyled list mb-0"
                          style={{ height: `${notificationHeight}px` }}
                        >
                          {notifications &&
                            notifications.length > 0 &&
                            notifications.map((ele, index) => {
                              const date = ele.created_at.split(" ")[0]
                              const time = ele.created_at.split(" ")[1]

                              return (
                                <li
                                  className="py-2 mb-1 border-bottom"
                                  key={index}
                                >
                                  {/* <a href="#!" className="d-flex">
                                                                <img className="avatar rounded-circle" src={Avatar1} alt="" />
                                                                <div className="flex-fill ms-2">
                                                                    <p className="d-flex justify-content-between mb-0 ">
                                                                            <span className="font-weight-bold">Dylan Hunter</span> 
                                                                            <small>2MIN</small></p>
                                                                    <span className="">Added  2021-02-19 my-Task ui/ux Design 
                                                                        <span className="badge bg-success">Review</span>
                                                                    </span>
                                                                </div>
                                                            </a> */}
                                  <div
                                    className="flex-fill ms-2"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {ele.url && (
                                      <Link to={`/${_base}/${ele.url}`}>
                                        <p
                                          className="d-flex justify-content-between mb-0"
                                          onClick={(e) =>
                                            handleReadNotification(e, ele.id)
                                          }
                                        >
                                          <span className="font-weight-bold">
                                            <span className="fw-bold badge bg-primary p-2" >  {`Date : ${date}`}</span>
                                            <span className="fw-bold badge bg-danger p-2" style={{ marginLeft: '10px' }}>  {`Time : ${time}`}</span>
                                            <br />
                                            {ele.message}
                                          </span>

                                        </p>

                                      </Link>
                                    )}

                                    {!ele.url && (
                                      <p
                                        className="d-flex justify-content-between mb-0"
                                        onClick={(e) =>
                                          handleReadNotification(e, ele.id)
                                        }
                                      >
                                        <span className="font-weight-bold">
                                          {ele.message}{date}
                                        </span>
                                      </p>
                                    )}
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>}
                  </div>
                  {/* <div className="btn-group">
                    <Link
                      to={`/${_base}/Notification`}
                      className={`card-footer text-center border-top-0 ${
                        !showApprovedOnly ? "bg-info" : ""
                      }`}
                      onClick={() => setShowApprovedOnly(false)} // Set to false to show all notifications
                      // className="card-footer text-center border-top-0"
                    >
                      View All Notifications
                    </Link>

                    <Link
                      to={`/${_base}/ApprovedNotification`}
                      // className="card-footer text-center border-top-0 bg-info"
                      className={`card-footer text-center border-top-0 ${
                        showApprovedOnly ? "bg-info" : ""
                      }`}
                      onClick={() => setShowApprovedOnly(true)}
            
                    >
                      Approved Only By Me
                    </Link>

                    <button
                      className="btn btn-light"
                      onClick={(e) => {
                        handleMarkAllNotification(e);
                      }}
                    >
                      Mark All As Read
                    </button>
                  </div> */}

                  <div className="btn-group" style={{ border: "2px solid #ccc" }}>
                    <Link
                      to={`/${_base}/Notification`}
                      className={`card-footer text-center border-top-0 ${!showApprovedOnly ? "bg-info" : ""
                        }`}
                      onClick={() => setShowApprovedOnly(false)} // Set to false to show all notifications
                    >
                      View All Notifications
                    </Link>

                    <div style={{ borderRight: "1px solid #ccc" }}></div>

                    <Link
                      to={`/${_base}/ApprovedNotification`}
                      className={`card-footer text-center border-top-0 ${showApprovedOnly ? "bg-info" : ""
                        }`}
                      onClick={() => setShowApprovedOnly(true)}
                    >
                      Approved Only By Me
                    </Link>

                    <button
                      className="btn btn-light"
                      onClick={(e) => {
                        handleMarkAllNotification(e);
                      }}
                    >
                      Mark All As Read
                    </button>
                  </div>

                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown
              className="rounded-lg border-0 dropdown-animation dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center"
              style={{ zIndex: 200 }}
            >
              <div className="u-info me-2">
                <p className="mb-0 text-end line-height-sm ">
                  <span className="font-weight-bold">
                    {sessionStorage.getItem("first_name")}{" "}
                    {sessionStorage.getItem("last_name")}
                  </span>
                </p>
                {/* <small>Admin Profile</small> */}
              </div>
              <Dropdown.Toggle
                as="a"
                className="nav-link dropdown-toggle pulse p-0"
                style={{ zIndex: 300 }}
              >
                <img
                  className="avatar lg rounded-circle img-thumbnail"
                  src={data && data.profile_picture}
                  alt="profile"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="rounded-lg shadow border-0 dropdown-animation dropdown-menu-end"
                style={{ zIndex: 500, marginTop: "55px" }}
              >
                <div className='card border-0 w280' style={{ zIndex: 5 }}>
                  <div className='p-2' style={{ zIndex: 700 }}>
                    {tenantDropdown && tenantId && showDropdown === true && (
                      <Select

                        placeholder={<span className='fw-bold '>Switch Tenant...
                        </span>}
                        name='tenant_id'
                        options={tenantDropdown}
                        onChange={handleTenantLogin}
                        defaultValue={tenantDropdown.filter(d => d.value == tenantId)}
                      />
                    )}
                  </div>
                  <div className='card-body pb-0' style={{ zIndex: 500 }}>
                    <div className='d-flex py-1' style={{ zIndex: 500 }}>
                      <img
                        className="avatar rounded-circle"
                        src={data && data.profile_picture}
                        alt="profile"
                      />
                      <div className="flex-fill ms-3" style={{ zIndex: 100 }}>
                        <p className="mb-0">
                          <span
                            className="font-weight-bold"
                            style={{
                              fontSize: "18px",
                              zIndex: "100 !important",
                              position: "relative",
                              color: "red",
                            }}
                          >
                            {sessionStorage.getItem("first_name")}{" "}
                            {sessionStorage.getItem("last_name")}
                          </span>
                        </p>
                        <small className="">
                          {sessionStorage.getItem("email_id")}
                        </small>

                        <p className="mb-0">
                          <Link
                            to={`/${_base}/Profile`}
                            data-toggle="dropdown"
                            onClick={() => {
                              setShow(!show);
                            }}
                            className="mb-0"
                            style={{ cursor: "default" }}
                          >
                            <span className="font-weight-bold">
                              Your Profile
                            </span>
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div>
                      <hr className="dropdown-divider border-dark" />
                    </div>
                  </div>
                  <div className="list-group m-1">
                    {/* <Link to="tasks" className="list-group-item list-group-item-action border-0 "><i className="icofont-tasks fs-5 me-3"></i>My Task</Link>
                                        <Link to="members" className="list-group-item list-group-item-action border-0 "><i className="icofont-ui-user-group fs-6 me-3"></i>members</Link>
                                        <Link to="sign-in" className="list-group-item list-group-item-action border-0 "><i className="icofont-logout fs-6 me-3"></i>Signout</Link>
                                        <div><hr className="dropdown-divider border-dark" /></div> */}
                    <button
                      type="button"
                      className="list-group-item list-group-item-action border-0"
                      onClick={handleLogout}
                    >
                      <i className="icofont-sign-out fs-5 me-3"></i>{" "}
                      <span style={{ fontSize: "18px", fontWeight: "600" }}>
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <button
            className="navbar-toggler p-0 border-0 menu-toggle order-3"
            onClick={() => {
              var side = document.getElementById("mainSideMenu");
              if (side) {
                if (side.classList.contains("open")) {
                  side.classList.remove("open");
                } else {
                  side.classList.add("open");
                }
              }
            }}
          >
            <span className="fa fa-bars"></span>
          </button>

          <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
            {/* <div className="input-group flex-nowrap input-group-lg">
                            <button type="button" className="input-group-text" id="addon-wrapping"><i className="fa fa-search"></i></button>
                            <input type="search" className="form-control" placeholder="Search" aria-label="search" aria-describedby="addon-wrapping" />
                            <button type="button" className="input-group-text add-member-top" onClick={()=>{ this.setState({isAddUserModa:true }) }}><i className="fa fa-plus"></i></button>
                        </div> */}
          </div>
        </div>
      </nav>
    </div>
  );
}
