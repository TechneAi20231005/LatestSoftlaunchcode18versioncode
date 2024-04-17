import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PageHeader from "../../../components/Common/PageHeader";

import Alert from "../../../components/Common/Alert";
import TemplateService from "../../../services/MastersService/TemplateService";

import TaskComponent from "./TaskComponent";
import { useParams } from "react-router-dom";

import { Modal } from "react-bootstrap";

import { Astrick } from "../../../components/Utilities/Style";

import Select from "react-select";
import { _base } from "../../../settings/constants";

import { useDispatch, useSelector } from "react-redux";
import {
  addTaskinBasketData,
  basketinEditData,
  getAllTypeData,
  postTemplateData,
  templateData,
  updateBasketModalData,
  updateTemplateData,
} from "./TemplateComponetAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import { handleBasketModal, handleTaskModal } from "./TemplateComponetSlice";

import { getUserForMyTicketsData } from "../../TicketManagement/MyTicketComponentAction";
import TaskTicketTypeService from "../../../services/MastersService/TaskTicketTypeService";

const EditTemplateComponent = ({ match, props }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const CustomMenuList = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [openOptions, setOpenOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        setOpenOptions(true);
      }
    };

    const toggleOptions = (label) => {
      if (openOptions.includes(label)) {
        setOpenOptions(openOptions.filter((item) => item !== label));
      } else {
        setOpenOptions([...openOptions, label]);
      }
    };

    const handleSelect = (label, ID) => {
      setSelectedOption(label);
      onSelect(label, ID);
      setOpenOptions([]);
      setIsMenuOpen(!isMenuOpen);
    };

    const filterOptions = (options, term) => {
      return options.filter((option) => {
        const lowerCaseTerm = term.toLowerCase();
        const matchLabel = option.label.toLowerCase().includes(lowerCaseTerm);
        const matchChildOptions =
          option.options && option.options.length > 0
            ? filterOptions(option.options, term).length > 0
            : false;

        return matchLabel || matchChildOptions;
      });
    };

    const handleMouseEnter = (label) => {
      setHoveredIndex(label);
    };

    const handleMouseLeave = () => {
      setHoveredIndex(null);
    };

    const renderOptions = (options) => {
      return options.map((option, index) => (
        <React.Fragment key={option.label}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.4rem",
              backgroundColor:
                hoveredIndex === option.label
                  ? "rgba(79, 184, 201, 0.5)"
                  : "white",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={() => handleMouseEnter(option.label)}
            onMouseLeave={handleMouseLeave}
          >
            <i
              className={
                openOptions.includes(option.label) && option.options.length > 0
                  ? "icofont-rounded-down"
                  : "icofont-rounded-right"
              }
              style={{
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => toggleOptions(option.label)}
            ></i>

            <div
              onClick={() => handleSelect(option.label, option.ID)}
              style={{
                cursor: "pointer",
                transition: "color 0.3s",
              }}
            >
              {option.label}
            </div>
          </div>

          {openOptions &&
            openOptions.length > 0 &&
            openOptions.includes(option.label) &&
            option.options && (
              <div style={{ marginLeft: "1rem" }}>
                <div style={{ marginLeft: "1rem" }}>
                  {renderOptions(option.options)}
                </div>
              </div>
            )}
        </React.Fragment>
      ));
    };
    const filteredOptions = filterOptions(options, searchTerm);

    return (
      <>
        {isMenuOpen === false && (
          <div
            style={{
              position: "relative",
              width: "100%",
              zIndex: 1000,
              maxHeight: "300px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderWidth: "2px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
              borderBottomRightRadius: "4px",
              borderBottomLeftRadius: "4px",
            }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: "8px",
                border: "none",
                width: "100%",
                boxSizing: "border-box",
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ overflowY: "auto" }}>
              {renderOptions(filteredOptions)}
            </div>
          </div>
        )}
      </>
    );
  };

  const [taskData, setTaskData] = useState([]);

  function transformData(taskData, hasPrimaryLabel = false) {
    const primaryLabel = "Primary";
    const options = [];

    // Push the primary label if it hasn't been pushed before
    if (!hasPrimaryLabel) {
      options.push({
        ID: null,
        label: primaryLabel,
        isStatic: true,
        options: [],
      });
      hasPrimaryLabel = true; // Update the flag to indicate primary label has been added
    }

    // Process the taskData
    taskData?.forEach((item) => {
      const label = item.type_name;

      if (label !== primaryLabel) {
        // Push API labels directly into options array
        options.push({
          ID: item.parent_id,
          label: label,
          options: item.children
            ? transformData(item.children, hasPrimaryLabel)
            : [],
        });
      }
    });

    return options;
  }

  // Transform the taskData
  const transformedOptions = transformData(taskData);

  const taskTypeDropdown = useSelector(
    (TemplateComponetSlice) =>
      TemplateComponetSlice.tempateMaster.getAllTypeData
  );
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 15)
  );
  const userData = useSelector(
    (MyTicketComponentSlice) =>
      MyTicketComponentSlice.myTicketComponent.sortAssigntoSelfUser
  );

  const addBasketModal = useSelector(
    (TemplateComponetSlice) =>
      TemplateComponetSlice.tempateMaster.addBasketModal
  );
  const addTaskModal = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.addTaskModal
  );
  const basketId = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.basketId
  );

  const [notify, setNotify] = useState(null);

  const { id } = useParams();
  const templateId = id;

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

  const [stack, setStack] = useState({ SE: "", AB: "" });

  const [show, setShow] = useState(false);
  const [modal, setModal] = useState({ shown: false, modalData: null });
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [calculatedays, setCalculatedays] = useState();

  const roleId = sessionStorage.getItem("role_id");

  const handleAddBasketModal = (data) => {
    dispatch(handleBasketModal(data));
  };

  const handleAddTaskModal = (data) => {};
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

    const item = { basket_name: null, basket_owner: null, basket_task: [] };

    if (flag === 1) {
      var temp = newData.template_data;

      temp.push(item);

      setNewData({ ...newData, template_data: temp });
    } else {
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

  const loadData = async () => {
    await new TemplateService().getTemplateById(templateId).then((res) => {
      setCalculatedays(res.data.data.AB);
      if (res.status === 200) {
        const newData = {
          template_name: res.data.data.template_name,
          calculate_from: res.data.data.calculate_from,
          template_data: [...res.data.data.template_data],
        };
        setData(res.data.data);

        setSatrtEndValue(res.data.data.AB);
        setNewData(null);
        setNewData((prevData) => ({ ...prevData, ...newData }));
      }
    });

    await new TaskTicketTypeService()?.getTaskType()?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data);
      }
    });
    dispatch(getAllTypeData());

    dispatch(getRoles());

    const inputRequired =
      "id,employee_id,first_name,last_name,middle_name,is_active";
    dispatch(getUserForMyTicketsData(inputRequired));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    let a = 0;
    rows.template_data.forEach((ele, id) => {
      if (ele.basket_task.length == 0) {
        a++;
      }
    });
    if (a > 0) {
    } else {
      dispatch(postTemplateData(rows)).then((res) => {
        if (res?.payload?.data?.status && res?.payload?.status == 200) {
          navigate(`/${_base}/Template`);
        }
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("basket_name", modal.modalData.basket_name);
    formData.append("basket_owner", modal.modalData.basket_owner);

    dispatch(
      updateBasketModalData({
        id: modal.modalData.basket_id,
        payload: formData,
      })
    );
    handleHideModal();
    loadData();
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
  };

  const [startEndValue, setSatrtEndValue] = useState("");

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const handleNewChange = (e, idx, type, name) => {
    const value = type === "select1" ? e.target.value : e.value;
    setSatrtEndValue(e.target.value);

    setNewData((prevData) => {
      const newDataCopy = { ...prevData };
      const newTemplateData = [...newDataCopy.template_data];

      if (idx === null) {
        newTemplateData.push({ [name]: value, basket_task: [] });
      } else {
        newTemplateData[idx] = { ...newTemplateData[idx], [name]: value };
      }

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

    var flag = 1;

    if (selectUserRef.current.commonProps.hasValue == false) {
      alert("Please Select User");
      e.preventDefault();
      flag = 0;
    } else {
      flag = 1;
    }
    if (flag == 1) {
      dispatch(basketinEditData({ id: templateId, payload: formData }));
      loadData();
    }
  };

  const updateTemplate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    for (const entry of form.entries(form)) {
    }

    dispatch(updateTemplateData({ id: templateId, payload: form })).then(
      (res) => {
        if (res?.payload?.data?.status === 1 && res?.payload?.status == 200) {
          setNotify({ type: "success", message: res?.payload?.data?.message });
          dispatch(templateData());

          setTimeout(() => {
            navigate(`/${_base}/Template`, {
              state: {
                alert: {
                  type: "success",
                  message: res?.payload?.data?.message,
                },
              },
            });
          }, 3000);
        } else {
          setNotify({ type: "danger", message: res?.payload?.data?.message });
        }
      }
    );
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    formData.append("task_type_id", selectedOptionId);

    for (const entry of formData.entries(formData)) {
    }
    dispatch(
      addTaskinBasketData({
        templateId: templateId,
        basketId: basketId,
        payload: formData,
      })
    ).then((res) => {
      if (res.payload.data.status == 1) {
        loadData();
        setNotify({ type: "success", message: res.payload.data.message });
      } else {
        setNotify({ type: "danger", message: res.payload.data.message });
        loadData();
      }
    });

    // await new TemplateService()
    //   .addTaskinBasket(templateId, basketId, formData)
    //   .then((res) => {
    //     if (res.status === 200) {
    //       if (res.data.status == 1) {
    //         handleAddTaskModal({
    //           showModal: false,
    //           modalData: "",
    //           modalHeader: "",
    //         });
    //         loadData();
    //       }
    //     }
    //   });
  };
  const handleCancel = () => {
    setShow(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const handleSelect = (label, ID) => {
    setSelectedOptions(selectedOptions === label ? null : label);
    setSelectedOptionId(label);
    setIsMenuOpen(!isMenuOpen);
    // closeAllDropdowns();
  };
  const handleSelectOptionClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectUserRef = useRef();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Edit Template" />
      <div className="row clearfix g-3">
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

              {/* {modal.modalData && ( */}

              {/* )} */}
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
            <br></br>
            {}
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
                      id="is_active"
                      value="1"
                      defaultChecked={data && data.is_active === 1}
                    />
                    <label className="form-check-label" htmlFor="is_active_1">
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
                      defaultChecked={data && data.is_active === 0}
                    />
                    <label className="form-check-label" htmlFor="is_active_0">
                      Deactive
                    </label>
                  </div>
                </div>
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
                dispatch(handleBasketModal({ showModal: true }));
              }}
            >
              Create Basket
            </button>

            <Link to={`/${_base}/Template`} class="btn btn-sm btn-danger">
              Cancel
            </Link>
          </div>
        </div>

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
                      dispatch(
                        handleBasketModal({
                          showModal: false,
                          modalData: "",
                          modalHeader: "",
                        })
                      );
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        <Modal
          centered
          show={addTaskModal.showModal}
          onHide={(e) => {
            dispatch(
              handleTaskModal({
                showModal: false,
                modalData: "",
                modalHeader: "",
              })
            );
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
                    Task Type Name:
                    <Astrick color="red" size="13px" />
                  </b>
                </label>
                <div
                  style={{
                    position: "relative",
                    display: "inline-block",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                      width: "100%",
                    }}
                    onClick={(e) => handleSelectOptionClick(e)}
                  >
                    {selectedOptions ? selectedOptions : "Select an option"}
                  </div>
                  {isMenuOpen && (
                    <div
                      style={{
                        position: "absolute",
                        width: "100%", // Set the width to 100% to match the parent's width
                        top: "100%",
                        zIndex: 999, // Adjust the z-index as needed
                      }}
                    >
                      <CustomMenuList
                        options={transformedOptions}
                        onSelect={(label, ID) => handleSelect(label, ID)}
                        // closeAllDropdowns={closeAllDropdowns}
                      />
                    </div>
                  )}
                </div>
                {/* <label>
                  <b>Task Type :</b>
                </label>
                <Select
                  id="task_type_id"
                  name="task_type_id"
                  className=" form-control-sm mt-2"
                  options={taskTypeDropdown && taskTypeDropdown}
                /> */}

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
                    max="100"
                    min="1"
                    required
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
                    required
                    className="form-control form-control-sm"
                    defaultValue="00:00"
                  />
                </div>

                {startEndValue && startEndValue == "START_FROM" ? (
                  <div className="col-sm-12">
                    <label className="col-form-label">
                      <b>
                        Start Task After Days
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <input
                      type="number"
                      id="start_days"
                      name="start_days"
                      max="100"
                      min="1"
                      required
                      className="form-control form-control-sm"
                    />
                  </div>
                ) : (
                  <div className="col-sm-12">
                    <label className="col-form-label">
                      <b>
                        End Task before Days :
                        <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <input
                      type="number"
                      id="start_days"
                      name="start_days"
                      required
                      max="100"
                      min="1"
                      className="form-control form-control-sm"
                    />
                  </div>
                )}
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
                      dispatch(
                        handleTaskModal({
                          showModal: false,
                          modalData: "",
                          modalHeader: "",
                        })
                      )
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
                          dispatch(
                            handleTaskModal({
                              showModal: true,
                              modalData: data,
                            })
                          )
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
                          calculatedays={calculatedays}
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
