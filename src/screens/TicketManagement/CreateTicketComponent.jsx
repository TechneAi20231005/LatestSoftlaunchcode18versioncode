import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Spinner, Modal } from 'react-bootstrap';
import Alert from '../../components/Common/Alert';
import { _base, userSessionData } from '../../settings/constants';

import MyTicketService from '../../services/TicketService/MyTicketService';
import { _attachmentUrl } from '../../settings/constants';

import PageHeader from '../../components/Common/PageHeader';
import UserService from '../../services/MastersService/UserService';

import Select from 'react-select';
import { Astrick } from '../../components/Utilities/Style';

import DynamicFormDropdownMasterService from '../../services/MastersService/DynamicFormDropdownMasterService';

import DepartmentService from '../../services/MastersService/DepartmentService';
import QueryTypeService from '../../services/MastersService/QueryTypeService';
import CustomerMappingService from '../../services/SettingService/CustomerMappingService';
import DepartmentMappingService from '../../services/MastersService/DepartmentMappingService';
import TaskTicketTypeService from '../../services/MastersService/TaskTicketTypeService';
import { useDispatch, useSelector } from 'react-redux';
import { getCustomerMappingData } from '../Settings/CustomerMapping/Slices/CustomerMappingAction';
import { getEmployeeDataById, getRoles } from '../Dashboard/DashboardAction';
import { getUserForMyTicketsData } from './MyTicketComponentAction';
import { toast } from 'react-toastify';

