import React, { useEffect, useState } from 'react';
import { Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditBranchModal from './AddEditBranchModal';
import { getBranchMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/branchMaster';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';

function BranchMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { branchMasterList, isLading } = useSelector(state => state?.branchMaster);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditBranchModal, setAddEditCandidateModal] = useState({
    type: '',
    data: '',
    open: false,
  });
  const [filteredBranchMasterList, setFilteredBranchMasterList] = useState([]);

  // // static data
  const columns = [
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: 'Action',
      selector: row => (
        <i
          className="icofont-edit cp"
          onClick={() => setAddEditCandidateModal({ type: 'EDIT', data: row, open: true })}
        />
      ),
      sortable: false,
    },
    {
      name: 'Branch Name',
      sortable: true,
      selector: row => row?.location_name || '--',
    },
    {
      name: 'Status',
      selector: row => <StatusBadge status={row?.is_active} />,
      sortable: true,
    },
    {
      name: 'Remark',
      sortable: true,
      selector: row => row?.remark || '--',
      // selector: row =>
      //   row?.remark ? (
      //     <OverlayTrigger
      //       placement="top"
      //       overlay={<Tooltip id={`tooltip-${row.id}`}>{row?.remark}</Tooltip>}
      //     >
      //       <span>{row?.remark || '--'}</span>
      //     </OverlayTrigger>
      //   ) : (
      //     '--'
      //   ),
    },
    {
      name: 'Created At',
      selector: row => row?.created_at || '--',
      sortable: true,
    },
    {
      name: 'Created By',
      selector: row => row?.created_by || '--',
      sortable: true,
    },

    {
      name: 'Updated At',
      selector: row => row?.updated_at || '--',
      sortable: true,
    },
    {
      name: 'Updated By',
      selector: row => row?.updated_by || '--',
      sortable: true,
    },
  ];

  // Function to handle search button click
  const handleSearch = () => {
    const filteredList = branchMasterList.filter(branch => {
      const branchValues = Object.values(branch);
      return branchValues.some(value => {
        return typeof value === 'string' && value.toLowerCase().includes(searchValue.toLowerCase());
      });
    });
    setFilteredBranchMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredBranchMasterList(branchMasterList);
  };

  const transformDataForExport = data => {
    return data.map((row, index) => ({
      'Sr No.': index + 1,
      'Branch Name': row.location_name || '--',
      Status: row.is_active ? 'Active' : 'Inactive',
      'Created At': row.created_at || '--',
      'Created By': row.created_by || '--',
      'Updated At': row.updated_at || '--',
      'Updated By': row.updated_by || '--',
    }));
  };

  // // life cycle
  useEffect(() => {
    dispatch(getBranchMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when branchMasterList changes
  useEffect(() => {
    setFilteredBranchMasterList(branchMasterList);
  }, [branchMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Branch Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditCandidateModal({ type: 'ADD', data: '', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Branch
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
              placeholder="Enter branch name..."
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
              apiData={transformDataForExport(filteredBranchMasterList)}
              fileName="Branch Lists Records"
              disabled={!filteredBranchMasterList.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredBranchMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
        />
      </Container>

      <AddEditBranchModal
        show={addEditBranchModal?.open}
        type={addEditBranchModal?.type}
        currentBranchData={addEditBranchModal?.data}
        close={prev => setAddEditCandidateModal({ ...prev, open: false })}
      />
    </>
  );
}

export default BranchMaster;
