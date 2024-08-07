import React, { useState, useEffect } from 'react';
import TemplateService from '../../../services/MastersService/TemplateService';
import { useParams } from 'react-router-dom';

import Alert from '../../../components/Common/Alert';

import TaskTicketTypeService from '../../../services/MastersService/TaskTicketTypeService';

import { Astrick } from '../../../components/Utilities/Style';
import { useDispatch } from 'react-redux';
import { templateData } from './TemplateComponetAction';
export default function TaskComponent(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState(null);
  // const [selectedOptionId, setSelectedOptionId] = useState(null);
  const handleSelect = (label, ID) => {
    setSelectedOptions(selectedOptions === label ? null : label);
    // setSelectedOptionId(label);
    setIsMenuOpen(!isMenuOpen);
    const { name, value } = label;

    const updatedData = { ...data, [name]: value, task_type_id: label }; // Include label object directly

    // updatedData.task_type_id = label ? label : props.taskData.parent_name;
    setData(updatedData);

    // closeAllDropdowns();
  };
  const handleSelectOptionClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const [data, setData] = useState({
    task: props.taskData.task_name,
    // days: props.taskData.days,
    total_time: props.taskData.total_hours,
    start_days: props.taskData.start_days,
    days: props.taskData.task_days,
    basket_id: props.taskData.basket_id,
    task_type_id: props?.taskData?.parent_name
  });

  const [notify, setNotify] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const CustomMenuList = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openOptions, setOpenOptions] = useState([]);

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

  const [taskData, setTaskData] = useState([]);

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
  const transformedOptions = transformData(taskData);

  const handleTaskDelete = (e, idx) => {
    var temp = { is_active: 0 };
    new TemplateService().deleteTask(idx, temp).then((res) => {
      if (res.status === 200) {
        props.refreshData(id);
      }
    });
  };

  const handleShow = () => {
    setShow((prev) => !prev);
  };

  const loadData = async () => {
    await new TaskTicketTypeService()?.getTaskType()?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data);
      }
    });
  };

  const handleChange = (e, type) => {
    if (type === 'select2') {
      const selectedValue = e.value; // Access the 'value' property

      const name = 'task_type_id';

      const updatedData = { ...data, [name]: selectedValue };
      setData(updatedData);
    } else if (type === 'select3') {
      const name = 'parent_id';

      const selectedValue = e.value;
      const updatedData = { ...data, [name]: selectedValue };
      setData(updatedData);
    } else {
      const { name, value } = e.target;

      const updatedData = { ...data, [name]: value };

      setData(updatedData);
    }
  };

  useEffect(() => {
    loadData();
    new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          if (res.status === 200) {
          } else {
          }
        }
      }
    });

    new TaskTicketTypeService().getAllType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
        }
      }
    });
    dispatch(templateData());
  }, [dispatch]);

  const handleCancle = () => {
    setShow(false);
  };

  const handleSubmit = (e) => {
    const taskName = document.querySelector('input[name="task"]').value.trim();

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
      alert('Please fill out all required fields.');
      return;
    }
    setNotify(null);
    e.preventDefault();
    new TemplateService()
      .updateTask(props.taskData.task_id, data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            props.refreshData(id);
            setNotify({ type: 'success', message: res.data.message });
            setShow(false);
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      });
  };

  return (
    <div
      className="card mt-1 card-body d-flex justify-content-between mt-3"
      style={{ borderRadius: '10px', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)' }}
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
              if (window.confirm('Are you sure to delete this record?')) {
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
                if (window.confirm('Are you sure to delete this record?')) {
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
                          onInput={(e) => handleChange(e, 'standard')}
                        />
                        <br />

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
                              : props.taskData.parent_name}
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
                                'Day should be maximum 100'
                              );
                            } else {
                              e.target.setCustomValidity('');
                            }
                            handleChange(e, 'standard');

                            // Display error message manually
                            const errorSpan = e.target.nextElementSibling; // Get the next element (error span)
                            if (value > 100) {
                              errorSpan.innerText = 'Day should be maximum 100'; // Set error message
                            } else {
                              errorSpan.innerText = ''; // Clear error message
                            }
                          }}
                        />
                        <span className="error" style={{ color: 'red' }}></span>

                        <br />

                        <label>Hours Required</label>
                        <Astrick color="red" size="13px" />
                        <input
                          className="form-control form-control-sm"
                          defaultValue={
                            props.taskData.total_hours
                              ? props.taskData.total_hours
                              : '00:00'
                          }
                          name="total_time"
                          type="text"
                          onInput={(e) => handleChange(e, 'standard')}
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

                        {/* <label>
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
                        /> */}

                        <br />

                        <label>
                          Start task{' '}
                          {props.calculatedays === 'START_FROM'
                            ? 'after'
                            : 'before'}{' '}
                          days :
                        </label>
                        <Astrick color="red" size="13px" />
                        <input
                          type="number"
                          min="1"
                          max="100"
                          required
                          className="form-control form-control-sm"
                          defaultValue={props.taskData.start_days}
                          name="start_days"
                          onChange={(e) => handleChange(e, 'standard')} // Changed onInput to onChange
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
