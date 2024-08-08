import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Col, Row, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import CustomModal from '../../../components/custom/modal/CustomModal';
import { generatePoErrorFileValidation } from '../validation/generatePoFilter';
import {
  getPendingOrderErrorFileThunk,
  getUnixCodeAgainstVendorForErrorFileThunk
} from '../../../redux/services/po/generatePo';
import { exportToExcelCustomHandler } from '../../../utils/customFunction';

function GeneratePoErrorFileModal({ open, close }) {
  // // initial state
  const dispatch = useDispatch();

  // // redux state
  const {
    venderList,
    isLoading: { getVenderList }
  } = useSelector((state) => state?.poCommon);
  const {
    unixCodeListAgainstVendor,
    pendingOrderErrorFileData,
    isLoading: { getUnixCodeAgainstVendor, getPendingOrderErrorFileData }
  } = useSelector((state) => state?.generatePo);

  // // local state
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

  // // handler
  const transformPoErrorDataForExport = useCallback(() => {
    const errorFileData = pendingOrderErrorFileData?.map((row) => ({
      'Delivery Date': row?.delivery_date ?? '--',
      'Order Date': row?.po_date ?? '--',
      'Karagir 1': row?.vendor_name ?? '--',
      Item: row?.item ?? '--',
      Category: row?.category ?? '--',
      'Exact Wt': row?.exact_wt ?? '--',
      'Weight Range': row?.weight_range ?? '--',
      'Size Range': row?.size_range ?? '--',
      'Purity Range': row?.purity ?? '--',
      'New Order': row?.order_quantity ?? '--',
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

  const exportPoErrorFileHandler = (values) => {
    dispatch(
      getPendingOrderErrorFileThunk({
        unixCode: values?.unix_code,
        onSuccessHandler: close()
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

  return (
    <CustomModal
      show={open}
      title="Po Error File Form"
      width="sm"
      onClose={close}
    >
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
                <Col sm={12}>
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
                <Col sm={12}>
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
                    disabled={!values?.vender_name || getUnixCodeAgainstVendor}
                  />
                </Col>
              </Row>

              <div className="d-flex justify-content-md-end mt-3 btn_container">
                <button
                  className="btn btn-dark col-6"
                  type="submit"
                  disabled={getPendingOrderErrorFileData || !isValid || !dirty}
                >
                  {getPendingOrderErrorFileData ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    'Proceed'
                  )}
                </button>
                <button
                  className="btn btn-info text-white col-6"
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
    </CustomModal>
  );
}

export default GeneratePoErrorFileModal;
