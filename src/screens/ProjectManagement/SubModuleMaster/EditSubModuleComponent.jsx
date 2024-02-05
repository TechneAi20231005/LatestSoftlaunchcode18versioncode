import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SubModuleService from "../../../services/ProjectManagementService/SubModuleService";
import ProjectService from "../../../services/ProjectManagementService/ProjectService";
import ModuleService from "../../../services/ProjectManagementService/ModuleService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import Alert from "../../../components/Common/Alert";
import PageHeader from "../../../components/Common/PageHeader";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import {
  getSubModuleById,
  updatesubModuleMaster,
} from "./SubModuleMasterAction";
import { filterModuleAccordingToProject } from "../ModuleMaster/ModuleSlice";
import SubModuleMasterSlice, { submoduleSlice } from "./SubModuleMasterSlice";
import ModuleSlice, { moduleSlice } from "../ModuleMaster/ModuleSlice";
import { moduleMaster } from "../ModuleMaster/ModuleAction";

export default function EditModuleComponent({ match }) {
  const history = useNavigate();
  const navigate = useNavigate();
  const data = useSelector( (SubModuleMasterSlice) =>SubModuleMasterSlice.subModuleMaster.getSubModuleById );

  const filteredModule = useSelector( (moduleSlice) => moduleSlice.moduleMaster.filteredModuleAccordingToProject);


  const dispatch = useDispatch();

  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const subModuleId = id;

  // const [data, setData] = useState(null);

  const [project, setProject] = useState(null);
  const [Projectdropdown, setProjectdropdown] = useState(null);

  const [modules, setModules] = useState(null);
  // const [modulesDropdown, setModulesDropdown] = useState(null);

  const roleId = sessionStorage.getItem("role_id");

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 22)
  );

  const handleChangevalue = (e) => {

    dispatch(filterModuleAccordingToProject(e));
  };

  const loadData = async () => {
    dispatch(getSubModuleById({ id: subModuleId }));

    // const data = [];
    // await new SubModuleService().getSubModuleById(subModuleId)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       const data = res.data.data;
    //       if (data) {
    //         setData(null);
    //         setData(data);
    //       }
    //     } else {
    //       new ErrorLogService().sendErrorLog(
    //         "SubModule",
    //         "Get_SubModule",
    //         "INSERT",
    //         res.message
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     const { response } = error;
    //     const { request, ...errorObject } = response;
    //     new ErrorLogService().sendErrorLog(
    //       "SubModule",
    //       "Get_SubModule",
    //       "INSERT",
    //       errorObject.data.message
    //     );
    //   });

    await new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setProject(res.data.data.filter((d) => d.is_active === 1));
          setProjectdropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.project_name }))
          );
        }
      }
    });

    dispatch(moduleMaster());

    // await new ModuleService().getModule().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       setModules(res.data.data.filter((d) => d.is_active === 1));
    //       setModulesDropdown(
    //         res.data.data &&
    //           res.data.data
    //             .filter((d) => d.is_active === 1)
    //             .map((d) => ({ value: d.id, label: d.module_name }))
    //       );
    //     }
    //   }
    // });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // setNotify(null);
    dispatch(
      updatesubModuleMaster({ id: subModuleId, payload: formData })
    ).then((res) => {
      if (res.payload.data.status == 1 && res.payload.status == 200) {
        navigate(`/${_base}/SubModule`);
      }
    });

    // await new SubModuleService()
    //   .updateSubModule(subModuleId, formData)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       if (res.data.status === 1) {
    //         history(
    //           {
    //             pathname: `/${_base}/SubModule`,
    //           },
    //           {
    //             state: {
    //               alert: { type: "success", message: res.data.message },
    //             },
    //           }
    //         );
    //       } else {
    //         setNotify({ type: "danger", message: res.data.message });
    //       }
    //     } else {
    //       setNotify({ type: "danger", message: res.message });
    //       new ErrorLogService().sendErrorLog(
    //         "SubModule",
    //         "Create_SubModule",
    //         "INSERT",
    //         res.message
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     const { response } = error;
    //     const { request, ...errorObject } = response;
    //     setNotify({ type: "danger", message: errorObject.data.message });
    //     new ErrorLogService().sendErrorLog(
    //       "SubModule",
    //       "Create_SubModule",
    //       "INSERT",
    //       errorObject.data.message
    //     );
    //   });
  };

  useState(() => {
    loadData();

    return () => {
   
    };
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Edit Sub-Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          {data && (
            <form onSubmit={handleForm}>
              <div className="card mt-2">
                <div className="card-body">
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Project : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      {Projectdropdown && Projectdropdown && (
                        <Select
                          options={Projectdropdown}
                          id="project_id"
                          name="project_id"
                          onChange={handleChangevalue}
                          defaultValue={
                            data &&
                            Projectdropdown.filter(
                              (d) => d.value === data.project_id
                            )
                          }
                          required
                        />
                      )}
                    </div>
                  </div>
                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Select Module : <Astrick color="red" size="13px" />
                      </b>
                    </label>

                    {/* {modulesDropdown && JSON.stringify(modulesDropdown)}
                                                <hr/>
                                        {data && JSON.stringify(data)} */}

                    <div className="col-sm-4">
                      {/* <ModuleDropdown
                                                id="module_id"
                                                name="module_id"
                                                required
                                                projectId={data.project_id}
                                                defaultValue={data.module_id}
                                                onChange={handleDependent}
                                            /> */}
                      {filteredModule && (
                        <Select
                          options={filteredModule}
                          id="module_id"
                          name="module_id"
                          required
                          defaultValue={
                            data &&
                            filteredModule &&
                            filteredModule.filter(
                              (d) => d.value === data.module_id
                            )
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group row mt-2">
                    <label className="col-sm-2 col-form-label">
                      <b>
                        Sub Module Name : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="sub_module_name"
                        name="sub_module_name"
                        required={true}
                        defaultValue={data.sub_module_name}
                        onKeyPress={(e) => {
                          Validation.CharactersOnly(e);
                        }}
                      />
                    </div>
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
                        required={true}
                        defaultValue={data.description}
                        onKeyPress={(e) => {
                          Validation.CharactersOnly(e);
                        }}
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
                {/* CARD BODY */}
              </div>
              {/* CARD */}

              <div className="mt-3" style={{ textAlign: "right" }}>
                {checkRole && checkRole[0]?.can_update === 1 ? (
                  <button type="submit" className="btn btn-sm btn-primary">
                    Update
                  </button>
                ) : (
                  ""
                )}
                <Link
                  to={`/${_base}/SubModule`}
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
