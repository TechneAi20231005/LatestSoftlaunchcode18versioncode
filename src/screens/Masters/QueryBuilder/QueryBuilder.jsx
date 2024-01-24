// import React, { useState, useEffect } from "react";
// import { useNavigate } from 'react-router-dom'
// import { Link } from 'react-router-dom'
// import { _base } from '../../../settings/constants'
// import { Astrick } from "../../../components/Utilities/Style";
// import Select from 'react-select';
// import axios from 'axios';

// const QueryBuilder = () => {

//     const [inputList, setInputList] = useState([
//         {
//             inputType: "",
//         },
//     ]);

//     const [inputListTD, setInputListTD] = useState([
//         {
//             inputType: "",
//         },
//     ]);

//     const tables = [
//         { value: 'tai_country_master', label: 'tai_country_master' },
//         { value: 'tai_state_master', label: 'tai_state_master' },
//         { value: 'tai_city_master', label: 'tai_city_master' }
//     ]

//     const fields = [
//         { value: '*', label: 'all(*)' },
//         { value: 'id', label: 'id' },
//         { value: 'country', label: 'country' },
//         { value: 'city', label: 'city' },
//         { value: 'state', label: 'state' }
//     ]

//     const keys = [
//         { value: 'id', label: 'id' },
//         { value: 'country', label: 'country' },
//         { value: 'city', label: 'city' },
//         { value: 'state', label: 'state' }
//     ]

//     const operator = [
//         { value: '>', label: '>' },
//         { value: '=', label: '=' },
//         { value: '<', label: '<' },
//         { value: 'LIKE', label: 'LIKE' }
//     ]

//     const joinTo = [
//         { value: 'id', label: 'id' },
//         { value: 'country', label: 'country' },
//         { value: 'city', label: 'city' },
//         { value: 'state_id', label: 'state_id' },
//         { value: 'country_id', label: 'country_id' },
//         { value: 'state', label: 'state' }
//     ]

//     const joinFrom = [
//         { value: 'id', label: 'id' },
//         { value: 'country', label: 'country' },
//         { value: 'city', label: 'city' },
//         { value: 'state', label: 'state' }
//     ]

//     // handle click event of the Remove button
//     const handleRemoveClick = (index) => {
//         const list = [...inputList];
//         list.splice(index, 1);
//         setInputList(list);
//     };

//     // handle click event of the Add button
//     const handleAddClick = () => {
//         setInputList([...inputList, {}]);
//     };

//     // handle click event of the Remove button
//     const handleRemoveClickTd = (index) => {
//         const list = [...inputListTD];
//         list.splice(index, 1);
//         setInputListTD(list);
//     };

//     // handle click event of the Add button
//     const handleAddClickTd = () => {
//         setInputListTD([...inputListTD, {}]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const form = new FormData(e.target);

//         const buildQuery = (form) => {
//             axios
//                 .post("http://15.207.120.175/TSDDummy/public/api/customReport", form)
//                 .then(function (response) {
//                 })
//                 .catch(function (error) {
//                     console.log(error);
//                 });
//         }

//         buildQuery(form);

//         // for (let [key, value] of form.entries()) {
//         //     console.log(key, value);
//         // }

