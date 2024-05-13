import React, { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// // static import
import TableLoadingSkelton from '../../../../../../../../../components/custom/loader/TableLoadingSkelton';
import { getSalaryNegotiatingActivityDataThunk } from '../../../../../../../../../redux/services/hrms/employeeJoining/interviewProcess';
import { formatNumberWithCurrency } from '../../../../../../../../../utils/customFunction';

function SalaryNegotiationActivity() {
  // // initial state
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentCandidateId } = location.state;

  // // redux state
  const { isLoading, salaryNegationActivityList } = useSelector(state => state?.interViewProcess);

  // // static data
  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Salary',
      sortable: true,
      selector: row => (row?.max_salary ? formatNumberWithCurrency(row?.max_salary) : '--'),
      width: '120px',
    },
    {
      name: 'Negotiated salary',
      sortable: true,
      selector: row =>
        row?.sr_hr_negotiable_salary
          ? formatNumberWithCurrency(row?.sr_hr_negotiable_salary)
          : '--',
      width: '150px',
    },

    {
      name: 'Created At',
      selector: row => row?.created_at || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created By',
      selector: row => row?.created_by || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated At',
      selector: row => row?.updated_at || '--',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Updated By',
      selector: row => row?.updated_by || '--',
      sortable: true,
      width: '175px',
    },
  ];

  // // life cycle
  useEffect(() => {
    dispatch(getSalaryNegotiatingActivityDataThunk({ currentId: currentCandidateId }));
  }, [currentCandidateId]);

  return (
    <>
      <h5 className="mb-0 text-primary">Salary Negotiation Activity</h5>
      <hr className="primary_divider mt-1" />
      <DataTable
        columns={columns}
        data={salaryNegationActivityList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.salaryNegationActivity}
        progressComponent={<TableLoadingSkelton />}
      />
    </>
  );
}

export default SalaryNegotiationActivity;
