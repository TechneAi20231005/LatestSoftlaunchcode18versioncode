import React, { useEffect, useState, useRef } from "react";
import { Modal, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import { _attachmentUrl } from "../../../../settings/constants";
import { UserDropdown } from "../../../../screens/Masters/UserMaster/UserComponent";
import Select from "react-select";
import {
  postTask,
  updateTask,
  getTaskUser,
} from "../../../../services/TicketService/TaskService";
import {
  getAttachment,
  deleteAttachment,
} from "../../../../services/OtherService/AttachmentService";
import Alert from "../../../../components/Common/Alert";
import * as Validation from "../../../../components/Utilities/Validation";
import UserService from "../../../../services/MastersService/UserService";
import TaskTicketTypeService from "../../../../services/MastersService/TaskTicketTypeService";
import TestCasesService from "../../../../services/TicketService/TestCaseService";

export default function TaskModal(props) {
  const [notify, setNotify] = useState();
  const typeRef = useRef();
  const [parent, setParent] = useState();
  const priority = ["High", "Medium", "Low"];
  const [allTask, setAllTask] = useState();
  const [userData, setUserData] = useState();
  const [defaultUserData, setDefaultUserData] = useState();
  const [attachment, setAttachment] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const [todateformat, setTodateformat] = useState("");
  const [fromdateformat, setFromdateformat] = useState("");
  // const [taskDropdown, setTaskDropdown] = useState();


  const handleFromDate = (e) => {
    setFromdate(e.target.value);
    // const gettodatevalue = e.target.value;
    // const setdateformat = gettodatevalue.split('-');
    // const settoyear = setdateformat[0];
    // const settomonth = setdateformat[1];
    // const settodate = setdateformat[2];
    // const settodateformat = settoyear + "" + settomonth + "" + settodate;
    // setTodate(gettodatevalue);
    // setTodateformat(settodateformat);
  };

  const handleToDate = (e) => {
    // const getfromdatevalue = e.target.value;
    // const setfromformat = getfromdatevalue.split("-");
    // const setfromyear = setfromformat[0];
    // const setfrommonth = setfromformat[1];
    // const setfromdate = setfromformat[2];
    // const setfromformatdate = setfromyear + "" + setfrommonth + "" + setfromdate;
    // setFromdate(getfromdatevalue);
    // setFromdateformat(setfromformatdate);
  };




  const handleClose = () => {
    const timer = setTimeout(() => {
      props.close();
      props.loadBasket();
      clearInterval(timer);
   }, 2000);
  };
  const [filteredOptions, setFilteredOptions] = useState();
  const [tasktypeDropdown, setTasktypeDropdown] = useState();
  
  const loadData = async () => {
    setSelectedFile([]);
    const tempUserData = [];
    const tempDefaultUserData = [];

    // await new TestCasesService().getTaskBytTicket(props.data.ticket_id).then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const temp = res.data.data;
    //       setTaskDropdown(
    //         temp.map((d) => ({ value: d.id, label: d.task_name }))
    //       );
    //     }
    //   }
    // });
    
    setFilteredOptions(
      props.taskDropdown.filter((d) => d.value != props.data.id)
      );
    const inputRequired = "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status == 200) {
        const data1 = res.data.data;
        const data = data1.filter((d) => d.is_active === 1);
        for (const key in data) {
          tempUserData.push({
            value: data[key].id,
            label:
              data[key].first_name +
              " " +
              data[key].last_name +
              " (" +
              data[key].id +
              ")",
          });
          if (props.data && props.data.assign_to_user) {
            if (props.data.assign_to_user.includes(data[key].id)) {
              tempDefaultUserData.push({
                value: data[key].id,
                label:
                  data[key].first_name +
                  " " +
                  data[key].last_name +
                  " (" +
                  data[key].id +
                  ")",
              });
            }
          }
        }
        setDefaultUserData(tempDefaultUserData);
        const aa = tempUserData.sort(function (a, b) {
          return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
        });
        setUserData(aa);
      }
    });
    const allTask = props.allTaskList.filter(
      (task) => task.value != props.data.id
    );
    setAllTask(allTask);
    loadAttachment();

    // await new TaskTicketTypeService().getAllType().then((res) => {
