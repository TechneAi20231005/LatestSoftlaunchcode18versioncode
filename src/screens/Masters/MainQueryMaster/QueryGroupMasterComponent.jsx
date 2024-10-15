import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import DataTable from 'react-data-table-component';
import ErrorLogService from '../../../services/ErrorLogService';
import QueryTypeService from '../../../services/MastersService/QueryTypeService';

import Alert from '../../../components/Common/Alert';

import { Astrick } from '../../../components/Utilities/Style';

import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import MainQueryService from '../../../services/MastersService/MainQueryService';
import { Spinner } from 'react-bootstrap';

function QueryGroupMasterComponent() {
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [QueryTypeDropdown, setQueryTypeDropdown] = useState(null);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });

  const roleId = localStorage.getItem('role_id');
  const [checkRole, setCheckRole] = useState(null);

  const [exportData, setExportData] = useState(null);

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

  const handleSearch = () => {
    const SearchValue = searchRef.current.value;
    const result = SearchInputData(data, SearchValue);
    setData(result);
  };

  const handleModal = (data) => {
    setModal(data);
  };

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
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
                modalHeader: 'Edit Main Query'
              });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      )
    },
    { name: 'Sr', selector: (row) => row.counter, sortable: true },
    { name: 'Parrent Query', selector: (row) => row.parent_id, sortable: true },
    { name: 'Child Query', selector: (row) => row.child_id, sortable: true },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
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
    { name: 'Created At', selector: (row) => row.created_at, sortable: true },
    { name: 'Created By', selector: (row) => row.created_by, sortable: true },
    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true },
    { name: 'Updated By', selector: (row) => row.updated_by, sortable: true }
  ];

  const loadData = useCallback(async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    const data = [];
    const exportTempData = [];

    await new MainQueryService()
      .getAllMainQuery()
      .then((res) => {
        if (res.status === 200) {
          setShowLoaderModal(false);

          let counter = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              parrent_query: temp[key].parent_id,
              child_query: temp[key].child_id,
              is_active: temp[key].is_active,
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by
            });
          }
          setData(null);
          setData(data);

          for (const i in data) {
            exportTempData.push({
              Sr: data[i].counter,
              Query_Type_Name: data[i].query_type_name,
              Status: data[i].is_active ? 'Active' : 'Deactive',
              Remark: data[i].remark,
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

    await new QueryTypeService().getQueryType().then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);

        if (res.data.status === 1) {
          setQueryTypeDropdown(
            res.data.data
              .filter((d) => d.is_active === 1)
              .map((d) => ({ value: d.id, label: d.query_type_name }))
          );
        }
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        setShowLoaderModal(false);

        if (res.data.status === 1) {
          const getRoleId = localStorage.getItem('role_id');
          setCheckRole(res.data.data.filter((d) => d.role_id === getRoleId));
        }
      }
    });
  }, [roleId]);

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    setNotify(null);
    const form = new FormData(e.target);

    setNotify(null);

    if (!id) {
      await new MainQueryService()
        .postMainQuery(form)
        .then((res) => {
          if (res.status === 200) {
            setShowLoaderModal(false);

            if (res.data.status === 1) {
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              setNotify({ type: 'success', message: res.data.message });
              loadData();
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
      await new MainQueryService()
        .updateQueryType(id, form)
        .then((res) => {
          if (res.status === 200) {
            setShowLoaderModal(false);

            if (res.data.status === 1) {
              setModal({ showModal: false, modalData: '', modalHeader: '' });
              setNotify({ type: 'success', message: res.data.message });
              loadData();
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
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          setNotify({ type: 'danger', message: 'Remark Error !!!' });
          new ErrorLogService().sendErrorLog(
            'QueryType',
            'Edit_QueryType',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[38].can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Main Query Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[13].can_create === 1 ? (
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
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Main
                  Query
                </button>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={handleSearch}
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
            <ExportToExcel
              className="btn btn-sm btn-danger"
              // apiData={}
              apiData={exportData}
              fileName="Query Type master Records"
            />
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

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>

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
                    Main Query Name : <Astrick color="red" size="13px" />
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="main_query_name"
                    name="main_query_name"
                    maxLength={50}
                    required
                    defaultValue={
                      modal.modalData ? modal.modalData.query_type_name : ''
                    }
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Query Type :
                  </label>
                  <Select
                    options={QueryTypeDropdown}
                    id="form_id"
                    name="form_id"
                    defaultValue={
                      modal.modalData &&
                      QueryTypeDropdown.filter(
                        (d) => d.value === modal.modalData.form_id
                      )
                    }
                    required={true}
                    isMulti
                  />
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="hidden"
                    name="is_active"
                    id="is_active_1"
                    value="1"
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
                    defaultValue={modal.modalData ? modal.modalData.remark : ''}
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
                            id="is_active_0"
                            value="0"
                            readOnly={modal.modalData ? false : true}
                            defaultChecked={
                              modal.modalData && modal.modalData.is_active === 0
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
            {modal.modalData && checkRole && checkRole[13].can_update === 1 ? (
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
  );
}

// function QueryTypeDropdown(props) {
//     const [data, setData] = useState(null);
//     useEffect(async () => {
//         const tempData = [];
//         await new QueryTypeService().getQueryType().then(res => {
//             if (res.status === 200) {
//                 let counter = 1;
//                 const data = res.data.data;
//                 for (const key in data) {
//                     if (data[key].is_active === 1) {
//                         tempData.push({
//                             counter: counter++,
//                             id: data[key].id,
//                             query_type_name: data[key].query_type_name
//                         })
//                     }
//                 }
//                 setData(tempData);
//             }
//         });
//     }, [])

//     return (
//         <>
//             {data &&
//                 <select className="form-control form-control-sm"
//                     id={props.id}
//                     name={props.name}
//                     onChange={props.onChange}
//                     required={props.required ? true : false}
//                     readOnly={props.readonly ? true : false}
//                 >
//                     {props.defaultValue == 0 && <option value="">Select Query Type</option>}
//                     {props.defaultValue != 0 && <option value="">Select Query Type </option>}
//                     {data.map(function (item, i) {
//                         if (props.defaultValue && props.defaultValue == item.id) {
//                             return <option key={i} value={item.id} selected>{item.query_type_name}</option>
//                         } else {
//                             return <option key={i} value={item.id}>{item.query_type_name}</option>
//                         }
//                     })
//                     }
//                 </select>
//             }
//             {!data && <p> Loading....</p>}
//         </>
//     )
// }

export default QueryGroupMasterComponent;
