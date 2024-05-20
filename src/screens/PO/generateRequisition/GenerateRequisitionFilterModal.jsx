import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomModal from '../../../components/custom/modal/CustomModal';
import { CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import {
  getItemCategoryListThunk,
  getKnockoffWtRangeListThunk,
} from '../../../redux/services/po/common';
import { RenderIf } from '../../../utils';
import { getGenerateRequisitionListThunk } from '../../../redux/services/po/generateRequisition';

function GenerateRequisitionFilterModal({
  open,
  onClose,
  searchValue,
  setFilterModalData,
  paginationData,
  prevFilterModalData,
}) {
  // // initial state
  const dispatch = useDispatch();

  const filterInitialValue = {
    knockoff_karagir: prevFilterModalData?.knockoff_karagir ?? 0,
    item: prevFilterModalData?.item ?? [],
    category: prevFilterModalData?.category ?? [],
    weight_range: prevFilterModalData?.weight_range ?? [],
    size_range: prevFilterModalData?.size_range ?? [],
  };
  // // redux state
  const {
    itemCategoryList,
    knockoffWtRangeList,
    isLoading: { getItemCategoryList, getKnockoffWtRangeList },
  } = useSelector(state => state?.poCommon);

  // // dropdown data
  const viewForOption = [
    {
      label: 'Knock Off WT Range',
      value: 0,
    },
    {
      label: 'Karagir WT Range',
      value: 1,
    },
  ];
  const itemOptionData = [
    { label: 'Select', value: '', isDisabled: true },
    ...itemCategoryList?.map(items => ({
      label: items?.item,
      value: items?.item,
    })),
  ];

  const categoryOptionData = [
    { label: 'Select', value: '', isDisabled: true },
    ...itemCategoryList?.map(items => ({
      label: items?.category,
      value: items?.category,
    })),
  ];

  const knockOffWeightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(knockoffWtRangeList?.knockoff_wt_range?.map(items => ({
      label: items,
      value: items,
    })) || []),
  ];

  const karagirWeightRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(knockoffWtRangeList?.karagir_wt_range?.map(items => ({
      label: items,
      value: items,
    })) || []),
  ];

  const sizeRangeData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(knockoffWtRangeList?.size_range?.map(items => ({
      label: items,
      value: items,
    })) || []),
  ];

  const handleSearch = values => {
    setFilterModalData(values);
    onClose();
    if (
      values?.item?.length ||
      values?.category?.length ||
      values?.weight_range?.length ||
      values?.size_range?.length
    ) {
      dispatch(
        getGenerateRequisitionListThunk({
          limit: paginationData.rowPerPage,
          page: paginationData.currentPage,
          search: searchValue,
          filterValue: values,
        }),
      );
    }
  };

  const handleReset = ({ restFun }) => {
    restFun();
    dispatch(
      getGenerateRequisitionListThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage,
        search: searchValue,
        filterValue: {},
      }),
    );
    onClose();
  };

  // // life cycle for category dropdown, weight range ans size range dropdown
  useEffect(() => {
    if (open) {
      if (!itemCategoryList?.length) {
        dispatch(getItemCategoryListThunk());
        dispatch(
          getKnockoffWtRangeListThunk({ categoryName: '', itemName: '', type: 'filterData' }),
        );
      }
    }
  }, [open]);

  return (
    <CustomModal show={open} title="All Basket" width="md" onClose={onClose}>
      <Formik
        initialValues={filterInitialValue}
        enableReinitialize
        onSubmit={values => {
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
                  isMulti
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
                    placeholder={getKnockoffWtRangeList ? 'Loading...' : 'Select'}
                    disabled={getKnockoffWtRangeList}
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
                    placeholder={getKnockoffWtRangeList ? 'Loading...' : 'Select'}
                    disabled={getKnockoffWtRangeList}
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
                  placeholder={getKnockoffWtRangeList ? 'Loading...' : 'Select'}
                  disabled={getKnockoffWtRangeList}
                  isSearchable
                  isMulti
                />
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-3 gap-2">
              <button
                className="btn btn-info text-white"
                type="reset"
                disabled={!dirty}
                onClick={() => handleReset({ restFun: resetForm })}
              >
                <i className="icofont-refresh text-white" /> Reset
              </button>
              <button className="btn btn-warning text-white" type="submit" disabled={!dirty}>
                <i className="icofont-search-1 " /> Search
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
}

export default GenerateRequisitionFilterModal;
