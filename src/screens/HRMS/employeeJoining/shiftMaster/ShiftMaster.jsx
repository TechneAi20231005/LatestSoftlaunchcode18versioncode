import React from 'react';
import PageHeader from '../../../../components/Common/PageHeader';
import { Container } from 'react-bootstrap';

function ShiftMaster() {
  return (
    <Container fluid>
      <PageHeader
        headerTitle="Shift Master"
        renderRight={() => {
          return (
            <button className="btn btn-dark px-5">
              <i className="icofont-plus me-2 fs-6" />
              Add Shift
            </button>
          );
        }}
      />
    </Container>
  );
}

export default ShiftMaster;
