import React, { useEffect, useState } from 'react';
import PageHeader from '../../../components/Common/PageHeader';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import { errorHandler } from '../../../utils';
import QueryTypeService from '../../../services/MastersService/QueryTypeService';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { Modal } from 'react-bootstrap';
import { Astrick } from '../../../components/Utilities/Style';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';

const QueryGroupMaster = () => {
  const [queryGroupData, setQueryGroupData] = useState([]);
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalQueryGroup, setModalQueryGroup] = useState({
    showModalQueryGroup: false,
    modalDataQueryGroup: ''
  });
  const [isActive, setIsActive] = useState(true);
  const handleIsActive = (e) => {
    setIsActive(e.target.value);
  };
  const fetchQueryGroup = async () => {
    setIsLoading(true);
    const data = [];
    try {
      const res = await new QueryTypeService().getAllQueryGroup();
      if (res?.status === 200) {
        let counter = 1;
        const temp = res?.data?.data?.data;
        for (const key in temp) {
          data.push({
            counter: counter++,
            id: temp[key].id,
            group_name: temp[key].group_name,
            is_active: temp[key].is_active,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by
          });
        }

        setQueryGroupData(data);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleModalQueryGroup = (data) => {
    setModalQueryGroup(data);
  };
  const handleFormQueryGroup = async (values, id, { setSubmitting }) => {
    setSubmitting(true);

    const form = new FormData();
    form.append('group_name', values.group_name);
    form.delete('is_active');
    form.append('is_active', isActive);
    try {
      setSubmitting(true);
      const res = await new QueryTypeService().updateQueryGroup(id, form);
      if (res?.status === 200) {
        if (res?.data?.status === 1) {
          toast.success(res?.data?.message);
          setModalQueryGroup({
            showModalQueryGroup: false,
            modalDataQueryGroup: ''
          });
          fetchQueryGroup();
          setSubmitting(false);
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
      clearFilters();
    }
  };
  const exportQueryGroupDataKeys = {
    group_name: 'Query Group Name',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Query Group Type Master Record'
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
              handleModalQueryGroup({
                showModalQueryGroup: true,
                modalDataQueryGroup: row?.original
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
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow?.group_name || '--',
      header: 'Query Group',
      size: 200
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
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
      size: 190
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

  const initialValueGroupName = {
    group_name:
      modalQueryGroup.modalDataQueryGroup &&
      modalQueryGroup.modalDataQueryGroup?.group_name
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

  const clearFilters = () => {
    setReset(true);
  };
  useEffect(() => {
    fetchQueryGroup();
  }, []);
  return (
    <>
      <div className="container-xxl">
        <PageHeader headerTitle="Query Group Master" />
        <div className="card mt-2">
          <MaterialTable
            exportDataKeys={exportQueryGroupDataKeys}
            columns={columns}
            data={queryGroupData}
            reset={reset}
            setReset={setReset}
            clearFilter={clearFilters}
            isLoading={isLoading}
          />
        </div>
        <Modal
          centered
          size="sm"
          show={modalQueryGroup.showModalQueryGroup}
          onHide={(e) => {
            handleModalQueryGroup({
              showModalQueryGroup: false,
              modalDataQueryGroup: ''
            });
          }}
        >
          <Formik
            initialValues={initialValueGroupName}
            validationSchema={validationSchemaGroupName}
            onSubmit={(value, { setSubmitting }) =>
              handleFormQueryGroup(
                value,
                modalQueryGroup?.modalDataQueryGroup?.id || '',
                { setSubmitting }
              )
            }
          >
            {({ isSubmitting, _setFieldValue, _values }) => (
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title className="fw-bold">
                    Edit Query Group
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="deadline-form">
                    <div className="row g-3 mb-3">
                      <label className="form-label font-weight-bold">
                        Query Group :<Astrick color="red" size="13px" />
                      </label>
                      <div className="col-sm-12">
                        {modalQueryGroup.modalDataQueryGroup && (
                          <Field
                            type="text"
                            style={{ height: '40px' }}
                            id="group_name"
                            name="group_name"
                            placeholder=""
                            defaultValue={
                              modalQueryGroup.modalDataQueryGroup &&
                              modalQueryGroup?.modalDataQueryGroup?.group_name
                                ? modalQueryGroup.modalDataQueryGroup.group_name
                                : ''
                            }
                          />
                        )}
                      </div>
                      <ErrorMessage
                        name="group_name"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {modalQueryGroup.modalDataQueryGroup && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status: <Astrick color="red" size="13px" />
                        </label>
                        <div className="row gap-md-3 gap-0">
                          <div className="col-md-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="is_active"
                                id="is_active_1"
                                value="1"
                                onClick={handleIsActive}
                                defaultChecked={
                                  modalQueryGroup.modalDataQueryGroup &&
                                  modalQueryGroup.modalDataQueryGroup
                                    .is_active === 1
                                    ? true
                                    : false
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
                                readOnly={
                                  modalQueryGroup?.modalDataQueryGroup
                                    ? false
                                    : true
                                }
                                onClick={handleIsActive}
                                defaultChecked={
                                  modalQueryGroup.modalDataQueryGroup &&
                                  modalQueryGroup.modalDataQueryGroup
                                    .is_active === 0
                                    ? true
                                    : false
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
                    )}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  {modalQueryGroup.modalDataQueryGroup && (
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-primary text-white"
                      style={{ backgroundColor: '#484C7F' }}
                    >
                      Update
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-danger text-white"
                    onClick={() => {
                      handleModalQueryGroup({
                        showModalQueryGroup: false,
                        modalDataQueryGroup: ''
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
      </div>
    </>
  );
};

export default QueryGroupMaster;
