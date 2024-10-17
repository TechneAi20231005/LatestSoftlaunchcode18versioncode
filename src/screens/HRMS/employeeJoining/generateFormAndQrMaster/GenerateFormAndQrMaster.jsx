import React, { useEffect, useReducer, useRef, useState, useMemo } from 'react';
import { Card, CardBody, Col, Container, Row, Stack } from 'react-bootstrap';
import { Field, Form, Formik } from 'formik';
import { QRCode } from 'react-qrcode-logo';
import Select from 'react-select';

// // static import
import PageHeader from '../../../../components/Common/PageHeader';
import {
  CustomInput,
  CustomRadioButton,
  CustomReactSelect
} from '../../../../components/custom/inputs/CustomInputs';
import { RenderIf } from '../../../../utils';
import { generateFormValidation } from './validation';
import { useDispatch, useSelector } from 'react-redux';
import { getSourceMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/sourceMaster';
import { getDesignationDataListThunk } from '../../../../screens/Masters/DesignationMaster/DesignationAction';
import { getBranchMasterListThunk } from '../../../../redux/services/hrms/employeeJoining/branchMaster';
import './style.scss';
import {
  addQrCodeList,
  removeQrCodeList
} from '../../../../redux/services/hrms/employeeJoining/qrCodeListMaster';
import './style.scss';
import { toast } from 'react-toastify';
import moment from 'moment';
import EmployeeJoiningForm from './JoiningForm/EmployeeJoiningForm';
function GenerateFormAndQrMaster() {
  // // initial state
  const dispatch = useDispatch();
  const { addQrCodeData } = useSelector((state) => state?.qrCodeMaster);

  const { sourceMasterList } = useSelector((state) => state?.sourceMaster);
  const { getDesignationData } = useSelector(
    (state) => state.designationMaster
  );
  const { branchMasterList } = useSelector((state) => state?.branchMaster);
  const qrRef = useRef(null);
  const fileInputRef = useRef(null);
  const [show, setShow] = useState(true);
  const [success, setsuccess] = useState(false);
  const [isDownload, setIsDownload] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const currentDate = moment().format('MM-DD-YYYY');
  const [formData, setFormData] = useState({
    source_name: '',
    job_opening_id: [],
    branch_id: [],
    branding_type: 'logo',
    logo: '',
    company_name: '',
    theme_color: '',
    company_name_color: '',
    recruiter_email_id: '',
    recruiter_contact_no: ''
  });

  let tenantId = localStorage.getItem('actual_tenant_id');

  const formInitialValue = {
    // tenant_name: '',
    source_name: '',
    job_opening_id: [],
    branch_id: [],
    branding_type: 'logo',
    logo: '',
    company_name: '',
    theme_color: '',
    company_name_color: '',
    recruiter_email_id: '',
    recruiter_contact_no: ''
  };

  const removeId = addQrCodeData?.id;
  let tenateId = localStorage.getItem("actual_tenant_id")



  const resetFormRef = useRef(null);

  const filterAndMapData = (data, labelKey, valueKey) => {
    return data
      ?.filter((item) => item.is_active === 1)
      .map((item) => ({
        label: item?.[labelKey],
        value: item?.[valueKey]
      }));
  };

  const sourceData = filterAndMapData(sourceMasterList, 'source_name', 'id');
  const jobOpeningData = filterAndMapData(
    getDesignationData,
    'designation',
    'id'
  );
  const locationData = filterAndMapData(
    branchMasterList,
    'location_name',
    'id'
  );

  const [qrStyleData, setQrStyleData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { qrColor: '#000', qrType: 'squares', logoPath: '' }
  );

  const qrStyleOptions = [
    { label: 'Squares', value: 'squares' },
    { label: 'Dots', value: 'dots' },
    { label: 'Fluid', value: 'fluid' }
  ];

  // // all handler
  const downloadQrCode = (reset) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 500;

    const img = new Image();
    const svgBlob = new Blob([addQrCodeData?.qr_scanner], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `${'QR Code'}-${currentDate}.png`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    img.onerror = (error) => {
      console.error('Error loading image', error);
    };

    img.src = url;
    toast.success('QR Code downloaded successfully');
    setTimeout(() => {
      window.history.back();
    }, 1500);
  };

  const handleAddQrCode = (values) => {
    const canvas = qrRef.current?.canvasRef?.current;
    const pngUrl = canvas?.toDataURL('image/png');
    const formDatas = new FormData();
    formDatas.append('source_id', values?.source_name);
    formDatas.append('theme_color', values?.theme_color);
    formDatas.append('email_id', values?.recruiter_email_id);
    formDatas.append('contact_no', values?.recruiter_contact_no);
    values?.branch_id.forEach((location) => {
      formDatas?.append('locations[]', location);
    });

    values?.job_opening_id.forEach((designation) => {
      formDatas?.append('designations[]', designation);
    });

     formDatas.append('tenant_id', tenateId);
    formDatas.append(
      'company_name',
      formData.branding_type === 'text' ? values?.company_name : ''
    );

    formDatas.append('qr_color', qrStyleData.qrColor)

    // formDatas.append('qr_scanner', pngUrl);

    formDatas.append(
      'logo_image',
      formData.branding_type === 'logo' ? values?.logo : ''
    );

    dispatch(
      addQrCodeList({
        formData: formDatas,
        onSuccessHandler: () => {
          setsuccess(true);
          setIsGenerate(true);
        },
        onErrorHandler: () => {
          setsuccess(false);
        }
      })
    );
  };
  const handleRemove = () => {
    // return false
    dispatch(
      removeQrCodeList({
        currentId: removeId,
        onSuccessHandler: () => {
          console.log('removed sucessfully');
          setIsGenerate(false);
          // setsuccess(true);
        }
      })
    );
    setFormData({});
    if (resetFormRef.current) {
      resetFormRef.current();
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setQrStyleData({
      qrColor: '#000',
      qrType: 'squares',
      logoPath: ''
    });

    // resetForm();
    setsuccess(false);
  };
  const handleBack = () => {
    if (isGenerate && !isDownload) {
      dispatch(
        removeQrCodeList({
          currentId: removeId,
          onSuccessHandler: () => {
            window.history.back();
            // setsuccess(true);
          }
        })
      );
      console.log('calling a api');
    } else {
      window.history.back();
      console.log('going back ');
    }
  };
  const handleViewIframe = () => {
    setShow(false);
  };

  useEffect(() => {
    dispatch(getSourceMasterListThunk());
    dispatch(getDesignationDataListThunk());
    dispatch(getBranchMasterListThunk());
  }, []);

  return (
    <>
      {show && (
        <Container fluid>
          <PageHeader
            isremove
            handleBack={handleBack}
            headerTitle="Generate QR Code"
          />
          <Row className="mt-2 row_gap_3 generate_from_qr_container">
            <Col
              xs={12}
              sm={6}
              md={7}
              xxl={8}
              className="pe-sm-0 form_container"
            >
              <Card className="w-100">
                <CardBody>
                  <Formik
                    initialValues={formData}
                    validationSchema={generateFormValidation}
                    onSubmit={(values, errors) => {
                      handleAddQrCode(values);
                      setFormData(values);
                      // setFormData(values)
                    }}
                  >
                    {({
                      isValid,
                      dirty,
                      values,
                      errors,
                      touched,
                      setFieldValue,
                      resetForm
                    }) => {
                      resetFormRef.current = resetForm;
                      setFormData(values);


                      return (
                        <Form>
                          <Stack gap={3}>
                            <div>
                              <div className="branding_type_container">
                                <Field
                                  component={CustomRadioButton}
                                  type="radio"
                                  name="branding_type"
                                  label="Select Logo"
                                  value="logo"
                                  inputClassName="me-1"
                                  className="ms-0"
                                  onChange={() => {

                                    setFieldValue('company_name', '');
                                  }}
                                />
                                <Field
                                  component={CustomRadioButton}
                                  type="radio"
                                  name="branding_type"
                                  label="Enter Company Name"
                                  value="text"
                                  inputClassName="me-1"
                                  onChange={() => {


                                    setQrStyleData({ logoPath: '' });
                                    setFieldValue('logo', '');
                                  }}
                                />
                              </div>
                              <RenderIf
                                render={values.branding_type === 'logo'}
                              >
                                {/* <Field
                              component={CustomInput}
                              type="file"
                              name="logo"
                              withOutLabel
                            /> */}
                                <input
                                  type="file"
                                  name="logo"
                                  className={`form-control ${
                                    errors.logo && touched.logo
                                      ? 'is-invalid'
                                      : ''
                                  }`}
                                  accept=".png, .psd, .jpg, .svg, .eps, .pdf, .ai, .tiff, .gif, .bmp, .heic, .jpeg"
                                  ref={fileInputRef}
                                  onChange={(event) => {

                                    setFieldValue(
                                      'logo',
                                      event.target.files[0]
                                    );
                                    setQrStyleData({
                                      logoPath: URL.createObjectURL(
                                        event.target.files[0]
                                      )
                                    });
                                  }}
                                />
                                <RenderIf render={errors.logo && touched.logo}>
                                  <div className="invalid-feedback">
                                    {errors.logo}
                                  </div>
                                </RenderIf>
                              </RenderIf>
                              <RenderIf
                                render={values.branding_type === 'text'}
                              >
                                {/* {setQrStyleData({ logoPath: '' })} */}
                                <Field
                                  component={CustomInput}
                                  type="text"
                                  name="company_name"
                                  withOutLabel
                                  placeholder="Enter Company Name"
                                />
                              </RenderIf>
                            </div>

                            <Field
                              options={sourceData}
                              component={CustomReactSelect}
                              name="source_name"
                              label="Select Source"
                              placeholder="Select"
                              requiredField

                            />
                            <Field
                              options={jobOpeningData}
                              component={CustomReactSelect}
                              name="job_opening_id"
                              label="Select Opening"
                              placeholder="Select"
                              requiredField
                              isMulti
                            />
                            <Field
                              options={locationData}
                              component={CustomReactSelect}
                              name="branch_id"
                              label="Select Location"
                              placeholder="Select"
                              requiredField
                              isMulti
                            />

                            <Row className="row_gap_3">
                              <Col sm={6}>
                                <Field
                                  component={CustomInput}
                                  type="color"
                                  name="theme_color"
                                  label="Theme Color"
                                  placeholder="Enter Theme Color"
                                  requiredField
                                />
                              </Col>
                              {/* <Col sm={6}>
                                <RenderIf
                                  render={values.branding_type === 'text'}
                                >
                                  <Field
                                    component={CustomInput}
                                    type="color"
                                    name="company_name_color"
                                    label="Company Name Color"
                                    placeholder="Enter Company Color"
                                    requiredField
                                  />
                                </RenderIf>
                              </Col> */}
                            </Row>
                            <Field
                              component={CustomInput}
                              type="email"
                              name="recruiter_email_id"
                              label="Recruiter Email ID"
                              placeholder="Enter Recruiter Email Id"
                              // requiredField
                            />
                            <Field
                              component={CustomInput}
                              type="number"
                              name="recruiter_contact_no"
                              label="Recruiter Contact Number"
                              placeholder="Enter Recruiter Contact Number"
                              // requiredField
                            />
                            <div style={{ display: 'flex' }}>
                              <button
                                style={{ height: '50px', width: '300px' }}
                                type="submit"
                                className="btn btn-dark ms-0"
                                disabled={success}
                                // disabled={!(isValid && dirty)}
                              >
                                Generate Application Form
                              </button>
                              {success && (
                                <>
                                  {' '}
                                  <button
                                    style={{ height: '50px' }}
                                    onClick={handleViewIframe}
                                    className="btn btn-primary ms-4"
                                    disabled={isDownload}
                                  >
                                    View
                                  </button>
                                  <button
                                    style={{ height: '50px' }}
                                    disabled={isDownload}
                                    onClick={handleRemove}
                                    className="btn btn-danger ms-4"
                                  >
                                    Remove Form
                                  </button>
                                </>
                              )}
                            </div>
                          </Stack>
                        </Form>
                      );
                    }}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
            <Col xs={12} sm={6} md={5} xxl={4} className="qr_container">
              <Card className="w-100">
                <CardBody className="w-100 d-flex flex-column gap-3 justify-content-center">
                  <div className="d-flex flex-column flex-md-row align-items-center gap-3">
                    {/* QR Code */}
                    <QRCode
                      ref={qrRef}
                      value={`http://3.108.206.34/techne-ai-employee-joining-soft-lunch/?tenant_id=${tenantId}`}
                      // size={250}
                      logoImage={qrStyleData?.logoPath}
                      fgColor={qrStyleData?.qrColor}
                      qrStyle={qrStyleData?.qrType}
                      logoHeight={40}
                      logoWidth={40}
                      eyeRadius={10}
                      logoPaddingStyle="square"
                      removeQrCodeBehindLogo={true}
                    />

                    {/* Icon stack */}
                    <Stack className="justify-content-between flex-row flex-md-column mt-3 mt-md-0">
                      <i
                        className="icofont-qr-code fs-1 text-primary cp"
                        onClick={() => setQrStyleData({ qrColor: '#484c7f' })}
                      />
                      <i
                        className="icofont-qr-code fs-1 text-secondary cp"
                        onClick={() => setQrStyleData({ qrColor: '#f19828' })}
                      />
                      <i
                        className="icofont-qr-code fs-1 text-danger cp"
                        onClick={() => setQrStyleData({ qrColor: '#dc3545' })}
                      />
                      <i
                        className="icofont-qr-code fs-1 text-info cp"
                        onClick={() => setQrStyleData({ qrColor: '#0dcaf0' })}
                      />
                      <i
                        className="icofont-qr-code fs-1 cp"
                        onClick={() => setQrStyleData({ qrColor: '#000000' })}
                      />
                    </Stack>
                  </div>

                  {/* Button and dropdown container */}
                  <div className="d-flex align-items-center btn_container">
                    <button
                      type="button"
                      className="btn btn-dark ms-0 w-100"
                      disabled={!success || isDownload}
                      onClick={downloadQrCode}
                    >
                      <i className="icofont-download me-2" />
                      Download
                    </button>
                    <Select
                      options={qrStyleOptions}
                      className="w-100"
                      onChange={(e) => setQrStyleData({ qrType: e.value })}
                      defaultValue={qrStyleOptions[0]}
                    />
                    <label>
                      <input
                        type="color"
                        onChange={(e) =>
                          setQrStyleData({ qrColor: e.target.value })
                        }
                      />
                      <i className="icofont-paint text-light rounded cp" />
                    </label>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      {!show && (
        <>
          <div>
            <button style={{ background: 'none', border: 0 }}>
              <i
                className="icofont-simple-left fs-2 back_icon_btn cp"
                onClick={() => setShow(true)}
              />
            </button>
          </div>
          <div>
            <EmployeeJoiningForm data={addQrCodeData} />
          </div>
        </>
      )}
    </>
  );
}

export default GenerateFormAndQrMaster;
