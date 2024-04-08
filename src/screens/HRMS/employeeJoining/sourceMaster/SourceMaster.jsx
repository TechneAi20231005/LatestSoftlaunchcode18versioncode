import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import { ExportToExcel } from '../../../../components/Utilities/Table/ExportToExcel';
import AddEditSourceModal from './AddEditSourceModal';
import StatusBadge from '../../../../components/custom/Badges/StatusBadge';
import { getSourceMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/sourceMaster';
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import { customSearchHandler } from '../../../../utils/customFunction';

function SourceMaster() {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const { sourceMasterList, isLoading } = useSelector(state => state?.sourceMaster);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [addEditSourceModal, setAddEditSourceModal] = useState({
    type: '',
    data: '',
    open: false,
  });
  const [filteredSourceMasterList, setFilteredSourceMasterList] = useState([]);

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
          className="icofont-edit text-primary cp"
          onClick={() => setAddEditSourceModal({ type: 'EDIT', data: row, open: true })}
        />
      ),
      sortable: false,
    },

    {
      name: 'Source Name',
      sortable: true,
      selector: row => row?.source_name || '--',
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
    const filteredList = customSearchHandler(sourceMasterList, searchValue);
    setFilteredSourceMasterList(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchValue('');
    setFilteredSourceMasterList(sourceMasterList);
  };

  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Sr No.': index + 1,
      'Source Name': row?.source_name || '--',
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
    dispatch(getSourceMasterListThunk());
  }, []);

  // Update the useEffect to update the filtered list when sourceMasterList changes
  useEffect(() => {
    setFilteredSourceMasterList(sourceMasterList);
  }, [sourceMasterList]);

  // Function to handle search onchange
  useEffect(() => {
    handleSearch();
  }, [searchValue]);

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Source Master"
          renderRight={() => {
            return (
              <button
                className="btn btn-dark px-5"
                onClick={() => setAddEditSourceModal({ type: 'ADD', data: '', open: true })}
              >
                <i className="icofont-plus me-2 fs-6" />
                Add Source
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
              placeholder="Enter source name..."
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
              apiData={transformDataForExport(filteredSourceMasterList)}
              fileName="Source Lists Records"
              disabled={!filteredSourceMasterList?.length}
            />
          </Col>
        </Row>
        <DataTable
          columns={columns}
          data={filteredSourceMasterList}
          defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          progressPending={isLoading?.getSourceMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Container>

      <AddEditSourceModal
        show={addEditSourceModal?.open}
        type={addEditSourceModal?.type}
        currentSourceData={addEditSourceModal?.data}
        close={prev => setAddEditSourceModal({ ...prev, open: false })}
      />
    </>
  );
}

export default SourceMaster;
