import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import ErrorLogService from '../../../services/ErrorLogService';
import CountryService from '../../../services/MastersService/CountryService';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import Alert from '../../../components/Common/Alert';
import StateService from '../../../services/MastersService/StateService';
import CityService from '../../../services/MastersService/CityService';
import {
  getAttachment,
  deleteAttachment
} from '../../../services/OtherService/AttachmentService';
import { _pincodeUrl } from '../../../settings/constants';
import VendorMasterService from '../../../services/Bill Checking/Masters/VendorMasterService';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { _attachmentUrl } from '../../../settings/constants';
import PaymentTemplateService from '../../../services/Bill Checking/Masters/PaymentTemplateService';
import BillCheckingTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import { Link, useParams } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import { Table } from 'react-bootstrap';

const ViewVendorDetails = ({ match }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const [CountryDropdown, setCountryDropdown] = useState();
  const [stateDropdown, setStateDropdown] = useState();
  const [cityDropdown, setCityDropdown] = useState();
  const [paymentDropdown, setPaymentDropdown] = useState();

  const loadData = async () => {
    await new VendorMasterService().getVendorMasterById(id).then((res) => {
      if (res.status === 200) {
        const temp = res.data.data;
        setData(null);
        setData(temp);
      }
    });

    await new VendorMasterService().getActiveCountry().then((res) => {
      if (res.status === 200) {
        setCountryDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.country.charAt(0).toUpperCase() + d.country.slice(1)
          }))
        );
      }
    });

    await new VendorMasterService().getActiveState().then((res) => {
      if (res.status === 200) {
        setStateDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.state
          }))
        );
      }
    });

    await new VendorMasterService().getActiveCity().then((res) => {
      if (res.status === 200) {
        setCityDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.city
          }))
        );
      }
    });

    await new VendorMasterService().getActivePaymentTemplate().then((res) => {
      if (res.status === 200) {
        setPaymentDropdown(
          res.data.data.map((d) => ({ value: d.id, label: d.template_name }))
        );
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <PageHeader headerTitle="Vendor Details" />
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Vendor Name:
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="vendor_name"
                    name="vendor_name"
                    defaultValue={data && data.vendor_name}
                    readOnly
                  />
                </div>
                <div className="col-sm-4 mt-2">
                  <label className=" col-form-label">
                    <b>Vendor ID :</b>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control"
                    id="id"
                    name="id"
                    defaultValue={data && data.id}
                    readOnly
                  />
                </div>
                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Mobile No :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="mobile_no"
                    name="mobile_no"
                    defaultValue={data && data.mobile_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">
                    Email Id :
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    id="email"
                    name="email"
                    defaultValue={data && data.email}
                    readOnly
                  />
                </div>
                {CountryDropdown && (
                  <div className="col-sm-3">
                    <label className="form-label font-weight-bold">
                      Country :
                    </label>
                    <Select
                      id="country"
                      options={CountryDropdown}
                      name="country"
                      isDisabled
                      defaultValue={
                        data &&
                        CountryDropdown.filter((d) => d.value == data.country)
                      }
                    />
                  </div>
                )}
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">State :</label>
                  {stateDropdown && (
                    <Select
                      id="state"
                      name="state"
                      options={stateDropdown}
                      defaultValue={
                        data &&
                        stateDropdown.filter((d) => d.value == data.state)
                      }
                      isDisabled
                    />
                  )}
                </div>
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">City :</label>
                  {cityDropdown && (
                    <Select
                      id="city"
                      name="city"
                      options={cityDropdown}
                      defaultValue={
                        data && cityDropdown.filter((d) => d.value == data.city)
                      }
                      isDisabled
                    />
                  )}
                </div>
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">
                    Address :
                  </label>
                  <textarea
                    type="text"
                    className="form-control form-control"
                    rows="2"
                    id="address"
                    name="address"
                    placeholder="Enter maximum 50 character"
                    defaultValue={data && data.address}
                    readOnly
                  />
                </div>
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">
                    Pincode :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="pincode"
                    name="pincode"
                    defaultValue={data && data.pincode}
                    readOnly
                  />
                </div>
                <div className="col-sm-3">
                  <label className="form-label font-weight-bold">
                    Aadhaar No :
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="adhar_no"
                    name="adhar_no"
                    defaultValue={data && data.adhar_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="col-form-label">
                    <b>Aadhaar Attachment:</b>
                  </label>
                  {data &&
                  data.adhar_attachment &&
                  data.adhar_attachment.length > 0 ? (
                    <div>
                      {data.adhar_attachment.map((attachment, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <div className="mr-2">
                            <a
                              href={`${_attachmentUrl}/${attachment}`}
                              target="_blank"
                              download
                              className="btn btn-info btn-sm p-0 mr-2"
                              accept="image/jpg,image/jpeg,image/png,application/pdf"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '15px' }}
                              ></i>{' '}
                            </a>
                          </div>
                          <div className="mx-2">
                            {attachment.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Attachment Not Available</p>
                  )}
                </div>
                <div className="col-sm-3 ">
                  <label className="form-label font-weight-bold">
                    PAN No :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="pan_no"
                    name="pan_no"
                    defaultValue={data && data.pan_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-5">
                  <label className="col-form-label" htmlFor="attachment">
                    <b>PAN Attachment :</b>
                  </label>
                  {data && data.pan_attachment ? (
                    <div>
                      {data.pan_attachment.map((attachment, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <div className="mr-2">
                            {/* <a
                              href={`${_attachmentUrl}/${attachment}`}
                              target="_blank"
                              download
                              className="btn btn-info btn-sm p-0 mr-2"
                              accept="image/jpg,image/jpeg,image/png,application/pdf"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '15px' }}
                              ></i>{' '}
                            </a> */}
                            <a
                              href={`${_attachmentUrl}/${attachment}`} // File URL for download
                              target="_blank"
                              download // Suggests downloading the file
                              className="btn btn-info btn-sm p-0 mr-2"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '15px' }}
                              ></i>
                            </a>
                          </div>
                          <div className="mx-2">
                            {attachment.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="col-sm-3 mt-5">
                      <p>Attachment Not available</p>
                    </div>
                  )}
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    GST No :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="gst_no"
                    name="gst_no"
                    defaultValue={data && data.gst_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="col-form-label">
                    <b>GST Attachment :</b>
                  </label>
                  {data &&
                  data.gst_attachment &&
                  data.gst_attachment.length > 0 ? (
                    <div>
                      {data.gst_attachment.map((attachment, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <div className="mr-2">
                            <a
                              href={`${_attachmentUrl}/${attachment}`}
                              target="_blank"
                              download
                              className="btn btn-info btn-sm p-0 mr-2 attachment-link"
                              accept="image/jpg,image/jpeg,image/png,application/pdf"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '15px' }}
                              ></i>
                            </a>
                          </div>
                          <div className="mx-2">
                            {attachment.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Attachment Not Available</p>
                  )}
                </div>
                <div className="col-sm-3 ">
                  <label className="form-label font-weight-bold">
                    MSME No :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="msme_no"
                    name="msme_no"
                    defaultValue={data && data.msme_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="col-form-label" htmlFor="msme_attachment">
                    <b>MSME Attachment:</b>
                  </label>
                  {data &&
                  data.msme_attachment &&
                  data.msme_attachment.length > 0 ? (
                    <div>
                      {data.msme_attachment.map((attachment, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <div className="mr-2">
                            <a
                              href={`${_attachmentUrl}/${attachment}`}
                              target="_blank"
                              download
                              className="btn btn-info btn-sm p-0 mr-2"
                              accept="image/jpg,image/jpeg,image/png,application/pdf"
                            >
                              <i
                                className="icofont-download"
                                style={{ fontSize: '15px' }}
                              ></i>{' '}
                            </a>
                          </div>
                          <div className="mx-2">
                            {attachment.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Attachment Not Available</p>
                  )}
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    Bank Name :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="bank_name"
                    name="bank_name"
                    defaultValue={data && data.bank_name}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    Bank Branch Name :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="bank_branch_name"
                    name="bank_branch_name"
                    defaultValue={data && data.bank_branch_name}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    Account No :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="account_no"
                    name="account_no"
                    defaultValue={data && data.account_no}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    IFSC Code :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="ifsc_code"
                    name="ifsc_code"
                    defaultValue={data && data.ifsc_code}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-3">
                  <label className="form-label font-weight-bold">
                    Beneficiary Name :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="beneficiary_name"
                    name="beneficiary_name"
                    defaultValue={data && data.beneficiary_name}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-5">
                  <label className="col-form-label" htmlFor="attachment">
                    <b>Passbook Attachment:</b>
                  </label>
                  {data &&
                  data.bank_passbook_attachment &&
                  data.bank_passbook_attachment.length > 0 ? (
                    <div>
                      {data.bank_passbook_attachment.map(
                        (attachment, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center mb-2"
                          >
                            <div className="mr-2">
                              <a
                                href={`${_attachmentUrl}/${attachment}`}
                                target="_blank"
                                download
                                className="btn btn-info btn-sm p-0 mr-2"
                                accept="image/jpg,image/jpeg,image/png,application/pdf"
                              >
                                <i
                                  className="icofont-download"
                                  style={{ fontSize: '15px' }}
                                ></i>{' '}
                              </a>
                            </div>
                            <div className="mx-2">
                              {attachment.split('/').pop()}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <p>Attachment Not Available</p>
                  )}
                </div>
                <div className="col-sm-3 mt-5">
                  <label className="col-form-label">
                    <b>Cheque Attachment:</b>
                  </label>
                  {data &&
                  data.cheque_attachment &&
                  data.cheque_attachment.length > 0 ? (
                    <div>
                      {data.cheque_attachment.map((attachment, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <a
                            href={`${_attachmentUrl}/${attachment}`}
                            target="_blank"
                            download
                            className="btn btn-info btn-sm p-0 mr-2"
                            accept="image/jpg,image/jpeg,image/png,application/pdf"
                          >
                            <i
                              className="icofont-download"
                              style={{ fontSize: '15px' }}
                            ></i>{' '}
                          </a>
                          <div className="mx-2">
                            {attachment.split('/').pop()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Attachment Not Available</p>
                  )}
                </div>
                <div className="col-sm-3 mt-4 ">
                  <label className="form-label font-weight-bold">
                    Consider In Payment :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="consider_in_payment"
                    name="consider_in_payment"
                    disabled
                    value={data && data?.consider_in_payment?.toUpperCase()}
                  >
                    {/* <option value="">SELECT...</option>
                    <option
                      selected={data && data.consider_in_payment == "YES"}
                      value="YES"
                    >
                      YES
                    </option>
                    <option
                      selected={data && data.consider_in_payment == "NO"}
                      value="NO"
                    >
                      NO
                    </option>
                    <option
                      selected={
                        data && data.consider_in_payment == "PETTY_CASH"
                      }
                      value="PETTY_CASH"
                    >
                      PETTY CASH
                    </option> */}
                  </input>
                </div>
                <div className="col-sm-3 mt-4">
                  <label className="form-label font-weight-bold">
                    ERP Acc Name :
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="acme_account_name"
                    name="acme_account_name"
                    defaultValue={data && data.acme_account_name}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-4">
                  <label className="form-label font-weight-bold">
                    Template :
                  </label>
                  {paymentDropdown && (
                    <Select
                      id="payment_template"
                      name="payment_template"
                      options={paymentDropdown}
                      defaultValue={
                        data &&
                        paymentDropdown.filter(
                          (d) => d.value == data.payment_template
                        )
                      }
                      isDisabled
                    />
                  )}
                </div>
                <div className="col-sm-3 mt-4">
                  <label className="form-label font-weight-bold">
                    Card Number :
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="card_number"
                    name="card_number"
                    defaultValue={data && data.card_number}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-4">
                  <label className="form-label font-weight-bold">
                    Ref Number :
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="reference_number"
                    name="reference_number"
                    defaultValue={data && data.reference_number}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-4">
                  <label className="form-label font-weight-bold">
                    Narration :
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="narration"
                    name="narration"
                    defaultValue={data && data.narration}
                    readOnly
                  />
                </div>
                <div className="col-sm-3 mt-4">
                  <div className="row">
                    <div className="col-sm-3 mt-4">
                      <label className="form-label font-weight-bold">
                        Status :
                      </label>
                    </div>
                    <div className="col-md-2 mt-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active"
                          value="1"
                          key={Math.random()}
                          defaultChecked={data && data.is_active == 1}
                          disabled
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_active_1"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                    <div
                      className="col-md-3 mt-4"
                      style={{ marginLeft: '20px' }}
                    >
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active"
                          key={Math.random()}
                          value="0"
                          defaultChecked={data && data.is_active == 0}
                          disabled
                        />
                        <label className="form-check-label" htmlFor="is_active">
                          Deactive
                        </label>
                      </div>
                    </div>
                    <div className="mt-3" style={{ textAlign: 'right' }}>
                      <Link
                        to={`/${_base}/vendorMaster`}
                        className="btn btn-danger text-white"
                      >
                        back
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVendorDetails;
