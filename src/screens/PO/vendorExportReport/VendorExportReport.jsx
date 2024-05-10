import React, { useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

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

  // // redux state
  const {
    venderList,
    isLoading: { getVenderList },
  } = useSelector(state => state?.poCommon);
  const {
    requisitionHistoryList,
    isLoading: { getRequisitionHistoryList },
  } = useSelector(state => state?.requisitionHistory);

  //  table column data
  const columns = [
    {
      name: 'Order Date',
      selector: row => row?.order_date || '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'Delivery Date',
      selector: row => row?.delivery_date || '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'Item',
      selector: row => row?.item || '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'Category',
      selector: row => row?.category || '---',
      sortable: false,
      width: '200px',
    },
    {
      name: 'Purity',
      selector: row => row?.purity_range || '---',
      sortable: false,
      width: '120px',
    },
    {
      name: 'karagir Wt Range',
      selector: row => row?.karagir_wt_range || '---',
      sortable: true,
      width: '150px',
    },
    {
      name: 'karagir Size Range',
      selector: row => row?.karagir_size_range || '---',
      sortable: true,
      width: '150px',
    },
    {
      name: 'Exact Weight',
      selector: row => row?.exact_wt || '---',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Order Quantity',
      selector: row => row?.new_qty || '---',
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
      'Order Date': row?.order_date || '--',
      'Delivery Date': row?.delivery_date || '--',
      Item: row?.item || '--',
      Category: row?.category || '--',
      Karagir: row?.karagir || '--',
      Purity: row?.purity_range || '--',
      'Karagir Wt Range': row?.karagir_wt_range || '--',
      'Karagir Size Range': row?.karagir_size_range || '--',
      'Exact Weight': row?.exact_wt || '--',
      'Order Quantity': row?.new_qty || '--',
    }));
  };

  const handelApplyFilter = ({ formData }) => {
    const apiData = {
      vender_name: formData?.vender_name?.length ? formData?.vender_name : '',
      from_order_date: formData?.order_date?.length ? formData?.order_date?.[0] : '',
      to_order_date: formData?.order_date?.length ? formData?.order_date?.[1] : '',
      from_delivery_date: formData?.delivery_date?.length ? formData?.delivery_date?.[0] : '',
      to_delivery_date: formData?.delivery_date?.length ? formData?.delivery_date?.[0] : '',
    };
    dispatch(getRequisitionHistoryThunk({ filterData: apiData }));
  };

  const handelResetFilter = ({ restFunc }) => {
    dispatch(getRequisitionHistoryThunk({ filterData: '' }));
    restFunc();
  };

  // // life cycle
  useEffect(() => {
    if (!venderList?.length) {
      dispatch(getVenderListThunk());
    }
    dispatch(getRequisitionHistoryThunk({ filterData: '' }));
  }, []);

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
              <Row className="row_gap_3">
                <Col sm={6} lg={3}>
                  <Field
                    component={CustomReactSelect}
                    options={venderData}
                    name="vender_name"
                    label="Vender Name :"
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
                    placeholderText="mm/dd/yyyy"
                    range
                  />
                </Col>
                <Col sm={6} md={4} lg={3}>
                  <Field
                    component={CustomReactDatePicker}
                    type="date"
                    name="delivery_date"
                    label="Delivery Date :"
                    placeholderText="mm/dd/yyyy"
                    range
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3 gap-2">
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
                  apiData={transformDataForExport(requisitionHistoryList)}
                  fileName="Vendor export report"
                  disabled={!requisitionHistoryList?.length}
                />
              </div>
            </Form>
          )}
        </Formik>
        <DataTable
          columns={columns}
          data={requisitionHistoryList}
          progressPending={getRequisitionHistoryList}
          progressComponent={<TableLoadingSkelton />}
        />
      </Stack>
    </Container>
  );
}

export default VendorExportReport;
