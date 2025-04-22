import React, { useCallback, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Table } from 'react-bootstrap';
import ErrorLogService from '../../services/ErrorLogService';
import UserService from '../../services/MastersService/UserService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import { Link } from 'react-router-dom';
import { _base } from '../../settings/constants';
import MaterialTable from '../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import errorHandler from '../../utils/errorHandler';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../Dashboard/DashboardAction';

export default function ResourcePlanningReportComponent() {
  const [userData, setUserData] = useState(null);
  const [data, setData] = useState([]);

  const dispatch = useDispatch();
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 25)
  );

  const [todateformat, setTodateformat] = useState('');
  const [fromdateformat, setFromdateformat] = useState('');

  let user_id = localStorage.getItem('id');
  const currentDate = moment().startOf('day').toDate().toString();
  const oneWeekBackDate = moment().subtract(7, 'days').format('YYYY-MM-DD');

  const [loading, setLoading] = useState(true);
  const [filterData, setFilterData] = useState([
    {
      id: 'user_name',
      value: [Number(user_id || 0)]
    },
    {
      id: 'date',
      value: [new Date(oneWeekBackDate), new Date(currentDate)]
    }
  ]);

  const disableAllFeatures = {
    enableColumnOrdering: true,
    enableGrouping: true,
    enableSorting: false,
    enableColumnFilter: false
  };

  const columns = [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 160,
      filterVariant: 'date-range'
    },
    {
      accessorKey: 'user_name',
      header: 'User Name',
      filterVariant: 'multi-select',
      size: 210,
      filterSelectOptions: userData
    },
    {
      accessorKey: 'hours',
      header: 'Hours',
      size: 160,
      ...disableAllFeatures
    }
  ];

  const loadData = useCallback(async () => {
    try {
      const inputRequired =
        'id,employee_id,first_name,last_name,middle_name,is_active';
      const response = await new UserService().getUserForMyTickets(
        inputRequired
      );

      if (response.status === 200) {
        const rawData = response?.data?.data?.data || [];

        const filteredData = rawData
          .filter((user) => user.is_active === 1 && user.account_for === 'SELF')
          .map((user) => ({
            value: user.id,
            label: `${user.first_name} ${user.last_name} (${user.id})`
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setUserData(filteredData);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }

    dispatch(getRoles());
  }, [dispatch]);

  const handleForm = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('from_date', values.from_date);
    formData.append('to_date', values.to_date);
    if (values?.user_id?.length > 0) {
      values.user_id.forEach((item) => {
        formData.append('user_id[]', item);
      });
    } else {
      formData.append('user_id[]', '');
    }
    const tempData = [];
    var flag = 1;

    if (todateformat > fromdateformat) {
      alert('Please select End Date Greater than Start date');
    } else {
      if (flag === 1) {
        try {
          const res = await new ReportService().getResourcePlanningReport(
            formData
          );
          if (res.status === 200) {
            if (res.data.status === 1) {
              let sr = 1;
              const data = res.data.data;

              if (data && data.length > 0) {
                for (const item of data) {
                  const tasks = Array.isArray(item.tasks) ? item.tasks : [];

                  for (const task of tasks) {
                    tempData.push({
                      sr: sr++,
                      date: item.date,
                      hours: item.hours,
                      user_id: item.user_id,
                      user_name: item.user_name,
                      job_role: item.job_role || '-',
                      ticket_id: task.ticket_id,
                      sprint_name: task.sprint_name || '-',
                      sprint_start_date: task.sprint_start_date || '-',
                      sprint_end_date: task.sprint_end_date || '-',
                      type_name: task.type_name || '-',
                      task_name: task.task_name,
                      total_hours: task.total_hours,
                      tasks: item.tasks
                    });
                  }
                }
                setData([]);
                setData(tempData);


              } else {
                setData([]);
              }
            } else {
              setData([]);
            }
          } else {
            new ErrorLogService().sendErrorLog(
              'ResourcePlanning',
              'Get_ResourcePlanning',
              'INSERT',
              res.message
            );
          }
        } catch (error) {
          errorHandler(error?.response);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const exportDataKeys = {
    ticket_id: 'Ticket ID',
    job_role: 'Job Role',
    sprint_name: 'Sprint Name',
    sprint_start_date: 'Sprint Start Date',
    sprint_end_date: 'Sprint End Date',
    date: 'Date',
    user_name: 'User Name',
    type_name: 'Type Name',
    task_name: 'Task Name',
    total_hours: 'Total Hours',
    fileName: 'Resource Planning Report'
  };

  const renderDetailPanel = ({ row }) => {
    const data = row.original;

    return (
      <pre>
        <Table>
          <thead>
            <tr>
              <th>Sr</th>
              <th>Task Name</th>
              <th>Sprint Name</th>
              <th>Task Hour</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks &&
              data.tasks.length > 0 &&
              data.tasks.map((task, key) => {
                return (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    {/*        // Updated by Asmita Margaje */}
                    <td>
                      <Link to={`/${_base}/Ticket/Task/${task.id}`}>
                        <span style={{ fontWeight: 'bold' }}>
                          {' '}
                          {task.ticket_id}{' '}
                        </span>
                      </Link>
                      - {task.task_name}
                    </td>
                    <td>{task.sprint_name || '-'}</td>
                    <td>{task.total_hours}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </pre>
    );
  };
  useEffect(() => {
    const userId = localStorage.getItem('id');
    const fromDateRaw = filterData.find((f) => f.id === 'date')?.value?.[0];
    const toDateRaw = filterData.find((f) => f.id === 'date')?.value?.[1];
    const getFormattedDate = (date) =>
      date ? moment(date).format('YYYY-MM-DD') : '';
    if (userId) {
      const filterValues = {
        user_id:
          filterData?.find((filter) => filter.id === 'user_name')?.value || [],
        from_date: getFormattedDate(fromDateRaw),
        to_date: getFormattedDate(toDateRaw)
      };
      handleForm(filterValues);
    }
  }, [filterData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Resource Planing Report" />

      <div className="card mt-2">
        <div className="row clearfix g-3">
          <div className="col-sm-12">
            {data && (
              <MaterialTable
                columns={columns}
                data={data}
                enableRowNumbers={true}
                manualFiltering={true}
                setFilterData={setFilterData}
                filterData={filterData}
                isLoading={loading}
                renderDetailPanel={renderDetailPanel}
                enableExpandAll={true}
                exportDataKeys={exportDataKeys}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
