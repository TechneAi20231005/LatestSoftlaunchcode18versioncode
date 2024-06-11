import React, { useState, useRef, useEffect } from 'react';
import { Overlay, Tooltip, Modal, Button } from 'react-bootstrap';
import './CustomFilterStyle.css'; // Ensure this CSS file includes the .custom-container class
import { getDraftTestCaseList } from '../../../redux/services/testCases/downloadFormatFile';
import { useDispatch } from 'react-redux';

const CustomFilterModal = ({
  show,
  handleClose,
  handleApply,
  position,
  filterColumn,
  handleCheckboxChange,
  selectedFilters,
  handleSelectAll,
  uniqueValues,
  searchTerm,
  setSearchTerm,
  paginationData
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const target = useRef(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { top, left } = containerRef.current.getBoundingClientRect();
        if (window.innerWidth < 600) {
          containerRef.current.style.top = '10%';
          containerRef.current.style.left = '5%';
          containerRef.current.style.right = '5%';
          containerRef.current.style.bottom = 'auto';
        } else {
          containerRef.current.style.top = `${top}px`;
          containerRef.current.style.left = `${left}px`;
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShow = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      getDraftTestCaseList({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
  };

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="custom-container"
      style={{ top: position.top, left: position.left }}
    >
      <div>
        <b className="fs-6 text-custom">Submodule</b>
        <hr className="my-2" />

        <p className="Sort mb-2">Sort</p>
        <span className="d-flex flex-column">
          <p className="fs-6 mb-2 pointer">
            <i className="bi bi-arrow-up-short fs-6"></i>Ascending
          </p>
          <p className="fs-6 mb-2 pointer">
            <i className="bi bi-arrow-down-short fs-6"></i>Descending
          </p>
        </span>

        <hr className="my-1" />
        <p className="fs-6 mb-0 ms-4 cursor-pointer text-filters-container">
          Text Filters{' '}
          <i
            ref={target}
            className="icofont-rounded-right icon-spacing"
            onClick={() => setShowTooltip(!showTooltip)}
          ></i>
        </p>
        <Overlay target={target.current} show={showTooltip} placement="right">
          {({
            placement: _placement,
            arrowProps: _arrowProps,
            show: _show,
            popper: _popper,
            hasDoneInitialMeasure: _hasDoneInitialMeasure,
            ...props
          }) => (
            <div className="custom-toolkit" {...props}>
              <div className="my-3">
                <p className="mb-2 pointer" onClick={handleShow}>
                  Equals
                </p>
                <Modal
                  show={showModal}
                  className="custom-modal"
                  onHide={handleClose}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header closeButton>
                    <Modal.Title className="fs-5 text-custom">
                      Custom Filter
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="fs-6">
                    Show item where: <b>Module</b>
                    <div className="row mt-2">
                      <div className="col">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                        >
                          <option defaultValue>Open this select menu</option>
                          <option value="1">Equals</option>
                          <option value="2">Does Not Equals</option>
                          <option value="3">Begins With</option>
                        </select>
                      </div>
                      <div className="col">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type"
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="modal-footer custom-modal-footer">
                    <Button className="bg-custom-color" onClick={handleSubmit}>
                      OK
                    </Button>
                    <Button variant="warning" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
                <p className="mb-2 pointer">Does Not Equals</p>
                <hr className="my-1" />

                <p className="mb-2 pointer">Begins with</p>
                <p className="mb-2 pointer">End with</p>
                <hr className="my-1" />
                <p className="mb-2 pointer">Contains</p>
                <p className="mb-2 pointer">Does Not Contain</p>
                <hr className="my-1 pointer" />
                <p className="mb-2 pointer">Custom filter</p>
              </div>
            </div>
          )}
        </Overlay>
        <hr className="my-1" />

        <div>
          <div className="position-relative">
            <input
              ref={searchRef}
              type="text"
              placeholder="Search Here"
              className="form-control pe-5"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="icofont-ui-search position-absolute top-50 end-0 translate-middle-y me-3 pointer"></i>
          </div>
        </div>
      </div>
      <div>
        <input
          type="checkbox"
          id="filterAll"
          name="filterAll"
          checked={selectedFilters.length === uniqueValues.length}
          onChange={(e) => handleSelectAll(e, uniqueValues)}
        />
        <label className="mt-3 mx-3 fs-6" htmlFor="filterAll">
          All
        </label>
      </div>
      {uniqueValues.map((value, index) => (
        <div key={index} className="filter-item">
          <input
            type="checkbox"
            id={`filter${index}`}
            name={`filter${index}`}
            className="check-box-size"
            checked={selectedFilters.includes(value)}
            onChange={(e) => handleCheckboxChange(e, value)}
          />
          <label className="mx-3 fs-6 mb-0" htmlFor={`filter${index}`}>
            {value}
          </label>
        </div>
      ))}
      <div className="button-container">
        <button className="btn btn-primary mt-3" onClick={handleApply}>
          Apply
        </button>
        <button className="btn btn-warning mt-3" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-outline-dark mt-3" onClick={handleClose}>
          Clear All
        </button>
      </div>
    </div>
  );
};

export default CustomFilterModal;
