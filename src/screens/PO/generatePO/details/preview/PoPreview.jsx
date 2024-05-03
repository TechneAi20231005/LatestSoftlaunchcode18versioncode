import React from 'react';
import { Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

import './style.scss';

function PoPreview() {
  // // initial state
  const navigate = useNavigate();

  //  table column data
  const columns = [
    {
      name: 'Item',
      selector: row => row?.item_name,
      sortable: false,
    },
    {
      name: 'Category',
      selector: row => row?.category,
      sortable: false,
    },
    {
      name: 'Knockoff Wt Range',
      selector: row => row?.KnockoffWtRange,
      sortable: true,
    },
    {
      name: 'Knockoff Size Range',
      selector: row => row?.KnockoffSizeRange,
      sortable: true,
    },
    {
      name: 'Order Quantity',
      selector: row => row?.orderQuantity,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="action_container">
          <button className="btn btn-info text-white rounded-circle">
            <i className="icofont-edit" />
          </button>
          <button className="btn btn-danger text-white rounded-circle">
            <i className="icofont-ui-delete" />
          </button>
        </div>
      ),
      button: true,
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  const demoTableData = [
    {
      item_name: 'Item 1',
      category: 'Category A',
      KnockoffWtRange: '10-20',
      KnockoffSizeRange: 'Small',
      orderQuantity: 5,
    },
    {
      item_name: 'Item 2',
      category: 'Category B',
      KnockoffWtRange: '20-30',
      KnockoffSizeRange: 'Medium',
      orderQuantity: 10,
    },
    {
      item_name: 'Item 3',
      category: 'Category C',
      KnockoffWtRange: '30-40',
      KnockoffSizeRange: 'Large',
      orderQuantity: 15,
    },
  ];

  // // function
  const handelAddMore = () => {
    navigate(-1);
  };

  return (
    <Container fluid className="pending_order_preview_container">
      <h3 className="fw-bold text_primary">PO</h3>
      <DataTable columns={columns} data={demoTableData} />
      <div className="d-flex justify-content-end mt-3 gap-2">
        <button className="btn btn-dark" type="button" onClick={handelAddMore}>
          Add More
        </button>
        <button className="btn btn-warning text-white px-4" type="button">
          Submit
        </button>
      </div>
    </Container>
  );
}

export default PoPreview;
