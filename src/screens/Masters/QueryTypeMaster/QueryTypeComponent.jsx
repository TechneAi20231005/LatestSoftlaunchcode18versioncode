import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import QueryTypeService from '../../../services/MastersService/QueryTypeService';
import DynamicFormService from '../../../services/MastersService/DynamicFormService';

import { Astrick } from '../../../components/Utilities/Style';
import Dropdown from 'react-bootstrap/Dropdown';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { toast } from 'react-toastify';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import { fetchQueryTypeData } from '../../Settings/CustomerMapping/Slices/CustomerMappingAction';

function QueryTypeComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 14)
  );

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [reset, setReset] = useState(false);
  const [dynamicFormDropdown, setDynamicFormDropdown] = useState(null);

  const [modalQueryGroup, setModalQueryGroup] = useState({
    showModalQueryGroup: false,
    modalDataQueryGroup: '',
    modalHeaderQueryGroup: ''
  });

  const handleModalQueryGroup = (data) => {
    setModalQueryGroup(data);
  };
  //   *********************************End Query Group*************************************
  const clearFilters = () => {
    setReset(true);
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row?.original,
                modalHeader: 'Edit Query Type'
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      enableColumnFilter: false,
      size: 120
    },
    {
      accessorFn: (originalRow) => originalRow?.query_type_name || '--',
      header: 'Query Type Name',
      size: 240,
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },
    {
      accessorFn: (originalRow) => originalRow?.form_name || '--',
      header: 'Form Name',
      size: 190
    },
    {
      accessorFn: (originalRow) => originalRow?.query_group_name,
      header: 'Query Group',
      size: 220
    },
    {
      header: 'Status',
      size: 160,
      accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active;
        return (
          <span
            className={`badge ${isActive ? 'bg-primary' : 'bg-danger'}`}
            style={{ width: '4rem' }}
          >
            {isActive ? 'Active' : 'Deactive'}
          </span>
        );
      }
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.created_at?.trim()
          ? moment(row?.original?.created_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By',
      size: 180
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.updated_at?.trim()
          ? moment(row?.original?.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    query_type_name: 'Query Type Name',
    query_group_name: 'Query Group Name',
    form_name: 'Form Name',
    is_active: 'Status',
    remark: 'Remark',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Query Type Master Record'
  };

  // **************************************Add Query Group *****************************************

  const handleFormQueryGroup = async (values, { setSubmitting }) => {
    setSubmitting(true);
    const form = new FormData();
    form.append('group_name', values.group_name);
    try {
      const res = await new QueryTypeService().postQueryGroup(form);
      if (res?.status === 200) {
        if (res?.data?.status === 1) {
          setModalQueryGroup({
            showModalQueryGroup: false,
            modalDataQueryGroup: '',
            modalHeaderQueryGroup: ''
          });

          toast.success(res?.data?.message);
          loadData();
          setSubmitting(false);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  };

  // **************************************End Add Query Group *****************************************

  // function isQueryType(queryType) {
  //   return /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(queryType);
  // }

  const { queryTypeData, queryTypeDropDownData: queryGroupDropdown } =
    useSelector((CustomerMappingSlice) => CustomerMappingSlice.customerMaster);
  const { getQueryTypeData: isLoading } = useSelector(
    (CustomerMappingSlice) => CustomerMappingSlice.customerMaster.isLoading
  );
  const loadData = useCallback(async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);

    try {
      const res = await new DynamicFormService().getDynamicForm();
      if (res?.status === 200) {
        if (res?.data?.status === 1) {
          // setShowLoaderModal(false);
          // setDynamicForm(res.data.data.filter((d) => d.is_active === 1));
          setDynamicFormDropdown(
            res?.data?.data?.data
              ?.filter((d) => d.is_active === 1)
              ?.map((d) => ({ value: d.id, label: d.template_name }))
          );
        }
      }
    } catch (error) {
      errorHandler(error);
    }
    dispatch(getRoles());
  }, [dispatch]);

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('query_type_name', values.query_type_name);
    formData.append('form_id', values.form_id);
    values?.query_group_data.forEach((item) => {
      formData?.append('query_group_data[]', item?.value);
    });
    // formData.append('query_group_data', values?.query_group_data?.map((item) => item.value));

    formData.append('remark', values.remark);
    formData.append('is_active', values.is_active);
    // e.preventDefault();
    // const form = new FormData(values);
    var flag = 1;

    if (flag === 1) {
      try {
        if (!id) {
          formData.delete('is_active');
          formData.append('is_active', 1);
          const res = await new QueryTypeService().postQueryType(formData);
          if (res?.status === 200) {
            // setShowLoaderModal(false);
            if (res?.data?.status === 1) {
              // setShowLoaderModal(false);
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              toast.success(res?.data?.message);
              loadData();
            } else {
              toast.error(res?.data?.message);
            }
          }
        } else {
          formData.delete('is_active');
          formData.append('is_active', values.is_active);
          const res = await new QueryTypeService().updateQueryType(
            id,
            formData
          );
          if (res?.status === 200) {
            // setShowLoaderModal(false);
            if (res?.data?.status === 1) {
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              toast.success(res?.data?.message);
              loadData();
            } else {
              toast.error(res?.data?.message);
            }
          } else {
            toast.error(res?.data?.message);
          }
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setSubmitting(false);
        clearFilters();
      }
    }
  };

  useEffect(() => {
    //loadData();
    dispatch(fetchQueryTypeData());
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  let valueof = modal.modalData
    ? dynamicFormDropdown?.find((d) => modal.modalData.form_id === d.value)
    : '';

  const initialValues = {
    query_type_name: modal.modalData ? modal.modalData?.query_type_name : '',
    form_id: valueof?.value || '',
    query_group_data: modal.modalData
      ? modal.modalData.query_group_data.map((d) => ({
          value: d.query_type_group_id,
          label: d.group_name
        }))
      : [],
    remark: modal.modalData?.remark || '',

    is_active: String(modal?.modalData?.is_active) ?? '1'
  };
  const fields = [
    {
      name: 'query_type_name',
      label: 'Query Type name',
      required: true,
      alphaNumeric: true,
      max: 100,
      min: 3
    },
    { name: 'form_id', label: 'Select Form', required: true },
    { name: 'query_group_data', label: 'Query Group', isObject: true },
    {
      name: 'remark',
      label: 'remark',
      required: false,
      alphaNumeric: true,
      max: 255
    }
  ];

  const validationSchema = CustomValidation(fields);

  const initialValueGroupName = {
    group_name: modalQueryGroup.modalDataQueryGroup
      ? modalQueryGroup.modalDataQueryGroup.group_name
      : '',
    is_active: String(modalQueryGroup?.modalDataQueryGroup?.is_active) ?? '1'
  };
  const fieldsGroupName = [
    {
      name: 'group_name',
      label: 'Group name',
      required: true,
      alphaNumeric: true,
      max: 100,
      min: 3
    }
  ];
  const validationSchemaGroupName = CustomValidation(fieldsGroupName);

  console.log('queryGroupDropdown', queryGroupDropdown);
  return (
    <>
      <div className="container-xxl">
        <PageHeader
          headerTitle="Query Master"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                {checkRole && checkRole[0]?.can_create === 1 ? (
                  <button
                    className="btn btn-dark btn-set-task w-sm-100"
                    onClick={() => {
                      handleModal({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add Query Type'
                      });
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add Query
                    Type
                  </button>
                ) : (
                  ''
                )}
              </div>
            );
          }}
        />

        <div className="card mt-2">
          {queryTypeData && (
            <MaterialTable
              exportDataKeys={exportDataKeys}
              isLoading={isLoading}
              data={queryTypeData}
              columns={columns}
              reset={reset}
              setReset={setReset}
            />
          )}
        </div>

        <Modal
          centered
          show={modal.showModal}
          onHide={(e) => {
            handleModal({
              showModal: false,
              modalData: '',
              modalHeader: ''
            });
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleForm(values, modal.modalData ? modal.modalData.id : '', {
                setSubmitting
              });
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">
                    {modal.modalHeader}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="deadline-form">
                    <div className="row g-3 mb-3">
                      {/* Query Type Name */}
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Query Type Name: <Astrick color="red" size="13px" />
                        </label>
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="query_type_name"
                          name="query_type_name"
                          placeholder="Enter query type"
                          // maxLength={50}
                        />
                        <ErrorMessage
                          name="query_type_name"
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      {/* Select Form */}
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Select Form: <Astrick color="red" size="13px" />
                        </label>
                        {dynamicFormDropdown && (
                          <Select
                            classNamePrefix="react-select"
                            options={dynamicFormDropdown}
                            id="form_id"
                            name="form_id"
                            defaultValue={
                              modal.modalData
                                ? dynamicFormDropdown?.find(
                                    (d) => modal.modalData.form_id === d.value
                                  )
                                : ''
                            }
                            isClearable={true}
                            onChange={(option) => {
                              if (
                                !option ||
                                Object.entries(option).length === 0
                              )
                                return;
                              setFieldValue('form_id', option?.value);
                            }}
                          />
                        )}
                        <ErrorMessage
                          name="form_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      {/* Query Group */}
                      <div className="row mt-3">
                        <div className="col-md-10">
                          <label className="form-label font-weight-bold mt-1">
                            Query Group: <Astrick color="red" size="13px" />
                          </label>
                          <Select
                            classNamePrefix="react-select"
                            options={queryGroupDropdown}
                            id="query_group_data"
                            name="query_group_data"
                            isMulti
                            value={values.query_group_data}
                            isClearable={true}
                            // value={values.query_group_data}

                            onChange={(options) => {
                              setFieldValue('query_group_data', options);
                            }}
                          />
                          <ErrorMessage
                            name="query_group_data"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                        <div className="col-md-2" style={{ marginTop: '33px' }}>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="btn btn-secondary text-white"
                              id="dropdown-basic"
                            >
                              <i className="icofont-listine-dots"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu as="ul" className="p-2">
                              <li style={{ width: '100%', zIndex: 100 }}>
                                <Link
                                  to={`/${_base}/QueryGroupMaster`}
                                  className="btn btn-sm btn-warning text-white w-100 override-margin-left"
                                >
                                  <i className="icofont-ui-edit"></i> Edit &
                                  View
                                </Link>
                              </li>
                              <li
                                className="btn btn-secondary text-white"
                                onClick={() => {
                                  handleModalQueryGroup({
                                    showModalQueryGroup: true,
                                    modalDataQueryGroup: null,
                                    modalHeaderQueryGroup: 'Add Query Group'
                                  });
                                }}
                                style={{ width: '100%', zIndex: 100 }}
                              >
                                <i className="icofont-ui-edit"></i> Add
                              </li>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </div>

                      {/* Remark */}
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Remark:
                        </label>
                        <Field
                          type="text"
                          className="form-control form-control-sm"
                          id="remark"
                          name="remark"
                          // maxLength={50}
                        />
                        <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      {/* Status */}
                      {modal.modalData && (
                        <div className="col-sm-12">
                          <label className="form-label font-weight-bold">
                            Status: <Astrick color="red" size="13px" />
                          </label>
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_1"
                                  value="1"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_1"
                                >
                                  Active
                                </label>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_0"
                                  value="0"
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
                      )}
                    </div>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  {!modal.modalData && (
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary text-white"
                    >
                      Submit
                    </button>
                  )}
                  {modal.modalData &&
                    checkRole &&
                    checkRole[0]?.can_update === 1 && (
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="btn btn-primary text-white"
                      >
                        Update
                      </button>
                    )}
                  <button
                    type="button"
                    className="btn btn-danger text-white"
                    onClick={() =>
                      handleModal({
                        showModal: false,
                        modalData: '',
                        modalHeader: ''
                      })
                    }
                  >
                    Cancel
                  </button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>

      {/* *************************Add Query Group*************************** */}
      <Modal
        centered
        size="sm"
        show={modalQueryGroup.showModalQueryGroup}
        onHide={(e) => {
          handleModalQueryGroup({
            showModalQueryGroup: false,
            modalDataQueryGroup: '',
            modalHeaderQueryGroup: ''
          });
        }}
      >
        <Formik
          initialValues={initialValueGroupName}
          validationSchema={validationSchemaGroupName}
          onSubmit={(value, { setSubmitting }) =>
            handleFormQueryGroup(value, { setSubmitting })
          }
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title className="fw-bold">
                  {modalQueryGroup.modalHeaderQueryGroup}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    <label className="form-label font-weight-bold">
                      Query Group :<Astrick color="red" size="13px" />
                    </label>
                    <div className="col-sm-12">
                      <Field
                        type="text"
                        style={{ height: '40px' }}
                        id="group_name"
                        name="group_name"
                        placeholder="Group Name"
                      />
                    </div>
                    <ErrorMessage
                      name="group_name"
                      component="small"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{
                    backgroundColor: '#484C7F',
                    width: '80px',
                    padding: '8px'
                  }}
                >
                  Add
                </button>

                <button
                  type="button"
                  className="btn btn-danger text-white"
                  onClick={() => {
                    handleModalQueryGroup({
                      showModalQueryGroup: false,
                      modalDataQueryGroup: '',
                      modalHeaderQueryGroup: ''
                    });
                  }}
                >
                  Cancel
                </button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

function QueryTypeDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new QueryTypeService()
      .getQueryType()
      .then((res) => {
        if (res?.status === 200) {
          let counter = 1;
          const data = res?.data?.data;
          for (const key in data) {
            if (data[key].is_active === 1) {
              tempData.push({
                counter: counter++,
                id: data[key].id,
                query_type_name: data[key].query_type_name
              });
            }
          }
          setData(tempData);
        }
      })
      .catch((error) => errorHandler(error));
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.onChange}
          required={props.required ? true : false}
          readOnly={props.readonly ? true : false}
        >
          {props.defaultValue === 0 && (
            <option value="">Select Query Type</option>
          )}
          {props.defaultValue !== 0 && (
            <option value="">Select Query Type </option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.query_type_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.query_type_name}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}

export { QueryTypeComponent, QueryTypeDropdown };
