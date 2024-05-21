import React, { useEffect } from 'react';
import { Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import { CustomInput, CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import { generatePoFilterValidation } from '../validation/generatePoFilter';
import { getVenderListThunk } from '../../../redux/services/po/common';
import { resetUserAddedOrderList } from '../../../redux/slices/po/generatePo';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { getRequisitionHistoryThunk } from '../../../redux/services/po/history';
import { poBulkUploadFileExportBeCheckThunk } from '../../../redux/services/po/generatePo';
import './style.scss';

function GeneratePo() {
  // // initial state
  const navigate = useNavigate();
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

  // // dropdown data
  const venderData = [
    { label: 'Select', value: '', isDisabled: true },
    ...venderList?.map(item => ({
      label: item?.vendor,
      value: item?.vendor,
    })),
  ];

  // // function
  const transformDataForExport = data => {
    return data?.map((row, index) => ({
      'Delivery Date': row?.delivery_date || '--',
      'Order Date': row?.order_date || '--',
      Karagir: row?.karagir || '--',
      Item: row?.item || '--',
      Category: row?.category || '--',
      'Size Range': row?.size_range || '--',
      'Weight Range': row?.weight_range || '--',
      'Exact Weight': row?.exact_wt || '--',
      'Purity Range': row?.purity_range || '--',
      'New Order': row?.new_qty || '--',
      'Karagir Wt Range': row?.karagir_wt_range || '--',
      'Knock Off Wt Range': row?.knockoff_wt_range || '--',
      'Karagir Size Range': row?.karagir_size_range || '--',
    }));
  };

  const handelBeExportCheck = () => {
    dispatch(
      poBulkUploadFileExportBeCheckThunk({
        onSuccessHandler: () => {
          dispatch(getRequisitionHistoryThunk({ filterData: { type: 'export' } }));
        },
      }),
    );
  };

  // // life cycle
  useEffect(() => {
    dispatch(getVenderListThunk());
    dispatch(getRequisitionHistoryThunk({ filterData: { type: 'export' } }));
  }, []);

  return (
    <Container fluid className="generate_po_container">
      <h3 className="fw-bold text_primary "> Generate PO</h3>
      <Stack gap={3}>
        <ExportToExcel
          className="btn btn-dark ms-0"
          buttonTitle="PO Bulk Upload File"
          apiData={transformDataForExport(requisitionHistoryList?.data)}
          fileName="PO Bulk Upload File Records"
          disabled={!requisitionHistoryList?.data?.length || getRequisitionHistoryList}
          onClickHandler={handelBeExportCheck}
        />
        <Formik
          initialValues={{ vender_name: '', delivery_date: '' }}
          enableReinitialize
          validationSchema={generatePoFilterValidation}
          onSubmit={values => {
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
                    label="Vender Name :"
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
