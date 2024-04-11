import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Tooltip, OverlayTrigger } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditInterviewMasterModal from './AddEditInterviewMasterModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getInterviewMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/interviewListMaster';
import { customSearchHandler } from '../../../../utils/customFunction';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';

function InterviewMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { interviewMasterList, isLoading } = useSelector(state => state?.interviewMaster);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditInterviewModal, setAddEditInterviewModal] = useState({
    open: false,
    type: '',
    data: '',
  });
  const [filteredInterviewMasterList, setFilteredInterviewMasterList] = useState([]);

  // // All commented code will remove after BA confirmation
  // // static data
  const columns = [
    {
      name: 'Action',
      selector: row => (
        <>
          <i
            className="icofont-edit text-primary cp me-3"
            onClick={() => setAddEditInterviewModal({ type: 'EDIT', data: row, open: true })}
          />
          <i
            class="icofont-eye-alt text-primary cp"
            onClick={() => setAddEditInterviewModal({ type: 'VIEW', data: row, open: true })}
          />
        </>
      ),
      sortable: false,
      width: '80px',
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    // {
    //   name: 'Department',
    //   // selector: row =>
    //   //   row?.details?.length ? (
    //   //     <OverlayTrigger
    //   //       placement="top"
    //   //       overlay={
    //   //         <Tooltip id={`tooltip-${row.id}`}>
    //   //           {row?.details?.map(detail => (detail?.department ? `${detail?.department}, ` : ''))}
    //   //         </Tooltip>
    //   //       }
    //   //     >
    //   //       <span>
    //   //         {row?.details?.map(detail => (detail?.department ? `${detail?.department}, ` : ''))}
    //   //       </span>
    //   //     </OverlayTrigger>
    //   //   ) : (
    //   //     '--'
    //   //   ),
    //   selector: row => row?.department || '--',
    //   sortable: true,
    //   width: '200px',
    // },
    // {
    //   name: 'Designation',
    //   // selector: row =>
    //   //   row?.details?.length ? (
    //   //     <OverlayTrigger
    //   //       placement="top"
    //   //       overlay={
    //   //         <Tooltip id={`tooltip-${row.id}`}>
    //   //           {row?.details?.map(detail =>
    //   //             detail?.designation ? `${detail?.designation}, ` : '',
    //   //           )}
    //   //         </Tooltip>
    //   //       }
    //   //     >
    //   //       <span>
    //   //         {row?.details?.map(detail => (detail?.designation ? `${detail?.designation}, ` : ''))}
    //   //       </span>
    //   //     </OverlayTrigger>
    //   //   ) : (
    //   //     '--'
    //   //   ),
    //   selector: row => row?.designation || '--',
    //   sortable: true,
    //   width: '200px',
    // },
    // {
    //   name: 'Experience Level',
    //   selector: row => row?.experience_level || '--',
    //   sortable: true,
    //   width: '150px',
    // },
    {
      name: 'Step Count',
      selector: row => row?.steps_count || '--',
      sortable: true,
      width: '120px',
    },
    // {
    //   name: 'Step Title',
    //   selector: row =>
    //     row?.details?.length ? (
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={
    //           <Tooltip id={`tooltip-${row.id}`}>
    //             {row?.details?.map(detail => (detail?.step_title ? `${detail?.step_title}, ` : ''))}
    //           </Tooltip>
    //         }
    //       >
    //         <span>
    //           {row?.details?.map(detail => (detail?.step_title ? `${detail?.step_title}, ` : ''))}
    //         </span>
    //       </OverlayTrigger>
    //     ) : (
    //       '--'
    //     ),

    //   sortable: true,
    //   width: '300px',
    // },
    // {
    //   name: 'Name',
    //   selector: row =>
    //     row?.details?.length ? (
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={
    //           <Tooltip id={`tooltip-${row.id}`}>
    //             {row?.details?.map(detail =>
    //               detail?.employee_name ? `${detail?.employee_name}, ` : '',
    //             )}
    //           </Tooltip>
    //         }
    //       >
    //         <span>
    //           {row?.details?.map(detail =>
    //             detail?.employee_name ? `${detail?.employee_name}, ` : '',
    //           )}
    //         </span>
    //       </OverlayTrigger>
    //     ) : (
    //       '--'
    //     ),
    //   sortable: true,
    //   width: '300px',
    // },
    // {
    //   name: 'Email',
    //   selector: row =>
    //     row?.details?.length ? (
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={
    //           <Tooltip id={`tooltip-${row.id}`}>
    //             {row?.details?.map(detail =>
    //               detail?.employee_email ? `${detail?.employee_email}, ` : '',
    //             )}
    //           </Tooltip>
    //         }
    //       >
    //         <span>
    //           {row?.details?.map(detail =>
    //             detail?.employee_email ? `${detail?.employee_email}, ` : '',
    //           )}
    //         </span>
    //       </OverlayTrigger>
    //     ) : (
    //       '--'
    //     ),

    //   sortable: true,
    //   width: '300px',
    // },
    // {
    //   name: 'Remark',
    //   selector: row =>
    //     row?.remark ? (
    //       <OverlayTrigger
    //         placement="top"
    //         overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark}</Tooltip>}
    //       >
    //         <span>{row?.remark || '--'}</span>
    //       </OverlayTrigger>
    //     ) : (
    //       '--'
    //     ),
    //   sortable: true,
    //   width: '300px',
    // },
    {
      name: 'Status',
      sortable: true,
      selector: row => <StatusBadge status={row?.is_active} />,
      with: '120px',
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

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = customSearchHandler(interviewMasterList, searchValue);
    setFilteredInterviewMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredInterviewMasterList(interviewMasterList);
  };

  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      Department: row?.department || '--',
      Designation: row?.designation || '--',
      'Experience Level': row?.experience_level || '--',
      'Step Count': row?.steps_count || '--',
      'Step Title': row?.details?.map(detail => detail?.step_title || '--').join(', '),
      Name: row?.details?.map(detail => detail?.employee_name || '--').join(', '),
      Email: row?.details?.map(detail => detail?.employee_email || '--').join(', '),
      Remark: row?.remark || '--',
      Status: row?.is_active ? 'Active' : 'Deactive',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
      'Updated At': row?.updated_at || '--',
      'Updated By': row?.updated_by || '--',
    }));
  };

  // // life cycle
  useEffect(() => {
    dispatch(getInterviewMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when interviewMasterList changes
  useEffect(() => {
    setFilteredInterviewMasterList(interviewMasterList);
  }, [interviewMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Interview Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditInterviewModal({ type: 'ADD', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Steps
              </button>
            );
          }}
        />
        <Row>
          <Col xs={12} md={8} xxl={9}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={e => setSearchValue(e?.target?.value)}
              placeholder="Enter interview name..."
              className="form-control"
            />
          </Col>
          <Col xs={12} md={4} xxl={3} className="text-end mt-2 mt-md-0">
            <button className="btn btn-warning text-white" type="button" onClick={handleSearch}>
              <i className="icofont-search-1 " /> Search
            </button>
            <button className="btn btn-info text-white" type="button" onClick={handleReset}>
              <i className="icofont-refresh text-white" /> Reset
            </button>
            <ExportToExcel
              className="btn btn-danger"
              apiData={transformDataForExport(filteredInterviewMasterList)}
              fileName="Interview master Records"
              disabled={!filteredInterviewMasterList?.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredInterviewMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getInterviewMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>
      <AddEditInterviewMasterModal
        show={addEditInterviewModal?.open}
        type={addEditInterviewModal?.type}
        currentInterviewData={addEditInterviewModal?.data}
        close={prev => setAddEditInterviewModal({ ...prev, open: false })}
      />
    </>
  );
}

export default InterviewMaster;
