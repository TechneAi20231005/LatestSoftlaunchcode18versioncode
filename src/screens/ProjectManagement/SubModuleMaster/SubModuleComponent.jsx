import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { _base } from '../../../settings/constants';
import ErrorLogService from '../../../services/ErrorLogService';
import SubModuleService from '../../../services/ProjectManagementService/SubModuleService';

import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';

import { getRoles } from '../../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { customSearchHandler } from '../../../utils/customFunction';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';

function SubModuleComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 22)
  );

  //local state

  const [notify, setNotify] = useState(null);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [exportData, setExportData] = useState(null);

  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  //search function

  const handleSearch = () => {
    const filteredList = customSearchHandler(data, searchTerm);
    setFilteredData(filteredList);
  };

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
            to={`/${_base}/SubModule/Edit/` + row.id}
            className="btn btn-outline-secondary"
          >
            <i className="icofont-edit text-success"></i>
          </Link>
        </div>
      )
    },
    { name: 'Sr', selector: (row) => row.counter, sortable: true },
    {
      name: 'Sub Module Name',
      selector: (row) => row.sub_module_name,
      sortable: true
    },
    { name: 'Module Name', selector: (row) => row.module_name, sortable: true },
    {
      name: 'Project Name',
      selector: (row) => row.project_name,
      sortable: true
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: false,
      cell: (row) => (
        <div>
          {row.is_active == 1 && (
            <span className="badge bg-primary">Active</span>
          )}
          {row.is_active == 0 && (
            <span className="badge bg-danger">Deactive</span>
          )}
        </div>
      )
    },
    { name: 'Remark', selector: (row) => row.remark, sortable: true },
    {
      name: 'Created At',
      width: '10%',
      selector: (row) => row.created_at,
      sortable: true
    },
    {
      name: 'Created By',
      width: '10%',
      selector: (row) => row.created_by,
      sortable: true
    },
    { name: 'Updated At', selector: (row) => row.updated_at, sortable: true },

    { name: 'Updated By', selector: (row) => row.updated_by, sortable: true }
  ];

  const loadData = async () => {
    setShowLoaderModal(null);
    setShowLoaderModal(true);
    setIsLoading(true);
    const data = [];
    const exportTempData = [];
    await new SubModuleService()
      .getSubModule()
      .then((res) => {
        if (res.status === 200) {
          setShowLoaderModal(false);

          let counter = 1;
          let count = 1;
          const temp = res.data.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              sub_module_name: temp[key].sub_module_name,
              module_name: temp[key].module_name,
              project_name: temp[key].project_name,
              is_active: temp[key].is_active,
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

          for (const key in temp) {
            exportTempData.push({
              count: count++,
              // id: temp[key].id,
              sub_module_name: temp[key].sub_module_name,
              module_name: temp[key].module_name,
              project_name: temp[key].project_name,
              is_active: temp[key].is_active == 1 ? 'Active' : 'Deactive',
              remark: temp[key].remark,
              created_at: temp[key].created_at,
              created_by: temp[key].created_by,
              updated_at: temp[key].updated_at,
              updated_by: temp[key].updated_by
            });
          }

          setExportData(exportTempData);
        } else {
          new ErrorLogService().sendErrorLog(
            'SubModule Master',
            'Get_SubModule',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'SubModule Master',
          'Get_SubModule',
          'INSERT',
          errorObject.data.message
        );
      });
    dispatch(getRoles());
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, []);
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}

      <PageHeader
        headerTitle="Sub-Module Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              {checkRole && checkRole[0]?.can_create === 1 ? (
                <Link
                  to={`/${_base}/SubModule/Create`}
                  className="btn btn-dark btn-set-task w-sm-100"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add
                  Sub-Module
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
        handleSearch={handleSearch}
        handleReset={handleReset}
        placeholder="Search by submodule name...."
        exportFileName="submodule Master Record"
        exportData={exportData}
        showExportButton={true}
      />

      <div className="mt-2">
        <div className="col-sm-12">
          {isLoading && <TableLoadingSkelton />}
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
  );
}
export default SubModuleComponent;

export function SubModuleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];

    new SubModuleService().getSubModule().then((res) => {
      if (res.status === 200) {
        let counter = 1;
        const data = res.data.data;
        for (const key in data) {
          tempData.push({
            counter: counter++,
            id: data[key].id,
            sub_module_name: data[key].sub_module_name
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
          {props.defaultValue == 0 && (
            <option value={0} selected>
              Select Sub Module
            </option>
          )}
          {props.defaultValue != 0 && (
            <option value={0}>Select Sub Module</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue == item.id) {
              return (
                <option key={i} value={item.id} selected>
                  {item.sub_module_name}
                </option>
              );
            } else {
              return (
                <option key={i} value={item.id}>
                  {item.sub_module_name}
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
