import React, { useState, useEffect, useRef } from "react";
// import { ProgressBar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ConsolidatedService from "../../services/ProjectManagementService/ConsolidatedService";
import {
  _apiUrl,
  _attachmentUrl,
  _base,
  attachmentUrl,
} from "../../settings/constants";
import DataTable from "react-data-table-component";
import Select from "react-select";
import SubModuleService from "../../services/ProjectManagementService/SubModuleService";
import Alert from "../../components/Common/Alert";
import { Modal, Button } from "react-bootstrap";
import { Astrick } from "../../components/Utilities/Style";

export default function ProjectwiseModule({ match }) {
  const projectId = match.params.projectId;
  const moduleId = match.params.moduleId;
  const [data, setData] = useState(null);
  const [idd, setId] = useState(null);
  const [submoduleData, setSubmoduleData] = useState(null);
  const [subModuleDropdown, setSubModuleDropdown] = useState(null);
  const [show, setShow] = useState(false);
  const [showToALL, setShowToAll] = useState(false);
  const [docList, setDocList] = useState([]);
  const [toggleList, setToggleList] = useState(false);
  const [subModuleValue, setSubModuleValue] = useState(null);
  const [fileName, setFileName] = useState("");
  const [notify, setNotify] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showbtn, setShowbtn] = useState(true);
  const [selectedRows, setSelectedRows] = useState();
  const [selectedData, setSelectedData] = useState();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const handleModal = (data) => {
    setModal(data);
  };
  const submoduleRef = useRef(null);
  const loadData = async () => {
    await new ConsolidatedService()
      .getProjectsModules(projectId, moduleId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setData(null);
            setData(res.data.data);
            setId(res.data.data.id);
          }
        }
      });

    await new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          const a = res.data.data.filter((d) => d.module_id);
          setSubmoduleData(res.data.data);

          setSubModuleDropdown(
            temp
              .filter((d) => d.module_id == moduleId)
              .map((d) => ({ value: d.id, label: d.sub_module_name }))
          );
        }
      }
    });
  };
  const changeSubModuleHandle = async (e) => {
    const { value } = e;
    setSubModuleValue(value);
    await new SubModuleService()
      .getSubModuleDocuments(projectId, moduleId, "ACTIVE", value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            var tempData = [];
            var temp = res.data.data;
            let counter = 1;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                show_to_all: temp[key].show_to_all,
                project_name: temp[key].project_name,
                module_name: temp[key].module_name,
                is_active: temp[key].is_active,
                document_attachment: temp[key].document_attachment,
              });
            }
            setDocList(null);
            setDocList(tempData);
          }
        }
      });
  };

  const fetchActiveData = async (projectId, moduleId, value) => {
    setSubModuleValue(value);
    await new SubModuleService()
      .getSubModuleDocuments(projectId, moduleId, "ACTIVE", value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            var tempData = [];
            var temp = res.data.data;
            let counter = 1;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                show_to_all: temp[key].show_to_all,
                project_name: temp[key].project_name,
                module_name: temp[key].module_name,
                is_active: temp[key].is_active,
                document_attachment: temp[key].document_attachment,
              });
            }
            setDocList(null);
            setDocList(tempData);
          }
        }
      });
  };

  const uploadDocHandler = async (e) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    e.preventDefault();
    setNotify();
    const form = new FormData(e.target);
    const value = parseInt(form.getAll("submodule_id"));
    await new SubModuleService().postSubModuleDocument(form).then((res) => {
      if (res?.data?.status === 1) {
        setNotify({ type: "success", message: res?.data?.message });
        handleModal({ showModal: false, modalData: "", modalHeader: "" });
        fetchActiveData(projectId, moduleId, value);
      } else {
        setNotify({ type: "danger", message: res?.data?.message });
      }
    });
    await new SubModuleService()
      .getSubModuleDocuments(projectId, moduleId, subModuleValue)
      .then((res) => setDocList(res.data.data));
    setIsLoading(false);
  };

  // ids: [1, 2, 3];
  // is_active: 0 / 1;
  const deleteRestoreDoc = async () => {
    try {
      if (isLoading) {
        return;
      }
      setIsLoading(true);
      const payload = {};
      let idArr = [];
      for (let i = 0; i < selectedData.length; i++) {
        idArr.push(selectedData[i].id);
      }
      payload.ids = [...idArr];
      if (selectedData[0].is_active) {
        payload.is_active = 0;
      } else {
        payload.is_active = 1;
      }
      console.log("idArr", payload);
      await new SubModuleService()
        .deleteAndRestoreSubModuleDocuments(payload)
        .then((res) => {
          if (res?.data?.status === 1) {
            setNotify();
            setNotify({ type: "success", message: res?.data?.message });
          } else {
            setNotify({ type: "danger", message: res?.data?.message });
          }
        });

      await new SubModuleService()
        .getSubModuleDocuments(projectId, moduleId, subModuleValue)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              var tempData = [];
              var temp = res.data.data;
              let counter = 1;

              for (const key in temp) {
                tempData.push({
                  counter: counter++,
                  id: temp[key].id,
                  show_to_all: temp[key].show_to_all,
                  project_name: temp[key].project_name,
                  module_name: temp[key].module_name,
                  is_active: temp[key].is_active,
                  document_attachment: temp[key].document_attachment,
                });
              }
              setDocList(null);
              setDocList(tempData);
            }
          }
        });
      setIsLoading(false);
    } catch (error) {
      setNotify({ type: "danger", message: error });
      setIsLoading(false);
    }
  };

  const columns = [
    {
      name: "Sr no",
      selector: (row) => row.counter,
      sortable: true,

      width: "10%",
    },

    {
      name: "Show to all",
      sortable: false,
      cell: (row) => {
        return (
          <>
            <input type="checkbox" checked={true} />
          </>
        );
      },
      width: "10%",
    },
    {
      name: "Actions",
      selector: () => "world",
      sortable: true,
      cell: (row) => (
        <>
          <div className="d-flex">
            <p>
              <i
                className="icofont-history me-3 btn btn-sm btn-primary text-white"
                style={{ color: "#000AFF" }}
              ></i>
            </p>
            <p
              style={{ display: row.is_active === 0 ? "none" : "block" }}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Preview"
            >
              <a
                href={_attachmentUrl + row?.document_attachment}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="icofont-download me-3 btn btn-sm btn-secondary text-white"
                  style={{ color: "#F19828" }}
                ></i>
              </a>
            </p>
            {/* <p
              onClick={() => deleteRestoreDoc(row)}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={row.is_active === 1 ? "Delete" : " Restore"}
            >
              {row.is_active == 1 ? (
                <i
                  className="icofont-ui-delete btn btn-sm btn-danger text-white "
                  style={{ color: "#E23434" }}
                ></i>
              ) : (
                <i className="icofont-save btn btn-sm btn-info text-white"></i>
              )}
            </p> */}
          </div>
        </>
      ),
      width: "20%",
    },
    {
      name: "File Name",
      selector: (row) => row.document_attachment,
      sortable: true,
      width: "20%",
      cell: (row) => {
        let file = row.document_attachment;
        let splittedName = file.split("/");
        setFileName(splittedName[splittedName.length - 1]);
        return <p>{splittedName[splittedName.length - 1]}</p>;
      },
    },
    {
      name: "Project Name",
      selector: (row) => row.project_name,
      sortable: true,
      width: "20%",
    },
    {
      name: "Module Name",
      selector: (row) => row.module_name,
      sortable: true,
      width: "20%",
    },
  ];

  const conditionalRowStyles = [
    {
      when: (row) => row.is_active == 0,
      style: {
        backgroundColor: "#D3D3D3",
        fontWeight: "bold",
      },
    },
  ];

  const handleShowToAll = (e) => {
    if (e.target.checked) {
      setShowToAll(1);
    } else {
      setShowToAll(0);
    }
  };

  const handleDataShow = async (type) => {
    if (subModuleValue) {
      await new SubModuleService()
        .getSubModuleDocuments(projectId, moduleId, type, subModuleValue)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              var tempData = [];
              var temp = res.data.data;
              let counter = 1;
              for (const key in temp) {
                tempData.push({
                  counter: counter++,
                  id: temp[key].id,
                  show_to_all: temp[key].show_to_all,
                  project_name: temp[key].project_name,
                  module_name: temp[key].module_name,
                  is_active: temp[key].is_active,
                  document_attachment: temp[key].document_attachment,
                });
              }
              setDocList(null);
              setDocList(tempData);
            }
          }
        });
    }
    if (type === "ACTIVE") {
      setShowbtn(true);
    } else if (type === "DEACTIVE") {
      setShowbtn(false);
    }
  };

  const selectedDOC = (e) => {
    setSelectedData(e.selectedRows);
    const idArray = e.selectedRows.map((d) => d.id);
    setSelectedRows(idArray);
  };
  useEffect(() => {
    loadData();
   
  }, []);
  console.log(selectedRows)
  return (
    <>
      <div className=" card col-md-6 w-100">
        <div className="card-body">
          {notify && <Alert alertData={notify} />}
          <div className="d-flex align-items-center justify-content-center mt-5 mb-4">
            <div className="lesson_name">
              <div className={"project-block bg-lightgreen"}>
                <i class="icofont-briefcase"></i>
              </div>

              <span className="small text-muted project_name fw-bold text-center">
                {data && data.project_name}
              </span>
              <h6 className="mb-0 fw-bold  fs-6  mb-2">
                {data && data.module_name}
              </h6>
            </div>
          </div>

          <div className="row  g-2 pt-2">
            <div className="col-6">
              <div className="d-flex  align-items-center justify-content-center">
                <i className="icofont-sand-clock"></i>
                <Link
                  to={`/${_base}/PendingTicket/` + projectId + "/" + moduleId}
                >
                  <span className="ms-2">
                    {/* {data && data.ticket.In_Progress} Pending Tickets */}
                    {data && data.details.ticket.PENDING} Pending Tickets
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center justify-content-center">
                <i className="icofont-tasks"></i>
                <Link
                  to={`/${_base}/PendingTask/` + projectId + "/" + moduleId}
                >
                  <span className="ms-2">
                    {/* {data && data.task.TO_DO} pending Tasks */}
                    {data && data.details.task.IN_PROGRESS} pending Tasks
                  </span>
                </Link>
              </div>
            </div>

            <div className="col-6">
              <div className="d-flex align-items-center justify-content-center">
                <i class="icofont-ticket"></i>
                <Link
                  to={`/${_base}/CompletedTicket/` + projectId + "/" + moduleId}
                >
                  <span className="ms-1">
                    {/* {data && data.ticket.Complete}  Completed Tickets */}
                    {data && data.details.ticket.COMPLETED} Completed Tickets
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-6">
              <div className="d-flex align-items-center justify-content-center ">
                <i class="icofont-bomb"></i>
                <Link
                  to={`/${_base}/DelayedTask/` + projectId + "/" + moduleId}
                >
                  <span className="ms-2">
                    {data && data.details.task.IN_PROGRESS} Delayed Tasks
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* new document add/delete/restore document feature */}

      {/* <button
        className=" col-2 mt-5 btn btn-primary "
        onClick={() => setToggleList(!toggleList)}
      >
        {toggleList ? (
          <i class="icofont-minus"> Hide Document</i>
        ) : (
          <i class="icofont-plus"> Show Document</i>
        )}
      </button> */}

      <div>
        <div className="col mt-5 mb-4 ">
          <div className="px-2 border border border-dark border-2 ">
            <div className="row align-items-center justify-content-between py-2 mt-2">
              <div className="col-4">
                <div className="d-md-flex ">
                  <label className="form-label col-sm-3 mt-2 me-2 fw-bold">
                    Sub Module:
                  </label>
                  {subModuleDropdown && (
                    <Select
                      className="w-100"
                      options={subModuleDropdown}
                      ref={submoduleRef}
                      onChange={changeSubModuleHandle}
                      name="submodule_id"
                    />
                  )}
                </div>
              </div>
              {subModuleValue && (
                <div className="col-4 text-center">
                  <div className="row">
                    <label className="col-md-3 form-label font-weight-bold">
                      Show DOC :<Astrick color="red" size="13px" />
                    </label>
                    <div className="col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active_1"
                          value="1"
                          onChange={() => {
                            handleDataShow("ACTIVE");
                          }}
                          defaultChecked={true}
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
                          onChange={() => {
                            handleDataShow("DEACTIVE");
                          }}
                          value="0"
                          readOnly={modal.modalData ? false : true}
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
              <div className="col-4 text-center">
                {subModuleValue && showbtn === true && docList && (
                  <button type="button" className="btn btn-danger" onClick={deleteRestoreDoc}>
                    Delete
                  </button>
                )}
                {subModuleValue && showbtn === false && docList && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={deleteRestoreDoc}
                  >
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    handleModal({
                      showModal: true,
                      modalData: null,
                      modalHeader: "Add Documents",
                    });
                  }}
                >
                  Add Files
                </button>
              </div>
            </div>
          </div>
        </div>
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
            onSubmit={uploadDocHandler}
            encType="multipart/form-data"
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input type="hidden" value={projectId} name="project_id" />
              <input type="hidden" value={moduleId} name="module_id" />
              <div className="deadline-form">
                <div className="d-md-flex ">
                  <label className="form-label col-sm-3 mt-2 me-2 fw-bold">
                    Sub Module:
                  </label>
                  {subModuleDropdown && (
                    <Select
                      className="w-100"
                      options={subModuleDropdown}
                      name="submodule_id"
                    />
                  )}
                </div>
                <div className="row g-3 mb-3 mt-2">
                  <input
                    type="file"
                    name="document_attachment"
                    id="document_attachment[]"
                    multiple
                  />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{
                  backgroundColor: "#484C7F",
                  width: "80px",
                  padding: "8px",
                }}
              >
                Submit
              </button>

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
        <div className="col">
          {docList && (
            <DataTable
              columns={columns}
              data={docList}
              defaultSortField="title"
              conditionalRowStyles={conditionalRowStyles}
              pagination
              selectableRows={true}
              onSelectedRowsChange={selectedDOC}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />
          )}
        </div>
      </div>
    </>
  );
}
