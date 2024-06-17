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
  handleBetweenValueChange,
  selectedFilters,
  handleSelectAll,
  uniqueValues,
  searchTerm,
  setSearchTerm,
  setSelectedFilters,
  paginationData,
  filterColumnId,
  setFilterType,
  setFilterText,
  filterType,
  columnName,
  handleAscendingClick,
  handleDescendingClick,
  type,
  handleApplyButton
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const target = useRef(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  // const [filterType, setFilterType] = useState('');
  // const [filterText, setFilterText] = useState('');

  const textFilterData = [
    {
      value: 'equals',
      label: 'Equals'
    },
    {
      value: 'does not equal',
      label: 'Does Not Equals'
    },
    {
      value: 'begins with',
      label: 'Begins With'
    },
    {
      value: 'does not begin with',
      label: 'Does Not Begin With'
    },
    {
      value: 'ends with',
      label: 'End with'
    },
    {
      value: 'does not begin with',
      label: 'Does Not End with'
    },
    {
      value: 'contains',
      label: 'Contains'
    },
    {
      value: 'does not contain',
      label: 'Does Not Contain'
    }
  ];

  const numberFilterData = [
    {
      value: 'equals',
      label: 'Equals'
    },
    {
      value: 'is greater than',
      label: 'Is Greater Than'
    },
    {
      value: 'is between',
      label: 'Between'
    },
    {
      value: 'is not between',
      label: 'Is Not Between'
    }
  ];

  // <option value="equals">Equals</option>
  // <option value="does not equal">
  //   Does Not Equals
  // </option>
  // <option value="begins with">Begins With</option>
  // <option value="does not begin with">Does Not Begin With</option>

  // <option value="ends with">End with</option>
  // <option value="does not end with">Does Not End with</option>

  // <option value="contains"> Contains</option>
  // <option value="does not contain">
  //   Does Not Contain
  // </option>

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

  // const handleSubmit = () => {
  //   const filterPayload = {
  //     filter_testcase_data: [
  //       {
  //         column: filterColumnId,
  //         searchText: filterText,
  //         filter: filterType
  //       }
  //     ]
  //   };

  //   console.log('filterPayload', filterPayload);

  //   // dispatch(
  //   //   getDraftTestCaseList({
  //   //     filter_testcase_data:filterPayload ,
  //   //     limit: paginationData.rowPerPage,
  //   //     page: paginationData.currentPage
  //   //     // Spread the filter payload into the request payload
  //   //   })
  //   // );

  //   dispatch(
  //     getDraftTestCaseList({
  //       limit: paginationData.rowPerPage,
  //       page: paginationData.currentPage,
  //       filter_testcase_data: [
  //         {
  //           column: filterColumnId,
  //           searchText: filterText,
  //           filter: filterType
  //         }
  //       ]
  //     })
  //   );

  //   handleCloseModal();
  // };

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="custom-container"
      style={{ top: position.top, left: position.left }}
    >
      <div>
        <b className="fs-6 text-primary">{columnName}</b>
        <hr className="my-2" />

        <p className="Sort mb-2">Sort</p>
        <span className="d-flex flex-column">
          <p
            className="fs-6 mb-2 pointer"
            onClick={() => handleAscendingClick('ASC')}
          >
            <i className="bi bi-arrow-up-short fs-6"></i>Ascending
          </p>
          <p
            className="fs-6 mb-2 pointer"
            onClick={() => handleDescendingClick('DESC')}
          >
            <i className="bi bi-arrow-down-short fs-6"></i>Descending
          </p>
        </span>

        <hr className="my-1" />
        <p className="fs-6 mb-0 ms-4 text-filters-container">
          {type === 'number' ? 'Number Filters' : 'Text Filters'}
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
                {type === 'number' ? (
                  <>
                    {numberFilterData.map((option) => (
                      <p
                        key={option.value}
                        className="mb-2 "
                        onClick={() => handleShow(option.value)}
                      >
                        {option.label}
                      </p>
                    ))}
                  </>
                ) : (
                  <>
                    {textFilterData.map((option) => (
                      <p
                        key={option.value}
                        className="mb-2 cursor-pointer "
                        onClick={() => handleShow(option.value)}
                      >
                        {option.label}
                      </p>
                    ))}
                  </>
                )}
                <hr className="my-1 pointer" />

                <Modal
                  show={showModal}
                  className="custom-modal"
                  onHide={handleClose}
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  {console.log('type===>', type)}
                  <Modal.Header closeButton>
                    <Modal.Title className="fs-5 text-primary">
                      {type === 'number' ? 'Number Filters' : 'Text Filters'}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="fs-6">
                    Show item where: <b>{columnName}</b>
                    <div className="row mt-2">
                      <div className="col">
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => {
                            setFilterType(e.target.value);
                          }}
                        >
                          <option defaultValue>Open this select menu</option>
                          {type === 'number'
                            ? numberFilterData.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.label}
                                </option>
                              ))
                            : textFilterData.map((option, index) => (
                                <option key={index} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                        </select>
                      </div>
                      {/* {(filterType != 'does not equal' ||
                        filterType != 'equals' ||
                        filterType != 'is greater than' ||
                        filterType != 'is less than' ||
                        filterType != 'is not between') && ( */}
                      {type === 'text' && (
                        <div className="col">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type"
                            onChange={(e) => setFilterText(e.target.value)}
                          />
                        </div>
                      )}
                      {/* )} */}
                      {
                        // filterColumn === 'id' &&
                        //   (filterType === 'equals' ||
                        //     filterType === 'is greater than')
                        type === 'number' && (
                          <div className="col">
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Type"
                              onChange={(e) =>
                                handleBetweenValueChange(0, e.target.value)
                              }
                            />
                          </div>
                        )
                      }
                      {(filterType === 'is between' ||
                        filterType === 'is not between') && (
                        <>
                          <div className="col">
                            <input
                              type={filterColumn === 'id' ? 'number' : 'text'}
                              className="form-control"
                              placeholder="Type"
                              onChange={(e) =>
                                handleBetweenValueChange(1, e.target.value)
                              }
                            />
                          </div>
                          {/* <div className="col">
                            <input
                              type={filterColumn === 'id' ? 'number' : 'text'}
                              className="form-control"
                              placeholder="Type"
                              // onChange={(e) => setFilterText(e.target.value)}
                              onChange={(e) =>
                                handleBetweenValueChange(1, e.target.value)
                              }
                            />
                          </div> */}
                        </>
                      )}
                    </div>
                  </Modal.Body>
                  <Modal.Footer className="modal-footer custom-modal-footer">
                    <Button className="bg-custom-color" onClick={handleApply}>
                      OK
                    </Button>
                    <Button variant="warning" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
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
          checked={selectedFilters.length === uniqueValues.length} // Check if all uniqueValues are selected
          onChange={handleSelectAll}
        />
        <label className="mt-3 mx-3 fs-6" htmlFor="filterAll">
          All
        </label>
      </div>

      {uniqueValues.map((value) => (
        <div key={value.value} className="filter-item">
          <input
            type="checkbox"
            id={`filter${value.value}`}
            name={`filter${value.value}`}
            className="check-box-size"
            checked={selectedFilters.includes(value.label)} // Check if value.label is in selectedFilters
            onChange={(e) => handleCheckboxChange(e, value.label, value.value)} // Pass label and value to handleFilterCheckboxChange
          />
          <label className="mx-3 fs-6 mb-0" htmlFor={`filter${value.value}`}>
            {value.label} {/* Display the label property of value */}
          </label>
        </div>
      ))}
      <div className="button-container">
        <button className="btn btn-primary mt-3" onClick={handleApplyButton}>
          Apply
        </button>
        <button className="btn btn-warning mt-3" onClick={handleClose}>
          Cancel
        </button>
        <button className="btn btn-outline-dark mt-3">Clear All</button>
      </div>
    </div>
  );
};

export default CustomFilterModal;
