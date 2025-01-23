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
  const INITIAL_PAGE = 1;
  const INITIAL_PER_PAGE = 10;
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


  const handleTabChange = async (key, values = null) => {
    setIsLoading(true);
   !values && setActiveTabAndData(key);
    if (key === 'SearchResult' && values) {
      // Handle form submission logic
      const formData = new FormData();
      formData.append('ticket_id', values.ticket_id);
      values?.assign_to_user_id.forEach((user) => {
        formData?.append('assign_to_user_id[]', user);
      });
      values?.department_id.forEach((department) => {
        formData?.append('department_id[]', department);
      });
      values?.status_id.forEach((status) => {
        formData?.append('status_id[]', status);
      });

      const response = await new ReportService().getTicketReport(formData);
      if (response?.status === 200) {
        const { status } = response?.data;
        if (status === 1) {
          const {
            data: { data = [] }
          } = response;
          setAllTicketsData((prev) => ({
            ...prev,
            SearchResult: data?.data || []
          }));
          setTotalRows(data?.total);
          setIsFormSubmitted(true);
          setActiveTabAndData('SearchResult');
        } else {
          setAllTicketsData((prev) => ({
            ...prev,
            SearchResult: []
          }));
        }
      }
    } else {

      const payload = {
        typeOf: key,
        limit: perPage,
        page: page,
        filter: ''
      };

      const response = await new MyTicketService().getUserTicketsTest(payload);

      if (response?.status === 200 && response?.statusText === 'OK') {
        const { status } = response?.data;

        if (status === 1) {
          const {
            data: { data = [] }
          } = response;
          setTotalRows(data?.total);
          setAllTicketsData((prev) => ({
            ...prev,
            [key]: data?.data || []
          }));
        } else {
          errorHandler(response);
        }
      } else {
        errorHandler(response);
      }
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

  useEffect(() => {
    fetchDataList();
    // handleTabChange('AssignToMe');
  }, []);

  useEffect(() => {
    handleTabChange('AssignToMe',null);
  },[page, perPage])

  const handleSubmit = async (values) => {
    handleTabChange('SearchResult', values);
  }


  return (
    <div className="">
      <MyTicketFilters
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
        handleSubmit={handleSubmit}
      />
      <FilterModal
        showModal={showModal}
        setShowModal={setShowModal}
        allUsersData={allUsersData}
        allDepartmentData={allDepartmentData}
        allStatusData={allStatusData}
        setAllUsersData={setAllUsersData}
      />
      <Tabs
        transition={true}
        id="noanim-tab-example1"
        className="tab-body-header my-3  rounded d-inline-flex  nav nav-tabs"
        activeKey={activeTabAndData}
        defaultActiveKey="SearchResult"
        style={{ width: 'auto' }}
        onSelect={(key) => handleTabChange(key)}
      >
        {tabList?.filter((tab) => tab?.condition !== false).map((item, index) => (
          <Tab
            key={index}
            eventKey={item.name}
            title={
              <span>
                {item?.name}
                <i
                  style={{ marginLeft: '4px' }}
                  class="icofont-tasks-alt fs-6"
                ></i>
              </span>
            }
          >
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
