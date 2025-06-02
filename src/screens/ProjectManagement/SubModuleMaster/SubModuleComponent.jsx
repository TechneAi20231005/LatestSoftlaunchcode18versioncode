import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import SubModuleService from '../../../services/ProjectManagementService/SubModuleService';

import PageHeader from '../../../components/Common/PageHeader';
import { getRoles } from '../../Dashboard/DashboardAction';
import { useDispatch, useSelector } from 'react-redux';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import moment from 'moment';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils';

function SubModuleComponent() {
  //initial state
  const dispatch = useDispatch();

  //redux state

  const checkRole = useSelector((DashboardSlice) =>
    DashboardSlice.dashboard.getRoles.filter((d) => d.menu_id === 22)
  );

  //local state

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(
    () => [
      {
        header: 'Action',
        accessorKey: 'action',
        size: 110,
        enableColumnOrdering: false,
        enableGrouping: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="btn-group" role="group">
            <Link
              to={`/${_base}/SubModule/Edit/` + row?.original?.id}
              className="btn btn-outline-secondary"
            >
              <i className="icofont-edit text-success"></i>
            </Link>
          </div>
        )
      },

      {
        accessorKey: 'counter',
        header: 'Sr',
        size: 90,
        enableColumnOrdering: false,
        enableGrouping: false
      },
      {
        header: 'SubModule Name',
        size: 225,
        muiTableBodyCellProps: () => ({
          sx: {
            color: '#f19828',
            fontWeight: 400
          }
        }),
        accessorKey: 'sub_module_name'
      },
      {
        header: 'Module Name',
        size: 200,
        accessorKey: 'module_name'
      },
      {
        header: 'Project Name',
        accessorKey: 'project_name',
        size: 200
      },
      {
        header: 'Status',
        accessorKey: 'is_active',
        size: 150,
        accessorFn: (row) => (row.is_active === 1 ? 'Active' : 'Deactive'),
        filterFn: (row, id, filterValue) => {
          const status = row.getValue(id);
          return status.toLowerCase().includes(filterValue.toLowerCase());
        },
        Cell: ({ row }) => {
          const isActive = row?.original?.is_active;
          return (
            <span
              className={`badge ${isActive ? 'bg-primary' : 'bg-danger'}`}
              style={{ width: '4rem' }}
            >
              {isActive ? 'Active' : 'Deactive'}
            </span>
          );
        }
      },
      {
        header: 'Description',
        size: 190,
        accessorKey: 'description'
      },
      {
        header: 'Remark',
        accessorKey: 'remark',
        accessorFn: (originalRow) => originalRow?.remark?.trim() || '--',
        size: 160
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.created_at),
        Cell: ({ row }) =>
          row.original.created_at
            ? moment(row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
            : '--',
        size: 350
      },
      {
        accessorKey: 'created_by',
        accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
        header: 'Created By',
        size: 180
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        filterVariant: 'date-range',
        accessorFn: (row) => new Date(row.updated_at),
        Cell: ({ row }) =>
          row?.original?.updated_at?.trim()
            ? moment(row.original.updated_at).format('MM/DD/YYYY HH:mm:ss')
            : '--'
      },

      {
        id: 'updated_by',
        accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
        header: 'Updated By',
        size: 185
      }
    ],
    []
  );

  const exportDataKeys = {
    sub_module_name: 'Sub Module Name',
    module_name: 'Module Name',
    project_name: 'Project Name',
    description: 'Description',
    remark: 'Remark',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Submodule Master Record'
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = [];
    await new SubModuleService()
      .getSubModule()
      .then((res) => {
        if (res?.status === 200) {
          let counter = 1;
          let count = 1;
          const temp = res?.data?.data?.data;
          for (const key in temp) {
            data.push({
              counter: counter++,
              id: temp[key].id,
              sub_module_name: temp[key].sub_module_name,
              module_name: temp[key].module_name,
              project_name: temp[key].project_name,
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
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((error) => {
        errorHandler(error);
      })
      .finally(() => setIsLoading(false));
    dispatch(getRoles());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (checkRole && checkRole[0]?.can_read === 0) {
      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);

  return (
    <div className="container-xxl">
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
      <div className="mt-2">
        <MaterialTable
          columns={columns}
          data={data}
          isLoading={isLoading}
          exportDataKeys={exportDataKeys}
        />
      </div>
    </div>
  );
}

function SubModuleDropdown(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    const tempData = [];

    new SubModuleService().getSubModule().then((res) => {
      if (res?.status === 200) {
        let counter = 1;
        const data = res?.data?.data;
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
          {props.defaultValue === 0 && (
            <option value={0} selected>
              Select Sub Module
            </option>
          )}
          {props.defaultValue !== 0 && (
            <option value={0}>Select Sub Module</option>
          )}
          {data.map(function (item, i) {
            if (props.defaultValue && props.defaultValue === item.id) {
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

export { SubModuleComponent, SubModuleDropdown };
