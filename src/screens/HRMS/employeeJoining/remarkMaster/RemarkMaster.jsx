import React, { useEffect, useState } from 'react';
import { Col, Container, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditRemarkModal from './AddEditRemarkModal';
import { getRemarkMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/remarkMaster';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import { customSearchHandler } from '../../../../utils/customFunction';

function RemarkMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { remarkMasterList, isLoading } = useSelector(state => state?.remarkMaster);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditRemarkModal, setAddEditRemarkModal] = useState({
    type: '',
    data: '',
    open: false,
  });
  const [filteredRemarkMasterList, setFilteredRemarkMasterList] = useState([]);

  // // static data
  const columns = [
    {
      name: 'Action',
      selector: row => (
        <i
          className="icofont-edit text-primary cp"
          onClick={() => setAddEditRemarkModal({ type: 'EDIT', data: row, open: true })}
        />
      ),
      sortable: false,
      width: '70px',
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Remark Description',
      sortable: true,
      selector: row =>
        row?.remark_description ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark_description}</Tooltip>}
          >
            <span>{row?.remark_description || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      width: '200px',
    },
    {
      name: 'Supporting Remark',
      sortable: true,
      selector: row =>
        row?.remark ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark}</Tooltip>}
          >
            <span>{row?.remark || '--'}</span>
          </OverlayTrigger>
        ) : (
          '--'
        ),
      width: '300px',
    },
    {
      name: 'Status',
      selector: row => <StatusBadge status={row?.is_active} />,
      sortable: true,
      width: '120px',
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
    const filteredList = customSearchHandler(remarkMasterList, searchValue);
    setFilteredRemarkMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredRemarkMasterList(remarkMasterList);
  };

  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Remark Description': row?.remark_description || '--',
      'Supporting Remark': row?.remark || '--',
      Status: row?.is_active ? 'Active' : 'Deactive',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
      'Updated At': row?.updated_at || '--',
      'Updated By': row?.updated_by || '--',
    }));
  };

  // // life cycle
  useEffect(() => {
    dispatch(getRemarkMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when remarkMasterList changes
  useEffect(() => {
    setFilteredRemarkMasterList(remarkMasterList);
  }, [remarkMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Remark Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditRemarkModal({ type: 'ADD', data: '', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Remark
              </button>
            );
          }}
        />
        <Row className="row_gap_3">
          <Col xs={12} md={7} xxl={8}>
            <input
              type="search"
              name="interview_search"
              value={searchValue}
              onChange={e => setSearchValue(e?.target?.value)}
              placeholder="Enter remark name..."
              className="form-control"
            />
          </Col>
          <Col xs={12} md={5} xxl={4} className="d-flex justify-content-sm-end btn_container">
            <button className="btn btn-warning text-white" type="button" onClick={handleSearch}>
              <i className="icofont-search-1 " /> Search
            </button>
            <button className="btn btn-info text-white" type="button" onClick={handleReset}>
              <i className="icofont-refresh text-white" /> Reset
            </button>
            <ExportToExcel
              className="btn btn-danger"
              apiData={transformDataForExport(filteredRemarkMasterList)}
              fileName="Remark Lists Records"
              disabled={!filteredRemarkMasterList?.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredRemarkMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getRemarkMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>

      <AddEditRemarkModal
        show={addEditRemarkModal?.open}
        type={addEditRemarkModal?.type}
        currentRemarkData={addEditRemarkModal?.data}
        close={prev => setAddEditRemarkModal({ ...prev, open: false })}
      />
    </>
  );
}

export default RemarkMaster;
