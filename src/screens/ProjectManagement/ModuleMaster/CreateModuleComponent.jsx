import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';
import { ProjectDropdown } from '../ProjectMaster/ProjectComponent';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';

import { getRoles } from '../../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';

export default function CreateModuleComponent({ match }) {
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 21)
  );

  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setNotify(null);

    await new ModuleService()
      .postModule(formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/Module`
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
            'Module',
            'Create_Module',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        if (error.response) {
          const { response } = error;
          const { request, ...errorObject } = response || {};
          setNotify({ type: 'danger', message: errorObject.data.message });
          new ErrorLogService().sendErrorLog(
            'Module',
            'Create_Module',
            'INSERT',
            errorObject.data.message
          );
        } else {
          console.error(
            "Error object does not contain expected 'response' property:",
            error
          );
        }
      });
  };
  useEffect(() => {
    dispatch(getRoles());
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
      <PageHeader headerTitle="Add Module" />

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
                    <ProjectDropdown
                      id="project_id"
                      name="project_id"
                      required={true}
                    />
                  </div>
                </div>

                <div className="form-group row mt-2">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Module Name : <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="module_name"
                      name="module_name"
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

                {/* <div className="form-group row mt-3">
                                <label className="col-sm-2 col-form-label">
                                    <b>Status : </b>
                                </label>
                                <div className="col-sm-10">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_1"
                                                value="1"
                                                defaultChecked={true}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_1">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0"
                                                    readonly={true}
                                                />
                                                <label className="form-check-label" htmlFor="is_active_0">
                                                    Deactive
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
              </div>{' '}
              {/* CARD BODY */}
            </div>
            {/* CARD */}

            <div className="mt-3" style={{ textAlign: 'right' }}>
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
              <Link
                to={`/${_base}/Module`}
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
