import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import { _base } from "../../../settings/constants";
import Select from "react-select";
import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
import BillTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import VendorMasterService from "../../../services/Bill Checking/Masters/VendorMasterService";
import DepartmentService from "../../../services/MastersService/DepartmentService";
import UserService from "../../../services/MastersService/UserService";

import BillTypeService from "../../../services/Bill Checking/Masters/BillTypeMasterService";

import { _attachmentUrl } from "../../../settings/constants";
import { da } from "date-fns/locale";

export default function ViewBillTransaction({ match }, props) {
  // const id = match.params.id;
  const {id} =useParams()
  var section = 0;

  const history = useNavigate();
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [customerType, setCustomerType] = useState(null);
  const [dependent, setDependent] = useState({
    country_id: null,
    state_id: null,
  });

  const [billType, setBillType] = useState(null);
  const [billTypeDropdown, setBillTypeDropdown] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [vendorDropdown, setVendorDropdown] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departmentDropdown, setDepartmentDropdown] = useState(null);
  const [cityDropdown, setCityDropdown] = useState(null);
  const [user, setUser] = useState(null);
  const [userDropdown, setUserDropdown] = useState(null);

  const [constitution, setConstitution] = useState();
  const [constitutionDropdown, setConstitutionDropdown] = useState();

  const [sectionDropdown, setSectionDropdown] = useState();
  const [tdsPercentage, setTdsPercentage] = useState();

  const [billAmount, setBillAmount] = useState(0);
  const [netPayment, setNetPayment] = useState(null);

  const [tdsAmount, setTdsAmount] = useState(null);

  const [tdsData, setTdsData] = useState(null);

  const sectionRef = useRef();
  const tdsPercentageRef = useRef();

  const handleTdsChange = (e) => {
    setTdsData([e.target.value]);
  };
  const [showTdsFileds, setShowTdsFileds] = useState(false);
  const handleTdsApplicable = (e) => {
    if (e.target.checked) {
      setShowTdsFileds(e.target.checked);
    } else {
      setShowTdsFileds((e.target.checked = false));
      sectionRef.current.value = "";
      setTdsPercentage(0);
      setTdsAmount(0);
    }
  };

  const handleSectionDropDownChange1 = async (section) => {
    await new BillTransactionService()
      .getSectionMappingDropdown(section)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setConstitutionDropdown(null);
            setConstitution(res.data.data);
            setConstitutionDropdown(
              res.data.data.map((d) => ({
                value: d.id,
                label: d.constitution_name,
              }))
            );
          }
        }
      });
  };

  const loadData = async (e) => {
    var sectionId;
    await new BillTransactionService().getBillCheckingById(id).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          sectionId = res.data.data.tds_section;
          setData(res.data.data);
          // handleSectionDropDownChange1(res.data.data.tds_section);
          // if (res.data.data.is_tds_applicable == 1) {
          //   setShowTdsFileds(true);
          //   setData(res.data.data);
          // }
        }
      }
    });

    await new BillTypeService().getBillTypeData().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setBillType(res.data.data);
          setBillTypeDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.bill_type }))
          );
        }
      }
    });

    await new VendorMasterService().getVendors().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setVendor(res.data.data);
          setVendorDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.vendor_name,
            }))
          );
        }
      }
    });

    await new DepartmentService().getDepartment().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setDepartment(res.data.data);
          setDepartmentDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.department }))
          );
        }
      }
    });

    const inputRequired = "id,employee_id,first_name,last_name,middle_name,is_active";
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setUser(res.data.data);
          setUserDropdown(
            res.data.data.map((d) => ({
              value: d.id,
              label: `${d.first_name} ${d.last_name}`,
            }))
          );
        }
      }
    });

    await new BillTransactionService().getSectionDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setSectionDropdown(
            res.data.data.map((d) => ({ value: d.id, label: d.section_name }))
          );
        }
      }
    });

    await new BillTransactionService()
      .getSectionMappingDropdown(sectionId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setConstitutionDropdown(null);
            setConstitution(res.data.data);
            setConstitutionDropdown(
              res.data.data.map((d) => ({
                value: d.id,
                label: d.constitution_name,
              }))
            );
          }
        }
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader />

      <div className="row clearfix g-3">
        {data && (
          <div className="col-sm-12">
            <form>
              {/* ********* MAIN DATA ********* */}
              <div className="card mt-2">
                <div className="card-header bg-primary text-white p-2">
                  <h5>Bill No: {data.id}</h5>
                </div>

                <div className="card-body">
                  <div className="form-group row ">
                    <div className="col-md-3">
                      <label className=" col-form-label">
                        <b>
                          Bill ID : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bc_id"
                        name="bc_id"
                        required
                        readOnly
                        maxLength={25}
                        // onKeyPress={(e) => {
                        //   Validation.CharactersNumbersSpeicalOnly(e);
                        // }}
                        defaultValue={data.bc_id}
                      />
                    </div>
                    <div className="col-md-3">
                      <label className=" col-form-label">
                        <b>
                          Bill Type : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {billTypeDropdown && (
                        <Select
                          type="text"
                          className="form-control form-control"
                          defaultValue={
                            data &&
                            billTypeDropdown.filter(
                              (d) => d.value == data.bill_type
                            )
                          }
                          id="bill_type"
                          name="bill_type"
                          placeholder="Bill Type"
                          isDisabled
                          required
                          readOnly
                        />
                      )}
                    </div>

                    <div className="col-md-3">
                      <label className="col-form-label">
                        <b>
                          Assign To : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {userDropdown && data ? (
                        <Select
                          type="text"
                          className="form-control form-control-sm"
                          id="assign_to"
                          name="assign_to"
                          placeholder="Assign To"
                          required
                          defaultValue={userDropdown.filter(
                            (d) => d.value == data.assign_to
                          )}
                          isDisabled
                        />
                      ) : (
                        <p>Loading....</p>
                      )}
                    </div>

                    <div className="col-md-3">
                      <label className="col-form-label">
                        <b>
                          Vendor Name : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {vendorDropdown && data ? (
                        <Select
                          className="form-control form-control-sm"
                          id="vendor_name"
                          name="vendor_name"
                          // options={vendorDropdown}
                          readOnly={true}
                          required
                          disabled={true}
                          defaultValue={
                            data &&
                            vendorDropdown.filter(
                              (d) => d.value == data.vendor_name
                            )
                          }
                          isDisabled
                        />
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    {/* <div className="col-md-3 ">
                                        <label className="col-md-4 col-form-label">
                                            <b>Branch Name : <Astrick color="red" size="13px" /></b>
                                        </label>
                                        {departmentDropdown &&
                                            <Select className="form-control form-control-sm"
                                                id="department_name"
                                                name="department_name"
                                                options={departmentDropdown}
                                            // placeholder="Branch Name"
                                            // required

                                            />
                                        }
                                    </div> */}
                  </div>

                  <div className="form-group row mt-3">
                    {/* <div className="col-md-3">
                                    <label className=" col-form-label">
                                        <b>Expected Bill Received Date : <Astrick color="red" size="13px" /></b>
                                    </label>
                                    <input type="date" className="form-control form-control-sm"
                                        id="expected_bill_received_date"
                                        name="expected_bill_received_date"
                                        // placeholder="Bill Type"
                                        // required
                                        onKeyPress={e => { Validation.CharactersOnly(e) }}
                                    />
                                    </div> */}

                    <div className="col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          Vendor Bill No : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="vendor_bill_no"
                        name="vendor_bill_no"
                        required
                        readOnly
                        maxLength={25}
                        onKeyPress={(e) => {
                          Validation.CharactersNumbersSpeicalOnly(e);
                        }}
                        defaultValue={data.vendor_bill_no}
                      />
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Bill Date: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="bill_date"
                        name="bill_date"
                        required
                        readOnly
                        defaultValue={data.bill_date}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>

                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Recieved Date: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="received_date"
                        name="received_date"
                        defaultValue={data.received_date}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className=" form-group row mt-3">
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Debit Advance: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="debit_advance"
                        name="debit_advance"
                        readOnly
                        defaultValue={
                          data.debit_advance ? data.debit_advance : 0
                        }
                        // ref={debitRef}
                        // onChange={e => calculate(e)}
                        required
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div>
{console.log("dataoo",data)}
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Taxable Amount: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="taxable_amount"
                        name="taxable_amount"
                        readOnly
                        defaultValue={
                          data.taxable_amount ? data.taxable_amount : 0
                        }
                        required
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div>
                    <div className=" col ">
                      <input
                        className="sm"
                        id="igst_amount"
                        name="igst_amount"
                        type="checkbox"
                        disabled={true}
                        defaultChecked={
                          data.is_igst_applicable == 1 ? true : false
                        }
                        // defaultValue={data.igst_amount ? data.igst_amount : 0}
                        style={{ marginRight: "8px" }}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                      <label className="col-sm-3 col-form-label">
                        <b>
                          IGST/GST :<Astrick color="red" size="13px" />
                        </b>
                      </label>
                      

                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="gst_amount"
                        name="gst_amount"
                        disabled={true}
                        defaultValue={
                          data.is_igst_applicable == 1
                            ? data.igst_amount
                            : data.gst_amount
                        }
                        required
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div>

                    <div className=" col ">
                      <label className="col-sm-3 col-form-label">
                        <b> Round Off: </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="round_off"
                        name="round_off"
                        required
                        readOnly
                        defaultValue={data.round_off ? data.round_off : 0}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div>
                  </div>

                  <div className=" form-group row mt-3 ">
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          TCS: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="tcs"
                        name="tcs"
                        required
                        readOnly
                        defaultValue={data.tcs ? data.tcs : 0}
                      />
                    </div>

                    <div className=" col-md-3 ">
                      <label className="col-form-label">
                        <b>
                          {" "}
                          Bill Amount: <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="bill_amount"
                        name="bill_amount"
                        defaultValue={data.bill_amount ? data.bill_amount : 0}
                        readOnly={true}
                        // required
                      />
                    </div>

                    <div className=" col-md-3 mt-4">
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_tds_applicable"
                        name="is_tds_applicable"
                        disabled
                        defaultChecked={
                          data.is_tds_applicable == 1 ? true : false
                        }
                      />
                      <label className="col-form-label">
                        <b>TDS Applicable:</b>
                      </label>
                    </div>
                    <div className=" col-md mt-4">
                      {/* {authority && ( */}
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_tcs_applicable"
                        name="is_tcs_applicable"
                        defaultChecked={
                          data.is_tcs_applicable == 1 ? true : false
                        }
                        disabled

                        // onChange={(e) => handleTcsApplicable(e)}

                        // disabled={
                        //   userSessionData.TCS_Applicable === "false"
                        //     ? true
                        //     : false
                        // }
                      />
                      {/* )} */}
                      <label className="col-form-label">
                        <b>TCS Applicable:</b>
                      </label>
                    </div>
                  </div>

                  {/* {showTdsFileds && ( */}
                  <div className=" form-group row mt-3 ">
                    <div className=" col-md mt-4">
                      <input
                        className="sm-1"
                        type="checkbox"
                        style={{ marginRight: "8px", marginLeft: "10px" }}
                        id="is_original_bill_needed"
                        name="is_original_bill_needed"
                        disabled
                        defaultChecked={
                          data.is_original_bill_needed == 1 ? true : false
                        }
                        // disabled={data && data.access.Update_Bill ? false : true}
                      />
                      <label className="col-form-label">
                        <b>Original Bill Needed</b>
                      </label>
                    </div>
                    {console.log("d1",data)}

                    <div className="col-md-3  ">
                      <label className="col-form-label">
                        <b>TDS section : </b>
                      </label>
                      {sectionDropdown && data ? (
                        <Select
                          type="text"
                          id="tds_section"
                          name="tds_section"
                          isDisabled
                          defaultValue={
                            data &&
                            sectionDropdown.filter(
                              (d) => d.value == data.tds_section
                            )
                          }
                        />
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          TDS Constitution : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      {/* {tdsData && tdsData.length > 0 && ( */}
                      <span>
                        {constitutionDropdown && (
                          <Select
                            id="tds_constitution"
                            name="tds_constitution"
                            readOnly
                            options={constitutionDropdown}
                            isDisabled
                            // onChange={handleTdsPercentage}
                            defaultValue={
                              data &&
                              constitutionDropdown &&
                              constitutionDropdown.filter(
                                (d) =>
                                  d.value == parseInt(data.tds_constitution)
                              )
                            }
                          />
                        )}
                      </span>
                      {/* )} */}
                    </div>
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          TDS % : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="tds_percentage"
                        name="tds_percentage"
                        defaultValue={data.tds_percentage}
                        readOnly={true}
                        onKeyPress={(e) => {
                          Validation.NumbersSpeicalOnlyDot(e);
                        }}
                      />
                    </div>
                  </div>
                  {/* )} */}

                  <div className=" form-group row mt-3 ">
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          TDS Amount : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="tds_amount"
                        name="tds_amount"
                        readOnly
                        defaultValue={data.tds_amount ? data.tds_amount : 0}
                        // defaultValue={data.tds_amount}
                      />
                    </div>
                    <div className=" col-md-3 ">
                      <label className=" col-form-label">
                        <b>
                          {" "}
                          Net Payment : <Astrick color="red" size="13px" />
                        </b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="net_payment"
                        name="net_payment"
                        readOnly
                        defaultValue={data.net_payment ? data.net_payment : 0}
                      />
                      <span
                        className="fw-bold"
                        style={{ fontStyle: "italic", color: "red" }}
                      >
                        {data && data.bill_amount_in_words
                          ? data.bill_amount_in_words
                          : ""}
                      </span>
                    </div>
                    <div className=" col-md-4 ">
                      <label className=" col-form-label">
                        <b> Remark: </b>
                      </label>
                      <textarea
                        type="text"
                        className="form-control form-control-sm"
                        id="narration"
                        name="narration"
                        rows="4"
                        readOnly={true}
                        // defaultValue={data.narration ? data.narration : ""}
                      />
                    </div>
                    <div className="form-group row mt-3">
  <div className="col-md-3">
    <label className="col-form-label">
      <b> Remark History: </b>
    </label>
    <textarea
      type="text"
      className="form-control form-control-sm"
      id="remark"
      name="remark"
      readOnly
      rows="4"
      defaultValue={data.remark ? data.remark : ""}
    />
  </div>
  <div className="col-md-3">
    <label className="col-form-label">
      <b>Internal Audit Remark: </b>
    </label>
    <textarea
      type="text"
      className="form-control form-control-sm"
      id="audit_remark"
      name="audit_remark"
      readOnly={true}
      rows="4"
    />
  </div>
  <div className="col-md-3">
    <label className="col-form-label">
      <b> External Audit Remark: </b>
    </label>
    <textarea
      type="text"
      className="form-control form-control-sm"
      id="external_audit_remark"
      name="external_audit_remark"
      readOnly
      rows="4"
    />
  </div>
</div>

                    
                    <div className=" col-md-3 mt-4">
                        <input
                          className="sm-1"
                          type="checkbox"
                          style={{ marginRight: "8px", marginLeft: "10px" }}
                          id="authorized_by_management"
                          name="authorized_by_management"
                          // onChange={(e) => handleTdsApplicable(e)}
                          defaultChecked={
                            data.authorized_by_management == 1 ? true : false
                          }

                          disabled={true}
                        />
                        <label className="col-form-label">
                          <b>Authorised by management:</b>
                        </label>
                      </div>

                      <div className=" col-md mt-4">
                        <input
                          className="sm-1"
                          type="checkbox"
                          style={{ marginRight: "8px", marginLeft: "10px" }}
                          // disabled={
                          //   data && data.access.TCS_Applicable ? false : true
                          // }
                          id="authorized_by_hod"
                          name="authorized_by_hod"
                          // onChange={(e) => handleTcsApplicable(e)}
                          disabled={true}
                          defaultChecked={
                            data.authorized_by_hod == 1 ? true : false
                          }

                        />
                        <label className="col-form-label">
                          <b>Authorised by HOD :</b>
                        </label>
                      </div>
                  </div>

                  <div className="col-mt-4">

                  {data && data.attachment && (
                    <div
                      className="d-flex justify-content-start mt-2"
                      style={{ overflowX: "auto" }}
                    >
                      {data &&
                        data.attachment.map((attach, index) => {
                          return (
                            <div
                              className="justify-content-start"
                              style={{
                                marginRight: "5px",
                                padding: "0px",
                                width: "auto",
                              }}
                            >
                              <div
                                className="card"
                                style={{ backgroundColor: "#EBF5FB" }}
                              >
                                <div className="card-header">
                                  <p style={{ fontSize: "12px" }}>
                                    <b>{attach.name}</b>
                                  </p>
                                  <div className="d-flex justify-content-end p-0">
                                    <a
                                      href={`${attach.path}`}
                                      target="_blank"
                                      className="btn btn-warning btn-sm p-0 px-1"
                                      disabled

                                    >
                                      <i
                                        className="icofont-download"
                                        style={{
                                          fontSize: "10px",
                                          height: "15px",
                                        }}
                                        disabled

                                      ></i>
                                    </a>

                                    <button
                                      className="btn btn-danger text-white btn-sm p-0 px-1"
                                      type="button"
                            disabled

                                      // disabled={
                                      //   authorities &&
                                      //   authorities.Edit_In_Bill === false
                                      //     ? true
                                      //     : false
                                      // }
                                      // onClick={(e) => {
                                      //   handleDeleteAttachment(e, attach.id);
                                      // }}
                                    >
                                      <i
                                        className="icofont-ui-delete"
                                        style={{ fontSize: "12px" }}
                                      ></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                    {/* <label className="form-label font-weight-bold">
                      Status :<Astrick color="red" size="13px" />
                    </label>
                    <div className="row"> */}
                    {/* <div className="col-md-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active"
                            value="1"
                            defaultChecked={true}
                            disabled
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active_1"
                          >
                            Active
                          </label>
                        </div>
                      </div> */}
                    {/* <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="is_active"
                            id="is_active"
                            value="0"
                            disabled
                            // readOnly={(modal.modalData) ? false : true}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="is_active"
                          >
                            Deactive
                          </label>
                        </div>
                      </div> */}

                    {/* <div className=" col-md-3">
                      <label className="form-label font-weight-bold">
                        Approved Status :<Astrick color="red" size="13px" />
                      </label>
                    </div> */}

                    {/* <div className=" col-md-2">
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status"
                              value="1"
                              disabled={true}
                              // defaultChecked={true}
                              checked={data.approved_status}
                            />

                            <label
                              className="form-check-label"
                              htmlFor="status"
                            >
                              Approve
                            </label>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="status"
                              id="status"
                              value="2"
                              disabled={true}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="status"
                            >
                              Reject
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    </div> */}
                  </div>
                </div>
                <div className="col-md mt-3">
                  {data &&
                    Object.entries(data.iteration_data).map(
                      ([iteration, values]) => (
                        <div className="table-responsive" key={iteration}>
                          <h2>Iteration : {iteration}</h2>
                          <table
                            className="table table-bordered mt-3 table-responsive"
                            id="tab_logic"
                          >
                            <thead>
                              <tr>
                                <th
                                  className="text-center"
                                  style={{ width: "100px" }}
                                >
                                  {" "}
                                  Total Approval Level Count{" "}
                                </th>
                                <th
                                  className="text-center"
                                  style={{ width: "100px" }}
                                >
                                  {" "}
                                  Level{" "}
                                </th>

                                <th
                                  className="text-center"
                                  style={{ width: "300px" }}
                                >
                                  {" "}
                                  Approvals Name{" "}
                                </th>

                                <th
                                  className="text-center"
                                  style={{ width: "300px" }}
                                >
                                  {" "}
                                  Approvals Required Name
                                </th>
                                <th
                                  className="text-center"
                                  style={{ width: "300px" }}
                                >
                                  {" "}
                                  Approved By{" "}
                                </th>

                                <th
                                  className="text-center"
                                  style={{ width: "300px" }}
                                >
                                  {" "}
                                  Rejected By{" "}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {values &&
                                Object.entries(values).map(([key, value]) => (
                                  <tr key={key}>
                                    <td>
                                      {value && value.totalApprovalLevelCount}
                                    </td>
                                    <td>{value && value.level}</td>

                                    <td>{value && value.total_approvals}</td>

                                    <td>
                                      {value && value.approvals_required_name}
                                    </td>
                                    <td>{value && value.approvedBy}</td>

                                    <td>{value && value.rejectedBy}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}

                  {/* {console.log("d",data.iteration_data.map((i)=>i.level))} */}
                  {/* <div className="table-responsive">
                      <table
                        className="table table-bordered mt-3 table-responsive"
                        id="tab_logic"
                      >
                        <thead>
                          <tr>
                          <th className="text-center"> Iteration </th>


                            <th className="text-center"> Level </th>
                            <th className="text-center"> Total Approval Level Count </th>

                            <th className="text-center">Total Approvals </th>



                            <th className="text-center"> Approvals Required Name</th>
                            <th className="text-center"> Rejected By </th>

                          </tr>
                        </thead>
                        <tbody>

                          {Object.entries(data.iteration_data).map(([iteration, values]) => (
                            Object.entries(values).map(([key, value]) => (


                              <tr key={key}>
                                {/* {data && JSON.stringify(value)} */}
                  {/* <td>{value.iteration}</td>

                                <td>{value.level}</td>
                                <td>{value.totalApprovalLevelCount}</td>

                                <td>{value.total_approvals}</td>


                                <td>{value.approvals_required_name}</td>
                                <td>{value.rejectedBy}</td>



                              </tr>

                            ))
                          ))}

                        </tbody>
                      </table>
                    </div> */}
                </div>
                {/* <div className="col-md">
                    <div className=" col-md-10 mt-3">
                      <label className="form-label font-weight-bold mx-2">
                       Approvers:    <Astrick color="red" size="13px" />
                      </label>
                      {data && data.level_approver == null ? "Not yet approved" : <span className="fw-bold"> {data.level_approver} </span>}
                    </div>
                    <div className=" col-md-10 mt-3">
                      <label className="form-label font-weight-bold mx-2">
                        Approved By:    <Astrick color="red" size="13px" />
                      </label>
                      {data && data.last_approved_by == null ? "Not yet approved" : <span className="fw-bold"> {data.last_approved_by} </span>}
                    </div>
                </div> */}
                {/* CARD */}

                <div className="mt-3" style={{ textAlign: "right" }}>
                  {/* <button type="submit" className="btn btn-primary">
                                    Update
                                </button> */}
                  <Link
                    to={`/${_base}/BillCheckingTransaction`}
                    className="btn btn-danger text-white"
                  >
                    Cancel
                  </Link>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from 'react-router-dom';
// import { _base, userSessionData } from '../../../settings/constants';
// import { Spinner, Modal } from 'react-bootstrap';
// import Alert from '../../../components/Common/Alert';
// import { _attachmentUrl } from "../../../settings/constants";
// import { getAttachment } from "../../../services/OtherService/AttachmentService";
// import ErrorLogService from "../../../services/ErrorLogService";
// import BillCheckingService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
// import PageHeader from "../../../components/Common/PageHeader";
// import StatusCard from "../../../components/Ticket/StatusCard";
// import Attachment from '../../../components/Common/Attachment';
// import Chart from "react-apexcharts";

// // import { EditorState } from "draft-js";
// // import Editor from "draft-js-plugins-editor";
// // import createMentionPlugin, { defaultSuggestionsFilter } from "draft-js-mention-plugin";
// // import "draft-js/dist/Draft.css";
// // import "draft-js-mention-plugin/lib/plugin.css";
// // import mentions from "./mentions";
// // import { convertToHTML } from "draft-convert";
// // const mentionPlugin = createMentionPlugin();
// // const { MentionSuggestions } = mentionPlugin;
// // const plugins = [mentionPlugin];

// export default function ViewBillTransaction ({match}){
//     const id = match.params.id

//     const [showLoaderModal, setShowLoaderModal] = useState(false);
//     const [data, setData] = useState()
//     const [notify, setNotify] = useState()
//     const [attachment, setAttachment] = useState()
//     // const [suggestions, setSuggestions] = useState(mentions);
//     const [idCount, setIdCount] = useState([]);
//     const [commentData, setCommentData] = useState({
//         id: id,
//         userId: localStorage.getItem("id"),
//         comments: [],
//     });
//     const [chart, setChart] = useState(null);

//  const editor = useRef(null);

//  const onSearchChange = ({ value }) => {
//     // setSuggestions(defaultSuggestionsFilter(value, ));
// };

// const onAddMention = (e) => {
//     setIdCount(idCount => [...idCount, e.id]);
// };

// //  const [editorState, setEditorState] = useState(() =>
// //  EditorState.createEmpty()
// // );

//  const focusEditor = () => {
//     editor.current.focus();
// };

//  const loadData = async ()=>{
//     await new BillCheckingService().getBillCheckingById(id).then((res)=>{
//         if(res.status === 200){
//             if(res.data.status ==1 ){
//                 setData (res.data.data)
//             }
//         }
//     })
//  }
//     useEffect(() => {
//         loadData();
//     }, [])

//     return (
//         <div className="container-xxl">

//             <PageHeader headerTitle={`Bill - ${data ? data.bc_id : ""}`} />

//             {notify && <Alert alertData={notify} />}

// {data &&

//                 <div className="col-xxl-12 col-xl-8 col-lg-12 col-md-12">

//                     <div className="row g-3 mb-3">
//                         <div className="col-md-3">
//                             <StatusCard progress={ data.is_active ==1 ? "active" : "deactive"}
//                                 progressBg="bg-warning" iconClass="icofont-optic fs-4" iconbg="bg-lightyellow" title="Status" />
//                         </div>
//                         <div className="col-md-3">
//                             <StatusCard progress={ data.created_by }
//                                 progressBg="bg-info"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Created By" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.bill_type }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Bill Type" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.vendor_name }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Vendor Name" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.vendor_name }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Vendor Name" />
//                         </div>

//                           <div className="col-md-3">
//                             <StatusCard progress={ data.bill_date }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Bill Date" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.received_date }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Received Date" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.debit_advance }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Debit Advance" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.gst_amount ? data.gst_amount : data.igst_amount }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="GST/IGST" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.taxable_amount }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Taxable Amount" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.round_off }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Round Off" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.tcs }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="TCS" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.bill_amount }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Bill Amount" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.tds_amount ? data.tds_amount : 0 }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="TDS" />
//                         </div>

//                         <div className="col-md-3">
//                             <StatusCard progress={ data.net_payment }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Net Payment" />
//                         </div>

//                     </div>

//                     <div className="row g-3 mb-3">
//                         <div className="col-md-12">
//                             <div className="card mb-3">
//                                 <div className="card-body">
//                                     <h6 className="fw-bold mb-3 text-danger">Remark</h6>
//                                     <p>{data.remark}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row g-3 mb-3">
//                         <div className="col-md-12">
//                             <div className="card mb-3">
//                                 <div className="card-body">
//                                     <h6 className="fw-bold mb-3 text-danger">Internal Audit Remark</h6>
//                                     <p>{data.internal_audit_remark}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row g-3 mb-3">
//                         <div className="col-md-12">
//                             <div className="card mb-3">
//                                 <div className="card-body">
//                                     <h6 className="fw-bold mb-3 text-danger">External Audit Remark</h6>
//                                     <p>{data.external_audit_remark}</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="row g-3 ">
//                         <div className="col-lg-6 col-md-6">
//                             {/* <AttechedCard data={BugImageAttechedData} /> */}
//                         </div>
//                     </div>

//                     <div className="row mb-3">
//                         <div className="col-md-12">
//                             <div className="card mb-3">
//                                 <div className="card-body">
//                                     <h6 className="fw-bold mb-3 text-danger">Attachments</h6>
//                                     {/* <Attachment refId={data ? data.id : ""}/> */}
//                                     {attachment && <div className="flex-grow-1">{
//                                         attachment.map((data, i) => {
//                                             return <div key={"cuhdus" + i} className=" d-flex align-items-center border-bottom">

//                                                 <div className="d-flex ms-3 align-items-center flex-fill">
//                                                     <span className={`avatar lg fw-bold  rounded-circle text-center d-flex align-items-center justify-content-center`}>
//                                                         {i + 1})
//                                                     </span>
//                                                     <div className="d-flex flex-column ">
//                                                         <h6 className="fw-bold mb-0 small-14">{data.invoice_attachment}</h6>
//                                                     </div>
//                                                 </div>
//                                                 <a href={`${_attachmentUrl}${data.invoice_attachment}`}
//                                                     target='_blank'
//                                                     download
//                                                     className='btn btn-primary btn-sm'
//                                                 >
//                                                     <i class="icofont-download"></i> Download
//                                                 </a>
//                                                 {/* <button type="button" className="btn btn-sm btn-primary">Download</button> */}
//                                             </div>
//                                         })
//                                     }
//                                     </div>
//                                     }
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//                 /* <div className="col-md-3">
//                             <StatusCard progress={ data.assign_to }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Assign To" />
//                         </div>

//                         <div className="col-md-4">
//                             <StatusCard progress={ data.received_date }
//                                 progressBg="bg-primary"
//                                 iconClass="icofont-user fs-3"
//                                 iconbg="bg-lightblue"
//                                 title="Received Date" />
//                         </div> */}

//             <Modal show={showLoaderModal} centered >
//                 <Modal.Body className="text-center">
//                     <Spinner animation="grow" variant="primary" />
//                     <Spinner animation="grow" variant="secondary" />
//                     <Spinner animation="grow" variant="success" />
//                     <Spinner animation="grow" variant="danger" />
//                     <Spinner animation="grow" variant="warning" />
//                     <Spinner animation="grow" variant="info" />
//                     <Spinner animation="grow" variant="dark" />
//                 </Modal.Body>
//             </Modal>

//         </div>
//     )
// }
