import React from 'react';
import { Container } from 'react-bootstrap';

// // static import
import './style.scss';

function GenerateRequisition() {
  return (
    <Container fluid>
      <div className="generate_requisition_header">
        <h3 className="fw-bold text_primary"> Generate Requisition</h3>
        <div className="btn_container">
          <label htmlFor="fileUpload" className="btn btn-dark">
            <i className="icofont-upload-alt me-2 fs-6" />
            Upload Files
          </label>
          <input type="file" id="fileUpload" style={{ display: 'none' }} />
          <a href="/path/to/bulk/upload/format/file" className="btn btn-dark" download>
            <i className="icofont-download me-2 fs-6" />
            Bulk Upload Format
          </a>
        </div>
      </div>
    </Container>
  );
}

export default GenerateRequisition;