//     }
//     return (
//         <>
//             <div className="body d-flex py-3">
//                 <div className="container-xxl">
//                     <div className="row clearfix g-3">
//                         <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
//                             <div className="card">
//                                 <div className="card-header d-flex justify-content-between bg-transparent 
//                                 border-bottom-0">
//                                     <h2 className="mb-0 fw-bold ">Custome Reports</h2>
//                                 </div>
//                             </div>
//                             <div className='card mt-2'>
//                                 <div className='card-body'>
//                                     <form onSubmit={handleSubmit}>
//                                         <div >
//                                             <table
//                                                 className="table table-bordered mt-3 table-responsive"
//                                                 id="tab_logic"
//                                             >
//                                                 <thead>
//                                                     <tr>
//                                                         <th className="text-center"> # </th>
//                                                         <th className="text-center"> Table </th>
//                                                         <th className="text-center"> Fields </th>
//                                                         <th className="text-center"> Conditions </th>
//                                                         <th className="text-center">Action</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {inputList.map((x, i) => {
//                                                         return <tr key={i}>
//                                                             <td className="">{i + 1}</td>
//                                                             <td className="col-md-12 d-flex">
//                                                                 <Select options={tables} name="tables[]" className="form-control-sm col-md-4" />
//                                                                 <Select className="form-control-sm col-md-4" options={joinFrom} name="joinTo[]" />
//                                                                 <Select className="form-control-sm col-md-4" options={joinTo} name="joinFrom[]" />
//                                                             </td>
//                                                             <td className="col-md-3">
//                                                                 <Select
//                                                                     closeMenuOnSelect={false}
//                                                                     isMulti
//                                                                     options={fields}
//                                                                     name={`fields[${i}][]`}
//                                                                 />
//                                                             </td>
//                                                             <td className="col-md-5">
//                                                                 {inputListTD.map((y, j) => {
//                                                                     return <div className="d-flex col-12" key={j}>
//                                                                         <Select className="form-control-sm col-md-4" options={keys} name={`keys[${i}][]`} />
//                                                                         <Select className="form-control-sm col-md-2" options={operator} name={`operators[${i}][]`} />
//                                                                         <input className="form-control-sm col-md-4" type="text" name={`values[${i}][]`} placeholder="Enter Value" />
//                                                                         {inputListTD.length !== 1 && (
//                                                                             <button
//                                                                                 className="btn btn-danger"
//                                                                                 onClick={() => handleRemoveClickTd(j)}
//                                                                             ><i className="icofont-ui-delete"></i>
//                                                                             </button>
//                                                                         )}
//                                                                         {inputListTD.length - 1 === j && (
//                                                                             <button
//                                                                                 onClick={handleAddClickTd}
//                                                                                 className="btn btn-primary"
//                                                                             ><i className="icofont-plus-circle"></i>
//                                                                             </button>
//                                                                         )}
//                                                                     </div>
//                                                                 })}
//                                                             </td>
//                                                             <td className="">
//                                                                 {inputList.length !== 1 && (
//                                                                     <button
//                                                                         className="btn btn-danger"
//                                                                         onClick={() => handleRemoveClick(i)}
//                                                                     ><i className="icofont-ui-delete"></i>
//                                                                     </button>
//                                                                 )}
//                                                                 {inputList.length - 1 === i && (
//                                                                     <button
//                                                                         onClick={handleAddClick}
//                                                                         className="btn btn-primary"
//                                                                     ><i className="icofont-plus-circle"></i>
//                                                                     </button>
//                                                                 )}
//                                                             </td>
//                                                         </tr>
//                                                     })}
//                                                 </tbody>
//                                             </table>
//                                         </div>
//                                         <div className='pull-right'>
//                                             <button type="submit" className="btn btn-sm btn-primary">Submit</button>

//                                             <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>

//                                         </div>


//                                     </form>

//                                 </div>   {/* Card Body */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default QueryBuilder


import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { _base } from '../../../settings/constants'
import { Astrick } from "../../../components/Utilities/Style";
import Select from 'react-select';
import axios from 'axios';

