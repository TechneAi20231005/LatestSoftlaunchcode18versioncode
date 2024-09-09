import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import ErrorLogService from '../../../../services/ErrorLogService';
import BasketService from '../../../../services/TicketService/BasketService';

import Select from 'react-select';
import { Astrick } from '../../../../components/Utilities/Style';
import * as Validation from '../../../../components/Utilities/Validation';
import UserService from '../../../../services/MastersService/UserService';
import MyTicketService from '../../../../services/TicketService/MyTicketService';

export default function BasketDetails(props) {
  const [user, setUser] = useState();
  const [todate, setTodate] = useState([]);
  // const [fromdate, setFromdate] = useState([]);

  // const [todateformat, setTodateformat] = useState('');
  // const [fromdateformat, setFromdateformat] = useState("");

  const handleFromDate = (e) => {
    const gettodatevalue = e.target.value;
    // const setdateformat = gettodatevalue.split('-');
    // const settoyear = setdateformat[0];
    // const settomonth = setdateformat[1];
    // const settodate = setdateformat[2];
    // const settodateformat = settoyear + '' + settomonth + '' + settodate;
    setTodate(gettodatevalue);
    // setTodateformat(settodateformat);
  };

  // const handleToDate = (e) => {
  //   const getfromdatevalue = e.target.value;
  //   const setfromformat = getfromdatevalue.split("-");
  //   const setfromyear = setfromformat[0];
  //   const setfrommonth = setfromformat[1];
  //   const setfromdate = setfromformat[2];
  //   const setfromformatdate =
  //     setfromyear + "" + setfrommonth + "" + setfromdate;
  //   setFromdate(getfromdatevalue);
  //   setFromdateformat(setfromformatdate);
  // };

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    formData.append('source', 'AFTER_TICKET_INSERT');
    if (formData.get('id')) {
      await new BasketService()
        .updateBasket(formData.get('id'), formData)

        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              toast.success(res.data.message);
              props.loadData();
              props.hide();
            } else {
              toast.error(res.data.message);
            }
          } else {
            toast.error(res.data.message);

            new ErrorLogService().sendErrorLog(
              'Basket',
              'Edit_Basket',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'Basket',
            'Edit_Basket',
            'INSERT',
            errorObject.data.message
          );
        });
    } else {
      await new BasketService()
        .postBasket(formData)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.status === 1) {
              toast.success(res.data.message);
              props.loadData();
              props.hide();
            } else {
              toast.error(res.data.message);
            }
          } else {
            toast.error(res.data.message);
            new ErrorLogService().sendErrorLog(
              'Basket',
              'Create_Basket',
              'INSERT',
              res.message
            );
          }
        })
        .catch((error) => {
          const { response } = error;
          const { request, ...errorObject } = response;
          new ErrorLogService().sendErrorLog(
            'Basket',
            'Create_Basket',
            'INSERT',
            errorObject.data.message
          );
        });
    }
  };
  // const [ticketData, setTicketData] = useState();
  const loadData = async () => {
    const inputRequired =
      'id,employee_id,first_name,last_name,middle_name,is_active';
    await new UserService().getUserForMyTickets(inputRequired).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          const tempData = res.data.data
            .filter((d) => d.is_active === 1 && d.account_for === 'SELF')
            .map((d) => ({
              value: d.id,
              label: d.first_name + ' ' + d.last_name + ' (' + d.id + ')'
            }));
          const aa = tempData.sort(function (a, b) {
            return a.label > b.label ? 1 : b.label > a.label ? -1 : 0;
          });
          setUser(aa);
        }
      }
    });

    await new MyTicketService().getTicketById(props.ticketId).then((res) => {
      if (res.status === 200) {
        if (res.data.status === 1) {
          // setTicketData(res.data.data);
        }
      }
    });
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      dialogClassName="modal-100w"
      aria-labelledby="example-custom-modal-styling-title"
    >
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          {props.data ? 'Edit Basket Details' : 'Add Basket'}
        </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleForm}>
        <Modal.Body>
          <input
            type="hidden"
            name="ticket_id"
            defaultValue={props.ticketId}
            required
          />

          {props.data && (
            <input
              type="hidden"
              name="id"
              defaultValue={props.data.id}
              required
            />
          )}
          <div className="form-group row">
            <div className="col-sm-12">
              <label className="col-form-label">
                <b>
                  Basket Name :<Astrick color="red" size="13px" />
                </b>
              </label>
              <input
                type="text"
                id="basket_name"
                name={`${props.data ? 'basket_name' : 'basket_name[]'}`}
                className="form-control form-control-sm"
                defaultValue={props?.data ? props?.data?.basket_name : null}
                onKeyPress={(e) => {
                  Validation.CharactersNumbersSpeicalOnly(e);
                }}
                required
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-sm-12">
              <label className="col-form-label">
                <b>
                  Select User :<Astrick color="red" size="13px" />
                </b>
              </label>
              {user && (
                <Select
                  id="basket_owner"
                  name={`${props.data ? 'basket_owner' : 'basket_owner[]'}`}
                  options={user}
                  required
                  defaultValue={
                    props.data &&
                    props.data.basket_owner &&
                    user.filter((d) => d.value === props.data.basket_owner)
                  }
                />
              )}
            </div>
          </div>
          <div className="form-group row">
            <div className="col-sm-6">
              <label className="col-form-label">
                <b>
                  Start Date :<Astrick color="red" size="13px" />
                </b>
              </label>
              <input
                type="date"
                id="start_date"
                name={`${props.data ? 'start_date' : 'start_date[]'}`}
                className="form-control form-control-sm"
                onChange={handleFromDate}
                required
                readOnly={
                  props?.data?.is_basket_edit === 1 || !props?.data
                    ? false
                    : true
                }
                // min={ticketData && ticketData.ticket_date}
                min={new Date().toISOString().slice(0, 10)}
                defaultValue={props.data ? props.data.start_date : null}
              />
            </div>
            <div className="col-sm-6">
              <label className="col-form-label">
                <b>
                  End Date :<Astrick color="red" size="13px" />
                </b>
              </label>
              <input
                type="date"
                name={`${props.data ? 'end_date' : 'end_date[]'}`}
                className="form-control form-control-sm"
                required
                min={todate}
                readOnly={
                  props?.data?.is_basket_edit === 1 || !props?.data
                    ? false
                    : true
                }
                defaultValue={props.data ? props.data.end_date : null}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: '#484C7F' }}
          >
            Submit
          </button>

          <button
            type="button"
            className="btn btn-sm btn-primary"
            style={{ backgroundColor: '#FFBA32' }}
            onClick={props.hide}
          >
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
