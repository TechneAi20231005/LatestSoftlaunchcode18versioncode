// // import React, { useEffect, useState, useRef } from "react";

// // const CustomFilterModal = ({
// //   show,
// //   handleClose,
// //   handleApply,
// //   position,
// //   filterColumn,
// //   handleCheckboxChange,
// //   selectedFilters = [],
// //   handleSelectAll,
// //   uniqueValues,
// //   searchTerm,
// //   setSearchTerm,
// // }) => {
// //   const [inputFocused, setInputFocused] = useState(false);
// //   const searchRef = useRef(null);

// //   useEffect(() => {
// //     if (show && searchRef.current && !inputFocused) {
// //       searchRef.current.focus();
// //       setInputFocused(true);
// //     }
// //   }, [show, inputFocused]);

// //   const allSelected = uniqueValues.every((value) =>
// //     selectedFilters.includes(value)
// //   );
// //   const topClass = position.top ? `top-${position.top}` : "";
// //   const leftClass = position.left ? `left-${position.left}` : "";
// //   return (
// //     <div
// //       // className={`z-index-1050  ${topClass} ${leftClass} `}
// //       style={{
// //         position: "absolute",
// //         top: position.top,
// //         left: position.left,
// //         zIndex: 1050,
// //         backgroundColor: "white",
// //         border: "1px solid #ccc",
// //         padding: "10px",
// //         borderRadius: "5px",
// //         // width: "300px",
// //       }}
// //     >
// //       <div>
// //         <div className="w-100">
// //           <input
// //             type="text"
// //             // id="search"
// //             ref={searchRef}
// //             placeholder="Search Here"
// //             // name="search"
// //             className="form-control"
// //             value={searchTerm}
// //             onChange={(e) => setSearchTerm(e.target.value)}
// //           />
// //         </div>
// //         <div>
// //           <input
// //             type="checkbox"
// //             id="filterAll"
// //             name="filterAll"
// //             checked={allSelected}
// //             onChange={(e) => handleSelectAll(e, uniqueValues)}
// //           />
// //           <label
// //             style={{ marginLeft: "5px" }}
// //             className="mt-2"
// //             htmlFor="filterAll"
// //           >
// //             Select All
// //           </label>
// //         </div>
// //         {uniqueValues.map((value, index) => (
// //           <div key={index} className="mx-3">
// //             <input
// //               type="checkbox"
// //               id={`filter${index}`}
// //               name={`filter${index}`}
// //               checked={selectedFilters.includes(value)}
// //               onChange={(e) => handleCheckboxChange(e, value)}
// //             />
// //             <label style={{ marginLeft: "5px" }} htmlFor={`filter${index}`}>
// //               {value}
// //             </label>
// //           </div>
// //         ))}
// //         <button className="btn btn-primary mt-3" onClick={handleApply}>
// //           Apply
// //         </button>
// //         <button className="btn btn-warning mt-3" onClick={handleClose}>
// //           Cancel
// //         </button>
// //         <button
// //           className="btn btn-shadow-light px-3 mt-3"
// //           onClick={handleClose}
// //         >
// //           Clear All
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomFilterModal;

// import React, { useEffect, useState, useRef } from 'react';
// import './CustomFilterStyle.css';
// import { Button, Modal, Overlay } from 'react-bootstrap';

// const CustomFilterModal = ({
//   show,
//   handleClose,
//   handleApply,
//   position,
//   handleCheckboxChange,
//   selectedFilters = [],
//   handleSelectAll,
//   uniqueValues,
//   searchTerm,
//   setSearchTerm
// }) => {
//   const [inputFocused, setInputFocused] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const handleCloseModal = () => setShowModal(false);
//   const handleShow = () => setShowModal(true);
//   const searchRef = useRef(null);
//   const target = useRef(null);

//   useEffect(() => {
//     if (show && searchRef.current && !inputFocused) {
//       searchRef.current.focus();
//       setInputFocused(true);
//     }
//   }, [show, inputFocused]);

//   const allSelected = uniqueValues.every((value) =>
//     selectedFilters.includes(value)
//   );

//   return (
//     <div
//       className="custom-container"
//       style={{ top: position.top, left: position.left, width: '20%' }}
//     >
//       <div>
//         <div>
//           <b className="fs-6 text-custom">Submodule</b>
//           <hr class="my-2" />

//           <p className="Sort mb-2">Sort</p>
//           <span className="d-flex flex-column">
//             <p className="fs-6 mb-2 pointer">
//               <i className="bi bi-arrow-up-short fs-6  "></i>Ascending
//             </p>
//             <p className="fs-6 mb-2 pointer">
//               <i className="bi bi-arrow-down-short fs-6"></i>Descending
//             </p>
//           </span>

