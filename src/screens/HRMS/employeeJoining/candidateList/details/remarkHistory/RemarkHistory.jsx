import React from 'react';
import { Container } from 'react-bootstrap';

function RemarkHistory() {
  return (
    <Container className="employee_joining_details_container">
      <h5 className="mb-0 text-primary">Remark History</h5>
      <hr className="primary_divider mt-1" />
      {[...new Array(3)].map(() => (
        <>
          <div className="remark_history d-flex justify-content-between">
            <p>Remark Title : Remark Title</p>
            <p className="mt-4 opacity-50">Lorem ipsum dolor sit amet consectetur adipisicing</p>
          </div>
          <hr className="mt-0" />
        </>
      ))}
    </Container>
  );
}

export default RemarkHistory;
