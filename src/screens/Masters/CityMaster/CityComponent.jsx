import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";
import ErrorLogService from "../../../services/ErrorLogService";

import CountryService from "../../../services/MastersService/CountryService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";

import PageHeader from "../../../components/Common/PageHeader";

import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";

import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";

import { Spinner } from "react-bootstrap";
function CityComponent() {
  const [data, setData] = useState(null);

  const [dataa, setDataa] = useState(null);
  const [country, setCountry] = useState(null);
  const [countryDropdown, setCountryDropdown] = useState(null);
  const [stateDropdownNew, setStateDropdownNew] = useState(null);

  const [state, setState] = useState(null);
  const [stateDropdown, setStateDropdown] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [updateStatus, setUpdateStatus] = useState({});
  const [copyState, setCopyState] = useState([]);

  const [stateName, setStateName] = useState(null);

  const [notify, setNotify] = useState();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });

  const [dependent, setDependent] = useState({
    country_id: null,
    state_id: null,
  });

  const [exportData, setExportData] = useState(null);

  const searchRef = useRef();

  function SearchInputData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === "string" &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const handleSearch = () => {
    const SearchValue = searchRef.current.value;
    const result = SearchInputData(data, SearchValue);
    setData(result);
  };

  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);

  const handleModal = (data) => {
    if (data.modalData !== "" && data.modalData !== null) {
      setStateName(data.modalData.state);
    }
    setModal(data);
    if (data.modalData) {
      setDependent({
        country_id: data.modalData.country_id,
        state_id: data.modalData.state_id,
      });
    }
  };

  const columns = [
    // Columns definition..
    {
      name: "Action",
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
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: "Edit City",
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
      width: "60px",
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
      width: "125px",
    },
    {
      name: "State",
      selector: (row) => row.state,
      sortable: true,
      width: "125px",
    },
    {
      name: "Country",
      selector: (row) => row.country,
      sortable: true,
      width: "125px",
    },
    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: "4rem" }}>
              Deactive
            </span>
          )}
        </div>
      ),
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
      width: "150px",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
      width: "150px",
    },
  ];
  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    // Load data and update state.
    const data = [];
    const exportTempData = [];
    await new CountryService().getCountrySort().then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
        if (res.data.status == 1) {
          setCountry(res.data.data.filter((d) => d.is_active === 1));
          setCountryDropdown(
            res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({
                value: d.id,
                label: d.country,
              }))
          );
        }
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });

    await new StateService().getStateSort().then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);
        if (res.data.status == 1) {
          setState(res.data.data.filter((d) => d.is_active === 1));
          // setStateDropdown(
          //   res.data.data
          //     .filter((d) => d.is_active === 1)
          //     .map((d) => ({ value: d.id, label: d.state })),
          // )
          setStateDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({
                value: d.id,
                label: d.state,
                country_id: d.country_id,
              }))
          );

          setStateDropdownNew(
            res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({
                value: d.id,
                label: d.state,
              }))
          );
        }
      }
    });
    await new CityService()
      .getCity()
      .then((res) => {
        if (res.status === 200) {
          setShowLoaderModal(false);
          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              city: temp[key].city,
              state: temp[key].state,
              state_id: temp[key].state_id,
              country: temp[key].country,
              country_id: temp[key].country_id,
              remark: temp[key].remark,
              is_active: temp[key].is_active,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
            });
          }
          setData(null);
          setData(data);
          setDataa(data);
          for (const i in data) {
            exportTempData.push({
              Sr: data[i].counter,
              City: data[i].city,
              State: data[i].state,
              Country: data[i].country,
              Status: data[i].is_active ? "Active" : "Deactive",
              Remark: data[i].remark,
              created_at: temp[i].created_at,
              created_by: temp[i].created_by,
              updated_at: data[i].updated_at,
              updated_by: data[i].updated_by,
            });
          }

          setExportData(null);
          setExportData(exportTempData);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          "City",
          "Get_City",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    var flag = 1;

    var selectCountry = form.getAll("country_id");
    var selectState = form.getAll("state_id");
    if (selectCountry == "" || selectState == "") {
      flag = 0;
      if (selectCountry == "") {
        alert("Please Select Country");
      } else if (selectState == "") {
        alert("Please Select State");
      }
    }

    if (flag === 1) {
      setNotify(null);
      if (!id) {
        await new CityService()
          .postCity(form)
          .then((res) => {
            if (res.status === 200) {
              if (res.data.status === 1) {
                setNotify(null);
                setNotify({ type: "success", message: res.data.message });
                setModal({ showModal: false, modalData: "", modalHeader: "" });

                loadData();
              } else {
                setNotify({ type: "danger", message: res.data.message });
              }
            } else {
              new ErrorLogService().sendErrorLog(
                "City",
                "Create_City",
                "INSERT",
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog(
              "City",
              "Create_City",
              "INSERT",
              errorObject.data.message
            );
          });
      } else {
        await new CityService()
          .updateCity(id, form)
          .then((res) => {
            if (res.status === 200) {
              setShowLoaderModal(false);
              if (res.data.status) {
                setModal({ showModal: false, modalData: "", modalHeader: "" });
                loadData();
                setNotify(null);
                setNotify({ type: "success", message: res.data.message });
              } else {
                setNotify(null);
                setNotify({ type: "danger", message: res.data.message });
              }
            } else {
              setNotify({ type: "danger", message: res.message });
              new ErrorLogService().sendErrorLog(
                "City",
                "Edit_City",
                "INSERT",
                res.message
              );
            }
          })
          .catch((error) => {
            const { response } = error;
            const { request, ...errorObject } = response;
            setNotify({ type: "danger", message: "Request Error !!!" });
            new ErrorLogService().sendErrorLog(
              "City",
              "Edit_City",
              "INSERT",
              errorObject.data.message
            );
          });
      }
    }
  };

  const handleCountryChange = (e) => {
    setStateDropdown(
      state
        .filter((d) => d.country_id == e.value)
        .map((d) => ({ value: d.id, label: d.state }))
    );
    const newStatus = { ...updateStatus, statedrp: 1 };
    setUpdateStatus(newStatus);
    setStateName(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (dependent.country_id !== null) {
      const newStates = [...copyState];
      const filterNewState = newStates.filter((state) => {
        if (state.country_id === dependent.country_id) {
          return {
            value: state.id,
            label: state.state,
            country_id: state.country_id,
          };
        }
      });
      setStateDropdown(filterNewState);
    }
  }, [dependent]);

  useEffect(() => {
    if (checkRole && checkRole[6].can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }

    if (modal.modalData) {
      if (modal.modalData.state_id) {
        setStateName(
          stateDropdown.filter((d) => modal.modalData.state_id == d.value)
        );
      }
    }
  }, [modal.showModal, checkRole]);

  return (
    <div className="container-xxl">
      {notify && (
        <>
          {" "}
          <Alert alertData={notify} />{" "}
        </>
      )}
      <PageHeader
        headerTitle="City Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[6].can_create == 1 ? (
                <button
                  className="btn btn-dark btn-set-task w-sm-100"
                  onClick={() => {
                    setStateName(null);
                    handleModal({
                      showModal: true,
                      modalData: null,
                      modalHeader: "Add City",
                    });
                  }}
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add City
                </button>
              ) : (
                ""
              )}
            </div>
          );
        }}
      />
      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by City name...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={handleSearch}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={exportData}
              fileName="City master"
            />
          </div>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={modal.showModal}
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : "")}
        >
          <Modal.Header closeButton>
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
                    options={countryDropdown}
                    id="country_id"
                    name="country_id"
                    onChange={handleCountryChange}
                    defaultValue={
                      modal.modalData
                        ? countryDropdown.filter(
                            (d) => modal.modalData.country_id == d.value
                          )
                        : ""
                    }
                    required={true}
                  />
                </div>

                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Select State :<Astrick color="red" size="13px" />
                  </label>
                  <Select
                    options={stateDropdownNew}
                    id="state_id"
                    name="state_id"
                    // onChange={handleCountryChange}
                    defaultValue={
                      modal.modalData
                        ? stateDropdownNew.filter(
                            (d) => modal.modalData.state_id == d.value
                          )
                        : ""
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
                    defaultValue={modal.modalData ? modal.modalData.city : ""}
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
                    defaultValue={modal.modalData ? modal.modalData.remark : ""}
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
                  backgroundColor: "#484C7F",
                  width: "80px",
                  padding: "8px",
                }}
              >
                Add
              </button>
            )}
            {modal.modalData && checkRole && checkRole[6].can_update == 1 ? (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Update
              </button>
            ) : (
              ""
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
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
  useEffect(async () => {
    const tempData = [];
    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active == 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              city: data[key].city,
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
              Select City
            </option>
          )}
          {props.defaultValue != 0 && <option value={0}>Select City</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
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
