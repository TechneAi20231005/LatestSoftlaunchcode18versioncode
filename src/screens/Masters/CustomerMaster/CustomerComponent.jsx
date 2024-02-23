import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import CustomerService from "../../../services/MastersService/CustomerService";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import { _base } from "../../../settings/constants";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import "react-data-table-component-extensions/dist/index.css";
import { Spinner } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { UseDispatch,useDispatch,useSelector } from "react-redux";
import { dashboardSlice } from "../../Dashboard/DashbordSlice";
import { getCustomerData, getRoles } from "../../Dashboard/DashboardAction";


function CustomerComponent() {
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState(null);
  const [dataa, setDataa] = useState(null);
  const [customer, setCustomer] = useState();
  // const [exportData, setExportData] = useState(null);
  // const [showLoaderModal, setShowLoaderModal] = useState(false);
  const roleId = sessionStorage.getItem("role_id");
  // const [checkRole, setCheckRole] = useState(null);
  const [historyState, setHistoryState] = useState();
  const searchRef = useRef();
  const location = useLocation();




  const dispatch = useDispatch()
  const getallCustomer = useSelector(dashboardSlice=>dashboardSlice.dashboard.getAllCustomerData)
  const exportData = useSelector(dashboardSlice=>dashboardSlice.dashboard.exportCustomerData)
  const checkRole = useSelector((DashboardSlice) =>DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id == 2));




  

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

  // const handleSearch = () => {
  //   const SearchValue = searchRef.current.value;
  //   const result = SearchInputData(data, SearchValue);
  //   setData(result);
  // };

  const [searchTerm, setSearchTerm] = useState('');
  // const handleSearch = (e) => {
  //   setSearchTerm(e.target.value);
  // };
  const [filteredData, setFilteredData] = useState([]);
  
  const handleSearch = (value) => {
    console.log("fff",filteredData);
  };
  

  const columns = [
    {
      name: "Action",
      selector: (row) => {},
      sortable: false,
      width: "80px",
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Customer/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      ),
    },
    {
      name: "Sr",
      selector: (row) => row.counter,
      sortable: true,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "150px",
    },
    { name: "Type", selector: (row) => row.type_name, sortable: true },
    {
      name: "Status",
      selector: (row) => row.is_active,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: "4rem" }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger" style={{ width: "4rem" }}>
              Deactive
            </span>
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.created_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Created By",
      selector: (row) => row.created_by,
      sortable: true,
      width: "175px",
    },
    {
      name: "Updated At",
      selector: (row) => row.updated_at,
      sortable: true,
      width: "175px",
    },
    {
      name: "Updated By",
      selector: (row) => row.updated_by,
      sortable: true,
      width: "175px",
    },
  ];
  const tableData = {
    columns,
    data,
  };
  const loadData = async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    // const data = [];
    const exportTempData = [];
    // await new CustomerService()
    //   .getCustomer()
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setShowLoaderModal(false);
    //       setDataa(res.data.data);
    //       let counter = 1;
    //       const temp = res.data.data;

    //       for (const key in temp) {
    //         data.push({
    //           counter: counter++,
    //           id: temp[key].id,
    //           name: temp[key].name,
    //           type: temp[key].type_name,
    //           email_id: temp[key].email_id,
    //           contact_no: temp[key].contact_no,
    //           address: temp[key].address,
    //           pincode: temp[key].pincode,
    //           country: temp[key].country,
    //           state: temp[key].state,
    //           City: temp[key].city,
    //           is_active: temp[key].is_active,
    //           created_at: temp[key].created_at,
    //           created_by: temp[key].created_by,
    //           updated_at: temp[key].updated_at,
    //           updated_by: temp[key].updated_by,
    //         });
    //       }
    //       setData(null);
    //       setData(data);
    //       for (const i in temp) {
    //         exportTempData.push({
    //           counter: counter++,
    //           Name: temp[i].name,
    //           Customer_Type: temp[i].type_name,
    //           Email: temp[i].email_id,
    //           Contact_Number: temp[i].contact_no,
    //           Address: temp[i].address,
    //           Pincode: temp[i].pincode,
    //           Country: temp[i].country,
    //           State: temp[i].state,
    //           City: temp[i].city,
    //           Status: temp[i].is_active ? "Active" : "Deactive",
    //           created_at: temp[i].created_at,
    //           created_by: temp[i].created_by,
    //           updated_at: temp[i].updated_at,
    //           updated_by: temp[i].updated_by,
    //         });
    //       }
    //       setExportData(null);
    //       setExportData(exportTempData);
    //     }
    //   })
    //   .catch((error) => {
    //     if (error.message) {
    //       const { response } = error;
    //       const { request, ...errorObject } = response;
    //       new ErrorLogService().sendErrorLog(
    //         "Customer Master",
    //         "Get_Customer",
    //         "INSERT",
    //         errorObject.data.message
    //       );
    //     } else {
    //       console.log(error);
    //     }
    //   });

    // await new ManageMenuService().getRole(roleId).then((res) => {
    //   if (res.status === 200) {
    //     setShowLoaderModal(false);
    //     if (res.data.status == 1) {
    //       const getRoleId = sessionStorage.getItem("role_id");
    //       setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
    //     }
    //   }
    // });
  };
  // useEffect(() => {
  //   const listener = event => {
  //     if (event.code === "Enter") {
  //       event.preventDefault();
  //       // callMyFunction();
  //       handleSearch()
  //     }
  //   };
  //   document.addEventListener("keydown", listener);
  //   return () => {
  //     document.removeEventListener("keydown", listener);
  //   };
  // }, [data]);

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     handleSearch();
  //   }
  // };
  // const handleKeyDown = (event, searchTerm) => {
  //   if (event.key === "Enter") {
  //     handleSearch(searchTerm);
  //   }
  // };
  useEffect(() => {
    loadData();
    dispatch(getCustomerData())

    // if(!getallCustomer.length){
     
    // }
    if(!checkRole.length){
      dispatch(getRoles())

    }
    if (location && location.state) {
      setNotify(location.state);
    }
    return () => {
      setNotify(null);
    };
  }, []);


  useEffect(() => {
    setFilteredData(getallCustomer.filter(customer => {
      if (typeof searchTerm === 'string') {
        if (typeof customer === 'string') {
          return customer.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (typeof customer === 'object') {
          return Object.values(customer).some(value =>
            typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }
      return false;
    }));
  }, [searchTerm, getallCustomer]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Customer Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/Customer/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Customer
                </Link>
              ) : (
                ""
              )}
            </div>
          );
        }}
      />
      <div className="card card-body">
        <div className="row">
          <div className="col-md-9">
            <input
              type="text"
              className="form-control"
              placeholder="Search by customer Name...."
              ref={searchRef}
              // onKeyDown={handleKeyDown}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              value={searchTerm} 
              onClick={() => handleSearch(searchTerm)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
              style={{ marginTop: "0px", fontWeight: "600" }}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
            <ExportToExcel
              className="btn btn-sm btn-danger"
              apiData={exportData}
              fileName="Customer master Records"
            />
          </div>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {getallCustomer && (
                <DataTable
                  columns={columns}
                  // data={getallCustomer}

                  // data={getallCustomer.filter(customer => {
                  //   if (customer && typeof customer === 'string') {
                  //     return customer?.toLowerCase()?.includes(searchTerm?.toLowerCase());
                  //   } else if (customer && typeof customer === 'object') {
                  //     return Object.values(customer).some(value =>
                  //       value && value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
                  //     );
                  //   }
                  //   return false;
                  // })}
                  data={getallCustomer.filter(customer => {
                    if (typeof searchTerm === 'string') {
                      if (typeof customer === 'string') {
                        return customer.toLowerCase().includes(searchTerm.toLowerCase());
                      } else if (typeof customer === 'object') {
                        return Object.values(customer).some(value =>
                          typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
                        );
                      }
                    }
                    return false;
                  })}
                  
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                  fileName="ABC"
                />
              )}
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
        </div>
      </div>
    </div>
  );
}

function CustomerDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new CustomerService().getCustomer().then((res) => {
      if (res.status === 200) {
        var data = res.data.data;
        var data = data.filter((d) => d.is_active == 1);
        for (const key in data) {
          tempData.push({
            id: data[key].id,
            name: data[key].name,
          });
        }
      }
      setData(tempData);
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
        >
          <option>Select Customer</option>
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.name}
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

export { CustomerComponent, CustomerDropdown };
