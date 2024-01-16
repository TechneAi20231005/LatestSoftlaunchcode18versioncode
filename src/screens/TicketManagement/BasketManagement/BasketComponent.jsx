import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Dropdown } from "react-bootstrap"
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import ErrorLogService from "../../../services/ErrorLogService";
import MyTicketService from "../../../services/TicketService/MyTicketService"
import UserService from '../../../services/MastersService/UserService'
import BasketService from "../../../services/TicketService/BasketService"
import Select from 'react-select';
import { UserDropdown } from "../../Masters/UserMaster/UserComponent"
import { _base } from '../../../settings/constants'
import *  as Validation from '../../../components/Utilities/Validation';
import { logDOM } from "@testing-library/react";
import { Astrick } from '../../../components/Utilities/Style';


export default function BasketComponent({ match }) {
    const currentDate = new Date();
    const [userData, setUserData] = useState(null);
    const [notify, setNotify] = useState(null);
    const {ticketId} = useParams()
    const history = useNavigate();
    const mainJson = {
        ticket_id: ticketId,
        basket_name: null,
        basket_owner: null,
        start_date: null,
        end_date: null,
    };

    const [data, setData] = useState([mainJson]);
    const [index, setIndex] = useState({ index: 0 });
    const [dateAlert, setDateAlert] = useState(false)
    const handleChange = idx => e => {
        setIndex({ index: idx })
        const { name, value } = e.target;

        var flag = 1;

        for (const key in data) {
            if (data[key].basket_name == value) {
                alert("Same basket name already exists !!!");
                flag = 0;
            }
        }
        if(flag ==1){
        var startDate =document.getElementById("start_date").value
        var endDate = document.getElementById("end_date").value
        if(endDate < startDate){
            setDateAlert(true)
            flag=0
        }else{
            setDateAlert(false)
        }
        if(flag=0){
            setDateAlert(false)
        }

        }

        // if(flag==1)
        // {
        //     if (name === "basket_name[]") {
        //         data[idx].basket_name = value;
        //     }
        //     if (name === "basket_owner[]") {
        //         data[idx].basket_owner = value;
        //     }
        //     if(name==="start_date[]"){
        //         var todayDate = new Date();
        //         var startDate = new Date(value);
        //         if(startDate < todayDate){
        //             data[idx].start_date = '';
        //             setDateAlert({...dateAlert, startDateErr:'Given date is greater than the current date.'});
        //         }else{
        //             data[idx].start_date = value;
        //         }
        //     }
        //     if(name==="end_date[]"){
        //         var startdate = new Date(data[idx].start_date);
        //         var endDate = new Date(value);
        //         if(startdate > endDate){
        //             setDateAlert({...dateAlert, startDateErr:'Given date is greater than the start date.'});
        //         }else{
        //             data[idx].end_date = value;
        //         }
        //     }
        // }
    };

    const handleAddRow = async () => {
        let flag = 1;
        let last = data.length - 1;
        if ((!data[last].basket_name || !data[last].basket_owner) && last > 0) {
            flag = 0;
        }
        const item = {
            ticket_id: ticketId,
            basket_name: null,
            basket_owner: null,
            start_date: null,
            end_date: null,
        };
        // if (flag == 1) {
        await setData([...data, item]);
        // } else {
        //     setNotify({ show: true, type: "warning", message: "Please Fill Previous Row Values" });
        // }
    };


    const handleRemoveSpecificRow = (idx) => () => {
        if (idx > 0) {
            setData(data.filter((_, i) => i !== idx));
        }
    }
    const handleCheckInput = (e, idx) => {
        if (data.length > 1) {
            data.forEach((ele) => {
                // console.log(ele.basket_name);
            })
        }
    }

    const handleForm = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        formData.append('ticket_id', ticketId);
        formData.append('source', "AFTER_TICKET_INSERT");

        setNotify(null);

        if (data) {
            await new BasketService().postBasket(formData).then(res => {
                if (res.status === 200) {
                    if (res.data.status === 1) {
                        history({
                            pathname: `/${_base}/Ticket/Task/` + ticketId,
                            state: { alert: { type: 'success', message: res.data.message } }
                        });
                    } else {
                        setNotify({ type: "danger", message: res.data.message });
                    }
                } else {
                    new ErrorLogService().sendErrorLog("CreateBasket", "Create_CreateBasket", "INSERT", res.message);
                    setNotify({ type: "danger", message: res.message });
                }
            }).catch(error => {
                const { response } = error;
                const { request, ...errorObject } = response;
                new ErrorLogService().sendErrorLog("CreateBasket", "Get_CreateBasket", "INSERT", errorObject.data.message);
            })

            // var flag = 1;
            // for (var i = 0; i < data.length; i++) {
            //     saveBasket(rows[i]).then(res => {
            //         if (res.status == 0) {
            //             flag = 0;
            //             return;
            //         }
            //     });
            // }
            // if (flag === 1) {
            //     var returnValue = { show: true, type: "danger", message: "Not Inserted" };
            //     if (flag == 0) {
            //         returnValue.type = "danger";
            //         returnValue.message = "Not Inserted";
            //     } else {
            //         returnValue.type = "success";
            //         returnValue.message = "Inserted";
            //         history({
            //             pathname: `/${_base}/Ticket/Task/` + id,
            //             state: { showAlert: true, alertData: returnValue }
            //         });
            //     }
            // }

        }
    }
    const[fromDate, setFromDate]= useState();

    const handleStartDate =(e) =>{
        setFromDate(e.target.value)
    }

    const loadData = async () => {
        const inputRequired = 'id,employee_id,first_name,last_name,middle_name,is_active';
        await new UserService().getUserForMyTickets(inputRequired).then((res) => {
                        if (res.status === 200) {
                const tempData = [];
                const temp = res.data.data.filter(d=> d.is_active === 1);
                temp.sort((a, b) => {
                  if (a.first_name && b.first_name) {
                    return a.first_name.localeCompare(b.first_name);
                  }
                  return 0;
                });                  
                // const temp = res.data.data.filter(d=> d.is_active ==1);
                for (const key in temp) {
                    tempData.push({
                        value: temp[key].id,
                        label: temp[key].first_name + " " + temp[key].last_name+
                        " (" +
                        temp[key].id +
                        ")",
                    })
                }
                setUserData(null);
                setUserData(tempData);
            }
        })
    }
   

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Manage Basket" />
            {notify && <Alert alertData={notify} />}
            <div className='card mt-2' style={{ zIndex: 0 }}>
                <div className='card-body' >

                    <form onSubmit={handleForm} >
                        <div className='table-responsive'>
                            <table
                                className="table table-bordered mt-3 table-responsive"
                                id="tab_logic"
                            >
                                <thead>
                                    <tr>
                                        <th className="text-center"> Sr No </th>
                                        <th className="text-center"> Basket Name <Astrick color='red' /></th>
                                        <th className="text-center"> Owner<Astrick color='red' /> </th>
                                        <th className="text-center"> Start Date<Astrick color='red' /> </th>
                                        <th className="text-center"> End Date <Astrick color='red' /></th>
                                        <th className="text-center"> Action</th>
                                    </tr>
                                </thead>
                                <tbody>


                                    {data && data.map((item, idx) => (
                                        <tr id={`addr_${idx}`} key={idx}
                                            style={{ zIndex: 1000 }}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="basket_name[]"
                                                    defaultValue={item.basket_name}
                                                    onChange={e=>{handleChange(e,idx)}}
                                                    // onInput={e => { handleCheckInput(e, idx) }}
                                                    className="form-control form-control-sm"
                                                    required
                                                    autoComplete="false"
                                                 onKeyPress={e => { Validation.CharactersNumbersSpeicalOnly(e) }}
                                                />
                                            </td>

                                            <td style={{ zIndex: 1000 }}>
                                                {/* <UserDropdown
                                                    name="basket_owner[]"
                                                    required={true}
                                                    defaultValue={item.basket_owner}
                                                    onChange={handleChange(idx)}
                                              /> */}
                                                <select className="form-control form-control-sm"
                                                    name="basket_owner[]"
                                                    required={true}
                                                    defaultValue={item.basket_owner}
                                                    onChange={handleChange(idx)}
                                                >
                                                    <option value="">Select User</option>
                                                    {userData && userData.map((d) => {
                                                        return <option value={d.value}>{d.label}</option>
                                                    })}
                                                </select>

                                                {/* {userData &&
                                                    <Select
                                                        options={userData}
                                                        id="basket_owner[]" 
                                                        name="basket_owner[]"
                                                    />
                                                } */}
                                            </td>

                                            <td>
                                                {item.start_date}
                                                <input
                                                    type="date"
                                                    id="start_date"
                                                    name="start_date[]"
                                                    // key={Math.random()}
                                                    defaultvalue=""
                                                    onChange={e=>{handleChange(idx);handleStartDate(e)}}
                                                    min={new Date().toISOString().slice(0,10)}
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
                                                {dateAlert && dateAlert == true ? <span style={{color:"red", fontSize:"10px"}}>
                                                    End date should not be less than start date
                                                </span>: ""}
                                            </td>


                                            <td>
                                                {idx == data.length - 1 &&
                                                    <button type="button" onClick={handleAddRow} className="btn btn-sm btn-outline-primary pull-left">
                                                        <i class="icofont-plus-circle"></i>
                                                    </button>
                                                }
                                                {idx != data.length - 1 &&
                                                    <span>
                                                        <button type='button' className="btn btn-outline-danger btn-sm" onClick={handleRemoveSpecificRow(idx)}>
                                                            <i class="icofont-ui-delete"></i>
                                                        </button>
                                                    </span>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className='pull-right'>
                            <button type="Submit" className="btn btn-sm btn-primary">Submit</button>
                            {/* <ButtonComponent type="Link" url={`/${_base}/Ticket`} buttonColor="danger" textColor="white" text="Cancel" /> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
