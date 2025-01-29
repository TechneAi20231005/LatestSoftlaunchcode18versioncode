import { FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Modal, Row, Stack } from 'react-bootstrap';
import { CustomReactSelect } from '../../../components/custom/inputs/CustomInputs';
import Select from 'react-select';
import {
  deleteItemCategoryListThunk,
  getItemCategoryListThunk
} from '../../../redux/services/po/common';
import { useDispatch, useSelector } from 'react-redux';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import DataTable from 'react-data-table-component';

export default function DeleteRequisition() {
  //   const dispatch = useDispatch();

  //   const [showModal, setShowModal] = useState(false);
  //   const [remark, setRemark] = useState('');
  //   const {
  //     filterItemCategoryList,
  //     itemCategoryList,
  //     filterCategoryList,
  //     isLoading: { getItemCategoryList }
  //   } = useSelector((state) => state?.poCommon);
  //   console.log('filterItemCategoryList', filterItemCategoryList);
  //   const handleDeleteClick = () => {
  //     setShowModal(true);
  //   };

  //   const handleClose = () => {
  //     setShowModal(false);
  //     setRemark(''); // Reset remark field when closing
  //   };
  //   const handleRemarkChange = (event) => {
  //     setRemark(event.target.value);
  //   };
  //   const handleSubmit = (values) => {
  //     console.log('Submitted Remark:');
  //     const formData = {
  //       ...values,
  //       remark // Add the remark here
  //     };
  //     // handleClose(); // Close modal after submit
  //   };

  //   const loadData = () => {
  //     dispatch(getItemCategoryListThunk());
  //   };
  //   useEffect(() => {
  //     loadData();
  //   }, []);

  //   return (
  //     <Container fluid className="po_vender_export_container">
  //       <h3 className="fw-bold text_primary "> Delete Requisition</h3>
  //       <Stack gap={3}>
  //         <Formik
  //           initialValues={{ item: [], category: [], remark: '' }}
  //           onSubmit={(values) => {
  //             console.log('vvvvv', values);
  //             handleSubmit(values);
  //           }}
  //         >
  //           {({ setFieldValue, values }) => {
  //             console.log('Form Values:', values);

  //             const filteredCategories = itemCategoryList
  //               ?.filter((d) => values.item?.includes(d.item)) // Filter categories based on selected items
  //               ?.map((d) => ({ value: d.id, label: d.category }));

  //             return (
  //               <Form>
  //                 <Row className="align-items-md-end row_gap_3">
  //                   {/* Multi-select dropdown for Item */}
  //                   <Col sm={6} md={4} lg={3}>
  //                     <label className="form-label font-weight-bold">Item:</label>
  //                     <Select
  //                       isMulti
  //                       options={filterItemCategoryList} // Ensure this has { value, label } format
  //                       value={filterItemCategoryList.filter((option) =>
  //                         values.item?.includes(option.label)
  //                       )}
  //                       onChange={(selected) =>
  //                         setFieldValue(
  //                           'item',
  //                           selected.map((s) => s.label)
  //                         )
  //                       }
  //                     />
  //                   </Col>

  //                   {/* Multi-select dropdown for Category */}
  //                   <Col sm={6} md={4} lg={3}>
  //                     <label className="form-label font-weight-bold">
  //                       Category:
  //                     </label>
  //                     <Select
  //                       isMulti
  //                       options={filteredCategories} // Show only categories related to selected items
  //                       value={filteredCategories.filter((option) =>
  //                         values.category?.includes(option.value)
  //                       )}
  //                       onChange={(selected) =>
  //                         setFieldValue(
  //                           'category',
  //                           selected.map((s) => s.value)
  //                         )
  //                       }
  //                     />
  //                   </Col>
  //                 </Row>

  //                 <Row className="mt-3">
  //                   <Col className="d-flex justify-content-end">
  //                     <button
  //                       type="button"
  //                       className="btn btn-danger me-2"
  //                       onClick={() => setShowModal(true)} // Open modal on delete click
  //                     >
  //                       Delete
  //                     </button>
  //                     <button type="button" className="btn btn-danger">
  //                       Export
  //                     </button>
  //                   </Col>
  //                 </Row>

  //                 {/* Modal for delete confirmation and remark input */}
  //                 <Modal
  //                   show={showModal}
  //                   onHide={() => setShowModal(false)}
  //                   centered
  //                 >
  //                   <Modal.Header closeButton>
  //                     <Modal.Title>Delete Confirmation</Modal.Title>
  //                   </Modal.Header>
  //                   <Modal.Body>
  //                     <div className="col-sm-12">
  //                       <label className="form-label font-weight-bold">
  //                         Remark:
  //                       </label>
  //                       <input
  //                         type="text"
  //                         className="form-control form-control-sm"
  //                         id="remark"
  //                         name="remark"
  //                         maxLength={50}
  //                         value={values.remark} // Use Formik's value for remark
  //                         onChange={(e) =>
  //                           setFieldValue('remark', e.target.value)
  //                         } // Update Formik value for remark
  //                       />
  //                     </div>
  //                   </Modal.Body>
  //                   <Modal.Footer>
  //                     <Button
  //                       variant="danger"
  //                       onClick={() => setShowModal(false)}
  //                     >
  //                       Cancel
  //                     </Button>
  //                     <Button variant="primary" type="submit">
  //                       Submit
  //                     </Button>
  //                   </Modal.Footer>
  //                 </Modal>
  //               </Form>
  //             );
  //           }}
  //         </Formik>
  //       </Stack>
  //     </Container>
  //   );
  // }

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    filterItemCategoryList,
    itemCategoryList,
    filterCategoryList,
    isLoading: { getItemCategoryList }
  } = useSelector((state) => state?.poCommon);

  console.log('filterItemCategoryList', filterItemCategoryList);

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setRemark(''); // Reset remark field when closing
  };

  const handleRemarkChange = (event) => {
    setRemark(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = {
      item: selectedItems,
      category: selectedCategories,
      remark // Add the remark here
    };

    dispatch(deleteItemCategoryListThunk(formData));
    // Process formData here, e.g., dispatch an action or call an API
    console.log('Form Data:', formData);
    handleClose(); // Close modal after submit
  };

  const loadData = () => {
    dispatch(getItemCategoryListThunk());
  };

  const columns = [
    {
      name: 'Sr No.',
      //   selector: (row, index) =>
      //     (paginationData.currentPage - 1) * paginationData.rowPerPage +
      //     index +
      //     1,
      sortable: false,
      width: '70px'
    },
    {
      name: 'Item',
      selector: (row) => row?.item ?? '---',
      sortable: false,
      width: '120px'
    },
    {
      name: 'Category',
      selector: (row) => row?.category ?? '---',
      sortable: false,
      width: '200px'
    },

    {
      name: 'Karagir Size Range',
      selector: (row) => row?.size_range ?? '---',
      sortable: true,
      width: '175px'
    },

    // {
    //   name:
    //     filterModalData?.knockoff_karagir === 1
    //       ? 'Karagir Wt Range'
    //       : 'Knock Off Wt Range',
    //   selector: (row) =>
    //     filterModalData?.knockoff_karagir === 1
    //       ? row?.karagir_wt_range ?? '---'
    //       : row?.knockoff_wt_range ?? '---',
    //   sortable: true,
    //   width: '175px'
    // },
    {
      name: 'Exact Weight',
      selector: (row) => row?.exact_wt ?? '---',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Open Pieces ',
      selector: (row) => row?.open_qty ?? '---',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Purity Range',
      selector: (row) => row?.purity_range ?? '---',
      sortable: true,
      width: '140px'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by,
      sortable: true,
      width: '150px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at,
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by,
      sortable: true,
      width: '150px'
    }
  ];

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const filteredCategories = itemCategoryList
    ?.filter((d) => selectedItems?.includes(d.item)) // Filter categories based on selected items
    ?.map((d) => ({ value: d.id, label: d.category }));

  return (
    <Container fluid className="po_vender_export_container">
      <h3 className="fw-bold text_primary">Delete Requisition</h3>
      <Stack gap={3}>
        <Row className="align-items-md-end row_gap_3">
          {/* Multi-select dropdown for Item */}
          <Col sm={6} md={4} lg={3}>
            <label className="form-label font-weight-bold">Item:</label>
            <Select
              isMulti
              options={filterItemCategoryList} // Ensure this has { value, label } format
              value={filterItemCategoryList.filter((option) =>
                selectedItems.includes(option.label)
              )}
              onChange={(selected) =>
                setSelectedItems(selected.map((s) => s.label))
              }
            />
          </Col>

          {/* Multi-select dropdown for Category */}
          <Col sm={6} md={4} lg={3}>
            <label className="form-label font-weight-bold">Category:</label>
            <Select
              isMulti
              options={filteredCategories} // Show only categories related to selected items
              value={filteredCategories.filter((option) =>
                selectedCategories.includes(option.label)
              )}
              onChange={(selected) =>
                setSelectedCategories(selected.map((s) => s.label))
              }
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={handleDeleteClick} // Open modal on delete click
            >
              Delete
            </button>
            <button type="button" className="btn btn-danger">
              Export
            </button>
          </Col>
        </Row>

        {/* Modal for delete confirmation and remark input */}
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-12">
              <label className="form-label font-weight-bold">Remark:</label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="remark"
                name="remark"
                maxLength={50}
                value={remark} // Use state value for remark
                onChange={handleRemarkChange} // Update state value for remark
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Modal.Footer>
        </Modal>

        <DataTable
          columns={columns}
          data={itemCategoryList?.data}
          progressPending={itemCategoryList}
          progressComponent={<TableLoadingSkelton />}
          pagination
          paginationServer
          paginationTotalRows={itemCategoryList?.total?.total_count}
          // paginationDefaultPage={paginationData.currentPage}
          // onChangePage={(page) => setPaginationData({ currentPage: page })}
          // onChangeRowsPerPage={(newPageSize) => {
          //   setPaginationData({ rowPerPage: newPageSize });
          //   setPaginationData({ currentPage: 1 });
          // }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 200]}
        />
      </Stack>
    </Container>
  );
}
