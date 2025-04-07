import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
// import ErrorLogService from '../../../services/ErrorLogService';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import PageHeader from '../../../components/Common/PageHeader';
// import Alert from '../../../components/Common/Alert';

import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { Box } from '@mui/material';
function ModuleComponent() {
  //initial state
  const location = useLocation();
  const roleId = localStorage.getItem('role_id');

  //local state

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [checkRole, setCheckRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  }, [data, searchTerm]);

  // Function to handle reset button click
  const handleReset = () => {
    setSearchTerm('');
    setFilteredData(data);
  };

  //Data Table columns

  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 120,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Module/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorFn: (originalRow) => originalRow.counter || '--',
      header: 'Sr',
      size: 120
    },
    {
      accessorFn: (originalRow) => originalRow.module_name || '--',
      header: 'Module Name',
      size: 200,
      Cell: ({ row }) => (
        <Box sx={{ color: '#f19828' }}>{row?.original?.module_name}</Box>
      )
    },
    {
      accessorFn: (originalRow) => originalRow.project_name || '--',
      header: 'Project Name',
      size: 200
    },
    {
      accessorKey: 'is_active',
      header: 'Status',
      size: 150,
      accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
      filterFn: (row, id, filterValue) => {
        const status = row.getValue(id);
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
      Cell: ({ row }) => (
        <span
          className={`badge ${
            row?.original?.is_active === 1 ? 'bg-primary' : 'bg-danger'
          }`}
        >
          {row?.original?.is_active === 1 ? 'Active' : 'Deactive'}
        </span>
      )
    },
    {
      accessorFn: (originalRow) => originalRow.description || '--',
      header: 'Description',
      size: 190
    },
    {
      accessorFn: (originalRow) => originalRow.remark || '--',
      header: 'Remark',
      size: 160
    },

    {
      accessorFn: (originalRow) => new Date(originalRow.created_at),
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow.created_by || '--',
      header: 'Created By',
      size: 190
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow.updated_by || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const loadData = useCallback(async () => {
    setIsLoading(true);

    const data = [];
    await new ModuleService()
      .getModule()
      .then((res) => {
        if (res.status === 200) {
          let counter = 1;
          const temp = res.data.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              module_name: temp[key].module_name,
              project_name: temp[key].project_name,
              is_active: temp[key].is_active,
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,

              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by,
              description: temp[key].description
            });
          }

          setData(null);
          setData(data);
          setIsLoading(false);

          let exportData = [];
          for (const key in data) {
            exportData.push({
              SrNo: exportData.length + 1,
              module_name: data[key].module_name,
              project_name: data[key].project_name,
              description: data[key].description,
              remark: data[key].remark,
              Status: data[key].is_active === 1 ? 'Active' : 'Deactive',
              created_by: temp[key].created_by,
              created_at: temp[key].created_at,
              updated_by: data[key].updated_by,
              updated_at: data[key].updated_at
            });
          }
          setExportData(exportData);
        }
      })
      .catch((error) => {
        errorHandler(error);
      });

    await new ManageMenuService()
      .getRole(roleId)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            const getRoleId = sessionStorage.getItem('role_id');
            setCheckRole(res.data.data.filter((d) => d.menu_id === 21));
          }
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  }, [roleId]);

  useEffect(() => {
    loadData();
    if (location && location.state) {
      setNotify(location.state.alert);
    }
  }, [loadData, location]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Module Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/Module/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Module
                </Link>
              ) : (
                ''
              )}
            </div>
          );
        }}
      />
      {/* <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by module name...."
        exportFileName="Module Master Record"
        exportData={exportData}
        showExportButton={true}
      /> */}

      <div className="mt-2">
        {data && (
          <MaterialTable
            isLoading={isLoading}
            columns={columns}
            data={filteredData}
          />
          // <DataTable
          //   columns={columns}
          //   data={filteredData}
          //   defaultSortField="title"
          //   pagination
          //   selectableRows={false}
          //   className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          //   highlightOnHover={true}
          // />
        )}
      </div>
    </div>
  );
}

function ModuleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];
    new ModuleService().getModule().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            module_name: data[key].module_name
          });
        }
        setData(null);
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
        >
          {props.defaultValue === 0 && (
            <option value="" selected>
              Select Module
            </option>
          )}
          {props.defaultValue !== 0 && <option value="">Select Module</option>}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.module_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.module_name}
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

export { ModuleComponent, ModuleDropdown };
