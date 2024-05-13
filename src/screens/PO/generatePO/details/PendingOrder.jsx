import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Field, Formik } from 'formik';
import { toast } from 'react-toastify';

// // static import
import TableLoadingSkelton from '../../../../components/custom/loader/TableLoadingSkelton';
import { CustomReactSelect } from '../../../../components/custom/inputs/CustomInputs';
import {
  getItemCategoryListThunk,
  getKnockoffWtRangeListThunk,
  getSizeRangeListThunk,
} from '../../../../redux/services/po/common';
import { getPendingOrderListThunk } from '../../../../redux/services/po/generatePo';
import {
  resetPendingOrderListData,
  addUserPendingOrderRequest,
} from '../../../../redux/slices/po/generatePo';
import { RenderIf } from '../../../../utils';
import './style.scss';

function PendingOrder() {
  // // initial state
  const navigate = useNavigate();
  const {
    state: { generatePoFilter },
  } = useLocation();
  const dispatch = useDispatch();

  // // local state
  const [toggleFilter, setToggleFilter] = useState(false);
  const [filterFormValue, setFilterFormValue] = useState('');
  const [orderQuantityValues, setOrderQuantityValues] = useState({});

  // // redux state
  const {
    itemCategoryList,
    knockoffWtRangeList,
    sizeRangeList,
    isLoading: { getItemCategoryList, getKnockoffWtRangeList, getSizeRangeList },
  } = useSelector(state => state?.poCommon);

  const {
    pendingOrderList,
    isLoading: { getPendingOrderList },
  } = useSelector(state => state?.generatePo);

  //  table column data
  const columns = [
    {
      name: 'Knockoff Wt Range',
      selector: (row, index) => row?.knockoff_wt_range || '---',
      sortable: false,
    },
    {
      name: 'Karagir Size Range',
      selector: (row, index) => row?.karagir_size_range || '---',
      sortable: false,
    },
    {
      name: 'Exact Wt',
      selector: (row, index) => row?.exact_wt || '---',
      sortable: false,
    },
    {
      name: 'Pending Quantity',
      selector: (row, index) => row?.open_qty || '---',
      sortable: false,
    },
    {
      name: 'Order Quantity',
      selector: 'order_quantity',
      sortable: false,
      cell: row => (
        <Col>
          <input
            type="number"
            value={orderQuantityValues[row.id] || ''}
            onChange={e => handleOrderQuantityChange(row.id, e.target.value)}
            className="form-control w-100"
          />
        </Col>
      ),
    },
  ];

  // // dropdown data
  const categoryData = [
    { label: 'Select', value: '', isDisabled: true },
    ...itemCategoryList?.map(items => ({
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
    })),
  ];

  const weightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...knockoffWtRangeList?.map(items => ({
      label: items?.knockoff_wt_range,
      value: items?.knockoff_wt_range,
    })),
  ];

  const sizeRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...sizeRangeList?.map(items => ({
      label: items?.size_range,
      value: items?.size_range,
    })),
  ];

  // Function to handle input change for order quantity
  const handleOrderQuantityChange = (id, value) => {
    setOrderQuantityValues(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handelSave = () => {
    if (Object.keys(orderQuantityValues).length > 0) {
      dispatch(
        addUserPendingOrderRequest({
          orderQtyData: orderQuantityValues,
          vender_name: generatePoFilter?.vender_name,
          delivery_date: generatePoFilter?.delivery_date,
        }),
      );
      navigate('preview');
      setOrderQuantityValues({});
    } else {
      toast.error('Please enter order quantity');
    }
  };

  const handelSaveAndAddMore = ({ resetFunc }) => {
    if (Object.keys(orderQuantityValues).length > 0) {
      dispatch(
        addUserPendingOrderRequest({
          orderQtyData: orderQuantityValues,
          vender_name: generatePoFilter?.vender_name,
          delivery_date: generatePoFilter?.delivery_date,
        }),
      );
      dispatch(resetPendingOrderListData());
      resetFunc();
      setToggleFilter(false);
      setOrderQuantityValues({});
    } else {
      toast.error('Please enter order quantity');
    }
  };

  // // life cycle for category dropdown
  useEffect(() => {
    if (!itemCategoryList?.length) {
      dispatch(getItemCategoryListThunk());
    }
  }, []);

  // // life cycle for weight range dropdown
  useEffect(() => {
    if (filterFormValue?.selectedItemsCategory) {
      dispatch(
        getKnockoffWtRangeListThunk({
          categoryName: itemCategoryList?.find(
            item => item?.category === filterFormValue?.selectedItemsCategory,
          )?.item,
          itemName: filterFormValue?.selectedItemsCategory,
        }),
      );
    }
  }, [generatePoFilter?.vender_name, filterFormValue?.selectedItemsCategory]);

  // // life cycle for size range dropdown
  useEffect(() => {
    if (filterFormValue?.selectedItemsCategory && filterFormValue?.selectedWeightRange) {
      dispatch(
        getSizeRangeListThunk({
          categoryName: itemCategoryList?.find(
            item => item?.category === filterFormValue?.selectedItemsCategory,
          )?.item,
          itemName: filterFormValue?.selectedItemsCategory,
          weightRange: filterFormValue?.selectedWeightRange,
        }),
      );
    }
  }, [
    generatePoFilter?.vender_name,
    filterFormValue?.selectedItemsCategory,
    filterFormValue?.selectedWeightRange,
  ]);

  // // life cycle for pending order data
  useEffect(() => {
    if (filterFormValue?.selectedItemsCategory) {
      dispatch(
        getPendingOrderListThunk({
          categoryName: itemCategoryList?.find(
            item => item?.category === filterFormValue?.selectedItemsCategory,
          )?.item,
          itemName: filterFormValue?.selectedItemsCategory,
          weightRange: filterFormValue?.selectedWeightRange,
          sizeRange: filterFormValue?.selectedSizeRange,
        }),
      );
    }
  }, [
    filterFormValue?.selectedItemsCategory,
    filterFormValue?.selectedWeightRange,
    filterFormValue?.selectedSizeRange,
  ]);

  return (
    <Container fluid className="pending_order_container">
      <h3 className="fw-bold text_primary"> PO</h3>
      <div className="d-flex fw-bold mb-2">
        <p className="mb-0">Item</p>
        <i className="icofont-caret-right text-warning fs-5" />
        <p className="mb-0"> Category :</p>
      </div>
      <Formik
        initialValues={{
          selectedItemsCategory: '',
          selectedSizeRange: '',
          selectedWeightRange: '',
        }}
      >
        {({ values, resetForm }) => {
          setFilterFormValue(values);
          return (
            <Stack gap={3}>
              <div className="d-flex w-100">
                <Field
                  component={CustomReactSelect}
                  options={categoryData}
                  styleData="w-100"
                  name="selectedItemsCategory"
                  withOutLabel
                  placeholder={getItemCategoryList ? 'Loading...' : 'Select'}
                  isSearchable
                />
                <button
                  className="btn btn-warning text-white"
                  onClick={() => setToggleFilter(!toggleFilter)}
                  disabled={!values?.selectedItemsCategory}
                >
                  <i className="icofont-filter" />
                </button>
              </div>

              <RenderIf render={toggleFilter}>
                <Row>
                  <Col>
                    <Field
                      component={CustomReactSelect}
                      options={weightRangeData}
                      styleData="w-100"
                      label="Weight:"
                      name="selectedWeightRange"
                      placeholder={getKnockoffWtRangeList ? 'Loading...' : 'Select'}
                      isSearchable
                    />
                  </Col>
                  <Col>
                    <Field
                      component={CustomReactSelect}
                      options={sizeRangeData}
                      styleData="w-100"
                      label="Size:"
                      name="selectedSizeRange"
                      placeholder={getSizeRangeList ? 'Loading...' : 'Select'}
                      isSearchable
                      disabled={!values?.selectedWeightRange}
                    />
                  </Col>
                </Row>
              </RenderIf>

              <RenderIf render={filterFormValue?.selectedItemsCategory}>
                <DataTable
                  columns={columns}
                  data={pendingOrderList}
                  progressPending={getPendingOrderList}
                  progressComponent={<TableLoadingSkelton />}
                />

                <div className="d-flex justify-content-end mt-3 gap-2">
                  <button
                    className="btn btn-dark"
                    type="button"
                    onClick={() => handelSaveAndAddMore({ resetFunc: resetForm })}
                  >
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
              </RenderIf>
            </Stack>
          );
        }}
      </Formik>
    </Container>
  );
}

export default PendingOrder;
