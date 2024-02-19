import React, { useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/Common/PageHeader";
import Alert from "../../../components/Common/Alert";
import BillTypeMasterService from "../../../services/Bill Checking/Masters/BillTypeMasterService";
import {_base, userSessionData } from "../../../settings/constants";
import ManageMenuService from "../../../services/MenuManagementService/ManageMenuService";
import { Link, useLocation } from "react-router-dom";

function BillTypeMaster() {
  const location = useLocation()
  const [data, setData] = useState(null);
  const [notify, setNotify] = useState();
  const roleId = sessionStorage.getItem("role_id");
  const [checkRole, setCheckRole] = useState(null);
  const userId = userSessionData.userId;

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
      name: "Action",
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <Link
                to={`/${_base + "/EditBillType/"+row.id}`}
                className="btn btn-outline-secondary"

              >
            <i className="icofont-edit text-success"></i>
          </Link>

          <Link
                to={`/${_base + "/ViewBillType/"+ row.id}`}
                className="btn btn-outline-secondary"

              >
            <i className="icofont-eye text-info"></i>
          </Link>
        </div>
      ),
    },
  
    { name: "Bill Type", selector: (row) => row.bill_type, sortable: true },
    {
      name: "Status",
      selector: (row) => row.is_active,
      sortable: false,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      ),
    },
    { name: "Remark", selector: (row) => row.remark, sortable: true },
    { name: "Created At", selector: (row) => row.created_at, sortable: true },
    { name: "Created By", selector: (row) => row.created_by, sortable: true },
    { name: "Updated At", selector: (row) => row.updated_at, sortable: true },
    { name: "Updated By", selector: (row) => row.updated_by, sortable: true },
  ];

  const loadData = async () => {
    const data = [];
    var tempArray = [];

    await new BillTypeMasterService().getBillTypeData().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const temp = res.data.data;
        for (const key in temp) {
          data.push({
            id: temp[key].id,
            counter: counter++,
            bill_type: temp[key].bill_type,
            is_active: temp[key].is_active,
            remark: temp[key].remark,
            created_at: temp[key].created_at,
            created_by: temp[key].created_by,
            updated_at: temp[key].updated_at,
            updated_by: temp[key].updated_by,
            employee: temp[key].employee,
          });
        }

        setData(null);
        setData(data);
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Check if the message has been displayed before

    if (location && location.state ) {
      // Display the message
      setNotify(location.state.alert);

      // Mark that the message has been displayed
    }
  }, [location]);
 
  useEffect(()=>{
    if(checkRole && checkRole[47].can_read === 0){  
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;  
    }
  },[checkRole])


  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Bill Type Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Link
                to={`/${_base + "/CreateBillType"}`}
                className="btn btn-dark btn-set-task w-sm-100"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Bill Type
              </Link>
            </div>
          );
        }}
      />
      {/* SEARCH FILTER */}
      <div className="card card-body">
        <div className="row">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-sm btn-warning text-white"
              type="button"
              onClick={(e) =>
                searchRef.current.value
                  ? handleSearch(e)
                  : alert("please enter a search")
              }
            >
              <i className="icofont-search-1 "></i> Search
            </button>
            <button
              className="btn btn-sm btn-info text-white"
              type="button"
              onClick={() => window.location.reload(false)}
            >
              <i className="icofont-refresh text-white"></i> Reset
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  pagination
                  className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                  highlightOnHover={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}



export default BillTypeMaster;
