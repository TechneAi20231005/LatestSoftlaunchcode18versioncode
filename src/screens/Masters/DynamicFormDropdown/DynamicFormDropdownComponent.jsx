import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { _base } from '../../../settings/constants';
import DynamicFormDropdownMasterService from '../../../services/MastersService/DynamicFormDropdownMasterService';
import PageHeader from '../../../components/Common/PageHeader';
import Alert from '../../../components/Common/Alert';
import 'react-data-table-component-extensions/dist/index.css';
import { useDispatch, useSelector } from 'react-redux';
import { getRoles } from '../../Dashboard/DashboardAction';
import moment from 'moment';
import MaterialTable from '../../../components/custom/MUI Table/MaterialTable';
import { errorHandler } from '../../../utils';

export default function DynamicFormDropdownComponent() {
  //initial state
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  const [notify, setNotify] = useState();

  const checkRole = useSelector((DashbordSlice) =>
    DashbordSlice?.dashboard?.getRoles.filter((d) => d.menu_id === 35)
  );

  const columns = [
    {
      accessorKey: 'action', // Use a valid key
      header: 'Action',
      size: 110,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableSorting: false,
      enableColumnFilter: false,

      Cell: ({ row }) => {
        return (
          <div className="btn-group" role="group">
            <Link
              to={`/${_base}/DynamicFormDropdown/Edit/` + row.original?.id}
              className="btn btn-outline-secondary"
            >
              <i className="icofont-edit text-success"></i>
            </Link>
          </div>
        );
      }
    },
    {
      accessorKey: 'counter',
      header: 'Sr',
      size: 70,
      enableColumnOrdering: false,
      enableGrouping: false,
      enableColumnFilter: false
    },
    {
      accessorKey: 'dropdown_name',
      header: 'Dropdown Name',
      size: 160,
      filterVariant: 'autocomplete',
      muiTableBodyCellProps: () => ({
        sx: {
          color: '#f19828',
          fontWeight: 400
        }
      })
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
      accessorFn: (originalRow) => {
        return moment(originalRow.created_at).startOf('day').toDate();
      },
      header: 'Created At',
      filterVariant: 'date',
      Cell: ({ cell }) =>
        moment(cell.row.original.created_at).format('MM/DD/YYYY HH:mm:ss')
    },
    {
      accessorFn: (originalRow) => originalRow?.created_by?.trim() || '--',
      header: 'Created By'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_at || '--',
      header: 'Updated At'
    },
    {
      accessorFn: (originalRow) => originalRow?.updated_by?.trim() || '--',
      header: 'Updated By'
    }
  ];

  const exportDataKeys = {
    dropdown_name: 'Dropdown Name',
    is_active: 'Status',
    created_at: 'Created At',
    created_by: 'Created By',
    updated_at: 'Updated At',
    updated_by: 'Updated By',
    fileName: 'Dynamic Form Dropdown Master'
  };

  const loadData = async () => {
    try {
      setIsLoading(true);

      const response =
        await new DynamicFormDropdownMasterService().getAllDynamicFormDropdown();

      if (response.status === 200) {
        const temp = response?.data?.data?.data || [];
        const formattedData = temp.map((item, index) => ({
          counter: index + 1,
          id: item.id,
          dropdown_name: item.dropdown_name,
          is_active: item.is_active,
          updated_at: item.updated_at,
          created_at: item.created_at,
          created_by: item.created_by,
          updated_by: item.updated_by
        }));
        setData(formattedData);
        setIsLoading(false);
      }
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkRole?.length === 0) {
      dispatch(getRoles());
    }
  }, [checkRole.length]);

  return (
    <div className="container-xxl">
      {notify && <Alert alertData={notify} />}
      <PageHeader
        headerTitle="Dropdown Master"
        renderRight={() => {
          return (
            <div className="col-auto d-flex w-sm-100">
              <Link
                to={`/${_base}/DynamicFormDropdown/Create`}
                className="btn btn-dark btn-set-task w-sm-100"
              >
                <i className="icofont-plus-circle me-2 fs-6"></i>Add Dropdown
              </Link>
            </div>
          );
        }}
      />

      <div className="card mt-2">
        {data && (
          <MaterialTable
            columns={columns}
            isLoading={isLoading}
            data={data}
            exportDataKeys={exportDataKeys}
          ></MaterialTable>
        )}
      </div>
    </div>
  );
}
