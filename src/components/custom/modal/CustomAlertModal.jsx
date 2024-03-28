import React, { memo } from 'react';
import { Modal, ModalBody, ModalHeader } from 'react-bootstrap';
import { RenderIf } from '../../../utils';
import './style.scss';

function CustomAlertModal({
  message,
  width,
  title,
  show,
  onClose,
  type,
  onSuccess,
  btnCloseName,
  btnSuccessName,
}) {
  return (
    <Modal
      size={width || 'sm'}
      backdrop="static"
      show={show}
      centered
      className="custom_alert_modal"
    >
      <RenderIf render={title}>
        <ModalHeader>
          <h5 className="text_primary">{title}</h5>
        </ModalHeader>
      </RenderIf>
      <ModalBody className="position-relative">
        <div className="text-center">
          {type === 'success' ? (
            <i className="icofont-check-circled text-success" />
          ) : type === 'info' ? (
            <i className="icofont-info-circle text-info" />
          ) : type === 'danger' ? (
            <i className="icofont-check-circled text-danger" />
          ) : null}
        </div>

        <p className="py-3">{message}</p>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn btn-dark px-5" onClick={onSuccess}>
            {btnSuccessName || 'Yes'}
          </button>
          <button onClick={onClose} className="btn btn-shadow-light px-5">
            {btnCloseName || 'No'}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default memo(CustomAlertModal);