export default function CreateTicketComponent() {
  const navigate = useNavigate();

  const [notify, setNotify] = useState(null);
  const departmentRef = useRef();
  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 18)
  );

  const current = new Date();
  const [isMultipleDepartment, setisMultipleDepartment] = useState([]);

  const todayDate = `${current.getFullYear()}-${
    current.getMonth() + 1 < 10
      ? '0' + current.getMonth() + 1
      : current.getMonth() + 1
  }-${current.getDate()}`;

  const ticketData = {
    department_id: null,
    customer_mapping_id: null,
    ticket_uploading: 'REGULAR',
    confirmation_required: '0',
    query_type_id: null,
    ticket_date: todayDate,
    expected_solve_date: null,
    cuid: null,
    ticket_type: null,
    priority: null,
    description: null,
    status: null,
    assign_to_department_id: null,
    assign_to_user_id: null,
    project_id: null,
    module_id: null,
    submodule_id: null
  };

  const handleSelect = (label, ID) => {
    setSelectedOption(selectedOption === label ? null : label);
    setSelectedOptionId(label);
    setIsMenuOpen(!isMenuOpen);

    // closeAllDropdowns();
  };
  var today = new Date().toISOString().split('T')[0];
  const [data, setData] = useState(ticketData);

  const showLoaderModal = false;

  const [rows, setRows] = useState();

  // const [dynamicTicketData, setDynamicTicketData] = useState(null);

  // const [queryType, setQueryType] = useState(null);
  const [customerMapping, setCustomerMapping] = useState(null);

  const [isFileGenerated, setIsFileGenerated] = useState(null);
  // const [alldepartmentData, setAllDepartmentData] = useState();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [departmentDropdown, setDepartmentDropdown] = useState();
  const [userDropdown, setUserDropdown] = useState();
  const [customerID, setCustomerId] = useState();

  // const [expectedSolveDate, setExpectedSolveDate] = useState(null);

  // const [parent, setParent] = useState();

  // const [queryGroupData, setQueryGroupData] = useState(null);
  // const [queryTypeData, setQueryTypeData] = useState(null);

  const [userDepartments, setUserDepartments] = useState();
  const [approch, setApproch] = useState();
  // const [user, setUser] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ticketsData, setTicketsData] = useState([]);

  const [queryGroupDropdown, setQueryGroupDropdown] = useState(null);
  const [queryGroupTypeData, setQueryGroupTypeData] = useState();
  const fileInputRef = useRef(null);

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const CustomMenuListTicket = ({ options, onSelect }) => {
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

  const uploadAttachmentHandler = (e, type, id = null) => {
    if (type === 'UPLOAD') {
      const files = e.target.files;
      const uploadedFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if file size exceeds 5MB (5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
          alert(
            'File size exceeds 5MB. Please upload a file smaller than 5MB.'
          );
          continue; // Skip this file and move to the next one
        }
        const reader = new FileReader();

        reader.onload = ((file) => {
          return function (event) {
            uploadedFiles.push({
              file: file,
              fileName: file.name,
              tempUrl: event.target.result
            });
            if (uploadedFiles.length === files.length) {
              setSelectedFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
            }
          };
        })(file);

        reader.readAsDataURL(file);
      }
    } else if (type === 'DELETE') {
      fileInputRef.current.value = '';
      const filteredFiles = selectedFiles.filter((_, index) => id !== index);
      setSelectedFiles(filteredFiles);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (e.target.name === 'CHECKBOX' && selectedCheckBoxValue?.length <= 0) {
      // Here you can proceed with form submission
      alert('At least one checkbox must be selected');
      return false;
    }

    if (isSubmitted) {
      return;
    }
    setIsSubmitted(true);

    const formData = new FormData(e.target);

    if (selectedFiles) {
      for (var i = 0; i < selectedFiles?.length; i++) {
        formData.append('bulk_images[' + i + ']', selectedFiles[i].file.file);
      }
    }

    formData.append('parent_id', selectedOptionId);

    var flag = 1;

    // eslint-disable-next-line no-use-before-define
    if (selectQueryGroup && selectQueryGroup.length > 0) {
      formData.append('dynamicForm', JSON.stringify(rows));
      var selectCountry = formData.getAll('customer_id');
      var selectQueryGroup = formData.getAll('query_group_id');

      if (selectCountry === '') {
        flag = 0;
      }
      if (selectQueryGroup === '') {
        alert('Please select query group');
        e.preventDefault();
        flag = 0;
      } else {
        flag = 1;
      }
    }

    setNotify(null);
    if (flag === 1) {
      await new MyTicketService()
        .postTicket(formData)
        .then((res) => {
          if (res?.status === 200) {
            if (res?.data?.status === 1) {
              toast.success(res?.data?.message);
              navigate(`/${_base}/Ticket`);

              setIsSubmitted(false);
            } else {
              if (formData.getAll('ticket_uploading') === 'REGULAR') {
                toast.error(res?.data?.message);
                setIsSubmitted(false);
              } else {
                if (!res?.data?.data) {
                  toast.error(res?.data?.message);

                  setIsSubmitted(false);
                  return;
                }
                toast.success(res?.data?.message);

                let url = `${_attachmentUrl}` + res.data.data;
                window.open(url, '_blank').focus();
                setIsSubmitted(false);
              }
            }
          } else {
            toast.success(res?.data?.message);
            setIsSubmitted(false);
          }
        })
        .catch((res) => {
          toast.success(res?.data?.message);
        });
    }
  };

  const queryTypeRef = useRef();

  const handleGetQueryTypeForm = async (e) => {
    if (e && e.value) {
      setRows(null);

      var data = customerMapping.filter((val) => val.query_type_id === e.value);
      setApproch(data[0]?.approach);
      const cmId = data?.length > 0 ? data[0].id : null;
      if (cmId) {
        await new MyTicketService().getExpectedSolveDate(cmId).then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
            }
          }
        });
      } else {
      }

      setRows(null);
      if (data && data?.length === 0) {
        alert(
          'Dynamic Form is not mapped against this Query Type, Please Map Form first'
        );
        setQueryGroupTypeData(null);
      } else {
        var dynamicForm = data[0]?.dynamic_form;

        const filteredArray = dynamicForm.filter(
          (formInstance) =>
            formInstance?.inputType === 'select' &&
            formInstance?.inputAddOn?.inputDataSource
        );

        await Promise.all(
          filteredArray?.map((d) =>
            new DynamicFormDropdownMasterService().getDropdownById(
              d?.inputAddOn?.inputDataSource
            )
          )
        )
          .then((result) => {
            var tempResponse = [];

            result.forEach((res, i) => {
              if (res.status === 200) {
                if (res.data.status === 1) {
                  var temp = [];
                  temp = res.data.data.dropdown.map((d) => ({
                    value: d.id + '|' + d.label,
                    label: d.label
                  }));
                  tempResponse.push(temp);
                }
              }
            });

            //Remove from array
            dynamicForm.forEach((d, i) => {
              if (d.inputType === 'select') {
                if (tempResponse?.length > 0) {
                  dynamicForm[i].inputAddOn.inputDataSourceData =
                    tempResponse[0];
                  tempResponse.splice(i, 1);
                }
              }
            });
          })
          .catch((err) => {});
        setRows(dynamicForm);
      }
    }
  };

  const [selectedDropdown, setSelectedDropdown] = useState([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSelectOptionClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const dynamicChangeHandle = (e) => {
    const { name, value } = e.target;
    setSelectedDropdown({ ...selectedDropdown, [name]: value });
    // setDynamicTicketData((prev) => ({ ...prev, [name]: value }));
  };

  const loadData = useCallback(async () => {
    const query_type_id = '';
    const queryTypeTemp = [];
    const status = 1;
    dispatch(getEmployeeDataById(localStorage.getItem('id')));

    await new CustomerMappingService()
      .getCustomerMappingSettings(query_type_id)
      .then((res) => {
        if (res.data.status === 1) {
          if (res.data.data) {
            //SET ALL CUSTOMER MAPPING DATA IN A STATE
            setCustomerMapping(null);
            setCustomerMapping(res.data.data);

            res.data.data.forEach((query) => {
              if (query.query_type_id) {
                if (!queryTypeTemp.includes(query.query_type_id)) {
                  queryTypeTemp.push(query.query_type_id);
                }
              }
            });
          }
        }
      });

    await new UserService()
      .getUserById(localStorage.getItem('id'))
      .then((res) => {
        const { data } = res?.data;

        if (res?.data?.status === 1 && data) {
          setCustomerId(data?.customer_type_id);
        }
      });

    var queryType = [];
    await new QueryTypeService().getQueryType().then((resp) => {
      if (resp.data.status === 1) {
        resp.data.data
          .filter((q) => q.is_active === 1)
          .filter((q) => queryTypeTemp.includes(q.id))
          .forEach((q) => {
            queryType.push({ id: q.id, query_type_name: q.query_type_name });
          });
      }
    });

    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active,department_id,email_id';
    dispatch(getUserForMyTicketsData(inputRequired)).then((res) => {
      if (res.payload.status === 200) {
      }
    });
    await new QueryTypeService().getAllQueryGroup(status).then((res) => {
      if (res.data.status === 1) {
        setQueryGroupDropdown(
          res.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({ value: d.id, label: d.group_name }))
        );
      }
    });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          var defaultValue = [{ value: 0, label: 'Select Department' }];
          var dropwdown = res.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({ value: d.id, label: d.department }));
          defaultValue = [...defaultValue, ...dropwdown];
          setDepartmentDropdown(defaultValue);
        }
      }
    });

    await new TaskTicketTypeService()?.getTicketType()?.then((res) => {
      if (res?.status === 200) {
        setTicketsData(res?.data?.data);
      }
    });

    new DepartmentMappingService()
      .getDepartmentMappingByEmployeeId(userSessionData.userId)
      .then((resp) => {
        if (resp.data.status === 1) {
          setisMultipleDepartment(resp.data.data);
          setUserDepartments(
            resp.data.data.map((d) => ({
              value: d.department_id,
              label: d.department
            }))
          );
          if (resp?.data?.data?.length > 0) {
            setData((prev) => {
              const newPrev = { ...prev };
              newPrev['from_department_id'] = resp.data.data[0].department_id;
              return newPrev;
            });
          }
        }
      });

    dispatch(getRoles());
  }, [dispatch]);

  const handleDownloadFormat = async (e) => {
    setNotify(null);

    await new MyTicketService().getBulkFormat().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          let url = `${_attachmentUrl}` + res.data.data;
          window.open(url, '_blank')?.focus();
          setIsFileGenerated(res.data.data);
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      } else {
        setNotify({ type: 'danger', message: res.message });
      }
    });
  };

  const handleQueryGroupDropDown = async (e) => {
    try {
      setQueryGroupTypeData([]);
      setNotify({});
      if (queryTypeRef?.current) {
        queryTypeRef?.current.clearValue();
      }

      const res = await new QueryTypeService().getQueryTypeMapped(e.value);

      if (res.data.status === 1) {
        const activeData = res.data.data
          .filter((d) => d.is_active === 1)
          .map((d) => ({ value: d.id, label: d.query_type_name }));
        setQueryGroupTypeData(activeData);
      } else {
        setNotify({
          type: 'danger',
          message: 'No Query type mapped for this Query group'
        });
      }
    } catch (res) {
      setNotify({ type: 'danger', message: res.message });
    }
  };

  const handleGetDepartmentUsers = async (e) => {
    setUserDropdown(null);
    await new UserService().getUserWithMultipleDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          var defaultValue = [{ value: '', label: 'Select User' }];

          const dropdown = res.data.data
            .filter((d) => d.is_active === 1)
            .filter((d) => d.multiple_department_id.includes(e.value))
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
            }));

          if (data.approach === 'RW') {
            defaultValue = dropdown;
          } else {
            defaultValue = [...defaultValue, ...dropdown];
          }
          setUserDropdown(defaultValue);
        }
      }
    });
  };

  function transformDataTicket(ticketsData) {
    const options = [];

    // Process the ticketData
    ticketsData?.forEach((item) => {
      const label = item.type_name;

      // Push API labels directly into options array
      options.push({
        ID: item.parent_id,
        label: label,
        options: item.children ? transformDataTicket(item.children) : []
      });
    });

    return options;
  }

  // Transform the ticketData
  const transformedOptionsTicket = transformDataTicket(ticketsData);

  const handleAutoChanges = async (e, type, nameField) => {
    if (data) {
      var value = type === 'Select2' ? e && e.value : e.target.value;
      if (nameField === 'query_type_id') {
        const x = customerMapping.filter((d) => d.query_type_id === value);
        const accountFor = localStorage.getItem('account_for');

        if (x?.length > 0) {
          const filteredItems = x.filter((item) =>
            accountFor === 'SELF'
              ? !item.customer_type_id || item.customer_type_id === '0'
              : item.customer_type_id
          );

          //  const mappingId = filteredItems.map((item) => item.id);

          const customerMapping = filteredItems.filter(
            (item) => Number(item.customer_type_id) === Number(customerID)
          );
          const mappingId = filteredItems.map((item) =>
            accountFor === 'SELF' ? item.id : customerMapping[0].id
          );

          setData((prev) => {
            const newPrev = { ...prev };
            newPrev['customer_mapping_id'] = mappingId[0];
            newPrev['confirmation_required'] =
              customerMapping[0]?.confirmation_required;

            newPrev['priority'] = x[0].priority;
            return newPrev;
          });
        }
      }
    }
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev[nameField] = value;
      return newPrev;
    });
  };

  const [selectedValue, setSelectedValue] = useState('');
  const [selectedCheckBoxValue, setSelectedCheckBoxValue] = useState('');

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const handleCheckBoxChange = (event) => {
    setSelectedCheckBoxValue(event.target.value);
  };

  useEffect(() => {
    loadData();
    dispatch(getCustomerMappingData());
  }, [dispatch, loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Create Ticket" />

      {notify && <Alert alertData={notify} />}
      <form onSubmit={handleForm} method="post" encType="multipart/form-data">
        <input
          type="hidden"
          className="form-control form-control-sm"
          id="customer_mapping_id"
          name="customer_mapping_id"
          value={data && data.customer_mapping_id}
        />

        <div className="card mt-2">
          <div className="card-body">
            <div className="row" style={{ fontSize: '18px' }}>
              <div className="col-sm-2">
                <label className="col-form-label">
                  <b>
                    Create Ticket <Astrick color="red" /> :{' '}
                  </b>
                </label>
              </div>
              <div className="col-sm-8 mt-2">
                <label class="fancy-checkbox parsley-error" />
                <input
                  type="radio"
                  required=""
                  key={Math.random()}
                  id="ticket_uploading_regular"
                  name="ticket_uploading"
                  value="REGULAR"
                  checked={data.ticket_uploading === 'REGULAR'}
                  onChange={(e) =>
                    handleAutoChanges(e, 'Radio', 'ticket_uploading')
                  }
                />
                <span class="px-2">Manual</span>
                <label class="fancy-checkbox parsley-error" />
                <input
                  type="radio"
                  required=""
                  key={Math.random()}
                  id="ticket_uploading_bulk_uploading"
                  name="ticket_uploading"
                  value="BULK_UPLOADING"
                  checked={data.ticket_uploading === 'BULK_UPLOADING'}
                  onChange={(e) =>
                    handleAutoChanges(e, 'Radio', 'ticket_uploading')
                  }
                />
                <span class="px-2">Bulk Upload</span>
              </div>
            </div>
          </div>
        </div>

        {data && data.ticket_uploading === 'REGULAR' && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="form-group row ">
                <div className="col-sm-3">
                  <label className="col-form-label">
                    <b>
                      Your Department
                      <Astrick color="red" /> :{' '}
                    </b>
                  </label>
                  {userDepartments && (
                    <Select
                      defaultValue={
                        userDepartments?.length === 1
                          ? userDepartments[0]
                          : // eslint-disable-next-line array-callback-return
                            isMultipleDepartment?.map((department) => {
                              if (department?.is_default) {
                                return {
                                  value: department?.department_id,
                                  label: department?.department
                                };
                              }
                            })
                      }
                      options={userDepartments}
                      name="from_department_id"
                      id="from_department_id"
                      ref={departmentRef}
                      required={true}
                      onChange={(e) =>
                        handleAutoChanges(e, 'Select2', 'from_department_id')
                      }
                    />
                  )}
                </div>

                <div className="col-sm-3">
                  <label className="col-form-label">
                    <b>
                      Query Group
                      <Astrick color="red" /> :
                    </b>
                  </label>

                  {queryGroupDropdown && (
                    <Select
                      id="query_group_id"
                      name="query_group_id"
                      required
                      options={queryGroupDropdown}
                      onChange={(e) => handleQueryGroupDropDown(e)}
                    />
                  )}
                </div>

                {queryGroupTypeData && (
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Query Type
                        <Astrick color="red" /> :
                      </b>
                    </label>
                    <Select
                      id="query_type_id"
                      name="query_type_id"
                      ref={queryTypeRef}
                      required
                      options={queryGroupTypeData}
                      onChange={(e) => {
                        handleAutoChanges(e, 'Select2', 'query_type_id');
                        handleGetQueryTypeForm(e);
                      }}
                    />
                  </div>
                )}
                {departmentDropdown && approch && approch === 'AU' && (
                  <>
                    <div className="col-sm-3">
                      <label className="col-form-label">
                        <b>
                          Select Department
                          <Astrick color="red" /> :
                        </b>
                      </label>

                      {departmentDropdown && (
                        <Select
                          id="assign_to_department_id"
                          name="assign_to_department_id"
                          required
                          options={departmentDropdown}
                          onChange={(e) => {
                            handleAutoChanges(
                              e,
                              'Select2',
                              'assign_to_department_id'
                            );
                            handleGetDepartmentUsers(e);
                          }}
                        />
                      )}
                    </div>
                    <div className="col-sm-3">
                      <label className="col-form-label">
                        <b>
                          Select User
                          <Astrick color="red" /> :
                        </b>
                      </label>

                      {userDropdown && (
                        <Select
                          id="assign_to_user_id"
                          name="assign_to_user_id"
                          required
                          options={userDropdown}
                          onChange={(e) => {
                            handleAutoChanges(
                              e,
                              'Select2',
                              'assign_to_user_id'
                            );
                          }}
                        />
                      )}
                    </div>
                  </>
                )}

                <div className="col-sm-3 mt-2">
                  <label
                    className="form-label font-weight-bold"
                    readOnly={true}
                  >
                    Ticket Type Name:
                  </label>

                  <div>
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
                        {selectedOption}
                      </div>
                      {isMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            width: '100%', // Set the width to 100% to match the parent's width
                            top: '100%', // Position the menu at the top of the parent element
                            zIndex: '1', // Ensure the menu is on top of other elements
                            maxHeight: '150px', // Adjust the maxHeight here as needed
                            // overflowY: "auto", // Enable vertical scrolling
                            // scrollbarWidth: "none", // Hide scrollbar in Firefox
                            msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                            '&::-webkit-scrollbar': {
                              display: 'none' // Hide scrollbar in Webkit browsers
                            }
                          }}
                        >
                          <CustomMenuListTicket
                            options={transformedOptionsTicket}
                            onSelect={(label, ID) => handleSelect(label, ID)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {data.ticket_uploading === 'REGULAR' && (
                <div className="form-group row mt-3">
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>Confirmation Required :</b>
                    </label>
                    <div class="form-group mt-2">
                      <label class="fancy-checkbox parsley-error" />
                      <input
                        type="radio"
                        required=""
                        key={Math.random()}
                        id="confirmation_required_yes"
                        name="confirmation_required"
                        value="1"
                        checked={
                          data.confirmation_required === '1' ||
                          data.confirmation_required === 1
                        }
                        onChange={(e) =>
                          handleAutoChanges(e, 'Radio', 'confirmation_required')
                        }
                      />
                      <span class="px-2">YES</span>

                      <label class="fancy-checkbox parsley-error" />
                      <input
                        type="radio"
                        required=""
                        key={Math.random()}
                        id="confirmation_required_no"
                        name="confirmation_required"
                        value="0"
                        checked={
                          data.confirmation_required === '0' ||
                          data.confirmation_required === 0
                        }
                        onChange={(e) =>
                          handleAutoChanges(e, 'Radio', 'confirmation_required')
                        }
                      />
                      <span class="px-2">NO</span>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>Ref Id :</b>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="cuid"
                      name="cuid"
                      onInput={(e) => handleAutoChanges(e, 'Text', 'cuid')}
                    />
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Priority : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      id="priority"
                      name="priority"
                      required={true}
                      value={data.priority}
                      onChange={(e) =>
                        handleAutoChanges(e, 'Select', 'priority')
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Very High">Very High</option>
                    </select>
                  </div>
                  <div className="col-sm-3">
                    <label className="col-form-label">
                      <b>
                        Expected Solve Date :<Astrick color="red" size="13px" />
                      </b>
                    </label>

                    <input
                      type="date"
                      className="form-control form-control-sm"
                      name="expected_solve_date"
                      id="expected_solve_date"
                      required
                      min={today}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {data.ticket_uploading === 'BULK_UPLOADING' && (
          <>
            <div className="col-sm-3">
              <button
                type="button"
                className="btn btn-danger text-white"
                style={{ marginTop: '30px' }}
                onClick={(e) => {
                  handleDownloadFormat(e);
                }}
              >
                Generate Bulk Format
              </button>
            </div>
          </>
        )}

        {data.ticket_uploading === 'REGULAR' && rows && rows?.length > 0 && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="row">
                {rows.map((data, index) => {
                  return (
                    <div className={`${data.inputWidth} mt-2`}>
                      <label>
                        <b>
                          {data.inputLabel}{' '}
                          {data.inputMandatory === true ? (
                            <Astrick color="red" size="13px" />
                          ) : (
                            ''
                          )}
                          :
                        </b>
                      </label>
                      {data.inputType === 'text' && (
                        <input
                          type={data.inputType}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          name={data.inputName}
                          defaultValue={data.inputDefaultValue}
                          required={data.inputMandatory === true ? true : false}
                          onChange={dynamicChangeHandle}
                          className="form-control form-control-sm"
                        />
                      )}
                      {data.inputType === 'textarea' && (
                        <textarea
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          name={data.inputName}
                          className="form-control form-control-sm"
                          defaultValue={
                            selectedDropdown
                              ? selectedDropdown[data.inputName]
                              : ''
                          }
                          onChange={dynamicChangeHandle}
                          required={data.inputMandatory === true ? true : false}
                        >
                          {data.inputDefaultValue}
                        </textarea>
                      )}

                      {data.inputType === 'date' && (
                        <div className="form-control">
                          <input
                            type="date"
                            name={data.inputName}
                            required={
                              data && data.inputMandatory === true
                                ? true
                                : false
                            }
                            defaultValue={data.inputDefaultValue}
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}
                      {data.inputType === 'datetime-local' && (
                        <div className="form-control">
                          <input
                            type="datetime-local"
                            name={data.inputName}
                            required={
                              data && data.inputMandatory === true
                                ? true
                                : false
                            }
                            onChange={dynamicChangeHandle}
                            defaultValue={data.inputDefaultValue}
                            style={{ width: '100%' }}
                          />
                        </div>
                      )}

                      {data.inputType === 'time' && (
                        <input
                          type={data.inputType}
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          name={data.inputName}
                          defaultValue={
                            // selectedDropdown
                            //   ? selectedDropdown[data.inputName]
                            //   : ""
                            data.inputDefaultValue
                          }
                          onChange={dynamicChangeHandle}
                          required={data.inputMandatory === true ? true : false}
                          className="form-control form-control-sm"
                        />
                      )}

                      {data.inputType === 'radio' &&
                      data?.inputAddOn?.inputRadio
                        ? data?.inputAddOn?.inputRadio?.map((d) => {
                            return (
                              <div>
                                <input
                                  value={d.value}
                                  onChange={handleRadioChange}
                                  defaultChecked={selectedValue === d.value}
                                  name={data?.inputName}
                                  className="mx-2"
                                  type="radio"
                                />
                                <label for={d.value}>{d.label}</label>
                              </div>
                            );
                          })
                        : ''}

                      {data?.inputType === 'checkbox' &&
                      data?.inputAddOn?.inputRadio
                        ? data?.inputAddOn?.inputRadio.map((d) => {
                            return (
                              <div>
                                <input
                                  value={d.value}
                                  onChange={handleCheckBoxChange}
                                  defaultChecked={
                                    selectedCheckBoxValue === d.value
                                  }
                                  required={
                                    data?.inputMandatory &&
                                    selectedCheckBoxValue === d.value
                                  }
                                  name={data.inputName}
                                  className="mx-2"
                                  type="checkbox"
                                />
                                <label for={d.value}> {d.label}</label>
                              </div>
                            );
                          })
                        : ''}

                      {data?.inputType === 'number' && (
                        <input
                          type={data?.inputType}
                          id={
                            data?.inputName
                              ? data?.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          name={data.inputName}
                          defaultValue={data.inputDefaultValue}
                          required={data.inputMandatory === true ? true : false}
                          onChange={dynamicChangeHandle}
                          min={data?.inputAddOn?.inputRangeMin}
                          max={data?.inputAddOn?.inputRangeMax}
                          className="form-control form-control-sm"
                        />
                      )}
                      {data.inputType === 'decimal' && (
                        <input
                          type="number"
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          defaultValue={data?.inputDefaultValue}
                          required={
                            data?.inputMandatory === true ? true : false
                          }
                          name={data?.inputName}
                          onChange={dynamicChangeHandle}
                          minLength={parseInt(data?.inputAddOn?.inputRangeMin)}
                          maxLength={parseInt(data?.inputAddOn?.inputRangeMax)}
                          className="form-control form-control-sm"
                        />
                      )}

                      {data?.inputType === 'select' && (
                        <select
                          id={
                            data?.inputName
                              ? data?.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          name={data.inputName}
                          className="form-control form-control-sm"
                        >
                          <option> {data?.inputDefaultValue}</option>
                          {data?.inputAddOn?.inputRadio &&
                            data?.inputAddOn?.inputRadio.map((option) => {
                              return (
                                <option
                                  selected={
                                    parseInt(
                                      data && data?.inputAddOn?.inputDataSource
                                    ) === option.value
                                  }
                                  value={option.value}
                                >
                                  {option.label}
                                </option>
                              );
                            })}
                        </select>
                      )}

                      {data.inputType === 'select-master' && (
                        <select
                          id={
                            data.inputName
                              ? data.inputName.replace(/ /g, '_').toLowerCase()
                              : ''
                          }
                          defaultValue={data?.inputAddOn?.inputDataSource}
                          name={data.inputName}
                          className="form-control form-control-sm"
                        >
                          <option> {data?.inputName}</option>
                          {data?.inputAddOn?.inputDataSourceData &&
                            data?.inputAddOn?.inputDataSourceData.map(
                              (option) => {
                                return (
                                  <option
                                    selected={
                                      parseInt(
                                        data &&
                                          data?.inputAddOn?.inputDataSourceData
                                      ) === option.value
                                    }
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                );
                              }
                            )}
                        </select>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {data.ticket_uploading === 'REGULAR' && (
          <span>
            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-12 mt-3">
                    <label className=" col-form-label">
                      <b>
                        Description : <Astrick color="red" size="13px" />
                      </b>
                    </label>
                    <textarea
                      className="form-control form-control-sm"
                      id="description"
                      name="description"
                      required
                      rows="4"
                    />
                  </div>
                </div>
              </div>{' '}
              {/* CARD */}
            </div>

            <div className="card mt-2">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-sm-12 mt-3">
                    <label className=" col-form-label">
                      <b>Upload Attachment :</b>
                    </label>
                    <input
                      type="file"
                      className="form-control form-control-sm"
                      id="attachment"
                      name="attachment[]"
                      multiple
                      required={
                        data.ticket_uploading === 'REGULAR' ? false : true
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>
        )}

        {data.ticket_uploading === 'BULK_UPLOADING' && isFileGenerated && (
          <div className="card mt-2">
            <div className="card-body">
              <div className="form-group row mt-3">
                <div className="col-sm-12">
                  <h5 className="text-danger">
                    <b>Important Note:</b>
                  </h5>
                  <ul>
                    <li>Do not make any changes in first row</li>
                    <li>Do not change query type after export in file</li>
                  </ul>
                </div>
              </div>

              <div className="row">
                <label className="col-form-label">
                  <b>
                    Upload Generated File <Astrick color="red" /> :
                  </b>
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="bulk_upload_file"
                  name="bulk_upload_file"
                  onChange={(e) => {
                    uploadAttachmentHandler(e, 'UPLOAD', '');
                  }}
                  required
                />
              </div>

              <div className="row">
                <label className="col-form-label">
                  <b>Upload Attachment :{/* <Astrick color="red" /> : */}</b>
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  id="bulk_images[]"
                  name="bulk_images[]"
                  multiple
                  // required
                  onChange={(e) => {
                    uploadAttachmentHandler(e, 'UPLOAD', '');
                  }}
                />
              </div>
            </div>
          </div>
        )}
        <div className="mt-3" style={{ textAlign: 'right' }}>
          {data.ticket_uploading === 'REGULAR' && (
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isSubmitted}
            >
              Submit
            </button>
          )}

          {data.ticket_uploading === 'BULK_UPLOADING' && (
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isFileGenerated ? false : true}
            >
              Submit
            </button>
          )}
          <Link
            to={`/${_base}/Ticket`}
            className="btn btn-danger btn-sm text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>
    </div>
  );
}
