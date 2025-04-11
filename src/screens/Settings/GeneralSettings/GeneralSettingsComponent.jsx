import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo
} from 'react';
import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import PageHeader from '../../../components/Common/PageHeader';
import { Astrick } from '../../../components/Utilities/Style';
import UserService from '../../../services/MastersService/UserService';
import GeneralSettingService from '../../../services/SettingService/GeneralSettingService';
import { useSelector, useDispatch } from 'react-redux';
import {
  getGeneralSettingData,
  postGeneralSettingData,
  updateGeneralSettingData
} from '../SettingAction';

import { getUserForMyTicketsData } from '../../TicketManagement/MyTicketComponentAction';
import { handleModalClose, handleGeneralModal } from '../SettingSlice';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';

function GeneralSettings() {
  //initial  state
  const dispatch = useDispatch();

  const getAllgeneralSettingData = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.getAllgeneralSettingData
  );
  const isLoading = useSelector(
    (SettingSlice) =>
      SettingSlice.generalSetting.isLoading.getGeneralSettingList
  );

  const User = useSelector(
    (MyTicketComponentSlice) => MyTicketComponentSlice.myTicketComponent.user
  );

  const modal = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.modal
  );

  const [user, setUser] = useState(null);
  const [reset, setReset] = useState(false);

  const loadData = useCallback(async () => {
    const inputRequired = 'id,employee_id,first_name,last_name';
    dispatch(getGeneralSettingData());
    dispatch(getUserForMyTicketsData(inputRequired));

    const roleId = localStorage.getItem('role_id');

    // await new ManageMenuService()
    //   .getRole(roleId)
    //   .then((res) => {
    //     if (res?.status === 200) {
    //       if (res.data.status === 1) {
    //       }
    //     }
    //   })
    //   .catch((error) => {
    //     errorHandler(error);
    //   });

    await new UserService()
      .getUserForMyTickets(inputRequired)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.status === 1) {
            const data = res?.data?.data?.data
              ?.filter((i) => i.is_active === 1)
              ?.sort((a, b) => {
                if (a.first_name && b.first_name) {
                  return a.first_name.localeCompare(b.first_name);
                }
                return 0;
              });
            setUser(
              data.map((d) => ({
                value: d.id,
                // label: d.first_name + ' ' + d.last_name
                label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
              }))
            );
          }
        }
      })
      .catch((error) => errorHandler(error));
    await new GeneralSettingService()
      .getGeneralSetting()
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.status === 1) {
            let data = [...res?.data?.data?.data];
            let count = 1;
            for (let i = 0; i < data?.length; i++) {
              data[i].counter = count++;
            }
          }
        }
      })
      .catch((error) => errorHandler(error));
  }, [dispatch]);

  const columns = useMemo(
    () => [
      {
        header: 'Action',
        accessorKey: 'action',
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
                dispatch(
                  handleGeneralModal({
                    showModal: true,
                    modalData: row?.original,
                    modalHeader: 'Edit Settings'
                  })
                );
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
        size: 90,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableColumnFilter: false
      },
      {
        header: 'Setting Name',
        accessorKey: 'setting_name',
        muiTableBodyCellProps: () => ({
          sx: {
            color: '#f19828',
            fontWeight: 400
          }
        }),
        size: 200
      },
      {
        header: 'Assigned User',
        accessorKey: 'assigned_user',
        accessorFn: (row) => {
          let arr = [];
          User.forEach((el) => {
            if (row?.user_id?.includes(el.value)) {
              arr.push(el.label);
            }
          });
          return arr.join(', ')?.trim();
        },
        filterFn: (row, columnId, filterValue) => {
          const val = row.getValue(columnId);
          return val?.toLowerCase().includes(filterValue.toLowerCase());
        },
        Cell: ({ row }) => {
          let arr = [];
          User.forEach((el) => {
            if (row?.original?.user_id?.includes(el.value)) {
              arr.push(el.label);
            }
          });

          return (
            <span className="ms-1">
              {arr?.length > 2
                ? `${arr[0]}, ${arr[1]}...`
                : arr.length === 0
                ? '--'
                : arr.join(', ')}
            </span>
          );
        },
        size: 210
      },
      {
        header: 'Status',
        accessorKey: 'is_active',
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
        header: 'Remark',
        size: 160,
        accessorFn: (row) => row.remark?.trim() || '--'
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.created_at),
        Cell: ({ row }) =>
          row.original.created_at
            ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
            : '--',
        size: 350
      },
      {
        accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
        header: 'Created By',
        size: 180
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.updated_at),
        Cell: ({ row }) =>
          row?.original?.updated_at?.trim()
            ? moment(row.original.updated_at).format('MM/DD/YYYY HH:mm:ss')
            : '--'
      },
      {
        id: 'updated_by',
        accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
        header: 'Updated By',
        size: 185
      }
    ],
    [dispatch, User]
  );

  const fields = [
    {
      name: 'setting_name',
      label: 'Setting name',
      required: true,
      alphaNumeric: true,
      min: 3,
      max: 50
    },
    {
      name: 'value',
      label: 'Value',
      required: false,
      max: 1,
      alphaNumeric: false
    },
    {
      name: 'user_id',
      label: 'User name',
      isObject: true,
      required: true
    },
    {
      name: 'remark',
      label: 'Remark',
      max: 255,
      required: false,
      alphaNumeric: true
    }
  ];

  const validationSchema = CustomValidation(fields);

  const userData =
    modal?.modalData?.user_id &&
    user?.filter((d) => modal?.modalData?.user_id?.includes(d.value));

  const initialValues = {
    setting_name: modal.modalData ? modal.modalData?.setting_name : '',
    value: modal?.modalData?.value || '',
    user_id: modal.modalData ? userData?.map((item) => item) : '',
    remark: modal.modalData?.remark || '',
    is_active: String(modal?.modalData?.is_active) ?? '1'
  };

  const handleForm = async (values, id, { setSubmitting }) => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append('setting_name', values.setting_name);
    formData.append('value', values.value);
    // formData.append('user_id', values.user_id);
    values?.user_id.forEach((item) => {
      formData?.append('user_id[]', item?.value);
    });
    formData.append('remark', values.remark);

    const editformdata = new FormData();
    editformdata.append('setting_name', values.setting_name);
    editformdata.append('value', values.value);
    // editformdata.append('user_id', values.user_id);
    values?.user_id.forEach((item) => {
      editformdata?.append('user_id[]', item?.value);
    });
    editformdata.append('remark', values.remark);
    editformdata.append('is_active', values.is_active);
    try {
      if (!id) {
        await dispatch(postGeneralSettingData(formData));
        setTimeout(() => {
          loadData();
        }, 500);
      } else {
        await dispatch(
          updateGeneralSettingData({ id: id, payload: editformdata })
        );
        setTimeout(() => {
          loadData();
        }, 500);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="General Settings"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => {
                  dispatch(
                    handleGeneralModal({
                      showModal: true,
                      modalData: null,
                      modalHeader: 'Add Setting'
                    })
                  );
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Setting
              </button>
            </div>
          );
        }}
      />

      <div className="card mt-2">
        <MaterialTable
          columns={columns}
          isLoading={isLoading}
          data={getAllgeneralSettingData}
          reset={reset}
          setReset={setReset}
          isExportData={false}
        />
      </div>

      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(value, { setSubmitting }) =>
            handleForm(value, modal.modalData ? modal.modalData.id : '', {
              setSubmitting
            })
          }
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <Modal.Header
                closeButton
                onClick={() =>
                  dispatch(
                    handleModalClose({
                      showModal: false,
                      modalData: null,
                      modalHeader: 'Add Setting'
                    })
                  )
                }
              >
                <Modal.Title className="fw-bold">
                  {modal.modalHeader}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    {/* Setting Name */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Setting Name: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        type="text"
                        name="setting_name"
                        className="form-control form-control-sm"
                        readOnly={!!modal.modalData}
                      />
                      <ErrorMessage
                        name="setting_name"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {/* Value */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Value:
                      </label>
                      <Field
                        type="number"
                        name="value"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="value"
                        component="small"
                        className="text-danger small"
                      />
                    </div>

                    {/* Select User */}
                    {user && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Select User: <span className="text-danger">*</span>
                        </label>

                        <Field
                          component={Select}
                          id="user_id"
                          name="user_id"
                          options={user}
                          isMulti
                          value={values.user_id}
                          // isArray="true"
                          onChange={(selectedOptions) =>
                            setFieldValue('user_id', selectedOptions)
                          }
                        />

                        <ErrorMessage
                          name="user_id"
                          component="small"
                          className="text-danger small"
                        />
                      </div>
                    )}

                    {/* Remark */}
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Remark:
                      </label>
                      <Field
                        type="text"
                        name="remark"
                        className="form-control form-control-sm"
                      />
                      <ErrorMessage
                        name="remark"
                        component="small"
                        className="text-danger small"
                      />
                    </div>
                    {modal.modalData && (
                      <div className="col-sm-12">
                        <label className="form-label font-weight-bold">
                          Status :<Astrick color="red" size="13px" />
                        </label>
                        <div className="row">
                          <div className="col-md-2">
                            <label className="form-check">
                              <Field
                                id="is_active_1"
                                type="radio"
                                name="is_active"
                                value="1"
                                className="form-check-input"
                              />
                              Active
                            </label>
                          </div>
                          <div className="col-md-2">
                            <label className="form-check">
                              <Field
                                type="radio"
                                name="is_active"
                                value="0"
                                id="is_active_0"
                                className="form-check-input"
                              />
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {!modal.modalData ? (
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary text-white"
                  >
                    Submit
                  </button>
                ) : (
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
                    dispatch(
                      handleModalClose({
                        showModal: false,
                        modalData: '',
                        modalHeader: ''
                      })
                    )
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
  );
}

export default GeneralSettings;
