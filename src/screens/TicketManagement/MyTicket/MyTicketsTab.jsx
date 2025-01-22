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

const MyTicketsTab = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabAndData, setActiveTabAndData] = useState('AssignToMe');
  const [allUsersData, setAllUsersData] = useState({});
  const [allDepartmentData, setAllDepartmentData] = useState({});
  const [allStatusData, setAllStatusData] = useState({});
  const [allTicketsData, setAllTicketsData] = useState({
    AssignToMe: [],
    CreatedByMe: [],
    DepartmentWise: [],
    YouTask: [],
    UnPassed: []
  });

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

  // const getTicketsForUser = async (type) => {
  //   const payload = {
  //     typeOf: activeTabAndData,
  //     limit: 10,
  //     page: 1,
  //     filter: ''
  //   };
  // };

  const handleTabChange = async (key) => {
    // console.log('key', key);
    setActiveTabAndData(key);
    const payload = {
      typeOf: key,
      limit: 10,
      page: 1,
      filter: ''
    };

    const response = await new MyTicketService().getUserTicketsTest(payload);

    if (response?.status === 200 && response?.statusText === 'OK') {
      console.log('response of tickets data', response?.data);
      const { status } = response?.data;

      if (status === 1) {
        const {
          data: { data = [] }
        } = response;

        setAllTicketsData({ ...allTicketsData, [key]: data.data });
      } else {
        errorHandler(response);
      }
    } else {
      errorHandler(response);
    }
  };

  const tabList = useMemo(
    () => [
      {
        id: 1,
        name: 'AssignToMe',
        tabColor: 'bg-primary',
        data: allTicketsData?.AssignToMe || []
      },

      {
        id: 2,
        name: 'CreatedByMe',
        tabColor: 'bg-secondary',
        data: allTicketsData?.CreatedByMe || []
      },
      {
        id: 3,
        name: 'DepartmentWise',
        tabColor: 'bg-success',
        data: allTicketsData?.DepartmentWise || []
      },
      {
        id: 4,
        name: 'YouTask',
        tabColor: 'bg-danger',
        data: allTicketsData?.YouTask || []
      },
      {
        id: 5,
        name: 'UnPassed',
        tabColor: 'bg-warning',
        data: allTicketsData?.UnPassed || []
      }
    ],
    [allTicketsData]
  );

  useEffect(() => {
    fetchDataList();
    handleTabChange('AssignToMe');
  }, []);

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
        style={{ width: 'auto' }}
        onSelect={(key) => handleTabChange(key)}
      >
        {tabList.map((item, index) => (
          <Tab
            key={index}
            eventKey={item.name}
            title={<span className={``}>{item.name}</span>}
          >
            <div>
              <DataTableCustom
                allTicketsData={item.data}
                type={activeTabAndData}
              />
            </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

export default MyTicketsTab;
