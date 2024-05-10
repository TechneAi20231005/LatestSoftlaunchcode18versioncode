import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

function FormSkeleton({ rowLength = 4, columnLength = 3 }) {
  return (
    <Container fluid className="form_skeleton_container">
      {[...new Array(rowLength)]?.map((row, rowIndex) => (
        <Row key={rowIndex}>
          {[...new Array(columnLength)]?.map((column, colIndex) => (
            <Col key={colIndex} md={12 / columnLength} className="mb-3 mb-md-0">
              <div className="skeleton_container">
                <div className="skeleton" />
                <div className="skeleton" />
              </div>
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}

export default FormSkeleton;
