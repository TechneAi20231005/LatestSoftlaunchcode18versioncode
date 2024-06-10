import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';

import DynamicFormDropdownMasterService from '../../../services/MastersService/DynamicFormDropdownMasterService';
import PageHeader from '../../../components/Common/PageHeader';

import Alert from '../../../components/Common/Alert';
import * as Validation from '../../../components/Utilities/Validation';

import 'react-data-table-component-extensions/dist/index.css';
import { Astrick } from '../../../components/Utilities/Style';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';

export default function CreateDropdownComponent({ match }) {
  const history = useNavigate();
  const [value, setvalue] = useState({});
  const [data, setData] = useState([{ label: null, value: null }]);

  const [notify, setNotify] = useState(null);

  const [modal, setModal] = useState({
    showModal: false,
    modalData: '',
    modalHeader: ''
  });
  const roleId = localStorage.getItem('role_id');

  const dispatch = useDispatch();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 37)
  );

  const handleChange = (idx) => (e) => {};

  const handleModal = (data) => {
    setModal(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    await new DynamicFormDropdownMasterService()
      .createDropdown(formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            history(
              {
                pathname: `/${_base}/DynamicFormDropdown`
              },
              {
                state: {
                  alert: { type: 'success', message: res.data.message }
                }
              }
            );
          } else {
            setNotify({ type: 'danger', message: res.data.message });
          }
        } else {
          setNotify({ type: 'danger', message: res.message });
          new ErrorLogService().sendErrorLog(
            'User',
            'Create_User',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Status',
          'Get_Status',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  const loadData = async () => {};

  const handleAddRow = () => {
    setData((prevState) => [...prevState, { label: null, value: null }]);
  };

  //     setData(prevState => {
  //       const newData = prevState
  //         .filter((_, index) => index !== idx) // Remove the specified row
  //         .map((item, index) => ({ ...item, index })); // Reindex the remaining rows

  //       return newData;
  //     });
  //   };

  // const handleRemoveSpecificRow = (idx) => {
  //     setData(prevState => {
  //       const newData = [...prevState];
  //       newData.splice(idx, 1);
  //       return newData.map((item, index) => {
  //         if (index >= idx) {
  //           return { label: null, value: null };
  //         }
  //         return item;
  //       });
  //     });
  //   };

  const handleRemoveSpecificRow = (row) => {
    setData((prevState) => {
      const newData = prevState.filter((item) => item !== row);
      return newData.map((item, index) => ({ ...item, index }));
    });
  };

  const [showtype, setShowType] = useState();
  const handleAutoChanges = (e, type, method) => {
    if (method == 'REGULAR') {
      setShowType('REGULAR');
    } else if (method == 'FETCHING') {
      setShowType('FETCHING');
    }
  };

  useEffect(() => {
    if (!checkRole.length) {
      dispatch(getRoles());
    }
  }, []);
  useEffect(() => {
    if (checkRole && checkRole[0]?.can_create === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Create Dropdown" />

      <div className="card mt-2">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div>
              <div className="row mt-2">
                <div className="col-md-2">
                  <label>
                    <b>
                      Dropdown Name :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersOnly(e);
                    }}
                    name="dropdown_name"
                    id="dropdown_name"
                    required
                  />
                </div>
              </div>

              <div className="table-responsive">
                <table
                  className="table table-bordered mt-3 table-responsive"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center"> Sr </th>

                      <th className="text-center"> Label </th>
                      <th className="text-center"> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      data.map((item, idx) => (
                        <tr id={`addr_${idx}`} key={idx}>
                          <td>{idx + 1}</td>
                          <td>
                            <input
                              type="text"
                              key={idx}
                              name="dropdown_values[]"
                              required
                              id={`dropdown_values_${idx}`}
                              className="form-control form-control-sm"
                              onKeyPress={(e) => {
                                Validation.CharactersNumbersSpeicalOnly(e);
                              }}
                              value={item.value} // Bind the input value to the row's data
                              onChange={(e) => {
                                const updatedData = [...data];
                                updatedData[idx].value = e.target.value;
                                setData(updatedData);
                              }}
                            />
                          </td>
                          <td>
                            {idx === 0 && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary pull-left"
                                onClick={handleAddRow}
                              >
                                <i className="icofont-plus-circle"></i>
                              </button>
                            )}
                            {idx !== 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleRemoveSpecificRow(item)}
                              >
                                <i className="icofont-ui-delete"></i>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* } */}
            {showtype && showtype === 'FETCHING' && (
              <div>
                <div className="row mt-2">
                  <div className="col-md-2 mt-2">
                    <label>
                      <b>
                        Dropdown Name :<Astrick color="red" size="13px" />
                      </b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      onKeyPress={(e) => {
                        Validation.CharactersNumbersOnly(e);
                      }}
                      name="dropdown_name"
                      id="dropdown_name"
                      required
                    />
                  </div>

                  <div className="col-md-1 mt-2">
                    <label>
                      <b>API Path</b>
                    </label>
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="api_source"
                      id="api_source"
                      required
                    />
                  </div>

                  <div className="col-md-2 mt-2">
                    <label>
                      <b>API Type</b>
                    </label>
                  </div>
                  <div className="col-md-4 mt-2">
                    <select
                      type="text"
                      className="form-control form-control-sm"
                      name="api_type"
                      id="api_type"
                      required
                    >
                      <option value="">Select</option>
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="pull-right mt-2">
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
              <Link
                to={`/${_base}/DynamicFormDropdown`}
                className="btn btn-sm btn-danger text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
