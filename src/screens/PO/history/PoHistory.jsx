import React, { useEffect } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import DataTable from 'react-data-table-component';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import {
  CustomReactDatePicker,
  CustomReactSelect,
} from '../../../components/custom/inputs/CustomInputs';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { getVenderListThunk } from '../../../redux/services/po/common';
import { getRequisitionHistoryThunk } from '../../../redux/services/po/history';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import './style.scss';

function PoHistory() {
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
      name: 'Sr No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px',
    },
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
      name: 'Karagir',
      selector: row => row?.karagir || '---',
      sortable: false,
      width: '200px',
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
      name: 'Knock Off Wt Range',
      selector: row => row?.knockoff_wt_range || '---',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Karagir Size Range',
      selector: row => row?.karagir_size_range || '---',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Purity Range',
      selector: row => row?.purity_range || '---',
      sortable: true,
      width: '140px',
    },
    {
      name: 'Order Quantity',
      selector: row => row?.new_qty || '---',
      sortable: true,
      width: '140px',
    },
    {
      name: 'Created At',
      selector: row => row?.created_at || '---',
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created By',
      selector: row => row?.created_by || '---',
      sortable: true,
      width: '175px',
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
      'Sr No.': index + 1,
      'Order Date': row?.order_date || '--',
      'Delivery Date': row?.delivery_date || '--',
      Karagir: row?.karagir || '--',
      Item: row?.item || '--',
      Category: row?.category || '--',
      'Knock Off Wt Range': row?.knockoff_wt_range || '--',
      'Karagir Size Range': row?.karagir_size_range || '--',
      'Purity Range': row?.purity_range || '--',
      'Order Quantity': row?.new_qty || '--',
      'Created At': row?.created_at || '--',
      'Created By': row?.created_by || '--',
    }));
  };

  const handelApplyFilter = ({ formData }) => {
    const apiData = {
      vender_name: formData?.vender_name?.length ? formData?.vender_name : '',
      from_order_date: formData?.order_date?.length ? formData?.order_date?.[0] : '',
      to_order_date: formData?.order_date?.length ? formData?.order_date?.[1] : '',
      from_delivery_date: formData?.delivery_date?.length ? formData?.delivery_date?.[0] : '',
      to_delivery_date: formData?.delivery_date?.length ? formData?.delivery_date?.[0] : '',
      type: 'history',
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
    <Container fluid className="po_history_container">
      <h3 className="fw-bold text_primary "> History</h3>
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
                    placeholderText="mm/dd/yyyy"
                    label="Delivery Date :"
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
                    onClick={() => handelResetFilter({ restFunc: resetForm })}
                    disabled={!dirty}
                  >
                    <i className="icofont-refresh text-white" /> Reset
                  </button>
                  <ExportToExcel
                    className="btn btn-danger"
                    apiData={transformDataForExport(requisitionHistoryList)}
                    fileName="Order History"
                    disabled={!requisitionHistoryList?.length}
                  />
                </Col>
              </Row>
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

export default PoHistory;
