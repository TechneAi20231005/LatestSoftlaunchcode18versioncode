import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomModal from '../../../components/custom/modal/CustomModal';
import { CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import {
  getItemCategoryListThunk,
  getKaragirKnockOffWtSizeRangeFilterListThunk
} from '../../../redux/services/po/common';
import { getGenerateRequisitionListThunk } from '../../../redux/services/po/generateRequisition';
import { RenderIf } from '../../../utils';

function GenerateRequisitionFilterModal({
  open,
  onClose,
  searchValue,
  setFilterModalData,
  paginationData,
  prevFilterModalData
}) {
  // // initial state
  const dispatch = useDispatch();

  const filterInitialValue = {
    knockoff_karagir: prevFilterModalData?.knockoff_karagir ?? 0,
    item: prevFilterModalData?.item ?? '',
    category: prevFilterModalData?.category ?? [],
    weight_range: prevFilterModalData?.weight_range ?? [],
    size_range: prevFilterModalData?.size_range ?? []
  };
  // // redux state
  const {
    itemCategoryList,
    karagirKnockOffWtSizeRangeFilterData: {
      karagir_wt_range,
      knockoff_wt_range,
      size_range
    },
    isLoading: { getItemCategoryList, getKaragirKnockOffWtSizeRangeFilterData }
  } = useSelector((state) => state?.poCommon);

  // // local state
  const [selectedItem, setSelectedItem] = useState('');
  const [categoryOptionData, setCategoryOptionData] = useState([]);

  // // dropdown data
  const viewForOption = [
    {
      label: 'Knock Off WT Range',
      value: 0
    },
    {
      label: 'Karagir WT Range',
      value: 1
    }
  ];

  const uniqueItems = [...new Set(itemCategoryList?.map((item) => item.item))];

  const itemOptionData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(uniqueItems?.map((item) => ({
      label: item,
      value: item
    })) || [])
  ];

  const knockOffWeightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(knockoff_wt_range?.map((items) => ({
      label: items,
      value: items
    })) || [])
  ];

  const karagirWeightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(karagir_wt_range?.map((items) => ({
      label: items,
      value: items
    })) || [])
  ];

  const sizeRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(size_range?.map((items) => ({
      label: items,
      value: items
    })) || [])
  ];

  const handleSearch = (values) => {
    setFilterModalData(values);
    onClose();
  };

  const handleReset = ({ restFun }) => {
    restFun();
    setFilterModalData({});
    dispatch(
      getGenerateRequisitionListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage,
        search: searchValue,
        filterValue: {}
      })
    );
    onClose();
  };

  // // Filter categories based on selected item
  useEffect(() => {
    if (selectedItem) {
      const filteredCategories = itemCategoryList
        .filter((item) => item.item === selectedItem)
        .map((item) => ({
          label: item.category,
          value: item.category
        }));
      setCategoryOptionData([
        { label: 'Select', value: '', isDisabled: true },
        ...filteredCategories
      ]);
    }
  }, [selectedItem, itemCategoryList]);

  // // life cycle for category dropdown, weight range ans size range dropdown
  useEffect(() => {
    if (open) {
      if (!itemCategoryList?.length) {
        dispatch(getItemCategoryListThunk());
      }
      if (
        !karagir_wt_range?.length ||
        !knockoff_wt_range?.length ||
        !size_range?.length
      ) {
        dispatch(
          getKaragirKnockOffWtSizeRangeFilterListThunk({
            itemName: '',
            categoryName: '',
            type: 'filterData'
          })
        );
      }
    }
  }, [open]);

  return (
    <CustomModal show={open} title="All Basket" width="md" onClose={onClose}>
      <Formik
        initialValues={filterInitialValue}
        enableReinitialize
        onSubmit={(values) => {
          handleSearch(values);
        }}
      >
        {({ values, resetForm, dirty }) => (
          <Form>
            <Row className="row_gap_3">
              <Col md={12}>
                <Field
                  component={CustomReactSelect}
                  options={viewForOption}
                  styleData="w-100"
                  name="knockoff_karagir"
                  label="View For"
                  placeholder="Select"
                />
              </Col>
              <Col md={6}>
                <Field
                  component={CustomReactSelect}
                  options={itemOptionData}
                  styleData="w-100"
                  name="item"
                  label="Select Item"
                  placeholder={getItemCategoryList ? 'Loading...' : 'Select'}
                  disabled={getItemCategoryList}
                  isSearchable
                  handleChange={(e) => setSelectedItem(e?.value)}
                />
              </Col>
              <Col md={6}>
                <Field
                  component={CustomReactSelect}
                  options={categoryOptionData}
                  styleData="w-100"
                  name="category"
                  label="Select Category"
                  placeholder={getItemCategoryList ? 'Loading...' : 'Select'}
                  isSearchable
                  isMulti
                />
              </Col>
              <Col md={6}>
                <RenderIf render={values.knockoff_karagir === 0}>
                  <Field
                    component={CustomReactSelect}
                    options={knockOffWeightRangeData}
                    styleData="w-100"
                    name="weight_range"
                    label="Knock Off Weight Range"
                    placeholder={
                      getKaragirKnockOffWtSizeRangeFilterData
                        ? 'Loading...'
                        : 'Select'
                    }
                    disabled={getKaragirKnockOffWtSizeRangeFilterData}
                    isSearchable
                    isMulti
                  />
                </RenderIf>
                <RenderIf render={values.knockoff_karagir === 1}>
                  <Field
                    component={CustomReactSelect}
                    options={karagirWeightRangeData}
                    styleData="w-100"
                    name="weight_range"
                    label="Karagir Weight Range"
                    placeholder={
                      getKaragirKnockOffWtSizeRangeFilterData
                        ? 'Loading...'
                        : 'Select'
                    }
                    disabled={getKaragirKnockOffWtSizeRangeFilterData}
                    isSearchable
                    isMulti
                  />
                </RenderIf>
              </Col>
              <Col md={6}>
                <Field
                  component={CustomReactSelect}
                  options={sizeRangeData}
                  styleData="w-100"
                  name="size_range"
                  label="Karagir Size Range"
                  placeholder={
                    getKaragirKnockOffWtSizeRangeFilterData
                      ? 'Loading...'
                      : 'Select'
                  }
                  disabled={getKaragirKnockOffWtSizeRangeFilterData}
                  isSearchable
                  isMulti
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-warning text-white"
                type="submit"
                disabled={!dirty}
              >
                <i className="icofont-search-1 " /> Search
              </button>
              <button
                className="btn btn-info text-white"
                type="reset"
                disabled={!dirty && !Object.keys(prevFilterModalData).length}
                onClick={() => handleReset({ restFun: resetForm })}
              >
                <i className="icofont-refresh text-white" /> Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default GenerateRequisitionFilterModal;
