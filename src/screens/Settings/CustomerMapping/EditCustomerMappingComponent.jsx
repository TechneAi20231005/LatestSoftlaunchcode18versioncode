import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CustomerMappingService from '../../../services/SettingService/CustomerMappingService';
import { _base, userSessionData } from '../../../settings/constants';

import ErrorLogService from '../../../services/ErrorLogService';
import { toast } from 'react-toastify';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';

import DepartmentService from '../../../services/MastersService/DepartmentService';
import CustomerTypeService from '../../../services/MastersService/CustomerTypeService';
import QueryTypeService from '../../../services/MastersService/QueryTypeService';
import TemplateService from '../../../services/MastersService/TemplateService';
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import UserService from '../../../services/MastersService/UserService';

import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../components/custom/CustomValidation/CustomValidation';

export function getDateTime() {
  var now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  month = month >= 10 ? month : `0${month}`;
  let day = now.getDate() >= 10 ? now.getDate() : `0${now.getDate()}`;
  let hour = now.getHours() >= 10 ? now.getHours() : `0${now.getHours()}`;
  let min = now.getMinutes() >= 10 ? now.getMinutes() : `0${now.getMinutes()}`;
  let sec = now.getSeconds() >= 10 ? now.getSeconds() : `0${now.getSeconds()}`;
  var datetime =
    year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
  return datetime;
}

