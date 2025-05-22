import React from 'react';
import { Modal } from 'react-bootstrap';
import MyTicketService from '../../../services/TicketService/MyTicketService';
import { toast } from 'react-toastify';
import { errorHandler } from '../../../utils';

function confirmationModal({
  confirmationModal,
  handleConfirmationModal,
  setColumnFilters,
  setPagination
}) {
  const handleSolveTicketModal = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    var id = form.get('id');
    try {
      const res = await new MyTicketService().verifyTicketConfirmationOtp(
        id,
        form
      );
      if (res.status === 200) {
        if (res.data.status === 1) {
          toast.success(res.data.message);
          handleConfirmationModal({
            showModal: false,
            modalData: '',
            modalHeader: ''
          });
          setColumnFilters([]);
          setPagination({
            pageIndex: 0,
            pageSize: 10
          });
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      errorHandler(error);
    } finally {
    }
  };
  return (
    <Modal centered show={confirmationModal.showModal}>
      <Modal.Header>
        <Modal.Title className="fw-bold">Solve Ticket - </Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSolveTicketModal}>
        <Modal.Body>
          <input
            type="hidden"
            name="id"
            id="id"
            defaultValue={confirmationModal.modalData.id}
          />
          <h5
            className="text-nowrap bd-highlight"
            style={{ fontFamily: 'sans-serif', fontWeight: 'bold' }}
          >
            Are You Really Want To Solve This Ticket ?
          </h5>
          <label className="form-label font-weight-bold mt-3">Remark :*</label>
          <textarea
            type="text"
            name="remark"
            id="remark"
            rows="4"
            maxLength={1000}
            className="form-control form-control-sm"
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-danger text-white"
            onClick={(e) =>
              handleConfirmationModal({
                e,
                showModal: false,
                modalData: '',
                modalHeader: ''
              })
            }
          >
            NO
          </button>
          <button type="submit" className="btn btn-info text-white">
            YES
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default confirmationModal;
