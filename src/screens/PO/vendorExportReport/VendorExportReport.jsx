import React, { useEffect, useReducer } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

// // static import
import {
  CustomReactDatePicker,
  CustomReactSelect,
} from '../../../components/custom/inputs/CustomInputs';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { getVenderListThunk } from '../../../redux/services/po/common';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { getRequisitionHistoryThunk } from '../../../redux/services/po/history';
import './style.scss';

function VendorExportReport() {
  // // initial state
  const dispatch = useDispatch();

  // // local state
  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} },
  );

  // // redux state
  const {
    venderList,
    isLoading: { getVenderList },
  } = useSelector(state => state?.poCommon);
  const {
    requisitionHistoryList,
    requisitionHistoryExportDataList,
    isLoading: { getRequisitionHistoryList, getRequisitionHistoryExportDataList },
  } = useSelector(state => state?.requisitionHistory);

  //  table column data
  const columns = [
    {
      name: 'Order Date',
      selector: row => row?.order_date ?? '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'Delivery Date',
      selector: row => row?.delivery_date ?? '---',
      sortable: false,
      width: '120px',
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
      name: 'Purity',
      selector: row => row?.purity_range ?? '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'karagir Wt Range',
      selector: row => row?.karagir_wt_range ?? '---',
      sortable: true,
      width: '150px',
    },
    {
      name: 'karagir Size Range',
      selector: row => row?.karagir_size_range ?? '---',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Exact Weight',
      selector: row => row?.exact_wt ?? '---',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Order Quantity',
      selector: row => row?.new_qty ?? '---',
      sortable: true,
      width: '140px',
    },
  ];

  // // dropdown data
  const venderData = venderList?.map(item => ({
    label: item?.vendor,
    value: item?.vendor,
  }));

  // // function
  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Order Date': row?.order_date ?? '--',
      'Delivery Date': row?.delivery_date ?? '--',
      Item: row?.item ?? '--',
      Category: row?.category ?? '--',
      Purity: row?.purity_range ?? '--',
      'Karagir Wt Range': row?.karagir_wt_range ?? '--',
      'Karagir Size Range': row?.karagir_size_range ?? '--',
      'Exact Weight': row?.exact_wt ?? '--',
      'Order Quantity': row?.new_qty ?? '--',
    }));
  };

  const handelApplyFilter = ({ formData }) => {
    const formatApiData = {
      vender_name: formData?.vender_name?.length ? formData?.vender_name : '',
      from_order_date: formData?.order_date?.length
        ? formData?.order_date?.[0]
          ? moment(formData?.order_date?.[0])?.format()
          : ''
        : '',
      to_order_date: formData?.order_date?.length
        ? formData?.order_date?.[1]
          ? moment(formData?.order_date?.[1]).format()
          : ''
        : '',
      from_delivery_date: formData?.delivery_date?.length
        ? formData?.delivery_date?.[0]
          ? moment(formData?.delivery_date?.[0]).format()
          : ''
        : '',
      to_delivery_date: formData?.delivery_date?.length
        ? formData?.delivery_date?.[1]
          ? moment(formData?.delivery_date?.[1]).format()
          : ''
        : '',
    };
    setPaginationData({ currentFilterData: formatApiData });
    const apiData = {
      ...formatApiData,
      limit: paginationData.rowPerPage,
      page: paginationData.currentPage,
      type: 'venderExportReport',
    };
    dispatch(getRequisitionHistoryThunk({ filterData: apiData }));
  };

  const handelResetFilter = ({ restFunc }) => {
    dispatch(
      getRequisitionHistoryThunk({
        filterData: {
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          type: 'venderExportReport',
        },
      }),
    );
    setPaginationData({ currentFilterData: {} });
    restFunc();
  };

  const exportDataHandler = () => {
    dispatch(
      getRequisitionHistoryThunk({
        filterData: {
          ...paginationData.currentFilterData,
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          type: 'venderExportReport',
          datatype: 'ALL',
        },
      }),
    );
  };

  // // life cycle
  useEffect(() => {
    if (!venderList?.length) {
      dispatch(getVenderListThunk());
    }
    dispatch(
      getRequisitionHistoryThunk({
        filterData: {
          ...paginationData.currentFilterData,
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          type: 'venderExportReport',
        },
      }),
    );
  }, [paginationData.rowPerPage, paginationData.currentPage]);

  return (
    <Container fluid className="po_vender_export_container">
      <h3 className="fw-bold text_primary "> Vendor Export Report</h3>
      <Stack gap={3}>
        <Formik
          initialValues={{ vender_name: [], order_date: [], delivery_date: [] }}
          enableReinitialize
          onSubmit={values => {
            handelApplyFilter({ formData: values });
          }}
        >
          {({ resetForm, dirty }) => (
            <Form>
              <Row className="align-items-md-end row_gap_3">
                <Col sm={6} md={4} lg={3}>
                  <Field
                    component={CustomReactSelect}
                    options={venderData}
                    name="vender_name"
                    label="Vendor Name :"
                    placeholder={getVenderList ? 'Loading...' : 'Select'}
                    isSearchable
                    isMulti
                  />
                </Col>
                <Col sm={6} md={4} lg={3}>
                  <Field
                    component={CustomReactDatePicker}
                    type="date"
                    name="order_date"
                    label="Order Date :"
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    onKeyDown={e => {
                      e.preventDefault();
                    }}
                    isClearable
                    range
                  />
                </Col>
                <Col sm={6} md={4} lg={3}>
                  <Field
                    component={CustomReactDatePicker}
                    type="date"
                    name="delivery_date"
                    label="Delivery Date :"
                    placeholderText="dd/mm/yyyy"
                    dateFormat="dd/MM/yyy"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    onKeyDown={e => {
                      e.preventDefault();
                    }}
                    isClearable
                    range
                  />
                </Col>
                <Col lg={3} className="d-flex justify-content-md-end btn_container">
                  <button className="btn btn-warning text-white" type="submit" disabled={!dirty}>
                    <i className="icofont-search-1 " /> Search
                  </button>
                  <button
                    className="btn btn-info text-white"
                    type="reset"
                    disabled={!dirty}
                    onClick={() => handelResetFilter({ restFunc: resetForm })}
                  >
                    <i className="icofont-refresh text-white" /> Reset
                  </button>
                  <ExportToExcel
                    className="btn btn-danger"
                    apiData={transformDataForExport(requisitionHistoryExportDataList?.data)}
                    fileName="Vendor export report"
                    disabled={
                      !requisitionHistoryList?.data?.length || getRequisitionHistoryExportDataList
                    }
                    isLoading={getRequisitionHistoryExportDataList}
                    onApiClick={exportDataHandler}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
        <DataTable
          columns={columns}
          data={requisitionHistoryList?.data}
          progressPending={getRequisitionHistoryList}
          progressComponent={<TableLoadingSkelton />}
          pagination
          paginationServer
          paginationTotalRows={requisitionHistoryList?.total_count}
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
  );
}

export default VendorExportReport;
