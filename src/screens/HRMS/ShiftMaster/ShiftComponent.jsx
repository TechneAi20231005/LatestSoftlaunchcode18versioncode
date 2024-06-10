import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
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

function ShiftComponent({ location }) {
  const [data, setData] = useState(null);
  const [notify, setNotify] = useState(null);

  const roleId = localStorage.getItem('role_id');
  const [checkRole, setCheckRole] = useState(null);
  const [paymentType, setPaymentType] = useState('Weekly');

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
      name: 'Shift Type',
      selector: (row) => row.payment_type_name,
      sortable: true
    },
    {
      name: 'Start Time',
      selector: (row) => row.bill_type_name,
      sortable: true
    },
    { name: 'End Time', selector: (row) => row.min_days, sortable: true },
    {
      name: 'No Of Working Min',
      selector: (row) => row.bill_day,
      sortable: true
    },
    {
      name: 'Grace Period Min  ',
      selector: (row) => row.payment_weekly_name,
      sortable: true
    },
    {
      name: 'Late Mark period in min after grace period',
      selector: (row) => row.remark,
      sortable: true
    },
    {
      name: 'Early Out Allowed In Month',
      selector: (row) => row.created_at,
      sortable: true
    },
    {
      name: 'Early Out Allowed In Min:',
      selector: (row) => row.created_by,
      sortable: true
    },
    {
      name: 'No Of Late Mark For Half Day:',
      selector: (row) => row.created_by,
      sortable: true
    },
    {
      name: 'Min To Consider In Half Day:',
      selector: (row) => row.created_by,
      sortable: true
    },
    {
      name: 'Min To consider one and half day:',
      selector: (row) => row.updated_at,
      sortable: true
    },
    { name: 'Shift Type', selector: (row) => row.updated_by, sortable: true },
    { name: 'Remark', selector: (row) => row.updated_by, sortable: true },
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
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Shift Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Link
                to={`/${_base + '/Shift/Create'}`}
                className="btn btn-dark btn-set-task w-sm-100"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Shift
              </Link>
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
    </div>
  );
}

export default ShiftComponent;
