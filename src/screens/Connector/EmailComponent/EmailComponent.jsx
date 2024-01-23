import React, { useEffect, useState } from "react";
import EmailService from "../../../services/ConnectorService/EmailService";
import { useLocation } from "react-router-dom";

const EmailComponent = () => {
  const location = useLocation()

  const [showAlert, setShowAlert] = useState({
    show: false,
    type: null,
    message: null,
  });

  const [data, setData] = useState(null);

  const loadData = async () => {
    const tempData = [];
    await new EmailService().getEmailVendors().then((res) => {
      if (res.status === 200) {
        const data = res.data.data.EMAIL;
        setData(data);
      }
    });
  };

  const handleActive = async (id,type) => {
    await new EmailService().activeVendor(id,'EMAIL',type).then((res) => {
      if (res.status === 200) {
        const data = res.data.data.EMAIL;
        setData(data);
      }
    });
  }

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setShowAlert(location.state.alertData);
    }
  }, []);
  return (
    <>
    <div className="card">
        <div className="card-header d-flex justify-content-between bg-transparent 
        border-bottom-0">
            <h2 className="mb-0 fw-bold ">EMAIL</h2>         
        </div>
    </div>
      <div className="row g-3 gy-5 py-3 row-deck">
        {data && data.map(function (item, i) {
          return (
            <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6" key={i}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mt-1">
                    <div className="lesson_name">
                      {/* <div className="project-block light-info-bg">
                    <i className="icofont-paint"></i>
                  </div> */}
                      {/* <span className="small text-muted project_name fw-bold">
                        {item.name}
                      </span> */}
                      <h6 className="mb-0 fw-bold  fs-6  mb-2">{item.name}</h6>
                    </div>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic outlined example"
                    >
                       {item.isDefault == 1 ? (
                          <button
                          type="button"
                          className="btn btn-danger"
                          data-bs-toggle="modal"
                          data-bs-target="#editproject"
                          onClick={() => handleActive(item.id, 'Deactive')}
                        >
                          Deactive
                        </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#editproject"
                            onClick={() => handleActive(item.id, 'Active')}
                          >
                            Active
                          </button>
                        )}
                    </div>
                  </div>
                  {/* <div className="d-flex align-items-center">
                    <div className="avatar-list avatar-list-stacked pt-2">
                      <img
                        className="avatar rounded-circle sm"
                        src="assets/images/xs/avatar2.jpg"
                        alt=""
                      />
                      <img
                        className="avatar rounded-circle sm"
                        src="assets/images/xs/avatar1.jpg"
                        alt=""
                      />
                      <img
                        className="avatar rounded-circle sm"
                        src="assets/images/xs/avatar3.jpg"
                        alt=""
                      />
                      <img
                        className="avatar rounded-circle sm"
                        src="assets/images/xs/avatar4.jpg"
                        alt=""
                      />
                      <img
                        className="avatar rounded-circle sm"
                        src="assets/images/xs/avatar8.jpg"
                        alt=""
                      />
                      <span
                        className="avatar rounded-circle text-center pointer sm"
                        data-bs-toggle="modal"
                        data-bs-target="#addUser"
                      >
                        <i className="icofont-ui-add"></i>
                      </span>
                    </div>
                  </div>
                  <div className="row g-2 pt-4">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icofont-paper-clip"></i>
                        <span className="ms-2">5 Attach</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icofont-sand-clock"></i>
                        <span className="ms-2">4 Month</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icofont-group-students "></i>
                        <span className="ms-2">5 Members</span>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <i className="icofont-ui-text-chat"></i>
                        <span className="ms-2">10</span>
                      </div>
                    </div>
                  </div>
                  <div className="dividers-block"></div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h4 className="small fw-bold mb-0">Progress</h4>
                    <span className="small light-danger-bg  p-1 rounded">
                      <i className="icofont-ui-clock"></i> 35 Days Left
                    </span>
                  </div>
                  <div className="progress" style={{ height: `8px` }}>
                    <div
                      className="progress-bar bg-secondary"
                      role="progressbar"
                      style={{ width: `25%` }}
                      aria-valuenow="15"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                    <div
                      className="progress-bar bg-secondary ms-1"
                      role="progressbar"
                      style={{ width: `25%` }}
                      aria-valuenow="30"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                    <div
                      className="progress-bar bg-secondary ms-1"
                      role="progressbar"
                      style={{ width: `10%` }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default EmailComponent;
