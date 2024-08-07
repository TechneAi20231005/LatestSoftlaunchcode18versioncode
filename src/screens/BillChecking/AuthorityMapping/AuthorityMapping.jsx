import React, { useEffect, useState, useRef } from 'react';

import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';

import DataTable from 'react-data-table-component';

import PageHeader from '../../../components/Common/PageHeader';

import Select from 'react-select';

import Alert from '../../../components/Common/Alert';

import { Astrick } from '../../../components/Utilities/Style';

import { Link } from 'react-router-dom';

import BillCheckingTransactionService from '../../../services/Bill Checking/Bill Checking Transaction/BillTransactionService';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import {
  creteAuthority,
  getModuleSettingData,
  getSubmoduleData,
  updateAuthority
} from '../Slices/BillCheckingTransactionAction';
import {
  handleModalClose,
  handleModalOpen
} from '../Slices/BillCheckingTransactionSlice';
import { getUserForMyTicketsData } from '../../TicketManagement/MyTicketComponentAction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';

const AuthorityMapping = () => {
  //initial state
  const dispatch = useDispatch();

  //redux state
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 47)
  );

  const authorities = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.getModuleSettingData
  );

  const isLoading = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.isLoading
  );
  const userData = useSelector(
    (MyTicketComponentSlice) =>
      MyTicketComponentSlice.myTicketComponent.getUserForMyTicket
  );
  const submodulename = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.getSubmoduleData
  );
  const notify = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.notify
  );
  const modal = useSelector(
    (BillCheckingTransactionSlice) =>
      BillCheckingTransactionSlice.billChecking.modal
  );
  //local state

  const [statusData, setstatusData] = useState();

  const [error, setError] = useState('');

  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [read, setRead] = useState(true);

  const [empty, setEmpty] = useState([
    { user_id: [], from_date: null, to_date: null, readOnly: false }
  ]);
  const [assign, setAssign] = useState([
    { user_id: [], from_date: null, to_date: null, readOnly: false }
  ]);

  const [value, setValue] = useState('');

  const [userErrors, setUserErrors] = useState(
    new Array(assign.length).fill('')
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(authorities, searchTerm);
    setFilteredData(filteredList);
  };

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(authorities);
  };

  //columns
  const columns = [
    {
      name: 'Sr',
      selector: (row) => row.counter,
      sortable: true,
      width: '100px'
    },

    {
      name: 'Action',
      className: 'font-weight-bold',

      selector: (row) => {},
      sortable: false,
      width: '120px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
          style={{ marginLeft: '-40px' }}
        >
          <button
            type="button"
            className="btn btn-sm btn-info text-white"
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
              handleData(e, row);
              dispatch(
                handleModalOpen({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Assign Authority'
                })
              );
            }}
            style={{ marginRight: '10px' }}
          >
            <i class="icofont-user"></i>
          </button>

          <Link
            data-bs-toggle="modal"
            data-bs-target="#depedit"
            onClick={(e) => {
              handleData(e, row);

              dispatch(
                handleModalOpen({
                  showModal: true,
                  modalData: row,
                  modalHeader: 'Details'
                })
              );
            }}
            className="btn btn-sm btn-primary text-white"
            style={{ borderRadius: '50%', height: '30px', marginLeft: '5px' }}
          >
            <i className="icofont-eye-alt"></i>
          </Link>
        </div>
      )
    },

    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      width: '130px',
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}

          {row.is_active == 0 && (
            <span className="badge bg-danger " style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
    },

    {
      name: 'Authority Name',
      selector: (row) => row['Authority Name'],
      sortable: true,
      width: '175px',
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.setting_name && (
            <OverlayTrigger overlay={<Tooltip>{row.setting_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.setting_name && row.setting_name.length < 10
                    ? row.setting_name
                    : row.setting_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Submodule Name',
      selector: (row) => row.sub_module_name,
      sortable: true,
      width: '175px'
    },

    {
      name: ' Updated At ',
      width: '200px',
      selector: (row) => row.updated_at,
      sortable: true
    },

    {
      name: ' Updated By ',
      width: '200px',
      selector: (row) => row.updated_by_name,
      sortable: true
    }
  ];

  const handleStatusChange = (e) => {
    setstatusData(e?.target?.value);
  };

  const handleChanges = (e) => {
    const inputValue = e.target.value;

    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharacters.test(inputValue)) {
      setError('Special characters are not allowed');
    } else {
      setError();
      setValue();
    }
  };
  const [date, Setdate] = useState();

  const handleFromDate = (event, index) => {
    Setdate(event.target.value);
    const updatedAssign = [...assign];
    updatedAssign[index] = {
      ...updatedAssign[index],
      from_date: event.target.value,
      todayDate
    };

    setAssign(updatedAssign);
  };

  const handleToDate = (event, index) => {
    const updatedAssign = [...assign];
    updatedAssign[index] = {
      ...updatedAssign[index],
      readOnly: false,
      to_date: event.target.value
    };
    setAssign(updatedAssign);
  };
  const current = new Date();
  const todayDate = `${current.getFullYear()}-${
    (current.getMonth() + 1 < 10 ? '0' : '') + (current.getMonth() + 1)
  }-${(current.getDate() < 10 ? '0' : '') + current.getDate()}`;

  const handleAddRow = (e, index, type) => {
    const newRow = {
      user_id: null,
      from_date: '',
      to_date: '',
      readOnly: false
    };

    if (type === 'ASSIGNED') {
      setAssign([...assign, newRow]);
    } else {
      setEmpty([...empty, newRow]);
    }

    setRead(false);
  };

  const handleRemoveSpecificRow = (index) => async () => {
    const id = assign[index].id;

    // Delete the item
    await new BillCheckingTransactionService()
      .deleteModuleSettingUser(id)
      .then((res) => {
        if (res.status === 200) {
          // Create a new array with the item removed
          const updatedAssign = [...assign];
          updatedAssign.splice(index, 1);

          // Update the state
          setAssign(updatedAssign);
        }
      });
  };

  const mainJson = {
    updated_by: sessionStorage.getItem('id'),
    updated_at: new Date(),
    setting_id: modal?.modalData?.id,

    setting_value: 'Y',
    is_active: statusData,

    user_details: assign.map((item) => ({
      user_id: Array.isArray(item.user_id) ? item.user_id : [item.user_id],
      from_date: item.from_date,
      to_date: item.to_date
    }))
  };

  const handleUserSelect = (selectedOptions, index) => {
    const selectedUserIds = selectedOptions.map((option) => option.value);

    const updatedAssign = [...assign];

    updatedAssign[index] = {
      ...updatedAssign[index],
      user_id: selectedUserIds
    };

    setAssign(updatedAssign);

    const updatedUserErrors = [...userErrors];
    updatedUserErrors[index] = '';
    setUserErrors(updatedUserErrors);
  };

  const handleData = async (e, row) => {
    if (row.id) {
      await new BillCheckingTransactionService()

        .getModuleAuthorityUserSetting(row.id)

        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              const updatedAssign = res.data.data.map((item) => {
                const from_dateReadOnly =
                  item.from_date &&
                  new Date(item.from_date) < new Date(todayDate);
                const to_dateReadOnly =
                  item.to_date && new Date(item.to_date) < new Date(todayDate);

                return {
                  ...item,
                  from_dateReadOnly,
                  to_dateReadOnly
                };
              });
              setAssign(updatedAssign);
            }
          }
        });
    }
    dispatch(getSubmoduleData(parseInt(row.submodule_name)));
  };

  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);

    dispatch(getModuleSettingData());

    dispatch(getRoles());

    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    dispatch(getUserForMyTicketsData(inputRequired));

    dispatch(updateAuthority());
  };

  const handleForm = (id) => async (e) => {
    e.preventDefault();
    // setNotify(null);

    const form = new FormData(e.target);

    // After successful form submission, check and update 'readOnly' for each row
    const currentDate = new Date().toISOString().split('T')[0];
    const updatedAssign = assign.map((item) => ({
      ...item,
      readOnly: new Date(item.from_date) < new Date(currentDate)
    }));
    setAssign(updatedAssign);

    const inputValue = form.get('setting_name');
    const specialCharacters = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharacters.test(inputValue)) {
      return;
    }

    var button_type = e.target.button_type.value;

    if (button_type === 'ASSIGN') {
      const overlappingUserDetails = findOverlappingUserDetails(
        mainJson.user_details
      );

      if (overlappingUserDetails.length > 0) {
        alert('Overlaping date is detected');

        return;
      }

      dispatch(creteAuthority(mainJson));
      loadData();

      function findOverlappingUserDetails(userDetails) {
        const overlappingRanges = [];

        for (let i = 0; i < userDetails.length; i++) {
          for (let j = i + 1; j < userDetails.length; j++) {
            if (
              userDetails[i].user_id[0] === userDetails[j].user_id[0] &&
              dateRangeOverlap(
                userDetails[i].from_date,
                userDetails[i].to_date,
                userDetails[j].from_date,
                userDetails[j].to_date
              )
            ) {
              overlappingRanges.push(userDetails[i], userDetails[j]);
            }
          }
        }

        return overlappingRanges;
      }

      function dateRangeOverlap(startA, endA, startB, endB) {
        const startDateA = new Date(startA);
        const endDateA = new Date(endA);
        const startDateB = new Date(startB);
        const endDateB = new Date(endB);

        return startDateA <= endDateB && endDateA >= startDateB;
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_cre === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    setFilteredData(authorities);
  }, [authorities]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Authority Approval"
        renderRight={() => {
          return <div className="col-auto d-flex w-sm-100"></div>;
        }}
      />
      {/* SEARCH FILTER */}
      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by authority name...."
        showExportButton={false}
      />

      {/* DATA TABLE */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {authorities && (
                <DataTable
                  columns={columns}
                  defaultSortField="title"
                  pagination
                  data={filteredData}
                  progressComponent={<TableLoadingSkelton />}
                  progressPending={isLoading}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD Authority */}
      <Modal
        centered
        show={modal.showModal}
        aria-labelledby="contained-modal-title-vcenter"
        size="xl"
      >
        <form
          method="post"
          onSubmit={handleForm(modal.modalData ? modal.modalData.id : '')}
        >
          <Modal.Header
            closeButton
            onClick={() => {
              dispatch(
                handleModalClose({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                })
              );
            }}
          >
            <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-4">
                  <label className="form-label font-weight-bold">
                    Authority name : <Astrick color="red" size="13px" />
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    id="setting_name"
                    name="setting_name"
                    defaultValue={modal?.modalData?.setting_name}
                    onChange={handleChanges}
                    // ref={searchRef}
                    required={true}
                    readOnly={
                      modal.modalHeader === 'Assign Authority' ||
                      modal.modalHeader === 'Details'
                    }
                    maxLength={50}
                    style={{ borderColor: error ? 'red' : '' }}
                  />
                  {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>

                <div className="col-sm-4 ">
                  <label className="form-label font-weight-bold">
                    Submodule Name :<Astrick color="red" size="13px" />
                  </label>

                  {modal.modalData && modal.modalHeader == 'Edit Authority'}

                  {!modal.modalData && (
                    <div>
                      <Select
                        options={submodulename}
                        id="submodule_name"
                        name="submodule_name"
                        required={true}
                      />
                    </div>
                  )}

                  {modal.modalData && submodulename && (
                    <>
                      <Select
                        type="text"
                        // className="form-control"
                        id="submodule_name"
                        name="submodule_name"
                        options={submodulename}
                        required={true}
                        isDisabled={
                          modal.modalHeader === 'Assign Authority' ||
                          modal.modalHeader === 'Details'
                        }
                        defaultValue={
                          modal.modalData &&
                          submodulename
                            .filter(
                              (d) => d.value == modal.modalData.submodule_name
                            )
                            .map((d) => ({ value: d.value, label: d.label }))
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              <table
                className="table table-bordered mt-3 table-responsive mt-5"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> sr </th>
                    <th className="text-center"> Assign authority to users </th>
                    <th className="text-center"> Valid From </th>
                    <th className="text-center"> Valid Till</th>
                    {modal.modalHeader === 'Assign Authority' && (
                      <th className="text-center"> Action</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {assign && assign.length > 0 ? (
                    assign.map((item, idx) => (
                      <tr id={`addr_${idx}`} key={idx}>
                        <td>{idx + 1}</td>

                        <td>
                          {assign && (
                            <Select
                              isMulti
                              isSearchable={true}
                              name="user_id[]"
                              id="user_id[]"
                              key={idx}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              options={userData}
                              isDisabled={
                                item.from_dateReadOnly ||
                                modal.modalHeader === 'Details'
                              }
                              value={userData.filter((d) =>
                                Array.isArray(item.user_id)
                                  ? item.user_id.includes(d.value)
                                  : item.user_id == d.value
                              )}
                              required
                              style={{ zIndex: '100' }}
                              onChange={(selectedOption) =>
                                handleUserSelect(selectedOption, idx)
                              }
                            />
                          )}

                          {userErrors[idx] && (
                            <div style={{ color: 'red' }}>
                              {userErrors[idx]}
                            </div>
                          )}
                        </td>

                        <td>
                          {assign && (
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="from_date"
                              value={item.from_date || ''}
                              readOnly={
                                item.from_dateReadOnly ||
                                modal.modalHeader === 'Details'
                              }
                              min={todayDate}
                              onChange={(event) => handleFromDate(event, idx)}
                              required
                            />
                          )}
                        </td>

                        <td>
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            name="to_date"
                            value={item.to_date || ''}
                            readOnly={
                              item.to_dateReadOnly ||
                              modal.modalHeader === 'Details'
                            }
                            min={item.from_date}
                            onChange={(event) => handleToDate(event, idx)}
                            required
                          />
                        </td>

                        {modal.modalHeader === 'Assign Authority' && (
                          <td>
                            {idx === 0 ? (
                              <>
                                <div>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary pull-left"
                                    required
                                    onClick={(e) => {
                                      handleAddRow(e, idx, 'ASSIGNED');
                                    }}
                                  >
                                    <i className="icofont-plus-circle"></i>
                                  </button>
                                </div>

                                <div>
                                  {!item.from_dateReadOnly && ( // Check if from_dateReadOnly is false
                                    <button
                                      type="button"
                                      className="btn btn-outline-danger btn-sm"
                                      onClick={handleRemoveSpecificRow(idx)}
                                    >
                                      <i className="icofont-ui-delete"></i>
                                    </button>
                                  )}
                                </div>
                              </>
                            ) : (
                              <div>
                                {!item.from_dateReadOnly && ( // Check if from_dateReadOnly is false
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={handleRemoveSpecificRow(idx)}
                                  >
                                    <i className="icofont-ui-delete"></i>
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <>
                      {empty.map((item, idx) => (
                        <tr id={`addr_${idx}`} key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            {modal.modalHeader === 'Assign Authority' && (
                              <Select
                                isMulti
                                isSearchable={true}
                                name="user_id[]"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                options={userData}
                                required
                                style={{ zIndex: '100' }}
                                onChange={(selectedOption) =>
                                  handleUserSelect(selectedOption, idx)
                                }
                                defaultValue={
                                  Array.isArray(item.user_id)
                                    ? item.user_id.map((id) => {
                                        const user = userData.find(
                                          (d) => d.value === id
                                        );
                                        return {
                                          value: user.value,
                                          label: user.label
                                        };
                                      })
                                    : userData.filter(
                                        (d) => item.user_id === d.value
                                      )
                                }
                              />
                            )}

                            {userErrors[idx] && (
                              <div style={{ color: 'red' }}>
                                {userErrors[idx]}
                              </div>
                            )}
                          </td>

                          <td>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="from_date"
                              required
                              min={todayDate}
                              onChange={(event) => handleFromDate(event, idx)}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="to_date"
                              min={date}
                              required
                            />
                          </td>

                          <td>
                            {idx === 0 ? (
                              <>
                                <button
                                  type="button"
                                  required
                                  className="btn btn-sm btn-outline-primary pull-left"
                                  onClick={handleAddRow}
                                >
                                  <i className="icofont-plus-circle"></i>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={handleRemoveSpecificRow(idx)}
                                >
                                  <i className="icofont-ui-delete"></i>
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleRemoveSpecificRow(idx)}
                              >
                                <i className="icofont-ui-delete"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>

              {modal.modalHeader == 'Add Authority' ? (
                <div className="col-md-10 mt-4">
                  <label className="form-label font-weight-bold">
                    Remark :
                  </label>
                  <textarea
                    className="form-control form-control-sm"
                    type="text"
                    id="remark"
                    rows="4"
                    defaultValue={modal.modalData.remark}
                    readOnly={modal.modalHeader == 'Details'}
                    name="remark"
                    maxLength={100}
                  />
                </div>
              ) : null}
            </div>

            {modal.modalData &&
              (modal.modalHeader === 'Edit Authority' ||
                modal.modalHeader === 'Details' ||
                modal.modalHeader === 'Assign Authority') && (
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Is Active:
                    <Astrick color="red" size="13px" />
                  </label>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="is_active"
                          id="is_active_1"
                          onChange={handleStatusChange}
                          value="1"
                          defaultChecked={
                            modal.modalData && modal.modalData.is_active === 1
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_active_1"
                        >
                          Yes
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
                          onChange={handleStatusChange}
                          defaultChecked={
                            modal.modalData && modal.modalData.is_active === 0
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="is_active_0"
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </Modal.Body>

          <Modal.Footer>
            {modal.modalHeader && modal.modalHeader === 'Edit Authority' && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
                value="UPDATE"
                name="button_type"
              >
                update
              </button>
            )}
            {modal.modalData && modal.modalHeader === 'Assign Authority' && (
              <button
                type="submit"
                name="button_type"
                value="ASSIGN"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
              >
                Assign
              </button>
            )}

            {!modal.modalData && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                style={{ backgroundColor: '#484C7F' }}
                value="SUBMIT"
                name="button_type"
              >
                Add
              </button>
            )}
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                dispatch(
                  handleModalClose({
                    showModal: false,
                    modalData: '',
                    modalHeader: ''
                  })
                );
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};
export default AuthorityMapping;
