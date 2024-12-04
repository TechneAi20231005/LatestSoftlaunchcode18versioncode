import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import {
  CustomInput,
  CustomReactSelect
} from '../../../components/custom/inputs/CustomInputs';
import { generatePoFilterValidation } from '../validation/generatePoFilter';
import { getVenderListThunk } from '../../../redux/services/po/common';
import { resetUserAddedOrderList } from '../../../redux/slices/po/generatePo';
import { getRequisitionHistoryThunk } from '../../../redux/services/po/history';

// // // it use in feature
// import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
// import { poBulkUploadFileExportBeCheckThunk } from '../../../redux/services/po/generatePo';
import './style.scss';
import GeneratePoErrorFileModal from './GeneratePoErrorFileModal';

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

  // // local state
  const [openPoErrorFileFormModal, setOpenPoErrorFileFormModal] =
    useState(false);

  // // dropdown data
  const venderData = [
    { label: 'Select', value: '', isDisabled: true },
    ...(venderList?.map((item) => ({
      label: item?.vendor,
      value: item?.vendor
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

  // // life cycle
  useEffect(() => {
    dispatch(getVenderListThunk());
    dispatch(getRequisitionHistoryThunk({ filterData: { type: 'export' } }));
  }, []);

  return (
    <>
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
            onClick={() => setOpenPoErrorFileFormModal(true)}
            type="button"
          >
            Generate PO Error File
          </button>

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
                      id="generatepo_vendorname"
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
                      id="generatepo_deliverydate"
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

      {/* modal for po error file form */}
      <GeneratePoErrorFileModal
        open={openPoErrorFileFormModal}
        close={() => setOpenPoErrorFileFormModal(false)}
      />
    </>
  );
}

export default GeneratePo;
