import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/Common/PageHeader";
import ErrorLogService from "../../../services/ErrorLogService";
import UserDropdown from "../UserMaster/UserDropdown";
import Alert from "../../../components/Common/Alert";
import TemplateService from "../../../services/MastersService/TemplateService";
import * as Validation from "../../../components/Utilities/Validation";
import { _base } from "../../../settings/constants";
import UserService from "../../../services/MastersService/UserService";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";

import { name } from "platform";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";

const CreateTemplateComponent = () => {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const roleId = sessionStorage.getItem("role_id");
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [checkRole, setCheckRole] = useState(null);

  const mainJson = {
    template_name: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: [],
        calculate_from: [],
      },
    ],
  };
  const [selectedBasket, setSelectedBasket] = useState();
  const [rows, setRows] = useState({
    template_name: null,
    calculate_from: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: [],
      },
    ],
  });
  const [userData, setUserData] = useState();

  const [stack, setStack] = useState({ SE: "", AB: "" });
  const [data, setData] = useState([]);
  const [taskTypeDropdown, setTaskTypeDropdown] = useState();
  const [parent, setParent] = useState();
  const [error, setError] = useState("");

  const loadData = async () => {
    await new TemplateService().getTemplate().then((res) => {
      setData(res.data.data);
    });
    // await new TaskTicketTypeService().getAllType().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status == 1) {
    //       const temp = res.data.data;
    //       setTaskTypeDropdown(
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
          } else {
            console.error("error", res.status);
          }
        }
      }
    });
    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data.filter((d) => d.is_active == 1);
          setUserData(
            temp.map((d) => ({
              value: d.id,
              label: d.first_name + " " + d.last_name,
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
  };

  const handleParentchange = async (e) => {
    if (typeRef.current) {
      typeRef.current.clearValue();
    }
    await new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const temp = res.data.data;
          setTaskTypeDropdown(
            temp
              .filter((d) => d.type === "TICKET" && d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.type_name }))
          );
        }
      }
    });
  };

  const handleCheckInput = (e, idx) => {
    if (rows.length > 1) {
      rows.forEach((ele) => {});
    }
  };
  const handleAddRow = async () => {
    let flag = 1;
    const item = { basket_name: null, basket_owner: null, basket_task: [] };

    if (flag === 1) {
      var temp = rows.template_data;

      temp.push(item);

      setRows({ ...rows, template_data: temp });
    } else {
      // setShowAlert({
      //   show: true,
      //   type: "warning",
      //   message: "Please Fill Previous Row Values",
      // });
    }
  };

  const handleRemoveSpecificRow = (idx) => () => {
    if (idx > 0) {
      setRows({
        template_data: rows.template_data.filter((_, i) => i !== idx),
      });
    }
  };

  const handleRemoveTask = (basketIndex, taskIndex) => {
    setRows((prevRows) => {
      const updatedTemplateData = [...prevRows.template_data];
      updatedTemplateData[basketIndex].basket_task.splice(taskIndex, 1);

      return {
        ...prevRows,
        template_data: updatedTemplateData,
      };
    });
  };

  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [isBasketNameTaken, setIsBasketNameTaken] = useState(false);
  const [iscalulatedFromTaken, setIsCalculatedFromTaken] = useState("");
  const typeRef = useRef();
  const shouldShowButton =
    selectedOption === "START_FROM" || selectedOption === "END_FROM";

  const showHandler = (e) => {
    setShow(true);
  };

  const handleChange = (e, idx, type, name) => {
    var value = type == "select2" ? e.value : e.target.value;
    if (type == "select1") {
      setSelectedOption(e.target.value);
      if (e.target.name == "basket_name" || e.target.name == "basket_task") {
        setRows((prev) => {
          const newPrev = { ...prev };
          newPrev.template_data[idx][e.target.name] = value;
          return newPrev;
        });
      }
    }
    if (name === "basket_owner") {
      setRows((prev) => {
        const newPrev = { ...prev };
        newPrev.template_data[idx][name] = value;
        return newPrev;
      });
    } else {
      setRows((prev) => {
        const newPrev = { ...prev };
        newPrev[e.target.name] = value;
        return newPrev;
      });
    }
  };
  const submitHandler = (e) => {
    setNotify(null);
    e.preventDefault();
    let a = 0;
    rows.template_data.forEach((ele, id) => {
      if (ele.basket_task.length == 0) {
        a++;
      }
    });
    if (a > 0) {
      setNotify(null);
      setNotify({ type: "warning", message: "Add Data" });
    } else {
      setNotify(null);
      new TemplateService()
        .postTemplate(rows)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data;

            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/Template`,
                },
                {
                  state: {
                    alert: { type: "success", message: res.data.message },
                  },
                }
              );
            } else {
              setNotify({ type: "danger", message: res.data.message });
            }
          } else {
            setNotify({ type: "danger", message: res.message });
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            "TemplateMaster",
            "Create_TemplateMaster",
            "INSERT",
            errorObject.data.message
          );
        });
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    var form = new FormData(e.target);
    var temp = {
      task_name: form.get("taskName"),
      task_type_id: form.get("task_type_id"),
      parent_id: form.get("parent_id"),
      total_time: form.get("hours"),
      days: form.get("days"),
      start_days: form.get("start_days"),
    };
    var basket_id = form.get("basket_id");
    var tempData = rows;
    tempData.template_data[basket_id].basket_task.push(temp);
    var a = tempData;
    setRows(null);
    setRows(tempData);
    // var doNull = document.getElementsByClassName("taskField")
    for (
      var i = 0;
      i < document.getElementsByClassName("taskField").length;
      i++
    ) {
      document.getElementsByClassName("taskField")[i].value = "";
    }
    if (typeRef && typeRef.current.commonProps.hasValue === true) {
      typeRef.current.clearValue();
    }
    if (document.getElementById("task_add").value != "") {
      document.getElementById("task_add").value = "";
    }
    if (document.getElementById("days_add").value != "") {
      document.getElementById("days_add").value = "";
    }
    if (document.getElementById("hours_add").value != "") {
      document.getElementById("hours_add").value = "";
    }
    if (document.getElementById("start_days").value != "") {
      document.getElementById("start_days").value = "";
    }
    setShow(false);
  };
  const [editTaskModal, setEditTaskModal] = useState({
    showModal: false,
    modalData: "",
    basketIndex: "",
    taskIndex: "",
    modalHeader: "",
  });

  // {({showModal:true, modalData:task}, i, index)}
  const handleEditTask = (data, basketIndex, idx) => {
    setEditTaskModal(data);
  };

  const handleCancelTask = (e) => {
    setShow(false);
  };

  const handleEditTaskData = (e, basketIndex, idx, type, event) => {
    if (type === "select2") {
      var value = event.value;
    } else {
      var value = e.target.value;
    }
    setRows((prevRows) => {
      const updatedTemplateData = [...prevRows.template_data];
      if (type === "select2") {
        updatedTemplateData[basketIndex].basket_task[idx][e.name] = value;
      } else {
        updatedTemplateData[basketIndex].basket_task[idx][e.target.name] =
          value;
      }

      return {
        ...prevRows,
        template_data: updatedTemplateData,
      };
    });
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[14].can_create === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Template Master" />
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            <div className="card-body">
              <form onSubmit={submitHandler}>
                <div className="mt-2"></div>
                <div className="form-group row mt-3">
                  <label className="col-sm-2 col-form-label">
                    <b>
                      Template Name :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-5">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="template_name"
                      name="template_name"
                      required
                      onChange={(e) => {
                        handleChange(e, name, "select1");
                      }}
                      // onKeyPress={(e) => {
                      //   Validation.CharactersOnly(e);
                      // }}
                    />
                    {error && <small style={{ color: "red" }}>{error}</small>}
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: "right" }}
                  >
                    <b>
                      Calculate Days From :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  <div className="col-sm-3">
                    <select
                      className="form-control form-control-sm"
                      id="calculate_from"
                      name="calculate_from"
                      onChange={(e, index) => {
                        handleChange(e, index, "select1");
                        setIsCalculatedFromTaken(() => e.target.value);
                      }}
                      required
                    >
                      <option value="">Calculate Days From</option>

                      <option value="START_FROM">From Start</option>
                      <option value="END_FROM">From End</option>
                    </select>
                  </div>
                </div>

                <div className="">
                  <table
                    className="table table-bordered mt-3 table-responsive"
                    id="tab_logic"
                  >
                    <thead>
                      <tr>
                        <th className="text-center"> # </th>
                        <th className="text-center"> Basket Name </th>
                        <th className="text-center"> Assign To </th>
                        <th className="text-center"> Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows &&
                        rows.template_data.map((item, idx) => (
                          <tr id={`addr_${idx}`} key={idx}>
                            <td>{idx + 1}</td>
                            <td>
                              <input
                                type="text"
                                name="basket_name"
                                defaultValue={item.basket_name}
                                onChange={(e) => {
                                  handleChange(e, idx, "select1");
                                }}
                                className="form-control form-control-sm"
                                required={true}
                                // onKeyPress={(e) => {
                                //   Validation.CharactersNumbersSpeicalOnly(e);
                                // }}
                              />
                              {/* {isBasketNameTaken && <span style={{ color: "red" }}>Basket name already taken</span>}   */}
                            </td>

                            <td>
                              {userData && (
                                <Select
                                  options={userData}
                                  id="basket_owner"
                                  name="basket_owner"
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      idx,
                                      "select2",
                                      "basket_owner"
                                    )
                                  }
                                />
                              )}
                            </td>

                            <td>
                              {idx === 0 && (
                                <span>
                                  <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="btn btn-sm btn-outline-primary pull-left"
                                  >
                                    <i className="icofont-plus-circle"></i>
                                  </button>
                                </span>
                              )}

                              {rows.template_data.length === idx + 1 &&
                                idx !== 0 && (
                                  <span>
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={handleRemoveSpecificRow(idx)}
                                    >
                                      <i className="icofont-ui-delete"></i>
                                    </button>
                                  </span>
                                )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="pull-right">
                  <button type="submit" class="btn btn-sm btn-primary">
                    Submit
                  </button>
                  <Link
                    to={`/${_base}/Template`}
                    class="btn btn-sm btn-primary"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row">
          {rows &&
            rows.template_data.map((data, index) => {
              var basketIndex = index;
              return (
                <>
                  <div key={basketIndex} className="col-md-4 ml-1 mt-4">
                    <h3>{data.basket_name}</h3>
                    {rows && rows.template_data[0].basket_name != null && (
                      <button
                        type="button"
                        class="btn btn-sm btn-primary"
                        onClick={(e) => {
                          showHandler();
                          setSelectedBasket(null);
                          setSelectedBasket(basketIndex);
                        }}
                      >
                        Create Task
                      </button>
                    )}

                    {data.basket_task.map((task, idx) => (
                      <div className="card card-body mt-1" key={idx}>
                        <div className="row justify-content-sm-end">
                          <button
                            className="btn btn-sm btn-danger"
                            style={{ width: "50px" }}
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  "Are you sure to delete this record?"
                                )
                              ) {
                                handleRemoveTask(basketIndex, idx);
                              }
                            }}
                          >
                            <i className="icofont-ui-delete"></i>
                          </button>
                          <button
                            type="button"
                            style={{ width: "50px" }}
                            className="btn btn-sm btn-info"
                            onClick={(e) => {
                              handleEditTask({
                                showModal: true,
                                modalData: task,
                                basketIndex: basketIndex,
                                taskIndex: idx,
                              });
                            }}
                          >
                            <i className="icofont-ui-edit"></i>
                          </button>
                        </div>
                        <p className="p-0 m-0">
                          <b>{idx + 1}) Task Name : </b>
                          {task.task_name}
                        </p>

                        <p className="p-0 m-0">
                          <b>Parent Task Name : </b>
                          {
                            parent.find((item) => item.value == task.parent_id)
                              ?.label
                          }
                        </p>

                        <p className="p-0 m-0">
                          <b>Task Type Name : </b>
                          {
                            taskTypeDropdown.find(
                              (item) => item.value == task.task_type_id
                            )?.label
                          }
                        </p>

                        <p className="p-0 m-0">
                          <strong>Days Required :</strong> {task.days}
                          Days
                        </p>
                        <p className="p-0 m-0">
                          <strong>{`Hours Required  ${stack.AB}`} :</strong>{" "}
                          {task.total_time} hours Required
                        </p>
                        <p className="p-0 m-0">
                          {iscalulatedFromTaken &&
                          iscalulatedFromTaken === "START_FROM" ? (
                            <b>
                              {" "}
                              Start Task After Days :{" " +
                                task.start_days}{" "}
                              Days
                            </b>
                          ) : (
                            <b>
                              {" "}
                              End Task before Days :{" " + task.start_days} Days
                            </b>
                          )}
                        </p>

                        <hr />
                        <div key={basketIndex}>
                          <Modal
                            centered
                            show={editTaskModal.showModal}
                            onHide={(e) => {
                              handleEditTask({
                                showModal: false,
                                modalData: "",
                                modalHeader: "",
                              });
                            }}
                          >
                            <Modal.Body>
                              <div className="form-group row">
                                {editTaskModal.modalData &&
                                  JSON.stringify(editTaskModal.modalData)}
                                <div>
                                  <div className="col-sm-12">
                                    <label className="col-form-label">
                                      <b>
                                        Task Name:
                                        <Astrick color="red" size="13px" />
                                      </b>
                                    </label>
                                    <input
                                      type="text"
                                      id="task"
                                      name="task_name"
                                      required
                                      onChange={(e) =>
                                        handleEditTaskData(
                                          e,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex
                                        )
                                      }
                                      defaultValue={
                                        editTaskModal.modalData.task_name
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>

                                  <div className="col-sm-12 mt-2">
                                    <label>
                                      <b>
                                        Parent Task type :
                                        {/* <Astrick color="red" size="13px" /> */}
                                      </b>
                                    </label>
                                    <Select
                                      id="parent_id"
                                      name="parent_id"
                                      ref={typeRef}
                                      className=" form-control-sm mt-2"
                                      options={parent && parent}
                                      onChange={(e, option) => {
                                        handleEditTaskData(
                                          option,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex,
                                          "select2",
                                          e
                                        );
                                      }}
                                      defaultValue={
                                        parent &&
                                        parent.filter(
                                          (d) =>
                                            d.value ==
                                            editTaskModal.modalData.parent_id
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="col-sm-12 mt-2">
                                    <label>
                                      <b>
                                        Task Type Name:
                                        {/* <Astrick color="red" size="13px" /> */}
                                      </b>
                                    </label>
                                    <Select
                                      id="task_type_id"
                                      name="task_type_id"
                                      ref={typeRef}
                                      onChange={(e, option) => {
                                        handleEditTaskData(
                                          option,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex,
                                          "select2",
                                          e
                                        );
                                      }}
                                      className=" form-control-sm mt-2"
                                      options={
                                        taskTypeDropdown && taskTypeDropdown
                                      }
                                      defaultValue={
                                        taskTypeDropdown &&
                                        taskTypeDropdown.filter(
                                          (d) =>
                                            d.value ==
                                            editTaskModal.modalData.task_type_id
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="col-sm-12">
                                    <label className="col-form-label">
                                      <b>
                                        Days Required:
                                        <Astrick color="red" size="13px" />
                                      </b>
                                    </label>
                                    <input
                                      type="number"
                                      id="days"
                                      name="days"
                                      onChange={(e) =>
                                        handleEditTaskData(
                                          e,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex
                                        )
                                      }
                                      defaultValue={
                                        editTaskModal.modalData.days
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                  <div className="col-sm-12">
                                    <label className="col-form-label">
                                      <b>
                                        Hours Required:
                                        <Astrick color="red" size="13px" />
                                      </b>
                                    </label>
                                    <input
                                      type="text"
                                      id="hours_required"
                                      name="total_time"
                                      onChange={(e) =>
                                        handleEditTaskData(
                                          e,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex
                                        )
                                      }
                                      className="form-control form-control-sm"
                                      defaultValue={
                                        editTaskModal.modalData.total_time
                                      }
                                    />
                                  </div>
                                  <div className="col-sm-12">
                                    <label className="col-form-label">
                                      <b>
                                        Start Task:
                                        <Astrick color="red" size="13px" />
                                      </b>
                                    </label>
                                    <input
                                      type="number"
                                      id="start_days"
                                      name="start_days"
                                      onChange={(e) =>
                                        handleEditTaskData(
                                          e,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex
                                        )
                                      }
                                      defaultValue={
                                        editTaskModal.modalData.start_days
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* })}  */}

                              <Modal.Footer>
                                <div>
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      handleEditTask({
                                        showModal: false,
                                        modalData: "",
                                        modalHeader: "",
                                      })
                                    }
                                    className="btn btn-sm btn-primary"
                                    style={{ backgroundColor: "#484C7F" }}
                                  >
                                    Submit
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) =>
                                      handleEditTask({
                                        showModal: false,
                                        modalData: "",
                                        modalHeader: "",
                                      })
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </Modal.Footer>
                              {/* </form> */}
                            </Modal.Body>
                          </Modal>
                        </div>
                      </div>
                    ))}
                    {show && selectedBasket === basketIndex && (
                      <div className="card col-md-12 mt-2">
                        <div className="card-body">
                          <form onSubmit={addTask} className="row d-flex">
                            <div className="form-group">
                              <label>
                                <b>
                                  Title :<Astrick color="red" size="13px" />
                                </b>
                              </label>
                              <input
                                type="text"
                                id="task_add"
                                className="form-control form-control-sm mb-2"
                                name="taskName"
                                placeholder="Add New Task"
                                required
                              />
                              <label>
                                <b>Parent Task Type</b>
                              </label>
                              <Select
                                id="parent_id"
                                name="parent_id"
                                onChange={(e) => handleParentchange(e)}
                                className=" form-control-sm mb-2"
                                options={parent && parent}
                              />

                              {taskTypeDropdown && (
                                <label>
                                  <b>Task Type :</b>
                                </label>
                              )}

                              {taskTypeDropdown && (
                                <Select
                                  id="task_type_id"
                                  name="task_type_id"
                                  ref={typeRef}
                                  className=" form-control-sm mb-2"
                                  options={taskTypeDropdown && taskTypeDropdown}
                                />
                              )}

                              <label>
                                <b>
                                  Days Required:
                                  <Astrick color="red" size="13px" />
                                </b>
                              </label>
                              <input
                                type="number"
                                className="form-control form-control-sm mb-2"
                                name="days"
                                id="days_add"
                                min="1"
                                max="100"
                                placeholder="Days Required"
                                required
                              />
                              <label>
                                <b>
                                  Hours Required :
                                  <Astrick color="red" size="13px" />
                                </b>
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-sm mb-2"
                                name="hours"
                                id="hours_add"
                                min="1"
                                max="100"
                                placeholder="Days Required"
                                defaultValue="00.00"
                                required
                              />
                              <label>
                                {iscalulatedFromTaken &&
                                iscalulatedFromTaken === "START_FROM" ? (
                                  <b>
                                    {" "}
                                    Start Task After Days :
                                    <Astrick color="red" size="13px" />
                                  </b>
                                ) : (
                                  <b>
                                    {" "}
                                    End Task before Days :
                                    <Astrick color="red" size="13px" />
                                  </b>
                                )}
                              </label>
                              <input
                                type="number"
                                min="1"
                                max="100"
                                className="form-control form-control-sm mb-2"
                                name="start_days"
                                id="start_days"
                                placeholder={`Start task ${stack.AB} days`}
                                required
                              />
                              <input
                                className="form-control"
                                type="hidden"
                                name="basket_id"
                                value={basketIndex}
                                required
                              />
                            </div>
                            <br />
                            <center>
                              <button
                                type="Submit"
                                className="btn btn-sm btn-primary"
                                style={{ width: "25%" }}
                              >
                                Add Task
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                style={{ width: "25%" }}
                                onClick={handleCancelTask}
                              >
                                Cancel
                              </button>
                            </center>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CreateTemplateComponent;
