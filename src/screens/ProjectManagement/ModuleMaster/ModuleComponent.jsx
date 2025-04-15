import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import ModuleService from '../../../services/ProjectManagementService/ModuleService';
import ManageMenuService from '../../../services/MenuManagementService/ManageMenuService';
import PageHeader from '../../../components/Common/PageHeader';
import { errorHandler } from '../../../utils';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
function ModuleComponent() {
  //initial state
  const location = useLocation();
  const roleId = localStorage.getItem('role_id');

  //local state

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [checkRole, setCheckRole] = useState(null);

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
      size: 120,
      enableColumnFilter: false
    },
    {
      accessorFn: (originalRow) => originalRow.module_name || '--',
      header: 'Module Name',
      size: 200,
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
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
      Cell: ({ row }) =>
        row?.original?.created_at?.trim()
          ? moment(row?.original?.created_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow.created_by?.trim() || '--',
      header: 'Created By',
      size: 190
    },
    {
      accessorFn: (originalRow) => new Date(originalRow.updated_at) || '--',
      header: 'Updated At',
      filterVariant: 'date-range',
      Cell: ({ row }) =>
        row?.original?.updated_at?.trim()
          ? moment(row?.original?.updated_at).format('MM/DD/YYYY HH:mm:ss')
          : '--'
    },
    {
      accessorFn: (originalRow) => originalRow.updated_by?.trim() || '--',
      header: 'Updated By',
      size: 190
    }
  ];

  const exportDataKeys = {
    module_name: 'Module Name',
    project_name: 'Project Name',
    description: 'Description',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Module Master Record'
  };

  const loadData = useCallback(async () => {
    const data = [];
    await new ModuleService()
      .getModule()
      .then((res) => {
        if (res?.status === 200) {
          let counter = 1;
          const temp = res?.data?.data?.data;
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
        }
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setIsLoading(false));

    await new ManageMenuService()
      .getRole(roleId)
      .then((res) => {
        if (res?.status === 200) {
          if (res?.data?.status === 1) {
            const getRoleId = sessionStorage.getItem('role_id');
            setCheckRole(res?.data?.data?.filter((d) => d.menu_id === 21));
          }
        }
      })
      .catch((error) => {
        errorHandler(error);
      });
  }, [roleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

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

      <div className="mt-2">
        {data && (
          <MaterialTable
            exportDataKeys={exportDataKeys}
            isLoading={isLoading}
            columns={columns}
            data={data}
          />
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
      if (res?.status === 200) {
        let counter = 1;
        const data = res?.data?.data;
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
