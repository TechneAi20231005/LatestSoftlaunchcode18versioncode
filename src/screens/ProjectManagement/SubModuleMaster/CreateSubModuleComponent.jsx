import React, { useCallback, useEffect, useState } from 'react';
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

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { ErrorMessage, Field, Formik, Form } from 'formik';
import { SubModuleMasterValidation } from './Validation/SubModuleMasterValidation';
import { ProjectDropdown } from '../ProjectMaster/ProjectComponent';

export default function CreateModuleComponent({ match }) {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 22)
  );

  const [Projectdropdown, setProjectdropdown] = useState(null);

  const [modules, setModules] = useState(null);
  const [modulesDropdown, setModulesDropdown] = useState(null);

  const initialValue = {
    project_id: '',
    module_id: '',
    sub_module_name: '',
    description: '',
    remark: ''
  };

  // const handleChange = (e) => {
  //   setModulesDropdown(
  //     modules &&
  //       modules
  //         .filter((d) => d.project_id === e.value)
  //         .map((d) => ({ value: d.id, label: d.module_name }))
  //   );
  // };
  const handleChange = (e) => {
    const selectedValue = e.target.value; // Get the selected project ID

    setModulesDropdown(
      modules
        ?.filter((d) => d.project_id === parseInt(selectedValue, 10)) // Filter by project_id
        .map((d) => ({ value: d.id, label: d.module_name })) || [] // Map to dropdown options
    );
  };

  // const handleForm = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.target);
  //   setNotify(null);
  const handleForm = async (values) => {
    // e.preventDefault();
    // const formData = new FormData(e.target);
    const formData = new FormData();
    formData.append('project_id', values.project_id);
    formData.append('module_id', values.module_id);
    formData.append('sub_module_name', values.sub_module_name);

    formData.append('description', values.description);
    formData.append('remark', values.remark);
    setNotify(null);
    await new SubModuleService()
      .postSubModule(formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
              setTimeout(() => {
                history({pathname:`/${_base}/SubModule`})
              }, 500);
              setNotify({ type: 'success', message: res.data.message });
            // history(
            //   {
            //     pathname: `/${_base}/SubModule`
            //   },
            //   {
            //     state: { alert: { type: 'success', message: res.data.message } }
            //   }
            // );
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

  const loadData = useCallback(async () => {
    await new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setProjectdropdown(
            res.data.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.project_name }))
          );
        }
      }
    });

    dispatch(getRoles());

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          setModules(res.data.data.data.filter((d) => d.is_active === 1));
        }
      }
    });
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Add Sub-Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <Formik
            initialValues={initialValue}
            validationSchema={SubModuleMasterValidation}
            onSubmit={(values) => {
              handleForm(values);
              // setOtpModal(true);
            }}
            // onSubmit={handleForm}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <div className="card mt-2">
                  <div className="card-body">
                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Project :{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field
                          as="select"
                          className="form-control form-control-sm"
                          id="project_id"
                          name="project_id"
                          onChange={(e) => {
                            setFieldValue('project_id', e?.target?.value);
                            setModulesDropdown(
                              modules &&
                                modules
                                  .filter(
                                    (d) =>
                                      d.project_id === parseInt(e.target.value)
                                  )
                                  .map((d) => ({
                                    value: d.id,
                                    label: d.module_name
                                  }))
                            );
                          }} // Call handleChange on selection
                        >
                          <option value="" label="Select a project" />
                          {Projectdropdown?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="project_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Module :{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field
                          as="select"
                          className="form-control form-control-sm"
                          id="module_id"
                          name="module_id"
                        >
                          <option value="" label="Select a module" />
                          {modulesDropdown?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="module_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Sub Module Name :{' '}
                          <span style={{ color: 'red' }}>*</span>
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="sub_module_name"
                          name="sub_module_name"
                          // onKeyPress={(e) => {
                          //   Validation.addressFieldOnly(e);
                          // }}
                        />
                        <ErrorMessage
                          name="sub_module_name"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Description : <span style={{ color: 'red' }}>*</span>
                        </b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                          as="textarea"
                          className="form-control form-control-sm"
                          id="description"
                          name="description"
                          rows="6"
                          // onKeyPress={(e) => {
                          //   Validation.addressFieldOnly(e);
                          // }}
                        />
                        <ErrorMessage
                          name="description"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Remark:</b>
                      </label>
                      <div className="col-sm-10">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                        />
                        <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3" style={{ textAlign: 'right' }}>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    // disabled={isSubmitting}
                  >
                    Submit
                  </button>
                  <Link
                    to={`/${_base}/SubModule`}
                    className="btn btn-sm btn-danger text-white"
                  >
                    Cancel
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* {notify && <Alert alertData={notify} />}

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

            </div>


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
      </div> */}
    </div>
  );
}
