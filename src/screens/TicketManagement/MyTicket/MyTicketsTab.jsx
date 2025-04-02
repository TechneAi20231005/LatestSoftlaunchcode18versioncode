import React, { useEffect } from 'react';
import { useState, useMemo } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import DataTableCustom from './DataTable';
import MyTicketFilters from './MyTicketFilters';
import FilterModal from './FilterModal';
import UserService from '../../../services/MastersService/UserService';
import DepartmentService from '../../../services/MastersService/DepartmentService';
import StatusService from '../../../services/MastersService/StatusService';
import { errorHandler } from '../../../utils';
import { fetchData } from '../../../utils/fetchData';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import ReportService from '../../../services/ReportService/ReportService';
import { ExportAllTicketsToExcel } from '../../../components/Utilities/Table/ExportAllTicketsToExcel';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

const MyTicketsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabAndData, setActiveTabAndData] = useState('AssignToMe');
  const [allUsersData, setAllUsersData] = useState({});
  const [allDepartmentData, setAllDepartmentData] = useState({});
  const [allStatusData, setAllStatusData] = useState({});
  const [allTicketsData, setAllTicketsData] = useState({
    SearchResult: [],
    AssignToMe: [],
    CreatedByMe: [],
    DepartmentWise: [],
    YouTask: [],
    UnPassed: []
  });

  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

  const handleTabChange = async (key, values = null, filterMode = '') => {
    if (isLoading) return;
    setIsLoading(true);
    if (!values) {
      setActiveTabAndData(key);
    }

    const prepareFormData = (fields) => {
      const formData = new FormData();
      Object.entries(fields).forEach(([field, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => formData.append(`${field}[]`, item));
        } else {
          formData.append(field, value);
        }
      });
      return formData;
    };

    const processResponse = (response, tabKey) => {
      if (response?.status === 200) {
        const { status, data } = response?.data || {};
        if (status === 1 && data) {
          const { data: items = [], total = 0 } = data;
          setAllTicketsData((prev) => ({
            ...prev,
            [tabKey]: items
          }));
          setTotalRows(total);
          tabKey === 'SearchResult' && setIsFormSubmitted(true);
          setActiveTabAndData(tabKey);
        } else {
          tabKey === 'SearchResult' && setIsFormSubmitted(true);
          setActiveTabAndData(tabKey);
          setAllTicketsData((prev) => ({
            ...prev,
            [tabKey]: []
          }));
        }
      } else {
        errorHandler(response);
      }
    };

    if (filterMode === 'search') {
      const formData = prepareFormData({
        ticket_id: values.ticket_id,
        assign_to_user_id: values?.assign_to_user_id,
        department_id: values?.department_id,
        status_id: values?.status_id
      });

      const response = await new ReportService().getTicketReport(formData);
      processResponse(response, 'SearchResult');
    } else if (filterMode === 'filter') {
      const formData = prepareFormData({
        from_date: values.from_date,
        to_date: values.to_date,
        status_id: values?.status_id,
        ticket_id: values?.ticket_id
      });

      const response = await new ReportService().getTicketReport(formData);
      processResponse(response, 'SearchResult');
      setShowModal(false);
    } else {
      const payload = {
        typeOf: key,
        limit: perPage,
        page,
        filter: ''
      };

      const response = await new MyTicketService().getUserTicketsTest(payload);
      processResponse(response, key);
    }
    setIsLoading(false);
  };
  const tabList = useMemo(
    () => [
      {
        id: 1,
        name: 'SearchResult',
        tabColor: 'bg-primary',
        data: allTicketsData?.SearchResult || [],
        condition: isFormSubmitted
      },
      {
        id: 2,
        name: 'AssignToMe',
        tabColor: 'bg-primary',
        data: allTicketsData?.AssignToMe || [],
        condition: true
      },

      {
        id: 3,
        name: 'CreatedByMe',
        tabColor: 'bg-secondary',
        data: allTicketsData?.CreatedByMe || [],
        condition: true
      },
      {
        id: 4,
        name: 'DepartmentWise',
        tabColor: 'bg-success',
        data: allTicketsData?.DepartmentWise || [],
        condition: true
      },
      {
        id: 5,
        name: 'YouTask',
        tabColor: 'bg-danger',
        data: allTicketsData?.YouTask || [],
        condition: true
      },
      {
        id: 6,
        name: 'UnPassed',
        tabColor: 'bg-warning',
        data: allTicketsData?.UnPassed || [],
        condition: true
      }
    ],
    [allTicketsData, isFormSubmitted]
  );

  const handleSearch = async (values) => {
    let filterMode = 'search';
    handleTabChange('SearchResult', values, filterMode);
  };
  const onFilter = async (values) => {
    // console.log('values', values);
    let filterMode = 'filter';
    handleTabChange('SearchResult', values, filterMode);
  };

  useEffect(() => {
    fetchDataList();
    // handleTabChange('AssignToMe');
  }, []);

  useEffect(() => {
    handleTabChange(activeTabAndData, null, '');
  }, [page, perPage]);

  return (
    <div className="">
      {/* <MyTicketFilters
        setShowModal={setShowModal}
        allUsersData={allUsersData}
        allDepartmentData={allDepartmentData}
        allStatusData={allStatusData}
        isLoading={isLoading}
        setAllDepartmentData={setAllDepartmentData}
        setAllUsersData={setAllUsersData}
        setAllStatusData={setAllStatusData}
        setIsLoading={setIsLoading}
        setActiveTabAndData={setActiveTabAndData}
        setIsFormSubmitted={setIsFormSubmitted}
        setAllTicketsData={setAllTicketsData}
        allTicketsData={allTicketsData}
        activeTabAndData={activeTabAndData}
        setTotalRows={setTotalRows}
        handleSubmit={handleSearch}
      /> */}
      {/* <FilterModal
        showModal={showModal}
        setShowModal={setShowModal}
        allUsersData={allUsersData}
        allDepartmentData={allDepartmentData}
        allStatusData={allStatusData}
        setAllUsersData={setAllUsersData}
        onSubmit={onFilter}
      /> */}
      <Tabs
        transition={true}
        id="noanim-tab-example1"
        className="tab-body-header my-3  rounded d-inline-flex  nav nav-tabs"
        activeKey={activeTabAndData}
        defaultActiveKey="SearchResult"
        style={{ width: 'auto' }}
        onSelect={(key) => handleTabChange(key)}
      >
        {tabList
          ?.filter((tab) => tab?.condition !== false)
          .map((item, index) => (
            <Tab
              key={index}
              eventKey={item.name}
              title={
                <span>
                  {item?.name}
                  {/* <i
                    style={{ marginLeft: '4px' }}
                    class="icofont-tasks-alt fs-6"
                  ></i> */}
                </span>
              }
            >
              {/* {item.name === 'SearchResult' ? (
                <ExportToExcel
                  className="btn btn-sm btn-danger mx-0"
                  apiData={item?.data}
                  typeOf="SearchResult"
                  fileName={`Export Filter Result`}
                />
              ) : (
                <ExportAllTicketsToExcel
                  className="btn btn-sm btn-danger mx-0"
                  fileName={item.name}
                  typeOf={item.name}
                />
              )} */}
              <div>
                <DataTableCustom
                  allTicketsData={item.data}
                  type={activeTabAndData}
                  isLoading={isLoading}
                  setPage={setPage}
                  setPerPage={setPerPage}
                  totalRows={totalRows}
                />
              </div>
            </Tab>
          ))}
      </Tabs>
    </div>
  );
};

export default MyTicketsTab;
