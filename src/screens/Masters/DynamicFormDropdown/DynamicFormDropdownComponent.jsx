import React, { useEffect, useState, useRef, useDebugValue } from "react";
import { Link, useLocation } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import StatusService from "../../../services/MastersService/StatusService";
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from 'react-select';
import Alert from "../../../components/Common/Alert";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel'
import { Spinner } from 'react-bootstrap';
import { Modal } from "react-bootstrap";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import {useDispatch,useSelector } from "react-redux";
import { getRoles } from "../../Dashboard/DashboardAction";
import DynamicFormDropDownSlice from "./Slices/DynamicFormDropDownSlice";
import { dynamicFormDropDownData } from "./Slices/DynamicFormDropDownAction";

export default function DynamicFormDropdownComponent() {
    const location = useLocation()

    // const [data, setData] = useState(null);
    const [dataa, setDataa] = useState(null);
    const [notify, setNotify] = useState(null);
    const [showLoaderModal, setShowLoaderModal] = useState(false);

    const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });

    // const [exportData, setExportData] = useState(null)
    const roleId = sessionStorage.getItem("role_id")
//   const [checkRole, setCheckRole] = useState(null)


const dispatch=useDispatch()
const checkRole = useSelector((DashbordSlice) =>DashbordSlice.dashboard.getRoles.filter((d) => d.menu_id == 35));
const  data = useSelector(DynamicFormDropDownSlice=>DynamicFormDropDownSlice.dynamicFormDropDown.getDynamicFormDropDownData)
const  exportData = useSelector(DynamicFormDropDownSlice=>DynamicFormDropDownSlice.dynamicFormDropDown.exportDynamicFormDropDownData)








    const searchRef = useRef()
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
        // setData(result);
      };
    

    const handleModal = (data) => {
        setModal(data);
    }


    const columns = [
        {
            name: "Action", selector: (row) => { }, sortable: false,
            cell: (row) =>
                <div className="btn-group" role="group" >
                    <Link to={`/${_base}/DynamicFormDropdown/Edit/` + row.id}
                        className="btn btn-outline-secondary">
                        <i className="icofont-edit text-success"></i>
                    </Link>
                </div>
        },
        { name: 'Sr', selector: row => row.counter, sortable: true, },
        { name: 'Dropdown Name', selector: row => row.dropdown_name, sortable: true, },
        {
            name: "Status", selector: (row) => row.is_active, sortable: true,
            cell: (row) => <div>
                {row.is_active == 1 && <span className="badge bg-primary">Active</span>}
                {row.is_active == 0 && <span className="badge bg-danger">Deactive</span>}
            </div>
        },
        { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
        { name: "Updated By", selector: (row) => row.updated_by, sortable: true },

    ];

    const loadData = async () => {
        // setShowLoaderModal(null);
        // setShowLoaderModal(true);
        const data = [];
        const exportTempData = [];
        // await new DynamicFormDropdownMasterService().getAllDynamicFormDropdown().then(res => {
        //     if (res.status === 200) {
        // setShowLoaderModal(false);

        //         let counter = 1;
        //         const temp = res.data.data
        //         for (const key in temp) {
        //             data.push({
        //                 counter: counter++,
        //                 id: temp[key].id,
        //                 dropdown_name: temp[key].dropdown_name,
        //                 is_active: temp[key].is_active,
        //                 updated_at: temp[key].updated_at,
        //                 updated_by: temp[key].updated_by,
        //             })

        //         }
        //         setData(null);
        //         setData(data);
        //         setDataa(data);

        //         for (const key in data) {
        //             exportTempData.push({
        //                 Sr: data[key].counter,
        //                 Dropdown: data[key].dropdown_name,
        //                 Status: data[key].is_active ? 'Active' : 'Deactive',
        //                 updated_at: data[key].updated_at,
        //                 updated_by: data[key].updated_by,
        //             })
        //         }

        //         setExportData(null)
        //         setExportData(exportTempData)
        //     }
        // }).catch(error => {
        //     const { response } = error;
        //     const { request, ...errorObject } = response;
        //     new ErrorLogService().sendErrorLog("Status", "Get_Status", "INSERT", errorObject.data.message);
        // })

        // await new ManageMenuService().getRole(roleId).then((res) => {
        //     if (res.status === 200) {
        //       // setShowLoaderModal(false);
      
        //       if (res.data.status == 1) {
        //         const getRoleId = sessionStorage.getItem("role_id");
        //         setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
        //       }
        //     }
        //   })
      
    }

    const tableData = {
        columns,
        data
    };

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
        if(!checkRole.length){
            dispatch(getRoles())
          }
          if(!data.length){
            dispatch(dynamicFormDropDownData())
          }
    }, [])
    useEffect(()=>{
        if(checkRole && checkRole[0]?.can_read === 0){
          // alert("Rushi")
    
          window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
        }
      },[checkRole])
    return (
        <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Dropdown Master" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    <Link to={`/${_base}/DynamicFormDropdown/Create`} className="btn btn-dark btn-set-task w-sm-100">
                        <i className="icofont-plus-circle me-2 fs-6"></i>Dropdown
                    </Link>
                </div>
            }} />

            <div className="card card-body">
                <div className="row">
                    <div className="col-md-9">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by Dropdown Name...."
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
                            fileName="Dynamic Form Dropdown master Records"
                        />
                    </div>
                </div>
            </div>


            <div className='card mt-2'>
                <div className='card-body'>
                    <div className="row clearfix g-3">
                        <div className="col-sm-12">
                            {data &&
                                <DataTableExtensions {...tableData}>
                                    <DataTable
                                        columns={columns}
                                        data={data}
                                        defaultSortField="title"
                                        pagination
                                        selectableRows={false}
                                        className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                        highlightOnHover={true}
                                    />
                                </DataTableExtensions>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* <Modal show={showLoaderModal} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="dark" />
                </Modal.Body>
            </Modal> */}
        </div>
    )
}
