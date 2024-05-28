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
  getKaragirKnockOffWtSizeRangeFilterListThunk,
} from '../../../../redux/services/po/common';
import { getPendingOrderListThunk } from '../../../../redux/services/po/generatePo';
import {
  resetPendingOrderListData,
  addUserPendingOrderRequest,
} from '../../../../redux/slices/po/generatePo';
import { RenderIf } from '../../../../utils';
import { NumbersOnly } from '../../../../components/Utilities/Validation';
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
    karagirKnockOffWtSizeRangeFilterData: { karagir_wt_range, size_range },
    isLoading: { getItemCategoryList, getKaragirKnockOffWtSizeRangeFilterData },
  } = useSelector(state => state?.poCommon);

  const {
    userAddedPoDataList,
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
      selector: (row, index) =>
        row?.open_qty ? (
          <p className="bg-warning px-1">
            {Number(row?.open_qty) - Number(row?.total_po_qty) > 0
              ? Number(row?.open_qty) - Number(row?.total_po_qty)
              : 0}
          </p>
        ) : (
          '---'
        ),
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
            onKeyPress={NumbersOnly}
          />
        </Col>
      ),
    },
  ];

  // // dropdown data
  const categoryData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(itemCategoryList?.map(items => ({
      label: (
        <div className="d-flex" key={Math.random()}>
          <p className="mb-0">{items?.item}</p>
          <i className="icofont-caret-right text-warning fs-5" />
          <p className="mb-0"> {items?.category}</p>
        </div>
      ),
      value: items?.id,
      searchableItem: `${items?.item} ${items?.category}`,
    })) || []),
  ];

  const weightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(karagir_wt_range?.map(items => ({
      label: items?.karagir_wt_range,
      value: items?.karagir_wt_range,
    })) || []),
  ];

  const sizeRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(size_range?.map(items => ({
      label: items?.size_range,
      value: items?.size_range,
    })) || []),
  ];

  const customFilterOption = (option, searchText) => {
    if (!searchText) {
      return true;
    }
    const searchWords = searchText.toLowerCase().split(' ');
    if (option.data && option.data.searchableItem) {
      for (const word of searchWords) {
        if (option.data.searchableItem.toLowerCase().includes(word)) {
          return true;
        }
      }
    }
    return false;
  };

  // Function to handle input change for order quantity
  const handleOrderQuantityChange = (id, value) => {
    setOrderQuantityValues(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handelSave = () => {
    if (Object.keys(orderQuantityValues).length > 0) {
      const allValuesGreaterThanZero = Object.values(orderQuantityValues).every(value => value > 0);
      if (allValuesGreaterThanZero) {
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
        toast.error('Each order quantity should be greater than 0');
      }
    } else {
      toast.error('Please enter order quantity');
    }
  };

  const handelSaveAndAddMore = ({ resetFunc }) => {
    if (Object.keys(orderQuantityValues).length > 0) {
      const allValuesGreaterThanZero = Object.values(orderQuantityValues).every(value => value > 0);
      if (allValuesGreaterThanZero) {
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
        toast.error('Each order quantity should be greater than 0');
      }
    } else {
      toast.error('Please enter order quantity');
    }
  };

  const getItemName = categoryId => itemCategoryList?.find(item => item?.id === categoryId)?.item;
  const geCategoryName = categoryId =>
    itemCategoryList?.find(item => item?.id === categoryId)?.category;

  // // life cycle for category dropdown
  useEffect(() => {
    if (!itemCategoryList?.length) {
      dispatch(getItemCategoryListThunk());
    }
  }, []);

  // // life cycle for weight range and size range dropdown
  useEffect(() => {
    if (filterFormValue?.selectedItemsCategory) {
      dispatch(
        getKaragirKnockOffWtSizeRangeFilterListThunk({
          itemName: getItemName(filterFormValue?.selectedItemsCategory),
          categoryName: geCategoryName(filterFormValue?.selectedItemsCategory),
          type: '',
        }),
      );
    }
  }, [generatePoFilter?.vender_name, filterFormValue?.selectedItemsCategory]);

  // // life cycle for pending order data
  useEffect(() => {
    if (filterFormValue?.selectedItemsCategory) {
      dispatch(
        getPendingOrderListThunk({
          itemName: getItemName(filterFormValue?.selectedItemsCategory),
          categoryName: geCategoryName(filterFormValue?.selectedItemsCategory),
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
        {({ values, resetForm, setFieldValue, dirty }) => {
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
                  filterOption={customFilterOption}
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
                <Row className="align-items-end row_gap_3">
                  <Col md={5}>
                    <Field
                      component={CustomReactSelect}
                      options={weightRangeData}
                      styleData="w-100"
                      label="Weight:"
                      name="selectedWeightRange"
                      placeholder={
                        getKaragirKnockOffWtSizeRangeFilterData ? 'Loading...' : 'Select'
                      }
                      isSearchable
                    />
                  </Col>
                  <Col md={5}>
                    <Field
                      component={CustomReactSelect}
                      options={sizeRangeData}
                      styleData="w-100"
                      label="Size:"
                      name="selectedSizeRange"
                      placeholder={
                        getKaragirKnockOffWtSizeRangeFilterData ? 'Loading...' : 'Select'
                      }
                      isSearchable
                    />
                  </Col>
                  <Col md={2}>
                    <button
                      className="btn btn-info text-white w-100 ms-0 py-md-2"
                      type="button"
                      onClick={() => {
                        setFieldValue('selectedWeightRange', '');
                        setFieldValue('selectedSizeRange', '');
                      }}
                      disabled={!dirty}
                    >
                      <i className="icofont-refresh text-white" /> Reset
                    </button>
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

                <div className="d-flex justify-content-end mt-3 gap-2 btn_container">
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
                  <RenderIf render={userAddedPoDataList?.length}>
                    <button
                      className="btn btn-info text-white px-5"
                      type="button"
                      onClick={() => navigate('preview')}
                    >
                      Preview
                    </button>
                  </RenderIf>
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
