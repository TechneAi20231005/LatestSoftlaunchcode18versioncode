import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Col, Container, Row, Spinner, Stack } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import DataTable from 'react-data-table-component';

// // static import
import { REACT_APP_ATTACHMENT_URL } from '../../../config/envConfig';
import {
  getGenerateRequisitionListThunk,
  uploadFileGenerateRequisitionThunk,
} from '../../../redux/services/po/generateRequisition';
import GenerateRequisitionFilterModal from './GenerateRequisitionFilterModal';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import './style.scss';

function GenerateRequisition() {
  // // initial state
  const dispatch = useDispatch();
  const fileRef = useRef();
  const debounceTimeoutRef = useRef(null);

  // // redux state
  const {
    generateRequisitionListData,
    isLoading: { uploadFileGenerateRequisition, generateRequisitionList },
  } = useSelector(state => state?.generateRequisition);

  // // local state
  const [searchValue, setSearchValue] = useState('');
  const [filterModalData, setFilterModalData] = useState({});
  const [openGenerateRequisitionFilterModal, setOpenGenerateRequisitionFilterModal] =
    useState(false);
  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} },
  );

  //  table column data
  const columns = [
    {
      name: 'Sr No.',
      selector: (row, index) =>
        (paginationData.currentPage - 1) * paginationData.rowPerPage + index + 1,
      sortable: false,
      width: '70px',
    },
    {
      name: 'Item',
      selector: row => row?.item ?? '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'Category',
      selector: row => row?.category ?? '---',
      sortable: false,
      width: '200px',
    },

    {
      name: 'Karagir Size Range',
      selector: row => row?.size_range ?? '---',
      sortable: true,
      width: '175px',
    },

    {
      name: filterModalData?.knockoff_karagir === 1 ? 'Karagir Wt Range' : 'Knock Off Wt Range',
      selector: row =>
        filterModalData?.knockoff_karagir === 1
          ? row?.karagir_wt_range ?? '---'
          : row?.knockoff_wt_range ?? '---',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Exact Weight',
      selector: row => row?.exact_wt ?? '---',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Open Pieces ',
      selector: row => row?.open_qty ?? '---',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Purity Range',
      selector: row => row?.purity_range ?? '---',
      sortable: true,
      width: '140px',
    },
    {
      name: 'Total Weight',
      selector: row => row?.total_wt ?? '---',
      sortable: true,
      width: '140px',
    },
  ];

  const handelBulkUpload = e => {
    const file = e.target.files[0];
    const bulkUploadData = new FormData();
    if (file) {
      bulkUploadData.append('po_attachments', file);
      dispatch(
        uploadFileGenerateRequisitionThunk({
          formData: bulkUploadData,
          onSuccessHandler: () => {
            dispatch(
              getGenerateRequisitionListThunk({
                limit: paginationData.rowPerPage,
                page: paginationData.currentPage,
                search: '',
                filterValue: {},
              }),
            );
          },
          onErrorHandler: file => {
            window.open(`${REACT_APP_ATTACHMENT_URL}${file}`)?.focus();
          },
        }),
      );
      fileRef.current.value = null;
    }
  };

  const handelFetchData = () => {
    dispatch(
      getGenerateRequisitionListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage,
        search: searchValue,
        filterValue: filterModalData,
      }),
    );
  };

  const debouncedSearch = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handelFetchData();
    }, 500);
  };

  const handleReset = () => {
    setFilterModalData({});
    setSearchValue('');
  };

  // // life cycle
  useEffect(() => {
    if (searchValue) {
      debouncedSearch();
    } else {
      handelFetchData();
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchValue, filterModalData, paginationData.rowPerPage, paginationData.currentPage]);

  return (
    <>
      <Container fluid>
        <div className="generate_requisition_header">
          <h3 className="fw-bold text_primary"> Generate Requisition</h3>
          <div className="btn_container">
            {uploadFileGenerateRequisition ? (
              <button className="btn btn-dark px-md-5" disabled>
                <Spinner animation="border" size="sm" />{' '}
              </button>
            ) : (
              <label htmlFor="fileUpload" className="btn btn-dark ms-0">
                <i className="icofont-upload-alt me-2 fs-6" />
                Upload Files
              </label>
            )}

            <input
              ref={fileRef}
              type="file"
              id="fileUpload"
              className="d-none"
              onChange={e => handelBulkUpload(e)}
              accept=".csv, .xlsx"
            />
            <a
              href={`${REACT_APP_ATTACHMENT_URL}storage/PORequisition/Generate_Requisition_Upload_Format.xlsx`}
              className="btn btn-dark"
              download
            >
              <i className="icofont-download me-2 fs-6" />
              Bulk Upload Format
            </a>
          </div>
        </div>

        <Stack gap={3}>
          <Row className="row_gap_3">
            <Col xs={12} md={7} xxl={8}>
              <input
                type="search"
                name="search_value"
                value={searchValue}
                onChange={e => setSearchValue(e?.target?.value)}
                placeholder="Search..."
                className="form-control"
              />
            </Col>
            <Col xs={12} md={5} xxl={4} className="d-flex justify-content-sm-end btn_container">
              <button className="btn btn-warning text-white" type="button" disabled={!searchValue}>
                <i className="icofont-search-1 " /> Search
              </button>
              <button
                className="btn btn-info text-white"
                type="button"
                onClick={handleReset}
                disabled={!searchValue && !Object.keys(filterModalData).length}
              >
                <i className="icofont-refresh text-white" /> Reset
              </button>
              <button
                className="btn btn-dark"
                onClick={() => setOpenGenerateRequisitionFilterModal(true)}
              >
                <i className="icofont-filter" /> Filter
              </button>
            </Col>
          </Row>
          <div className="text-end">
            <b className="me-2">
              Total Weight:{' '}
              {generateRequisitionListData?.total?.total_open_wt
                ? parseFloat(Number(generateRequisitionListData?.total?.total_open_wt).toFixed(2))
                : 'N/A'}
            </b>
            <b>
              Open Pieces:{' '}
              {generateRequisitionListData?.total?.total_open > 0
                ? parseFloat(Number(generateRequisitionListData?.total?.total_open).toFixed(2))
                : '0'}
            </b>
          </div>
          <DataTable
            columns={columns}
            data={generateRequisitionListData?.data}
            progressPending={generateRequisitionList}
            progressComponent={<TableLoadingSkelton />}
            pagination
            paginationServer
            paginationTotalRows={generateRequisitionListData?.total?.total_count}
            paginationDefaultPage={paginationData.currentPage}
            onChangePage={page => setPaginationData({ currentPage: page })}
            onChangeRowsPerPage={newPageSize => {
              setPaginationData({ rowPerPage: newPageSize });
              setPaginationData({ currentPage: 1 });
            }}
            paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 200]}
          />
        </Stack>
      </Container>

      <GenerateRequisitionFilterModal
        open={openGenerateRequisitionFilterModal}
        onClose={() => setOpenGenerateRequisitionFilterModal(false)}
        searchValue={searchValue}
        setFilterModalData={setFilterModalData}
        paginationData={paginationData}
        prevFilterModalData={filterModalData}
      />
    </>
  );
}

export default GenerateRequisition;