//   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const temp = res.data.data;
    //       setTasktypeDropdown(
    //         temp
    //           .filter((d) => d.type === "TASK" && d.is_active == 1)
    //           .map((d) => ({ value: d.id, label: d.type_name }))
    //       );
    //     }
    //   }
    // });

    await new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          if (res.status === 200) {
            const mappedData = res.data.data.map((d) => ({
              value: d.id,
              label: d.type_name,
            }));

            setParent(mappedData);
            // parentName(mappedData);
          } else {
            console.error("error", res.status);
          }
        }
      }
    });
  };

  const loadAttachment = async () => {
    setNotify(null);
    if (props.data.id) {
      await getAttachment(props.data.id, "TASK").then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  const uploadAttachmentHandler = (e, type, id = null) => {
    // if (type === "UPLOAD") {
    //   var tempSelectedFile = [];

    //   for (var i = 0; i < e.target.files.length; i++) {
    //     tempSelectedFile.push({
    //       file: e.target.files[i],
    //       show_to_customer: 0,
    //       show_to_project_owner: 0,
    //     });
    //   }
    //   fileInputRef.current.value = "";
    //   setSelectedFile(tempSelectedFile);

    // if (type === "UPLOAD") {         // updated by Asmita Margaje
    //   const selectedFilesCount = selectedFile.length;
    //   const newFiles = Array.from(e.target.files)
    //     .filter((file, index) => index < 5 - selectedFilesCount) // Limit to available slots
    //     .map((file) => ({
    //       file,
    //       show_to_customer: 0,
    //       show_to_project_owner: 0,
    //     }));

    //   if (newFiles.length === 0) {
    //     // All available slots already used
    //     alert("You can only upload a maximum of 5 files.");
    //   } else {
    //     setSelectedFile((prevSelectedFiles) => [
    //       ...prevSelectedFiles,
    //       ...newFiles,
    //     ]);

    if (type === "UPLOAD") {
      const selectedFilesCount = selectedFile.length;
      const maxTotalSizeMB = 10; // Maximum total size in MB

      // Calculate the total size of video files in the existing selected files
      const totalSizeBytesExisting = selectedFile
        .filter((file) => file.file.type.startsWith("video/"))
        .reduce((acc, currFile) => acc + currFile.file.size, 0);

      const newFiles = Array.from(e.target.files)
        .filter((file, index) => index < 5 - selectedFilesCount) // Limit to available slots
        .map((file) => ({
          file,
          show_to_customer: 0,
          show_to_project_owner: 0,
        }));

      if (newFiles.length === 0) {
        // All available slots already used
        alert("You can only upload a maximum of 5 files.");
      } else {
        // Calculate the total size of video files in the new selection
        const totalSizeBytesNew = newFiles
          .filter((file) => file.file.type.startsWith("video/"))
          .reduce((acc, currFile) => acc + currFile.file.size, 0);

        // Calculate the total size in MB
        const totalSizeMB =
          (totalSizeBytesExisting + totalSizeBytesNew) / (1024 * 1024);

        if (totalSizeMB > maxTotalSizeMB) {
          alert(
            `Total video file size exceeds ${maxTotalSizeMB} MB. Please reduce the size of your videos.`
          );
        } else {
          setSelectedFile((prevSelectedFiles) => [
            ...prevSelectedFiles,
            ...newFiles,
          ]);
        }

        // console.log("size",maxTotalSizeMB)
        // console.log("totalSizeBytes",totalSizeMB)

        // Clear the input field
        fileInputRef.current.value = "";
      }

      // console.log("selected",selectedFile)
    } else if (type === "DELETE") {
      let filteredFileArray = selectedFile.filter(
        (item, index) => id !== index
      );
      setSelectedFile(filteredFileArray);
    } else if (type === "CUSTOMER") {
      var file = selectedFile;
      file[id].show_to_customer = file[id].show_to_customer ? 0 : 1;
      setSelectedFile(file);
    } else if (type === "PROJECT_OWNER") {
      var file = selectedFile;
      file[id].show_to_project_owner = file[id].show_to_project_owner ? 0 : 1;
      setSelectedFile(file);
    } else {
      alert("Invalid Option");
    }
  };
  const handleDeleteAttachment = (e, id) => {
    deleteAttachment(id).then((res) => {
      loadAttachment();
    });
  };

  const assignUserRef = useRef();
  const handleForm = async (e) => {
    setLoading(true);

    e.preventDefault();
    const formData = new FormData(e.target);
    setNotify(null);
    //Appeding File in selected State
    formData.delete("attachment[]");
    formData.delete("show_to_customer[]");
    formData.delete("show_to_project_owner[]");
    if (selectedFile) {
      for (var i = 0; i < selectedFile.length; i++) {
        formData.append("attachment[]", selectedFile[i].file);

        formData.append("show_to_customer[]", selectedFile[i].show_to_customer);
        formData.append(
          "show_to_project_owner[]",
          selectedFile[i].show_to_project_owner
        );
      }
    }

    var flag = 1;
    // if (typeRef && typeRef.current.commonProps.hasValue == false) {
      //   alert("Plaese select task type");
      //   e.preventDefault();
      //   flag = 0;
    // } else {
      //   flag = 1;
    // }
    
    if (todateformat > fromdateformat) {
      alert("Please select End Date Greater than Start date");
      flag = 0;
      e.preventDefault();
    }

    var totalCount = 0;
    for (const pair of formData.entries()) {
      if (pair[0] == "assign_to_user[]") {
        totalCount++;
      }
    }

    if (formData.get("type") == "GROUP_ACTIVITY") {
      if (totalCount <= 1) {
        alert("Please select minimum 2 user for group activity !!!");
        flag = 0;
        e.preventDefault();
      }
    }
    // console.log(assignUserRef.current);
    // if(assignUserRef.current.value.length <2){
    //   alert("pelase select atleast two users")
    //   e.preventDefault();
    // }
    if (flag == 1) {
      if (todateformat > fromdateformat) {
        alert("Please select End Date Greater than Start date");
      } else {
        if (formData.get("id")) {
          const taskTypeId = typeRef.current.props.value.map((d) => {
             return d.value;
          });
          formData.append("task_type_id", taskTypeId);
          await updateTask(formData.get("id"), formData)
            .then((res) => {
              if (res.status === 200) {
                if (res.data.status === 1) {
                  // props.loadBasket();
                  setNotify({ type: "success", message: res.data.message });
    setLoading(false);

                  handleClose();
                } else {
                  setNotify({ type: "danger", message: res.data.message });
                }
              } else {
                setNotify({ type: "danger", message: res.message });
                new ErrorLogService().sendErrorLog(
                  "Ticket",
                  "Edit_Task",
                  "INSERT",
                  res.message
                );
              }
            })
            .catch((error) => {
              const { response } = error;
              const { request, ...errorObject } = response;
              new ErrorLogService().sendErrorLog(
                "Task",
                "Edit_Task",
                "INSERT",
                errorObject.data.message
              );
            });
        } else {
          await postTask(formData).then((res) => {
              if (res.status === 200) {
                if (res.data.status === 1) {
                  setNotify({ type: "success", message: res.data.message });
                  setLoading(false);

                  handleClose();
                  // props.loadBasket();
                } else {
                  setNotify({ type: "danger", message: res.data.message });
                }
              } else {
                setNotify({ type: "danger", message: res.data.message });
                new ErrorLogService().sendErrorLog(
                  "Ticket",
                  "Edit_Task",
                  "INSERT",
                  res.message
                );
              }
            });
            // .catch((error) => {
            //   const { response } = error;
            //   const { request, ...errorObject } = response;
            //   new ErrorLogService().sendErrorLog(
            //     "Task",
            //     "Create_Task",
            //     "INSERT",
            //     errorObject.data.message
            //   );
            // });
        }
      }
    }
  };

  const handleParentchange = async (e) => {
    if (typeRef.current) {
      typeRef.current.clearValue();
    }
    await new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data;
          setTasktypeDropdown(
            temp
              .filter((d) => d.type === "TICKET" && d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.type_name }))
          );
        }
      }
    });
  };

  // console.log("pp",props.loadBasket())

  // const handleGroupActivity=(event) =>{
  //   // console.log(e);
  //   // e.preventDefault()
  //   if (
  //     document.getElementById("task_type_group_activity").checked == true  &&
  //     assignUserRef.current.commonProps.selectProps.value.length < 1
  //   ) {
  //     alert("please select atleast two users for group activity");
  //     event.preventDefault();
  //   }
  // }

  useEffect(() => {
    loadData();
  }, []);
  return (
    <>
      <Modal
        size="lg"
        show={props.show}
        onHide={handleClose}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            <strong>Task Details</strong>
          </Modal.Title>
        </Modal.Header>
        {/* Ticket.{props.data.ticket_id}<br/>
          Basket.{props.data.ticket_basket_id}<br/>
          Task.{props.data.id}<br/>
        */}
         {notify && <Alert alertData={notify} />}
         
        <form onSubmit={handleForm} method="post" encType="multipart/form-data">
          <Modal.Body>
                       {props.data.id && (
              <input
                type="hidden"
                className="form-control form-control-sm"
                name="id"
                defaultValue={props.data.id}
              />
            )}
            <input
              type="hidden"
              className="form-control form-control-sm"
              name="ticket_id"
              defaultValue={
                props.data && props.data.ticket_id ? props.data.ticket_id : ""
              }
            />
            <input
              type="hidden"
              className="form-control form-control-sm"
              name="ticket_basket_id"
              defaultValue={
                props.data && props.data.ticket_basket_id
                  ? props.data.ticket_basket_id
                  : ""
              }
            />

            <div className="col-md-6">
              <div className="row">
                <div className="col-md-5">
                  <label className="form-label">
                    <b>Select Task Type :</b>
                  </label>
                </div>
                <div className="col-md-7">
                  {props.data && (
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="type"
                            id="task_type_type"
                            value="TASK"
                            defaultChecked={
                              props.data.type === "TASK" || !props.data.id
                            }
                          />
                          <label
                            className="form-check-label "
                            htmlFor="status_type"
                          >
                            Task
                          </label>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="type"
                            id="task_type_group_activity"
                            value="GROUP_ACTIVITY"
                            defaultChecked={
                              props.data.type === "GROUP_ACTIVITY"
                            }
                          />
                          {/* {console.log("props",props.data.type)} */}
                          <label
                            className="form-check-label"
                            htmlFor="status_group_activity"
                          >
                            Group Activity
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-12">
                <label className="form-label">
                  <b>Task Name : </b>
                </label>
                {props.data.task_name === null ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_name"
                    // defaultValue={props.data.task_name}
                    // onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    required
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_name"
                    defaultValue={props.data.task_name}
                    // onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    required
                  />
                )}

                {/* <input
                  type="text"
                  className="form-control form-control-sm"
                  name="task_name"
                  defaultValue={props.data.task_name}
                  // onKeyPress={e => { Validation.CharactersNumbersOnly(e) }}
              readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                  required
                  /> */}
              </div>
            </div>

<div className="col-md-12">
              <label className="form-label">
                <b>Parent Task Type : </b>
              </label>
              {parent && (
                <Select
                  name="parent_id"
                  id="parent_id"
                  options={parent}
                  onChange={(e) => handleParentchange(e)}
                  isDisabled={props.data.parent_id}
                  defaultValue={
                    props.data &&
                    tasktypeDropdown &&
                    tasktypeDropdown.filter(
                      (d) => d.value == props.data.parent_id
                    )
                  }
                />
              )}
            </div>
            {tasktypeDropdown && (
            <div className="col-md-12">
              <label className="form-label">
                <b>Task Type Name *: </b>
              </label>
              {tasktypeDropdown && (
                <Select
                  name="task_type_id"
                  id="task_type_id"
                  ref={typeRef}
                  options={tasktypeDropdown}
                  isDisabled={props.data.task_type_id}
                  defaultValue={
                      props.data &&
                      tasktypeDropdown &&
                      tasktypeDropdown.filter(
                        (d) => d.value == props.data.task_type_id
                      )
                    }
                />
              )}
            </div>
)}

            {/* *****************START DATE, END DATE , TASK HOURS**************** */}
            <div className="row mt-3">
              <div className="col-md-4">
                <label className="form-label">
                  <b>Start Date *:</b>
                </label>
                {props.data.start_date == null ? (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="startt_datee"
                    name="start_date"
                    onChange={handleFromDate}
                    // max={props.expectedSolveDate}
                    min={props.ticketStartDate}
                    // defaultValue={props.data.start_date}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    required

                    // min={new Date().toISOString().slice(0, 10)}
                  />
                ) : (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="startt_datee"
                    name="start_date"
                    onChange={handleFromDate}
                    // max={props.expectedSolveDate}
                    min={props.ticketStartDate}
                    defaultValue={props.data.start_date}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    required

                    // min={new Date().toISOString().slice(0, 10)}
                  />
                )}
              </div>
              <div className="col-md-4">
                <label className="form-label">
                  <b>End Date *:</b>
                </label>
                {props.data.end_date == null ? (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="end_date"
                    // defaultValue={props.data.end_date}
                    // onChange={handleToDate}
                    min={fromdate}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    // max={props.expectedSolveDate}
                    required
                    // onChange={e=>handleMinDate(e)}
                  />
                ) : (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="end_date"
                    defaultValue={props.data.end_date}
                    // onChange={handleToDate}
                    min={fromdate}
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    // max={props.expectedSolveDate}
                    required
                    // onChange={e=>handleMinDate(e)}
                  />
                )}
              </div>

              {/* {props.moduleSetting &&
                props.moduleSetting["RequiredHour"] == 1 && ( */}
              <div className="col-md-4">
                <label className="form-label">
                  <b>Task Hours *:</b>
                </label>
                {props.data.task_hours == null ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_hours"
                    defaultValue={
                      props.data.task_hours ? props.data.task_hours : "00:00"
                    }
                    required
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_hours"
                    defaultValue={
                      props.data.task_hours ? props.data.task_hours : "00:00"
                    }
                    required
                    // readOnly={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}
                  />
                )}
              </div>
              {/* )} */}
            </div>

            {/* ***************** PROPRITY AND STATUS**************** */}
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <b>Task Priority *:</b>
                </label>

                <select
                  className="form-select"
                  id="priority"
                  name="priority"
                  required
                  disabled={props.data.status === "COMPLETED" ? true : false}
                >
                  <option value="">Select Priority</option>
                  {priority.map((data) => {
                    if (props.data.priority && props.data.priority === data) {
                      return (
                        <option value={data} selected>
                          {data}
                        </option>
                      );
                    } else {
                      return <option value={data}>{data}</option>;
                    }
                  })}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">
                  <b>Select Status :</b>
                </label>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="status"
                        id="status_to_do"
                        value="TO_DO"
                        defaultChecked={props.data.status === "TO_DO"}
                        disabled={
                          props.data.status === "COMPLETED" ? true : false
                        }
                      />
                      <label
                        className="form-check-label "
                        htmlFor="status_to_do"
                      >
                        TO DO
                      </label>
                    </div>
                  </div>

                  {props.data.id && (
                    <div className="col-md-5">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status_in_progress"
                          value="IN_PROGRESS"
                          defaultChecked={
                            props.data.id && props.data.status === "IN_PROGRESS"
                          }
                          disabled={
                            props.data.status === "COMPLETED" ? true : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="status_in_progress"
                        >
                          IN PROGRESS
                        </label>
                      </div>
                    </div>
                  )}

                  {props.data.id && (
                    <div className="col-md-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="status"
                          id="status_completed"
                          value="COMPLETED"
                          defaultChecked={
                            props.data.id && props.data.status === "COMPLETED"
                          }
                          disabled={
                            props.data.status === "COMPLETED" ? true : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="status_completed"
                        >
                          COMPLETED
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ***************** DESCRIPTION **************** */}
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">
                  <b>Description :</b>
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="task_desc"
                  // rows={3}
                  defaultValue={props.data.task_desc}
                  readOnly={props.data.status === "COMPLETED" ? true : false}
                />
              </div>
            </div>
            {/* ***************** DEPENDENT TASK AND ASSIGNED USER **************** */}
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <b>Assign to user *:</b>
                </label>

                {defaultUserData?.length > 0 && userData && (
                  <Select
                    defaultValue={defaultUserData}
                    isMulti
                    isSearchable={true}
                    ref={assignUserRef}
                    id="assign_to_user[]"
                    name="assign_to_user[]"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={userData}
                    // onChange={(e)=>handleGroupActivity(e)}
                    required
                    // isDisabled={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}
                    isDisabled={
                      props.data.status === "COMPLETED" ? true : false
                    }
                  />
                )}
                {defaultUserData?.length == 0 && userData && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="assign_to_user[]"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={userData}
                    ref={assignUserRef}
                    required
                    // onChange={(e)=>handleGroupActivity(e)}
                    defaultValue={
                      userData &&
                      userData
                      .map((d) => ({ value: d.value, label: d.label }))
                      .filter((d) => d.value == localStorage.getItem("id"))
                    }
                    isClearable
                    // isDisabled={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}
                  />
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">
                  <b>Dependent Task :</b>
                </label>
                {props.data.id != null && props.taskDropdown && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="dependent_task[]"
                    options={
                      filteredOptions && filteredOptions ? filteredOptions : ""
                    }
                    // readOnly={props.data.status ==="COMPLETED" ? true :false}
                    // isDisabled={(props.data.status ==="COMPLETED") || (props.ownership !== "TICKET" || props.ownership !== "PROJECT") ? true :false}

                    defaultValue={
                      props.data &&
                      props.taskDropdown.filter((d) =>
                        props.data.dependentTaskId.includes(d.value)
                      )
                    }
                  />
                )}
                {props.data.id == null && props.taskDropdown && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="dependent_task[]"
                    options={filteredOptions && filteredOptions}
                  />
                )}
              </div>
            </div>

            {/* ***************** ATTACHMENT **************** */}
            <div className="row mt-3">
              <div className="col-md-12 ml-0 pl-0">
                <label className="form-label">
                  <b>Attachment : </b>
                </label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => {
                    uploadAttachmentHandler(e, "UPLOAD", "");
                  }}
                  readOnly={props.data.status === "COMPLETED" ? true : false}
                />
              </div>
            </div>

            {selectedFile && selectedFile.length > 0 && (
              <Table bordered size="sm">
                <thead>
                  <tr className="p-1">
                    <th className="p-1 text-center">Name</th>
                    <th className="p-1 text-center">Show To Customer</th>
                    <th className="p-1 text-center">Show To Project Owner</th>
                    <th className="p-1 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedFile.map((ele, i) => {
                    return (
                      <tr className="p-1">
                        <td className="p-1">
                          <b>{i + 1}.</b> {ele.file.name}
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              uploadAttachmentHandler(e, "CUSTOMER", i);
                            }}
                          />
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              uploadAttachmentHandler(e, "PROJECT_OWNER", i);
                            }}
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            className="btn btn-danger text-white btn-sm p-0 px-1 mt-0"
                            type="button"
                            onClick={(e) => {
                              uploadAttachmentHandler(e, "DELETE", i);
                            }}
                          >
                            <i
                              className="icofont-ui-delete"
                              style={{ fontSize: "12px" }}
                            ></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
            <div
              className="d-flex justify-content-start mt-2"
              style={{ overflowX: "auto" }}
            >
              {attachment &&
                attachment.map((attach, index) => {
                  return (
                    <div
                      className="justify-content-start"
                      style={{
                        marginRight: "5px",
                        padding: "0px",
                        width: "200px",
                      }}
                    >
                      <div
                        className="card"
                        style={{ backgroundColor: "#EBF5FB" }}
                      >
                        <div className="card-header">
                          <p style={{ fontSize: "12px" }}>
                            <b>{attach.name}</b>
                          </p>
                          <div className="d-flex justify-content-end p-0">
                            <a
                              href={`${_attachmentUrl + "/" + attach.path}`}
                              target="_blank"
                              className="btn btn-warning btn-sm p-0 px-1"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: "12px", height: "15px" }}
                              ></i>
                            </a>
                            <button
                              className="btn btn-danger text-white btn-sm p-0 px-1"
                              type="button"
                              onClick={(e) => {
                                handleDeleteAttachment(e, attach.id);
                              }}
                            >
                              <i
                                className="icofont-ui-delete"
                                style={{ fontSize: "12px" }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {/* {props && JSON.stringify(props.expectedSolveDate)} */}
            {/* { document.getElementById("task_type_group_activity").checked} */}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: "#484C7F" }}
              disabled={props.data.status === "COMPLETED" ? true : false}
            >
             {loading ? (
          <span>
            <i className="fa fa-spinner fa-spin" /> Loading...
          </span>
        ) : (
          "Submit"
        )}
              {/* Submit */}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: "#FFBA32" }}
              onClick={handleClose}
            >
              Close
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
