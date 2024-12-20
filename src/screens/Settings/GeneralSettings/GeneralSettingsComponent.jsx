import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import PageHeader from '../../../components/Common/PageHeader';
import { Astrick } from '../../../components/Utilities/Style';

import Alert from '../../../components/Common/Alert';

import UserService from '../../../services/MastersService/UserService';
import GeneralSettingService from '../../../services/SettingService/GeneralSettingService';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useSelector, useDispatch } from 'react-redux';
import {
  getGeneralSettingData,
  postGeneralSettingData,
  updateGeneralSettingData
} from '../SettingAction';

import { getUserForMyTicketsData } from '../../TicketManagement/MyTicketComponentAction';
import { handleModalClose, handleGeneralModal } from '../SettingSlice';
import { customSearchHandler } from '../../../utils/customFunction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

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
  const Notify = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.notify
  );
  const modal = useSelector(
    (SettingSlice) => SettingSlice.generalSetting.modal
  );

  //local state
  const data = null;
  const exportData = null;
  const [user, setUser] = useState(null);

  const userDetail = useRef();

  const userValue = useRef();

  const useSetting = useRef();
  const useRemark = useRef();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(
      getAllgeneralSettingData,
      searchTerm
    );
    setFilteredData(filteredList);
  }, [getAllgeneralSettingData, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
  };

  //Data Table columns
  const loadData = useCallback(async () => {
    const inputRequired = 'id,employee_id,first_name,last_name';
    dispatch(getGeneralSettingData());
    dispatch(getUserForMyTicketsData(inputRequired));

    const roleId = localStorage.getItem('role_id');

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
        }
      }
    });

    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const data = res.data.data.sort((a, b) => {
            if (a.first_name && b.first_name) {
              return a.first_name.localeCompare(b.first_name);
            }
            return 0;
          });
          setUser(
            data.map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name
            }))
          );
        }
      }
    });
    await new GeneralSettingService().getGeneralSetting().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          let data = [...res.data.data];
          let count = 1;
          for (let i = 0; i < data.length; i++) {
            data[i].counter = count++;
          }
        }
      }
    });
  }, [dispatch]);

  //columns
  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '5%',
      cell: (row) => (
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
                  modalData: row,
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
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '5%'
    },
    {
      name: 'Setting Name',
      selector: (row) => row.setting_name,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Assigned User',

      sortable: true,
      width: '20%',
      cell: (row) => {
        let arr = [];
        User.filter((el) => {
          if (row.user_id.includes(el.value)) {
            arr.push(el.label);
          }
        });

        return (
          <>
            <OverlayTrigger overlay={<Tooltip>{arr.join(', ')}</Tooltip>}>
              <div>
                <span className="ms-1">
                  {arr.length > 2 ? `${(arr[0], arr[1])}...` : `${arr}`}
                </span>
              </div>
            </OverlayTrigger>
          </>
        );
      }
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      ),
      width: '10%'
    },
    {
      name: 'Remark',
      selector: (row) => row.remark,
      sortable: true,
      width: '10%'
    },
    {
      name: 'Created at',
      selector: (row) => row.created_at,
      sortable: true
    },
    {
      name: 'Created by',
      sortable: true,
      cell: (row) => {
        let userList = User.filter(
          (userData) => row.created_by === userData.value
        );

        if (userList && userList.length > 0) {
          return <>{userList[0].label}</>;
        } else {
          return <>{''}</>;
        }
      }
    },
    {
      name: 'Updated at',
      selector: (row) => row.updated_at,
      sortable: true
    },
    {
      name: 'Updated by',
      sortable: true,
      cell: (row) => {
        let userList = User.filter(
          (userData) => row.updated_by === userData.value
        );
        if (userList && userList.length > 0) {
          return <>{userList[0].label}</>;
        } else {
          return <>{''}</>;
        }
      }
    }
  ];

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
      required: true,
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
      max: 1000,
      required: false,
      alphaNumeric: true
    }
  ];

  const validationSchema = CustomValidation(fields);

  const userData =
    modal?.modalData?.user_id &&
    user?.filter((d) => modal?.modalData?.user_id?.includes(d.value));
  console.log(userData, 'userdata');

  const initialValues = {
    setting_name: modal.modalData ? modal.modalData?.setting_name : '',
    value: modal.modalData ? modal.modalData?.value : '',
    user_id: modal.modalData ? userData?.map((item) => item) : '',
    remark: modal.modalData?.remark || '',
    is_active: 1
  };

  const handleForm = async (values, id) => {
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

    if (!id) {
      dispatch(postGeneralSettingData(formData));
      setTimeout(() => {
        loadData();
      }, 500);
    } else {
      dispatch(updateGeneralSettingData({ id: id, payload: editformdata }));
      setTimeout(() => {
        loadData();
      }, 500);
    }
  };
  useEffect(() => {
    loadData();
  }, [loadData]);
  useEffect(() => {
    setFilteredData(getAllgeneralSettingData);
  }, [getAllgeneralSettingData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);
  return (
    <div className="container-xxl">
      {Notify && (
        <>
          {' '}
          <Alert alertData={Notify} />{' '}
        </>
      )}
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
      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by setting name...."
        exportFileName="General setting  Master Record"
        exportData={exportData}
      />

      <div className="card mt-2">
        {isLoading && <TableLoadingSkelton />}
        {!isLoading && getAllgeneralSettingData && (
          <DataTable
            columns={columns}
            data={filteredData}
            defaultSortField="title"
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
          />
        )}
      </div>

      <Modal centered show={modal.showModal}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(value) =>
            handleForm(value, modal.modalData ? modal.modalData.id : '')
          }
        >
          {({ values, setFieldValue }) => (
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
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {!modal.modalData ? (
                  <button type="submit" className="btn btn-primary text-white">
                    Submit
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary text-white">
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
