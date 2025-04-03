import React, { useEffect, useState, useMemo } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import DataTableCustom from './DataTable';
import UserService from '../../../services/MastersService/UserService';
import DepartmentService from '../../../services/MastersService/DepartmentService';
import StatusService from '../../../services/MastersService/StatusService';
import { errorHandler } from '../../../utils';
import { fetchData } from '../../../utils/fetchData';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import ReportService from '../../../services/ReportService/ReportService';

const MyTicketsTab = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('AssignToMe');
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
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [columnFilters , setColumnFilters] = useState([])

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10 //customize the default page size
  });

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

  const tabList = useMemo(
    () => [
      { id: 2, name: 'AssignToMe', label: 'Assign To Me', color: 'primary' },
      {
        id: 3,
        name: 'CreatedByMe',
        label: 'Created By Me',
        color: 'secondary'
      },
      {
        id: 4,
        name: 'DepartmentWise',
        label: 'Department Wise',
        color: 'success'
      },
      { id: 5, name: 'YouTask', label: 'You Task', color: 'error' },
      { id: 6, name: 'UnPassed', label: 'UnPassed', color: 'warning' }
    ],
    [allTicketsData, isFormSubmitted]
  );

  const handleTabChange = async (event, newValue) => {
    if (isLoading) return;
    setActiveTab(newValue);
    setColumnFilters([])
    setPagination({ pageIndex: 0, pageSize: 10 });
    // setIsLoading(true);

    // const payload = {
    //   typeOf: newValue,
    //   limit: 10,
    //   page: 1,
    //   filter: ''
    // };
    // const response = await new MyTicketService().getUserTicketsTest(payload);

    // if (response?.status === 200) {
    //   const { status, data } = response?.data || {};
    //   if (status === 1 && data) {
    //     const { data: items = [], total = 0 } = data;
    //     setAllTicketsData((prev) => ({
    //       ...prev,
    //       [newValue]: items
    //     }));
    //     setTotalRows(total);
    //   } else {
    //     setAllTicketsData((prev) => ({
    //       ...prev,
    //       [newValue]: []
    //     }));
    //   }
    // } else {
    //   errorHandler(response);
    // }
    // setIsLoading(false);
  };

  useEffect(()=> {
    fetchDataList();
  },[])

  console.log(columnFilters,"columnFilters")

  useEffect(() => {
    const fetchData = async () => {
        if (isLoading) return;
        setIsLoading(true);

        const hasColumnFilters = columnFilters?.length > 0;
        let payload;

        if (hasColumnFilters) {
            payload = {
                department_id: columnFilters.find(filter => filter.id === "assign_to_department.department")?.value || [],
                status_id: columnFilters.find(filter => filter.id === "Status")?.value || [],
                ticket_id: "",
                assign_to_user_id: columnFilters.find(filter => filter.id === "Assigned To")?.value || [],
                limit: pagination.pageSize,
                page: pagination.pageIndex + 1,
                typeOf: "SearchResult"
            };
        } else {
            payload = {
                typeOf: activeTab,
                limit: pagination.pageSize,
                page: pagination.pageIndex + 1,
                filter: ''
            };
        }

        try {
            const response = hasColumnFilters
                ? await new ReportService().getTicketReport(payload)
                : await new MyTicketService().getUserTicketsTest(payload);

            if (response?.status === 200) {
                const { status, data } = response?.data || {};
                if (status === 1 && data) {
                    const { data: items = [], total = 0 } = data;
                    setAllTicketsData(prev => ({ ...prev, [activeTab]: items }));
                    setTotalRows(total);
                } else {
                    setAllTicketsData(prev => ({ ...prev, [activeTab]: [] }));
                }
            } else {
                errorHandler(response);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    fetchData();
}, [activeTab, pagination.pageIndex, pagination.pageSize, columnFilters]);




  return (
    <Box mt={1}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="ticket tabs"
      >
        {tabList?.map((tab) => (
          <Tab key={tab.id} value={tab.name} label={tab.label} />
        ))}
      </Tabs>

      <Box mt={2}>
        <DataTableCustom
          allTicketsData={allTicketsData[activeTab] || []}
          type={activeTab}
          isLoading={isLoading}
          totalRows={totalRows}
          pagination={pagination}
          setPagination={setPagination}
          allStatusData={allStatusData}
          allDepartmentData={allDepartmentData}
          allUsersData={allUsersData}
          setAllTicketsData={setAllTicketsData}
          activeTab={activeTab}
          setTotalRows={setTotalRows}
          setColumnFilters={setColumnFilters}
          columnFilters={columnFilters}

        />
      </Box>
    </Box>
  );
};

export default MyTicketsTab;
