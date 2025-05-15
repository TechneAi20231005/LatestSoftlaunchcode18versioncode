import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PageHeader from '../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportDataFile';
import { getReviewCommentMasterListThunk } from '../../../redux/services/testCases/reviewCommentMaster';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import AddEditReviewCommentMaster from './Validation/AddEditReviewCommentMaster';
import { Tooltip } from 'react-tooltip';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
function ReviewCommentMasterComponent() {
  const dispatch = useDispatch();

  // // redux state
  const { reviewCommentMasterList, isLoading } = useSelector(
    (state) => state?.reviewCommentMaster
  );

  const [searchValue, setSearchValue] = useState('');
  const [filteredReviewCommentMasterList, setFilteredReviewCommentMasterList] =
    useState([]);

  const [addEditReviewCommentModal, setAddEditReviewCommentModal] = useState({
    type: '',
    data: '',
    open: false
  });
  const [reset, setReset] = useState(false);

  const handleSearch = () => {
    const filteredList = customSearchHandler(
      reviewCommentMasterList,
      searchValue
    );
    setFilteredReviewCommentMasterList(filteredList);
  };

  const handleReset = () => {
    setSearchValue('');
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  };

  // const columns = [
  //   {
  //     name: 'Sr. No.',
  //     selector: (row, index) => index + 1,
  //     sortable: false,
  //     width: '70px'
  //   },
  //   {
  //     name: 'Action',
  //     selector: (row) => (
  //       <i
  //         className="icofont-edit text-primary cp"
  //         onClick={() =>
  //           setAddEditReviewCommentModal({
  //             type: 'EDIT',
  //             data: row,
  //             open: true
  //           })
  //         }
  //       />
  //     ),
  //     sortable: false,
  //     width: '70px'
  //   },

  //   {
  //     name: 'Status',
  //     selector: (row) => row.is_active,
  //     sortable: true,
  //     cell: (row) => (
  //       <div>
  //         {row.is_active == 1 && (
  //           <span className="badge bg-primary">Active</span>
  //         )}
  //         {row.is_active == 0 && (
  //           <span className="badge bg-danger">Deactive</span>
  //         )}
  //       </div>
  //     ),
  //     width: '100px'
  //   },
  //   {
  //     name: 'Reviewer Comment Title',
  //     selector: (row) => row.reviewer_comment,
  //     sortable: false,
  //     width: '200px',
  //     cell: (row) => (
  //       <>
  //         <a data-tooltip-id={`my-tooltip-click-${row?.id}`}>
  //           <Tooltip
  //             id={`my-tooltip-click-${row?.id}`}
  //             content={row.reviewer_comment}
  //             openOnClick
  //           ></Tooltip>
  //           {row?.reviewer_comment}
  //         </a>
  //       </>
  //     )
  //   },

  //   {
  //     name: 'Created At',
  //     selector: (row) => row.created_at,
  //     sortable: false,
  //     width: '175px'
  //   },

  //   {
  //     name: 'Created By',
  //     selector: (row) =>
  //       (row?.created_by?.first_name || '-' + ' ') +
  //       ' ' +
  //       (row?.created_by?.last_name || '-'),
  //     sortable: false,
  //     width: '175px'
  //   },
  //   {
  //     name: 'Updated At',
  //     selector: (row) => row.updated_at || '- -',
  //     sortable: false,
  //     width: '175px'
  //   },

  //   {
  //     name: 'Updated By',
  //     selector: (row) =>
  //       (row?.updated_by?.first_name || '-' + ' ') +
  //       ' ' +
  //       (row?.updated_by?.last_name || '-'),
  //     sortable: false,
  //     width: '175px'
  //   }
  // ];

  const columns = [
    {
      accessorKey: 'counter',
      header: 'Sr',
      // cell: (row, index) => {
      //   return row?.index + 1;
      // },
      size: 70,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'action', // Use a valid key
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => {
        return (
          <div className="btn-group" role="group">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-toggle="modal"
              data-bs-target="#edit"
              onClick={() =>
                setAddEditReviewCommentModal({
                  type: 'EDIT',
                  data: row?.original,
                  open: true
                })
              }
            >
              <i className="icofont-edit text-success"></i>
            </button>
          </div>
        );
      }
    },

    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: ({ row }) => {
        const isActive = row?.original?.is_active;
        return (
          <span
            className={`badge ${isActive ? 'bg-primary' : 'bg-danger'}`}
            style={{ width: '4rem' }}
          >
            {isActive ? 'Active' : 'Deactive'}
          </span>
        );
      }
    },
    {
      accessorKey: 'reviewer_comment',
      header: 'Reviewer Comment Title',
      size: 250,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
    },
    {
      accessorFn: (originalRows) =>
        `${originalRows?.is_automation_script || '--'} `,
      header: 'Is Automation Script',
      Header: (
        <span>
          Is Automation Script
          <i
            className="icofont-filter ms-2 text-dark"
            style={{ cursor: 'pointer' }}
          />
        </span>
      ),

      size: 250,
      enableSorting: false
    },
    {
      accessorFn: (originalRow) => {
        return moment(originalRow.created_at).startOf('day').toDate();
      },
      header: 'Created At',
      filterVariant: 'date',
      Cell: ({ cell }) =>
        moment(cell.row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
    },
    {
      accessorFn: (originalRow) =>
        `${originalRow?.created_by?.first_name || ''} ${
          originalRow?.created_by?.last_name || ''
        }`.trim() || '--',
      header: 'Created By'
    },

    {
      accessorFn: (originalRow) => originalRow?.updated_at || '--',
      header: 'Updated At'
    },

    {
      accessorFn: (originalRow) =>
        `${originalRow?.updated_by?.first_name || ''} ${
          originalRow?.updated_by?.last_name || ''
        }`.trim() || '--',
      header: 'Updated By'
    }
  ];

  const exportDataKeys = {
    reviewer_comment: 'Reviewer Comment Title',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Reviewer Comment Master'
  };

  const transformDataForExport = (data) => {
    return data.map((row) => ({
      ...row,
      created_by:
        (row?.created_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.created_by?.last_name || '-'),

      updated_by:
        (row?.updated_by?.first_name || '-' + ' ') +
        ' ' +
        (row?.updated_by?.last_name || '-'),
      status: row.is_active == 1 ? 'Active' : 'Deactive'
    }));
  };

  const transformedData = transformDataForExport(
    filteredReviewCommentMasterList
  );

  const exportColumns = [
    { title: 'Reviewer Comment Title', field: 'reviewer_comment' },
    { title: 'Status', field: 'status' },

    { title: 'Created At', field: 'created_at' },
    { title: 'Created By', field: 'created_by' },
    { title: 'Updated At', field: 'updated_at' },
    { title: 'Updated By', field: 'updated_by' }
  ];

  useEffect(() => {
    dispatch(getReviewCommentMasterListThunk());
  }, []);

  useEffect(() => {
    setFilteredReviewCommentMasterList(reviewCommentMasterList);
  }, [reviewCommentMasterList]);

  useEffect(() => {
    handleSearch();
  }, [searchValue]);
  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between">
        <PageHeader headerTitle="Review Comment Master" />
        <div>
          <button
            className="btn btn-primary text-white "
            onClick={() =>
              setAddEditReviewCommentModal({
                type: 'ADD',
                data: '',
                open: true
              })
            }
          >
            <i className="icofont-plus px-2"></i>
            Add Reviewer Comment
          </button>
        </div>
      </div>

      {/* <Row className="row_gap_3">
        <Col xs={12} md={7} xxl={8}>
          <input
            id="reviewcommentmaster_reviewercommentsearch"
            type="search"
            name="interview_search"
            value={searchValue}
            onChange={(e) => setSearchValue(e?.target?.value)}
            placeholder="Search reviewer comment here..."
            className="form-control"
          />
        </Col>
        <Col
          xs={12}
          md={5}
          xxl={4}
          className="d-flex justify-content-sm-end btn_container"
        >
          <button
            className="btn btn-warning text-white"
            type="button"
            onClick={handleSearch}
          >
            <i className="icofont-search-1 " /> Search
          </button>
          <button
            className="btn btn-info text-white"
            type="button"
            onClick={handleReset}
          >
            <i className="icofont-refresh text-white" /> Reset
          </button>
          <ExportToExcel
            className="btn btn-danger"
            apiData={transformedData}
            columns={exportColumns}
            fileName="Review Comment Master Records"
            disabled={!filteredReviewCommentMasterList?.length}
          />
        </Col>
      </Row> */}

      {/* <DataTable
        columns={columns}
        data={filteredReviewCommentMasterList}
        defaultSortField="role_id"
        pagination
        selectableRows={false}
        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
        highlightOnHover={true}
        progressPending={isLoading?.getReviewCommentMasterList}
        progressComponent={<TableLoadingSkelton />}
      /> */}
      <div className="mt-2">
        {filteredReviewCommentMasterList && (
          <MaterialTable
            columns={columns}
            data={filteredReviewCommentMasterList}
            isLoading={isLoading?.filteredReviewCommentMasterList}
            reset={reset}
            setReset={setReset}
            exportDataKeys={exportDataKeys}
            muiPaginationProps={{
              rowsPerPageOptions: [10, 30, 50, 100, 200, 500, 1000, 2000]
            }}
          ></MaterialTable>
        )}
        <AddEditReviewCommentMaster
          show={addEditReviewCommentModal?.open}
          type={addEditReviewCommentModal?.type}
          currentReviewCommentData={addEditReviewCommentModal?.data}
          close={(prev) =>
            setAddEditReviewCommentModal({ ...prev, open: false })
          }
          reset={reset}
          setReset={setReset}
        />
      </div>
    </div>
  );
}

export default ReviewCommentMasterComponent;
