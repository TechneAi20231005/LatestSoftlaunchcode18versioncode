import React, { memo } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import { IoCloseOutline } from 'react-icons/io5';
import './style.scss';

function CustomModal({ children, width, title, isOpen, onClose }) {
  return (
    <Modal size={width || 'md'} backdrop="static" isOpen={isOpen} centered className="custom_modal">
      {onClose && <IoCloseOutline className="close_icon " onClick={onClose} />}
      <ModalBody className="position-relative">
        <div>
          <h5 className="modal-title text-center mb-2 w-100">{title}</h5>
        </div>

        {children}
      </ModalBody>
    </Modal>
  );
}

export default memo(CustomModal);
