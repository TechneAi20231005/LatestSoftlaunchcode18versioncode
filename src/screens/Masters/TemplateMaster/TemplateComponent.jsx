
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import DataTable from "react-data-table-component";
import { _base } from "../../../settings/constants";
import ErrorLogService from "../../../services/ErrorLogService";
import TemplateService from "../../../services/MastersService/TemplateService";
import PageHeader from "../../../components/Common/PageHeader";
import Select from 'react-select';
import Alert from "../../../components/Common/Alert";
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel'
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService'
import { Modal } from "react-bootstrap";

import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { templateData } from "./TemplateComponetAction";
import { getRoles } from "../../Dashboard/DashboardAction";
import TemplateComponetSlice from "./TemplateComponetSlice";

function TemplateComponent() {
  const location = useLocation()
  const  dispatch=useDispatch()
  const templatedata=useSelector(TemplateComponetSlice=>TemplateComponetSlice.tempateMaster.templateData)
  const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 15));



  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [dataa, setDataa] = useState(null);
  const [modal, setModal] = useState({ showModal: false, modalData: "", modalHeader: "" });
  const [showLoaderModal, setShowLoaderModal] = useState(false);

  const [exportData, setExportData] = useState(null)

  const roleId = sessionStorage.getItem("role_id")
  // const [checkRole, setCheckRole] = useState(null)


  const handleModal = (data) => {
    setModal(data);
  }


  
  
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
    setData(result);
  };


  const columns = [
    {
      name: "Action", selector: (row) => { }, sortable: false,width: "80px",
      cell: (row) =>
        <div className="btn-group" role="group" >
          <Link to={`/${_base}/Template/Edit/` + row.id} className="btn btn-outline-secondary"
          ><i className="icofont-edit text-success"></i>
          </Link>
        </div>
    },
    { name: "Sr", selector: (row) => row.counter, sortable: true, width: "80px", },
    { name: "Template Name", selector: (row) => row.template_name, sortable: true, width: "150px", },
    {
      name: "Status", selector: (row) => row.is_active, sortable: false,width:"150px",
      cell: (row) => <div>
        {row.is_active == 1 && <span className="badge bg-primary">Active</span>}
        {row.is_active == 0 && <span className="badge bg-danger">Deactive</span>}
      </div>
    },
    { name: 'Created At', selector: (row) => row.created_at, sortable: true, width: "175px" },
    { name: 'Created By', selector: (row) => row.created_by, sortable: true, width: "150px" },
    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true, width: "175px" },
    { name: 'Updated By', selector: (row) => row.updated_by, sortable: true, width: "150px" },
  ];

  const loadData = async () => {
  
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    // const data = [];
    // const exportTempData = []
    // await new TemplateService().getTemplate().then(res => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);

    //     let counter = 1;
    //     const temp = res.data.data;
    //     for (const key in temp) {
    //       data.push({
    //         counter: counter++,
    //         id: temp[key].id,
    //         template_name: temp[key].template_name,
    //         is_active: temp[key].is_active,
    //         remark: temp[key].remark,
    //         created_at: temp[key].created_at,
    //         created_by: temp[key].created_by,
    //         updated_at: temp[key].updated_at,
    //         updated_by: temp[key].updated_by,
    //       })
    //     }
    //     setData(null);
    //     setData(data);
    //     setDataa(data);

    //     for (const key in data) {
    //       exportTempData.push({
    //         Sr: data[key].counter,
    //         template_name: data[key].template_name,
    //         Status: data[key].is_active ? 'Active' : 'Deactive',
    //         created_at: data[key].created_at,
    //         created_by: data[key].created_by,
    //         updated_at: data[key].updated_at,
    //         updated_by: data[key].updated_by,
    //       })
    //     }

    //     setExportData(null)
    //     setExportData(exportTempData)
    //   }
    // }).catch(error => {
    //   const { response } = error;
    //   const { request, ...errorObject } = response;
    //   new ErrorLogService().sendErrorLog("Template Master", "Get_TemplateMaster", "INSERT", errorObject.data.message);
    // })

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);

    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter(d => d.role_id == getRoleId))
    //     }
    //   }
    // })

  }

  //Search As Enter key press
  // useEffect(() => {
  //   const listener = event => {
  //     if (event.code === "Enter") {
  //       console.log("Enter key was pressed. Run your function.");
  //       // callMyFunction();
  //       handleSearch()
  //     }
  //   };
  //   document.addEventListener("keydown", listener);
  //   return () => {
  //     document.removeEventListener("keydown", listener);
  //   };
  // }, [data]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  };

  useEffect(() => {
    loadData();

    if(!templatedata.length){
      dispatch(templateData())
      dispatch(getRoles())
    }
    if (location && location.state) {
      setNotify(location.state.notify);
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
      <PageHeader headerTitle="Template Master" renderRight={() => {
        return <div className="col-auto d-flex w-sm-100">
          {checkRole && checkRole[0]?.can_create === 1 ?
            <Link to={`/${_base + "/Template/Create"}`} className="btn btn-dark btn-set-task w-sm-100">
              <i className="icofont-plus-circle me-2 fs-6"></i>Add Template
            </Link> : ""}
        </div>
      }} />

      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Templete Name...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
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
              fileName="Template master Records"
            />
          </div>
        </div>
      </div>

      <div className='card mt-2'>
        <div className='card-body'>
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {templatedata && <DataTable
                columns={columns}
                data={templatedata}
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


function TemplateDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new TemplateService().getTemplate().then(res => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            template_name: data[key].template_name,
            created_at: data[key].created_at,
            created_by: data[key].created_by,
          });
        }
        setData(tempData);
      }
    });
  }, []);

  return (
    <>

      {data && (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={props.name}
          onChange={props.getChangeValue}
          required={props.required ? true : false}
          value={props.defaultValue}
        >
          {/* {props.defaultValue === 0 && (
              <option value={0} selected>
                Select Stage Type
              </option>
            )} */}
          {props.defaultValue !== 0 && (
            <option value={0}>Select Template</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.template_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.template_name}
                </option>
              );
            }
          })}
        </select>
      )}
      {!data && <p> Loading....</p>}
    </>
  );
}


export { TemplateComponent, TemplateDropdown };
