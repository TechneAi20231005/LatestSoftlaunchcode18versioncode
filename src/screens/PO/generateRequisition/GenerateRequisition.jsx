import React, { useRef } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

// // static import
import { REACT_APP_ATTACHMENT_URL } from '../../../config/envConfig';
import './style.scss';
import { uploadFileGenerateRequisitionThunk } from '../../../redux/services/po/generateRequisition';

function GenerateRequisition() {
  // // initial state
  const dispatch = useDispatch();
  const fileRef = useRef();

  // // redux state
  const {
    isLoading: { uploadFileGenerateRequisition },
  } = useSelector(state => state?.generateRequisition);

  const handelBulkUpload = e => {
    const file = e.target.files[0];
    const bulkUploadData = new FormData();
    if (file) {
      bulkUploadData.append('po_attachments', file);
      dispatch(uploadFileGenerateRequisitionThunk({ formData: bulkUploadData }));
      fileRef.current.value = null;
    }
  };

  return (
    <Container fluid>
      <div className="generate_requisition_header">
        <h3 className="fw-bold text_primary"> Generate Requisition</h3>
        <div className="btn_container">
          {uploadFileGenerateRequisition ? (
            <button className="btn btn-dark px-md-5" disabled>
              <Spinner animation="border" size="sm" />{' '}
            </button>
          ) : (
            <label htmlFor="fileUpload" className="btn btn-dark ms-0">
              <i className="icofont-upload-alt me-2 fs-6" />
              Upload Files
            </label>
          )}

          <input
            ref={fileRef}
            type="file"
            id="fileUpload"
            className="d-none"
            onChange={e => handelBulkUpload(e)}
            accept=".csv, .xlsx"
          />
          <a
            href={`${REACT_APP_ATTACHMENT_URL}storage/PORequisition/Generate_Requisition_Upload_Format.xlsx`}
            className="btn btn-dark"
            download
          >
            <i className="icofont-download me-2 fs-6" />
            Bulk Upload Format
          </a>
        </div>
      </div>
    </Container>
  );
}

export default GenerateRequisition;
