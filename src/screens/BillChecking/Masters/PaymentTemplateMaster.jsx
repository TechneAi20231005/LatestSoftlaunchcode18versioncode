import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { _base } from '../../../settings/constants';
import { Link } from 'react-router-dom';

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
import PaymentTemplateService from '../../../services/Bill Checking/Masters/PaymentTemplateService';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useDispatch, useSelector } from 'react-redux';

import { paymentTemplate } from './BillTypeMaster/PaymentTemplateMasterAction';
import { getRoles } from '../../Dashboard/DashboardAction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { toast } from 'react-toastify';

function PaymentTemplateMaster() {
  const dispatch = useDispatch();
  const paymentdata = useSelector(
    (PaymentTemplateMasterSlice) =>
      PaymentTemplateMasterSlice.paymentmaster.paymentTemplate
  );

  const isLoading = useSelector(
    (PaymentTemplateMasterSlice) =>
      PaymentTemplateMasterSlice.paymentmaster.isLoading
  );
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 46)
  );

  const [paymentType, setPaymentType] = useState('Weekly');

  const paymentModeRef = useRef(null);

  const options = [
    { value: '01', label: '1' },
    { value: '02', label: '2' },
    { value: '03', label: '3' },
    { value: '04', label: '4' },
    { value: '05', label: '5' },
    { value: '06', label: '6' },
    { value: '07', label: '7' },
    { value: '08', label: '8' },
    { value: '09', label: '9' },
    { value: '10', label: '10' },
    { value: '11', label: '11' },
    { value: '12', label: '12' },
    { value: '13', label: '13' },
    { value: '14', label: '14' },
    { value: '15', label: '15' },
    { value: '16', label: '16' },
    { value: '17', label: '17' },
    { value: '18', label: '18' },
    { value: '19', label: '19' },
    { value: '20', label: '20' },
    { value: '21', label: '21' },
    { value: '22', label: '22' },
    { value: '23', label: '23' },
    { value: '24', label: '24' },
    { value: '25', label: '25' },
    { value: '26', label: '26' },
    { value: '27', label: '26' },
    { value: '28', label: '28' },
    { value: '29', label: '29' },
    { value: '30', label: '30' },
    { value: '31', label: '31' }
  ];

  const weeks = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  const [notify, setNotify] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(paymentdata, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(paymentdata);
  };

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const handleModal = (data) => {
    setPaymentType(data ? data.modalData.payment_type_name : '');
    setModal(data);
  };
  const handlePaymentType = (e) => {
    setPaymentType(e.target.value);
  };

  const billDayRef = useRef(null);

  const [country, setCountry] = useState();
  const [state, setState] = useState();
  const [city, setCity] = useState();
  const [CountryDropdown, setCountryDropdown] = useState();
  const [stateDropdown, setStateDropdown] = useState();
  const [cityDropdown, setCityDropdown] = useState();

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
      name: 'Template Name',
      width: '150px',

      selector: (row) => row.template_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.template_name && (
            <OverlayTrigger overlay={<Tooltip>{row.template_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.template_name && row.template_name.length < 20
                    ? row.template_name
                    : row.template_name.substring(0, 12) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Payment Type',
      selector: (row) => row.payment_type_name,
      width: '150px',
      sortable: true
    },
    {
      name: 'Bill Type',
      selector: (row) => row.bill_type_name,
      width: '200px',
      sortable: true
    },
    { name: 'Min Days', selector: (row) => row.min_days, sortable: true },
    {
      name: 'Bill Day',
      selector: (row) => row.bill_day,
      sortable: true,
      width: '150px',

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.template_name && (
            <OverlayTrigger overlay={<Tooltip>{row.bill_day} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.bill_day && row.bill_day}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Paymemt Weekly',
      width: '200px',

      selector: (row) => row.payment_weekly_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.payment_weekly_name && (
            <OverlayTrigger
              overlay={<Tooltip>{row.payment_weekly_name} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.payment_weekly_name &&
                  row.payment_weekly_name.length < 20
                    ? row.payment_weekly_name
                    : row.payment_weekly_name.substring(0, 12) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Remark',
      selector: (row) => row.remark,
      width: '270px',
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.remark && (
            <OverlayTrigger overlay={<Tooltip>{row.remark} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {row.remark && row.remark.length < 120
                    ? row.remark
                    : row.remark.substring(0, 120) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      width: '200px',
      sortable: true
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      width: '200px',
      sortable: true
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      width: '200px',
      sortable: true
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      width: '200px',
      sortable: true
    }
  ];

  const minDaysRef = useRef();
  const [toolTip, setToolTip] = useState({ id: 'EMPTY', message: 'NOTHING' });

  const handleMinDaysLength = (e) => {
    if (e.target.value > 366) {
      minDaysRef.current.value = '';
    } else {
    }
  };

  const loadData = async () => {
    dispatch(paymentTemplate());
    dispatch(getRoles());

    await new CountryService().getCountry().then((res) => {
      if (res.status === 200) {
        setCountry(res.data.data);
        setCountryDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.country
          }))
        );
      }
    });

    await new StateService().getState().then((res) => {
      if (res.status === 200) {
        setState(res.data.data);
        setStateDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.state
          }))
        );
      }
    });

    await new CityService().getCity().then((res) => {
      if (res.status === 200) {
        setCity(res.data.data);
        setCityDropdown(
          res.data.data.map((d) => ({
            value: d.id,
            label: d.city
          }))
        );
      }
    });
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);
    if (
      paymentModeRef &&
      paymentModeRef.current.value == 'Monthly' &&
      billDayRef.current &&
      billDayRef.current.commonProps.hasValue === false
    ) {
      alert('please select  bill days');
      e.preventDefault();
      billDayRef.current.clearValue();
      return;
    }

    if (!id) {
      await new PaymentTemplateService()
        .createPaymentTemplate(form)
        .then((res) => {
          if (res.status === 200 && res.data.status === 1) {
            // setNotify({ type: 'success', message: res.data.message });
            toast.success(res.data.message, {
              position: 'top-right'
            });
            dispatch(paymentTemplate());
            setModal({ showModal: false, modalData: '', modalHeader: '' });
          } else {
            // setNotify({ type: 'danger', message: res.data.message });
            toast.error(res.data.message, {
              position: 'top-right'
            });
          }
          // if (res.status === 200 && res.data.status === 1) {
          //   console.log('res', res);
          //   if (res.data.status === 1) {
          //     setNotify({ type: 'success', message: res.data.message });
          //     setModal({ showModal: false, modalData: '', modalHeader: '' });
          //     dispatch(paymentTemplate());
          //   } else {
          //     setNotify({ type: 'danger', message: res.data.message });
          //   }
          // } else {
          //   setNotify({ type: 'danger', message: res.data.message });
          //   new ErrorLogService().sendErrorLog(
          //     'Payment_template',
          //     'Create_Payment_template',
          //     'INSERT',
          //     res.message
          //   );
          // }
        })
        .catch((error) => {
          // setNotify({ type: 'danger', message: 'Request Error !!!' });
          toast.error('Request Error !!!', {
            position: 'top-right'
          });

          const { response } = error;
          const { request, ...errorObject } = response;

          new ErrorLogService().sendErrorLog(
            'Payment_template',
            'Create_Payment_template',
            'INSERT',
            errorObject.data.message
          );
        });
    } else {
      await new PaymentTemplateService()
        .updatePaymentTemplate(id, form)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              // setNotify({ type: 'success', message: res.data.message });
              toast.success(res.data.message, {
                position: 'top-right'
              });
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              dispatch(paymentTemplate());
            } else {
              // setNotify({ type: 'danger', message: res.data.message });
              toast.error(res.data.message, {
                position: 'top-right'
              });
            }
          } else {
            // setNotify({ type: 'danger', message: res.data.message });
            toast.error(res.data.message, {
              position: 'top-right'
            });
            new ErrorLogService().sendErrorLog(
              'Payment_template',
              'Create_Payment_template',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          // setNotify({ type: 'danger', message: 'Request Error !!!' });
          toast.error('Request Error !!!', {
            position: 'top-right'
          });

          new ErrorLogService().sendErrorLog(
            'Payment_template',
            'Create_Payment_template',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setFilteredData(paymentdata);
  }, [paymentdata]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Payment Template Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <button
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => {
                  handleModal({
                    showModal: true,
                    modalData: '',
                    modalHeader: 'Add Template'
                  });
                }}
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Template
              </button>
            </div>
          );
        }}
      />
      {/* SEARCH FILTER */}

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by payment template name...."
        showExportButton={false}
      />

      {/* DATA TABLE */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {paymentdata && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortFieldId="id"
                  progressComponent={<TableLoadingSkelton />}
                  progressPending={isLoading}
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
      {/* ADD Payment Template Modal */}
      <Modal
        centered
        show={modal.showModal}
        size="lg"
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
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Template Name :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="template_name"
                    name="template_name"
                    required
                    maxLength={50}
                    onKeyPress={(e) => {
                      Validation.validateTemplateName(e);
                    }}
                    defaultValue={
                      modal.modalData ? modal.modalData.template_name : ''
                    }
                  />
                </div>

                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Payment Type :<Astrick color="red" size="13px" />
                  </label>

                  <select
                    type="text"
                    className="form-control"
                    id="payment_type"
                    name="payment_type"
                    required={true}
                    ref={paymentModeRef}
                    onChange={(e) => handlePaymentType(e)}
                    defaultValue={
                      modal.modalData ? modal.modalData.payment_type_name : ''
                    }
                  >
                    <option value="">Select Payment Type</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Bill Date Type :<Astrick color="red" size="13px" />
                  </label>

                  {modal.modalData && modal.modalData.bill_type_name && (
                    <select
                      type="text"
                      className="form-control"
                      id="bill_type"
                      name="bill_type"
                      required={true}
                      defaultValue={
                        modal.modalData ? modal.modalData.bill_type_name : ''
                      }
                    >
                      <option value="">Select Bill Type</option>
                      <option value="Bill Date">Bill Date</option>
                      <option value="Received Date">Received Date</option>
                    </select>
                  )}

                  {!modal.modalData && (
                    <select
                      type="text"
                      className="form-control"
                      id="bill_type"
                      name="bill_type"
                      required={true}
                      defaultValue={
                        modal.modalData ? modal.modalData.bill_type_name : ''
                      }
                    >
                      <option value="">Select Bill Type</option>
                      <option value="Bill Date">Bill Date</option>
                      <option value="Received Date">Received Date</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="row g-3 mb-3">
                {paymentType && paymentType === 'Weekly' && (
                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Payment Weekly :<Astrick color="red" size="13px" />
                    </label>
                    <Select
                      options={weeks.map((d) => ({ label: d, value: d }))}
                      id="payment_weekly"
                      name="payment_weekly[]"
                      required
                      isMulti
                      defaultValue={
                        modal.modalData.payment_weekly_name
                          ? weeks
                              .map((d) => ({ label: d, value: d }))
                              .filter((d) =>
                                modal.modalData.payment_weekly_name.includes(
                                  d.value
                                )
                              )
                          : null
                      }
                    />
                  </div>
                )}

                {paymentType && paymentType === 'Monthly' && (
                  <div className="col-sm-4">
                    <label className="form-label font-weight-bold">
                      Bill Date :<Astrick color="red" size="13px" />
                    </label>

                    {modal.modalData && (
                      <Select
                        options={options}
                        id="bill_day"
                        name="bill_day[]"
                        isSearchable
                        ref={billDayRef}
                        isMulti
                        defaultValue={
                          modal?.modalData?.bill_day
                            ? options.filter((option) =>
                                modal.modalData.bill_day
                                  .split(',')
                                  .includes(option.value)
                              )
                            : null
                        }
                        isClearable
                      />
                    )}
                    {!modal.modalData && (
                      <Select
                        options={options}
                        id="bill_day[]"
                        name="bill_day[]"
                        isSearchable
                        isMulti
                        isClearable
                        ref={billDayRef}
                      />
                    )}
                  </div>
                )}

                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Min Days :<Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    id="min_days"
                    name="min_days"
                    required
                    min={1}
                    max={366}
                    onChange={(e) => {
                      handleMinDaysLength(e);
                    }}
                    ref={minDaysRef}
                    defaultValue={
                      modal.modalData ? modal.modalData.min_days : ''
                    }
                    onKeyPress={(e) => {
                      Validation.NumbersOnly(e);
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />

                  {toolTip && toolTip.id == 'MIN_DAYS' && (
                    <small class="text-danger">
                      <b>{toolTip.message}</b>
                    </small>
                  )}
                </div>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remarks :
                  </label>
                  <textarea
                    type="text"
                    className="form-control form-control-sm"
                    id="remark"
                    name="remark"
                    defaultValue={modal.modalData ? modal.modalData.remark : ''}
                    rows="4"
                    maxLength={1000}
                  />
                </div>

                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Status :<Astrick color="red" size="13px" />
                  </label>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active"
                          value="1"
                          defaultChecked={
                            modal.modalData && modal.modalData.is_active === 1
                              ? true
                              : !modal.modalData
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_active_1"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                    <div className="col-md-1">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active"
                          value="0"
                          readOnly={modal.modalData ? false : true}
                          defaultChecked={
                            modal.modalData && modal.modalData.is_active === 0
                              ? true
                              : false
                          }
                        />
                        <label className="form-check-label" htmlFor="is_active">
                          Deactive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
              >
                Submit
              </button>
            )}
            {modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
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
                  modalData: '',
                  modalHeader: ''
                });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentTemplateMaster;
