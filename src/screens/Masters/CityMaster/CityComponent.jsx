import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Select from 'react-select';

import { useSelector, useDispatch } from 'react-redux';

import CityService from '../../../services/MastersService/CityService';

import PageHeader from '../../../components/Common/PageHeader';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';

import {
  handleModalInStore,
  handleModalClose
} from '../../Dashboard/DashbordSlice';

import {
  getCityData,
  getCountryData,
  getCountryDataSort,
  getStateDataSort,
  postCityData,
  updateCityData
} from '../../Dashboard/DashboardAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { customSearchHandler } from '../../../utils/customFunction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
function CityComponent() {
  // initial state

  const dispatch = useDispatch();

  //redux state

  const {
    cityData,
    notify,
    modal,
    filteredStateData,
    filteredCountryData,
    activeState,
    exportCityData
  } = useSelector((state) => state?.dashboard);
  const isLoading = useSelector(
    (dashboardSlice) => dashboardSlice.dashboard.isLoading.getCityDataList
  );
  console.log('filteredStateData', filteredStateData);
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 7)
  );
  //local state
  const [stateDropdownData, setStateDropdownData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState({});
  // const [copyState, setCopyState] = useState([]);

  // const [stateName, setStateName] = useState(null);

  // const [dependent, setDependent] = useState({
  //   country_id: null,
  //   state_id: null
  // });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(cityData, searchTerm);
    setFilteredData(filteredList);
  }, [cityData, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(cityData);
  };

  //columns
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
                  modalHeader: 'Edit City'
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
      name: 'City',
      selector: (row) => row.city,
      sortable: true,
      width: '125px'
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
      width: '150px'
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
      width: '150px'
    }
  ];

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    var flag = 1;

    var selectCountry = form.getAll('country_id');
    var selectState = form.getAll('state_id');
    if (selectCountry === '' || selectState === '') {
      flag = 0;
      if (selectCountry === '') {
        alert('Please Select Country');
      } else if (selectState === '') {
        alert('Please Select State');
      }
    }
    if (flag === 1) {
      if (!id) {
        dispatch(postCityData(form)).then((res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getCityData());
          } else {
          }
        });
      } else {
        dispatch(updateCityData({ id: id, payload: form })).then((res) => {
          if (res?.payload?.data?.status === 1) {
            dispatch(getCityData());
          } else {
          }
        });
      }
    }
  };

  const handleCountryChange = (e) => {
    setStateDropdownData(
      activeState &&
        activeState
          ?.filter((filterState) => filterState.country_id === e.value)
          ?.map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    // setStateName(null);
  };

  useEffect(() => {
    dispatch(getCityData());
    dispatch(getRoles());
    dispatch(getCountryData());
    dispatch(getStateDataSort());
    dispatch(getCountryDataSort());

    if (
      !cityData.length ||
      !checkRole.length ||
      !filteredStateData.length ||
      !filteredCountryData.length
    ) {
    }
  }, [
    dispatch,
    cityData.length,
    checkRole.length,
    filteredStateData.length,
    filteredCountryData.length
  ]);

  useEffect(() => {
    setFilteredData(cityData);
  }, [cityData]);

  useEffect(() => {
    dispatch(getCityData());
  }, [dispatch]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  // useEffect(() => {
  //   if (dependent.country_id !== null) {
  //     const newStates = [...copyState];

  //     const filterNewState = newStates.filter((state) => {
  //       if (state.country_id === dependent.country_id) {
  //         return {
  //           value: state.id,
  //           label: state.state,
  //           country_id: state.country_id
  //         };
  //       }
  //     });
  //     setStateDropdownData(filterNewState);
  //   }
  // }, [dependent, copyState]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }

    if (modal.modalData) {
      if (modal.modalData.state_id) {
        // setStateName(
        //   activeState?.filter((d) => modal.modalData.state_id === d.value)
        // );
      }
    }
  }, [modal.showModal, checkRole, modal.modalData]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="City Master"
        renderRight={() => {
          return (
            <div>
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <button
                  className="btn btn-dark px-5"
                  onClick={() => {
                    // setStateName(null);
                    dispatch(
                      handleModalInStore({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add City'
                      })
                    );
                  }}
                >
                  <i className="icofont-plus me-2 fs-6" />
                  Add City
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
        placeholder="Search by city name...."
        exportFileName="City Master Record"
        exportData={exportCityData}
        showExportButton={true}
      />
      <div className="mt-2">
        {cityData && (
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
                  modalHeader: 'Add City'
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
                    options={filteredCountryData && filteredCountryData}
                    id="country_id"
                    name="country_id"
                    onChange={handleCountryChange}
                    defaultValue={
                      modal.modalData
                        ? filteredCountryData?.filter(
                            (d) => modal?.modalData?.country_id === d.value
                          )
                        : ''
                    }
                    required={true}
                  />
                </div>

                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Select State :<Astrick color="red" size="13px" />
                  </label>
                  <Select
                    options={stateDropdownData}
                    id="state_id"
                    name="state_id"
                    onChange={handleCountryChange}
                    defaultValue={
                      modal.modalData
                        ? filteredStateData.filter(
                            (d) => modal.modalData.state_id === d.value
                          )
                        : ''
                    }
                    required={true}
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    City Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="city"
                    name="city"
                    maxLength={25}
                    required
                    defaultValue={modal.modalData ? modal.modalData.city : ''}
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
                    modalData: null,
                    modalHeader: 'Add City'
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
function CityDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new CityService().getCity().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active === 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              city: data[key].city
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
            <option value={0} selected>
              Select City
            </option>
          )}
          {props.defaultValue !== 0 && <option value={0}>Select City</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.city}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.city}
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

export { CityComponent, CityDropdown };
