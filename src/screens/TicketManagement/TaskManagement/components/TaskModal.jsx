import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal, Table } from 'react-bootstrap';
import ErrorLogService from '../../../../services/ErrorLogService';
import { _attachmentUrl } from '../../../../settings/constants';
// import { UserDropdown } from '../../../../screens/Masters/UserMaster/UserComponent';
import Select from 'react-select';
import {
  postTask,
  updateTask
  // getTaskUser
} from '../../../../services/TicketService/TaskService';
import {
  getAttachment,
  deleteAttachment
} from '../../../../services/OtherService/AttachmentService';
import Alert from '../../../../components/Common/Alert';
// import * as Validation from '../../../../components/Utilities/Validation';
import UserService from '../../../../services/MastersService/UserService';
import TaskTicketTypeService from '../../../../services/MastersService/TaskTicketTypeService';
// import TestCasesService from '../../../../services/TicketService/TestCaseService';
import { Astrick } from '../../../../components/Utilities/Style';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../../components/custom/CustomValidation/CustomValidation';
import { toast } from 'react-toastify';

export default function TaskModal(props) {
  const [notify, setNotify] = useState();
  const [isDisabled, setIsDisabled] = useState(false);
  // const typeRef = useRef();
  // const [parent, setParent] = useState();
  // const priority = ['High', 'Medium', 'Low'];
  const priority = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' }
  ];
  // const [allTask, setAllTask] = useState();
  const [userData, setUserData] = useState();
  const [defaultUserData, setDefaultUserData] = useState();
  // const attachment = [];
  const [selectedFile, setSelectedFile] = useState([]);

  const fileInputRef = useRef(null);
  // const [loading, setLoading] = useState(false);
  // const [startDate, setStartDate] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [taskData, setTaskData] = useState([]);
  const [attachment, setAttachment] = useState([]);

  // const [todate, setTodate] = useState([]);
  const [fromdate, setFromdate] = useState([]);

  const todateformat = '';
  const fromdateformat = '';

  // const [taskDropdown, setTaskDropdown] = useState();
  const handleFromDate = (e) => {
    setFromdate(e.target.value);
  };

  const fields = [
    // { name: 'project_id', label: 'Project name', required: true },
    {
      name: 'task_name',
      label: 'task_name',
      required: true,
      max: 100,
      alphaNumeric: true
    },
    {
      name: 'start_date',
      label: 'start_date',
      required: true
    },
    {
      name: 'end_date',
      label: 'end_date',
      required: true
    },
    {
      name: 'task_hours',
      label: 'task_hours',
      required: true
    },
    {
      name: 'priority',
      label: 'priority',
      required: true
    },
    {
      name: 'task_desc',
      label: 'Description',
      required: false,
      max: 1000,

    }
    // {
    //   name: 'assign_to_user',
    //   label: 'assign_to_user',
    //   required: false,
    // }
    // {
    //   name: 'dependent_task',
    //   label: 'dependent_task',
    //   required: true
    // }
  ];

  const validationSchema = CustomValidation(fields);
  const initialValues = {
    task_name: props?.data?.task_name || '',
    start_date: props?.data?.start_date || '',
    end_date: props?.data?.end_date || '',
    task_hours: props?.data?.task_hours || '00:00',
    priority: props.data.priority ? props.data.priority : '',
    dependent_task: props.data.dependentTaskId
      ? props.data.dependentTaskId
      : '',
    assign_to_user: props.data.assign_to_user ? props.data.assign_to_user : '',
    task_desc: props?.data?.task_desc || '',
    type: props.data?.type || 'TASK',
    status: props?.data?.status || 'TO_DO'
  };

  const handleSelect = (label, ID) => {
    setSelectedOption(selectedOption === label ? null : label);
    setSelectedOptionId(label);
    setIsMenuOpen(!isMenuOpen);
    setParentTaskName('');

    // closeAllDropdowns();
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectOptionClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // for Task Type Name Field created custome menuOption

  const CustomOption = ({ label, options, onClick, closeDropdown }) => {
    const [expanded, setExpanded] = useState(false);
    const [openOptions, setOpenOptions] = useState([]);

    const handleClick = (e) => {
      setExpanded(!expanded);
      onClick(label);
      closeDropdown(); // Close the dropdown after clicking the option
    };

    const handleSelect = () => {
      setOpenOptions([]);
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
                onClick={handleSelect}
                ID={option.ID}
                openOptions={openOptions}
                closeDropdown={closeDropdown} // Pass closeDropdown to nested options
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // for Task Type Name Field created custome menuList

  const CustomMenuList = ({ options, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [openOptions, setOpenOptions] = useState([]);
    // const [selectedOption, setSelectedOption] = useState(null);
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
      // setSelectedOption(label);
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
                openOptions?.includes(option.label) && option.options.length > 0
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
              onClick={() => {
                if (option?.options?.length === 0) {
                  // Only select if there are no children
                  handleSelect(option.label, option.ID);
                }
              }}
              style={{
                cursor: 'pointer',
                transition: 'color 0.3s'
              }}
            >
              {option.label}
            </div>
          </div>

          {openOptions.includes(option.label) &&
            option?.options?.length > 0 && (
              <div style={{ marginLeft: '1rem' }}>
                <div style={{ marginLeft: '1rem' }}>
                  {renderOptions(option?.options)}
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

  const handleClose = () => {
    props.close();
  };
  const [filteredOptions, setFilteredOptions] = useState();
  // const [tasktypeDropdown, setTasktypeDropdown] = useState();
  const [parentTaskName, setParentTaskName] = useState(null);

  const loadData = useCallback(async () => {
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
      props?.taskDropdown?.filter((d) => d.value !== props.data.id)
    );
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        const data1 = res.data.data.data;
        const data = data1.filter(
          (d) => d.is_active === 1 && d.account_for === 'SELF'
        );
        for (const key in data) {
          tempUserData.push({
            value: data[key].id,
            label:
              data[key].first_name +
              ' ' +
              data[key].last_name +
              ' (' +
              data[key].id +
              ')'
          });
          if (props.data && props.data.assign_to_user) {
            if (props.data.assign_to_user.includes(data[key].id)) {
              tempDefaultUserData.push({
                value: data[key].id,
                label:
                  data[key].first_name +
                  ' ' +
                  data[key].last_name +
                  ' (' +
                  data[key].id +
                  ')'
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
    // const allTask = props.allTaskList.filter(
    //   (task) => task.value != props.data.id
    // );
    // setAllTask(allTask);
    // loadAttachment();

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

    // await new TaskTicketTypeService().getParent().then((res) => {
    //   if (res.status === 200) {
    //     if (res.data.status === 1) {
    //       if (res.status === 200) {
    //         // const mappedData = res.data.data.map((d) => ({
    //         //   value: d.id,
    //         //   label: d.type_name
    //         // }));
    //         // setParent(mappedData);
    //         // parentName(mappedData);
    //       } else {
    //       }
    //     }
    //   }
    // });

    await new TaskTicketTypeService()?.getTaskType('Task')?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data.data);
      }
    });
  }, [props.data, props?.taskDropdown]);

  const loadAttachment = async () => {
    setNotify(null);
    if (props.data.id) {
      await getAttachment(props.data.id, 'TASK').then((res) => {
        if (res.status === 200) {
          setAttachment(null);
          setAttachment(res.data.data);
        }
      });
    } else {
      setAttachment(null);
    }
  };

  // function transformData(taskData, hasPrimaryLabel = false) {
  //   // const primaryLabel = "Primary";
  //   const options = [];

  //   // Push the primary label if it hasn't been pushed before
  //   if (!hasPrimaryLabel) {
  //     options.push({
  //       ID: null,
  //       label: primaryLabel,
  //       isStatic: true,
  //       options: [],
  //     });
  //     hasPrimaryLabel = true; // Update the flag to indicate primary label has been added
  //   }

  //   // Process the taskData
  //   taskData?.forEach((item) => {
  //     const label = item.type_name;

  //     if (label !== primaryLabel) {
  //       // Push API labels directly into options array
  //       options.push({
  //         ID: item.parent_id,
  //         label: label,
  //         options: item.children
  //           ? transformData(item.children, hasPrimaryLabel)
  //           : [],
  //       });
  //     }
  //   });

  //   return options;
  // }

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

  const uploadAttachmentHandler = (e, type, id = null) => {
    let file;
    if (type === 'UPLOAD') {
      const selectedFilesCount = selectedFile?.length;
      const maxTotalSizeMB = 10; // Maximum total size in MB

      // Calculate the total size of video files in the existing selected files
      const totalSizeBytesExisting = selectedFile
        .filter((file) => file.file.type.startsWith('video/'))
        .reduce((acc, currFile) => acc + currFile.file.size, 0);

      const newFiles = Array.from(e.target.files)
        .filter((file, index) => index < 5 - selectedFilesCount) // Limit to available slots
        .map((file) => ({
          file,
          show_to_customer: 0,
          show_to_project_owner: 0
        }));

      if (newFiles?.length === 0) {
        // All available slots already used
        alert('You can only upload a maximum of 5 files.');
      } else {
        // Calculate the total size of video files in the new selection
        const totalSizeBytesNew = newFiles
          .filter((file) => file.file.type.startsWith('video/'))
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
            ...newFiles
          ]);
        }

        // Clear the input field
        fileInputRef.current.value = '';
      }
    } else if (type === 'DELETE') {
      let filteredFileArray = selectedFile.filter((index) => id !== index);
      setSelectedFile(filteredFileArray);
    } else if (type === 'CUSTOMER') {
      file = selectedFile;
      file[id].show_to_customer = file[id].show_to_customer ? 0 : 1;
      setSelectedFile(file);
    } else if (type === 'PROJECT_OWNER') {
      file = selectedFile;
      file[id].show_to_project_owner = file[id].show_to_project_owner ? 0 : 1;
      setSelectedFile(file);
    } else {
      alert('Invalid Option');
    }
  };
  // const handleDeleteAttachment = (e, id) => {};
  const handleDeleteAttachment = (e, id) => {
    deleteAttachment(id).then((res) => {
      loadAttachment();
    });
  };

  const assignUserRef = useRef();
  const handleForm = async (values) => {
    // e.preventDefault();
    // setIsDisabled(true);

    // setLoading(true);
    // const selectedOptions = assignUserRef.current?.getValue() || [];
    // const selectedValues = selectedOptions.map((option) => option.value);
    const formData = new FormData();
    formData.append('ticket_id', props.data.ticket_id);
    formData.append('ticket_basket_id', props.data.ticket_basket_id);
    formData.append('type', values.type);
    formData.append('task_name', values.task_name);
    formData.append('start_date', values.start_date);
    formData.append('end_date', values.end_date);
    formData.append('task_hours', values.task_hours);
    formData.append('priority', values.priority);
    formData.append('status', values.status);
    formData.append('task_desc', values.task_desc);
    // formData.append('assign_to_user[]', values.assign_to_user);
    if (Array.isArray(values.assign_to_user)) {
      values.assign_to_user.forEach((userId) => {
        formData.append('assign_to_user[]', userId);
      });
    }
    if (Array.isArray(values.dependent_task)) {
      values.dependent_task.forEach((userId) => {
        formData.append('dependent_task[]', userId);
      });
    }
    // formData.append('dependent_task[]', values.dependent_task);
    // formData.append('parent_id', selectedOption);
    selectedFile.forEach((fileObj, index) => {
      // formData.append(`attachment`, fileObj.file);
      // formData.append(`show_to_customer_${index}`, fileObj.show_to_customer);
      // formData.append(
      //   `show_to_project_owner_${index}`,
      //   fileObj.show_to_project_owner
      // );
    });
    // formData.append('tenant_id', values.country_id);
    // formData.append('created_by', values.country_id);
    // formData.append('created_at', values.country_id);

    // const formData = new FormData(e.target);
    if (!selectedOption && !props?.data?.id) {
      setParentTaskName('Please select a parent task type.');
    } else {
      setParentTaskName(''); // Clear the error message if present

      setNotify(null);
      //Appeding File in selected State
      formData.delete('attachment[]');
      formData.delete('show_to_customer[]');
      formData.delete('show_to_project_owner[]');
      if (selectedFile) {
        for (var i = 0; i < selectedFile?.length; i++) {
          formData.append('attachment[]', selectedFile[i].file);

          formData.append(
            'show_to_customer[]',
            selectedFile[i].show_to_customer
          );
          formData.append(
            'show_to_project_owner[]',
            selectedFile[i].show_to_project_owner
          );
        }
      }

      var flag = 1;

      if (todateformat > fromdateformat) {
        alert('Please select End Date Greater than Start date');
        flag = 0;
        // e.preventDefault();
      }

      var totalCount = 0;
      for (const pair of formData.entries()) {
        if (pair[0] === 'assign_to_user[]') {
          totalCount++;
        }
      }

      if (formData.get('type') === 'GROUP_ACTIVITY') {
        if (totalCount <= 1) {
          alert('Please select minimum 2 user for group activity !!!');
          flag = 0;
          // e.preventDefault();
        }
      }

      if (flag === 1) {
        if (!selectedOption && !props?.data?.parent_name) {
          setParentTaskName('Please select a parent task type.');
        } else {
          setParentTaskName('');
        }
        if (todateformat > fromdateformat) {
          alert('Please select End Date Greater than Start date');
        } else {
          if (props.data.id) {
            // const taskTypeId = typeRef?.current?.props?.value.map((d) => {
            //   return d.value;
            // });

            if (
              !selectedOption &&
              props?.data?.id &&
              !props?.data?.parent_name
            ) {
              setParentTaskName('Please select a parent task type.');
            } else {
              setParentTaskName(''); // Clear the error message if present
              if (
                selectedOptionId === 'Primary' ||
                props?.data?.parent_name === 'Primary'
              ) {
                formData.append('parent_id', 0);
              } else {
                formData.append(
                  'parent_id',
                  // selectedOptionId ? selectedOptionId : modal?.modalData?.parent_name
                  selectedOptionId
                    ? selectedOptionId
                    : props?.data?.parent_name !== null
                    ? props?.data?.parent_name
                    : 'Primary'
                );
              }
              // formData.append("task_type_id", taskTypeId);
              await updateTask(props?.data?.id, formData)
                .then((res) => {
                  if (res.status === 200) {
                    if (res.data.status === 1) {
                      // props.loadBasket();
                      setNotify({ type: 'success', message: res.data.message });
                      // setLoading(false);

                      setTimeout(() => {
                        handleClose();
                        props.loadBasket();
                      }, 1000);
                    } else {
                      // setLoading(false);
                      setNotify({ type: 'danger', message: res.data.message });
                    }
                  } else {
                    setIsDisabled(false);
                    // setLoading(false);
                    setNotify({ type: 'danger', message: res.message });
                    new ErrorLogService().sendErrorLog(
                      'Ticket',
                      'Edit_Task',
                      'INSERT',
                      res.message
                    );
                  }
                })
                .catch((error) => {
                  // setLoading(false);
                  const { response } = error;
                  const { request, ...errorObject } = response;
                  new ErrorLogService().sendErrorLog(
                    'Task',
                    'Edit_Task',
                    'INSERT',
                    errorObject.data.message
                  );
                });
            }
          } else {
            if (selectedOptionId === 'Primary') {
              formData.append('parent_id', 0);
            } else {
              formData.append(
                'parent_id',
                // selectedOptionId ? selectedOptionId : modal?.modalData?.parent_name
                selectedOptionId
                  ? selectedOptionId
                  : props?.data?.parent_name !== null
                  ? props?.data?.parent_name
                  : 'Primary'
              );
            }
            await postTask(formData).then((res) => {
              if (res.status === 200) {
                if (res.data.status === 1) {
                  // setNotify({ type: 'success', message: res.data.message });
                  toast.success(res?.data?.message);
                  // setLoading(false);

                  handleClose();
                  props.loadBasket();
                } else {
                  // setLoading(false);
                  // setNotify({ type: 'danger', message: res.data.message });
                  toast.error(res?.data?.message);
                }
              } else {
                setIsDisabled(false);
                // setLoading(false);
                // setNotify({ type: 'danger', message: res.data.message });
                toast.error(res?.data?.message);
                new ErrorLogService().sendErrorLog(
                  'Ticket',
                  'Edit_Task',
                  'INSERT',
                  res.message
                );
              }
            });
          }
        }
      }
    }
  };

  // const handleParentchange = async (e) => {
  //   if (typeRef.current) {
  //     typeRef.current.clearValue();
  //   }
  //   await new TaskTicketTypeService().getAllType().then((res) => {
  //     if (res.status === 200) {
  //       if (res.data.status === 1) {
  //         const temp = res.data.data;
  //         setTasktypeDropdown(
  //           temp
  //             .filter((d) => d.type === 'TICKET' && d.is_active == 1)
  //             .map((d) => ({ value: d.id, label: d.type_name }))
  //         );
  //       }
  //     }
  //   });
  // };

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <>
      {/* <Modal
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
                props.data && props.data.ticket_id ? props.data.ticket_id : ''
              }
            />
            <input
              type="hidden"
              className="form-control form-control-sm"
              name="ticket_basket_id"
              defaultValue={
                props.data && props.data.ticket_basket_id
                  ? props.data.ticket_basket_id
                  : ''
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
                              props.data.type === 'TASK' || !props.data.id
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
                              props.data.type === 'GROUP_ACTIVITY'
                            }
                          />

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
                  <b>
                    Task Name :<Astrick color="red" size="13px" />
                  </b>
                </label>
                {props.data.task_name === null ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_name"
                    required
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_name"
                    defaultValue={props.data.task_name}
                    required
                  />
                )}
              </div>
            </div>

            <div>
              <label className="form-label font-weight-bold" readOnly={true}>
                Task Type Name: <Astrick color="red" size="13px" />
              </label>

              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '100%'
                }}
              >
                <div
                  className="form-control form-control-sm"
                  onClick={(e) => handleSelectOptionClick(e)}
                >
                  {selectedOption ? selectedOption : props?.data?.parent_name}
                </div>
                {isMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      width: '100%',
                      top: '100%',

                      maxHeight: '150px', // Adjust the maxHeight here as needed

                      scrollbarWidth: 'none', // Hide scrollbar in Firefox
                      msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                      '&::-webkit-scrollbar': {
                        display: 'none' // Hide scrollbar in Webkit browsers
                      }
                    }}
                  >
                    <CustomMenuList
                      options={transformedOptions}
                      onSelect={(label, ID) => handleSelect(label, ID)}
                      isMenuOpen={isMenuOpen}
                      onClick={(e) => handleSelectOptionClick(e)}
                    />
                  </div>
                )}
              </div>
              {parentTaskName && (
                <small
                  style={{
                    color: 'red'
                  }}
                >
                  {parentTaskName}
                </small>
              )}
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <label className="form-label">
                  <b>
                    Start Date :<Astrick color="red" size="13px" />
                  </b>
                </label>
                {props.data.start_date == null ? (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="startt_datee"
                    name="start_date"
                    onChange={handleFromDate}

                    min={props.ticketStartDate}
                    required


                  />
                ) : (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="startt_datee"
                    name="start_date"
                    onChange={handleFromDate}
                    min={props.ticketStartDate}
                    defaultValue={props.data.start_date}


                    required


                  />
                )}
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  <b>
                    End Date :<Astrick color="red" size="13px" />
                  </b>
                </label>
                {props.data.end_date == null ? (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="end_date"

                    min={
                      fromdate?.length > 0 ? fromdate : props.data.start_date
                    }

                    required

                  />
                ) : (
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    name="end_date"
                    defaultValue={props.data.end_date}

                    min={
                      fromdate?.length > 0 ? fromdate : props.data.start_date
                    }

                    required
                  />
                )}
              </div>


              <div className="col-md-4">
                <label className="form-label">
                  <b>
                    Task Hours :<Astrick color="red" size="13px" />
                  </b>
                </label>
                {props.data.task_hours == null ? (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_hours"
                    defaultValue={
                      props.data.task_hours ? props.data.task_hours : '00:00'
                    }
                    required

                  />
                ) : (
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    name="task_hours"
                    defaultValue={
                      props.data.task_hours ? props.data.task_hours : '00:00'
                    }
                    required

                  />
                )}
              </div>

            </div>


            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <b>
                    Task Priority :<Astrick color="red" size="13px" />
                  </b>
                </label>

                <select
                  className="form-select"
                  id="priority"
                  name="priority"
                  required
                  disabled={props.data.status === 'COMPLETED' ? true : false}
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
                        defaultChecked={props.data.status === 'TO_DO'}
                        disabled={
                          props.data.status === 'COMPLETED' ? true : false
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
                            props.data.id && props.data.status === 'IN_PROGRESS'
                          }
                          disabled={
                            props.data.status === 'COMPLETED' ? true : false
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
                            props.data.id && props.data.status === 'COMPLETED'
                          }
                          disabled={
                            props.data.status === 'COMPLETED' ? true : false
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


            <div className="row mt-3">
              <div className="col-md-12">
                <label className="form-label">
                  <b>Description :</b>
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="task_desc"
                  defaultValue={props.data.task_desc}
                  readOnly={props.data.status === 'COMPLETED' ? true : false}
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-6">
                <label className="form-label">
                  <b>
                    Assign to user :<Astrick color="red" size="13px" />
                  </b>
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
                    required
                    isDisabled={
                      props.data.status === 'COMPLETED' ? true : false
                    }
                  />
                )}
                {defaultUserData?.length === 0 && userData && (
                  <Select
                    isMulti
                    isSearchable={true}
                    name="assign_to_user[]"
                    className="basic-multi-select"
                    classNamePrefix="select"
                    options={userData}
                    ref={assignUserRef}
                    required
                    defaultValue={
                      userData &&
                      userData
                        .map((d) => ({ value: d.value, label: d.label }))
                        .filter(
                          (d) => d.value === Number(localStorage.getItem('id'))
                        )
                    }
                    isClearable
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
                      filteredOptions && filteredOptions ? filteredOptions : ''
                    }

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
                    uploadAttachmentHandler(e, 'UPLOAD', '');
                  }}
                  readOnly={props.data.status === 'COMPLETED' ? true : false}
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
                              uploadAttachmentHandler(e, 'CUSTOMER', i);
                            }}
                          />
                        </td>
                        <td className="p-1 text-center">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            onChange={(e) => {
                              uploadAttachmentHandler(e, 'PROJECT_OWNER', i);
                            }}
                          />
                        </td>
                        <td className="p-1 text-center">
                          <button
                            className="btn btn-danger text-white btn-sm p-0 px-1 mt-0"
                            type="button"
                            onClick={(e) => {
                              uploadAttachmentHandler(e, 'DELETE', i);
                            }}
                          >
                            <i
                              className="icofont-ui-delete"
                              style={{ fontSize: '12px' }}
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
              style={{ overflowX: 'auto' }}
            >
              {props?.data?.attachment &&
                props?.data?.attachment.map((attach, index) => {
                  return (
                    <div
                      className="justify-content-start"
                      style={{
                        marginRight: '5px',
                        padding: '0px',
                        width: '200px'
                      }}
                    >
                      <div
                        className="card"
                        style={{ backgroundColor: '#EBF5FB' }}
                      >
                        <div className="card-header">
                          <p style={{ fontSize: '12px' }}>
                            <b>{attach.fileName}</b>
                          </p>
                          <div className="d-flex justify-content-end p-0">
                            <a
                              href={`${_attachmentUrl + '/' + attach.filePath}`}
                              target="_blank"
                              className="btn btn-warning btn-sm p-0 px-1"
                              rel="noreferrer"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '12px', height: '15px' }}
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
                                style={{ fontSize: '12px' }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: '#484C7F' }}
              disabled={
                props.data.status === 'COMPLETED' || isDisabled ? true : false
              }
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: '#FFBA32' }}
              onClick={handleClose}
            >
              Close
            </button>
          </Modal.Footer>
        </form>
      </Modal> */}

      <Modal
        size="lg"
        show={props.show}
        onHide={handleClose}
        dialogClassName="modal-100w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleForm(values);
          }}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                  <strong>Task Details</strong>
                </Modal.Title>
              </Modal.Header>

              {notify && <Alert alertData={notify} />}

              {/* <form onSubmit={handleForm} method="post" encType="multipart/form-data"> */}
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
                    props.data && props.data.ticket_id
                      ? props.data.ticket_id
                      : ''
                  }
                />
                <input
                  type="hidden"
                  className="form-control form-control-sm"
                  name="ticket_basket_id"
                  defaultValue={
                    props.data && props.data.ticket_basket_id
                      ? props.data.ticket_basket_id
                      : ''
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
                              {/* <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                id="task_type_type"
                                value="TASK"
                                defaultChecked={
                                  props.data.type === 'TASK' || !props.data.id
                                }
                              />
                              <label
                                className="form-check-label "
                                htmlFor="status_type"
                              >
                                Task
                              </label> */}
                              <Field
                                type="radio"
                                className="form-check-input"
                                name="type"
                                id="task_type_type"
                                value="TASK"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="task_type_type"
                              >
                                Task
                              </label>
                            </div>
                          </div>
                          <div className="col-md-8">
                            <div className="form-check">
                              {/* <input
                                className="form-check-input"
                                type="radio"
                                name="type"
                                id="task_type_group_activity"
                                value="GROUP_ACTIVITY"
                                defaultChecked={
                                  props.data.type === 'GROUP_ACTIVITY'
                                }
                              />

                              <label
                                className="form-check-label"
                                htmlFor="status_group_activity"
                              >
                                Group Activity
                              </label> */}

                              <Field
                                type="radio"
                                className="form-check-input"
                                name="type"
                                id="task_type_group_activity"
                                value="GROUP_ACTIVITY"
                              />
                              <label
                                className="form-check-label"
                                htmlFor="task_type_group_activity"
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
                      <b>
                        Task Name :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {props.data.task_name === null ? (
                      // <input
                      //   type="text"
                      //   className="form-control form-control-sm"
                      //   name="task_name"
                      //   required
                      // />
                      <Field
                        type="text"
                        className="form-control form-control-sm"
                        id="task_name"
                        name="task_name"
                      />
                    ) : (
                      <Field
                        type="text"
                        className="form-control form-control-sm"
                        name="task_name"
                        defaultValue={props.data.task_name}
                        required
                      />
                    )}

                    <ErrorMessage
                      name="task_name"
                      component="small"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="form-label font-weight-bold"
                    readOnly={true}
                  >
                    Task Type Name: <Astrick color="red" size="13px" />
                  </label>

                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '100%'
                    }}
                  >
                    <div
                      className="form-control form-control-sm"
                      onClick={(e) => handleSelectOptionClick(e)}
                    >
                      {selectedOption
                        ? selectedOption
                        : props?.data?.parent_name}
                    </div>
                    {isMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          width: '100%',
                          top: '100%',

                          maxHeight: '150px', // Adjust the maxHeight here as needed

                          scrollbarWidth: 'none', // Hide scrollbar in Firefox
                          msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                          '&::-webkit-scrollbar': {
                            display: 'none' // Hide scrollbar in Webkit browsers
                          }
                        }}
                      >
                        <CustomMenuList
                          options={transformedOptions}
                          onSelect={(label, ID) => handleSelect(label, ID)}
                          isMenuOpen={isMenuOpen}
                          onClick={(e) => handleSelectOptionClick(e)}
                        />
                      </div>
                    )}
                  </div>
                  {parentTaskName && (
                    <small
                      style={{
                        color: 'red'
                      }}
                    >
                      {parentTaskName}
                    </small>
                  )}
                </div>

                <div className="row mt-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      <b>
                        Start Date :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {props.data.start_date == null ? (
                      // <input
                      //   type="date"
                      //   className="form-control form-control-sm"
                      //   id="startt_datee"
                      //   name="start_date"
                      //   onChange={handleFromDate}
                      //   min={props.ticketStartDate}
                      //   required
                      // />
                      <Field
                        type="date"
                        className="form-control form-control-sm"
                        id="start_date"
                        name="start_date"
                        // onChange={handleFromDate}
                        min={props.ticketStartDate}
                      />
                    ) : (
                      <Field
                        type="date"
                        className="form-control form-control-sm"
                        id="start_date"
                        name="start_date"
                        // onChange={handleFromDate}
                        min={props.ticketStartDate}
                        defaultValue={props.data.start_date}
                        // required
                      />
                    )}
                    <ErrorMessage
                      name="start_date"
                      component="small"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      <b>
                        End Date :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {props.data.end_date == null ? (
                      // <input
                      //   type="date"
                      //   className="form-control form-control-sm"
                      //   name="end_date"
                      //   min={
                      //     fromdate?.length > 0
                      //       ? fromdate
                      //       : props.data.start_date
                      //   }
                      //   required
                      // />
                      <Field
                        type="date"
                        className="form-control form-control-sm"
                        id="end_date"
                        name="end_date"
                        min={
                          values.start_date?.length > 0
                            ? values.start_date
                            : props.data.start_date
                        }
                      />
                    ) : (
                      <Field
                        type="date"
                        className="form-control form-control-sm"
                        name="end_date"
                        defaultValue={props.data.end_date}
                        min={
                          fromdate?.length > 0
                            ? fromdate
                            : props.data.start_date
                        }
                        required
                      />
                    )}

                    <ErrorMessage
                      name="end_date"
                      component="small"
                      className="text-danger"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      <b>
                        Task Hours :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                    {props.data.task_hours == null ? (
                      // <input
                      //   type="text"
                      //   className="form-control form-control-sm"
                      //   name="task_hours"
                      //   defaultValue={
                      //     props.data.task_hours
                      //       ? props.data.task_hours
                      //       : '00:00'
                      //   }
                      //   required
                      // />
                      <Field
                        type="text"
                        className="form-control form-control-sm"
                        name="task_hours"
                        placeholder="00:00"
                        required
                        defaultValue={undefined} // Remove this line, as Formik manages the value
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="task_hours"
                        defaultValue={
                          props.data.task_hours
                            ? props.data.task_hours
                            : '00:00'
                        }
                        required
                      />
                    )}
                    <ErrorMessage
                      name="task_hours"
                      component="small"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <b>
                        Task Priority :<Astrick color="red" size="13px" />
                      </b>
                    </label>

                    {/* <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      required
                      disabled={
                        props.data.status === 'COMPLETED' ? true : false
                      }
                    >
                      <option value="">Select Priority</option>
                      {priority.map((data) => {
                        if (
                          props.data.priority &&
                          props.data.priority === data
                        ) {
                          return (
                            <option value={data} selected>
                              {data}
                            </option>
                          );
                        } else {
                          return <option value={data}>{data}</option>;
                        }
                      })}
                    </select> */}
                    <Select
                      options={priority}
                      isClearable
                      id="priority"
                      name="priority"
                      value={
                        priority.find(
                          (option) => option.value === values.priority
                        ) || null
                      }
                      onChange={(option) =>
                        setFieldValue('priority', option ? option.value : '')
                      }
                    />
                    <ErrorMessage
                      name="priority"
                      component="small"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <b>Select Status :</b>
                    </label>
                    <div className="row">
                      <div className="col-md-3">
                        <div className="form-check">
                          {/* <input
                            className="form-check-input"
                            type="radio"
                            name="status"
                            id="status_to_do"
                            value="TO_DO"
                            defaultChecked={props.data.status === 'TO_DO'}
                            disabled={
                              props.data.status === 'COMPLETED' ? true : false
                            }
                          />
                          <label
                            className="form-check-label "
                            htmlFor="status_to_do"
                          >
                            TO DO
                          </label> */}
                          <Field
                            type="radio"
                            className="form-check-input"
                            name="status"
                            id="status_to_do"
                            value="TO_DO"
                            disabled={props?.data?.status === 'COMPLETED'}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="status_to_do"
                          >
                            TO DO
                          </label>
                        </div>
                      </div>

                      {props.data.id && (
                        <div className="col-md-5">
                          <div className="form-check">
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status_in_progress"
                              value="IN_PROGRESS"
                              defaultChecked={
                                props.data.id &&
                                props.data.status === 'IN_PROGRESS'
                              }
                              disabled={
                                props.data.status === 'COMPLETED' ? true : false
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
                            <Field
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status_completed"
                              value="COMPLETED"
                              defaultChecked={
                                props.data.id &&
                                props.data.status === 'COMPLETED'
                              }
                              disabled={
                                props.data.status === 'COMPLETED' ? true : false
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

                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="form-label">
                      <b>Description :</b>
                    </label>
                    {/* <textarea
                      className="form-control"
                      id="description"
                      name="task_desc"
                      defaultValue={props.data.task_desc}
                      readOnly={
                        props.data.status === 'COMPLETED' ? true : false
                      }
                    /> */}
                    <Field
                      as="textarea"
                      className="form-control"
                      id="description"
                      name="task_desc"
                      readOnly={props.data.status === 'COMPLETED'}
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      <b>
                        Assign to user :<Astrick color="red" size="13px" />
                      </b>
                    </label>

                    {defaultUserData?.length > 0 && userData && (
                      // <Select
                      //   defaultValue={defaultUserData}
                      //   isMulti
                      //   isSearchable={true}
                      //   ref={assignUserRef}
                      //   id="assign_to_user[]"
                      //   name="assign_to_user[]"
                      //   className="basic-multi-select"
                      //   classNamePrefix="select"
                      //   options={userData}
                      //   required
                      //   isDisabled={
                      //     props.data.status === 'COMPLETED' ? true : false
                      //   }
                      // />

                      <Select
                        options={userData}
                        isClearable
                        isMulti // Add this if you want multi-selection
                        id="assign_to_user[]"
                        name="assign_to_user[]"
                        value={userData.filter((option) =>
                          values.assign_to_user?.includes(option.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFieldValue(
                            'assign_to_user',
                            Array.isArray(selectedOptions)
                              ? selectedOptions.map((option) => option.value)
                              : []
                          )
                        }
                        // value={userData?.find(
                        //   (option) => option.value === values.assign_to_user
                        // )}
                        // onChange={(option) =>
                        //   setFieldValue(
                        //     'assign_to_user',
                        //     option ? option.value : ''
                        //   )
                        // }
                      />
                    )}

                    {defaultUserData?.length === 0 && userData && (
                      // <Select
                      //   isMulti
                      //   isSearchable={true}
                      //   name="assign_to_user[]"
                      //   className="basic-multi-select"
                      //   classNamePrefix="select"
                      //   options={userData}
                      //   ref={assignUserRef}
                      //   required
                      //   defaultValue={
                      //     userData &&
                      //     userData
                      //       .map((d) => ({ value: d.value, label: d.label }))
                      //       .filter(
                      //         (d) =>
                      //           d.value === Number(localStorage.getItem('id'))
                      //       )
                      //   }
                      //   isClearable
                      // />
                      <Select
                        options={userData}
                        isClearable
                        id="assign_to_user[]"
                        name="assign_to_user[]"
                        // value={userData.filter(
                        //   (option) =>
                        //     Array.isArray(values.assign_to_user)
                        //       ? values.assign_to_user.includes(option.value) // Check for array
                        //       : values.assign_to_user === option.value // Check for scalar
                        // )}

                        // onChange={(selectedOptions) =>
                        //   setFieldValue(
                        //     'assign_to_user',
                        //     Array.isArray(selectedOptions)
                        //       ? selectedOptions.length === 1
                        //         ? selectedOptions[0].value // Single value: pass as scalar
                        //         : selectedOptions.map((option) => option.value) // Multiple values: pass as array
                        //       : []
                        //   )
                        // }
                        // isMulti
                        value={userData.filter(
                          (option) =>
                            Array.isArray(values.assign_to_user)
                              ? values.assign_to_user.includes(option.value) // Check for array
                              : values.assign_to_user === option.value // Check for scalar
                        )}
                        onChange={(selectedOptions) => {
                          const selectedValues = Array.isArray(selectedOptions)
                            ? selectedOptions.map((option) => option.value) // Map selected options to their values
                            : [];
                          setFieldValue('assign_to_user', selectedValues); // Update the form value
                        }}
                        isMulti
                      />
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">
                      <b>Dependent Task :</b>
                    </label>
                    {props.data.id != null && props.taskDropdown && (
                      // <Select
                      //   isMulti
                      //   isSearchable={true}
                      //   name="dependent_task[]"
                      //   options={
                      //     filteredOptions && filteredOptions
                      //       ? filteredOptions
                      //       : ''
                      //   }
                      //   defaultValue={
                      //     props.data &&
                      //     props.taskDropdown.filter((d) =>
                      //       props.data.dependentTaskId.includes(d.value)
                      //     )
                      //   }
                      // />

                      <Select
                        options={
                          filteredOptions && filteredOptions
                            ? filteredOptions
                            : ''
                        }
                        isClearable
                        isMulti
                        id="dependent_task[]"
                        name="dependent_task[]"
                        // value={filteredOptions?.filter((option) =>
                        //   props.data.dependentTaskId?.includes(option.value)
                        // )}
                        // value={filteredOptions?.filter(
                        //   (option) => option.value === values.dependent_task
                        // )}
                        // onChange={(selectedOptions) =>
                        //   setFieldValue(
                        //     'dependent_task',
                        //     Array.isArray(selectedOptions)
                        //       ? selectedOptions.length === 1
                        //         ? selectedOptions[0].value // Single value: pass as scalar
                        //         : selectedOptions.map((option) => option.value) // Multiple values: pass as array
                        //       : []
                        //   )
                        // }
                        value={filteredOptions?.filter((option) =>
                          values.dependent_task?.includes(option.value)
                        )}
                        onChange={(selectedOptions) =>
                          setFieldValue(
                            'dependent_task',
                            Array.isArray(selectedOptions)
                              ? selectedOptions.map((option) => option.value)
                              : []
                          )
                        }
                      />
                    )}
                    {props.data.id == null && props.taskDropdown && (
                      // <Select
                      //   isMulti
                      //   isSearchable={true}
                      //   name="dependent_task[]"
                      //   options={filteredOptions && filteredOptions}
                      //   onChange={(option) =>
                      //     setFieldValue('dependent_task', option?.value || null)
                      //   }
                      // />
                      <Select
                        options={
                          filteredOptions && filteredOptions
                            ? filteredOptions
                            : ''
                        }
                        isClearable
                        id="dependent_task[]"
                        name="dependent_task[]"
                        // value={filteredOptions?.filter((option) =>
                        //   values.dependent_task?.includes(option.value)
                        // )}
                        value={filteredOptions?.filter(
                          (option) =>
                            Array.isArray(values.dependent_task)
                              ? values.dependent_task.includes(option.value) // Check for array
                              : values.dependent_task === option.value // Check for scalar
                        )}
                        // onChange={(selectedOptions) =>
                        //   setFieldValue(
                        //     'dependent_task',
                        //     selectedOptions
                        //       ? selectedOptions.map((option) => option.value)
                        //       : []
                        //   )
                        // }
                        onChange={(selectedOptions) =>
                          setFieldValue(
                            'dependent_task',
                            Array.isArray(selectedOptions)
                              ? selectedOptions.length === 1
                                ? selectedOptions[0].value // Single value: pass as scalar
                                : selectedOptions.map((option) => option.value) // Multiple values: pass as array
                              : []
                          )
                        }
                        isMulti
                      />
                    )}
                  </div>
                </div>

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
                        uploadAttachmentHandler(e, 'UPLOAD', '');
                      }}
                      readOnly={
                        props.data.status === 'COMPLETED' ? true : false
                      }
                    />
                  </div>
                </div>

                {selectedFile && selectedFile.length > 0 && (
                  <Table bordered size="sm">
                    <thead>
                      <tr className="p-1">
                        <th className="p-1 text-center">Name</th>
                        <th className="p-1 text-center">Show To Customer</th>
                        <th className="p-1 text-center">
                          Show To Project Owner
                        </th>
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
                                  uploadAttachmentHandler(e, 'CUSTOMER', i);
                                }}
                              />
                            </td>
                            <td className="p-1 text-center">
                              <input
                                type="checkbox"
                                className="form-check-input"
                                onChange={(e) => {
                                  uploadAttachmentHandler(
                                    e,
                                    'PROJECT_OWNER',
                                    i
                                  );
                                }}
                              />
                            </td>
                            <td className="p-1 text-center">
                              <button
                                className="btn btn-danger text-white btn-sm p-0 px-1 mt-0"
                                type="button"
                                onClick={(e) => {
                                  uploadAttachmentHandler(e, 'DELETE', i);
                                }}
                              >
                                <i
                                  className="icofont-ui-delete"
                                  style={{ fontSize: '12px' }}
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
                  style={{ overflowX: 'auto' }}
                >
                  {props?.data?.attachment &&
                    props?.data?.attachment?.attachments?.map(
                      (attach, index) => {
                        return (
                          <div
                            className="justify-content-start"
                            style={{
                              marginRight: '5px',
                              padding: '0px',
                              width: '200px'
                            }}
                          >
                            <div
                              className="card"
                              style={{ backgroundColor: '#EBF5FB' }}
                            >
                              <div className="card-header">
                                <p style={{ fontSize: '12px' }}>
                                  <b>{attach.name}</b>
                                </p>
                                <div className="d-flex justify-content-end p-0">
                                  <a
                                    href={`${_attachmentUrl + attach.path}`}
                                    target="_blank"
                                    className="btn btn-warning btn-sm p-0 px-1"
                                    rel="noreferrer"
                                  >
                                    <i
                                      className="icofont-download"
                                      style={{
                                        fontSize: '12px',
                                        height: '15px'
                                      }}
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
                                      style={{ fontSize: '12px' }}
                                    ></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  style={{ backgroundColor: '#484C7F' }}
                  disabled={
                    props.data.status === 'COMPLETED' || isDisabled
                      ? true
                      : false
                  }
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  style={{ backgroundColor: '#FFBA32' }}
                  onClick={handleClose}
                >
                  Close
                </button>
              </Modal.Footer>
              {/* </form> */}
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
