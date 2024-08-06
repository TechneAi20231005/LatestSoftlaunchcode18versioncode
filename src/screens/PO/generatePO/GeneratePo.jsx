import React, { useCallback, useEffect, useState } from 'react';
import { Col, Collapse, Container, Row, Spinner, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

// // static import
import {
  CustomInput,
  CustomReactSelect
} from '../../../components/custom/inputs/CustomInputs';
import {
  generatePoErrorFileValidation,
  generatePoFilterValidation
} from '../validation/generatePoFilter';
import { getVenderListThunk } from '../../../redux/services/po/common';
import { resetUserAddedOrderList } from '../../../redux/slices/po/generatePo';
import { getRequisitionHistoryThunk } from '../../../redux/services/po/history';
import {
  getPendingOrderErrorFileThunk,
  getUnixCodeAgainstVendorForErrorFileThunk
} from '../../../redux/services/po/generatePo';
// // // it use in feature
// import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
// import { poBulkUploadFileExportBeCheckThunk } from '../../../redux/services/po/generatePo';
import { exportToExcelCustomHandler } from '../../../utils/customFunction';

import './style.scss';

function GeneratePo() {
  // // initial state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // redux state
  const {
    venderList,
    isLoading: { getVenderList }
  } = useSelector((state) => state?.poCommon);
  // // // it use in feature
  // const {
  //   requisitionHistoryList,
  //   isLoading: { getRequisitionHistoryList }
  // } = useSelector((state) => state?.requisitionHistory);
  const {
    unixCodeListAgainstVendor,
    pendingOrderErrorFileData,
    isLoading: { getUnixCodeAgainstVendor, getPendingOrderErrorFileData }
  } = useSelector((state) => state?.generatePo);

  // // local state
  const [openPoErrorFileForm, setOpenPoErrorFileForm] = useState(false);
  const [poErrorFileFormFormData, setPoErrorFileFormFormData] = useState({});

  // // dropdown data
  const venderData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(venderList?.map((item) => ({
      label: item?.vendor,
      value: item?.vendor
    })) || [])
  ];
  const venderUnixCode = [
    { label: 'Select', value: '', isDisabled: true },
    ...(unixCodeListAgainstVendor?.map((item) => ({
      label: moment(+item?.unix_code).format('DD-MM-YYYY, hh:mm:ss A'),
      value: item?.unix_code
    })) || [])
  ];

  // // function
  // const transformDataForExport = (data) => {
  //   return data?.map((row) => ({
  //     'Delivery Date': row?.delivery_date ?? '--',
  //     'Order Date': row?.order_date ?? '--',
  //     'Karagir 1': row?.karagir ?? '--',
  //     Item: row?.item ?? '--',
  //     Category: row?.category ?? '--',
  //     'Exact Wt': row?.exact_wt ?? '--',
  //     'Weight Range': row?.weight_range ?? '--',
  //     'Size Range': row?.size_range ?? '--',
  //     'Purity Range': row?.purity_range ?? '--',
  //     'New Order': row?.new_qty ?? '--',
  //     'Karagir Wt Range': row?.karagir_wt_range ?? '--',
  //     'Knockoff Wt Range': row?.knockoff_wt_range ?? '--',
  //     'Karagir Size Range': row?.karagir_size_range ?? '--'
  //   }));
  // };

  const transformPoErrorDataForExport = useCallback(() => {
    const errorFileData = pendingOrderErrorFileData?.map((row) => ({
      'Delivery Date': row?.delivery_date ?? '--',
      'Order Date': row?.order_date ?? '--',
      'Karagir 1': row?.karagir ?? '--',
      Item: row?.item ?? '--',
      Category: row?.category ?? '--',
      'Exact Wt': row?.exact_wt ?? '--',
      'Weight Range': row?.weight_range ?? '--',
      'Size Range': row?.size_range ?? '--',
      'Purity Range': row?.purity_range ?? '--',
      'New Order': row?.new_qty ?? '--',
      'Karagir Wt Range': row?.karagir_wt_range ?? '--',
      'Knockoff Wt Range': row?.knockoff_wt_range ?? '--',
      'Karagir Size Range': row?.karagir_size_range ?? '--',
      Remark: row?.remark ?? '--'
    }));
    return exportToExcelCustomHandler({
      data: errorFileData,
      fileName: 'PO Error File Records'
    });
  }, [pendingOrderErrorFileData]);

  // // // it use in feature
  // const handelBeExportCheck = () => {
  //   dispatch(
  //     poBulkUploadFileExportBeCheckThunk({
  //       onSuccessHandler: () => {
  //         dispatch(
  //           getRequisitionHistoryThunk({ filterData: { type: 'export' } })
  //         );
  //       }
  //     })
  //   );
  // };

  const exportPoErrorFileHandler = (values) => {
    dispatch(
      getPendingOrderErrorFileThunk({
        unixCode: values?.unix_code
      })
    );
  };

  // // life cycle
  useEffect(() => {
    if (poErrorFileFormFormData?.vender_name) {
      dispatch(
        getUnixCodeAgainstVendorForErrorFileThunk({
          venderName: poErrorFileFormFormData?.vender_name
        })
      );
    }
  }, [poErrorFileFormFormData?.vender_name]);

  useEffect(() => {
    if (pendingOrderErrorFileData?.length) {
      transformPoErrorDataForExport();
    }
  }, [pendingOrderErrorFileData]);

  useEffect(() => {
    dispatch(getVenderListThunk());
    dispatch(getRequisitionHistoryThunk({ filterData: { type: 'export' } }));
  }, []);

  return (
    <Container fluid className="generate_po_container">
      <h3 className="fw-bold text_primary "> Generate PO</h3>
      <Stack gap={3}>
        {/* it use in feature */}
        {/* <ExportToExcel
          className="btn btn-dark ms-0"
          buttonTitle="PO Bulk Upload File"
          apiData={transformDataForExport(requisitionHistoryList?.data)}
          fileName="PO Bulk Upload File Records"
          disabled={
            !requisitionHistoryList?.data?.length || getRequisitionHistoryList
          }
          onClickHandler={handelBeExportCheck}
        /> */}
        <button
          className="btn btn-dark ms-0"
          onClick={() => setOpenPoErrorFileForm(!openPoErrorFileForm)}
          type="button"
        >
          Generate PO Error File
        </button>
        <Collapse in={openPoErrorFileForm}>
          <div>
            <Formik
              initialValues={{ vender_name: '', unix_code: '' }}
              enableReinitialize
              validationSchema={generatePoErrorFileValidation}
              onSubmit={(values) => {
                exportPoErrorFileHandler(values);
              }}
            >
              {({ resetForm, dirty, values, isValid }) => {
                setPoErrorFileFormFormData(values);
                return (
                  <Form>
                    <Row className="row_gap_3">
                      <Col sm={6}>
                        <Field
                          component={CustomReactSelect}
                          options={venderData}
                          name="vender_name"
                          label="Vendor Name :"
                          placeholder={getVenderList ? 'Loading...' : 'Select'}
                          requiredField
                          isSearchable
                        />
                      </Col>
                      <Col sm={6}>
                        <Field
                          component={CustomReactSelect}
                          options={venderUnixCode}
                          name="unix_code"
                          label="Error File Date :"
                          placeholder={
                            getUnixCodeAgainstVendor ? 'Loading...' : 'Select'
                          }
                          requiredField
                          isSearchable
                          disabled={
                            !values?.vender_name || getUnixCodeAgainstVendor
                          }
                        />
                      </Col>
                    </Row>

                    <div className="d-flex justify-content-md-end mt-3 btn_container">
                      {/* <ExportToExcel
                        className="btn btn-dark px-4"
                        buttonTitle="Download"
                        fileName="PO Error File Records"
                        btnType="submit"
                        disabled={
                          getPendingOrderErrorFileData || !isValid || !dirty
                        }
                        isLoading={getPendingOrderErrorFileData}
                        apiData={transformPoErrorDataForExport(
                          pendingOrderErrorFileData || []
                        )}
                        onApiClick={exportPoErrorFileHandler}
                      /> */}
                      <button
                        className="btn btn-dark px-4"
                        type="submit"
                        disabled={
                          getPendingOrderErrorFileData || !isValid || !dirty
                        }
                      >
                        {getPendingOrderErrorFileData ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          'Proceed'
                        )}
                      </button>
                      <button
                        className="btn btn-info text-white px-4"
                        type="button"
                        onClick={resetForm}
                        disabled={!dirty}
                      >
                        <i className="icofont-refresh text-white" /> Reset
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </Collapse>

        <Formik
          initialValues={{ vender_name: '', delivery_date: '' }}
          enableReinitialize
          validationSchema={generatePoFilterValidation}
          onSubmit={(values) => {
            navigate(`po`, { state: { generatePoFilter: values } });
            dispatch(resetUserAddedOrderList());
          }}
        >
          {({ resetForm, dirty }) => (
            <Form>
              <Row className="row_gap_3">
                <Col sm={6}>
                  <Field
                    component={CustomReactSelect}
                    options={venderData}
                    name="vender_name"
                    label="Vendor Name :"
                    placeholder={getVenderList ? 'Loading...' : 'Select'}
                    requiredField
                    isSearchable
                  />
                </Col>
                <Col sm={6}>
                  <Field
                    component={CustomInput}
                    type="date"
                    name="delivery_date"
                    label="Delivery Date :"
                    requiredField
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-md-end mt-3 btn_container">
                <button className="btn btn-dark px-4" type="submit">
                  Proceed
                </button>
                <button
                  className="btn btn-info text-white px-4"
                  type="button"
                  onClick={resetForm}
                  disabled={!dirty}
                >
                  <i className="icofont-refresh text-white" /> Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </Stack>
    </Container>
  );
}

export default GeneratePo;
