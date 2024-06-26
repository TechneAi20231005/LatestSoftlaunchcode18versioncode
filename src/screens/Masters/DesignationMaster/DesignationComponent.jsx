import React, { useCallback, useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import DesignationService from '../../../services/MastersService/DesignationService';

import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import {
  getDesignationDataListThunk,
  postDesignationData,
  updatedDesignationData
} from './DesignationAction';
import { handleModalClose, handleModalOpen } from './DesignationSlice';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

function DesignationComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state
  const { getDesignationData, exportDesignation, modal, notify } = useSelector(
    (state) => state.designationMaster
  );
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice?.dashboard?.getRoles?.filter((d) => d.menu_id === 8)
  );

  const isLoading = useSelector(
    (DesignationSlice) =>
      DesignationSlice.designationMaster.isLoading.DesignationList
  );

  //local state
  const [searchTerm, setSearchTerm] = useState('');

  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(getDesignationData, searchTerm);
    setFilteredData(filteredList);
  }, [getDesignationData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(getDesignationData);
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
                  modalHeader: 'Edit Designation'
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
      width: '80px'
    },
    {
      name: 'Designation',
      selector: (row) => row.designation,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      width: '150px',
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

  const handleForm = (id) => async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);
    if (!id) {
      dispatch(postDesignationData(form)).then((res) => {
        if (res?.payload?.data?.status === 1) {
          dispatch(getDesignationDataListThunk());
        } else {
        }
      });
    } else {
      dispatch(updatedDesignationData({ id: id, payload: form })).then(
        (res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getDesignationDataListThunk());
          } else {
          }
        }
      );
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    dispatch(getDesignationDataListThunk());

    if (!getDesignationData.length) {
      dispatch(getRoles());
    }
  }, [dispatch, getDesignationData.length]);
  useEffect(() => {
    setFilteredData(getDesignationData);
  }, [getDesignationData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <Container fluid>
        <PageHeader
          headerTitle="Designation Master"
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
                          modalHeader: 'Add Designation'
                        })
                      );
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add
                    Designation
                  </button>
                ) : (
                  ''
                )}
              </div>
            );
          }}
        />
        <SearchBoxHeader
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleReset={handleReset}
          placeholder="Search by designation name...."
          exportFileName="Designation Master Record"
          exportData={exportDesignation}
          showExportButton={true}
        />

        <div className="card mt-2">
          {getDesignationData && (
            <DataTable
              columns={columns}
              data={filteredData}
              defaultSortField="title"
              pagination
              selectableRows={false}
              progressPending={isLoading}
              progressComponent={<TableLoadingSkelton />}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />
          )}
        </div>
      </Container>

      <Modal centered show={modal.showModal}>
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header
            onClick={() => {
              dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                })
              );
            }}
            closeButton
          >
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Designation Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="designation"
                    name="designation"
                    required
                    maxLength={30}
                    defaultValue={
                      modal.modalData ? modal.modalData.designation : ''
                    }
                    onKeyPress={(e) => {
                      Validation.CharacterWithSpace(e);
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
                      Status : <Astrick color="red" size="13px" />
                    </label>
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

function DesignationDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];

    new DesignationService().getDesignation().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            designation: data[key].designation
          });
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
          value={props.defaultValue}
        >
          {props.defaultValue === 0 && (
            <option value={0} selected>
              Select Designation
            </option>
          )}
          {props.defaultValue !== 0 && (
            <option value={0}>Select Designation</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.designation}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.designation}
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

export { DesignationComponent, DesignationDropdown };
