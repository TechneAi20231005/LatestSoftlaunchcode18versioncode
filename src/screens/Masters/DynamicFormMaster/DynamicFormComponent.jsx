import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import DynamicFormService from "../../../services/MastersService/DynamicFormService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import Select from 'react-select';
import { Astrick } from '../../../components/Utilities/Style'
import *  as Validation from '../../../components/Utilities/Validation';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel'
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService'
import { Spinner } from 'react-bootstrap';
import { Modal } from "react-bootstrap";


function DynamicFormComponent({ location }) {
    const [data, setData] = useState(null);
    const [dataa, setDataa] = useState(null);
    const [notify, setNotify] = useState(null);
    const [exportData, setExportData] = useState(null)
    const [showLoaderModal, setShowLoaderModal] = useState(false);

    const roleId = sessionStorage.getItem("role_id")
    const [checkRole, setCheckRole] = useState(null)

    const searchRef = useRef();
   
    function SearchInputData(data, search) {
        const lowercaseSearch = search.toLowerCase();
    
        return data.filter((d) => {
          for (const key in d) {
            if (
              typeof d[key] === "string" &&
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
    

    const columns = [
        {
            name: "Action", selector: (row) => { }, sortable: false, width: "80px",
            cell: (row) =>
                <div className="btn-group" role="group" >
                    <Link to={`/${_base}/DynamicForm/Edit/` + row.id}
                        className="btn btn-outline-secondary">
                        <i className="icofont-edit text-success"></i>
                    </Link>
                </div>
        },
        { name: "Sr", selector: (row) => row.counter, sortable: true, width: "60px" },
        { name: "Form Name", selector: (row) => row.template_name, sortable: true },
        {
            name: "Status", selector: (row) => row.is_active, sortable: false,
            cell: (row) => <div>
                {row.is_active == 1 && <span className="badge bg-primary" style={{ width: "4rem" }}>Active</span>}
                {row.is_active == 0 && <span className="badge bg-danger" style={{ width: "4rem" }}>Deactive</span>}
            </div>
        },
        { name: 'Created At', selector: (row) => row.created_at, sortable: true, width: "175px" },
        { name: 'Created By', selector: (row) => row.created_by, sortable: true, width: "175px" },
        { name: 'Updated At', selector: (row) => row.updated_at, sortable: true, width: "175px" },
        { name: 'Updated By', selector: (row) => row.updated_by, sortable: true, width: "175px" },
    ];

    const loadData = async () => {
        setShowLoaderModal(null);
        // setShowLoaderModal(true);
        const data = [];
        const exportTempData = [];
        await new DynamicFormService().getDynamicForm().then(res => {
            if (res.status === 200) {
                setShowLoaderModal(false);

                let counter = 1;
                const temp = res.data.data
                for (const key in temp) {
                    data.push({
                        counter: counter++,
                        id: temp[key].id,
                        template_name: temp[key].template_name,
                        is_active: temp[key].is_active,
                        remark: temp[key].remark,
                        created_at: temp[key].created_at,
                        created_by: temp[key].created_by,
                        updated_at: temp[key].updated_at,
                        updated_by: temp[key].updated_by
                    })
                }
                setData(null);
                setData(data);
                setDataa(data);

                for (const i in data) {
                    exportTempData.push({
                        Sr: data[i].counter,
                        form_Name: data[i].template_name,
                        Status: data[i].is_active ? 'Active' : 'Deactive',
                        created_at: temp[i].created_at,
                        created_by: temp[i].created_by,
                        updated_at: data[i].updated_at,
                        updated_by: data[i].updated_by,
                    })
                }

                setExportData(null)
                setExportData(exportTempData)
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("DynamicForm", "Get_DynamicForm", "INSERT", errorObject.data.message);
        })

        await new ManageMenuService().getRole(roleId).then((res) => {
            if (res.status === 200) {
                setShowLoaderModal(false);

                if (res.data.status == 1) {
                    const getRoleId = sessionStorage.getItem("role_id");
                    setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
                }
            }
        })
    }

    //Search As Enter key press
    useEffect(() => {
        const listener = event => {
            if (event.code === "Enter") {
                // callMyFunction();
                handleSearch()
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, [data]);


    useEffect(() => {
        loadData();
        if (location && location.state) {
            setNotify(location.state.alert);
        }
    },[])

    useEffect(() => {
        if (checkRole && checkRole[13].can_read === 0) {
            // alert("Rushi")

            window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
        }

    }, [checkRole])


    return (
        <div className="container-xxl">

            {notify && <Alert alertData={notify} />}

            <PageHeader headerTitle="Dynamic Form Master" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    {checkRole && checkRole[13].can_create === 1 ?
                        <Link to={`/${_base + "/DynamicForm/Create"}`} className="btn btn-dark btn-set-task w-sm-100">
                            <i className="icofont-plus-circle me-2 fs-6"></i>Add Form
                        </Link> : ""}
                </div>
            }} />

            <div className="card card-body">
                <div className="row">
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Form Name...."
                            ref={searchRef}
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
                            apiData={exportData}
                            fileName="Dynamic Form master Records"
                        />
                    </div>
                </div>
            </div>


            <div className='card mt-2'>
                <div className='card-body'>
                    <div className="row clearfix g-3">
                        <div className="col-sm-12">
                            {data && <DataTable
                                columns={columns}
                                data={data}
                                defaultSortField="title"
                                pagination
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                            />
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showLoaderModal} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success"/>
                    <Spinner animation="grow" variant="danger"/>
                    <Spinner animation="grow" variant="warning"/>
                    <Spinner animation="grow" variant="info"/>
                    <Spinner animation="grow" variant="dark"/>
                </Modal.Body>
            </Modal>
        </div>
    )
}

function DynamicFormDropdown(props) {
    const [data, setData] = useState(null);
    useEffect(async () => {
        const tempData = [];
        await new DynamicFormService().getDynamicForm().then(res => {
            if (res.status === 200) {
                let counter = 1;
                const data = res.data.data;
                for (const key in data) {
                    tempData.push({
                        counter: counter++,
                        id: data[key].id,
                        template_name: data[key].template_name
                    })
                }
                setData(tempData);
            }
        });
    }, [])

    return (
        <>
            {data &&
                <select className="form-control form-control-sm"
                    id={props.id}
                    name={props.name}
                    onChange={props.getChangeValue}
                    required={props.required ? true : false}
                >
                    {props.defaultValue == 0 && <option value="">Select Form</option>}
                    {props.defaultValue != 0 && <option value="">Select Form</option>}
                    {data.map(function (item, i) {
                        if (props.defaultValue && props.defaultValue == item.id) {
                            return <option key={i} value={item.id} selected>{item.template_name}</option>
                        } else {
                            return <option key={i} value={item.id}>{item.template_name}</option>
                        }
                    })
                    }
                </select>
            }
            {!data && <p> Loading....</p>}
        </>
    )
}
export { DynamicFormComponent, DynamicFormDropdown };
