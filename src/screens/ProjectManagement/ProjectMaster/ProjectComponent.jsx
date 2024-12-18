import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import ProjectService from '../../../services/ProjectManagementService/ProjectService';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { customSearchHandler } from '../../../utils/customFunction';

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
  const [isLoading, setIsLoading] = useState(false);

  // const [showLoaderModal, setShowLoaderModal] = useState(false);
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
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <Link
            to={`/${_base}/Project/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    { name: 'Sr', width: '5%', selector: (row) => row.counter, sortable: true },
    {
      name: 'Project Name',
      width: '10%',
      selector: (row) => row.project_name,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.project_name && (
            <OverlayTrigger overlay={<Tooltip>{row.project_name} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.project_name && row.project_name.length < 10
                    ? row.project_name
                    : row.project_name.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Project Reviewer',
      width: '10%',
      selector: (row) => row.projectReviewer,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.projectReviewer && (
            <OverlayTrigger overlay={<Tooltip>{row.projectReviewer} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.projectReviewer && row.projectReviewer.length < 10
                    ? row.projectReviewer
                    : row.projectReviewer.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Description',
      width: '170px',
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.description && (
            <OverlayTrigger overlay={<Tooltip>{row.description} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.description && row.description.length < 20
                    ? row.description
                    : row.description.substring(0, 20) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Status',
      width: '10%',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      )
    },

    {
      name: 'Remark',
      width: '10%',
      selector: (row) => row.remark,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.remark && (
            <OverlayTrigger overlay={<Tooltip>{row.remark} </Tooltip>}>
              <div>
                <span className="ms-1"> {row.remark ? row.remark : ''}</span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },

    {
      name: 'Created By',
      width: '10%',
      selector: (row) => row.created_by,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_by && (
            <OverlayTrigger overlay={<Tooltip>{row.created_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_by && row.created_by.length < 20
                    ? row.created_by
                    : row.created_by.substring(0, 20) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Created at',
      width: '200px',
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.created_at && (
            <OverlayTrigger overlay={<Tooltip>{row.created_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.created_at && row.created_at.length < 20
                    ? row.created_at
                    : row.created_at.substring(0, 20) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Updated By',
      width: '10%',
      selector: (row) => row.updated_by,
      sortable: true,

      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_by && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_by} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.updated_by && row.updated_by.length < 20
                    ? row.updated_by
                    : row.updated_by.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    },
    {
      name: 'Updated At',
      width: '12%',
      selector: (row) => row.updated_at,
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          {row.updated_at && (
            <OverlayTrigger overlay={<Tooltip>{row.updated_at} </Tooltip>}>
              <div>
                <span className="ms-1">
                  {' '}
                  {row.updated_at && row.updated_at.length < 20
                    ? row.updated_at
                    : row.updated_at.substring(0, 10) + '....'}
                </span>
              </div>
            </OverlayTrigger>
          )}
        </div>
      )
    }
  ];

  const loadData = useCallback(async () => {
    // setShowLoaderModal(null);
    // setShowLoaderModal(true);
    setIsLoading(true);
    const data = [];
    await new ProjectService()
      .getProject()
      .then((res) => {
        if (res.status === 200) {
          // setShowLoaderModal(false);

          let counter = 0;
          console.log(counter++);
          const temp = res.data.data?.data;
          console.log('res', res.data.data.data);
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
          setIsLoading(false);

          let exportData = [];
          let count = 1;
          for (const key in data) {
            exportData.push({
              SrNo: count++,

              'Project Name': data[key].project_name,
              projectReviewer: data[key].projectReviewer,
              Status: data[key].is_active === 1 ? 'Active' : 'Deactive',
              description: data[key].description,
              remark: data[key].remark,
              created_at: data[key].created_at,
              created_by: data[key].created_by,
              updated_at: data[key].updated_at,
              updated_by: data[key].updated_by
            });
          }
          setExportData(exportData);
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'Project Master',
          'Get_Project',
          'INSERT',
          errorObject.data.message
        );
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
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, handleSearch]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

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

      <SearchBoxHeader
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by project name...."
        exportFileName="Project Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="card mt-2">
        <div className="card-body">
          <div className="row clearfix g-3">
            {isLoading && <TableLoadingSkelton />}
            <div className="col-sm-12">
              {!isLoading && data && (
                <DataTable
                  columns={columns}
                  data={filteredData}
                  defaultSortField="title"
                  pagination
                  selectableRows={false}
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

function ProjectDropdown({ field, form, ...props }) {
  const [data, setData] = useState(null);

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
        setData(tempData);
      }
    });
  }, []);

  const handleChange = (e) => {
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
          value={field.value || props.defaultValue || ''} // Controlled by Formik or defaultValue
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
