import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import TemplateService from "../../../services/MastersService/TemplateService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import Alert from "../../../components/Common/Alert";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { exportTempateData, templateData } from "./TemplateComponetAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import TemplateComponetSlice, {
  hideNotification,
} from "./TemplateComponetSlice";

function TemplateComponent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const templatedata = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.templateData
  );

  const exportData = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.exportData
  );

  const notify = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.notify
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 15)
  );

  const [data, setData] = useState(null);
  const [dataa, setDataa] = useState(null);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const roleId = sessionStorage.getItem("role_id");

  const handleModal = (data) => {
    setModal(data);
  };

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

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = (value) => {};

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      width: "80px",
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Template/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
      width: "80px",
    },

    {
      name: "Template Name",
      selector: (row) => row["Template Name"],
      sortable: true,
      width: "150px",
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.template_name && (
            <OverlayTrigger overlay={<Tooltip>{row.template_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.template_name && row.template_name.length < 10
                    ? row.template_name
                    : row.template_name.substring(0, 10) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },

    {
      name: "Type Name",
      width: "150px",
      selector: (row) => row.type_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {" "}
                  {row.type_name && row.type_name.length < 120
                    ? row.type_name
                    : row.type_name.substring(0, 120) + "...."}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: false,
      width: "150px",
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">Deactive</span>
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

  const loadData = async () => {};

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    loadData();
    dispatch(exportTempateData());

    if (!templatedata.length) {
      dispatch(templateData());
      dispatch(getRoles());
    }
    if (location && location.state) {
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Template Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base + "/Template/Create"}`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Template
                </Link>
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
              placeholder="Search by Templete Name...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              value={searchTerm}
              onClick={() => handleSearch(searchTerm)}
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
              fileName="Template master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {templatedata && (
                <DataTable
                  columns={columns}
                  data={templatedata.filter((customer) => {
                    if (typeof searchTerm === "string") {
                      if (typeof customer === "string") {
                        return customer
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      } else if (typeof customer === "object") {
                        return Object.values(customer).some(
                          (value) =>
                            typeof value === "string" &&
                            value
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        );
                      }
                    }
                    return false;
                  })}
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
    </div>
  );
}

function TemplateDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new TemplateService().getTemplate().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            template_name: data[key].template_name,
            created_at: data[key].created_at,
            created_by: data[key].created_by,
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
          {props.defaultValue !== 0 && (
            <option value={0}>Select Template</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.template_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.template_name}
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

export { TemplateComponent, TemplateDropdown };
