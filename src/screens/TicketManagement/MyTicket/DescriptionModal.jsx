import React from 'react'
import { Modal } from 'react-bootstrap';

function DescriptionModal({modal, handleModal }) {
  return (
  <Modal
          centered
          show={modal.showModal}
          style={{
            height: '60%'
          }}
          scrollable={true}
          onHide={(e) => {
            handleModal({
              showModal: false,
              modalData: '',
              modalHeader: ''
            });
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">
              Description-{modal.modalData.ticket_id}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{modal.modalData.description}</Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-danger text-white"
              onClick={() => {
                handleModal({ showModal: false, modalData: '', modalHeader: '' });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
  )
}

export default DescriptionModal
