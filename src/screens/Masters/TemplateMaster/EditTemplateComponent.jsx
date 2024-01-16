import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/Common/PageHeader";
import ErrorLogService from "../../../services/ErrorLogService";
import UserDropdown from "../UserMaster/UserDropdown";
import Alert from "../../../components/Common/Alert";
import TemplateService from "../../../services/MastersService/TemplateService";
import * as Validation from "../../../components/Utilities/Validation";
import TaskComponent from "./TaskComponent";
import { useParams } from "react-router-dom";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { Modal } from "react-bootstrap";
import BasketDetails from "../../TicketManagement/TaskManagement/components/BasketDetails";
import { Astrick } from "../../../components/Utilities/Style";
import UserService from "../../../services/MastersService/UserService";
import BasketService from "../../../services/TicketService/BasketService";

import Select from "react-select";
import { _base } from "../../../settings/constants";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";

const EditTemplateComponent = ({ match, props }) => {
  const history = useNavigate();
  const [notify, setNotify] = useState(null);

  const templateId = match.params.id;
  const [data, setData] = useState(null);

  const [newData, setNewData] = useState({
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

  const [user, setUser] = useState();
  const [stack, setStack] = useState({ SE: "", AB: "" });
  const [userData, setUserData] = useState();

  const [show, setShow] = useState(false);
  const [modal, setModal] = useState({ shown: false, modalData: null });
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [addBasketModal, setAddBasketModal] = useState({
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  });
  const [addTaskModal, setAddTaskModal] = useState({
    showModal: false,
    modalAddData: null,
    modalAddHeader: null,
  });
  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const handleAddBasketModal = (data) => {
    setAddBasketModal(data);
  };
  const [basketId, setBasketId] = useState();
  const handleAddTaskModal = (data) => {
    setAddTaskModal(data);
    setBasketId(data.modalData.basket_id);
  };
  const mainJson = {
    template_name: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: [],
      },
    ],
  };
  const [rows, setRows] = useState(mainJson);

  const handleAddRow = async () => {
    let flag = 1;
    // let last = rows.template_data.length - 1;
    // if ((!rows.template_data[last].basket_name || !rows.template_data[last].basket_owner) && last > 0) {
    //     flag = 0;
    // }
    const item = { basket_name: null, basket_owner: null, basket_task: [] };

    if (flag === 1) {
      var temp = newData.template_data;

      temp.push(item);

      setNewData({ ...newData, template_data: temp });
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
      setNewData({
        template_data: newData.template_data.filter((_, i) => i !== idx),
      });
    }
  };
  const shouldShowButton =
    selectedOption === "START_FROM" || selectedOption === "END_FROM";

  const showHandler = (e) => {
    setShow((prev) => true);
  };
  const [taskTypeDropdown, setTaskTypeDropdown] = useState();

  const loadData = async () => {
    await new TemplateService().getTemplateById(templateId).then((res) => {
      if (res.status === 200) {
        const newData = {
          template_name: res.data.data.template_name,
          calculate_from: res.data.data.calculate_from,
          template_data: [...res.data.data.template_data],
        };
        setData(res.data.data);
        setNewData(null);
        setNewData((prevData) => ({ ...prevData, ...newData }));
      }
    });
    await new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const temp = res.data.data;
          setTaskTypeDropdown(
            temp
              .filter((d) => d.type === "TASK" && d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.type_name }))
          );
        }
      }
    });
    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });

    const inputRequired = "id,employee_id,first_name,last_name,middle_name";
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
  };

  const { id } = useParams();

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
              history({
                pathname: `/${_base}/Template`,
                state: {
                  notify: { type: "success", message: res.data.message },
                },
              });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("basket_name", modal.modalData.basket_name);

    new BasketService()
      .updatetempalateBasket(modal.modalData.basket_id, formData)

      .then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          handleHideModal();
          loadData();
          setNotify(null);
          setNotify({ type: "success", message: res.data.message });
        }
      });
  };

  const handleChange = (e, type) => {
    setSelectedOption(e);
    if (type == "select1") {
      setModal((prev) => ({
        ...prev,
        modalData: {
          ...prev.modalData,
          basket_name: e.target.value,
        },
      }));
    }
    if (type == "select2") {
      setModal((prev) => ({
        ...prev,
        modalData: {
          ...prev.modalData,
          basket_owner: e.value,
        },
      }));
    }
    // setModal((prevModal) => ({
    //   ...prevModal,
    //   modalData: {
    //     ...prevModal.modalData,
    //     basket_name: value,
    //     basket_owner:value
    //   },
    // }));
  };

  const handleShow = () => {
    setShow((prev) => !prev);
  };


  




  const handleNewChange = (e, idx, type, name) => {
    const value = type === "select1" ? e.target.value : e.value;

    setNewData((prevData) => {
      const newDataCopy = { ...prevData };
      const newTemplateData = [...newDataCopy.template_data];

      if (idx === null) {
        // Add a new item to the template_data array
        newTemplateData.push({ [name]: value, basket_task: [] });
      } else {
        // Update an existing item in the template_data array
        newTemplateData[idx] = { ...newTemplateData[idx], [name]: value };
      }

      // Update the template_data array in the newDataCopy object
      newDataCopy.template_data = newTemplateData;

      return newDataCopy;
    });
  };

  const handleModal = (e, type, data) => {
    e.preventDefault();
    setModal({ shown: type, modalData: data });
  };
  const handleHideModal = () => {
    setModal({ shown: false, modalData: null });
  };

  const addTask = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const taskName = form.get("taskName");
    const hours = form.get("hours");
    const days = form.get("days");

    const task = {
      task_name: taskName,
      total_time: hours,
      days: days,
    };

    setNewData((prevData) => {
      const updatedTemplateData = [...prevData.template_data];
      const lastBasket = updatedTemplateData[updatedTemplateData.length - 1];

      if (lastBasket) {
        lastBasket.basket_task.push(task);
      } else {
        updatedTemplateData.push({
          basket_name: null,
          basket_owner: null,
          basket_task: [task],
        });
      }

      return {
        ...prevData,
        template_data: updatedTemplateData,
      };
    });

    e.target.reset();
    setShow(false);
  };

  const handleAddBasket = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Add your form data to the `formData` object here
    var flag = 1;
    // Print the formData entries
    if (selectUserRef.current.commonProps.hasValue == false) {
      alert("Please Select User");
      e.preventDefault();
      flag = 0;
    } else {
      flag = 1;
    }
    if (flag == 1) {
      await new TemplateService()
        .addBasketinEdit(templateId, formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status == 1) {
              loadData();
              handleAddBasketModal({
                showModal: false,
                modalData: "",
                modalHeader: "",
              });
            }
          }
        });
    }
  };

  const updateTemplate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    for (const entry of form.entries(form)) {
      // console.log(entry[0], entry[1])
    }
    await new TemplateService().updateTemplate(templateId, form).then((res) => {
      if (res.status == 200) {
        if (res.data.status == 1) {
          history({
            pathname: `/${_base}/Template`,
            state: {
              notify: { type: "success", message: res.data.message },
            },
          });
        }
      }
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // Add your form data to the `formData` object here

    // Print the formData entries
    for (const entry of formData.entries(formData)) {
      // console.log(entry[0], entry[1])
    }
    await new TemplateService()
      .addTaskinBasket(templateId, basketId, formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            handleAddTaskModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
            loadData();
          }
        }
      });
  };
  const handleCancel = () => {
    setShow(false);
  };

  const selectUserRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[14].can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Edit Template" />
      <div className="row clearfix g-3">
        {/* {data && JSON.stringify(data)} */}
        {/* {newData && JSON.stringify(newData)} */}

        <div className="card-body">
          <form onSubmit={updateTemplate}>
            <div className="mt-2"></div>
            <div className="form-group row ">
              <label className="col-sm-2 col-form-label">
                <b>Template Name :</b>
              </label>
              <div className="col-sm-5">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="template_name"
                  name="template_name"
                  required
                  onChange={(e) => {
                    handleNewChange(e, null, null, "template_name");
                  }}
                  defaultValue={newData && newData.template_name}
                />
                {error && <small style={{ color: "red" }}>{error}</small>}
              </div>
              <label
                className="col-sm-2 col-form-label"
                style={{ textAlign: "right" }}
              >
                <b>Calculate Days From :</b>
              </label>
              <div className="col-sm-3">
                <select
                  className="form-control form-control-sm"
                  id="calculate_from"
                  name="calculate_from"
                  onChange={(e) => handleNewChange(e, null, null, "AB")}
                  defaultValue={data && data.AB}
                >
                  <option value="">Calculate Days From</option>
                  <option
                    selected={data && data.AB == "START_FROM"}
                    value="START_FROM"
                  >
                    From Start
                  </option>
                  <option
                    selected={data && data.AB == "END_FROM"}
                    value="END_FROM"
                  >
                    From End
                  </option>
                </select>
              </div>
            </div>
            <div className="pull-right mt-4">
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
            </div>
          </form>
          <div className="pull-right mt-4">
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                setAddBasketModal({ showModal: true });
              }}
              // disabled={isButtonDisabled}
            >
              Create Basket
            </button>
            {/* )} */}
            <Link to={`/${_base}/Template`} class="btn btn-sm btn-primary">
              Cancel
            </Link>
          </div>
        </div>
        {/* add basket modal */}
        <Modal
          centered
          show={addBasketModal.showModal}
          onHide={(e) => {
            handleAddBasketModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
          }}
        >
          {" "}
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <form method="post" onSubmit={handleAddBasket}>
              <label>
                <b>
                  Basket Name:
                  <Astrick color="red" size="13px" />
                </b>
              </label>
              <input
                type="text"
                id="basket_name"
                name="basket_name"
                required
                className="form-control form-control-sm"
              />
              <div className="form-group row">
                <div className="col-sm-12">
                  <label className="col-form-label">
                    <b>
                      Select User :
                      <Astrick color="red" size="13px" />
                    </b>
                  </label>
                  {userData && (
                    <Select
                      id="basket_owner"
                      name="basket_owner"
                      options={userData}
                      ref={selectUserRef}
                    />
                  )}
                </div>
              </div>
              <Modal.Footer>
                <div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    style={{ backgroundColor: "#484C7F" }}
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={(e) => {
                      handleAddBasketModal({
                        showModal: false,
                        modalData: "",
                        modalHeader: "",
                      });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
        {/* add basket modal */}

        {/* add task modal */}
        <Modal
          centered
          show={addTaskModal.showModal}
          onHide={(e) => {
            handleAddTaskModal({
              showModal: false,
              modalData: "",
              modalHeader: "",
            });
          }}
        >
          {" "}
          <Modal.Header></Modal.Header>
          <Modal.Body>
            <form method="post" onSubmit={handleAddTask}>
              <div className="form-group row">
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
                    name="task"
                    required
                    className="form-control form-control-sm"
                  />
                </div>
                <label>
                  <b>
                    Task Type :<Astrick color="red" size="13px" />
                  </b>
                </label>
                <Select
                  id="task_type_id"
                  name="task_type_id"
                  className=" form-control-sm mt-2"
                  options={taskTypeDropdown && taskTypeDropdown}
                />

                
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
                    name="total_hours"
                    className="form-control form-control-sm"
                    defaultValue={"00:00"}
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
                    className="form-control form-control-sm"
                  />
                </div>
              </div>
              <Modal.Footer>
                <div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    style={{ backgroundColor: "#484C7F" }}
                  >
                    Submit
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={(e) =>
                      handleAddTaskModal({
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
            </form>
          </Modal.Body>
        </Modal>
        {/* add task modal */}
        {data &&
          data.template_data &&
          data.template_data.map((data, index) => {
            return (
              <>
                <div key={index} className="col-md-4 mb-2">
                  <>
                    <div className="row">
                      <h5 className="col d-flex justify-content-start mt-2">
                        <strong className=" ">{data.basket_name}</strong>
                      </h5>
                    </div>

                    <div className="col d-flex justify-content-end ">
                      <button
                        type="button"
                        className="btn btn-danger fw-bold text-white btn-sm"
                        onClick={(e) =>
                          handleAddTaskModal({
                            showModal: true,
                            modalData: data,
                          })
                        }
                      >
                        <i
                          className="icofont-ui-edit"
                          style={{ fontSize: "13px", marginRight: "4px" }}
                        ></i>
                        Add Task
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary text-white btn-sm"
                        style={{ padding: "10px 10px" }}
                        onClick={(e) => handleModal(e, true, data)}
                      >
                        <i
                          className="icofont-ui-edit"
                          style={{ fontSize: "13px", marginRight: "4px" }}
                        ></i>
                        Edit Basket
                      </button>
                    </div>
                  </>

                  {data.basket_task &&
                    data.basket_task.map((task, i) => {
                      return (
                        <TaskComponent
                          taskData={task}
                          refreshData={loadData}
                          key={i}
                        />
                      );
                    })}
                </div>
                {modal && modal.shown && (
                  <Modal show={modal.shown} onHide={handleHideModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Edit Basket</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Basket Name</p>
                      <input
                        type="text"
                        id="basket_name"
                        name="basket_name"
                        // value={data.basket_name}
                        onChange={(e) => handleChange(e, "select1")}
                        className="form-control form-control-sm"
                        defaultValue={modal && modal.modalData.basket_name}
                      />
                      <div className="form-group row">
                        <div className="col-sm-12">
                          <label className="col-form-label">
                            <b>
                              Select User :
                              <Astrick color="red" size="13px" />
                            </b>
                          </label>
                          {userData && (
                            <Select
                              id="basket_owner"
                              name="basket_owner"
                              onChange={(e) => handleChange(e, "select2")}
                              options={userData}
                              defaultValue={
                                modal.modalData &&
                                userData.filter(
                                  (emp) =>
                                    emp.value === modal.modalData.basket_owner
                                )
                              }
                            />
                          )}
                        </div>
                      </div>
                    </Modal.Body>

                    <Modal.Footer>
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        style={{ backgroundColor: "#484C7F" }}
                        onClick={handleSubmit}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        style={{ backgroundColor: "#FFBA32" }}
                        onClick={(e) => handleModal(e, false, null)}
                      >
                        Close
                      </button>
                    </Modal.Footer>
                  </Modal>
                )}
              </>
            );
          })}
      </div>
    </div>
  );
};

export default EditTemplateComponent;
