import React from 'react'
import { Modal } from 'react-bootstrap'
import { errorHandler } from '../../../utils'
import MyTicketService from '../../../services/TicketService/MyTicketService'
import { toast } from 'react-toastify'

const UnPassModal = ({
  remarkModal,
  handleRemarkModal,
  setPagination=() => {},
  setColumnFilters = () => {},
  setRowSelection = () => {},
}) => {

  console.log("hello from unpass modal", remarkModal)

  const handlePassTicketForm = async (e) => {
    try{
      e.preventDefault()
      const formData = new FormData(e.target)
      if (remarkModal && Array.isArray(remarkModal.modalData)) {
        remarkModal.modalData.forEach((id, index) => {
          formData.append(`id[${index}]`, id);
        });
      } else {
        formData.append('id[]', remarkModal.modalData.id);
      }
      formData.append('pass_status', remarkModal.status);
     const response = await new MyTicketService().passTicket(formData);
     if(response?.status === 200){
      const { status, message } = response.data;
      if(status === 1){
        handleRemarkModal({
          showModal: false,
          modalData: '',
          modalHeader: '',
        })
         toast.success(message);
         setColumnFilters([])
         setRowSelection({})
         setPagination({
          pageIndex: 0,
          pageSize: 10
         })

      }else{
        toast.error(message);
      }
     }

    }catch(error){
      errorHandler(error)
    }
  }
  return (
    <Modal
        centered
        show={remarkModal.showModal}
        onHide={(e) => {
          handleRemarkModal({
            showModal: false,
            modalData: '',
            modalHeader: '',
            status: remarkModal.status
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">
            {remarkModal.status === 'PASS' ? 'PASS TICKET ' : 'REJECT TICKET'}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handlePassTicketForm}>
          <Modal.Body>
            <div className="deadline-form">
              <div className="row g-3 mb-3">
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Ticket Id :
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={
                      Array.isArray(remarkModal.modalData)
                        ? remarkModal?.modalData?.join(', ')
                        : remarkModal.modalData?.ticket_id
                    }
                      readOnly={
                      remarkModal?.modalData?.length <= 0 ? false : true
                    }
                    required
                  />
                </div>
                <div className="col-sm-12">
                  <label className="form-label font-weight-bold">
                    Remark :*
                  </label>
                  <input
                    type="text"
                    name="remark"
                    id="remark"
                    className="form-control form-control-sm"
                    required
                    maxLength={1000}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleRemarkModal({
                  showModal: false,
                  modalData: '',
                  modalHeader: ''
                });
              }}
            >
              Cancel
            </button>
          </Modal.Footer>
        </form>
      </Modal>
  )
}

export default UnPassModal
