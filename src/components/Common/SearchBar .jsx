import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ExportToExcel } from '../Utilities/Table/ExportToExcel';

const SearchBar = ({
  setSearchTerm,
  handleSearch,
  handleReset,
  exportData,
  exportFileName,
  placeholder
}) => {
  return (
    <Row className="row_gap_3">
      <Col xs={12} md={7} xxl={8}>
        <input
          type="search"
          className="form-control"
          placeholder={placeholder}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Col>
      <Col
        xs={12}
        md={5}
        xxl={4}
        className="d-flex justify-content-sm-end btn_container"
      >
        <button
          className="btn btn-warning text-white"
          type="search"
          onClick={handleSearch}
        >
          <i className="icofont-search-1 "></i> Search
        </button>
        <button
          className="btn btn-info text-white"
          type="button"
          onClick={handleReset}
        >
          <i className="icofont-refresh text-white"></i> Reset
        </button>
        <ExportToExcel
          className="btn btn-danger"
          apiData={exportData}
          fileName={exportFileName}
          disabled={!exportData?.length}
        />
      </Col>
    </Row>
  );
};

export default SearchBar;
