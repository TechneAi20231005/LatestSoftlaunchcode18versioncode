import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import ReactSelect from 'react-select';
import DataTable from 'react-data-table-component';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// // static import
import { RenderIf } from '../../../../utils';
import { getItemCategoryListThunk } from '../../../../redux/services/po/common';
import './style.scss';
import { Formik } from 'formik';

function PendingOrder() {
  // // initial state
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  console.log(location);

  // // local state
  const [toggleFilter, setToggleFilter] = useState(false);
  const [orderQuantityInputs, setOrderQuantityInputs] = useState({});

  // // redux state
  const {
    itemCategoryList,
    isLoading: { getItemCategoryList },
  } = useSelector(state => state?.poCommon);

  //  table column data
  const columns = [
    {
      name: 'Knockoff Wt Range',
      selector: (row, index) => row?.KnockoffWtRange,
      sortable: false,
    },
    {
      name: 'Knockoff Size Range',
      selector: (row, index) => row?.KnockoffSizeRange,
      sortable: false,
    },
    {
      name: 'Exact Wt',
      selector: (row, index) => row?.exactWt,
      sortable: false,
    },
    {
      name: 'Pending Quantity',
      selector: (row, index) => row?.pendingQuantity,
      sortable: false,
    },
    {
      name: 'Order Quantity',
      selector: 'orderQuantity',
      sortable: false,
      cell: row => (
        <Col>
          <input
            type="number"
            value={orderQuantityInputs[row.id] || ''}
            onChange={e => handleOrderQuantityChange(row.id, e.target.value)}
            className="form-control w-100"
          />
        </Col>
      ),
    },
  ];

  const demoTableData = [
    {
      id: 1,
      KnockoffWtRange: '10-20',
      KnockoffSizeRange: 'Small',
      exactWt: 15,
      pendingQuantity: 5,
    },
    {
      id: 2,
      KnockoffWtRange: '20-30',
      KnockoffSizeRange: 'Medium',
      exactWt: 25,
      pendingQuantity: 10,
    },
    {
      id: 3,
      KnockoffWtRange: '30-40',
      KnockoffSizeRange: 'Large',
      exactWt: 35,
      pendingQuantity: 15,
    },
  ];

  // // dropdown data
  const categoryData = itemCategoryList?.map(items => ({
    label: (
      <>
        <div className="d-flex">
          <p className="mb-0">{items?.item}</p>
          <i className="icofont-caret-right text-warning fs-5" />
          <p className="mb-0"> {items?.category}</p>
        </div>
      </>
    ),
    value: items?.category,
  }));

  // Function to handle input change for order quantity
  const handleOrderQuantityChange = (id, value) => {
    setOrderQuantityInputs(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handelSave = () => {
    navigate('preview');
  };

  // // life cycle
  useEffect(() => {
    dispatch(getItemCategoryListThunk());
  }, []);

  return (
    <Container fluid className="pending_order_container">
      <h3 className="fw-bold text_primary"> PO</h3>
      <div className="d-flex fw-bold mb-2">
        <p className="mb-0">Item</p>
        <i className="icofont-caret-right text-warning fs-5" />
        <p className="mb-0"> Category :</p>
      </div>
      <Formik initialValues={{ vender_name: '', delivery_date: '' }}>
        {() => (
          <Stack gap={3}>
            <div className="d-flex w-100">
              <ReactSelect
                className="w-100"
                options={categoryData}
                placeholder={getItemCategoryList ? 'Loading...' : 'Select...'}
                isSearchable
              />
              <button
                className="btn btn-warning text-white"
                onClick={() => setToggleFilter(!toggleFilter)}
              >
                <i className="icofont-filter" />
              </button>
            </div>

            <RenderIf render={toggleFilter}>
              <Row>
                <Col>
                  <label>Weight:</label>
                  <ReactSelect className="w-100" options={[]} placeholder="Select.." />
                </Col>
                <Col>
                  <label>Size:</label>
                  <ReactSelect className="w-100" options={[]} placeholder="Select.." />
                </Col>
              </Row>
            </RenderIf>

            <DataTable columns={columns} data={demoTableData} />

            <div className="d-flex justify-content-end mt-3 gap-2">
              <button className="btn btn-dark" type="button">
                Save & Add More
              </button>
              <button
                className="btn btn-warning text-white px-5"
                type="button"
                onClick={handelSave}
              >
                Save
              </button>
            </div>
          </Stack>
        )}
      </Formik>
    </Container>
  );
}

export default PendingOrder;
