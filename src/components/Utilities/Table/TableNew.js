import React from 'react'
import DataTable from 'react-data-table-component';
import { Table } from 'react-bootstrap';
import DataTableExtensions from 'react-data-table-component-extensions';
import 'react-data-table-component-extensions/dist/index.css';

function TableNew({ columns, data }) {
  const customStyles = {
    table: {
      style: {
        backgroundColor: "#C1542E",
        zIndex:'-1000'
      },
    },
    tableWrapper: {
      style: {
        overflowX: 'auto',
        zIndex:'-100'

      },
    },
    responsiveWrapper: {
      style: {
        overflowX: 'auto',
      },
    },
    headRow: {
      style: {
          fontSize:'14px',
          fontWeight:'bold'
      },
    },
    headCells: {
      style: {
          paddingLeft: '8px', // override the cell padding for head cells
          paddingRight: '8px',
          overflowWrap: 'break-word !important',
        },
    },
    rows: {
      style: {
        minHeight: '35px',
      },
    },
    cells: {
      style: {
        paddingLeft: '16px',
        paddingRight: '16px',

      },
      draggingStyle: {},
    },
};
const tableData = {
  columns,
  data
};
  return (
    <>
    {/* <DataTableExtensions {...tableData}> */}

      <DataTable
        customStyles={customStyles}
        pagination
        filtering
        searching
        highlightOnHover
		    pointerOnHover
        tableResponsive
        responsive
        style={{overflowY:"scroll"}}
        persistTableHead
        fixedHeader
        subHeaderWrap
        defaultSortField="id"
        defaultSortAsc={false}
        columns={columns}
        data={data}
      />

    {/* </DataTableExtensions>   */}
    </>

  )
}

export default TableNew

