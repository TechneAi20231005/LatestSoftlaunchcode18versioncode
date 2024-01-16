import React, { useState, useEffect, useRef } from "react";
// import { ProgressBar } from "react-bootstrap";
import FileSaver, { saveAs } from "file-saver";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import ConsolidatedService from "../../services/ProjectManagementService/ConsolidatedService";
import GeneralSettingService from "../../services/SettingService/GeneralSettingService";
import { _apiUrl, _attachmentUrl, _base } from "../../settings/constants";

import DataTable from "react-data-table-component";
import Select from "react-select";
import SubModuleService from "../../services/ProjectManagementService/SubModuleService";
import ModuleService from "../../services/ProjectManagementService/ModuleService";
import Alert from "../../components/Common/Alert";
import { Modal, Button } from "react-bootstrap";

export default function ProjectwiseModule() {

  const params = useParams();
  const { projectId, moduleId } = params;
  const location = useLocation();
  const [data, setData] = useState(null);
  const [isProjectOwner, setIsProjectOwner] = useState(null)
  const [idd, setId] = useState(null);
  const [submoduleData, setSubmoduleData] = useState([]);
  const [subModuleDropdown, setSubModuleDropdown] = useState(null);
  const [moduleDropdown, setModuleDropdown] = useState(null);
  const [show, setShow] = useState("");
  const [showToALL, setShowToAll] = useState(false);
  const [docList, setDocList] = useState([]);
  const [toggleRadio, setToggleRadio] = useState(true);
  const [subModuleValue, setSubModuleValue] = useState(0);
  const [fileName, setFileName] = useState("");
  const [notify, setNotify] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showbtn, setShowbtn] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedData, setSelectedData] = useState();
  const [checkDelete, setCheckDelete] = useState();
  const [authorityCheck, setAuthorityCheck] = useState(false)
  const [isProjectActive, setIsProjectActive] = useState(1)
  const [isModuleActive, setIsModuleActive] = useState(1);
  const [isSubModuleActive, setIsSubModuleActive] = useState(1);
  const [attachments, setAttachments] = useState([]);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const handleModal = (data) => {
    setModal(data);
  };
  const submoduleRef = useRef(null);
  const moduleRef = useRef(null);

  const loadData = async () => {
    const userId = sessionStorage.getItem("id");

    // await new ConsolidatedService().getConsolidatedView().then(res => console.log("res project", res.data.data));

    await new ConsolidatedService()

      .getProjectsModules(projectId, moduleId)
      .then((res) => {

        if (res.status === 200) {
          if (res.data.status === 1) {
            setData(null);
            setData(res.data.data);
            setId(res.data.data.id);
            setIsProjectActive(res?.data?.data?.is_project_active)
          }
        }
      });

    await new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res?.data?.data;
          // const a = res.data.data.filter((d) => d.module_id);  

          const findModuleActivity = temp.filter(module => module.id == moduleId);
          setIsModuleActive(findModuleActivity[0]?.is_active);

          setModuleDropdown(
            temp
              .filter((d) => d.id == moduleId)
              .map((d) => ({ value: d.id, label: d.module_name }))
          );
        }
      }
    });
    await new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          // const a = res.data.data.filter((d) => d.module_id);
          setSubmoduleData(res.data.data);
          const findSubModuleActivity = temp.filter(subModule => subModule.id == subModuleValue);
          // setIsSubModuleActive(findModuleActivity[0]?.is_active);
          setSubModuleDropdown(
            temp
              .filter((d) => d.module_id == moduleId)
              .map((d) => ({ value: d.id, label: d.sub_module_name }))
          );
        }
      }
    });

    await new SubModuleService()
      .getSubModuleDocuments(
        projectId,
        moduleId,
        "ACTIVE",
        subModuleValue ? subModuleValue : 0
      )
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setToggleRadio(true);
            let count = 1;
            let temp = res.data.data;
            for (let i = 0; i < temp.length; i++) {
              temp[i].counter = count++;
            }
            setDocList(temp);
          }
        }
      });

    try {
      await new GeneralSettingService().getAuthorityCheck(userId, projectId).then(res => {
        if (res?.status === 200 && res?.data?.status == 1) {
          const authorityData = res?.data?.data?.result;
          setIsProjectOwner(res?.data?.data?.is_projectOwner);
          const checked = authorityData.find(d => d.setting_name === "Show To ALL")
          const deleteCheck = authorityData.find(d => d.setting_name === "Delete DOC")
          if (checked) {
            setAuthorityCheck(true);
          } else {
            setAuthorityCheck(false);
          }
          if (deleteCheck) {
            setCheckDelete(true)
          } else {
            setCheckDelete(false)
          }
        }

      })

    } catch (error) {
      console.error("Error fetching authority data:", error);
    }

  };

  const changeSubModuleHandle = async (e, type) => {
    if (e === null) {
      return;
    }
    const { value, label } = e;
    if (type === "SUBMODULE") {
      setSubModuleValue(value);
      if (moduleRef.current) {
        moduleRef.current.clearValue()
      }
      const findSubModuleActivity = submoduleData.filter(subModule => subModule.id == value);
      setIsSubModuleActive(findSubModuleActivity[0].is_active)
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
              setToggleRadio(true)
              setDocList(tempData);
            }
          }
        });
    } else if (type === "MODULE") {
      if (submoduleRef.current) {
        submoduleRef.current.clearValue()
        setSubModuleValue(0)
      }
      await new SubModuleService()
        .getSubModuleDocuments(projectId, moduleId, "ACTIVE", 0)
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
                  sub_module_name: temp[key].sub_module_name,
                  is_active: temp[key].is_active,
                  document_attachment: temp[key].document_attachment,
                });
              }
              setDocList(null);
              setToggleRadio(true)
              setDocList(tempData);
            }
          }
        });
    }

  };

  const uploadDocHandler = async (e) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setNotify(null);


    const form = new FormData(e.target);
    form.append("submodule_id", subModuleValue ? subModuleValue : 0);
    form.append("show_to_all", 1);
    await new SubModuleService().postSubModuleDocument(form).then((res) => {

      if (res?.data?.status === 1) {
        setNotify({ type: "success", message: res?.data?.message });
        handleModal({ showModal: false, modalData: "", modalHeader: "" });
      } else {
        setNotify({ type: "danger", message: res?.data?.message });
      }
    });
    await new SubModuleService()
      .getSubModuleDocuments(
        projectId,
        moduleId,
        "ACTIVE",
        subModuleValue ? subModuleValue : 0
      )
      .then((res) => setDocList(res.data.data));
    setIsLoading(false);
    setToggleRadio(true);
  };

  const downloadFile = async (e, url) => {
    e.preventDefault();
    const binaryLink =
      _attachmentUrl +
      "storage/app/Attachment/ProjectManagement/Submodule/Screenshot (2).png";
    saveAs(binaryLink, "downloadedFile.png");
  };

  const fetchData = async (e) => {
    await new SubModuleService()
      .getSubModuleDocuments(projectId, moduleId, "ACTIVE", subModuleValue ? subModuleValue : 0).then(res => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            let count = 1;
            let temp = res.data.data;
            for (let i = 0; i < temp.length; i++) {
              temp[i].counter = count++
            }
            setDocList(temp)
          }
        }
      });
  }

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
        setToggleRadio(false)
        deleteAndFetch("DEACTIVE")

      } else {
        payload.is_active = 1;
        deleteAndFetch("ACTIVE")
        setToggleRadio(false)
      }

      async function deleteAndFetch(status) {
        await new SubModuleService()
          .deleteAndRestoreSubModuleDocuments(payload)
          .then((res) => {
            if (res?.data?.status === 1) {
              if (status === "ACTIVE") {
                setToggleRadio(true);
                setSelectedRows([])
                // setShowbtn(true)
              } else if (status === "DEACTIVE") {
                setToggleRadio(false);
                setSelectedRows([])

                // setShowbtn(false)
              }
              setNotify({ type: "success", message: res?.data?.message });
            } else {
              setNotify({ type: "danger", message: res?.data?.message });
            }
          });

        await new SubModuleService()
          .getSubModuleDocuments(
            projectId,
            moduleId,
            status,
            subModuleValue ? subModuleValue : 0
          )
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

      setIsLoading(false);
    } catch (error) {
      setNotify({ type: "danger", message: error });
      setIsLoading(false);
    }
  };

  const dontShowToAll = async (e, row) => {
    let value = e.target.checked
    let sendVal;
    if (value === true) {
      sendVal = 1
    } else {
      sendVal = 0
    }
    const form = { "show_to_all": sendVal }
    await new SubModuleService().updateProjectDocument(row.id, form).then((res) => {
      if (res.status === 200 && res.data.status == 1) {
        fetchData()
      }
    })
  }

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
            <input type="checkbox" onChange={(e) => { dontShowToAll(e, row) }} disabled={!authorityCheck && isProjectOwner === 0} defaultChecked={row.show_to_all == 1 || isProjectOwner === 1 ? true : false} />
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
          <div className="d-flex align-items-center justify-content-center">
            <p className="mb-0"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="History"
            >
              <Link to={`/${_base}/ConsolidatedView/ProjectwiseModule/${projectId}/${moduleId}/${row.id}`}>
                <i className="icofont-history btn btn-sm btn-info text-white"></i>
              </Link>
            </p>

            <p
              style={{ display: row.is_active === 0 ? "none" : "block" }}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Download"
              className="mb-0"
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
          </div>
        </>
      ),
      width: "20%",
    },
    {
      name: "File Name",
      selector: (row) => row.document_attachment
      ,
      sortable: true,
      width: "20%",
      cell: (row) => {
        let file = row.document_attachment;
        let splittedName = file.split("/");
        // setFileName(splittedName[splittedName.length - 1]);
        return <p className="mb-0">{splittedName[splittedName.length - 1]}</p>;
      },
    },
    {
      name: "Project Name",
      selector: (row) => row.project_name,
      sortable: true,
    },
    {
      name: "Module Name",
      selector: (row) => row.module_name,
      sortable: true,
    },
    {
      name: "SubModule Name",
      selector: (row) => row.sub_module_name,
      sortable: true,
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
    await new SubModuleService()
      .getSubModuleDocuments(projectId, moduleId, type, subModuleValue ? subModuleValue : 0)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            if (type === "ACTIVE") {
              setShowbtn(true);
              setToggleRadio(true)
            } else if (type === "DEACTIVE") {
              setShowbtn(false);
              setToggleRadio(false)
            }
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

    if (type === "ACTIVE") {
      setShowbtn(true);
    } else if (type === "DEACTIVE") {
      setShowbtn(false);
    }
  };

  const selectedDOC = (e) => {
    if (!toggleRadio) {
      setShowbtn(false)
    } else {
      setShowbtn(true)
    }
    setSelectedData(e.selectedRows);
    const idArray = e.selectedRows.map((d) => d.id);
    setSelectedRows(idArray);
  };


  const uploadAttachmentHandler = (event) => {
    const files = event.target.files;
    const filesArray = Array.from(files);
    setAttachments((prevAttachments) => [...prevAttachments, ...filesArray]);
  };


  useEffect(() => {
    loadData();

  }, []);

  return (
    <>
      <div className=" card col-md-6 w-100">
        <div className="card-body">
          {notify && <Alert alertData={notify} />}
          <div className="d-flex align-items-center justify-content-center mt-5 mb-4">
            <div className="lesson_name">
              <div className={"project-block bg-lightgreen"}>
                <i className="icofont-briefcase"></i>
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
                <i className="icofont-ticket"></i>
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
                <i className="icofont-bomb"></i>
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

      <div>
        <div className="col mt-5 mb-4 ">
          <div className="px-2 border border border-dark border-2 ">
            <div className="row align-items-center justify-content-between py-2 mt-2">
              <div className="col-4">
                <div className="d-md-flex ">
                  <label className="form-label col-sm-3 mt-2 me-2 fw-bold">
                    Module:
                  </label>
                  {moduleDropdown && (
                    <Select
                      className="w-100"
                      options={moduleDropdown}
                      ref={moduleRef}
                      onChange={(e) => { changeSubModuleHandle(e, "MODULE") }}
                      name="submodule_id"
                    />
                  )}
                </div>
                {subModuleDropdown && subModuleDropdown.length > 0 && (
                  <div className="d-md-flex mt-2">
                    <label className="form-label col-sm-3 mt-2 me-2 fw-bold">
                      Sub Module:
                    </label>
                    <Select
                      className="w-100"
                      options={subModuleDropdown}
                      ref={submoduleRef}
                      onChange={(e) => { changeSubModuleHandle(e, "SUBMODULE") }}
                      name="submodule_id"
                    />

                  </div>
                )}
              </div>

              <div className="col-4 text-center">
                <div className="row align-items-center">
                  <label className="col-md-3 form-label font-weight-bold">
                    Status :
                    {/* Show DOC :<Astrick color="red" size="13px" /> */}
                  </label>
                  <div className="col-md-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="is_active"
                        id="is_active_1"
                        value="1"
                        checked={toggleRadio}
                        onChange={() => {
                          handleDataShow("ACTIVE");
                          setToggleRadio(true);
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
                        checked={!toggleRadio}
                        onChange={() => {
                          handleDataShow("DEACTIVE");
                          setToggleRadio(false);
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

              <div className={isProjectActive === 1 ? "d-block col-4 text-center" : "d-none col-4 text-center"}>
                {showbtn === true && docList && selectedRows?.length > 0 && (
                  <button type="button" disabled={(isProjectOwner !== 1 && !checkDelete) ? true : false} className="btn btn-danger" onClick={deleteRestoreDoc}>
                    Delete Files
                  </button>
                )}
                {showbtn === false && docList && selectedRows?.length > 0 && (
                  <button
                    type="button"
                    disabled={(isProjectOwner !== 1 && !checkDelete) ? true : false} className="btn btn-success"
                    onClick={deleteRestoreDoc}
                  >
                    Restore
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!isProjectActive || !isModuleActive || !isSubModuleActive}
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
                <div className="row g-3 mb-3 mt-2">
                  <input
                    type="file"
                    onChange={(e) => { uploadAttachmentHandler(e) }}
                    name="document_attachment[]"
                    id="document_attachment[]"
                    multiple="multiple"
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
          {docList && (<>
            <span style={{ fontStyle: "italic", color: "blue", fontWeight: "bold" }}>Note:</span>
            <br />
            <span style={{ fontStyle: "italic", color: "red", fontWeight: "bold" }}>1) Please Select Documents for Delete and Restore</span>
            <br />
            <span style={{ fontStyle: "italic", color: "red", fontWeight: "bold" }}>2) Please Select Deactive To Check Deleted Documents</span>
            <br />
            <span style={{ fontStyle: "italic", color: "red", fontWeight: "bold" }}>3) Please Select Module or Submodule to Filter The Documents</span>
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
          </>)}
        </div>
      </div>
    </>
  );
}