export default function EditCustomerMappingComponentBackup({ match }) {
  const history = useNavigate();
  const dispatch = useDispatch();
  const customerDetail = useRef();
  const queryTypeDetail = useRef();
  const dynamicDetail = useRef();
  const templateDetail = useRef();
  const priorityDetail = useRef();

  const approachDetail = useRef();
  const statusDtail = useRef();
  const userNameDetail = useRef();
  const userRatioDetail = useRef();

  const departmentDropdownRef = useRef();

  const useridDetail = useRef(null);

  const { id } = useParams();
  const mappingId = id;
  const [notify, setNotify] = useState();

  const [customerTypeDropdown, setCustomerTypeDropdown] = useState();

  const [queryType, setQueryType] = useState();
  const [queryTypeDropdown, setQueryTypeDropdown] = useState();

  const [dynamicForm, setDynamicForm] = useState();
  const [dynamicFormDropdown, setDynamicFormDropdown] = useState();
  const [selectedDynamicForm, setSelectedDynamicForm] = useState();
  const [selectedCustomer, setSelectedCustomer] = useState(0);

  const [templateDropdown, setTemplateDropdown] = useState();

  const [departmentDropdown, setDepartmentDropdown] = useState();

  const [userDropdown, setUserDropdown] = useState([]);

  const [ratiowiseData, setRatiowiseData] = useState([]);

  const [ratioTotal, setRatioTotal] = useState(0);

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id === 32)
  );

  const [data, setData] = useState({
    approach: [],
    confirmation_required: null,
    created_at: null,
    created_by: null,
    customer_id: null,
    customer_type_id: 123,
    department_id: null,
    dynamic_form_id: null,
    id: null,
    is_active: null,
    is_default: null,
    module_id: null,
    priority: [],
    project_id: null,
    query_type_id: null,
    remark: null,
    sla: null,
    sub_module_id: null,
    template_id: null,
    tenant_id: null,
    updated_at: null,
    updated_by: null,
    user_policy: [],
    user_policy_label: []
  });

  const [userData, setUserData] = useState([]);

  const [confirmationRequired, setConfirmationRequired] = useState(null);

  const [statusData, setstatusData] = useState('');
  const [ratioData, setRatioData] = useState([]);

  const handleConfirmationChange = (e) => {
    setConfirmationRequired(Number(e?.target?.value));
  };

  const handleStatusChange = (e) => {
    setstatusData(e?.target?.value);
  };

  const fields = [
    {
      name: 'query_type_id',
      label: 'Query Type',
      required: true
    },
    {
      name: 'dynamic_form_id',
      label: 'Dynamic Form'
    },
    {
      name: 'priority',
      label: 'Priority',
      required: true
    },
    {
      name: 'confirmation_required',
      label: 'Confirmation Required',
      required: true
    },
    {
      name: 'approach',
      label: 'approach',
      required: true
    },
    {
      name: 'department_id',
      label: 'department_id',
      required: true
    }
  ];

  const validationSchema = CustomValidation(fields);
  console.log('dataA', data);
  const valueof = data
    ? queryTypeDropdown?.find((d) => data.query_type_id === d.value)
    : '';
  const initialValues = {
    customer_type_id: data.customer_type_id ? data.customer_type_id : [],
    query_type_id:
      queryTypeDropdown?.filter((d) => data.query_type_id === d.value) || '',
    dynamic_form_id: data.dynamic_form_id ? data.dynamic_form_id : '',
    template_id: data.template_id ? data.template_id : '',
    priority: data?.priority ? data.priority : '',
    confirmation_required: '1',
    approach: '',
    department_id: '',
    user_id: [],
    is_active: data?.is_active !== undefined ? String(data?.is_active) : '1',
    confirmation_required:
      data.confirmation_required !== undefined
        ? String(data?.confirmation_required)
        : '1'
  };

  const loadData = useCallback(async () => {
    var tempData = '';
    await new CustomerMappingService()
      .getCustomerMappingById(mappingId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            tempData = res.data.data;
            console.log('temp', tempData);
            setRatioData(
              tempData?.user_policy2?.map((d) => ({
                user_id: d.user_id,
                ratio: d.ratio
              }))
            );
            setData({
              approach: tempData.approach,
              confirmation_required: tempData.confirmation_required,
              created_at: tempData.created_at,
              created_by: tempData.created_by,
              customer_id: tempData.customer_id,
              customer_type_id: tempData.customer_type_id,
              department_id: tempData.department_id,
              dynamic_form_id: tempData.dynamic_form_id,
              id: tempData.id,
              is_active: tempData.is_active,
              is_default: tempData.is_default,
              module_id: tempData.module_id,
              priority: tempData.priority,
              project_id: tempData.project_id,
              query_type_id: tempData.query_type_id,
              remark: tempData.remark,
              sla: tempData.sla,
              sub_module_id: tempData.sub_module_id,
              template_id: tempData.template_id,
              tenant_id: tempData.tenant_id,
              updated_at: tempData.updated_at,
              updated_by: tempData.updated_by,
              user_policy: tempData.user_policy,
              user_policy2: tempData.user_policy2,

              user_policy_label: tempData.user_policy_label
            });
            setConfirmationRequired(res?.data?.data?.confirmation_required);

            setstatusData(res?.data?.data?.is_active === 1 ? 1 : 0);
          }
        }
      });
    dispatch(getRoles());

    await new CustomerTypeService().getCustomerType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const select = res.data.data.data
            .filter((d) => d.is_active)
            .map((d) => ({ value: d.id, label: d.type_name }));

          setCustomerTypeDropdown(select);
        }
      }
    });

    await new CustomerMappingService().getPriorityDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
        }
      }
    });

    await new QueryTypeService().getQueryType().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const data = res.data.data.filter((d) => d.is_active === 1);

          setQueryType(data);
          setQueryTypeDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.query_type_name }))
          );
        }
      }
    });

    await getDynamicForm();

    await new TemplateService().getTemplate().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const select = res.data.data.map((d) => ({
            value: d.id,
            label: d.template_name
          }));

          setTemplateDropdown(select);
        }
      }
    });
    await getDepartment();

    setUserDropdown(null);

    if (tempData.approach === 'RW' && tempData.user_policy) {
      tempData?.user_policy?.forEach((d, i) => {
        var x = d.split(':');
        if (x.length > 1) {
          ratiowiseData[i] = parseInt(x[1]);
        }
      });
      var sum = ratiowiseData?.reduce((result, number) => result + number, 0);
      setRatioTotal(sum);
    }
    await new UserService().getUserWithMultipleDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          var defaultValue = [{ value: '', label: 'Select User' }];

          const dropdown = res.data.data
            .filter((d) => d.is_active === 1)
            .filter((d) =>
              d.multiple_department_id.includes(tempData.department_id)
            )
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
            }));

          if (tempData.approach === 'RW') {
            defaultValue = dropdown;
          } else {
            defaultValue = [...defaultValue, ...dropdown];
          }
          setUserDropdown(defaultValue);
        }
      }
    });
  }, [dispatch, mappingId, ratiowiseData]);

  const getDynamicForm = async () => {
    await new DynamicFormService().getDynamicForm().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const data = res.data.data.data.filter((d) => d.is_active === 1);
          const select = res.data.data.data.map((d) => ({
            value: d.id,
            label: d.template_name
          }));
          setDynamicForm(data);
          setDynamicFormDropdown(select);
        }
      }
    });
  };

  const handleQueryType = async (e) => {
    if (!e || Object.entries(e).length === 0) return;
    setNotify(null);
    setDynamicForm(null);
    setDynamicFormDropdown(null);
    setSelectedDynamicForm(null);
    await getDynamicForm();

    const queryTypeTemp = queryType.filter((d) => d.id === e.value);

    const dynamicFormDropdownTemp = dynamicForm
      .filter((d) => d.id === queryTypeTemp[0].form_id)
      .map((d) => ({ value: d.id, label: d.template_name }));

    if (dynamicFormDropdownTemp.length > 0) {
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev['dynamic_form_id'] = queryTypeTemp[0].form_id;
        return newPrev;
      });
      setSelectedDynamicForm(dynamicFormDropdownTemp);
    } else {
      setNotify({
        type: 'warning',
        message: 'No Form is mapped but still you can map new form'
      });
    }
  };

  const getDepartment = async () => {
    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          var defaultValue = [{ value: 0, label: 'Select Department' }];
          var dropwdown = res.data.data.data
            .filter((d) => d.is_active === 1)
            .map((d) => ({ value: d.id, label: d.department }));
          defaultValue = [...defaultValue, ...dropwdown];
          setDepartmentDropdown(defaultValue);
        }
      }
    });
  };

  //MAIN METHOD TO HANDLE CHANGES IN STATE DATA
  const handleAutoChanges = async (e, type, nameField) => {
    if (!e || Object.entries(e).length === 0) return;
    if (type === 'Select2' && nameField === 'customer_type_id') {
      setSelectedCustomer(e?.length);
    }
    const value =
      type === 'Select2' && nameField === 'customer_type_id'
        ? e?.map((i) => i.value)
        : e?.value
        ? e?.value
        : e?.target?.value;

    if (nameField === 'approach' && value !== data.approach) {
      setRatiowiseData([]);
      setDepartmentDropdown(null);
      setUserDropdown(null);
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev['department_id'] = null;
        newPrev['user_policy'] = null;
        newPrev['user_policy_label'] = null;

        return newPrev;
      });
      handleGetDepartmentUsers(e);
      await getDepartment();
    }

    if (nameField === 'department_id' && data.department_id !== value) {
      setUserDropdown(null);

      setData((prev) => {
        const newPrev = { ...prev };
        newPrev['user_policy'] = null;
        newPrev['user_policy_label'] = null;
        newPrev['user_id'] = [];
        return newPrev;
      });
    }
    setData((prev) => {
      const newPrev = { ...prev };
      newPrev[nameField] = value;
      return newPrev;
    });
  };

  const handleGetDepartmentUsers = async (e, additional_id = null) => {
    setUserDropdown(null);

    try {
      const res = await new UserService().getUserWithMultipleDepartment(
        e.value
      );

      if (res.status === 200) {
        if (res?.data?.status === 1) {
          const dropdown = res.data.data
            .filter((d) => {
              if (additional_id) {
                return (
                  d.is_active === 1 &&
                  d.multiple_department_id.includes(additional_id)
                );
              } else
                return (
                  d.is_active === 1 &&
                  d.multiple_department_id.includes(e.value)
                );
            })

            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
            }));

          let defaultValue;
          if (data.approach === 'RW') {
            defaultValue = dropdown;
            setRatioTotal(0);
            setUserData(
              dropdown.length > 0
                ? dropdown.map((d) => ({ user_id: d.id, ratio: 0 }))
                : []
            );
          } else {
            defaultValue = [...dropdown];
          }

          setUserDropdown(defaultValue.filter((option) => option.value !== ''));
          if (dropdown.length === 0) {
            setUserDropdown([]);
          }
        } else {
          toast.error('No users found for this department.');
        }
      }
    } catch (res) {
      toast.error(res?.data?.message);
    }
  };

  const handleRatioInput = (index) => async (e) => {
    e.preventDefault();
    const value = parseInt(e?.target?.value) || 0;

    if (value > 100) {
      e.target.value = 0;
      ratiowiseData[index] = 0;
      toast.error('Cannot Enter More than 100 !!!');
    } else {
      ratiowiseData[index] = value;
      const sum = ratiowiseData?.reduce((result, number) => result + number, 0);

      if (sum > 100) {
        e.target.value = 0;
        ratiowiseData[index] = 0;
        toast.error('Ratio Total Must Be 100 !!!');
      } else {
        const newData = ratiowiseData?.map((ratio, idx) => ({
          user_id: userDropdown[idx]?.value || null,
          ratio: ratio
        }));

        setUserData(newData);
        setRatioTotal(sum);
      }
    }
  };

  const handleForm = async (values) => {
    // e.preventDefault();
    // let userIDs;
    // if (Array.isArray(useridDetail?.current?.props?.value)) {
    //   userIDs = useridDetail?.current?.props?.value.map((item) => item.value);
    // } else {
    //   const value = useridDetail?.current?.props?.value?.value;
    //   userIDs = value ? [value] : [];
    // }

    // const getUserData = () => {
    //   // Get an array of user IDs
    //   const userIds = userDropdown?.map((ele) => ele?.value);
    //   return userIds;
    // };

    // const RwuserID = getUserData();

    // const customerID = customerDetail?.current?.props?.value;
    // const queryTypeid = queryTypeDetail?.current?.props?.value[0]?.value
    //   ? queryTypeDetail?.current?.props?.value[0]?.value
    //   : queryTypeDetail?.current?.props?.value?.value;
    // const dynamicFormid = dynamicDetail?.current?.props?.value[0]?.value
    //   ? dynamicDetail?.current?.props?.value[0]?.value
    //   : dynamicDetail?.current?.props?.value?.value;
    // const templateid = templateDetail?.current?.props?.value[0]?.value
    //   ? templateDetail?.current?.props?.value[0]?.value
    //   : templateDetail?.current?.props?.value?.value;
    // const priorityID = priorityDetail?.current?.value;
    // const confirmationId = confirmationRequired;
    // const approachId = approachDetail?.current?.value;

    // const departmentId = departmentDropdownRef?.current?.props?.value[0]?.value
    //   ? departmentDropdownRef?.current?.props?.value[0]?.value
    //   : departmentDropdownRef?.current?.props?.value?.value;
    // const userID = userIDs;

    // const statusID = statusData;

    // let arrayOfId = [];
    // for (let i = 0; i < customerID?.length; i++) {
    //   arrayOfId.push(customerID[i]?.value);
    // }
    // const form = {};
    // form.customer_type_id = arrayOfId;
    // form.query_type_id = queryTypeid;
    // form.dynamic_form_id = dynamicFormid;
    // form.template_id = templateid ? templateid : null;
    // form.priority = priorityID;
    // form.confirmation_required = confirmationId;
    // form.approach = approachId;
    // form.department_id = departmentId;
    // if (data.approach === 'RW') {
    //   form.user_id = RwuserID;
    //   // form.ratio = ratiosToSend;
    //   form.userData = userData?.length > 0 ? userData : ratioData;
    // } else {
    //   form.user_id = userID;
    // }

    // form.status = statusID;

    // form.tenant_id = localStorage.getItem('tenant_id');
    // form.updated_by = userSessionData.userId;
    // form.updated_at = getDateTime();
    let userIDs;
    if (Array.isArray(useridDetail?.current?.props?.value)) {
      userIDs = useridDetail?.current?.props?.value?.map((item) => item.value);
    } else {
      const value = useridDetail?.current?.props?.value?.value;
      userIDs = value ? [value] : [];
    }

    const getUserData = () => {
      const userIds = userDropdown?.map((ele) => ele?.value);

      return userIds;
    };

    const RwuserID = getUserData();

    if (values.approach === 'RW') {
      values.user_id = RwuserID;
      values.userData = userData;
    } else {
      values.user_id = values.user_id;
    }

    values.tenant_id = localStorage.getItem('tenant_id');
    values.created_by = userSessionData.userId;
    values.created_at = getDateTime();
    values.query_type_id = values.query_type_id;
    let flag = 1;
    if (values?.approach === 'RW') {
      if (!ratioTotal || ratioTotal !== 100) {
        alert('Sum Must Be 100');
        flag = 0;
      }
    }

    if (flag === 1) {
      await new CustomerMappingService()
        .updateCustomerMapping(mappingId, values)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/CustomerMapping`
                },
                {
                  state: {
                    alert: { type: 'success', message: res.data.message }
                  }
                }
              );
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          } else {
            setNotify({ type: 'danger', message: res.message });
            new ErrorLogService().sendErrorLog(
              'Customer',
              'Create_Customer',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_update === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  useEffect(() => {
    const initialData = userDropdown?.map((ele) => {
      const userPolicy = Array.isArray(data?.user_policy)
        ? data.user_policy.find((policy) =>
            policy?.user_name?.startsWith(`${ele.value}:`)
          )
        : null;

      return userPolicy ? parseInt(userPolicy.user_name.split(':')[1]) : 0;
    });

    setRatiowiseData(initialData);
  }, [userDropdown, data.user_policy]);
  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Edit Customer Mapping" />
      {notify && <Alert alertData={notify} />}
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            <div className="card-body">
              {/* {data && (
                <form
                  onSubmit={handleForm}
                  method="post"
                  encType="multipart/form-data"
                >
                  <div className="form-group row mt-3">
                    <label className="col-sm-2 col-form-label">
                      <b>Select Customer Type :</b>
                    </label>
                    <div className="col-sm-4">
                      {customerTypeDropdown && data && (
                        <Select
                          id="customer_type_id[]"
                          name="customer_type_id[]"
                          ref={customerDetail}
                          options={customerTypeDropdown}
                          isMulti
                          defaultValue={
                            data &&
                            customerTypeDropdown?.filter((d) =>
                              data.customer_type_id?.includes(d.value)
                            )
                          }
                          onChange={(e) =>
                            handleAutoChanges(e, 'Select2', 'customer_type_id')
                          }
                        />
                      )}
                    </div>
                  </div> */}
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  handleForm(values, data);
                }}
              >
                {({
                  setFieldValue,
                  values,
                  field,
                  form,
                  handleChange,
                  handleBlur,
                  touched,
                  errors
                }) => (
                  <Form>
                    {console.log('values2', values)}
                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Select Customer Type :</b>
                      </label>

                      <div className="col-sm-4">
                        <Field name="customer_type_id">
                          {({ field, form }) => (
                            <Select
                              id="customer_type_id"
                              name="customer_type_id"
                              options={customerTypeDropdown}
                              isMulti
                              value={
                                data &&
                                customerTypeDropdown?.filter((d) =>
                                  data.customer_type_id?.includes(d.value)
                                )
                              }
                              onChange={(selectedOptions) => {
                                const values = selectedOptions
                                  ? selectedOptions.map(
                                      (option) => option.value
                                    )
                                  : [];

                                form.setFieldValue('customer_type_id', values);

                                handleAutoChanges(
                                  selectedOptions,
                                  'Select2',
                                  'customer_type_id'
                                );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="customer_type_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Select Query Type :<Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        {/* <Select
                          options={queryTypeDropdown}
                          id="query_type_id"
                          name="query_type_id"
                          isClearable={true}
                          onChange={(selectedOption) => {
                            setFieldValue(
                              'query_type_id',
                              selectedOption?.value
                            );
                            handleQueryType(selectedOption);
                          }}
                          defaultValue={
                            data
                              ? queryTypeDropdown?.find(
                                  (d) => data.query_type_id === d.value
                                )
                              : ''
                          }
                          // value={values.country_id}
                        /> */}
                        <Select
                          options={queryTypeDropdown}
                          id="query_type_id"
                          name="query_type_id"
                          isClearable={true}
                          onChange={(selectedOption) => {
                            setFieldValue(
                              'query_type_id',
                              selectedOption?.value || ''
                            );
                          }}
                          value={
                            queryTypeDropdown?.find(
                              (d) => d.value === data.query_type_id
                            ) || null
                          } // Ensure proper sync with Formik's values
                        />
                        <ErrorMessage
                          name="query_type_id"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Select Form :</b>
                      </label>
                      <div className="col-sm-4">
                        {!selectedDynamicForm && dynamicFormDropdown && (
                          <Field name="dynamic_form_id">
                            {({ field, form }) => (
                              <Select
                                id="dynamic_form_id"
                                name="dynamic_form_id"
                                options={dynamicFormDropdown}
                                isClearable
                                defaultValue={dynamicFormDropdown?.filter(
                                  (d) => data.dynamic_form_id === d.value
                                )}
                                onChange={(selectedOption) => {
                                  const value = selectedOption
                                    ? selectedOption.value
                                    : '';
                                  form.setFieldValue('dynamic_form_id', value);
                                  handleAutoChanges(
                                    selectedOption,
                                    'Select2',
                                    'dynamic_form_id'
                                  );
                                }}
                              />
                            )}
                          </Field>
                        )}
                        {selectedDynamicForm && dynamicFormDropdown && 'H' && (
                          <Field name="dynamic_form_id">
                            {({ field, form }) => (
                              <Select
                                id="dynamic_form_id"
                                name="dynamic_form_id"
                                options={dynamicFormDropdown}
                                isClearable
                                value={
                                  dynamicFormDropdown?.find(
                                    (option) => option.value === field.value
                                  ) || null
                                }
                                onChange={(selectedOption) => {
                                  const value = selectedOption
                                    ? selectedOption.value
                                    : '';
                                  form.setFieldValue('dynamic_form_id', value);
                                  handleAutoChanges(
                                    selectedOption,
                                    'Select2',
                                    'dynamic_form_id'
                                  );
                                }}
                              />
                            )}
                          </Field>
                        )}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Select Template :</b>
                      </label>
                      <div className="col-sm-4">
                        <Field name="template_id">
                          {({ field, form }) => (
                            <Select
                              id="template_id"
                              name="template_id"
                              options={[
                                // { label: 'Select Template', value: '' },
                                // ...templateDropdown
                                templateDropdown
                              ]}
                              isClearable
                              onChange={(selectedOption) => {
                                const value = selectedOption
                                  ? selectedOption.value
                                  : '';
                                form.setFieldValue('template_id', value);
                                handleAutoChanges(
                                  selectedOption,
                                  'Select2',
                                  'template_id'
                                );
                              }}
                              value={
                                templateDropdown?.find(
                                  (option) => option.value === field.value
                                ) || null
                              }
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="template_id"
                          component="small"
                          className="text-danger"
                        />{' '}
                        {(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : '';
                          form.setFieldValue('template_id', value);
                          handleAutoChanges(
                            selectedOption,
                            'Select2',
                            'template_id'
                          );
                        }}
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Priority :<Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field name="priority">
                          {({ field, form }) => {
                            const options = [
                              { value: '', label: 'Select Priority' },
                              { value: 'Low', label: 'Low' },
                              { value: 'Medium', label: 'Medium' },
                              { value: 'High', label: 'High' },
                              { value: 'Very High', label: 'Very High' }
                            ];

                            return (
                              <Select
                                id="priority"
                                name="priority"
                                options={options}
                                value={options.filter(
                                  (d) => data?.priority === d.value
                                )}
                                isClearable={true}
                                onChange={(selectedOption) => {
                                  const value = selectedOption
                                    ? selectedOption.value
                                    : '';
                                  form.setFieldValue('priority', value);
                                  handleAutoChanges(
                                    selectedOption,
                                    'Select2',
                                    'priority'
                                  );
                                }}
                              />
                            );
                          }}
                        </Field>

                        <ErrorMessage
                          name="priority"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>
                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>Status :</b>
                      </label>
                      <div className="col-sm-4">
                        <div className="col-sm-12">
                          <div className="row">
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_1"
                                  value="1"
                                  defaultChecked={
                                    data?.is_active === 1
                                      ? true
                                      : !data
                                      ? true
                                      : false
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="is_active_1"
                                >
                                  Active
                                </label>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="form-check">
                                <Field
                                  className="form-check-input"
                                  type="radio"
                                  name="is_active"
                                  id="is_active_0"
                                  value="0"
                                  defaultChecked={
                                    data?.is_active === 0
                                      ? true
                                      : !data
                                      ? true
                                      : false
                                  }
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
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div className="col-sm-2">
                        <label className="col-form-label">
                          <b>
                            Confirmation Required :{' '}
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                      </div>

                      <div className="col-sm-1">
                        <div className="form-group mt-2 text-left d-flex justify-content-between">
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="confirmation_required"
                              id="confirmation_required_yes"
                              className="form-check-input"
                              value="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.confirmation_required === '1'}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="confirmation_required_yes"
                            >
                              Yes
                            </label>
                          </div>

                          <div className="form-check mx-2">
                            <Field
                              type="radio"
                              name="confirmation_required"
                              id="confirmation_required_no"
                              className="form-check-input"
                              value="0"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              checked={values.confirmation_required === '0'}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="confirmation_required_no"
                            >
                              No
                            </label>
                          </div>
                          {touched.confirmation_required &&
                            errors.confirmation_required && (
                              <small className="text-danger">
                                {errors.confirmation_required}
                              </small>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group row mt-3">
                      <label className="col-sm-2 col-form-label">
                        <b>
                          Approach :<Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <div className="col-sm-4">
                        <Field name="approach">
                          {({ field, form }) => (
                            <Select
                              id="approach"
                              name="approach"
                              isClearable
                              options={[
                                { value: '', label: 'Select Approach' },
                                {
                                  value: 'RR',
                                  label: 'Departmentwise Round Robin'
                                },
                                {
                                  value: 'HLT',
                                  label: 'User Having Less Ticket'
                                },
                                { value: 'SP', label: 'Single Person' },
                                { value: 'RW', label: 'Ratio Wise' },
                                ...(selectedCustomer === 0
                                  ? [{ value: 'SELF', label: 'Self' }]
                                  : []),
                                { value: 'AU', label: 'Assign to user' }
                              ]}
                              value={
                                field.value
                                  ? { value: field.value, label: field.value }
                                  : { value: '', label: 'Select approach' }
                              }
                              onChange={(option) => {
                                form.setFieldValue(
                                  'approach',
                                  option ? option.value : ''
                                );
                                handleAutoChanges(
                                  option,
                                  'Select2',
                                  'approach'
                                );
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="approach"
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>

                    {data.approach !== 'SELF' && data.approach !== 'AU' && (
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Select Department :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          {departmentDropdown && (
                            <Field name="department_id">
                              {({ field, form }) => (
                                <Select
                                  id="department_id"
                                  name="department_id"
                                  options={departmentDropdown}
                                  isClearable
                                  value={
                                    departmentDropdown?.find(
                                      (option) => option.value === field.value
                                    ) || null
                                  }
                                  onChange={(selectedOption) => {
                                    const values = selectedOption
                                      ? selectedOption.value
                                      : null;
                                    form.setFieldValue('department_id', values);
                                    handleAutoChanges(
                                      selectedOption,
                                      'Select2',
                                      'department_id'
                                    );
                                    handleGetDepartmentUsers(selectedOption);
                                    // setShowUserSelect(true);
                                  }}
                                />
                              )}
                            </Field>
                          )}
                          {departmentDropdown && (
                            <ErrorMessage
                              name="department_id"
                              component="small"
                              className="text-danger"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {data.approach !== 'SELF' &&
                      data.approach !== 'AU' &&
                      userDropdown?.length > 0 && (
                        <div className="form-group row mt-3">
                          <label className="col-sm-2 col-form-label">
                            <b>
                              Select User :<Astrick color="red" size="13px" />
                            </b>
                          </label>

                          <>
                            {userDropdown && data.approach !== 'RW' && (
                              <div className="col-sm-4">
                                <Field name="user_id">
                                  {({ field, form }) => (
                                    <Select
                                      id="user_id"
                                      name="user_id"
                                      options={userDropdown}
                                      isMulti
                                      value={userDropdown?.filter((option) =>
                                        field.value?.includes(option.value)
                                      )}
                                      onChange={(selectedOptions) => {
                                        const values = selectedOptions
                                          ? selectedOptions.map(
                                              (option) => option.value
                                            )
                                          : [];

                                        form.setFieldValue('user_id', values);

                                        handleAutoChanges(
                                          selectedOptions,
                                          'Select2',
                                          'user_id'
                                        );
                                      }}
                                    />
                                  )}
                                </Field>

                                <ErrorMessage
                                  name="user_id"
                                  component="small"
                                  className="text-danger"
                                />
                              </div>
                            )}
                          </>

                          {userDropdown && data.approach === 'RW' && (
                            <div className="col-sm-6">
                              <Table bordered className="mt-2" id="table">
                                <thead>
                                  <tr className="text-center">
                                    <th>#</th>
                                    <th>Selected User</th>
                                    <th>Enter Ratio</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userDropdown.map((ele, i) => (
                                    <tr key={ele.value}>
                                      <td>{i + 1}</td>
                                      <td>
                                        <input
                                          type="hidden"
                                          name={`user_id[${i}]`}
                                          value={ele.value}
                                          readOnly
                                        />
                                        <input
                                          type="text"
                                          name={`user_name[${i}]`}
                                          value={ele.label}
                                          readOnly
                                          className="form-control form-control-sm"
                                        />
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control col-sm-2"
                                          name={`ratio[${i}]`}
                                          defaultValue={userData[i]?.ratio || 0}
                                          onChange={handleRatioInput(i)}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td colSpan={2} className="text-right">
                                      <b>TOTAL</b>
                                    </td>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control col-sm-2"
                                        name="ratioTotal"
                                        value={ratioTotal}
                                        readOnly
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          )}
                        </div>
                      )}

                    <div className="mt-3 d-flex justify-content-end">
                      <button type="submit" className="btn btn-primary btn-sm">
                        Update
                      </button>

                      <Link
                        to={`/${_base}/CustomerMapping`}
                        className="btn btn-danger btn-sm text-white"
                      >
                        Cancel
                      </Link>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
