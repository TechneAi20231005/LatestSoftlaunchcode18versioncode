import React, { useCallback, useEffect, useState } from 'react';
import { Col, Container, Spinner } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

// // static import
import CustomAlertModal from '../../../../../components/custom/modal/CustomAlertModal';
import {
  deleteUserPendingOrderRequest,
  editUserPendingOrderRequest,
  resetPendingOrderListData,
  resetUserAddedOrderList
} from '../../../../../redux/slices/po/generatePo';
import { createPendingOrderThunk } from '../../../../../redux/services/po/generatePo';
import { _base } from '../../../../../settings/constants';
import { NumbersOnly } from '../../../../../components/Utilities/Validation';
import { exportToExcelCustomHandler } from '../../../../../utils/customFunction';
import './style.scss';

function PoPreview() {
  // // initial state
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // // redux state
  const {
    userAddedPoDataList,
    isLoading,
    pendingOrderErrorFileOnTheSportDownloadData
  } = useSelector((state) => state?.generatePo);

  // // local state
  const [orderQty, setOrderQty] = useState({
    isEditable: false,
    currentId: '',
    currentValue: ''
  });
  const [orderQtyInputValue, setOrderQtyInputValue] = useState('');
  const [
    openDeleteOrderConfirmationModal,
    setOpenDeleteOrderConfirmationModal
  ] = useState({
    open: false,
    currentId: ''
  });

  //  table column data
  const columns = [
    {
      name: 'Item',
      selector: (row) => row?.item || '---',
      sortable: false
    },
    {
      name: 'Category',
      selector: (row) => row?.category || '---',
      sortable: false
    },
    {
      name: 'Knockoff Wt Range',
      selector: (row) => row?.knockoff_wt_range || '---',
      sortable: true
    },
    {
      name: 'Karagir Size Range',
      selector: (row) => row?.karagir_size_range || '---',
      sortable: true
    },
    {
      name: 'Order Quantity',
      cell: (row) =>
        row?.id === orderQty?.currentId && orderQty?.isEditable ? (
          <Col>
            <input
              type="number"
              value={orderQtyInputValue}
              onChange={(e) => setOrderQtyInputValue(e.target.value)}
              className="form-control w-100"
              onKeyPress={NumbersOnly}
            />
          </Col>
        ) : (
          row?.order_qty || '---'
        ),
      sortable: true
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="action_container">
          <button
            className="btn btn-info text-white rounded-circle"
            onClick={() => {
              row?.id === orderQty?.currentId && orderQty?.isEditable
                ? handelEditOrder(row?.id)
                : setOrderQty({
                    isEditable: true,
                    currentId: row?.id,
                    currentValue: row?.order_qty
                  });
            }}
          >
            {row?.id === orderQty?.currentId && orderQty?.isEditable ? (
              <i className="icofont-check-alt" />
            ) : (
              <i className="icofont-edit" />
            )}
          </button>
          <button
            className="btn btn-danger text-white rounded-circle"
            onClick={() =>
              setOpenDeleteOrderConfirmationModal({
                open: true,
                currentId: row?.id
              })
            }
          >
            <i className="icofont-ui-delete" />
          </button>
        </div>
      ),
      button: true,
      ignoreRowClick: true,
      allowOverflow: true
    }
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
        onErrorHandler: () => {
          navigate(`/${_base}/GeneratePO`);
        }
      })
    );
  };

  const handelCancelPo = () => {
    dispatch(resetUserAddedOrderList());
    navigate(`/${_base}/GeneratePO`);
  };

  const handelEditOrder = (id) => {
    if (orderQtyInputValue > 0) {
      dispatch(
        editUserPendingOrderRequest({
          current_id: id,
          order_qty: orderQtyInputValue
        })
      );
      setOrderQty({
        isEditable: false,
        currentId: id
      });
    } else {
      toast.error('Order quantity should be greater than 0');
    }
  };

  const handelDeleteOrder = () => {
    dispatch(
      deleteUserPendingOrderRequest({
        current_id: openDeleteOrderConfirmationModal?.currentId
      })
    );
    setOpenDeleteOrderConfirmationModal({ open: false });
  };

  const exportErrorFileOnPoSubmit = useCallback(() => {
    const errorFileData = pendingOrderErrorFileOnTheSportDownloadData?.map(
      (errorData) => ({
        'Delivery Date': errorData?.delivery_date ?? '--',
        'Order Date': errorData?.order_date ?? '--',
        'Karagir 1': errorData?.karagir ?? '--',
        Item: errorData?.item ?? '--',
        Category: errorData?.category ?? '--',
        'Exact Wt': errorData?.exact_wt ?? '--',
        'Weight Range': errorData?.weight_range ?? '--',
        'Size Range': errorData?.size_range ?? '--',
        'Purity Range': errorData?.purity_range ?? '--',
        'New Order': errorData?.new_qty ?? '--',
        'Karagir Wt Range': errorData?.karagir_wt_range ?? '--',
        'Knockoff Wt Range': errorData?.knockoff_wt_range ?? '--',
        'Karagir Size Range': errorData?.karagir_size_range ?? '--',
        Remark: errorData?.Error ?? '--'
      })
    );
    return exportToExcelCustomHandler({
      data: errorFileData,
      fileName: 'PO Error File Records'
    });
  }, [pendingOrderErrorFileOnTheSportDownloadData]);

  useEffect(() => {
    setOrderQtyInputValue(orderQty?.currentValue);
  }, [orderQty?.currentValue]);

  useEffect(() => {
    if (pendingOrderErrorFileOnTheSportDownloadData?.length) {
      exportErrorFileOnPoSubmit();
    }
  }, [pendingOrderErrorFileOnTheSportDownloadData]);

  return (
    <>
      <Container fluid className="pending_order_preview_container">
        <h3 className="fw-bold text_primary">PO</h3>
        <DataTable columns={columns} data={userAddedPoDataList} />
        <div className="d-flex justify-content-end mt-3 gap-2">
          <button
            className="btn btn-dark"
            type="button"
            onClick={handelAddMore}
          >
            Add More
          </button>
          <button
            className="btn btn-warning text-white px-4"
            type="button"
            onClick={handelCreatePo}
            disabled={isLoading?.createPendingOrder}
          >
            {isLoading?.createPendingOrder ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Submit'
            )}
          </button>
          <button
            className="btn btn-danger text-white px-4"
            type="button"
            onClick={handelCancelPo}
          >
            Cancel
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
