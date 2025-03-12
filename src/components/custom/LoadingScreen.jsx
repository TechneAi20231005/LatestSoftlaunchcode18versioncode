import React from 'react'
import { Spinner, Modal } from 'react-bootstrap';

const LoadingScreen = ({showLoaderModal = false}) => {
  return (
    <Modal show={showLoaderModal} centered>
    <Modal.Body className="text-center">
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="dark" />
    </Modal.Body>
  </Modal>
  )
}

export default LoadingScreen
