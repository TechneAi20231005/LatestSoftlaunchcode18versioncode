import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { errorHandler, RenderIf } from '../../../utils';
import UserService from '../../../services/MastersService/UserService';
import { fetchData } from '../../../utils/fetchData';
import DepartmentService from '../../../services/MastersService/DepartmentService';
import StatusService from '../../../services/MastersService/StatusService';

const MyTicketFilters = ({
  setShowModal,
  allUsersData,
  allDepartmentData,
  allStatusData,
  isLoading,
  setAllDepartmentData,
  setAllStatusData,
  setAllUsersData,
  setIsLoading
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
    { id: 1, name: 'Ticket Id', type: 'input', placeholder: 'Enter Ticket Id' },
    {
      id: 2,
      name: 'Select User',
      type: 'dropdown',
      placeholder: 'Select User',
      options: allUsersData.selectData
    },
    {
      id: 3,
      name: 'Select Department',
      type: 'dropdown',
      placeholder: 'Select Department',
      options: allDepartmentData.selectData
    },
    {
      id: 4,
      name: 'Select Status',
      type: 'dropdown',
      placeholder: 'Select Status',
      options: allStatusData.selectData
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
              <div className="row align-items-center">
                {inputDataList.map((item) => (
                  <div className="col-lg-3 col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">{item.name}:</label>
                      <RenderIf render={item.type === 'input'}>
                        <input
                          type={item.type}
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
                        />
                      </RenderIf>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-end mt-2">
                {myTicketButtons.map((item) => (
                  <button
                    className={`btn btn-${item.btn} text-white`}
                    onClick={() => (item.setState ? item.setState(true) : null)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyTicketFilters;
