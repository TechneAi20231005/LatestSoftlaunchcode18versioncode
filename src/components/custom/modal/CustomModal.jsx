import React, { memo } from 'react';
import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { RenderIf } from '../../../utils';
import './style.scss';

function CustomModal({ children, width, title, show, onClose }) {
  return (
    <Modal
      size={width || 'md'}
      backdrop="static"
      show={show}
      centered
      className="custom_modal"
      onHide={onClose}
    >
      <RenderIf render={title}>
        <ModalHeader closeButton={onClose}>
          <h5 className="text_primary">{title}</h5>
        </ModalHeader>
      </RenderIf>
      <ModalBody className="position-relative pt-1">
        {/* <div>
          <h5 className="modal-title text-center mb-2 w-100">{title}</h5>
        </div> */}

        {children}
      </ModalBody>
    </Modal>
  );
}

export default memo(CustomModal);
