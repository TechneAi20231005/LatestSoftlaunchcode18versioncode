import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import Select from 'react-select';

// // staic import
import { _base, userSessionData } from '../../settings/constants';
import Alert from './Alert';
import UserService from '../../services/MastersService/UserService';
import {
  getNotification,
  markedReadNotification,
  getAllmarkAllAsReadNotification
} from '../../services/NotificationService/NotificationService';
import TenantService from '../../services/MastersService/TenantService';
import ManageMenuService from '../../services/MenuManagementService/ManageMenuService';
import DemoProfileImg from '../../assets/images/profile_av.png';
import './style.scss';

export default function Header() {
  // // initial state
  const userId = userSessionData.userId;

  // // local state
  const [tenantId, setTenantId] = useState();
  const [tenantDropdown, setTenantDropdown] = useState();
  const [showDropdown, setShowDropdown] = useState();
  const [notify, setNotify] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(null);

  // // all handler
  const loadNotifcation = () => {
    getNotification().then((res) => {
      if (res.status === 200) {
        setNotifications([]);

        if (res.data.data !== null) {
          if (res?.data?.data?.result) {
            var length = res.data.data.result.length;
            var height = 0;
            setNotifications(res.data.data.result);

            if (parseInt(length) > 0 && parseInt(length) <= 5) {
              height = 100;
            }
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
    localStorage.clear();
    window.location.href = `${process.env.PUBLIC_URL}/`;
  }

  const handleMarkAllNotification = (e) => {
    getAllmarkAllAsReadNotification(userId).then((res) => {
      loadNotifcation();
    });
  };

  const loadData = async (e) => {
    new UserService().getUserById(localStorage.getItem('id')).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setTenantId(res.data.data.tenant_id);
          res.data.data.profile_picture =
            'http://3.108.206.34/TSNewBackend/' + res.data.data.profile_picture;
          setData(res.data.data);
        }
      }
    });
    new TenantService().getTenant().then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        const temp = res.data.data.filter((d) => d.is_active == 1);
        setTenantDropdown(
          temp.map((d) => ({ value: d.id, label: d.company_name }))
        );
      }
    });
    await new ManageMenuService()
      .getRole(localStorage.getItem('role_id'))
      .then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          const temp = res.data.data.filter((d) => d.menu_id === 33);

          if (temp[0]?.can_read === 1) {
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
          }
        }
      });
  };

  const handleTenantLogin = async (e) => {
    const form = { tenant_id: e.value };
    await new TenantService().switchTenant(form).then((res) => {
      if (res.status === 200 && res.data.status === 1) {
        setNotify({ type: 'success', message: res.data.message });
        setTimeout(() => {
          window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
        }, 1000);
      } else {
        setNotify({ type: 'danger', message: res.data.message });
      }
    });
  };

  // // life cycle
  useEffect(() => {
    loadData();
    const interval = setInterval(loadNotifcation(), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header">
      <nav className="navbar pt-4">
        <div className="container-xxl">
          {notify && <Alert alertData={notify} />}

          {/* hamburger menu */}
          <button
            className="navbar-toggler p-0 border-0 menu-toggle"
            onClick={() => {
              var side = document.getElementById('mainSideMenu');
              if (side) {
                if (side.classList.contains('open')) {
                  side.classList.remove('open');
                } else {
                  side.classList.add('open');
                }
              }
            }}
          >
            <i className="fa fa-bars" />
          </button>

          <div className="d-flex gap-2 align-items-center">
            {/* notification and modal */}
            <Dropdown
              className="notifications"
              onClick={() => {
                loadNotifcation();
              }}
            >
              <Dropdown.Toggle
                as="a"
                className="nav-link dropdown-toggle pulse "
              >
                <i className="icofont-alarm fs-4 text-primary">
                  <span className="notification_count">
                    {notifications?.length}
                  </span>
                </i>
                <span className="pulse-ring"></span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="rounded-lg shadow border-0 dropdown-animation p-0">
                <div className="card border-0">
                  <div className="card-header border-0 p-3">
                    <h5 className="d-flex justify-content-between mb-0 ">
                      <span>Notifications : 'View All Notifications</span>
                      <span className="badge text-white">
                        {notifications?.length || 0}
                      </span>
                    </h5>
                  </div>
                  <div className="card-body">
                    <ul className="list-unstyled list mb-0">
                      {notifications?.map((ele, index) => {
                        const date = ele.created_at.split(' ')[0];
                        const time = ele.created_at.split(' ')[1];

                        return (
                          <li className="py-2 border-bottom" key={index}>
                            {ele.url ? (
                              <Link
                                to={`/${_base}/${ele.url}`}
                                onClick={(e) =>
                                  handleReadNotification(e, ele.id)
                                }
                                className="fw-bold"
                              >
                                <span className="badge bg-primary p-2">
                                  Date : {date}
                                </span>
                                <span className="badge bg-danger p-2 ms-2">
                                  Time : {time}
                                </span>
                                <br />
                                {ele.message}
                              </Link>
                            ) : (
                              <p
                                className="fw-bold mb-0"
                                onClick={(e) =>
                                  handleReadNotification(e, ele.id)
                                }
                              >
                                {ele.message}
                                {date}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="row m-0">
                    <Link
                      to={`/${_base}/Notification`}
                      className={`col-6 card-footer text-center border-top-0 text-light bg-info`}
                    >
                      View All Notifications
                    </Link>
                    <button
                      className="btn btn-light col-6 ms-0"
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

            {/* profile and modal */}
            <Dropdown
              className="dropdown-animation dropdown d-flex align-items-center"
              style={{ zIndex: 200 }}
            >
              <p className="mb-0 text-end line-height-sm fw-bolder me-2 d-none d-sm-block">
                {`${localStorage.getItem('first_name')} ${localStorage.getItem(
                  'last_name'
                )}`}
              </p>
              <Dropdown.Toggle
                as="a"
                className="nav-link dropdown-toggle pulse p-0"
              >
                <img
                  className="avatar lg rounded-circle img-thumbnail"
                  src={data?.profile_picture || DemoProfileImg}
                  alt="profile"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow border-0 dropdown-animation mt-5">
                <div className="card border-0 w280">
                  <div className="card-body pb-0">
                    {tenantDropdown && tenantId && showDropdown === true && (
                      <Select
                        placeholder={
                          <span className="fw-bold ">Switch Tenant...</span>
                        }
                        name="tenant_id"
                        options={tenantDropdown}
                        onChange={handleTenantLogin}
                        defaultValue={tenantDropdown.filter(
                          (d) => d.value == tenantId
                        )}
                        className="mb-2"
                      />
                    )}
                    <div className="d-flex gap-2">
                      <img
                        className="avatar rounded-circle"
                        src={data?.profile_picture}
                        alt="profile"
                      />
                      <div className="flex-fill">
                        <p className="mb-0 fs-5 text-danger fw-bolder">
                          {`${localStorage.getItem(
                            'first_name'
                          )} ${localStorage.getItem('last_name')}`}
                        </p>
                        <small className="">
                          {localStorage.getItem('email_id')}
                        </small>

                        <Link
                          to={`/${_base}/Profile`}
                          data-toggle="dropdown"
                          onClick={() => {
                            setShow(!show);
                          }}
                          className="d-block fw-bolder"
                        >
                          Your Profile
                        </Link>
                      </div>
                    </div>
                    <hr className="dropdown-divider border-dark" />
                  </div>
                  <div className="list-group m-1">
                    <button
                      type="button"
                      className="list-group-item list-group-item-action border-0"
                      onClick={handleLogout}
                    >
                      <i className="icofont-sign-out fs-5 me-3" />
                      <b className="fs-6">Sign Out</b>
                    </button>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </nav>
    </div>
  );
}
