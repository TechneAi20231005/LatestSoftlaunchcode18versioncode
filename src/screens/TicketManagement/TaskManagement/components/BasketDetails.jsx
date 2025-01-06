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
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { CustomValidation } from '../../../../components/custom/CustomValidation/CustomValidation';

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

  const fields = [
    // { name: 'project_id', label: 'Project name', required: true },
    {
      name: 'basket_name',
      label: 'Basket name',
      max: 100,
      required: true,
      alphaNumeric: false
    },
    {
      name: 'basket_owner',
      label: 'Basket Owner',
      max: 100,
      required: true,
      alphaNumeric: false
    },
    {
      name: 'start_date',
      label: 'Start date',
      required: true
    },
    {
      name: 'end_date',
      label: 'End date',
      max: 100,
      required: true
    }
  ];

  const validationSchema = CustomValidation(fields);

  const initialValues = {
    ticket_id: props.ticketId || '',
    basket_name: props?.data?.basket_name || '',
    basket_owner: props?.data?.basket_owner || '',
    start_date: props?.data?.start_date || '',
    end_date: props?.data?.end_date || ''
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

  const handleForm = async (values) => {
    // e.preventDefault();
    console.log('values', values);
    const formData = new FormData();
    formData.append('basket_name[]', values.basket_name);
    formData.append('basket_owner[]', values.basket_owner);
    formData.append('start_date[]', values.start_date);
    formData.append('end_date[]', values.end_date);
    formData.append('ticket_id', props?.ticketId);

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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          handleForm(values);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <Modal.Header closeButton>
              <Modal.Title id="example-custom-modal-styling-title">
                {props.data ? 'Edit Basket Details' : 'Add Basket'}
              </Modal.Title>
            </Modal.Header>

            {/* <form onSubmit={handleForm}> */}

            <Modal.Body>
              {/* <input
                type="hidden"
                name="ticket_id"
                defaultValue={props.ticketId}
                required
              />  */}
              <Field
                type="hidden"
                className="form-control form-control-sm"
                id="ticket_id"
                name="ticket_id"
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
                  {/* <input
                    type="text"
                    id="basket_name"
                    name={`${props.data ? 'basket_name' : 'basket_name[]'}`}
                    className="form-control form-control-sm"
                    defaultValue={props?.data ? props?.data?.basket_name : null}
                    onKeyPress={(e) => {
                      Validation.CharactersNumbersSpeicalOnly(e);
                    }}
                  /> */}

                  <Field
                    type="text"
                    className="form-control form-control-sm"
                    id="basket_name"
                    name="basket_name"
                    onKeyPress={(e) => {
                      Validation.CharacterWithSpace(e);
                    }}
                  />
                  <ErrorMessage
                    name="basket_name"
                    component="small"
                    className="text-danger"
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
                    // <Select
                    //   id="basket_owner"
                    //   name={`${props.data ? 'basket_owner' : 'basket_owner[]'}`}
                    //   options={user}
                    //   required
                    //   defaultValue={
                    //     props.data &&
                    //     props.data.basket_owner &&
                    //     user.filter((d) => d.value === props.data.basket_owner)
                    //   }
                    // />
                    <Select
                      options={user}
                      isClearable
                      id="basket_owner"
                      name="basket_owner"
                      defaultValue={
                        props.data &&
                        props.data.basket_owner &&
                        user.filter((d) => d.value === props.data.basket_owner)
                      }
                      // value={values.country_id}
                      onChange={(option) =>
                        setFieldValue('basket_owner', option?.value || null)
                      }
                    />
                  )}
                  <ErrorMessage
                    name="basket_owner"
                    component="small"
                    className="text-danger"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-6">
                  <label className="col-form-label">
                    <b>
                      Start Date :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  {/* <input
                    type="date"
                    id="start_date"
                    name={`${props.data ? 'start_date' : 'start_date[]'}`}
                    className="form-control form-control-sm"
                    onChange={handleFromDate}
                    // required
                    readOnly={
                      props?.data?.is_basket_edit === 1 || !props?.data
                        ? false
                        : true
                    }
                    // min={ticketData && ticketData.ticket_date}
                    min={new Date().toISOString().slice(0, 10)}
                    defaultValue={props.data ? props.data.start_date : null}
                  /> */}

                  <Field
                    type="date"
                    className="form-control form-control-sm"
                    id="start_date"
                    name="start_date"
                    min={new Date().toISOString().slice(0, 10)}
                  />
                  <ErrorMessage
                    name="start_date"
                    component="small"
                    className="text-danger"
                  />
                </div>
                <div className="col-sm-6">
                  <label className="col-form-label">
                    <b>
                      End Date :<Astrick color="red" size="13px" />
                    </b>
                  </label>
                  {/* <input
                    type="date"
                    name={`${props.data ? 'end_date' : 'end_date[]'}`}
                    className="form-control form-control-sm"
                    // required
                    min={todate}
                    readOnly={
                      props?.data?.is_basket_edit === 1 || !props?.data
                        ? false
                        : true
                    }
                    defaultValue={props.data ? props.data.end_date : null}
                  /> */}
                  <Field
                    type="date"
                    className="form-control form-control-sm"
                    id="end_date"
                    name="end_date"
                    min={todate}
                  />
                  <ErrorMessage
                    name="end_date"
                    component="small"
                    className="text-danger"
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
          </Form>
        )}
      </Formik>

      {/* </form> */}
    </Modal>
  );
}
