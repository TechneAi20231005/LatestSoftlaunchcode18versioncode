import React, { useEffect, useState } from 'react';
import { Container, Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

import StateService from '../../../services/MastersService/StateService';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';

import { useSelector, useDispatch } from 'react-redux';
import { handleModalClose } from '../../Dashboard/DashbordSlice';
import {
  getCountryDataSort,
  getRoles,
  getStateData,
  postStateData,
  updateStateData
} from '../../Dashboard/DashboardAction';
import { handleModalInStore } from '../../Dashboard/DashbordSlice';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
function StateComponent() {
  //initial state
  const dispatch = useDispatch();

  //Redux State

  const { stateData, modal, notify, filteredCountryData, exportData } =
    useSelector((state) => state.dashboard);

  const isLoading = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.stateDataList
  );

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 6)
  );

  //local state
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(stateData, searchTerm);
    setFilteredData(filteredList);
  };

  //reset function
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(stateData);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              dispatch(
                handleModalInStore({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Edit State'
                })
              );
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
      width: '80px'
    },
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    {
      name: 'State',
      selector: (row) => row.state,
      sortable: true,
      width: '125px'
    },
    {
      name: 'Country',
      selector: (row) => row.country,
      sortable: true,
      width: '125px'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      ),
      width: '100px'
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
    var flag = 1;

    var selectCountry = form.getAll('country_id');
    if (selectCountry == '0') {
      flag = 0;

      alert('Please Select Country');
    }

    if (flag === 1) {
      if (!id) {
        dispatch(postStateData(form)).then((res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getStateData());
          } else {
          }
        });
      } else {
        dispatch(updateStateData({ id: id, payload: form })).then((res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getStateData());
          } else {
          }
        });
      }
    }
  };

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    dispatch(getCountryDataSort());
    dispatch(getStateData());

    if (!stateData.length || !checkRole.length) {
      dispatch(getRoles());
    }
    if (!filteredCountryData.length) {
    }
  }, []);

  useEffect(() => {
    setFilteredData(stateData);
  }, [stateData]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <Container fluid>
        <PageHeader
          headerTitle="State Master"
          renderRight={() => {
            return (
              <div>
                {checkRole && checkRole[0]?.can_create == 1 ? (
                  <button
                    className="btn btn-dark px-5"
                    onClick={() => {
                      dispatch(
                        handleModalInStore({
                          showModal: true,
                          modalData: null,
                          modalHeader: 'Add State'
                        })
                      );
                    }}
                  >
                    <i className="icofont-plus-circle fs-6" />
                    Add State
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
          placeholder="Search by state name...."
          exportFileName="State Master Record"
          exportData={exportData}
          showExportButton={true}
        />

        <div className="card mt-2">
          {stateData && (
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
            closeButton
            onClick={() => {
              dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: null,
                  modalHeader: 'Add State'
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
                    Select Country :<Astrick color="red" size="13px" />
                  </label>

                  <Select
                    options={filteredCountryData}
                    id="country_id"
                    name="country_id"
                    defaultValue={
                      modal.modalData
                        ? filteredCountryData.filter(
                            (d) => modal.modalData.country_id == d.value
                          )
                        : ''
                    }
                    required={true}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    State Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="state"
                    name="state"
                    maxLength={25}
                    required
                    defaultValue={modal.modalData ? modal.modalData.state : ''}
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
                      Status :<Astrick color="red" size="13px" />
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
            {modal.modalData && checkRole && checkRole[0]?.can_update == 1 ? (
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

function StateDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new StateService().getState().then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        let counter = 1;
        for (const key in data) {
          if (data[key].is_active == 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              state: data[key].state
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
          {props.defaultValue == 0 && (
            <option value={0} selected>
              Select State
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select State</option>}
          {data.map(function (item, i) {
            if (props.countryId && props.countryId == item.country_id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.state}
                </option>
              );
            } else if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.state}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.state}
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

export { StateComponent, StateDropdown };
