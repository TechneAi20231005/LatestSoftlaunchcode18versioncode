import React from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';

// // static improt
import {
  CustomReactDatePicker,
  CustomReactSelect,
} from '../../../components/custom/inputs/CustomInputs';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import './style.scss';
import DataTable from 'react-data-table-component';

function PoHistory() {
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
      name: 'Karagir',
      selector: row => row?.karafir,
      sortable: false,
      width: '175px',
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
      name: 'Knockoff Wt Range',
      selector: row => row?.KnockoffWtRange,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Knockoff Size Range',
      selector: row => row?.KnockoffSizeRange,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Order Quantity',
      selector: row => row?.orderQuantity,
      sortable: true,
      width: '140px',
    },
    {
      name: 'Created At',
      selector: row => row?.createdAt,
      sortable: true,
      width: '175px',
    },
    {
      name: 'Created By',
      selector: row => row?.createdBy,
      sortable: true,
      width: '175px',
    },
  ];

  const demoTableData = [
    {
      order_date: '2024-04-01',
      delivery_date: '2024-04-10',
      karafir: 'Karagir 1',
      item: 'Item 1',
      category: 'Category 1',
      KnockoffWtRange: '10-20',
      KnockoffSizeRange: 'M',
      orderQuantity: 50,
      createdAt: '2024-04-01T10:30:00',
      createdBy: 'User 1',
    },
    {
      order_date: '2024-04-02',
      delivery_date: '2024-04-12',
      karafir: 'Karagir 2',
      item: 'Item 2',
      category: 'Category 2',
      KnockoffWtRange: '20-30',
      KnockoffSizeRange: 'L',
      orderQuantity: 100,
      createdAt: '2024-04-02T11:45:00',
      createdBy: 'User 2',
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
    <Container fluid className="po_history_container">
      <h3 className="fw-bold text_primary "> History</h3>
      <Stack gap={3}>
        <Formik
          initialValues={{ vender_name: [], order_date: [], delivery_date: [] }}
          enableReinitialize
          onSubmit={values => {
            console.log(values);
          }}
        >
          {({ resetForm, dirty }) => (
            <Form>
              <Row className="row_gap_3">
                <Col sm={4} lg={3}>
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
              </Row>
              <div className="d-flex justify-content-end mt-3 gap-2">
                <button className="btn btn-warning text-white" type="submit" disabled={!dirty}>
                  <i className="icofont-search-1 " /> Search
                </button>
                <button
                  className="btn btn-info text-white"
                  type="reset"
                  onClick={resetForm}
                  disabled={!dirty}
                >
                  <i className="icofont-refresh text-white" /> Reset
                </button>
                <ExportToExcel className="btn btn-danger" apiData={[]} fileName="Order History" />
              </div>
            </Form>
          )}
        </Formik>

        <DataTable columns={columns} data={demoTableData} />
      </Stack>
    </Container>
  );
}

export default PoHistory;
