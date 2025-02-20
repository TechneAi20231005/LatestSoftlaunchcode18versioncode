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
import { Field, Form, Formik, ErrorMessage } from 'formik';

import { getRoles } from '../../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';
import { moduleMasterValidation } from './validation/ModuleMaster';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils';

export default function CreateModuleComponent({ match }) {
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 21)
  );
  const initialValue = {
    project_id: '',
    module_name: '',
    description: '',
    remark: ''
  };

  const history = useNavigate();

  const handleForm = async (values, { setSubmitting }) => {
    setSubmitting(true);

    // e.preventDefault();
    // const formData = new FormData(e.target);
    const formData = new FormData();
    formData.append('project_id', values.project_id);
    formData.append('module_name', values.module_name);
    formData.append('description', values.description);
    formData.append('remark', values.remark);

    try {
      const res = await new ModuleService().postModule(formData);
      if (res.status === 200) {
        if (res.data.status === 1) {
          setTimeout(() => {
            history({ pathname: `/${_base}/Module` });
          }, 500);
          toast.success(res.data.message);
          // history(
          //   {
          //     pathname: `/${_base}/Module`
          //   },
        } else {
          toast.error(res.data.message);
        }
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
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
      <PageHeader headerTitle="Add Module" />

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <Formik
            initialValues={initialValue}
            validationSchema={moduleMasterValidation}
            onSubmit={(values, { setSubmitting }) => {
              handleForm(values, { setSubmitting });
            }}
          >
            {({ isSubmitting }) => (
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
                        {/* <Field
                    as={ProjectDropdown}
                    id="project_id"
                    name="project_id"
                  /> */}
                        <Field name="project_id">
                          {({ field, form }) => (
                            <ProjectDropdown
                              field={field}
                              form={form}
                              id="project_id"
                            />
                          )}
                        </Field>
                        {/* <ErrorMessage
                    name="project_id"
                    component="div"
                    className="text-danger"
                  /> */}
                      </div>
                    </div>

                    <div className="form-group row mt-2">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Module Name : <span style={{ color: 'red' }}>*</span>
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="module_name"
                          name="module_name"
                          onKeyPress={(e) => {
                            Validation.addressFieldOnly(e);
                          }}
                        />
                        <ErrorMessage
                          name="module_name"
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
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-sm btn-primary"
                  >
                    Submit
                  </button>
                  <Link
                    to={`/${_base}/Module`}
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
    </div>
  );
}
