import React, { useState, useEffect, useCallback } from 'react';
import { Accordion } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import SearchBoxHeader from '../../../components/Common/SearchBoxHeader ';
import { handleModalInStore } from '../../Dashboard/DashbordSlice';
import EditMenu from './AddEditMenu';
import DataTable from 'react-data-table-component';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import { useDispatch, useSelector } from 'react-redux';
import { getMenuMasterList } from '../../../redux/services/menuMaster';
import { customSearchHandler } from '../../../utils/customFunction';
function MenuComponent() {
  const dispatch = useDispatch();
  const { menuMasterList, isLoading, notify } = useSelector(
    (state) => state?.menuMaster
  );
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    case: '',
    value: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterData, setFilterData] = useState([]);

  const handleSearch = useCallback(() => {
    const filteredList = customSearchHandler(
      menuMasterList?.data?.data,
      searchTerm
    );
    setFilterData(filteredList);
  }, [menuMasterList, searchTerm]);

  const handleReset = () => {
    setSearchTerm('');
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  useEffect(() => {
    dispatch(getMenuMasterList());
  }, []);
  useEffect(() => {
    setFilterData(menuMasterList?.data?.data);
  }, [menuMasterList]);

  const optionData = menuMasterList?.data?.data
    ?.filter((item) => item?.parent_id === null)
    .map((item) => {
      return {
        label: item?.name,
        value: item?.id
      };
    });

  const columns = [
    {
      name: 'Action',
      selector: (row) => {},
      sortable: false,
      cell: (row) => (
        <div className="btn-group" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#edit"
            onClick={(e) => {
              setShow(true);
              setData({ case: 'Edit', value: row });
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
        </div>
      ),
      width: '80px'
    },
    {
      name: 'Sr. No.',
      selector: (row, index) => index + 1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Parent Name',
      sortable: false,
      selector: (row) => row?.name || 'Primary'
    },
    {
      name: 'Status',
      selector: (row) => row.is_active,
      sortable: true,
      cell: (row) => (
        <div>
          {row.is_active === 1 && (
            <span className="badge bg-primary" style={{ width: '4rem' }}>
              Active
            </span>
          )}
          {row.is_active === 0 && (
            <span className="badge bg-danger" style={{ width: '4rem' }}>
              Deactive
            </span>
          )}
        </div>
      )
      // width: '100px'
    },
    {
      name: 'remark',
      selector: (row) => row?.remark || '--'
    },
    {
      name: 'Created At',
      selector: (row) => row?.created_at || '--',
      sortable: true
    },
    {
      name: 'Updated By',
      selector: (row) => row?.updated_by || '--',
      sortable: true
    }
  ];

  return (
    <>
      <div className="mb-5">
        <PageHeader
          headerTitle="Menu Master"
          renderRight={() => {
            return (
              <div>
                {/* {checkRole && checkRole[0]?.can_create === 1 ? ( */}
                <button
                  className="btn btn-dark px-5"
                  onClick={() => {
                    setShow(true);
                    setData({ case: 'Add', value: null });
                  }}
                >
                  <i className="icofont-plus me-2 fs-6" />
                  Add Menu
                </button>
                {/* ) : (
                ''
              )} */}
              </div>
            );
          }}
        />
        <SearchBoxHeader
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          handleReset={handleReset}
          placeholder="Search by menu name...."
          // exportFileName="Menu Master Record"
          // exportData={exportMenuData}
          // showExportButton={true}
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filterData}
          // defaultSortField="role_id"
          pagination
          selectableRows={false}
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          highlightOnHover={true}
          persistTableHead={true}
          progressPending={isLoading?.getMenuMasterList}
          progressComponent={<TableLoadingSkelton />}
        />
      </div>

    {
      show &&   <EditMenu
      show={show}
      onClose={() => setShow(false)}
      data={data}
      optionData={optionData}
    />
    }
    </>
  );
}

export default MenuComponent;
