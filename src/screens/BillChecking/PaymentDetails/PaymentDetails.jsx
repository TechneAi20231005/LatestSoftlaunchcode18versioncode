import React, { useEffect, useState, useRef } from "react";
import { Modal, Dropdown } from "react-bootstrap";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import CountryService from "../../../services/MastersService/CountryService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from "react-select";
import { Astrick } from "../../../components/Utilities/Style";
import * as Validation from "../../../components/Utilities/Validation";
import Alert from "../../../components/Common/Alert";
import StateService from "../../../services/MastersService/StateService";
import CityService from "../../../services/MastersService/CityService";
import PaymentTemplateService from "../../../services/Bill Checking/Masters/PaymentTemplateService";
import { Link, useParams } from "react-router-dom";
import { _base, userSessionData } from "../../../settings/constants";
import BillCheckingService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import PaymentDetailsService from "../../../services/Bill Checking/PaymentDetailsService";
import DropdownService from "../../../services/Bill Checking/Bill Checking Transaction/DropdownService";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import BillCheckingTransactionService from "../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { PaymentDetailsSilce } from "./PaymentDetailsSlice";
import { getPaymentDetails } from "./PaymentDetailsAction";

function PaymentDetails({ location, match }) {
  const { id } = useParams();
  const [ip, setIp] = useState("");

  const dispatch = useDispatch();
  const getPaymentDetailsData = useSelector(
    (PaymentDetailsSilce) =>
      PaymentDetailsSilce.paymentDetails.paymentDetailsData
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://api.ipify.org/?format=json");
        setIp(res.data.ip);
      } catch (error) {}
    };
    fetchData();
  }, []);
  const [data, setData] = useState(null);
  const [authorities, SetAuthorities] = useState();
  const [notify, setNotify] = useState();
  const [modal, setModal] = useState({
    showModal: false,
    modalData: "",
    modalHeader: "",
  });
  const [deta, setDeta] = useState();

  const handleModal = (data) => {
    setModal(data);
  };
  const statusDropdownRef = useRef();
  const searchRef = useRef();

  function searchInData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === "string" &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  const [searchTerm, setSearchTerm] = useState("");

  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (value) => {};

  let formattedMaxDate;
  const paymentDateStr = modal.modalData.payment_date;
  const paymentDate = new Date(paymentDateStr);
  if (paymentDate) {
    if (!isNaN(paymentDate.getTime())) {
      const maxDate = new Date(paymentDate);

      maxDate.setFullYear(paymentDate.getFullYear() + 1);

      const formattedPaymentDate = paymentDate.toISOString().split("T")[0];
      formattedMaxDate = maxDate.toISOString().split("T")[0];
    }
  }

  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [CountryDropdown, setCountryDropdown] = useState();
  const [stateDropdown, setStateDropdown] = useState();
  const [cityDropdown, setCityDropdown] = useState();
  const fileInputRef = useRef(null);
  const userId = sessionStorage.getItem("id");
  const [exportData, setExportData] = useState();

  const loadData = async () => {
    dispatch(getPaymentDetails(id, userId));
    const data = [];
    const ExportTempData = [];
    await new PaymentDetailsService()
      .getPaymentDetails(id, userId)
      .then((res) => {
        if (res.status === 200) {
          let counter = 1;

          const temp = res.data.data;

          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              amount_to_be_paid: temp[key].amount_to_be_paid,
              payment_status_name: temp[key].payment_status_name,
              payment_date: temp[key].payment_date,
              remark: temp[key].remark,
              actual_payment_date: temp[key].actual_payment_date,
              payment_ref_number: temp[key].payment_ref_number,
              payment_reference_number: temp[key].payment_reference_number,
              payment_status: temp[key].payment_status,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_by: temp[key].updated_by,
              bill_date: temp[key].bill_date,
            });
          }
          setData(null);
          setData(data);
          setDeta(res.data.access);

          for (const key in temp) {
            ExportTempData.push({
              sr_no: ExportTempData.length + 1,
              bill_id: temp[key].bc_id,
              amount_to_be_paid: temp[key].amount_to_be_paid,
              payment_status_name: temp[key].payment_status_name,
              payment_date: temp[key].payment_date,
              remark: temp[key].remark,
              actual_payment_date: temp[key].actual_payment_date,
              payment_reference_number: temp[key].payment_reference_number,
            });
          }
          setExportData(ExportTempData);
        }
      });

    await new BillCheckingTransactionService()
      .getUpdatedAuthorities()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status) {
            const a = res.data.data;
            SetAuthorities(res.data.data);
          }
        }
      });

    await new DropdownService().getDropdown().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setStatusDropDown(
            res.data.data.map((d) => ({
              value: d.id,
              label: d.convention_name,
            }))
          );
        }
      }
    });
  };

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <span>
          {row.payment_status_name === "Paid" ? (
            <button
              type="button"
              className="btn btn-sm btn-info "
              data-bs-toggle="modal"
              disabled={
                authorities && authorities.Allow_Paid_Entry_Change === false
                  ? true
                  : false
              }
              onClick={(e) => {
                handleModal({
                  showModal: true,
                  modalData: row,
                  modalHeader: "Edit Payment Details",
                });
              }}
              data-bs-target="#depedit"
              style={{ borderRadius: "20px" }}
            >
              <i class="icofont-edit text-white"></i>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-sm btn-info "
              data-bs-toggle="modal"
              disabled={
                (authorities &&
                  authorities.Update_Payment_Details === false &&
                  authorities.Prepone_Payment_Date === false &&
                  authorities &&
                  authorities.Payment_Status_Release === false) ||
                row.payment_status_name == "Confirmation Pending"
                  ? true
                  : false
              }
              onClick={(e) => {
                handleModal({
                  showModal: true,
                  modalData: row,
                  modalHeader: "Edit Payment Details",
                });
              }}
              data-bs-target="#depedit"
              style={{ borderRadius: "20px" }}
            >
              <i class="icofont-edit text-white"></i>
            </button>
          )}
        </span>
      ),
    },

    { name: "Sr No", selector: (row) => row.counter, sortable: true },
    {
      name: "Amount To Be Paid",
      selector: (row) => row.amount_to_be_paid,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.payment_status_name,
      sortable: true,
    },
    {
      name: "Payment Date",
      selector: (row) => row.payment_date,
      sortable: true,
    },
    { name: "Remark", selector: (row) => row.remark, sortable: true },
    {
      name: "Actual Payment Date.",
      selector: (row) => row.actual_payment_date,
      sortable: true,
    },
    {
      name: "Payment Ref No.",
      selector: (row) => row.payment_reference_number,
      sortable: true,
    },
  ];

  const [statusDropDown, setStatusDropDown] = useState();

  const [importModal, setImportModal] = useState({
    ishowModal: false,
    imodalData: "",
    imodalHeader: "",
  });

  const handleImportModal = (data) => {
    setImportModal(data);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    var a = statusDropdownRef.current.getValue().map((d) => d.value);
    const form = new FormData(e.target);

    if (!form.has("payment_status")) {
      form.append("payment_status", modal.modalData.payment_status);
    }

    form.append("created_by", modal.modalData.created_by);
    form.append("client_ip_address", ip);

    setNotify(null);
    // if (!id) {
    await new PaymentDetailsService()
      .updatePaymentDetails(form)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setNotify({ type: "success", message: res.data.message });
            setModal({ showModal: false, modalData: "", modalHeader: "" });
            loadData();
          } else {
            setNotify({ type: "danger", message: res.data.message });
          }
        } else {
          setNotify({ type: "danger", message: res.data.message });
          new ErrorLogService().sendErrorLog(
            "Payment_template",
            "Create_Payment_template",
            "INSERT",
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: "danger", message: "Request Error !!!" });
        new ErrorLogService().sendErrorLog(
          "Payment_template",
          "Create_Payment_template",
          "INSERT",
          errorObject.data.message
        );
      });
  };

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
    setNotify(null);
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Payment Details" />
      {/* SEARCH FILTER */}
      <div className="card card-body">
        <div className="row">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={() => handleSearch(searchTerm)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
          </div>
        </div>
      </div>
      <ExportToExcel
        className="btn btn-sm btn-danger mt-3"
        apiData={exportData}
        fileName="Payment Details"
      />

      {/* DATA TABLE */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={getPaymentDetailsData.filter((customer) => {
                    if (typeof searchTerm === "string") {
                      if (
                        typeof customer === "string" ||
                        typeof customer === "number"
                      ) {
                        // Convert numbers to strings and check if it includes the searchTerm
                        const customerString = customer.toString();
                        return customerString.includes(
                          searchTerm.toLowerCase()
                        );
                      } else if (typeof customer === "object") {
                        // If customer is an object, check if any string or number value within the object includes the searchTerm
                        const found = Object.values(customer).some(
                          (value) =>
                            (typeof value === "string" ||
                              typeof value === "number") &&
                            value
                              .toString()
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        );
                        return found;
                      }
                    }
                    return false; // Default case: searchTerm or customer is not a string
                  })}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD VENDOR */}
      <Modal
        centered
        show={modal.showModal}
        size="lg"
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: "",
            modalHeader: "",
          });
        }}
      >
        <form
          method="post"
          onSubmit={(e) =>
            handleForm(e, modal.modalData ? modal.modalData.id : "")
          }
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          {deta && (
            <Modal.Body>
              <div className="deadline-form">
                <input
                  type="hidden"
                  name="id"
                  id="id"
                  defaultValue={modal.modalData.id}
                />

                <div className="row g-3 mb-3">
                  <div className="col-sm-3 mt-4">
                    <label className="form-label font-weight-bold">
                      Amount To Be Paid :<Astrick color="red" size="13px" />
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="amount_to_be_paid"
                      name="amount_to_be_paid"
                      maxLength={13}
                      onKeyPress={(e) => {
                        const allowedKeys = [
                          "0",
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          ".",
                          "Backspace",
                        ];
                        const inputValue = e.key;

                        if (!allowedKeys.includes(inputValue)) {
                          e.preventDefault();
                        }

                        const currentInput = e.target.value;
                        const decimalIndex = currentInput.indexOf(".");

                        if (inputValue === "." && decimalIndex !== -1) {
                          e.preventDefault(); // Prevent entering more than one decimal point
                        }

                        if (
                          decimalIndex !== -1 &&
                          currentInput.length - decimalIndex > 2
                        ) {
                          e.preventDefault(); // Prevent more than two decimal places
                        }

                        if (
                          currentInput.length >= 10 &&
                          inputValue !== "." &&
                          decimalIndex === -1
                        ) {
                          e.preventDefault(); // Limit total length excluding decimal point to 10 characters
                        }
                      }}
                      readOnly={
                        (modal.modalData &&
                          modal.modalData.payment_status == 15) ||
                        (authorities &&
                          authorities.Update_Payment_Details === false &&
                          authorities.Payment_Status_Release === true) ||
                        (authorities &&
                          authorities.Prepone_Payment_Date === true)
                          ? true
                          : false
                      }
                      defaultValue={
                        modal.modalData ? modal.modalData.amount_to_be_paid : ""
                      }
                    />
                  </div>

                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Status : <Astrick color="red" size="13px" />
                    </label>
                    <>
                      {statusDropDown && statusDropDown && (
                        <Select
                          className="form-control"
                          id="payment_status"
                          name="payment_status"
                          type="hidden"
                          options={
                            authorities &&
                            authorities.Payment_Status_Release === true
                              ? statusDropDown.filter(
                                  (option) => option.value === 17
                                )
                              : statusDropDown
                          }
                          ref={statusDropdownRef}
                          isDisabled={
                            (modal.modalData &&
                              authorities.Update_Payment_Details == true &&
                              authorities.Prepone_Payment_Date == false &&
                              authorities.Allow_Paid_Entry_Change === false) ||
                            (authorities.Allow_Paid_Entry_Change == true &&
                              authorities.Update_Payment_Details == false &&
                              authorities.Prepone_Payment_Date == false) ||
                            (authorities.Prepone_Payment_Date !== true &&
                              authorities.Update_Payment_Details == false &&
                              authorities.Allow_Paid_Entry_Change == false) ||
                            (authorities.Prepone_Payment_Date === true &&
                              authorities.Update_Payment_Details == true &&
                              authorities.Allow_Paid_Entry_Change == false) ||
                            (authorities.Prepone_Payment_Date === true &&
                              authorities.Update_Payment_Details == false &&
                              authorities.Allow_Paid_Entry_Change == true &&
                              modal.modalData.payment_status == 15) ||
                            (authorities.Allow_Paid_Entry_Change === true &&
                              authorities.Update_Payment_Details === true &&
                              (modal.modalData.payment_status == 16 ||
                                modal.modalData.payment_status == 17 ||
                                modal.modalData.payment_status == 14)) ||
                            (authorities.Allow_Paid_Entry_Change === true &&
                              authorities.Update_Payment_Details === true &&
                              modal.modalData.payment_status === "15")
                              ? false
                              : true
                          }
                          required={true}
                          defaultValue={
                            modal.modalData &&
                            statusDropDown.find(
                              (d) => d.value == modal.modalData.payment_status
                            )
                          }
                        />
                      )}
                    </>
                  </div>

                  <div className="col-sm-3 mt-4">
                    <label className="form-label font-weight-bold">
                      Payment Date : <Astrick color="red" size="13px" />
                    </label>

                    {authorities &&
                    authorities.Prepone_Payment_Date === true ? (
                      <input
                        type="date"
                        className="form-control"
                        id="payment_date"
                        name="payment_date"
                        required={true}
                        readOnly={
                          authorities &&
                          authorities.Payment_Status_Release === true
                            ? true
                            : false
                        }
                        defaultValue={
                          modal.modalData ? modal.modalData.payment_date : ""
                        }
                        max={formattedMaxDate && formattedMaxDate}
                        min={
                          modal.modalData.payment_status_name === "Paid"
                            ? modal.modalData.payment_date
                            : modal.modalData.bill_date
                        }
                      />
                    ) : (
                      <input
                        type="date"
                        className="form-control"
                        id="payment_date"
                        name="payment_date"
                        readOnly={
                          authorities &&
                          authorities.Payment_Status_Release === true
                            ? true
                            : false
                        }
                        required={true}
                        defaultValue={
                          modal.modalData ? modal.modalData.payment_date : ""
                        }
                        min={modal.modalData.payment_date}
                        max={formattedMaxDate && formattedMaxDate}
                      />
                    )}
                  </div>

                  <div className="col-sm-5">
                    <label className="form-label font-weight-bold">
                      Remark : <Astrick color="red" size="13px" />
                    </label>

                    <textarea
                      type="text"
                      className="form-control"
                      rows="4"
                      id="remark"
                      name="remark"
                      required={true}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
          )}
          <Modal.Footer>
            {modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: "#484C7F" }}
              >
                Update
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleModal({
                  showModal: false,
                  modalData: "",
                  modalHeader: "",
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
      {/** IMPORT MODAL **/}
      <Modal
        centered
        show={importModal.ishowModal}
        size="sm"
        onHide={(e) => {
          handleImportModal({
            ishowModal: false,
            imodalData: "",
            imodalHeader: "",
          });
        }}
      >
        <form method="post" encType="multipart/form-data">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className=""></div>

            <div className=" col-sm ">
              <label className="col-form-label">
                <b>Upload Excel/CSV File :</b>
              </label>
              <input
                type="file"
                name="attachment"
                id="attachment"
                className="form-control"
              ></input>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: "#484C7F" }}
            >
              Import
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentDetails;
