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
import { useDebounce } from '../../../hooks/useDebounce';
import moment from 'moment/moment';

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
    YourTask: [],
    UnPassed: []
  });

  const [totalRows, setTotalRows] = useState(0);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const [columnFilters, setColumnFilters] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10 //customize the default page size
  });

  const [reset, setReset] = useState(false);

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
    const fetchPromises = apiFetchData.map((item) =>
      fetchData(
        item.service,
        item.inputRequired,
        item.isLoading,
        item.setIsLoading,
        item.errorHandler,
        item.filterObj,
        item.name
      ).then((res) => item.setState({ ...res }))
    );
    await Promise.all(fetchPromises);
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
      { id: 5, name: 'YourTask', label: 'Your Task', color: 'error' },
      { id: 6, name: 'UnPassed', label: 'UnPassed', color: 'warning' }
    ],
    [allTicketsData, isFormSubmitted]
  );

  const handleTabChange = async (event, newValue) => {
    if (isLoading) return;
    setActiveTab(newValue);
    setColumnFilters([]);
    setReset(true);
    setPagination({ pageIndex: 0, pageSize: 10 });
  };

  useEffect(() => {
    fetchDataList();
  }, []);

  const ticketIdValue =
    columnFilters.find((f) => f.id === 'ticket_id')?.value || '';

  const debouncedTicketId = useDebounce(ticketIdValue, 1000);
  useEffect(() => {
    const getData = async () => {
      if (isLoading) return;
      setIsLoading(true);
      const fromDateRaw = columnFilters.find((f) => f.id === 'ticket_date')
        ?.value?.[0];
      const toDateRaw = columnFilters.find((f) => f.id === 'ticket_date')
        ?.value?.[1];

      const hasColumnFilters = columnFilters?.some((filter) => {
        const value = filter?.value;

        if (filter.id === 'ticket_date' && Array.isArray(value)) {
          return value[0] || value[1];
        }

        if (Array.isArray(value)) {
          return value.some((v) => v);
        }

        return !!value;
      });

      const getFormattedDate = (date) =>
        date ? moment(date).format('YYYY-MM-DD') : '';

      const payload = hasColumnFilters
        ? {
            department_id:
              columnFilters.find(
                (filter) => filter.id === 'assign_to_department.department'
              )?.value || [],
            status_id:
              columnFilters.find((filter) => filter.id === 'Status')?.value ||
              [],
            ticket_id: debouncedTicketId,
            assign_to_user_id:
              columnFilters.find((filter) => filter.id === 'Assigned To')
                ?.value || [],
            from_date: getFormattedDate(fromDateRaw),
            to_date: getFormattedDate(toDateRaw),
            limit: pagination.pageSize,
            page: pagination.pageIndex + 1,
            typeOf: 'SearchResult'
          }
        : {
            typeOf: activeTab,
            limit: pagination.pageSize,
            page: pagination.pageIndex + 1,
            filter: ''
          };

      try {
        const response = hasColumnFilters
          ? await new ReportService().getTicketReport(payload)
          : await new MyTicketService().getUserTicketsTest(payload);

        if (response?.status === 200) {
          const { status, data } = response?.data || {};
          if (status === 1 && data) {
            const { data: items = [], total = 0 } = data;
            setAllTicketsData((prev) => ({ ...prev, [activeTab]: items }));
            setTotalRows(total);
          } else {
            setTotalRows(0);
            setAllTicketsData((prev) => ({ ...prev, [activeTab]: [] }));
          }
        } else {
          errorHandler(response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!ticketIdValue || ticketIdValue === debouncedTicketId) {
      getData();
    }
  }, [
    activeTab,
    pagination.pageIndex,
    pagination.pageSize,
    columnFilters,
    debouncedTicketId
  ]);

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
          reset={reset}
          setReset={setReset}
        />
      </Box>
    </Box>
  );
};

export default MyTicketsTab;
