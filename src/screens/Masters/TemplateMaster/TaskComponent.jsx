import React, { useState, useRef, useEffect } from "react";
import TemplateService from "../../../services/MastersService/TemplateService";
import { useParams } from "react-router-dom";

import Alert from "../../../components/Common/Alert";

import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
export default function TaskComponent(props) {
  console.log("props",props)
  const [data, setData] = useState({ task: props.taskData.task_name,days:props.taskData.days, total_time:props.taskData.total_hours,start_days:props.taskData.start_days,days:props.taskData.task_days,basket_id:props.taskData.basket_id });
  console.log("dataupdate",)
  const [notify, setNotify] = useState(null);
  const { id } = useParams();

  const [show, setShow] = useState(false);


  const searchRef = useRef();
  const handleSearch = (e) => {
    const search = searchRef.current.value;
    if (search.length > 0) {
      const temp = data.filter((d) => {
        return d.department
          .toLowerCase()
          .match(new RegExp(search.toLowerCase(), "g"));
      });

      setData(temp);
    }
  };

  var oo = props.taskData.AB;

  const handleTaskDelete = (e, idx) => {
    var temp = { is_active: 0 };
    new TemplateService().deleteTask(idx, temp).then((res) => {
      if (res.status == 200) {
        props.refreshData(id);
      }
    });
  };

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const handleChange = (e, type) => {
    if (type === "select2") {
      const selectedValue = e.value; // Access the 'value' property

      const name = "task_type_id";

      const updatedData = { ...data, [name]: selectedValue };
      setData(updatedData);
    } else if (type === "select3") {
      const name = "parent_id";

      const selectedValue = e.value;
      const updatedData = { ...data, [name]: selectedValue };
      setData(updatedData);
    } else {
      const { name, value } = e.target;

      const updatedData = { ...data, [name]: value };
      setData(updatedData);
    }
  };

  const [taskTypeDropdown, setTaskTypeDropdown] = useState();
  const [parent, setParent] = useState();

  useEffect(() => {
    new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          if (res.status === 200) {
            const mappedData = res.data.data.map((d) => ({
              value: d.id,
              label: d.type_name,
            }));

            setParent(mappedData);
          } else {
          }
        }
      }
    });

    new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;

          setTaskTypeDropdown(
            temp
              .filter((d) => d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.type_name }))
          );
        }
      }
    });
  }, []);

  const handleCancle = () => {
    setShow(false);
  };

  const handleSubmit = (e) => {
    const taskName = document.querySelector('input[name="task"]').value.trim();
    console.log("taskName",taskName)
    const daysRequired = document
      .querySelector('input[name="days"]')
      .value.trim();
    const hoursRequired = document
      .querySelector('input[name="total_time"]')
      .value.trim();
    const startDays = document
      .querySelector('input[name="start_days"]')
      .value.trim();

    if (!taskName || !daysRequired || !hoursRequired || !startDays) {
      alert("Please fill out all required fields.");
      return;
    }
    setNotify(null);
    e.preventDefault();

    new TemplateService()
      .updateTask(props.taskData.task_id, data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            props.refreshData(id);
            setNotify({ type: "success", message: res.data.message });
            setShow(false);
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
        }
      });
  };

  return (
    <div
      className="card mt-1 card-body d-flex justify-content-between mt-3"
      style={{ borderRadius: "10px", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }}
    >
      {notify && <Alert alertData={notify} />}

      {!show && (
        <p>
          <strong>{props.taskData.task_name}</strong>
          <span style={{ float: `right` }}>
            {props.taskData.start_days} days
          </span>
        </p>
      )}
      {!show && (
        <div>
          <button
            className="btn btn-sm btn-danger"
            onClick={(e) => {
              if (window.confirm("Are you sure to delete this record?")) {
                handleTaskDelete(e, props.taskData.task_id);
              }
            }}
          >
            <i className="icofont-ui-delete"></i>
          </button>
          <button className="btn btn-sm btn-primary" onClick={handleShow}>
            <i className="icofont-ui-edit" color="white"></i>
          </button>
        </div>
      )}
      {show && (
        <>
          <p>
            {props.taskData.task_name}
            <span style={{ float: `right` }}>
              {props.taskData.task_total_time} Days
            </span>
          </p>
          <div>
            <button
              className="btn btn-sm btn-danger"
              onClick={(e) => {
                if (window.confirm("Are you sure to delete this record?")) {
                  handleTaskDelete(e, props.taskData.task_id);
                }
              }}
            >
              <i className="icofont-ui-delete"></i>
            </button>
            <button className="btn btn-sm btn-primary" onClick={handleShow}>
              <i className="icofont-ui-edit"></i>
            </button>
          </div>
          <div
            className="modal fade show"
            id="createproject"
            tabIndex="-1"
            aria-modal="true"
            role="dialog"
            style={{ display: `block` }}
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title  fw-bold" id="createprojectlLabel">
                    Update task
                  </h5>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={handleShow}
                  >
                    <i className="icofont-ui-close"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    {show && (
                      <div className="">
                        <label>Task Name</label>
                        <Astrick color="red" size="13px" />

                        <input
                          className="col-7 form-control form-control-sm"
                          defaultValue={props.taskData.task_name}
                          name="task"
                          onInput={(e) => handleChange(e, "standard")}
                        />
                        <br />

                        <label>Days Required</label>
                        <Astrick color="red" size="13px" />

                        <input
                          max="100"
                          className="form-control form-control-sm"
                          defaultValue={props.taskData.task_days}
                          name="days"
                          required
                          onInput={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 100) {
                              e.target.setCustomValidity(
                                "Day should be maximum 100"
                              );
                            } else {
                              e.target.setCustomValidity("");
                            }
                            handleChange(e, "standard");

                            // Display error message manually
                            const errorSpan = e.target.nextElementSibling; // Get the next element (error span)
                            if (value > 100) {
                              errorSpan.innerText = "Day should be maximum 100"; // Set error message
                            } else {
                              errorSpan.innerText = ""; // Clear error message
                            }
                          }}
                        />
                        <span className="error" style={{ color: "red" }}></span>

                        <br />

                        <label>Hours Required</label>
                        <Astrick color="red" size="13px" />
                        <input
                          className="form-control form-control-sm"
                          defaultValue={
                            props.taskData.total_hours
                              ? props.taskData.total_hours
                              : "00:00"
                          }
                          name="total_time"
                          type="text"
                          onInput={(e) => handleChange(e, "standard")}
                        />
                        <br />

                        {/* <label>
                          <b>Parent Task Type :</b>
                        </label>
                        <Select
                          id="parent_id"
                          name="parent_id"
                          onChange={(e) => handleChange(e, "select3")}
                          className="col-7 form-control form-control-sm"
                          options={parent && parent}
                          defaultValue={
                            parent &&
                            parent.filter(
                              (d) => d.value == props.taskData.parent_id
                            )
                          }
                        /> */}

                        <label>
                          <b>Task Type :</b>
                        </label>
                        <Select
                          id="task_type_id"
                          name="task_type_id"
                          onChange={(e) => handleChange(e, "select2")}
                          className="col-7 form-control form-control-sm"
                          options={taskTypeDropdown && taskTypeDropdown}
                          defaultValue={
                            taskTypeDropdown &&
                            taskTypeDropdown.filter(
                              (d) => d.value == props.taskData.task_type_id
                            )
                          }
                        />

                        <br />

                        <label>
                          Start task{" "}
                          {props.taskData.AB === "START_FROM"
                            ? "after"
                            : "before"}{" "}
                          days :
                        </label>
                        <Astrick color="red" size="13px" />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="form-control form-control-sm"
                          defaultValue={props.taskData.start_days}
                          name="start_days"
                          onInput={(e) => handleChange(e, "standard")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleCancle}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
