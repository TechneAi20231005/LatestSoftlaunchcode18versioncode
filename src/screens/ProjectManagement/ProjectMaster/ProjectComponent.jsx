import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
// import ErrorLogService from '../../../services/ErrorLogService';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';

import PageHeader from '../../../components/Common/PageHeader';
// import Alert from '../../../components/Common/Alert';

// import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
// import Tooltip from 'react-bootstrap/Tooltip';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
// import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
// import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { Box } from '@mui/material';

function ProjectComponent() {
  //initial state
  const location = useLocation();
  const dispatch = useDispatch();

  //Redux State
  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 20)
  );

  //local state

  const [notify, setNotify] = useState('');
  const [data, setData] = useState([]);
  const [exportData, setExportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // const [filteredData, setFilteredData] = useState([]);

  //search function

  // const handleSearch = useCallback(() => {
  //   const filteredList = customSearchHandler(data, searchTerm);
  //   setFilteredData(filteredList);
  // }, [data, searchTerm]);

  // Function to handle reset button click
  // const handleReset = () => {
  //   setSearchTerm('');
  //   setFilteredData(data);
  // };

  //Data Table columns
  const columns = [
    {
      accessorKey: 'action',
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,
      Cell: ({ row }) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Project/Edit/` + row?.original?.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.counter || '--',
      header: 'Sr',
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow?.project_name || '--',
      header: 'Project Name',
      size: 200,
      Cell: ({ row }) => {
        return (
          <Box sx={{ color: '#f19828' }}>{row?.original?.project_name}</Box>
        );
      }
    },
    {
      accessorFn: (originalRow) => originalRow?.projectReviewer || '--',
      header: 'Project Reviewer',
      size: 220
    },

    {
      accessorFn: (originalRow) => originalRow?.description || '--',
      header: 'Description',
      size: 190
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
          className={
            'badge bg-' +
            (row?.original?.is_active === 1 ? 'primary' : 'danger')
          }
        >
          {row?.original?.is_active === 1 ? `Active` : `Deactive`}
        </span>
      )
    },
    {
      accessorFn: (originalRow) => originalRow?.remark || '--',
      header: 'Remark',
      size: 160
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.created_at) || '--',
      header: 'Created At',
      filterVariant: 'date-range',
      Cell: ({ cell }) =>
        `${cell.getValue().toLocaleDateString()} ${cell
          .getValue()
          .toLocaleTimeString()}`
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
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
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    project_name: 'Project Name',
    projectReviewer: 'Project Reviewer',
    description: 'Description',
    is_active: 'Status',
    remark: 'Remark',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Project Master Record'
  };

  const loadData = useCallback(async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    const data = [];
    await new ProjectService()
      .getProject()
      .then((res) => {
        if (res.status === 200) {
          // setShowLoaderModal(false);

          let counter = 1;
          const temp = res.data.data?.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              project_name: temp[key].project_name,
              projectReviewer: temp[key].projectReviewer,
              is_active: temp[key].is_active,
              description: temp[key].description,
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by
            });
          }
          setData(null);
          setData(data);

          let exportData = [];
          let count = 1;
          for (const key in data) {
            exportData.push({
              SrNo: count++,

              'Project Name': data[key].project_name,
              projectReviewer: data[key].projectReviewer,
              description: data[key].description,
              Status: data[key].is_active === 1 ? 'Active' : 'Deactive',
              remark: data[key].remark,
              created_by: data[key].created_by,
              created_at: data[key].created_at,
              updated_at: data[key].updated_at,
              updated_by: data[key].updated_by
            });
          }
          setExportData(exportData);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => {
        setIsLoading(false);
      });

    dispatch(getRoles());
  }, [dispatch]);

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
  // useEffect(() => {
  //   setFilteredData(data);
  // }, [data]);

  // useEffect(() => {
  //   handleSearch();
  // }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle="Project Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/Project/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Project
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
        placeholder="Search by project name...."
        exportFileName="Project Master Record"
        exportData={exportData}
        showExportButton={true}
      /> */}

      <div className="card mt-2">
        {data && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoading}
            columns={columns}
            data={data}
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

function ProjectDropdown({ field, form, ...props }) {
  const [data, setData] = useState(null);
  const [deafultValue, setDeafultValue] = useState('');
  useEffect(() => {
    const tempData = [];
    new ProjectService().getProject().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const activeData = res.data.data.data.filter((d) => d.is_active === 1);
        for (const key in activeData) {
          tempData.push({
            counter: counter++,
            id: activeData[key].id,
            project_name: activeData[key].project_name
          });
        }
        const DeafultValue = tempData.find((d) => d.id === props.defaultValue);
        if (DeafultValue) {
          setDeafultValue(DeafultValue.id);
        } else {
          setDeafultValue('');
        }
        setData(tempData);
      }
    });
  }, []);

  const handleChange = (e) => {
    console.log(e.target.value);
    const value = e.target.value;
    form.setFieldValue(field.name, value); // Update Formik value
  };

  const error = form.errors[field.name];
  const touched = form.touched[field.name];

  return (
    <>
      {data ? (
        <select
          className="form-control form-control-sm"
          id={props.id}
          name={field.name}
          value={field.value || deafultValue}
          onChange={handleChange}
          onBlur={field.onBlur}
        >
          {/* Default "Select Project" option */}
          <option value="" disabled>
            Select Project
          </option>

          {/* Options populated dynamically */}
          {data.map((item, i) => (
            <option key={i} value={item.id}>
              {item.project_name}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading...</p>
      )}
      {touched && error && <div className="text-danger">{error}</div>}
    </>
  );
}
export { ProjectComponent, ProjectDropdown };
