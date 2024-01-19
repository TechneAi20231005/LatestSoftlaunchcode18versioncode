import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import DataTable from "react-data-table-component";
import PageHeader from "../../components/Common/PageHeader";
import ErrorLogService from "../../services/ErrorLogService";
import TenantService from "../../services/MastersService/TenantService";
import { _base } from '../../settings/constants'
import Alert from "../../components/Common/Alert";
import ManageMenuService from '../../services/MenuManagementService/ManageMenuService'
import { Spinner } from 'react-bootstrap';
import { Modal } from "react-bootstrap";

function TenantComponent() {
    const location = useLocation()

    const [data, setData] = useState(null);
    const [notify, setNotify] = useState(null);

    const roleId = sessionStorage.getItem("role_id")
    const [checkRole, setCheckRole] = useState(null)

    const [showLoaderModal, setShowLoaderModal] = useState(false);

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
    
    const columns = [{
        name: "Action", selector: (row) => { }, sortable: false,width:"100px",
        cell: (row) =>
            <div className="btn-group" role="group" >
                <Link to={`/${_base}/TenantMaster/Edit/` + row.id} className="btn btn-outline-secondary">
                    <i className="icofont-edit text-success"></i>
                </Link>
            </div>
    },
    { name: "Sr", selector: (row) => row.counter, sortable: true, width:"100px"},
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

    ];

    const loadData = async () => {
        setShowLoaderModal(null);
        setShowLoaderModal(true);
        const data = [];
        await new TenantService().getTenant().then(res => {
            const tempData = [];
            if (res.status === 200) {
        setShowLoaderModal(false);

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
        setShowLoaderModal(false);

                if (res.data.status == 1) {
                    const getRoleId = sessionStorage.getItem("role_id");
                    setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
                }
            }
        })
    }



    useEffect(() => {
        loadData();
        if (location && location.state) {
            setNotify(location.state.alert);
        }
    }, [])

    useEffect(()=>{
        if(checkRole && checkRole[32].can_read === 0){
          // alert("Rushi")
      
          window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
        }
      },[checkRole])


    return (
        <div className="container-xxl">
            {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Tenant Master" renderRight={() => {
                return <div className="col-auto d-flex w-sm-100">
                    {checkRole && checkRole[32].can_create === 1 ?
                        <Link to={`/${_base + "/TenantMaster/Create"}`} className="btn btn-dark btn-set-task w-sm-100">
                            <i className="icofont-plus-circle me-2 fs-6"></i>Add Tenant
                        </Link> : ""}
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
            <Modal show={showLoaderModal} centered>
                <Modal.Body className="text-center">
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="secondary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                    <Spinner animation="grow" variant="dark" />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default TenantComponent;
