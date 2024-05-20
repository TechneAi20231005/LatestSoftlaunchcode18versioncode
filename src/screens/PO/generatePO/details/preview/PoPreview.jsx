import React, { useEffect, useState } from 'react';
import { Col, Container, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// // static import
import CustomAlertModal from '../../../../../components/custom/modal/CustomAlertModal';
import {
  deleteUserPendingOrderRequest,
  editUserPendingOrderRequest,
  resetPendingOrderListData,
} from '../../../../../redux/slices/po/generatePo';
import { createPendingOrderThunk } from '../../../../../redux/services/po/generatePo';
import { _base } from '../../../../../settings/constants';
import './style.scss';

function PoPreview() {
  // // initial state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // redux state
  const { userAddedPoDataList, isLoading } = useSelector(state => state?.generatePo);

  // // local state
  const [orderQty, setOrderQty] = useState({
    isEditable: false,
    currentId: '',
    currentValue: '',
  });
  const [orderQtyInputValue, setOrderQtyInputValue] = useState('');
  const [openDeleteOrderConfirmationModal, setOpenDeleteOrderConfirmationModal] = useState({
    open: false,
    currentId: '',
  });

  //  table column data
  const columns = [
    {
      name: 'Item',
      selector: row => row?.item || '---',
      sortable: false,
    },
    {
      name: 'Category',
      selector: row => row?.category || '---',
      sortable: false,
    },
    {
      name: 'Knockoff Wt Range',
      selector: row => row?.knockoff_wt_range || '---',
      sortable: true,
    },
    {
      name: 'Karagir Size Range',
      selector: row => row?.karagir_size_range || '---',
      sortable: true,
    },
    {
      name: 'Order Quantity',
      cell: row =>
        row?.id === orderQty?.currentId && orderQty?.isEditable ? (
          <Col>
            <input
              type="number"
              value={orderQtyInputValue}
              onChange={e => setOrderQtyInputValue(e.target.value)}
              className="form-control w-100"
            />
          </Col>
        ) : (
          row?.order_qty || '---'
        ),
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="action_container">
          <button className="btn btn-info text-white rounded-circle">
            {row?.id === orderQty?.currentId && orderQty?.isEditable ? (
              <i className="icofont-check-alt" onClick={() => handelEditOrder(row?.id)} />
            ) : (
              <i
                className="icofont-edit"
                onClick={() =>
                  setOrderQty({
                    isEditable: true,
                    currentId: row?.id,
                    currentValue: row?.order_qty,
                  })
                }
              />
            )}
          </button>
          <button className="btn btn-danger text-white rounded-circle">
            <i
              className="icofont-ui-delete"
              onClick={() =>
                setOpenDeleteOrderConfirmationModal({ open: true, currentId: row?.id })
              }
            />
          </button>
        </div>
      ),
      button: true,
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  // // function
  const handelAddMore = () => {
    navigate(-1);
    dispatch(resetPendingOrderListData());
  };

  const handelCreatePo = () => {
    dispatch(
      createPendingOrderThunk({
        formData: { payload: userAddedPoDataList },
        onSuccessHandler: () => {
          navigate(`/${_base}/GeneratePO`);
        },
      }),
    );
  };

  const handelEditOrder = id => {
    dispatch(editUserPendingOrderRequest({ current_id: id, order_qty: orderQtyInputValue }));
    setOrderQty({
      isEditable: false,
      currentId: id,
    });
  };

  const handelDeleteOrder = () => {
    dispatch(
      deleteUserPendingOrderRequest({ current_id: openDeleteOrderConfirmationModal?.currentId }),
    );
    setOpenDeleteOrderConfirmationModal({ open: false });
  };

  useEffect(() => {
    setOrderQtyInputValue(orderQty?.currentValue);
  }, [orderQty?.currentValue]);
  return (
    <>
      <Container fluid className="pending_order_preview_container">
        <h3 className="fw-bold text_primary">PO</h3>
        <DataTable columns={columns} data={userAddedPoDataList} />
        <div className="d-flex justify-content-end mt-3 gap-2">
          <button className="btn btn-dark" type="button" onClick={handelAddMore}>
            Add More
          </button>
          <button
            className="btn btn-warning text-white px-4"
            type="button"
            onClick={handelCreatePo}
          >
            {isLoading?.createPendingOrder ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </button>
        </div>
      </Container>

      {/* Delete order confirmation modal */}
      <CustomAlertModal
        show={openDeleteOrderConfirmationModal?.open}
        type="info"
        message={`Are you sure you want to delete this order?`}
        onSuccess={handelDeleteOrder}
        onClose={() => setOpenDeleteOrderConfirmationModal({ open: false })}
      />
    </>
  );
}

export default PoPreview;
