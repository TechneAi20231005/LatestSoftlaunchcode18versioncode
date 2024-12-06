import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ButtonComponent } from '../../../components/Utilities/Button/Button';
import PageHeader from '../../../components/Common/PageHeader';
import { Modal } from 'react-bootstrap';
import { Astrick } from '../../../components/Utilities/Style';
import TaskTicketTypeService from '../../../services/MastersService/TaskTicketTypeService';
import Alert from '../../../components/Common/Alert';
import DataTable from 'react-data-table-component';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';
import { toast } from 'react-toastify';

const CustomOption = ({ label, options, onClick, closeDropdown }) => {
  const [expanded, setExpanded] = useState(false);
  const [openOptions, setOpenOptions] = useState([]);

  const handleClick = (e) => {
    setExpanded(!expanded);
    onClick(label);
    closeDropdown();
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
              closeDropdown={closeDropdown}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CustomOptionTicket = ({ label, options, onClick, closeDropdown }) => {
  const [expanded, setExpanded] = useState(false);
  const handleClick = (e) => {
    setExpanded(!expanded);
    onClick(label);
    closeDropdown();
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
            <CustomOptionTicket
              key={option.label}
              label={option.label}
              options={option.options}
              onClick={onClick}
              ID={option.ID}
              closeDropdown={closeDropdown}
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

const CustomMenuListTicket = ({ options, onSelect }) => {
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
              hoveredIndex === option?.label
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

function TaskAndTicketTypeMaster(props) {
  const [notify, setNotify] = useState();
  const [data, setData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [exportData, setExportData] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [parentTaskName, setParentTaskName] = useState(null);
  const [parentTicketName, setParentTicketName] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (label) => {
    setSelectedOption(selectedOption === label ? null : label);
    setSelectedOptionId(label);
    closeAllDropdowns();
    setParentTaskName('');
    setParentTicketName('');
  };

  const closeAllDropdowns = () => {};

  const typeNameRef = useRef(null);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  }, [data, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  const initialValues = {
    parent_id: modal?.modalData?.parent_name
      ? modal?.modalData?.parent_name
      : '',
    type_name: modal?.modalData?.type_name ? modal?.modalData?.type_name : '',
    remark: modal?.modalData?.remark ? modal?.modalData?.remark : '',
    is_active:
      modal?.modalData?.is_active !== undefined
        ? String(modal?.modalData?.is_active)
        : '1'
  };

  const fields = [
    { name: 'parent_id', label: 'Parent Type', required: true },

    { name: 'type_name', label: 'Type name', required: true },
    { name: 'remark', label: 'Remark' }
  ];

  const validationSchema = CustomValidation(fields);

  const loadData = async () => {
    const exportTempData = [];
    setIsLoading(true);

    await new TaskTicketTypeService()
      .getAllTaskTicketType(selectedType)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            let counter = 1;
            var tempData = [];
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                type: temp[key].type,
                parent_id: temp[key].parent_id,
                type_name: temp[key].type_name,
                parent_name:
                  temp[key].parent_name === null && temp[key].parent_id === 0
                    ? 'Primary'
                    : temp[key].parent_name,

                remark: temp[key].remark,
                is_active: temp[key].is_active,
                created_at: temp[key].created_at,
                created_by: temp[key].created_by,
                updated_at: temp[key].updated_at,
                updated_by: temp[key].updated_by
              });
            }
            setData(null);
            setData(tempData);
            setIsLoading(false);
            for (const i in temp) {
              exportTempData.push({
                SrNo: exportTempData.length + 1,

                type: temp[i].type,

                type_name: temp[i].type_name,
                parent_name:
                  temp[i].parent_name === null && temp[i].parent_id === 0
                    ? 'Primary'
                    : temp[i].parent_name,

                remark: temp[i].remark,
                is_active: temp[i].is_active === 1 ? 'Active' : 'Deactive',
                created_at: temp[i].created_at,
                created_by: temp[i].created_by,
                updated_at: temp[i].updated_at,
                updated_by: temp[i].updated_by
              });
            }

            setExportData(null);
            setIsLoading(false);

            setExportData(exportTempData);
          }
        }
      });

    await new TaskTicketTypeService().getParent().then((res) => {
      if (res.status === 200) {
        // const mappedData = res.data.data.map((d) => ({
        //   value: d.id,
        //   label: d.type_name
        // }));
        // setParent(mappedData);
      } else {
      }
    });

    await new TaskTicketTypeService()?.getTaskType()?.then((res) => {
      if (res?.status === 200) {
        setTaskData(res?.data?.data);
      }
    });

    await new TaskTicketTypeService()?.getTicketType()?.then((res) => {
      if (res?.status === 200) {
        setTicketData(res?.data?.data);
      }
    });
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectOptionClick = (e) => {
    setIsMenuOpen(!isMenuOpen);
  };

  function transformData(taskData, hasPrimaryLabel = false) {
    const primaryLabel = 'Primary';
    const options = [];

    if (!hasPrimaryLabel) {
      options.push({
        ID: null,
        label: primaryLabel,
        isStatic: true,
        options: []
      });
      hasPrimaryLabel = true;
    }

    taskData?.forEach((item) => {
      const label = item.type_name;

      if (label !== primaryLabel) {
        options.push({
          ID: item.parent_id,
          label: label,
          options: item.children
            ? transformData(item.children, hasPrimaryLabel)
            : []
        });
      }
    });

    return options;
  }

  const transformedOptions = transformData(taskData);

  function transformDataTicket(ticketData, hasPrimaryLabel = false) {
    const primaryLabel = 'Primary';
    const options = [];

    if (!hasPrimaryLabel) {
      options.push({
        ID: null,
        label: primaryLabel,
        isStatic: true,
        options: []
      });
      hasPrimaryLabel = true;
    }

    ticketData?.forEach((item) => {
      const label = item.type_name;

      if (label !== primaryLabel) {
        options.push({
          ID: item.parent_id,
          label: label,
          options: item.children
            ? transformDataTicket(item.children, hasPrimaryLabel)
            : []
        });
      }
    });

    return options;
  }

  const transformedOptionsTicket = transformDataTicket(ticketData);

  const [selectedType, setSelectedType] = useState('TASK');
  const handleType = async (e) => {
    setData([]);
    setSelectedType(e.target.value);
    await new TaskTicketTypeService()
      .getAllTaskTicketType(e.target.value)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            let counter = 1;
            var tempData = [];
            const temp = res.data.data;
            for (const key in temp) {
              tempData.push({
                counter: counter++,
                id: temp[key].id,
                type: temp[key].type,
                parent_id: temp[key].parent_id,
                type_name: temp[key].type_name,
                parent_name:
                  temp[key].parent_name === null && temp[key].parent_id === 0
                    ? 'Primary'
                    : temp[key].parent_name,
                remark: temp[key].remark,
                is_active: temp[key].is_active,
                created_at: temp[key].created_at,
                created_by: temp[key].created_by,
                updated_at: temp[key].updated_at,
                updated_by: temp[key].updated_by
              });
            }
            setData(null);
            setData(tempData);
            let exportTempData = [];
            for (const i in temp) {
              exportTempData.push({
                SrNo: exportTempData.length + 1,

                id: temp[i].id,
                type: temp[i].type,

                parent_name: temp[i].parent_name,
                type_name: temp[i].type_name,
                remark: temp[i].remark,
                is_active: temp[i].is_active,
                created_at: temp[i].created_at,
                created_by: temp[i].created_by,
                updated_at: temp[i].updated_at,
                updated_by: temp[i].updated_by
              });
            }

            setExportData(null);

            setExportData(exportTempData);
          }
        }
      });
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              const modalHeader =
                selectedType === 'TASK' ? 'Edit Task Type' : 'Edit Ticket Type';
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: modalHeader
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },
    {
      name: 'Sr.No',
      selector: (row) => row.counter,
      sortable: true
    },

    {
      name: 'Type Name',
      width: '170px',
      selector: (row) => row.type_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.type_name && row.type_name.length < 20
                    ? row.type_name
                    : row.type_name.substring(0, 20) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Parent Name',
      width: '170px',
      selector: (row) => row.parent_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.parent_name && (
            <OverlayTrigger overlay={<Tooltip>{row.parent_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.parent_name && row.parent_name.length < 15
                    ? row.parent_name
                    : row.parent_name.substring(0, 15) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '150px'
    }
  ];
  const handleButtonClick = (e) => {
    setModal({ showModal: false });
  };

  const handleModal = (data) => {
    setModal(data);
    setSelectedOption(null);
  };

  const handleForm = async (values, id) => {
    const form = new FormData();
    if (!id) {
      if (values.parent_id === 'Primary') {
        form.append('parent_id', 0);
      } else {
        form.append(
          'parent_id',
          values.parent_id
            ? values.parent_id
            : modal?.modalData?.parent_name || 'Primary'
        );
      }
      form.append('type_name', values.type_name);
      form.append('remark', values.remark);

      form.append('type', selectedType);
      await new TaskTicketTypeService().postType(form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            toast.success(res.data.message, {
              autoClose: 10000
            });
            setModal({ showModal: false });
            loadData();
          } else {
            setNotify({ type: 'danger', message: res.data.message });
            toast.error(res.data.message, {
              autoClose: 10000
            });
          }
        }
      });
    } else {
      if (values.parent_id === 'Primary') {
        form.append('parent_id', 0);
      } else {
        form.append(
          'parent_id',
          values.parent_id
            ? values.parent_id
            : modal?.modalData?.parent_name || 'Primary'
        );
      }
      form.append('type_name', values.type_name);
      form.append('remark', values.remark);
      form?.append('is_active', values?.is_active);
      form.append('type', selectedType);

      await new TaskTicketTypeService()._updateType(id, form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            toast.success(res.data.message, {
              autoClose: 10000
            });
            setModal({ showModal: false });
            loadData();
          } else {
            toast.error(res.data.message, {
              autoClose: 10000
            });
          }
        }
      });
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch, searchTerm]);

  useEffect(() => {
    if (!modal.showModal) {
      setIsMenuOpen(false);
    }
  }, [modal.showModal]);

  return (
    <div className="container-xxl">
      {notify && (
        <>
          {' '}
          <Alert alertData={notify} />{' '}
        </>
      )}
      <PageHeader
        headerTitle="Ticket And Task Type Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => {
                  if (!selectedType) {
                    alert('Please select a type first');
                    return;
                  }
                  const modalHeader =
                    selectedType === 'TASK'
                      ? 'Add Task Type'
                      : 'Add Ticket Type';
                  handleModal({
                    showModal: true,
                    modalData: '',
                    modalHeader: modalHeader
                  });
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Ticket/Task Type
              </button>
            </div>
          );
        }}
      />

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by task and ticket type name...."
        exportFileName="Task And Ticket Type Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="col-sm-8 mt-3">
        <div className="row">
          <div className="col-md-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="type"
                id="TASK"
                value="TASK"
                onClick={(e) => handleType(e)}
                checked={selectedType === 'TASK'}
              />
              <label className="form-check-label" htmlFor="TASK">
                Task Type
              </label>
            </div>
          </div>
          <div className="col-md-2">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="type"
                id="TICKET"
                value="TICKET"
                onClick={(e) => handleType(e)}
                checked={selectedType === 'TICKET'}
              />
              <label className="form-check-label" htmlFor="TICKET">
                Ticket Type
              </label>
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
            modalData: '',
            modalHeader: ''
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              if (handleForm) {
                handleForm(values, modal.modalData ? modal.modalData.id : '');
              } else {
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue
            }) => (
              <Form>
                <div className="deadline-form">
                  <div className="row g-3 mb-3">
                    {selectedType && selectedType === 'TICKET' ? (
                      <div>
                        <div>
                          <label
                            className="form-label font-weight-bold"
                            readOnly={true}
                          >
                            Parent ticket Type:{' '}
                            <Astrick color="red" size="13px" />
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
                              {values.parent_id
                                ? values.parent_id
                                : modal?.modalData?.parent_name !== null
                                ? modal?.modalData?.parent_name
                                : 'Primary'}
                            </div>

                            {isMenuOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  width: '100%',
                                  top: '100%',
                                  transition: 'color 0.3s',
                                  maxHeight: '220px',
                                  msOverflowStyle: 'none',
                                  '&::-webkit-scrollbar': {
                                    display: 'none'
                                  }
                                }}
                              >
                                <CustomMenuListTicket
                                  options={transformedOptionsTicket}
                                  onSelect={(label, ID) => {
                                    setFieldValue('parent_id', label);
                                    handleSelect(label, ID);
                                  }}
                                  closeAllDropdowns={closeAllDropdowns}
                                  isMenuOpen={isMenuOpen}
                                  onClick={(e) => handleSelectOptionClick(e)}
                                />
                              </div>
                            )}

                            {touched.parent_id && errors.parent_id && (
                              <small style={{ color: 'red' }}>
                                {errors.parent_id}
                              </small>
                            )}
                          </div>

                          {parentTaskName && (
                            <small style={{ color: 'red' }}>
                              {parentTaskName}
                            </small>
                          )}

                          <div className="col-sm-12 mt-2">
                            <label className="form-label font-weight-bold">
                              Ticket Type Name :
                              <Astrick color="red" size="13px" />
                            </label>

                            <Field
                              type="text"
                              name="type_name"
                              className="form-control form-control-sm"
                              placeholder="Ticket Type Name"
                              maxLength={30}
                            />
                            <ErrorMessage
                              name="type_name"
                              component="small"
                              className="text-danger mt-1"
                            />
                          </div>

                          <div className="col-sm-12 mt-2">
                            <label className="form-label font-weight-bold">
                              Remark :
                            </label>

                            <Field
                              as="textarea"
                              type="text"
                              rows={4}
                              className="form-control form-control-sm"
                              id="remark"
                              name="remark"
                              maxLength={100}
                            />
                            <ErrorMessage
                              name="remark"
                              component="small"
                              className="text-danger mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label
                          className="form-label font-weight-bold"
                          readOnly={true}
                        >
                          Parent Task Type: <Astrick color="red" size="13px" />
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
                            onClick={(e) => {
                              handleSelectOptionClick(e);
                              setFieldValue('parent_id', values.parent_id); // Set the selected parent type
                            }}
                          >
                            {values.parent_id
                              ? values.parent_id
                              : modal?.modalData?.parent_name !== null
                              ? modal?.modalData?.parent_name
                              : ''}
                          </div>

                          {isMenuOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                width: '100%',
                                top: '100%',
                                transition: 'color 0.3s',
                                maxHeight: '220px',
                                msOverflowStyle: 'none',
                                '&::-webkit-scrollbar': {
                                  display: 'none'
                                }
                              }}
                            >
                              <CustomMenuList
                                options={transformedOptions}
                                onSelect={(label, ID) => {
                                  handleSelect(label, ID);
                                  setFieldValue('parent_id', label);
                                }}
                                closeAllDropdowns={closeAllDropdowns}
                                isMenuOpen={isMenuOpen}
                              />
                            </div>
                          )}

                          {touched.parent_id && errors.parent_id && (
                            <small style={{ color: 'red' }}>
                              {errors.parent_id}
                            </small>
                          )}
                        </div>

                        {parentTaskName && (
                          <small style={{ color: 'red' }}>
                            {parentTaskName}
                          </small>
                        )}

                        <div className="col-sm-12 mt-2">
                          <label className="form-label font-weight-bold">
                            Task Type Name :<Astrick color="red" size="13px" />
                          </label>

                          <Field
                            type="text"
                            name="type_name"
                            className="form-control form-control-sm"
                            placeholder="Task Type Name"
                            maxLength={30}
                          />
                          <ErrorMessage
                            name="type_name"
                            component="small"
                            className="text-danger mt-1"
                          />
                        </div>

                        <div className="col-sm-12 mt-2">
                          <label className="form-label font-weight-bold">
                            Remark :
                          </label>
                          <Field
                            as="textarea"
                            type="text"
                            rows={4}
                            className="form-control form-control-sm"
                            id="remark"
                            name="remark"
                            maxLength={100}
                          />
                          <ErrorMessage
                            name="remark"
                            component="small"
                            className="text-danger mt-1"
                          />
                        </div>
                      </div>
                    )}

                    <>
                      {modal.modalData && (
                        <div className="col-sm-12">
                          <label className="form-label font-weight-bold">
                            Status :<Astrick color="red" size="13px" />
                          </label>
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="is_active"
                                  value="1"
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
                                <Field
                                  type="radio"
                                  className="form-check-input"
                                  name="is_active"
                                  value="0"
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
                    </>
                  </div>
                </div>
                <Modal.Footer>
                  <ButtonComponent
                    type="submit"
                    text={modal?.modalData ? 'Update' : 'Submit'}
                  />
                  <ButtonComponent
                    type="button"
                    buttonColor="danger"
                    textColor="white"
                    getClick={handleButtonClick}
                    text="Cancel"
                  />
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  progressPending={isLoading}
                  progressComponent={<TableLoadingSkelton />}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskAndTicketTypeMaster;
