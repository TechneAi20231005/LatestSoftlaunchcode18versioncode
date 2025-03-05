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
import { errorHandler } from '../../../utils';
import LoadingScreen from '../../../components/custom/LoadingScreen';

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

  const useridDetail = useRef(null);
  const [approach, setApproach] = useState('');

  const { id } = useParams();
  const mappingId = id;

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
  const [loading, setLoading] = useState(false);

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
  const [queryTypeId, setQueryTypeId] = useState('');

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
      required: approach !== 'AU' && approach !== 'SELF' ? true : false
    }
  ];

  const validationSchema = CustomValidation(fields);

  const valueof = data
    ? queryTypeDropdown?.find((d) => data.query_type_id === d.value)
    : '';

  const loadData = useCallback(async () => {
    setLoading(true);
    var tempData = '';
    await new CustomerMappingService()
      .getCustomerMappingById(mappingId)
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            tempData = res.data.data;
            setApproach(tempData.approach);
            // setSelectedCustomer(tempData?.customer_type_id?.length || 0)
            setSelectedCustomer(tempData?.customer_type_id?.length || 0);
            setQueryTypeId(tempData.query_type_id);
            setRatioData(
              tempData?.user_policy?.map((d) => ({
                user_id: d.user_id,
                ratio: d.ratio
              })) || []
            );
            setUserData(
              tempData?.user_policy2
                ? tempData?.user_policy2?.map((d) => ({
                    user_id: d.user_id,
                    ratio: d.ratio
                  }))
                : []
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
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
    dispatch(getRoles());

    await new CustomerTypeService()
      .getCustomerType()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            const select = res.data.data.data
              .filter((d) => d.is_active)
              .map((d) => ({ value: d.id, label: d.type_name }));

            setCustomerTypeDropdown(select);
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));

    await new CustomerMappingService()
      .getPriorityDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
          }
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((error) => errorHandler(error));

    await new QueryTypeService()
      .getQueryType()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            const data = res.data.data.data.filter((d) => d.is_active === 1);

            setQueryType(data);
            setQueryTypeDropdown(
              res.data.data.data
                .filter((d) => d.is_active === 1)
                .map((d) => ({ value: d.id, label: d.query_type_name }))
            );
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));
    await getDynamicForm();

    await new TemplateService()
      .getTemplate()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            const select = res.data.data.data.map((d) => ({
              value: d.id,
              label: d.template_name
            }));

            setTemplateDropdown(select);
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));
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
    await new UserService()
      .getUserWithMultipleDepartment()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            var placeholderOption = [{ value: ' ', label: 'Select User' }];

            const dropdown = res.data.data
              .filter((d) => d.is_active === 1)
              .filter((d) =>
                d.multiple_department_id.includes(tempData.department_id)
              )
              .map((d) => ({
                value: d.id,
                label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
              }));

            const finalDropdown =
              tempData.approach === 'RW' ? dropdown : [...dropdown];

            setUserDropdown(finalDropdown);
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));
    setLoading(false);
  }, [dispatch, mappingId, ratiowiseData]);

  const getDynamicForm = async () => {
    await new DynamicFormService()
      .getDynamicForm()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            const data = res.data.data.data.filter((d) => d.is_active === 1);
            const select = res.data.data.data.map((d) => ({
              value: d.id,
              label: d.template_name
            }));
            setDynamicForm(data);
            setDynamicFormDropdown(select);
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));
  };

  const handleQueryType = async (e) => {
    if (!e || Object.entries(e).length === 0) return;
    setDynamicForm(null);
    setDynamicFormDropdown(null);
    setSelectedDynamicForm(null);
    await getDynamicForm();

    const queryTypeTemp = queryType.filter((d) => d.id === e.value);

    const dynamicFormDropdownTemp = dynamicForm
      ?.filter((d) => d.id === queryTypeTemp[0]?.form_id)
      ?.map((d) => ({ value: d.id, label: d.template_name }));

    if (dynamicFormDropdownTemp.length > 0) {
      setData((prev) => {
        const newPrev = { ...prev };
        newPrev['dynamic_form_id'] = queryTypeTemp[0].form_id;
        return newPrev;
      });
      setSelectedDynamicForm(dynamicFormDropdownTemp);
    } else {
      toast.warning('No Form is mapped but still you can map new form');
    }
  };

  const getDepartment = async () => {
    await new DepartmentService()
      .getDepartment()
      .then((res) => {
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            var defaultValue = [{ value: 0, label: 'Select Department' }];
            var dropwdown = res.data.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.department }));
            defaultValue = [...defaultValue, ...dropwdown];
            setDepartmentDropdown(defaultValue);
          } else {
            toast.error(res?.data?.message);
          }
        }
      })
      .catch((error) => errorHandler(error));
  };

  const handleAutoChanges = async (e, type, nameField) => {
    // if (!e || Object.entries(e).length === 0) return;
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

  const handleRatioInput = (index) => (e) => {
    e.preventDefault();
    const value = parseInt(e?.target?.value) || 0;

    if (value > 100) {
      e.target.value = 0;
      ratiowiseData[index] = 0;
      toast.error('Cannot Enter More than 100 !!!');
    } else {
      ratiowiseData[index] = value;

      const sum = ratiowiseData.reduce(
        (result, number) => result + (number || 0),
        0
      );

      if (sum > 100) {
        e.target.value = 0;
        ratiowiseData[index] = 0;
        toast.error('Ratio Total Must Be 100 !!!');
      } else {
        const newData = userDropdown.map((ele, idx) => ({
          user_id: ele?.value || null,
          ratio: ratiowiseData[idx] || 0
        }));

        setUserData(newData);
        setRatioTotal(sum);
      }
    }
  };

  const handleForm = async (values) => {
    if (loading) return;
    setLoading(true);

    let userIds;
    if (Array?.isArray(values?.user_id)) {
      // Check if the first item is an object
      if (
        values?.user_id.length > 0 &&
        typeof values?.user_id[0] === 'object'
      ) {
        userIds = values?.user_id.map((user) => user?.user_id); // Extract user_id from objects
      } else {
        userIds = values?.user_id; // Already an array of IDs
      }
    } else {
      userIds = []; // Default to an empty array if values.user_id is not an array
    }

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
      values.user_id = userIds;
    }
    if (values.approach != 'AU') {
      values.department_id = values?.department_id;
    }
    values.tenant_id = localStorage.getItem('tenant_id');
    values.created_by = userSessionData.userId;
    values.created_at = getDateTime();
    values.query_type_id = queryTypeId;

    // if (!values.department_id) {
    //   delete values.department_id;
    // }
    // if(values?.user_id?.length === 0){
    //   delete values.user_id;
    // }
    let flag = 1;
    if (values?.approach === 'RW') {
      if (!ratioTotal || ratioTotal !== 100) {
        alert('Sum Must Be 100');
        flag = 0;
      }
    }

    if (flag === 1) {
      try {
        const res = await new CustomerMappingService().updateCustomerMapping(
          mappingId,
          values
        );
        if (res.status === 200) {
          if (res?.data?.status === 1) {
            history(
              {
                pathname: `/${_base}/CustomerMapping`
              },
              {
                state: {
                  alert: toast.success(res?.data?.message)
                }
              }
            );
          } else {
            toast.error(res?.data?.message);
          }
        } else {
          toast.error(res.message);
        }
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
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
    if (userDropdown?.length > 0) {
      const initialRatios = userDropdown?.map(
        (_, i) => userData[i]?.ratio || 0
      );
      setRatioTotal(initialRatios?.reduce((sum, ratio) => sum + ratio, 0));
      setRatiowiseData(initialRatios);
    }
  }, [userDropdown, userData]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Edit Customer Mapping" />
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mt-2">
            {data && (
              <Formik
                enableReinitialize
                initialValues={
                  data?.approach !== 'AU'
                    ? {
                        customer_type_id: data.customer_type_id
                          ? data.customer_type_id
                          : [],
                        query_type_id: data.query_type_id
                          ? data.query_type_id
                          : '',
                        dynamic_form_id: data.dynamic_form_id
                          ? data.dynamic_form_id
                          : '',
                        template_id: data.template_id ? data.template_id : '',
                        priority: data?.priority ? data.priority : '',
                        confirmation_required:
                          data?.confirmation_required !== undefined
                            ? String(data?.confirmation_required)
                            : '1',
                        approach: data.approach ? data.approach : '',
                        department_id: data.department_id
                          ? data.department_id
                          : '',
                        user_id: data.user_policy ? data.user_policy : [],
                        is_active:
                          data?.is_active !== undefined
                            ? String(data?.is_active)
                            : '1'
                      }
                    : {
                        customer_type_id: data.customer_type_id
                          ? data.customer_type_id
                          : [],
                        query_type_id: data.query_type_id
                          ? data.query_type_id
                          : '',
                        dynamic_form_id: data.dynamic_form_id
                          ? data.dynamic_form_id
                          : '',
                        template_id: data.template_id ? data.template_id : '',
                        priority: data?.priority ? data.priority : '',
                        confirmation_required:
                          data?.confirmation_required !== undefined
                            ? String(data?.confirmation_required)
                            : '1',
                        approach: data.approach ? data.approach : '',
                        // department_id: data.department_id ? data.department_id : '',
                        // user_id: data.user_policy ? data.user_policy : [],
                        is_active:
                          data?.is_active !== undefined
                            ? String(data?.is_active)
                            : '1'
                      }
                }
                // validationSchema={validationSchema}
                validationSchema={(values) => {
                  // if (data?.approach !== 'AU') {
                  //   fields.push({
                  //     name: 'department_id',
                  //     label: 'Department ID',
                  //     required: true
                  //   });
                  // }

                  // Generate validation schema dynamically
                  return CustomValidation(fields);
                }}
                onSubmit={(values) => {
                  handleForm(values);
                }}
              >
                {({
                  isSubmitting,
                  setFieldValue,
                  values,
                  handleBlur,
                  handleChange,
                  form,
                  touched,
                  errors
                }) => (
                  <Form>
                    <div className="card-body">
                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>Select Customer Type :</b>
                        </label>

                        <div className="col-sm-4">
                          {data && customerTypeDropdown && (
                            <Field name="customer_type_id">
                              {({ field, form }) => (
                                <Select
                                  id="customer_type_id"
                                  name="customer_type_id"
                                  options={customerTypeDropdown}
                                  isMulti
                                  defaultValue={
                                    data?.customer_type_id
                                      ? customerTypeDropdown.filter((d) =>
                                          data.customer_type_id?.includes(
                                            d.value
                                          )
                                        )
                                      : []
                                  }
                                  onChange={(selectedOptions) => {
                                    const values = selectedOptions
                                      ? selectedOptions.map(
                                          (option) => option.value
                                        )
                                      : [];
                                    data?.approach === 'SELF' &&
                                      setTimeout(() => {
                                        form.setFieldValue('approach', null);
                                      }, 0);

                                    form.setFieldValue(
                                      'customer_type_id',
                                      values
                                    );

                                    handleAutoChanges(
                                      selectedOptions,
                                      'Select2',
                                      'customer_type_id'
                                    );
                                  }}
                                />
                              )}
                            </Field>
                          )}
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
                            Select Query Type :
                            <Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          {data?.query_type_id && queryTypeDropdown && (
                            <Field name="query_type_id">
                              {({ field, form }) => (
                                <Select
                                  options={queryTypeDropdown}
                                  id="query_type_id"
                                  name="query_type_id"
                                  isClearable={true}
                                  onChange={(selectedOption) => {
                                    const values = selectedOption
                                      ? selectedOption?.value
                                      : '';
                                    setQueryTypeId(values);
                                    form.setFieldValue('query_type_id', values);
                                    handleQueryType(selectedOption);
                                  }}
                                  defaultValue={
                                    data.query_type_id
                                      ? queryTypeDropdown?.find(
                                          (d) => d.value === data.query_type_id
                                        )
                                      : null
                                  }
                                />
                              )}
                            </Field>
                          )}

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
                                    form.setFieldValue(
                                      'dynamic_form_id',
                                      value
                                    );
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
                          {selectedDynamicForm &&
                            dynamicFormDropdown &&
                            'H' && (
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
                                      form.setFieldValue(
                                        'dynamic_form_id',
                                        value
                                      );
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
                          {templateDropdown && (
                            <Field name="template_id">
                              {({ field, form }) => (
                                <Select
                                  options={templateDropdown}
                                  id="template_id"
                                  name="template_id"
                                  isClearable={true}
                                  onChange={(selectedOption) => {
                                    form.setFieldValue(
                                      'template_id',
                                      selectedOption?.value || ''
                                    );
                                  }}
                                  defaultValue={
                                    data?.template_id
                                      ? templateDropdown?.find(
                                          (d) => d.value === data.template_id
                                        )
                                      : null
                                  }
                                />
                              )}
                            </Field>
                          )}
                          <ErrorMessage
                            name="template_id"
                            component="small"
                            className="text-danger"
                          />{' '}
                        </div>
                      </div>

                      <div className="form-group row mt-3">
                        <label className="col-sm-2 col-form-label">
                          <b>
                            Priority :<Astrick color="red" size="13px" />
                          </b>
                        </label>
                        <div className="col-sm-4">
                          {data?.priority && (
                            <Field name="priority">
                              {({ field, form }) => {
                                const options = [
                                  { value: '', label: 'Select Priority' },
                                  { value: 'Low', label: 'Low' },
                                  { value: 'Medium', label: 'Medium' },
                                  { value: 'High', label: 'High' },
                                  { value: 'Very High', label: 'Very High' }
                                ];
                                const defaultOption = data?.priority
                                  ? options.find(
                                      (d) => d.value === data.priority
                                    )
                                  : null;
                                return (
                                  <Select
                                    key={data.priority}
                                    id="priority"
                                    name="priority"
                                    options={options}
                                    defaultValue={options.filter(
                                      (d) => data?.priority === d.value
                                    )}
                                    isClearable
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
                          )}

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
                            {({ field, form }) => {
                              const options = [
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
                              ];

                              return (
                                <Select
                                  key={data.approach}
                                  id="approach"
                                  name="approach"
                                  options={options}
                                  defaultValue={options.filter(
                                    (d) => data?.approach === d.value || null
                                  )}
                                  value={
                                    values?.approach
                                      ? options.filter(
                                          (item) =>
                                            item.value === values.approach
                                        )
                                      : null
                                  }
                                  isClearable={true}
                                  onChange={(selectedOption) => {
                                    setFieldValue('department_id', '');
                                    setApproach(selectedOption.value);
                                    const value = selectedOption
                                      ? selectedOption?.value
                                      : '';
                                    form.setFieldValue('approach', value);
                                    handleAutoChanges(
                                      selectedOption,
                                      'Select2',
                                      'approach'
                                    );
                                  }}
                                />
                              );
                            }}
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
                                    defaultValue={
                                      departmentDropdown?.find(
                                        (option) => option.value === field.value
                                      ) || null
                                    }
                                    onChange={(selectedOption) => {
                                      const values = selectedOption
                                        ? selectedOption.value
                                        : null;
                                      form.setFieldValue(
                                        'department_id',
                                        values
                                      );
                                      handleAutoChanges(
                                        selectedOption,
                                        'Select2',
                                        'department_id'
                                      );
                                      handleGetDepartmentUsers(selectedOption);
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
                                        defaultValue={
                                          data &&
                                          userDropdown?.filter(
                                            (dropdownOption) =>
                                              data.user_policy?.some(
                                                (policy) =>
                                                  policy.user_id ===
                                                  dropdownOption.value
                                              )
                                          )
                                        }
                                        onChange={(selectedOptions) => {
                                          const values = selectedOptions
                                            ? selectedOptions?.map(
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
                                    {userDropdown?.map((ele, i) => (
                                      <tr key={ele.value}>
                                        <td>{i + 1}</td>
                                        <td>
                                          <input
                                            type="hidden"
                                            name={`user_id[${i}]`}
                                            value={ele?.value}
                                            readOnly
                                          />
                                          <input
                                            type="text"
                                            name={`user_name[${i}]`}
                                            value={ele?.label}
                                            readOnly
                                            className="form-control form-control-sm"
                                          />
                                        </td>
                                        <td>
                                          <input
                                            type="number"
                                            className="form-control col-sm-2"
                                            name={`ratio[${i}]`}
                                            defaultValue={
                                              userData[i]?.ratio || 0
                                            }
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

                      {loading && <LoadingScreen showLoaderModal={loading} />}

                      <div className="mt-3 d-flex justify-content-end">
                        <button
                          disabled={isSubmitting}
                          type="submit"
                          className="btn btn-primary btn-sm"
                        >
                          Update
                        </button>

                        <Link
                          to={`/${_base}/CustomerMapping`}
                          className="btn btn-danger btn-sm text-white"
                        >
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
