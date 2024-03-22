


import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProjectService from "../../../services/ProjectManagementService/ProjectService";
import CustomerService from "../../../services/MastersService/CustomerService";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import Alert from "../../../components/Common/Alert";
import PageHeader from "../../../components/Common/PageHeader";

import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Select from "react-select";

import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import UserService from "../../../services/MastersService/UserService";
import { useDispatch, useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";

export default function EditProjectComponent({ match }) {
  const history = useNavigate();
  const dispatch = useDispatch()
  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const projectId = id

  const [data, setData] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [ba, setBa] = useState(null);

  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 20)
  );

  const [users, setUsers] = useState(null);
  const [projectOwners, setProjectOwners] = useState(null);

  const loadData = async () => {
    await new CustomerService().getCustomer().then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          setCustomer(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.name }))
          );
        }
      }
    });

    await new UserService().getUser().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const user = res.data.data.filter((d) => d.is_active == 1);
          const reviewers = res.data.data.filter(
            (d) => d.is_active == 1 && d.account_for == "SELF"
          );

          user.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUsers(
            user.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
            }))
          );
          setBa(
            reviewers.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name + " " + "(" + d.id + ")",
            }))
          );
        }
      }
    });
    await new ProjectService()
      .getProjectById(projectId)
      .then((res) => {
        console.log("res", res)
        if (res.status === 200) {
          const data = res.data.data;
          if (data && data.projectOwners) {
            const a = res.data.data.projectOwners.map((d) => ({
              value: d.user_id,
              label: d.employee_name,
            }));
            setProjectOwners(a);
            if (data) {
              setData(null);
              setData(data);
            }
          }
        }
      })
      .catch((error) => {
        if (error.response) {
          const { response } = error;
          const { request, ...errorObject } = response;

          // Continue handling the error as needed
          setNotify({ type: 'danger', message: errorObject.data.message });
          new ErrorLogService().sendErrorLog(
            'Project',
            'Edit_Project',
            'INSERT',
            errorObject.data.message
          );
        } else {
          console.error("Error object does not contain expected 'response' property:", error);

          // Handle cases where 'response' is not available
          // You may want to log or handle this case accordingly
        }
      });


    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
    dispatch(getRoles())
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    await new ProjectService()
      .updateProject(projectId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history({
              pathname: `/${_base}/Project`,

            }, { state: { alert: { type: "success", message: res.data.message } } }
            );
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.message });
          new ErrorLogService().sendErrorLog(
            "Project",
            "Edit_Project",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: errorObject.data.message });
        new ErrorLogService().sendErrorLog(
          "Project",
          "Edit_Project",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  const handleShowLogo = (e) => {
    var URL =
      "http://3.108.206.34/2_Testing//storage/app/Attachment/project/" +
      data.logo;
    window.open(URL, "_blank");
  };



  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Project" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <form onSubmit={handleForm}>
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Customer : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <Select
                        id="customer_id"
                        name="customer_id"
                        required={true}
                        options={customer}
                        defaultValue={
                          data
                            ? customer.filter(
                              (d) => d.value == data.customer_id
                            )
                            : ""
                        }
                      />
                    </div>

                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: "right" }}
                    >
                      <b>
                        Project Name : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="project_name"
                        name="project_name"
                        defaultValue={data ? data.project_name : null}
                        required={true}
                        onKeyPress={(e) => {
                          Validation.addressFieldOnly(e);
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Owner : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {users && (
                        <Select
                          options={users}
                          id="project_owner"
                          name="project_owner[]"
                          isMulti={true}
                          required={true}
                          defaultValue={data.projectOwners.map((d) => ({
                            value: d.user_id,
                            label: d.employee_name,
                          }))}
                        />
                      )}
                    </div>
                    {console.log("data", data)}
                    <label
                      className="col-sm-2 col-form-label"
                      style={{ textAlign: "right" }}
                    >
                      <b>Project Logo : </b>
                    </label>
                    <div className="col-sm-2">
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        id="logo"
                        name="logo"
                        accept="image/*"
                      />
                      <p>{data.logo}</p>
                      {data && data.logo != "" && (
                        <i
                          onClick={handleShowLogo}
                          className="icofont-eye-alt"
                          style={{
                            position: "absolute",
                            right: "5rem",
                            top: "4.8rem",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ fontStyle: "italic", color: "blue" }}>
                            Click to view logo
                          </span>
                        </i>
                      )}
                    </div>
                  </div>
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>Reviewer: </b>
                    </label>
                    {ba && (
                      <div className="col-sm-4">
                        <Select
                          id="project_reviewer"
                          name="project_reviewer[]"
                          options={ba}
                          isMulti={true}
                          defaultValue={data.projectReviewer.map((d) => ({
                            value: d.user_id,
                            label: d.employee_name,
                          }))}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group row mt-2">
                    <label htmlFor="" className="col-sm-2 col-form-label">
                      <b>
                        Description : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        className="form-control form-control-sm"
                        id="description"
                        name="description"
                        rows="6"
                        defaultValue={data ? data.description : null}
                        required={true}
                        onKeyPress={(e) => {
                          Validation.addressFieldOnly(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>GIT Project URL : </b>
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="git_url"
                        name="git_url"
                        defaultValue={data ? data.git_url : null}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>API Document Link : </b>
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="api_document_link"
                        name="api_document_link"
                        defaultValue={data ? data.api_document_link : null}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>Remark: </b>
                    </label>
                    <div className="col-sm-10">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="remark"
                        name="remark"
                        defaultValue={data ? data.remark : null}
                      />
                    </div>
                  </div>

                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>Status : </b>
                    </label>
                    <div className="col-sm-10">
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              value="1"
                              defaultChecked={
                                data && data.is_active == 1 ? true : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_1"
                            >
                              Active
                            </label>
                          </div>
                        </div>
                        <div className="col-md-1">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_0"
                              value="0"
                              defaultChecked={
                                data && data.is_active == 0 ? true : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_0"
                            >
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>{" "}
              </div>

              <div className="mt-3" style={{ textAlign: "right" }}>
                {checkRole && checkRole[0]?.can_update === 1 ? (
                  <button type="submit" className="btn btn-sm btn-primary">
                    Update
                  </button>
                ) : (
                  ""
                )}
                <Link
                  to={`/${_base}/Project`}
                  className="btn btn-sm btn-danger text-white"
                >
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}







