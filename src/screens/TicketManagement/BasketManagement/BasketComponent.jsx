import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import ErrorLogService from '../../../services/ErrorLogService';

import UserService from '../../../services/MastersService/UserService';
import BasketService from '../../../services/TicketService/BasketService';

import { _base } from '../../../settings/constants';
import * as Validation from '../../../components/Utilities/Validation';

import { Astrick } from '../../../components/Utilities/Style';

export default function BasketComponent({ match }) {
  const [userData, setUserData] = useState(null);
  const [notify, setNotify] = useState(null);
  const { id: ticketId } = useParams();
  const history = useNavigate();
  const mainJson = {
    ticket_id: ticketId,
    basket_name: null,
    basket_owner: null,
    start_date: null,
    end_date: null
  };

  const [data, setData] = useState([mainJson]);
  // const [index, setIndex] = useState({ index: 0 });
  const [dateAlert, setDateAlert] = useState(false);
  const handleChange = (idx) => (e) => {
    // setIndex({ index: idx });
    const { value } = e.target;

    var flag = 1;

    for (const key in data) {
      if (data[key].basket_name === value) {
        alert('Same basket name already exists !!!');
        flag = 0;
      }
    }
    if (flag === 1) {
      var startDate = document.getElementById('start_date').value;
      var endDate = document.getElementById('end_date').value;
      if (endDate < startDate) {
        setDateAlert(true);
        flag = 0;
      } else {
        setDateAlert(false);
      }
      if ((flag = 0)) {
        setDateAlert(false);
      }
    }
  };

  const handleAddRow = async () => {
    // let flag = 1;
    let last = data.length - 1;
    if ((!data[last].basket_name || !data[last].basket_owner) && last > 0) {
    }
    const item = {
      id: Date.now(),
      ticket_id: ticketId,
      basket_name: null,
      basket_owner: null,
      start_date: null,
      end_date: null
    };

    setData([...data, item]);
  };

  const handleRemoveSpecificRow = (idx) => () => {
    const filteredArray = data.filter((item) => item.id !== idx);
    setData(filteredArray);
  };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append('ticket_id', ticketId);
    formData.append('source', 'AFTER_TICKET_INSERT');

    setNotify(null);

    if (data) {
      await new BasketService()
        .postBasket(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              history(
                {
                  pathname: `/${_base}/Ticket/Task/` + ticketId
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
            new ErrorLogService().sendErrorLog(
              'CreateBasket',
              'Create_CreateBasket',
              'INSERT',
              res.message
            );
            setNotify({ type: 'danger', message: res.message });
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'CreateBasket',
            'Get_CreateBasket',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };
  const [fromDate, setFromDate] = useState();

  const handleStartDate = (e) => {
    setFromDate(e.target.value);
  };

  const loadData = async () => {
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        const tempData = [];
        const temp = res.data.data.filter(
          (d) => d.is_active === 1 && d.account_for === 'SELF'
        );
        temp.sort((a, b) => {
          if (a.first_name && b.first_name) {
            return a.first_name.localeCompare(b.first_name);
          }
          return 0;
        });

        for (const key in temp) {
          tempData.push({
            value: temp[key].id,
            label:
              temp[key].first_name +
              ' ' +
              temp[key].last_name +
              ' (' +
              temp[key].id +
              ')'
          });
        }
        setUserData(null);
        setUserData(tempData);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Manage Basket" />

      {notify && <Alert alertData={notify} />}
      <div className="card mt-2" style={{ zIndex: 0 }}>
        <div className="card-body">
          <form onSubmit={handleForm}>
            <div className="table-responsive">
              <table
                className="table table-bordered mt-3 table-responsive"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> Sr No </th>
                    <th className="text-center">
                      {' '}
                      Basket Name <Astrick color="red" />
                    </th>
                    <th className="text-center">
                      {' '}
                      Owner
                      <Astrick color="red" />{' '}
                    </th>
                    <th className="text-center">
                      {' '}
                      Start Date
                      <Astrick color="red" />{' '}
                    </th>
                    <th className="text-center">
                      {' '}
                      End Date <Astrick color="red" />
                    </th>
                    <th className="text-center"> Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item, idx) => (
                      <tr
                        id={`addr_${idx}`}
                        key={item.id}
                        style={{ zIndex: 1000 }}
                      >
                        <td>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            name="basket_name[]"
                            key={idx}
                            value={item.basket_name}
                            onChange={(e) => {
                              handleChange(e, idx);
                            }}
                            // onInput={e => { handleCheckInput(e, idx) }}
                            className="form-control form-control-sm"
                            required
                            autoComplete="false"
                            onKeyPress={(e) => {
                              Validation.CharactersNumbersSpeicalOnly(e);
                            }}
                          />
                        </td>

                        <td style={{ zIndex: 1000 }}>
                          <select
                            className="form-control form-control-sm"
                            name="basket_owner[]"
                            required={true}
                            key={idx}
                            value={item.basket_owner}
                            onChange={handleChange(idx)}
                          >
                            <option value="">Select User</option>
                            {userData &&
                              userData.map((d) => {
                                return (
                                  <option value={d.value}>{d.label}</option>
                                );
                              })}
                          </select>
                        </td>

                        <td>
                          {item.start_date}
                          <input
                            type="date"
                            id="start_date"
                            name="start_date[]"
                            defaultvalue=""
                            onChange={(e) => {
                              handleChange(idx);
                              handleStartDate(e);
                            }}
                            min={new Date().toISOString().slice(0, 10)}
                            className="form-control form-control-sm"
                            required
                          />
                        </td>

                        <td>
                          <input
                            type="date"
                            id="end_date"
                            name="end_date[]"
                            //   key={Math.random()}
                            defaultValue={item.end_date}
                            onChange={handleChange(idx)}
                            min={fromDate}
                            className="form-control form-control-sm"
                            required
                          />
                          {dateAlert && dateAlert === true ? (
                            <span style={{ color: 'red', fontSize: '10px' }}>
                              End date should not be less than start date
                            </span>
                          ) : (
                            ''
                          )}
                        </td>

                        <td>
                          {idx === 0 && (
                            <button
                              type="button"
                              onClick={handleAddRow}
                              className="btn btn-sm btn-outline-primary pull-left"
                            >
                              <i class="icofont-plus-circle"></i>
                            </button>
                          )}

                          {idx !== 0 && (
                            <span>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleRemoveSpecificRow(item.id)}
                              >
                                <i class="icofont-ui-delete"></i>
                              </button>
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="pull-right">
              <button type="Submit" className="btn btn-sm btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
