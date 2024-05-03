import React, { useState } from 'react';
import { Field, Form, Formik } from 'formik';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import DataTable from 'react-data-table-component';

// // static import
import {
  CustomReactDatePicker,
  CustomReactSelect,
} from '../../../components/custom/inputs/CustomInputs';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import PoOrderQanFilterModal from './PoOrderQanFilterModal';
import './style.scss';

function OrderQuantityReport() {
  // // local state
  const [openPoOrderQanFilterModal, setOpenPoOrderQanFilterModal] = useState(false);

  //  table column data
  const columns = [
    {
      name: 'Order Date',
      selector: row => row?.order_date,
      sortable: false,
      width: '120px',
    },
    {
      name: 'Delivery Date',
      selector: row => row?.delivery_date,
      sortable: false,
      width: '120px',
    },
    {
      name: 'Item',
      selector: row => row?.item,
      sortable: false,
      width: '120px',
    },
    {
      name: 'Category',
      selector: row => row?.category,
      sortable: false,
      width: '120px',
    },
    {
      name: 'Purity',
      selector: row => row?.purity,
      sortable: false,
      width: '120px',
    },
    {
      name: 'karagir Wt Range',
      selector: row => row?.karagirWtRange,
      sortable: true,
      width: '150px',
    },
    {
      name: 'karagir Size Range',
      selector: row => row?.karagirSizeRange,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Exact Weight',
      selector: row => row?.exactWeight,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Order Quantity',
      selector: row => row?.orderQuantity,
      sortable: true,
      width: '140px',
    },
  ];

  const demoTableData = [
    {
      order_date: '2024-05-01',
      delivery_date: '2024-05-10',
      item: 'Item 1',
      category: 'Category A',
      purity: 'High',
      karagirWtRange: '10-20 g',
      karagirSizeRange: '5-10 cm',
      exactWeight: 15,
      orderQuantity: 100,
    },
    {
      order_date: '2024-05-02',
      delivery_date: '2024-05-12',
      item: 'Item 2',
      category: 'Category B',
      purity: 'Medium',
      karagirWtRange: '20-30 g',
      karagirSizeRange: '10-15 cm',
      exactWeight: 25,
      orderQuantity: 150,
    },
    {
      order_date: '2024-05-03',
      delivery_date: '2024-05-15',
      item: 'Item 3',
      category: 'Category C',
      purity: 'Low',
      karagirWtRange: '30-40 g',
      karagirSizeRange: '15-20 cm',
      exactWeight: 35,
      orderQuantity: 200,
    },
  ];

  //  dropdown data
  const venderData = [
    { label: 'Select', value: '' },
    { label: 'vender 1', value: 'vender_1' },
    { label: 'vender 2', value: 'vender_2' },
    { label: 'vender 3', value: 'vender_3' },
    { label: 'vender_3_vender_1_vender_2', value: 'vender_4' },
  ];
  return (
    <>
      <Container fluid className="po_order_quantity_report_container">
        <h3 className="fw-bold text_primary ">Order Quantity Report</h3>
        <Stack gap={3}>
          <Formik
            initialValues={{ vender_name: [], order_date: [] }}
            enableReinitialize
            onSubmit={values => {
              console.log(values);
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
                      placeholder="Select"
                      isSearchable
                      isMulti
                    />
                  </Col>
                  <Col sm={6} md={3} lg={2}>
                    <Field
                      component={CustomReactDatePicker}
                      type="date"
                      name="order_date"
                      label="Order Date :"
                      placeholderText="mm/dd/yyyy"
                      range
                    />
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3 button_container">
                  <button className="btn btn-warning text-white" type="submit" disabled={!dirty}>
                    <i className="icofont-search-1 " /> Search
                  </button>
                  <button
                    className="btn btn-info text-white"
                    type="reset"
                    disabled={!dirty}
                    onClick={resetForm}
                  >
                    <i className="icofont-refresh text-white" /> Reset
                  </button>
                  <ExportToExcel
                    className="btn btn-danger"
                    apiData={[]}
                    fileName="Vendor export report"
                  />
                  <button
                    className="btn btn-sm btn-primary text-white px-3"
                    type="button"
                    onClick={() => setOpenPoOrderQanFilterModal(true)}
                  >
                    <i className="icofont-filter me-1" />
                    Filter
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <DataTable columns={columns} data={demoTableData} />
        </Stack>
      </Container>

      <PoOrderQanFilterModal
        open={openPoOrderQanFilterModal}
        onClose={() => setOpenPoOrderQanFilterModal(false)}
      />
    </>
  );
}

export default OrderQuantityReport;
