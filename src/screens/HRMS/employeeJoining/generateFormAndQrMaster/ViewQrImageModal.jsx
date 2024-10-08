import React, { useState } from 'react';
// // static import
import CustomModal from '../../../../components/custom/modal/CustomModal';
import { _attachmentUrl, attachmentUrl } from '../../../../settings/constants';

const ViewQrImageModal = ({ show, close, onClose, src }) => {
  return (
    <CustomModal onClose={onClose} show={show} title="View Logo" width="sm">
      <div className="modal-body d-flex justify-content-center align-items-center">
        <img
          src={_attachmentUrl + src}
          alt="Logo"
          className="img-fluid"
          loading
          style={{ maxWidth: '80%' }}
        />
      </div>
    </CustomModal>
  );
};

export default ViewQrImageModal;
