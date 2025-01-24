import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { errorHandler, RenderIf } from '../../../utils';
import UserService from '../../../services/MastersService/UserService';
import { fetchData } from '../../../utils/fetchData';
import DepartmentService from '../../../services/MastersService/DepartmentService';
import StatusService from '../../../services/MastersService/StatusService';
import ReportService from '../../../services/ReportService/ReportService';

const MyTicketFilters = ({
  setShowModal,
  allUsersData,
  allDepartmentData,
  allStatusData,
  isLoading,
  setAllDepartmentData,
  setAllStatusData,
  setAllUsersData,
  setIsLoading,
  setActiveTabAndData,
  setIsFormSubmitted,
  setAllTicketsData,
  allTicketsData,
  activeTabAndData,
  setTotalRows,
  handleSubmit
}) => {
  const animatedComponents = makeAnimated();

  const myTicketButtons = [
    {
      id: 1,
      name: 'Apply Filter',
      type: 'button',
      btn: 'primary',
      setState: setShowModal
    },
    { id: 2, name: 'Reset Filter', type: 'button', btn: 'info' },
    { id: 3, name: 'Search', type: 'button', btn: 'warning' }
  ];

  const apiFetchData = [
    {
      id: 1,
      name: 'User',
      service: new UserService().getUserForMyTickets,
      inputRequired:
        'id,employee_id,first_name,last_name,middle_name,is_active',
      isLoading,
      setIsLoading,
      errorHandler,
      filterObj: { isActive: true },
      setState: setAllUsersData
    },
    {
      id: 2,
      name: 'department',
      service: new DepartmentService().getDepartment,
      inputRequired: '',
      isLoading,
      setIsLoading,
      errorHandler,
      filterObj: { isActive: true },
      setState: setAllDepartmentData
    },
    {
      id: 3,
      name: 'status',
      service: new StatusService().getStatus,
      inputRequired: '',
      isLoading,
      setIsLoading,
      errorHandler,
      filterObj: { isActive: true },
      setState: setAllStatusData
    }
  ];

  const fetchDataList = async () => {
    for (let i = 0; i < apiFetchData.length; i++) {
      let item = apiFetchData[i];
      const response = await fetchData(
        item.service,
        item.inputRequired,
        item.isLoading,
        item.setIsLoading,
        item.errorHandler,
        item.filterObj,
        item.name
      );

      item.setState({ ...response });
    }
  };

  const inputDataList = [
    {
      id: 1,
      name: 'Ticket Id',
      type: 'input',
      placeholder: 'Enter Ticket Id',
      key: 'ticket_id'
    },
    {
      id: 2,
      name: 'Select User',
      type: 'dropdown',
      placeholder: 'Select User',
      options: allUsersData.selectData,
      key: 'assign_to_user_id'
    },
    {
      id: 3,
      name: 'Select Department',
      type: 'dropdown',
      placeholder: 'Select Department',
      options: allDepartmentData.selectData,
      key: 'department_id'
    },
    {
      id: 4,
      name: 'Select Status',
      type: 'dropdown',
      placeholder: 'Select Status',
      options: allStatusData.selectData,
      key: 'status_id'
    }
  ];

  useEffect(() => {
    fetchDataList();
  }, []);

  return (
    <>
      <div className="row align-items-center">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <Formik
                initialValues={{
                  ticket_id: '',
                  assign_to_user_id: [],
                  department_id: [],
                  status_id: []
                }}
                onSubmit={(values) => handleSubmit(values)}
                enableReinitialize={true}
              >
                {({ values, setFieldValue, resetForm }) => (
                  <Form>
                    <div className="row align-items-center">
                      {inputDataList.map((item) => (
                        <div className="col-lg-3 col-md-6" key={item.id}>
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              {item.name}:
                            </label>
                            <RenderIf render={item.type === 'input'}>
                              <Field
                                type="text"
                                name={item.key}
                                className="form-control"
                                placeholder={item.placeholder}
                              />
                            </RenderIf>
                            <RenderIf render={item.type === 'dropdown'}>
                              <Select
                                options={item.options}
                                components={animatedComponents}
                                isMulti
                                placeholder={item.placeholder}
                                value={item?.options?.filter((option) =>
                                  values[item.key]?.includes(option.value)
                                )}
                                onChange={(selectedOptions) => {
                                  const values = selectedOptions
                                    ? selectedOptions.map(
                                        (option) => option.value
                                      )
                                    : [];
                                  setFieldValue(item.key, values);
                                }}
                              />
                            </RenderIf>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-end mt-2">
                      {myTicketButtons.map((item) => (
                        <button
                          type={item.name === 'Search' ? 'submit' : 'button'}
                          className={`btn btn-${item.btn} text-white`}
                          onClick={() => {
                            if (item?.name === 'Reset Filter') {
                              setIsFormSubmitted(false)
                              setActiveTabAndData('AssignToMe')
                              resetForm();
                            }
                            if (item.name !== 'Search' && item.setState) {
                              item.setState(true);
                            }
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTicketFilters;
