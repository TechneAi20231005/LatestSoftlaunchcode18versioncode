import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import CustomerType from '../../../services/MastersService/CustomerTypeService';
import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';

import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomerTypeData,
  postCustomerData,
  updateCustomerData
} from './CustomerTypeComponentAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import {
  handleModalClose,
  handleModalOpen
} from './CustomerTypeComponentSlice';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function CustomerTypeComponent() {
  const isActive1Ref = useRef();
  const dispatch = useDispatch();
  const customerData = useSelector(
    (CustomerTypeComponentSlice) =>
      CustomerTypeComponentSlice.customerTypeMaster.getCustomerTypeData
  );

  const isLoading = useSelector(
    (CustomerTypeComponentSlice) =>
      CustomerTypeComponentSlice.customerTypeMaster.isLoading.customerTypeList
  );

  const exportData = useSelector(
    (CustomerTypeComponentSlice) =>
      CustomerTypeComponentSlice.customerTypeMaster.exportCustomerData
  );

  const modal = useSelector(
    (customerMasterSlice) => customerMasterSlice.customerTypeMaster.modal
  );
  const notify = useSelector(
    (customerMasterSlice) => customerMasterSlice.customerTypeMaster.notify
  );

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 12)
  );

  const isActive0Ref = useRef();

  const [searchTerm, setSearchTerm] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(customerData, searchTerm);
    setFilteredData(filteredList);
  }, [customerData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(customerData);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              dispatch(
                handleModalOpen({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Edit Customer Type'
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
      width: '60px'
    },
    {
      name: 'Customer Type Name',
      selector: (row) => row.type_name,
      sortable: true,
      width: '200px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      width: '125px',
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
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '175px'
    }
  ];

  const loadData = async () => {
    // setShowLoaderModal(null);
  };
  const handleIsActive = (e) => {
    const value = e.target.value;

    if (value === 1) {
      // setIsActive(1);
    } else {
      // setIsActive(0);
    }
  };
  const handleForm = (id) => async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    if (!id) {
      dispatch(postCustomerData(form)).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getCustomerTypeData());
        } else {
        }
      });
    } else {
      dispatch(updateCustomerData({ id: id, payload: form })).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getCustomerTypeData());
        } else {
        }
      });
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     handleSearch();
  //   }
  // };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    setFilteredData(customerData);
  }, [customerData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  useEffect(() => {
    loadData();
    dispatch(getCustomerTypeData());

    if (!customerData?.length) {
      dispatch(getRoles());
    }
  }, [dispatch, customerData.length]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Customer Type Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    dispatch(
                      handleModalOpen({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add Customer Type'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Customer
                  Type
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <SearchBoxHeader
         showInput={true}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by customer type name...."
        exportFileName="Customer type Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {customerData && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal centered show={modal.showModal}>
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header
            closeButton
            onClick={() => {
              dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                })
              );
            }}
          >
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Customer Type Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="type_name"
                    name="type_name"
                    required
                    maxLength={30}
                    defaultValue={
                      modal.modalData ? modal.modalData.type_name : ''
                    }
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnly(e);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="remark"
                    name="remark"
                    maxLength={50}
                    defaultValue={modal.modalData ? modal.modalData.remark : ''}
                  />
                </div>

                {modal.modalData && (
                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Status :<Astrick color="red" size="13px" />
                    </label>
                    <div className="row">
                      <div className="col-md-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            onClick={(e) => {
                              handleIsActive(e);
                            }}
                            id="is_active_1"
                            ref={isActive1Ref}
                            value="1"
                            defaultChecked={
                              modal.modalData && modal.modalData.is_active === 1
                                ? true
                                : !modal.modalData
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
                            onClick={(e) => {
                              handleIsActive(e);
                            }}
                            ref={isActive0Ref}
                            value="0"
                            readOnly={modal.modalData ? false : true}
                            defaultChecked={
                              modal.modalData && modal.modalData.is_active === 0
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!modal.modalData && (
              <button
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
            )}
            {modal.modalData && checkRole && checkRole[0]?.can_update === 1 ? (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
              >
                Update
              </button>
            ) : (
              ''
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                dispatch(
                  handleModalClose({
                    showModal: false,
                    modalData: '',
                    modalHeader: ''
                  })
                );
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

function CustomerTypeDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new CustomerType().getCustomerType().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active === 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              type_name: data[key].type_name
            });
          }
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
        >
          {props.defaultValue === 0 && (
            <option selected>Select Customer Type</option>
          )}
          {props.defaultValue !== 0 && (
            <option selected>Select Customer Type</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.type_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.type_name}
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

export { CustomerTypeComponent, CustomerTypeDropdown };
