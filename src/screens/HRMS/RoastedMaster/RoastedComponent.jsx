import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import PageHeader from '../../../components/Common/PageHeader';
import ErrorLogService from '../../../services/ErrorLogService';
import TenantService from '../../../services/MastersService/TenantService';
import { _base } from '../../../settings/constants';
import Alert from '../../../components/Common/Alert';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import { Spinner } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import PaymentTemplateService from '../../../services/Bill Checking/Masters/PaymentTemplateService';
import BillPaymentServices from '../../../services/Bill Checking/BillPaymentsServices/BillPaymentsServices';

function RoastedComponent() {
  const location = useLocation();

  const [data, setData] = useState(null);
  const [notify, setNotify] = useState(null);
  const [paymentType, setPaymentType] = useState('Weekly');

  const roleId = localStorage.getItem('role_id');
  const [checkRole, setCheckRole] = useState(null);

  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const searchRef = useRef();
  const handleSearch = () => {
    const search = searchRef.current.value;
    const temp = data.filter((d) => {
      return (
        d.company_name
          .toLowerCase()
          .match(new RegExp(search.toLowerCase(), 'g')) ||
        d.company_type
          .toLowerCase()
          .match(new RegExp(search.toLowerCase(), 'g'))
      );
    });
    setData(temp);
  };
  const handleModal = (data) => {
    // alert(data.modalData.payment_type_name)
    setPaymentType(data ? data.modalData.payment_type_name : '');
    setModal(data);
  };
  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Payment Template'
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>

          <Link
            to={`/${_base}/ViewPaymentTemplateDetails/` + row.id}
            className="btn btn-sm btn-primary text-white"
            style={{ borderRadius: '50%', height: '30px', marginLeft: '5px' }}
          >
            <i className="icofont-eye-alt"></i>
          </Link>
        </div>
      )
    },
    { name: 'Sr', id: 'id', selector: (row) => row.counter, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: false,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      )
    },
    {
      name: 'Shift Name',
      selector: (row) => row.template_name,
      sortable: true
    },
    {
      name: 'Payment Type',
      selector: (row) => row.payment_type_name,
      sortable: true
    },
    {
      name: 'Bill Type',
      selector: (row) => row.bill_type_name,
      sortable: true
    },
    { name: 'Min Days', selector: (row) => row.min_days, sortable: true },
    { name: 'Bill Day', selector: (row) => row.bill_day, sortable: true },
    {
      name: 'Paymemt Weekly',
      selector: (row) => row.payment_weekly_name,
      sortable: true
    },
    { name: 'Remark', selector: (row) => row.remark, sortable: true },
    { name: 'Created At', selector: (row) => row.created_at, sortable: true },
    { name: 'Created By', selector: (row) => row.created_by, sortable: true },
    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true },
    { name: 'Updated By', selector: (row) => row.updated_by, sortable: true }
  ];

  const loadData = async () => {
    const data = [];
    await new PaymentTemplateService().getPaymentTemplate().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const temp = res.data.data;
        for (const key in temp) {
          data.push({
            id: temp[key].id,
            counter: counter++,
            bill_type: temp[key].bill_type,
            is_active: temp[key].is_active,
            remark: temp[key].remark,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by,
            template_name: temp[key].template_name,
            payment_type: temp[key].payment_type,
            payment_weekly: temp[key].payment_weekly,
            bill_day: temp[key].bill_day,
            min_days: temp[key].min_days,
            payment_type_name: temp[key].payment_type_name,
            bill_type_name: temp[key].bill_type_name,
            payment_weekly_name: temp[key].payment_weekly_name
          });
        }
        setData(null);
        setData(data);
        setPaymentType('Weekly');
      }
    });

    // const form = new FormData();
    // form.append('used_for', 'BC_Legal_Status,Bill_Type');
    // await new DropdownService().getDropdown(form).then((res) => {
    //     if (res.status === 200) {

    //         const data = JSON.stringify(res.data.data);

    //     }
    // });
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
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Roaster Shift Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-50">
              {/* <div className="col-md-5 mt-2 "> */}

              <button
                type="button"
                // disabled={deta.Auto_Update_Payment == false ? true : false}
                // disabled={
                //   userSessionData.Bill_Payment == false ? true : false
                // }
                className="btn btn-info text-white  btn-set-task w-sm-100"
                onClick={(e) => {
                  handleModal({
                    showModal: true,
                    modalData: '',
                    modalHeader: 'Upload Csv File'
                  });
                }}
              >
                <i className="icofont-upload-alt me-2 fs-6"></i>Bulk Upload
              </button>
              <button
                className="btn  btn-info text-white"
                name="buttonType"
                defaultValue="downloadButton"
                id="downloadButton"
                type="submit"
                // onClick={(e) => (myForm.current.buttonId = e.target.id)}
              >
                Bulk Upload Format <i className="icofont-download" />
              </button>

              {/* </div> */}

              {/* {checkRole && checkRole[32].can_create === 1 ? */}
              <Link
                to={`/${_base + '/Roasted/Create'}`}
                className="btn btn-dark btn-set-task w-sm-50"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Roasted
                Shift
              </Link>
              {/* //  : ""} */}
            </div>
          );
        }}
      />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-10">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: '0px', fontWeight: '600' }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
          </div>
        </div>

        <div className="card mt-2">
          <div className="card-body">
            <div className="row clearfix g-3">
              <div className="col-sm-12">
                {data && (
                  <DataTable
                    columns={columns}
                    data={data}
                    defaultSortFieldId="id"
                    pagination
                    selectableRows={false}
                    defaultSortAsc={false}
                    className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                    highlightOnHover={true}
                  />
                )}
              </div>
            </div>
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
                  <b>Upload csv :</b>
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
      </div>
    </div>
  );
}

export default RoastedComponent;
