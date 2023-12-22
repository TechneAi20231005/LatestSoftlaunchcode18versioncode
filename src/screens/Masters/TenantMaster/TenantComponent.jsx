import React, { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/Common/PageHeader";
import ErrorLogService from "../../../services/ErrorLogService";
import TenantService from "../../../services/MastersService/TenantService";
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService'
import { _base } from '../../../settings/constants'

function TenantComponent() {

    const [data, setData] = useState(null);

    const roleId = sessionStorage.getItem("role_id")
    const [checkRole, setCheckRole] = useState(null)

    const searchRef = useRef();
    const handleSearch = () => {
        const search = searchRef.current.value;
        const temp = data.filter(d => {
            return d.company_name.toLowerCase().match(new RegExp(search.toLowerCase(), 'g')) ||
                d.company_type.toLowerCase().match(new RegExp(search.toLowerCase(), 'g'))
        });
        setData(temp);
    }
    const columns = [
        { name: "#", selector: (row) => row.counter, sortable: true },
        { name: 'Name', selector: row => row.company_name, sortable: true, },
        { name: 'Type', selector: row => row.company_type, sortable: true, },
        {
            name: "Status", selector: (row) => row.is_active, sortable: false,
            cell: (row) => <div>
                {row.is_active == 1 && <span className="badge bg-primary">Active</span>}
                {row.is_active == 0 && <span className="badge bg-danger">Deactive</span>}
            </div>
        },
        { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
        { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
        {
            name: "Action", selector: (row) => { }, sortable: false,
            cell: (row) =>
                <div className="btn-group" role="group" >
                    <Link to={`/${_base}/Tenant/Edit/` + row.id} className="btn btn-outline-secondary">
                        <i className="icofont-edit text-success"></i>
                    </Link>
                </div>
        }
    ];

    const loadData = async () => {
        const data = [];
        await new TenantService().getTenant().then(res => {
            const tempData = [];
            if (res.status === 200) {
                let counter = 1;
                const data = res.data.data
                for (const key in data) {
                    tempData.push({
                        counter: counter++,
                        id: data[key].id,
                        company_name: data[key].company_name,
                        company_type: data[key].company_type,
                        remark: data[key].remark,
                        updated_at: data[key].updated_at,
                        updated_by: data[key].updated_by
                    })
                }

                setData(null);
                setData(tempData);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response;
            new ErrorLogService().sendErrorLog("Tenant", "Get_Tenant", "INSERT", errorObject.data.message);
        })

        await new ManageMenuService().getRole(roleId).then((res) => {
            if (res.status === 200) {
              if (res.data.status == 1) {
                const getRoleId = sessionStorage.getItem("role_id");
                setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
              }
            }
          })
      
    }

    // const handleForm = id =>async(e) => {
    //     e.preventDefault();
    //     const form=new FormData(e.target);
    //     if(!id){
    //         await new CityService().postCity(form).then(res=>{
    //             if(res.status===200){
    //                 setModal({showModal:false,modalData:"",modalHeader:""});
    //                 loadData();
    //             }else{
    //                 new ErrorLogService().sendErrorLog("City","Create_City","INSERT",res.message);    
    //             }
    //         }).catch(error => {
    //             const { response } = error;
    //             const { request, ...errorObject } = response; 
    //             new ErrorLogService().sendErrorLog("City","Create_City","INSERT",errorObject.data.message);
    //         })
    //     }else{
    //         await new CityService().updateCity(id,form).then(res=>{
    //             if(res.status===200){
    //                 setModal({showModal:false,modalData:"",modalHeader:""});
    //                 loadData();
    //             }else{
    //                 new ErrorLogService().sendErrorLog("City","Edit_City","INSERT",res.message);    
    //             }
    //         }).catch(error => {
    //             const { response } = error;
    //             const { request, ...errorObject } = response; 
    //             new ErrorLogService().sendErrorLog("City","Edit_City","INSERT",errorObject.data.message);
    //         })
    //     }
    // }

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="container-xxl">
            <PageHeader headerTitle="Tenant Master" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    {checkRole && checkRole[32].can_create ===1 ?
                    <Link className="btn btn-dark btn-set-task w-sm-100">
                        <i className="icofont-plus-circle me-2 fs-6"></i> Add Tenant
                    </Link>: ""}
                </div>
            }} />

            <div className="card card-body">
                <div className="row">
                    <div className="col-md-10">
                        <input type="text" className="form-control" placeholder="Search...."
                            ref={searchRef}
                        />
                    </div>
                    <div className='col-md-2'>
                        <button className='btn btn-sm btn-warning text-white' type="button"
                            onClick={handleSearch}
                            style={{ marginTop: '0px', fontWeight: '600' }}>
                            <i className="icofont-search-1 "></i> Search
                        </button>
                        <button className='btn btn-sm btn-info text-white' type="button" onClick={() => window.location.reload(false)}
                            style={{ marginTop: '0px', fontWeight: '600' }}><i className="icofont-refresh text-white"></i> Reset
                        </button>
                    </div>
                </div>
            </div>


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
    )
}

export default TenantComponent;
