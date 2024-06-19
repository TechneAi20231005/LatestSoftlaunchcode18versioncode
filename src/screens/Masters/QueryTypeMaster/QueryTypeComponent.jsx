import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import Tooltip from 'react-bootstrap/Tooltip';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import ErrorLogService from '../../../services/ErrorLogService';
import QueryTypeService from '../../../services/MastersService/QueryTypeService';
import DynamicFormService from '../../../services/MastersService/DynamicFormService';
import Alert from '../../../components/Common/Alert';

import { Astrick } from '../../../components/Utilities/Style';
import * as Validation from '../../../components/Utilities/Validation';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';

import Dropdown from 'react-bootstrap/Dropdown';

import CustomerService from '../../../services/MastersService/CustomerService';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBar from '../../../components/Common/SearchBar ';
import { customSearchHandler } from '../../../utils/customFunction';

function QueryTypeComponent() {
  const dispatch = useDispatch();
  const [notify, setNotify] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const [dataa, setDataa] = useState(null);
  const [isActive, setIsActive] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [exportData, setExportData] = useState(null);
  const [exportQueryGroupData, setExportQueryGroupData] = useState(null);

  const [dynamicForm, setDynamicForm] = useState(null);

  const [dynamicFormDropdown, setDynamicFormDropdown] = useState(null);

  const roleId = sessionStorage.getItem('role_id');
  // const [checkRole, setCheckRole] = useState(null);
  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 14)
  );

  // ***************************** Edit & View Popup*************************************
  const [queryGroupData, setQueryGroupData] = useState(null);

  const [modalEditPopup, setModalEditPopup] = useState({
    showModalEditPopup: false,
    modalDataEditPopup: '',
    modalHeaderEditPopup: ''
  });
  const [customerDropdown, setCustomerDropdown] = useState();
  const [selectedcustomer, setSelectedCustomer] = useState();
  const handleModalEditPopup = (editData) => {
    setModalEditPopup(editData);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    handleModalEditPopup({
      showModal: false,
      modalData: '',
      modalHeader: ''
    });
  };

  // ***************************** End Edit & View Popup*************************************

  // *********************************Add Query Group ***********************
  const [queryGroupDropdown, setQueryGroupDropdown] = useState(null);

  const [modalQueryGroup, setModalQueryGroup] = useState({
    showModalQueryGroup: false,
    modalDataQueryGroup: '',
    modalHeaderQueryGroup: ''
  });

  const handleModalQueryGroup = (data) => {
    setModalQueryGroup(data);
  };
  //   *********************************End Query Group*************************************

  const viewSearchRef = useRef();
  const handleViewSearch = (e) => {
    const search = viewSearchRef.current.value;
    if (search.length > 0) {
      const temp = queryGroupData.filter((d) => {
        return d.group_name
          .toLowerCase()
          .match(new RegExp(search.toLowerCase(), 'g'));
      });
      setQueryGroupData(temp);
      const exportTemporaryData = [];
      for (const i in temp) {
        exportTemporaryData.push({
          Sr: temp[i].counter,
          group_name: temp[i].group_name,
          Status: temp[i].is_active ? 'Active' : 'Deactive',
          created_at: temp[i].created_at,
          created_by: temp[i].created_by,
          updated_at: temp[i].updated_at,
          updated_by: temp[i].updated_by
        });
      }

      setExportQueryGroupData(null);
      setExportQueryGroupData(exportTemporaryData);
    } else {
      alert('Please Search Query Group Name');
    }
  };
  const searchRef = useRef();

  function SearchInputData(data, search) {
    const lowercaseSearch = search.toLowerCase();

    return data.filter((d) => {
      for (const key in d) {
        if (
          typeof d[key] === 'string' &&
          d[key].toLowerCase().includes(lowercaseSearch)
        ) {
          return true;
        }
      }
      return false;
    });
  }

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  const [queryGroups, setQueryGroups] = useState();

  const handleModal = (data) => {
    setModal(data);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              handleModal({
                showModal: true,
                modalData: row,
                modalHeader: 'Edit Query Type'
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    {
      name: 'Query Type Name',
      selector: (row) => row.query_type_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.query_type_name && (
            <OverlayTrigger overlay={<Tooltip>{row.query_type_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.query_type_name && row.query_type_name.length < 10
                    ? row.query_type_name
                    : row.query_type_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Form Name',
      selector: (row) => row.form_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.form_name && (
            <OverlayTrigger overlay={<Tooltip>{row.form_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.form_name && row.form_name.length < 10
                    ? row.form_name
                    : row.form_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Query Group',
      selector: (row) => row.query_group_name,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.query_group_name && (
            <OverlayTrigger
              overlay={<Tooltip>{row.query_group_name} </Tooltip>}
            >
              <div>
                <span className="ms-1">
                  {' '}
                  {row.query_group_name && row.query_group_name.length < 10
                    ? row.query_group_name
                    : row.query_group_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
    },
    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '175px'
    }
  ];

  // ************************************Edit & View Popup**********************************

  const columnsEditPopup = [
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '60px'
    },
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      width: '80px',
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              handleModalQueryGroup({
                showModalQueryGroup: true,
                modalDataQueryGroup: row,
                modalHeaderQueryGroup: ' Edit Query Group'
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },

    {
      name: 'Query Group',
      width: '250px',
      selector: (row) => row.group_name,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.group_name && (
            <OverlayTrigger overlay={<Tooltip>{row.group_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.group_name && row.group_name.length < 123
                    ? row.group_name
                    : row.group_name.substring(0, 123) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span
              className="badge"
              style={{ width: '4rem', backgroundColor: '#484c7f' }}
            >
              Active
            </span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <a
            href="#"
            onClick={(e) => {
              handleFormQueryGroup({
                showModalQueryGroup: true,
                modalQueryGroup: row,
                modalHeaderQueryGroup: ''
              });
            }}
          >
            {row.created_at && (
              <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
                <div>
                  <span className="ms-1">
                    {' '}
                    {row.created_at && row.created_at.length < 123
                      ? row.created_at
                      : row.created_at.substring(0, 123) + '....'}
                  </span>
                </div>
              </OverlayTrigger>
            )}
          </a>
        </div>
      )
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '150px'
    }
  ];

  const loadDataEditPopup = async () => {
    const data = [];
    const exportTempQueryGroupData = [];
    await new QueryTypeService()
      .getAllQueryGroup()
      .then((res) => {
        if (res.data.status == 1) {
          setQueryGroupDropdown(
            res.data.data
              .filter((d) => d.is_active == 1)
              .map((d) => ({ value: d.id, label: d.group_name }))
          );
        }

        if (res.status === 200) {
          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              group_name: temp[key].group_name,
              is_active: temp[key].is_active,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by
            });
          }

          setQueryGroupData(data);

          for (const i in data) {
            exportTempQueryGroupData.push({
              Sr: data[i].counter,
              group_name: data[i].group_name,
              Status: data[i].is_active ? 'Active' : 'Deactive',
              created_at: data[i].created_at,
              created_by: data[i].created_by,
              updated_at: data[i].updated_at,
              updated_by: data[i].updated_by
            });
          }

          setExportQueryGroupData(null);
          setExportQueryGroupData(exportTempQueryGroupData);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'QueryType',
          'Get_QueryType',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  // ************************************ End Edit & View Popup **********************************

  // **************************************Add Query Group *****************************************
  const [notifyy, setNotifyy] = useState(null);
  const handleIsActive = (e) => {
    if (e.target.id === 'is_active_1') {
      setIsActive(1);
    } else {
      setIsActive(0);
    }
  };
  const handleFormQueryGroup = (id) => async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    setNotify(null);
    setNotifyy(null);
    if (!id) {
      await new QueryTypeService()
        .postQueryGroup(form)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              setModalQueryGroup({
                showModalQueryGroup: false,
                modalDataQueryGroup: '',
                modalHeaderQueryGroup: ''
              });

              setNotify({ type: 'success', message: res.data.message });
              loadData();
              loadDataEditPopup();
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          } else {
            setNotify({ type: 'danger', message: res.message });
            new ErrorLogService().sendErrorLog(
              'QueryType',
              'Create_QueryType',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          setNotify({ type: 'danger', message: 'Connection Error !!!' });
          const { response } = error;
          const { request, ...errorObject } = response;
          setNotify({ type: 'danger', message: 'Remark Error !!!' });
          new ErrorLogService().sendErrorLog(
            'QueryType',
            'Create_QueryType',
            'INSERT',
            errorObject.data.message
          );
        });
    } else {
      form.delete('is_active');
      form.append('is_active', isActive);
      await new QueryTypeService().updateQueryGroup(id, form).then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            setNotifyy({ type: 'success', message: res.data.message });
            setModalQueryGroup({
              showModalQueryGroup: false,
              modalDataQueryGroup: '',
              modalHeaderQueryGroup: ''
            });
            loadData();
            loadDataEditPopup();
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.data.message });
          new ErrorLogService().sendErrorLog(
            'QueryType',
            'Update_QueryType',
            'UPDATE',
            res.message
          );
        }
      });
    }
  };

  // **************************************End Add Query Group *****************************************

  function isQueryType(queryType) {
    return /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/.test(queryType);
  }

  const loadData = async () => {
    setIsLoading(true);
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    const data = [];
    const exportTempData = [];
    await new QueryTypeService()
      .getQueryType()
      .then((res) => {
        if (res.status === 200) {
          setShowLoaderModal(false);

          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              query_type_name: temp[key].query_type_name,
              form_id: temp[key].form_id,
              customer_id: temp[key].customer_id,

              form_name: temp[key].form_id_name,
              query_group_name: temp[key].query_group_name,
              query_group: temp[key].query_group,
              is_active: temp[key].is_active,
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              query_group_data: temp[key].query_group_data
            });
          }

          setData(data);
          setDataa(data);
          setIsLoading(false);

          for (const i in data) {
            exportTempData.push({
              Sr: data[i].counter,
              Query_Type_Name: data[i].query_type_name,
              query_group_name: temp[i].query_group_name,
              Status: data[i].is_active ? 'Active' : 'Deactive',
              Remark: data[i].remark,
              created_at: data[i].created_at,
              created_by: data[i].created_by,
              updated_at: data[i].updated_at,
              updated_by: data[i].updated_by
            });
          }

          setExportData(null);
          setExportData(exportTempData);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'QueryType',
          'Get_QueryType',
          'INSERT',
          errorObject.data.message
        );
      });

    await new DynamicFormService().getDynamicForm().then((res) => {
      if (res.data.status == 1) {
        setShowLoaderModal(false);

        setDynamicForm(res.data.data.filter((d) => d.is_active === 1));
        setDynamicFormDropdown(
          res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.template_name }))
        );
      }
    });

    await new CustomerService().getCustomer().then((res) => {
      if (res.data.status == 1) {
        setSelectedCustomer(res.data.data.filter((d) => d.is_active === 1));
        setCustomerDropdown(
          res.data.data
            .filter((d) => d.is_active == 1)
            .map((d) => ({ value: d.id, label: d.name }))
        );
      }
    });
    dispatch(getRoles());
  };

  const handleClearData = (e) => {
    if (viewSearchRef.current.value != null) {
      document.getElementById('search_resultt').value = '';
    }
    loadData();
    loadDataEditPopup();
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);
    var flag = 1;
    setNotify(null);
    var selectFormId = form.getAll('form_id');
    var selectCustomerId = form.getAll('customer_id');
    var selectQueryGroup = form.getAll('query_group_data[]');

    if (selectFormId.length === 0) {
      flag = 0;
      alert('Please select Form');
    }
    // if (selectCustomerId.length === 0) {
    //   flag = 0;
    //   alert("Please select customer");
    // }
    if (selectQueryGroup.length === 0) {
      flag = 0;
      alert('Please Select query group');
    }

    if (flag === 1) {
      try {
        if (!id) {
          form.delete('is_active');
          form.append('is_active', 1);
          const res = await new QueryTypeService().postQueryType(form);
          if (res.status === 200) {
            setShowLoaderModal(false);
            if (res.data.status === 1) {
              setShowLoaderModal(false);
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              setNotify({ type: 'success', message: res.data.message });
              loadData();
              setIsActive(1);
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          } else {
            setNotify({ type: 'danger', message: res.message });
            new ErrorLogService().sendErrorLog(
              'QueryType',
              'Create_QueryType',
              'INSERT',
              res.message
            );
          }
        } else {
          form.delete('is_active');
          form.append('is_active', isActive);
          const res = await new QueryTypeService().updateQueryType(id, form);
          if (res.status === 200) {
            setShowLoaderModal(false);
            if (res.data.status === 1) {
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              setNotify({ type: 'success', message: res.data.message });
              loadData();
              setIsActive(1);
            } else {
              setNotify({ type: 'danger', message: res.data.message });
            }
          } else {
            setNotify({ type: 'danger', message: res.message });
            new ErrorLogService().sendErrorLog(
              'QueryType',
              'Edit_QueryType',
              'INSERT',
              res.message
            );
          }
        }
      } catch (error) {
        const { response } = error;
        const { request, ...errorObject } = response;
        setNotify({ type: 'danger', message: 'Remark Error !!!' });
        new ErrorLogService().sendErrorLog(
          'QueryType',
          'Create_QueryType',
          'INSERT',
          errorObject.data.message
        );
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  const handleViewSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleViewSearch();
    }
  };

  useEffect(() => {
    loadData();
    loadDataEditPopup();
    setNotify(null);
  }, []);

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <>
      <div className="container-xxl">
        {notify && <Alert alertData={notify ? notify : notifyy} />}
        <PageHeader
          headerTitle="Query Master"
          renderRight={() => {
            return (
              <div className="col-auto d-flex w-sm-100">
                {checkRole && checkRole[0]?.can_create === 1 ? (
                  <button
                    className="btn btn-dark btn-set-task w-sm-100"
                    onClick={() => {
                      handleModal({
                        showModal: true,
                        modalData: null,
                        modalHeader: 'Add Query Type'
                      });
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add Query
                    Type
                  </button>
                ) : (
                  ''
                )}
              </div>
            );
          }}
        />
        <SearchBar
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleReset={handleReset}
          placeholder="Search by query name...."
          exportFileName="Query Type Master Record"
          exportData={exportData}
        />

        <div className="card mt-2">
          {isLoading && <TableLoadingSkelton />}
          {!isLoading && data && (
            <DataTable
              columns={columns}
              data={filteredData}
              defaultSortField="title"
              pagination
              progressPending={isLoading}
              progressComponent={<TableLoadingSkelton />}
              selectableRows={false}
              className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
              highlightOnHover={true}
            />
          )}
        </div>

        <Modal
          centered
          show={modal.showModal}
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
                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Query Type Name : <Astrick color="red" size="13px" />
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="query_type_name"
                      name="query_type_name"
                      placeholder="Please start with string"
                      maxLength={50}
                      required
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      defaultValue={
                        modal.modalData ? modal.modalData.query_type_name : ''
                      }
                    />
                  </div>
                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Select Form : <Astrick color="red" size="13px" />
                    </label>

                    <Select
                      options={dynamicFormDropdown}
                      id="form_id"
                      name="form_id"
                      defaultValue={
                        modal.modalData &&
                        dynamicFormDropdown &&
                        dynamicFormDropdown.filter(
                          (d) => d.value == modal.modalData.form_id
                        )
                      }
                      required={true}
                    />
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-10">
                      <label className="form-label font-weight-bold mt-1">
                        Query Group : <Astrick color="red" size="13px" />
                      </label>

                      {queryGroupDropdown && (
                        <Select
                          options={queryGroupDropdown}
                          id="query_group_data"
                          name="query_group_data[]"
                          isMulti={true}
                          required
                          defaultValue={
                            modal.modalData &&
                            modal.modalData.query_group_data.map((d) => ({
                              value: d.query_type_group_id,
                              label: d.group_name
                            }))
                          }
                        />
                      )}
                    </div>
                    <div className="col-md-2" style={{ marginTop: '30px' }}>
                      <Dropdown style={{}}>
                        <Dropdown.Toggle
                          variant="btn btn-secondary text-white"
                          id="dropdown-basic"
                        >
                          <i className="icofont-listine-dots"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu as="ul" st>
                          <li
                            className="btn btn-sm btn-warning text-white"
                            onClick={(e) => {
                              handleModalEditPopup({
                                showModalEditPopup: true,
                                modalDataEditPopup: '',
                                modalHeaderEditPopup: 'Add Query Group'
                              });
                            }}
                            style={{ width: '100%', zIndex: 100 }}
                          >
                            <i className="icofont-ui-edit"></i> Edit & View
                          </li>
                          <li
                            className="btn btn-secondary text-white"
                            onClick={() => {
                              handleModalQueryGroup({
                                showModalQueryGroup: true,
                                modalDataQueryGroup: null,
                                modalHeaderQueryGroup: 'Add Query Group'
                              });
                            }}
                            style={{ width: '100%', zIndex: 100 }}
                          >
                            <i className="icofont-ui-edit"></i> Add
                          </li>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="hidden"
                      name="is_active"
                      id="is_active_1"
                      defaultChecked={
                        modal.modalData && modal.modalData.is_active === 1
                          ? true
                          : !modal.modalData
                          ? true
                          : false
                      }
                    />
                  </div>

                  <div className="col-sm-12">
                    <label className="form-label font-weight-bold">
                      Remark :
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="remark"
                      name="remark"
                      maxLength={50}
                      defaultValue={
                        modal.modalData ? modal.modalData.remark : ''
                      }
                      // required
                    />
                  </div>
                  {modal.modalData && (
                    <div className="col-sm-12">
                      <label className="form-label font-weight-bold">
                        Status : <Astrick color="red" size="13px" />
                      </label>
                      <div className="row">
                        <div className="col-md-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="is_active"
                              id="is_active_1"
                              onClick={(e) => {
                                handleIsActive(e);
                              }}
                              value={isActive}
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 1
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
                              id="is_active_0"
                              onClick={(e) => {
                                handleIsActive(e);
                              }}
                              value={isActive}
                              readOnly={modal.modalData ? false : true}
                              defaultChecked={
                                modal.modalData &&
                                modal.modalData.is_active === 0
                                  ? true
                                  : false
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor="is_active_0"
                            >
                              Deactive
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              {!modal.modalData && (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{
                    backgroundColor: '#484C7F',
                    width: '80px',
                    padding: '8px'
                  }}
                >
                  Add
                </button>
              )}
              {modal.modalData &&
              checkRole &&
              checkRole[0]?.can_update === 1 ? (
                <button
                  type="submit"
                  className="btn btn-primary text-white"
                  style={{ backgroundColor: '#484C7F' }}
                >
                  Update
                </button>
              ) : (
                ''
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
                Cancel
              </button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>

      {/* *************************Add Query Group*************************** */}
      <Modal
        centered
        size="sm"
        show={modalQueryGroup.showModalQueryGroup}
        onHide={(e) => {
          handleModalQueryGroup({
            showModalQueryGroup: false,
            modalDataQueryGroup: '',
            modalHeaderQueryGroup: ''
          });
        }}
      >
        <form
          method="post"
          onSubmit={handleFormQueryGroup(
            modalQueryGroup.modalDataQueryGroup
              ? modalQueryGroup.modalDataQueryGroup.id
              : ''
          )}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              {modalQueryGroup.modalHeaderQueryGroup}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <label className="form-label font-weight-bold">
                  Query Group :<Astrick color="red" size="13px" />
                </label>
                <div className="col-sm-12">
                  {modalQueryGroup.modalDataQueryGroup && (
                    <input
                      type="text"
                      style={{ height: '40px' }}
                      id="group_name"
                      name="group_name"
                      placeholder=""
                      defaultValue={
                        modalQueryGroup.modalDataQueryGroup &&
                        modalQueryGroup.modalDataQueryGroup &&
                        modalQueryGroup.modalDataQueryGroup.group_name
                          ? modalQueryGroup.modalDataQueryGroup.group_name
                          : ''
                      }
                      maxLength={50}
                      required
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                    />
                  )}

                  {!modalQueryGroup.modalDataQueryGroup && (
                    <input
                      type="text"
                      style={{ height: '40px' }}
                      id="group_name"
                      name="group_name"
                      placeholder=""
                      maxLength={50}
                      required
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                    />
                  )}
                </div>
              </div>

              {modalQueryGroup.modalDataQueryGroup && (
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Status: <Astrick color="red" size="13px" />
                  </label>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active_1"
                          value="1"
                          onClick={(e) => handleIsActive(e)}
                          defaultChecked={
                            modalQueryGroup.modalDataQueryGroup &&
                            modalQueryGroup.modalDataQueryGroup.is_active === 1
                              ? true
                              : !modalQueryGroup.modalDataQueryGroup
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
                          id="is_active_0"
                          value="0"
                          style={{ marginLeft: 'auto' }}
                          readOnly={
                            modalQueryGroup.modalDataQueryGroup ? false : true
                          }
                          onClick={(e) => handleIsActive(e)}
                          defaultChecked={
                            modalQueryGroup.modalDataQueryGroup &&
                            modalQueryGroup.modalDataQueryGroup.is_active === 0
                              ? true
                              : false
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_active_0"
                        >
                          Deactive
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            {!modalQueryGroup.modalDataQueryGroup && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{
                  backgroundColor: '#484C7F',
                  width: '80px',
                  padding: '8px'
                }}
              >
                Add
              </button>
            )}

            {modalQueryGroup.modalDataQueryGroup && (
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
                handleModalQueryGroup({
                  showModalQueryGroup: false,
                  modalDataQueryGroup: '',
                  modalHeaderQueryGroup: ''
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* *************************************End Add Query Group************************** */}

      {/* *****************************************Edit & Veiw Popup******************************* */}
      <Modal
        show={modalEditPopup.showModalEditPopup}
        onHide={(e) => {
          handleModalEditPopup({
            showModalEditPopup: false,
            modalDataEditPopup: '',
            modalHeaderEditPopup: ''
          });
        }}
        size="xl"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title centered>View & Edit Query Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <div className="row">
              <div className="col-sm-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Query Group Name...."
                  ref={viewSearchRef}
                  id="search_resultt"
                  onKeyDown={handleViewSearchKeyDown}
                />
              </div>
              <div className="col-sm-6">
                <button
                  className="btn btn-sm btn-warning text-white"
                  type="button"
                  onClick={handleViewSearch}
                >
                  <i className="icofont-search-1 "></i> Search
                </button>
                <button
                  className="btn btn-sm btn-info text-white"
                  type="button"
                  onClick={(e) => {
                    handleClearData(e);
                  }}
                >
                  <i className="icofont-refresh text-white"></i> Reset
                </button>
                <ExportToExcel
                  className="btn btn-sm btn-danger"
                  apiData={exportQueryGroupData}
                  fileName="Group Query Type master Records"
                />
              </div>
            </div>

            <div className="card mt-2">
              <div className="card-body">
                <div className="row clearfix g-3">
                  <div className="col-sm-12">
                    {data && (
                      <DataTable
                        columns={columnsEditPopup}
                        data={queryGroupData}
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
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      {/* ********************************************* End Edit & Popup********************************** */}
    </>
  );
}

function QueryTypeDropdown(props) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const tempData = [];
    new QueryTypeService().getQueryType().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          if (data[key].is_active === 1) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              query_type_name: data[key].query_type_name
            });
          }
        }
        setData(tempData);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.onChange}
          required={props.required ? true : false}
          readOnly={props.readonly ? true : false}
        >
          {props.defaultValue == 0 && (
            <option value="">Select Query Type</option>
          )}
          {props.defaultValue != 0 && (
            <option value="">Select Query Type </option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.query_type_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.query_type_name}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}

export { QueryTypeComponent, QueryTypeDropdown };
