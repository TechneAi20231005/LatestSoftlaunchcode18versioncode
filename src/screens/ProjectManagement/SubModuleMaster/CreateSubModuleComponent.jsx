import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SubModuleService from '../../../services/ProjectManagementService/SubModuleService';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Select from 'react-select';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';

export default function CreateModuleComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const roleId = localStorage.getItem('role_id');
  // const [checkRole, setCheckRole] = useState(null)
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 22)
  );

  const [data, setData] = useState({ project_id: null, module_id: null });

  const [project, setProject] = useState(null);
  const [Projectdropdown, setProjectdropdown] = useState(null);

  const [modules, setModules] = useState(null);
  const [modulesDropdown, setModulesDropdown] = useState(null);

  const handleChangevalue = (e) => {
    setModulesDropdown(
      modules &&
        modules
          .filter((d) => d.project_id == e.value)
          .map((d) => ({ value: d.id, label: d.module_name }))
    );
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setNotify(null);

    await new SubModuleService()
      .postSubModule(formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/SubModule`
              },
              {
                state: { alert: { type: 'success', message: res.data.message } }
              }
            );
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.message });
          new ErrorLogService().sendErrorLog(
            'SubModule',
            'Create_SubModule',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: 'danger', message: errorObject.data.message });
        new ErrorLogService().sendErrorLog(
          'SubModule',
          'Create_SubModule',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  const loadData = async () => {
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

    dispatch(getRoles());

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //     if (res.status === 200) {

    //         if (res.data.status == 1) {
    //             const getRoleId = localStorage.getItem("role_id");
    //             setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
    //         }
    //     }
    // })

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setModules(res.data.data.filter((d) => d.is_active === 1));
        }
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader headerTitle="Add Sub-Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
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
                    <Select
                      options={Projectdropdown}
                      id="project_id"
                      name="project_id"
                      onChange={handleChangevalue}
                      required
                    />
                  </div>
                </div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Select Module :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <Select
                      options={modulesDropdown}
                      id="module_id"
                      name="module_id"
                      required
                    />
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
                      onKeyPress={(e) => {
                        Validation.addressFieldOnly(e);
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
                      onKeyPress={(e) => {
                        Validation.addressFieldOnly(e);
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
                    />
                  </div>
                </div>
              </div>{' '}
              {/* CARD BODY */}
            </div>
            {/* CARD */}

            <div className="mt-3" style={{ textAlign: 'right' }}>
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
              <Link
                to={`/${_base}/SubModule`}
                className="btn btn-sm btn-danger text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
