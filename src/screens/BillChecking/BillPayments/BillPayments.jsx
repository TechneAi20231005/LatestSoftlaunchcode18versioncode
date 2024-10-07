import React, { useEffect, useState, useRef } from 'react';
import Alert from '../../../components/Common/Alert';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import BillTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';
import { Link } from 'react-router-dom';
import { Modal, Dropdown, Col, Collapse, Button, Fade } from 'react-bootstrap';
import { _base, userSessionData } from '../../../settings/constants';
import BillPaymentServices from '../../../services/Bill Checking/BillPaymentsServices/BillPaymentsServices';
import DataTable from 'react-data-table-component';
import { ExportBillPaymentFile } from '../../../components/Utilities/Table/ExportBillPaymentFile';
import { Table } from 'react-bootstrap';

import axios from 'axios';
import { _attachmentUrl } from '../../../settings/constants';
import { Astrick } from '../../../components/Utilities/Style';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

const BillPayments = () => {
  const dispatch = useDispatch();
  const [filteredData, setFilteredData] = useState();
  const [open, setOpen] = useState(false);

  const [exportFilteredData, setExportFilteredData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [notify, setNotify] = useState();
  const roleId = sessionStorage.getItem('role_id');

  const [billTypeDropdown, setBillTypeDropdown] = useState(null);
  const [data, setData] = useState();
  const [d, setD] = useState();

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [modals, setModals] = useState({
    showModals: false,
    modalsData: '',
    modalsHeader: ''
  });

  const handleModal = (data) => {
    setModal(data);
  };

  const handleModals = (data) => {
    setModals(data);
  };

  const handleData = async (e, row) => {
    const payload = {
      bill_type: row['bill Type Id'] ? row['bill Type Id'] : '',
      vendor_id: row['Vendor id'],
      date: tillDate
    };
    await new BillTransactionService()
      .getBillDetailsOfPaymentGrid(userSessionData.userId, payload)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setD(res.data.data);
          }
        }
      });
  };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <span>
          <button
            type="button"
            className="btn btn-sm btn-info "
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            style={{ borderRadius: '20px' }}
            onClick={(e) => {
              handleData(e, row);
              handleModals({
                showModals: true,
                modalsData: '',
                modalsHeader: ''
              });
            }}
          >
            <i class="icofont-eye-alt text-white"></i>
          </button>
        </span>
      )
    },
    {
      name: 'Sr.No',
      selector: (row) => row['Sr.No'],

      sortable: false
    },
    {
      name: 'Vendor Name',
      selector: (row) => row['Vendor Name'],
      sortable: false
    },

    { name: 'Bill Type', selector: (row) => row['Bill Type'], sortable: false },
    {
      name: 'Payment Date',
      selector: (row) => row['Payment Date'],
      sortable: false
    },
    {
      name: 'Payment Amount',
      selector: (row) => row['Payment Amount'],
      sortable: false
    },
    {
      name: 'Vendor Bill No',
      selector: (row) => row['Vendor Bill No'],
      sortable: false
    },
    { name: 'Bill ID', selector: (row) => row['Bill ID'], sortable: false },

    { name: 'Remark', selector: (row) => row['Remark'], sortable: false },
    {
      name: 'Beneficiary name',
      selector: (row) => row['Beneficiary name'],
      sortable: false
    },
    { name: 'Bank Name', selector: (row) => row['Bank Name'], sortable: false },
    {
      name: 'Branch Name',
      selector: (row) => row['Branch Name'],
      sortable: false
    },
    {
      name: 'Account Number',
      selector: (row) => row['Account Number'],
      sortable: false
    },
    { name: 'IFSC Code', selector: (row) => row['IFSC Code'], sortable: false }
  ];

  const [tillDate, setTillDate] = useState('');
  const [authorities, SetAuthorities] = useState();

  const handleTillDate = (e) => {
    setTillDate(e.target.value);
  };

  const handleDownloadPayment = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    await new BillPaymentServices().downloadTxtFile(form).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
        }
      }
    });
  };

  const loadData = async () => {
    await new BillTransactionService()
      ._getBillTypeDataDropdown()
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            setData(res.data.data);
            setBillTypeDropdown(
              res.data.data.map((d) => ({ value: d.id, label: d.bill_type }))
            );
          }
        }
      });

    dispatch(getRoles());

    await new BillTransactionService().getUpdatedAuthorities().then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const a = res.data.data;

          SetAuthorities(res.data.data);
        }
      }
    });
  };

  const myForm = useRef();
  const handleForm = async (e) => {
    setIsLoading(true);

    e.preventDefault();
    const form = new FormData(e.target);
    const tempData = [];
    const FilterData = [];
    form.append('requestFor', myForm.current.buttonId);

    if (form.get('requestFor') == 'downloadButton') {
      await new BillPaymentServices().downloadTxtFile(form).then((res) => {
        if (res.status === 200) {
          setIsLoading(false);
          if (res.data.status == 1) {
            var a = res.data.fileName;
            URL = 'http://3.108.206.34/' + res.data.data;
            alert(res.data.data);
            window.open(URL, '_blank').focus();
          }
        }
      });
    } else {
      await new BillPaymentServices().getBillPayments(form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setIsLoading(false);

            let counter = 1;
            const temp = res.data.data;
            if (temp.length > 0) {
              for (const key in temp) {
                tempData.push({
                  'Sr.No': counter++,
                  'Vendor Name': temp[key].vendor_name,
                  'Bill Type': temp[key].bill_type,
                  'Payment Date': temp[key].payment_date,
                  'Payment Amount': temp[key].total_payment,
                  'Vendor Bill No': temp[key].bill_no,
                  'Bill ID': temp[key].bc_id,
                  'SBI Amount': temp[key].balance,
                  Remark: temp[key].remark,
                  'Beneficiary name': temp[key].beneficiary_name,
                  'Bank Name': temp[key].bank_name,
                  'Branch Name': temp[key].bank_branch_name,
                  'Account Number': temp[key].account_no,
                  'IFSC Code': temp[key].ifsc_code,
                  Tds: temp[key].tds_amount,
                  IGST: temp[key].igst_amount,

                  GST: temp[key].gst_amount,
                  'Net Payment': temp[key].net_payment,
                  'IFSC Code': temp[key].ifsc_code,

                  'Amount to be paid': temp[key].amount_to_be_paid,

                  'Payment status': temp[key].convention_name,

                  'Vendor id': temp[key].vendor_id,
                  'bill Type Id': temp[key].bill_type_id,
                  bill_amount: temp[key].bill_amount
                });
              }
              setFilteredData(tempData);
            }

            if (temp.length > 0) {
              for (const key in temp) {
                FilterData.push({
                  'Sr.No': counter++,
                  'Vendor Name': temp[key].vendor_name,
                  'Bill Type': temp[key].bill_type,
                  'Payment Date': temp[key].payment_date,
                  'Payment Amount': temp[key].total_payment,
                  'Vendor Bill No': temp[key].bill_no,
                  'Bill ID': temp[key].bc_id,
                  Remark: temp[key].remark,
                  'Beneficiary name': temp[key].beneficiary_name,
                  'Bank Name': temp[key].bank_name,
                  'Branch Name': temp[key].bank_branch_name,
                  'Account Number': temp[key].account_no,
                  'IFSC Code': temp[key].ifsc_code
                });
              }
              setFilteredData(tempData);
              setExportFilteredData(FilterData);
            }
          }
        }
      });
    }
  };

  const handlePaymentUpdate = async (e) => {
    e.preventDefault();
    setNotify(null);
    const formData = new FormData(e.target);
    await new BillPaymentServices().autoUpdatePayment(formData).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          setNotify({ type: 'success', message: res.data.message });
          setModal({ showModal: false, modalData: '', modalHeader: '' });
          loadData();
        } else {
          setNotify({ type: 'danger', message: res.data.message });
        }
      } else {
        setNotify({ type: 'danger', message: res.data.message });
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="container-xxl" style={{ width: '100%' }}>
        {notify && <Alert alertData={notify} />}
        <div className="d-flex justify-content-between align-items-center">
          <PageHeader
            headerTitle="Bill Payment"
            renderRight={() => {
              return (
                <div className="d-flex flex-row-reverse">
                  {authorities && authorities?.Bill_Payment === true && (
                    <button
                      type="button"
                      style={{
                        display:
                          authorities && authorities.Bill_Payment === false
                            ? 'none'
                            : 'block'
                      }}
                      className="btn btn-primary btn-set-task w-sm-100"
                      onClick={(e) => {
                        handleModal({
                          showModal: true,
                          modalData: '',
                          modalHeader: 'Upload Bank File'
                        });
                      }}
                    >
                      <i className="icofont-upload-alt  fs-6"></i>Auto Update
                      Payment
                    </button>
                  )}

                  {/* {filteredData && (
                    <ExportBillPaymentFile
                      className="btn btn-sm btn-danger"
                      apiData={exportFilteredData}
                      fileName="Bill Payemnt Report"
                    />
                  )} */}
                </div>
              );
            }}
          />

          <button
            onClick={() => setOpen(!open)}
            aria-controls="example-collapse-text"
            className="btn btn-warning text-white"
            aria-expanded={open}
          >
            <i className="icofont-filter" /> Filter
          </button>
        </div>

        <Collapse in={open}>
          <div id="example-collapse-text">
            <div className="card">
              <div className="card card-body">
                <form
                  method="POST"
                  onSubmit={(e) => handleForm(e)}
                  ref={myForm}
                >
                  <div className="row align-items-center justify-content-between">
                    <div className="col-md-6 d-flex gap-4">
                      <div className="col-md-6">
                        <label className=" col-form-label">
                          <b>Bill Type : </b>
                        </label>
                        {billTypeDropdown && (
                          <Select
                            type="text"
                            options={billTypeDropdown}
                            isMulti
                            id="bill_type"
                            name="bill_type[]"
                            placeholder="Bill Type"
                          />
                        )}
                      </div>
                      <div className="col-md-6">
                        <label className=" col-form-label">
                          <b>
                            Till Date :<Astrick color="red" />
                          </b>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="date"
                          name="date"
                          max={formattedDate}
                          required
                          onChange={(e) => handleTillDate(e)}
                        />
                      </div>
                    </div>
                    <div className="col-md-6 text-end">
                      <div className="btn btn-group  ">
                        {filteredData &&
                          authorities &&
                          authorities.Bill_Payment === true && (
                            <div className=" mt-3 ">
                              <button
                                className="btn  btn-info text-white"
                                name="buttonType"
                                defaultValue="downloadButton"
                                id="downloadButton"
                                type="submit"
                                onClick={(e) =>
                                  (myForm.current.buttonId = e.target.id)
                                }
                              >
                                Download Txt Files{' '}
                                <i className="icofont-download" />
                              </button>
                            </div>
                          )}
                      </div>

                      {/* <div className="col-md-2"> */}
                      <button
                        type="submit"
                        name="buttonType"
                        defaultValue="filterButton"
                        id="filterButton"
                        onClick={(e) => (myForm.current.buttonId = e.target.id)}
                        className="btn btn-primary text-white mt-3 "
                      >
                        Search
                      </button>

                      {filteredData && (
                        <ExportBillPaymentFile
                          className="btn btn-sm btn-danger mt-3"
                          apiData={exportFilteredData}
                          fileName="Bill Payemnt Report"
                        />
                      )}

                      {/* </div> */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Collapse>

        <div className="col-sm-12">
          {filteredData && filteredData.length > 0 ? (
            <div className="card mt-2">
              <DataTable
                columns={columns}
                progressComponent={<TableLoadingSkelton />}
                progressPending={isLoading}
                data={filteredData}
                defaultSortField="title"
                pagination
                selectableRows={false}
                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                highlightOnHover={true}
              />
            </div>
          ) : (
            <div className="card card-body mt-2">
              <p className="text-center">No Data Found</p>
            </div>
          )}
        </div>
      </div>
      <Modal
        centered
        show={modal.showModal}
        size="md"
        onHide={(e) => {
          handleModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
          });
        }}
      >
        <form
          method="post"
          onSubmit={handlePaymentUpdate}
          encType="multipart/form-data"
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className=" col-sm ">
              <label className="col-form-label">
                <b>Update Payment List :</b>
              </label>
              <input
                type="file"
                name="file"
                id="file"
                multiple
                className="form-control"
              ></input>
            </div>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              style={{ backgroundColor: '#484C7F' }}
            >
              Upload
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        centered
        show={modals.showModals}
        size="xl"
        onHide={(e) => {
          handleModals({
            showModals: false,
            modalsData: '',
            modalsHeader: ''
          });
        }}
      >
        <form method="post">
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modals.modalsHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table>
              <thead>
                <tr>
                  <th>Bill Id</th>
                  <th>Vendor Name</th>
                  <th>Amount</th>
                  <th>TDS</th>
                  <th>IGST</th>
                  <th>GST</th>
                  <th>Net Payment</th>
                  <th>Amount To Be Paid </th>
                  <th>Payment Date </th>
                  <th>Payment Status </th>
                </tr>
              </thead>
              <tbody>
                {d &&
                  d.map((data) => {
                    return (
                      <tr>
                        <td>{data.bc_id}</td>
                        <td>{data.vendor_name}</td>
                        <td>{data.bill_amount}</td>

                        <td>{data.tds_amount}</td>
                        <td>{data.igst_amount}</td>
                        <td width="100px">{data.gst_amount}</td>
                        <td width="100px">{data.net_payment}</td>
                        <td width="100px">{data.amount_to_be_paid}</td>
                        <td width="100px">{data.payment_date}</td>
                        <td width="100px">{data.convention_name}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
};

export default BillPayments;
