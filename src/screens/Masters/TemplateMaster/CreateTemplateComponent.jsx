import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '../../../components/Common/PageHeader';

import Alert from '../../../components/Common/Alert';
import TemplateService from '../../../services/MastersService/TemplateService';

import { _base } from '../../../settings/constants';

import { Modal } from 'react-bootstrap';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';

import { name } from 'platform';

import { useDispatch, useSelector } from 'react-redux';
import {
  getAllTypeData,
  getParentData,
  postTemplateData,
  templateData
} from './TemplateComponetAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import {
  handleModalClose,
  handleModalOpen,
  hideNotification
} from './TemplateComponetSlice';

import { getUserForMyTicketsData } from '../../TicketManagement/MyTicketComponentAction';
import TaskTicketTypeService from '../../../services/MastersService/TaskTicketTypeService';

const CreateTemplateComponent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 15)
  );
  const parent = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.getParentData
  );
  const taskTypeDropdown = useSelector(
    (TemplateComponetSlice) =>
      TemplateComponetSlice.tempateMaster.getAllTypeData
  );
  const userData = useSelector(
    (MyTicketComponentSlice) =>
      MyTicketComponentSlice.myTicketComponent.sortAssigntoSelfUser
  );

  const editTaskModal = useSelector(
    (TemplateComponetSlice) => TemplateComponetSlice.tempateMaster.modal
  );
  const [notify, setNotify] = useState(null);

  const roleId = localStorage.getItem('role_id');

  const mainJson = {
    template_name: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: [],
        calculate_from: []
      }
    ]
  };
  const [selectedBasket, setSelectedBasket] = useState();
  const [rows, setRows] = useState({
    template_name: null,
    calculate_from: null,
    template_data: [
      {
        basket_name: null,
        basket_owner: null,
        basket_task: []
      }
    ]
  });

  const [stack, setStack] = useState({ SE: '', AB: '' });
  const [data, setData] = useState([]);

  const [error, setError] = useState('');
  const [ticketsData, setTicketsData] = useState([]);
  const [taskData, setTaskData] = useState([]);

  // const loadData = async () => {
  //   await new TemplateService().getTemplate().then((res) => {
  //     setData(res.data.data);
  //   });
  // };

  const loadData = async () => {
    await new TaskTicketTypeService()?.getTaskType()?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data);
      }
    });
  };

  const handleParentchange = async (e) => {
    if (typeRef.current) {
      typeRef.current.clearValue();
    }
    dispatch(getAllTypeData());
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
    }
  };

  const handleRemoveSpecificRow = (idx) => {
    setRows((prevState) => {
      const updatedRows = prevState.template_data.filter((_, i) => i !== idx);

      return {
        ...prevState,
        template_data: updatedRows
      };
    });
  };

  const handleRemoveTask = (basketIndex, taskIndex) => {
    setRows((prevRows) => {
      const updatedTemplateData = [...prevRows.template_data];
      updatedTemplateData[basketIndex].basket_task.splice(taskIndex, 1);

      return {
        ...prevRows,
        template_data: updatedTemplateData
      };
    });
  };

  const [show, setShow] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

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

  const CustomOption = ({
    label,
    options,
    onClick,
    closeDropdown,
    openOptions
  }) => {
    const [expanded, setExpanded] = useState(false);
    const handleClick = (e) => {
      setExpanded(!expanded);
      onClick(label);
      closeDropdown(); // Close the dropdown after clicking the option
    };

    return (
      <div
        style={{
          padding: '8px',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        {label}
        {expanded && options && (
          <div style={{ marginLeft: '20px' }}>
            {options.map((option) => (
              <CustomOption
                key={option.label}
                label={option.label}
                options={option.options}
                onClick={onClick}
                ID={option.ID}
                openOptions={options}
                closeDropdown={closeDropdown} // Pass closeDropdown to nested options
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const CustomMenuList = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openOptions, setOpenOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
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
              display: 'flex',
              alignItems: 'center',
              padding: '0.4rem',
              backgroundColor:
                hoveredIndex === option.label
                  ? 'rgba(79, 184, 201, 0.5)'
                  : 'white',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={() => handleMouseEnter(option.label)}
            onMouseLeave={handleMouseLeave}
          >
            <i
              className={
                openOptions.includes(option.label) && option.options.length > 0
                  ? 'icofont-rounded-down'
                  : 'icofont-rounded-right'
              }
              style={{
                marginRight: '5px',
                cursor: 'pointer'
              }}
              onClick={() => toggleOptions(option.label)}
            ></i>

            <div
              onClick={() => handleSelect(option.label, option.ID)}
              style={{
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
            >
              {option.label}
            </div>
          </div>

          {openOptions &&
            openOptions.length > 0 &&
            openOptions.includes(option.label) &&
            option.options && (
              <div style={{ marginLeft: '1rem' }}>
                <div style={{ marginLeft: '1rem' }}>
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
              position: 'relative',
              width: '100%',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid #ccc',
              borderWidth: '2px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              borderBottomRightRadius: '4px',
              borderBottomLeftRadius: '4px'
            }}
            tabIndex={0}
            onKeyDown={handleKeyDown}
          >
            <input
              type="text"
              placeholder="Search..."
              style={{
                padding: '8px',
                border: 'none',
                width: '100%',
                boxSizing: 'border-box'
              }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div style={{ overflowY: 'auto' }}>
              {renderOptions(filteredOptions)}
            </div>
          </div>
        )}
      </>
    );
  };
  function transformData(taskData) {
    const options = [];

    // Process the taskData
    taskData?.forEach((item) => {
      const label = item.type_name;

      // Push API labels directly into options array
      options.push({
        ID: item.parent_id,
        label: label,
        options: item.children ? transformData(item.children) : []
      });
    });

    return options;
  }

  // Transform the taskData
  const transformedOptions = transformData(taskData);

  const [iscalulatedFromTaken, setIsCalculatedFromTaken] = useState('');
  const typeRef = useRef();
  const shouldShowButton =
    selectedOption === 'START_FROM' || selectedOption === 'END_FROM';

  const showHandler = (e) => {
    setShow(true);
  };

  const handleChange = (e, idx, type, name) => {
    var value = type == 'select2' ? e.value : e.target.value;
    if (type == 'select1') {
      setSelectedOption(e.target.value);
      if (e.target.name == 'basket_name' || e.target.name == 'basket_task') {
        setRows((prev) => {
          const newPrev = { ...prev };
          newPrev.template_data[idx][e.target.name] = value;
          return newPrev;
        });
      }
    }
    if (name === 'basket_owner') {
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
    e.preventDefault();
    let a = 0;
    rows.template_data.forEach((ele, id) => {
      if (ele.basket_task.length == 0) {
        a++;
      }
    });
    if (a > 0) {
    } else {
      // rows.append("parent_id", selectedOptionId);
      dispatch(postTemplateData(rows)).then((res) => {
        if (res?.payload?.data?.status === 1 && res?.payload?.status == 200) {
          setNotify({ type: 'success', message: res?.payload?.data?.message });
          dispatch(templateData());

          setTimeout(() => {
            navigate(`/${_base}/Template`, {
              state: {
                alert: {
                  type: 'success',
                  message: res?.payload?.data?.message
                }
              }
            });
          }, 3000);
        } else {
          setNotify({ type: 'danger', message: res?.payload?.data?.message });
        }
      });
    }
  };

  const addTask = (e) => {
    e.preventDefault();

    const hoursInput = document.getElementById('hours_add');
    const enteredValue = hoursInput.value.trim();
    const timeRegex = /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

    if (!timeRegex.test(enteredValue)) {
      // If the format is invalid, show an alert or handle it accordingly
      alert("Invalid time format. Please use 'HH:mm' format");
      return; // Prevent further execution of the function
    }

    var form = new FormData(e.target);
    var temp = {
      task_name: form.get('taskName'),
      // task_type_id: form.get("task_type_id"),
      // parent_id: form.get("parent_id"),
      total_time: form.get('hours'),
      days: form.get('days'),
      start_days: form.get('start_days'),
      task_type_id: selectedOptionId
    };

    var basket_id = form.get('basket_id');

    var tempData = rows;
    tempData.template_data[basket_id].basket_task.push(temp);
    var a = tempData;
    setRows(null);
    setRows(tempData);

    for (
      var i = 0;
      i < document.getElementsByClassName('taskField').length;
      i++
    ) {
      document.getElementsByClassName('taskField')[i].value = '';
    }
    if (typeRef && typeRef?.current?.commonProps?.hasValue === true) {
      typeRef.current.clearValue();
    }
    if (document.getElementById('task_add').value != '') {
      document.getElementById('task_add').value = '';
    }
    if (document.getElementById('days_add').value != '') {
      document.getElementById('days_add').value = '';
    }
    if (document.getElementById('hours_add').value != '') {
      document.getElementById('hours_add').value = '';
    }
    if (document.getElementById('start_days').value != '') {
      document.getElementById('start_days').value = '';
    }
    setShow(false);
  };

  const handleCancelTask = (e) => {
    setShow(false);
  };

  const handleEditTaskData = (e, basketIndex, idx, type, event) => {
    let value;
    if (type === 'select2') {
      value = event.value;
    } else {
      value = e.target.value;
    }

    setRows((prevRows) => {
      const updatedTemplateData = [...prevRows.template_data];
      const updatedBasketTask = [
        ...updatedTemplateData[basketIndex].basket_task
      ];
      const updatedTask = { ...updatedBasketTask[idx] };

      if (type === 'select2') {
        updatedTask[e.name] = value;
      } else {
        updatedTask[e.target.name] = value;
      }

      updatedBasketTask[idx] = updatedTask;
      updatedTemplateData[basketIndex].basket_task = updatedBasketTask;

      return {
        ...prevRows,
        template_data: updatedTemplateData
      };
    });
  };

  useEffect(() => {
    loadData();
    if (!parent.length) {
      dispatch(getParentData());
    }
    if (!userData.length) {
      const inputRequired =
        'id,employee_id,first_name,last_name,middle_name,is_active';
      dispatch(getUserForMyTicketsData(inputRequired));
    }
    if (!checkRole.length) {
      dispatch(getRoles());
    }
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
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
                        handleChange(e, name, 'select1');
                      }}
                    />
                    {error && <small style={{ color: 'red' }}>{error}</small>}
                  </div>

                  <label
                    className="col-sm-2 col-form-label"
                    style={{ textAlign: 'right' }}
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
                        handleChange(e, index, 'select1');
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
                                value={item.basket_name}
                                onChange={(e) => {
                                  handleChange(e, idx, 'select1');
                                }}
                                className="form-control form-control-sm"
                                required={true}
                              />
                            </td>

                            <td>
                              {userData && (
                                <Select
                                  required={true}
                                  options={userData}
                                  id="basket_owner"
                                  name="basket_owner"
                                  value={userData.filter((d) =>
                                    Array.isArray(item.basket_owner)
                                      ? item.basket_owner.includes(d.value)
                                      : item.basket_owner === d.value
                                  )}
                                  onChange={(e) =>
                                    handleChange(
                                      e,
                                      idx,
                                      'select2',
                                      'basket_owner'
                                    )
                                  }
                                />
                              )}
                            </td>

                            <td>
                              {idx === 0 ? ( // Conditional rendering for the first row
                                <span>
                                  <button
                                    type="button"
                                    onClick={handleAddRow}
                                    className="btn btn-sm btn-outline-primary pull-left"
                                  >
                                    <i className="icofont-plus-circle"></i>
                                  </button>
                                </span>
                              ) : (
                                // Render delete button for other rows
                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleRemoveSpecificRow(idx)}
                                >
                                  <i className="icofont-ui-delete"></i>
                                </button>
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
                  <Link to={`/${_base}/Template`} class="btn btn-sm btn-danger">
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
                            style={{ width: '50px' }}
                            onClick={(e) => {
                              if (
                                window.confirm(
                                  'Are you sure to delete this record?'
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
                            style={{ width: '50px' }}
                            className="btn btn-sm btn-info"
                            onClick={(e) => {
                              dispatch(
                                handleModalOpen({
                                  showModal: true,
                                  modalData: task,
                                  basketIndex: basketIndex,
                                  taskIndex: idx
                                })
                              );
                            }}
                          >
                            <i className="icofont-ui-edit"></i>
                          </button>
                        </div>
                        <p className="p-0 m-0">
                          <b>{idx + 1}) Task Name : </b>
                          {task.task_name}
                        </p>

                        {/* <p className="p-0 m-0">
                          <b>Parent Task Name : </b>
                          {
                            parent.find((item) => item.value == task.parent_id)
                              ?.label
                          }
                        </p> */}
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
                          <strong>{`Hours Required  ${stack.AB}`} :</strong>{' '}
                          {task.total_time} hours Required
                        </p>
                        <p className="p-0 m-0">
                          {iscalulatedFromTaken &&
                          iscalulatedFromTaken === 'START_FROM' ? (
                            <b>
                              {' '}
                              Start Task After Days :{' ' + task.start_days} Day
                            </b>
                          ) : (
                            <b>
                              {' '}
                              End Task before Days :{' ' + task.start_days} Days
                            </b>
                          )}
                        </p>

                        <hr />
                        <div key={basketIndex}>
                          <Modal
                            centered
                            show={editTaskModal.showModal}
                            onHide={(e) => {
                              dispatch(
                                handleModalClose({
                                  showModal: false,
                                  modalData: '',
                                  modalHeader: ''
                                })
                              );
                            }}
                          >
                            <Modal.Body>
                              <div className="form-group row">
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
                                        editTaskModal?.modalData?.task_name
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>

                                  {/* <div className="col-sm-12 mt-2">
                                    <label>
                                      <b>
                                        Parent Task type :


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
                                            editTaskModal?.modalData?.parent_id
                                        )
                                      }
                                    />
                                  </div> */}

                                  {/* <div className="col-sm-12 mt-2">
                                    <label>
                                      <b>
                                        Task Type Name:


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
                                            editTaskModal?.modalData
                                              ?.task_type_id
                                        )
                                      }
                                    />
                                  </div> */}

                                  <label>
                                    <b>
                                      Task Type Name:
                                      <Astrick color="red" size="13px" />
                                    </b>
                                  </label>
                                  <div
                                    style={{
                                      position: 'relative',
                                      display: 'inline-block',
                                      width: '100%'
                                    }}
                                  >
                                    <div
                                      style={{
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        cursor: 'pointer',
                                        width: '100%'
                                      }}
                                      onClick={(e) =>
                                        handleSelectOptionClick(e)
                                      }
                                    >
                                      {selectedOptions
                                        ? selectedOptions
                                        : 'Select an option'}
                                    </div>
                                    {isMenuOpen && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          width: '100%', // Set the width to 100% to match the parent's width
                                          top: '100%',
                                          zIndex: 999 // Adjust the z-index as needed
                                        }}
                                      >
                                        <CustomMenuList
                                          options={transformedOptions}
                                          onSelect={(label, ID) =>
                                            handleSelect(label, ID)
                                          }
                                          // closeAllDropdowns={closeAllDropdowns}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  {/* <label>
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
                                      onClick={(e) =>
                                        handleSelectOptionClick(e)
                                      }
                                    >
                                      {selectedOptions
                                        ? selectedOptions
                                        : "Select an option"}
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
                                          onSelect={(label, ID) =>
                                            handleSelect(label, ID)
                                          }
                                          // closeAllDropdowns={closeAllDropdowns}
                                        />
                                      </div>
                                    )}
                                  </div> */}
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
                                        editTaskModal?.modalData?.days
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
                                        editTaskModal?.modalData?.total_time
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
                                      required
                                      min="1"
                                      max="100"
                                      name="start_days"
                                      onChange={(e) =>
                                        handleEditTaskData(
                                          e,
                                          editTaskModal.basketIndex,
                                          editTaskModal.taskIndex
                                        )
                                      }
                                      defaultValue={
                                        editTaskModal?.modalData?.start_days
                                      }
                                      className="form-control form-control-sm"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* })}  */}

                              <Modal.Footer>
                                {/* <div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      // Validate the "Hours Required" field
                                      const hoursInput =
                                        document.getElementById(
                                          "hours_required"
                                        );
                                      const enteredValue =
                                        hoursInput.value.trim();
                                      const timeRegex =
                                        /^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/;

                                      if (!timeRegex.test(enteredValue)) {
                                        // If the format is invalid, show an alert and prevent further execution
                                        alert(
                                          "Invalid time format. Please use 'HH:mm' format"
                                        );
                                        return;
                                      }
                                      const taskName = document
                                        .getElementById("task")
                                        .value.trim();
                                      const daysRequired = document
                                        .getElementById("days")
                                        .value.trim();
                                      const hoursRequired = document
                                        .getElementById("hours_required")
                                        .value.trim();
                                      const startDays = document
                                        .getElementById("start_days")
                                        .value.trim();

                                      if (
                                        !taskName ||
                                        !daysRequired ||
                                        !hoursRequired ||
                                        !startDays
                                      ) {
                                        alert(
                                          "Please fill out all required fields."
                                        );
                                        return; // Prevent further execution
                                      }

                                      dispatch(
                                        handleModalClose({
                                          showModal: false,
                                          modalData: "",
                                          modalHeader: "",
                                        })
                                      );
                                    }}
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
                                        handleModalClose({
                                          showModal: false,
                                          modalData: "",
                                          modalHeader: "",
                                        })
                                      )
                                    }
                                  >
                                    Cancel
                                  </button>
                                </div> */}

                                <div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      // Validate the "Hours Required" field
                                      const hoursInput =
                                        document.getElementById(
                                          'hours_required'
                                        );
                                      const enteredValue =
                                        hoursInput.value.trim();
                                      const timeRegex =
                                        /^(?:2[0-3]|[01][0-9]):[0-5][0-9]/;

                                      if (!timeRegex.test(enteredValue)) {
                                        // If the format is invalid, show an alert and prevent further execution
                                        alert(
                                          "Invalid time format. Please use 'HH:mm' format"
                                        );
                                        return;
                                      }

                                      // Validate the "Start Days" field for min-max range
                                      const startDaysInput =
                                        document.getElementById('start_days');
                                      const startDaysValue = parseInt(
                                        startDaysInput.value.trim(),
                                        10
                                      ); // Convert to integer

                                      if (
                                        startDaysValue < 1 ||
                                        startDaysValue > 100
                                      ) {
                                        // If the value is out of range, show an alert and prevent further execution
                                        alert(
                                          'Start days must be between 1 and 100.'
                                        );
                                        return;
                                      }

                                      // Validate other required fields
                                      const taskName = document
                                        .getElementById('task')
                                        .value.trim();
                                      const daysRequired = document
                                        .getElementById('days')
                                        .value.trim();
                                      const hoursRequired = enteredValue; // Use validated value
                                      const startDays = startDaysValue; // Use validated value

                                      if (
                                        !taskName ||
                                        !daysRequired ||
                                        !hoursRequired ||
                                        !startDays
                                      ) {
                                        alert(
                                          'Please fill out all required fields.'
                                        );
                                        return; // Prevent further execution
                                      }

                                      // If all validations pass, dispatch the action to close the modal
                                      dispatch(
                                        handleModalClose({
                                          showModal: false,
                                          modalData: '',
                                          modalHeader: ''
                                        })
                                      );
                                    }}
                                    className="btn btn-sm btn-primary"
                                    style={{ backgroundColor: '#484C7F' }}
                                  >
                                    Submit
                                  </button>

                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger"
                                    onClick={(e) =>
                                      dispatch(
                                        handleModalClose({
                                          showModal: false,
                                          modalData: '',
                                          modalHeader: ''
                                        })
                                      )
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

                              {/* <div className="col-sm-3"> */}
                              {/* <label className="col-form-label" readOnly={true}>
                                Ticket Type Name:{" "}
                                <Astrick color="red" size="13px" />
                              </label> */}

                              <label>
                                <b>
                                  Task Type Name:
                                  <Astrick color="red" size="13px" />
                                </b>
                              </label>
                              <div
                                style={{
                                  position: 'relative',
                                  display: 'inline-block',
                                  width: '100%'
                                }}
                              >
                                <div
                                  style={{
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    cursor: 'pointer',
                                    width: '100%'
                                  }}
                                  onClick={(e) => handleSelectOptionClick(e)}
                                >
                                  {selectedOptions
                                    ? selectedOptions
                                    : 'Select an option'}
                                </div>
                                {isMenuOpen && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      width: '100%', // Set the width to 100% to match the parent's width
                                      top: '100%',
                                      zIndex: 999 // Adjust the z-index as needed
                                    }}
                                  >
                                    <CustomMenuList
                                      options={transformedOptions}
                                      onSelect={(label, ID) =>
                                        handleSelect(label, ID)
                                      }
                                      // closeAllDropdowns={closeAllDropdowns}
                                    />
                                  </div>
                                )}
                              </div>
                              {/* </div> */}

                              {/* <label>
                                <b>Parent Task Type</b>
                              </label>
                              <Select
                                id="parent_id"
                                name="parent_id"
                                onChange={(e) => handleParentchange(e)}
                                className=" form-control-sm mb-2"
                                options={parent && parent}
                              /> */}

                              {/* {taskTypeDropdown && (
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
                              )} */}

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
                                // placeholder="Days Required"
                                defaultValue="00:00"
                                required
                              />
                              <label>
                                {iscalulatedFromTaken &&
                                iscalulatedFromTaken === 'START_FROM' ? (
                                  <b>
                                    {' '}
                                    Start Task After Days :
                                    <Astrick color="red" size="13px" />
                                  </b>
                                ) : (
                                  <b>
                                    {' '}
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
                                style={{ width: '25%' }}
                              >
                                Add Task
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                style={{ width: '25%' }}
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