//           <p className="Sort ms-4 my-2">Sort By color</p>
//           <hr class="my-1" />
//           <p className="fs-5 mb-0 ms-4 cursor-pointer">
//             Text Filters{' '}
//             <i
//               ref={target}
//               className="icofont-rounded-right rounded-right-icon-left pointer"
//               onClick={() => setShowTooltip(!showTooltip)}
//             ></i>
//           </p>
//           <Overlay target={target.current} show={showTooltip} placement="right">
//             {({
//               placement: _placement,
//               arrowProps: _arrowProps,
//               show: _show,
//               popper: _popper,
//               hasDoneInitialMeasure: _hasDoneInitialMeasure,
//               ...props
//             }) => (
//               <div className="custom-toolkit" {...props}>
//                 <div className="my-3">
//                   <p className="mb-2 pointer" onClick={handleShow}>
//                     Equals
//                   </p>
//                   <Modal
//                     show={showModal}
//                     className="custom-modal"
//                     onHide={handleClose}
//                     aria-labelledby="contained-modal-title-vcenter"
//                     centered
//                   >
//                     <Modal.Header closeButton>
//                       <Modal.Title className="fs-5 text-custom">
//                         Custom Filter
//                       </Modal.Title>
//                     </Modal.Header>
//                     <Modal.Body className="fs-6">
//                       Show item where: <b>Module</b>
//                       <div className="row mt-2">
//                         <div className="col">
//                           <select
//                             class="form-select"
//                             aria-label="Default select example"
//                           >
//                             <option selected>Open this select menu</option>
//                             <option value="1">One</option>
//                             <option value="2">Two</option>
//                             <option value="3">Three</option>
//                           </select>
//                         </div>
//                         <div className="col">
//                           <input
//                             type="text"
//                             className="form-control"
//                             placeholder="Type"
//                           ></input>
//                         </div>
//                       </div>
//                     </Modal.Body>
//                     <Modal.Footer className="modal-footer custom-modal-footer">
//                       <Button
//                         className="bg-custom-color"
//                         onClick={handleCloseModal}
//                       >
//                         OK
//                       </Button>
//                       <Button variant="warning" onClick={handleClose}>
//                         Cancel
//                       </Button>
//                     </Modal.Footer>
//                   </Modal>
//                   <p className="mb-2">Does Not Equals</p>
//                   <hr class="my-1" />

//                   <p className="mb-2">Begins with</p>
//                   <p className="mb-2">End with</p>
//                   <hr class="my-1" />
//                   <p className="mb-2">Contains</p>
//                   <p className="mb-2">Does Not Contain</p>
//                   <hr class="my-1" />
//                   <p className="mb-2">Custom filter</p>
//                 </div>
//               </div>
//             )}
//           </Overlay>
//           <hr class="my-1" />

//           <div>
//             <div class="position-relative">
//               <input
//                 ref={searchRef}
//                 type="text"
//                 placeholder="Search Here"
//                 class="form-control pe-5"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <i class="icofont-ui-search position-absolute top-50 end-0 translate-middle-y me-3 pointer"></i>
//             </div>
//           </div>
//         </div>
//         <div>
//           <input
//             type="checkbox"
//             id="filterAll"
//             name="filterAll"
//             checked={allSelected}
//             onChange={(e) => handleSelectAll(e, uniqueValues)}
//           />
//           <label className="mt-3 mx-3 fs-5" htmlFor="filterAll">
//             All
//           </label>
//         </div>
//         {uniqueValues.map((value, index) => (
//           <div key={index}>
//             <input
//               type="checkbox"
//               id={`filter${index}`}
//               name={`filter${index}`}
//               className="check-box-size"
//               checked={selectedFilters.includes(value)}
//               onChange={(e) => handleCheckboxChange(e, value)}
//             />
//             <label className="mx-3 fs-5" htmlFor={`filter${index}`}>
//               {value}
//             </label>
//           </div>
//         ))}
//         <button className="btn btn-primary mt-3" onClick={handleApply}>
//           Apply
//         </button>
//         <button className="btn btn-warning mt-3" onClick={handleClose}>
//           Cancel
//         </button>
//         <button className="btn btn-outline-dark mt-3" onClick={handleClose}>
//           Clear All
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CustomFilterModal;

import React, { useState, useRef } from 'react';
import { Overlay, Tooltip, Modal, Button } from 'react-bootstrap';
import './CustomFilterStyle.css'; // Ensure this CSS file includes the .custom-container class

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
  setSearchTerm
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const target = useRef(null);
  const searchRef = useRef(null);

  const handleShow = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  if (!show) return null;

  return (
    <div
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
        {/* <p className="fs-6 mb-0 ms-4 cursor-pointer">
          Text Filters{' '}
          <i
            ref={target}
            className="icofont-rounded-right rounded-right-icon-left pointer"
            onClick={() => setShowTooltip(!showTooltip)}
          ></i>
        </p> */}
        <p className="fs-6 mb-0 ms-4 cursor-pointer  text-filters-container">
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
                          <option selected>Open this select menu</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
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
                    <Button
                      className="bg-custom-color"
                      onClick={handleCloseModal}
                    >
                      OK
                    </Button>
                    <Button variant="warning" onClick={handleClose}>
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
                <p className="mb-2">Does Not Equals</p>
                <hr className="my-1" />

                <p className="mb-2">Begins with</p>
                <p className="mb-2">End with</p>
                <hr className="my-1" />
                <p className="mb-2">Contains</p>
                <p className="mb-2">Does Not Contain</p>
                <hr className="my-1" />
                <p className="mb-2">Custom filter</p>
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