const QueryBuilder = () => {

    const [inputList, setInputList] = useState([
        {
            inputType: "",
        },
    ]);

    const [inputListTD, setInputListTD] = useState([
        {
            inputType: "",
        },
    ]);

    const tables = [
        { value: 'tai_country_master', label: 'tai_country_master' },
        { value: 'tai_state_master', label: 'tai_state_master' },
        { value: 'tai_city_master', label: 'tai_city_master' }
    ]

    const fields = [
        { value: '*', label: 'all(*)' },
        { value: 'id', label: 'id' },
        { value: 'country', label: 'country' },
        { value: 'city', label: 'city' },
        { value: 'state', label: 'state' }
    ]

    const keys = [
        { value: 'id', label: 'id' },
        { value: 'country', label: 'country' },
        { value: 'city', label: 'city' },
        { value: 'state', label: 'state' }
    ]

    const operator = [
        { value: '>', label: '>' },
        { value: '=', label: '=' },
        { value: '<', label: '<' },
        { value: 'LIKE', label: 'LIKE' }
    ]

    const joinTo = [
        { value: 'id', label: 'id' },
        { value: 'country', label: 'country' },
        { value: 'city', label: 'city' },
        { value: 'state_id', label: 'state_id' },
        { value: 'country_id', label: 'country_id' },
        { value: 'state', label: 'state' }
    ]

    const joinFrom = [
        { value: 'id', label: 'id' },
        { value: 'country', label: 'country' },
        { value: 'city', label: 'city' },
        { value: 'state', label: 'state' }
    ]

    // handle click event of the Remove button
    const handleRemoveClick = (index) => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, {}]);
    };

    // handle click event of the Remove button
    const handleRemoveClickTd = (index) => {
        const list = [...inputListTD];
        list.splice(index, 1);
        setInputListTD(list);
    };

    // handle click event of the Add button
    const handleAddClickTd = () => {
        setInputListTD([...inputListTD, {}]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);

        const buildQuery = (form) => {
            axios
                .post("http://3.108.206.34/TSDDummy/public/api/customReport", form)
                .then(function (response) {
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        buildQuery(form);

        // for (let [key, value] of form.entries()) {
        //     console.log(key, value);
        // }

    }
    return (
        <>
            <div className="body d-flex py-3">
                <div className="container-xxl">
                    <div className="row clearfix g-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between bg-transparent 
                                border-bottom-0">
                                    <h2 className="mb-0 fw-bold ">Custome Reports</h2>
                                </div>
                            </div>
                            <div className='card mt-2'>
                                <div className='card-body'>
                                    <form onSubmit={handleSubmit}>
                                        <div >
                                            <table
                                                className="table table-bordered mt-3 table-responsive"
                                                id="tab_logic"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="text-center"> # </th>
                                                        <th className="text-center"> Table </th>
                                                        <th className="text-center"> Fields </th>
                                                        <th className="text-center"> Conditions </th>
                                                        <th className="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inputList.map((x, i) => {
                                                        return <tr key={i}>
                                                            <td className="">{i + 1}</td>
                                                            <td className="col-md-12 d-flex">
                                                                <Select options={tables} name="tables[]" className="form-control-sm col-md-4" />
                                                                <Select className="form-control-sm col-md-4" options={joinFrom} name="joinTo[]" />
                                                                <Select className="form-control-sm col-md-4" options={joinTo} name="joinFrom[]" />
                                                            </td>
                                                            <td className="col-md-3">
                                                                <Select
                                                                    closeMenuOnSelect={false}
                                                                    isMulti
                                                                    options={fields}
                                                                    name={`fields[${i}][]`}
                                                                />
                                                            </td>
                                                            <td className="col-md-5">
                                                                {inputListTD.map((y, j) => {
                                                                    return <div className="d-flex col-12" key={j}>
                                                                        <Select className="form-control-sm col-md-4" options={keys} name={`keys[${i}][]`} />
                                                                        <Select className="form-control-sm col-md-2" options={operator} name={`operators[${i}][]`} />
                                                                        <input className="form-control-sm col-md-4" type="text" name={`values[${i}][]`} placeholder="Enter Value" />
                                                                        {inputListTD.length !== 1 && (
                                                                            <button
                                                                                className="btn btn-danger"
                                                                                onClick={() => handleRemoveClickTd(j)}
                                                                            ><i className="icofont-ui-delete"></i>
                                                                            </button>
                                                                        )}
                                                                        {inputListTD.length - 1 === j && (
                                                                            <button
                                                                                onClick={handleAddClickTd}
                                                                                className="btn btn-primary"
                                                                            ><i className="icofont-plus-circle"></i>
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                })}
                                                            </td>
                                                            <td className="">
                                                                {inputList.length !== 1 && (
                                                                    <button
                                                                        className="btn btn-danger"
                                                                        onClick={() => handleRemoveClick(i)}
                                                                    ><i className="icofont-ui-delete"></i>
                                                                    </button>
                                                                )}
                                                                {inputList.length - 1 === i && (
                                                                    <button
                                                                        onClick={handleAddClick}
                                                                        className="btn btn-primary"
                                                                    ><i className="icofont-plus-circle"></i>
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className='pull-right'>
                                            <button type="submit" className="btn btn-sm btn-primary">Submit</button>

                                            <Link to={`/${_base}/DynamicForm`} className="btn btn-sm btn-danger text-white">Cancel</Link>

                                        </div>


                                    </form>

                                </div>   {/* Card Body */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QueryBuilder