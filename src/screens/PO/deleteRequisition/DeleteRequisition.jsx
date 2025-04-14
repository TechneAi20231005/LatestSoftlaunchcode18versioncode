import React, { useEffect, useReducer, useState } from 'react';
import { Button, Col, Container, Modal, Row, Stack } from 'react-bootstrap';

import Select from 'react-select';
import {
  deleteItemCategoryListThunk,
  getDeleteRecordsThunk,
  getExportDeleteRecordsThunk,
  getItemCategoryListThunk
} from '../../../redux/services/po/common';
import { useDispatch, useSelector } from 'react-redux';
import TableLoadingSkelton from '../../../components/custom/loader/TableLoadingSkelton';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import { ExportToExcel } from '../../../components/Utilities/Table/ExportToExcel';
import { Astrick } from '../../../components/Utilities/Style';

export default function DeleteRequisition() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const {
    filterItemCategoryList,
    itemCategoryList,
    DeleteRecordsList,
    exportDeletedRecordsList,
    isLoading: { getDeleteRecordsList }
  } = useSelector((state) => state?.poCommon);

  const [paginationData, setPaginationData] = useReducer(
    (prevState, nextState) => {
      return { ...prevState, ...nextState };
    },
    { rowPerPage: 10, currentPage: 1, currentFilterData: {} }
  );

  const filteredCategories = itemCategoryList
    ?.filter((d) => selectedItems?.includes(d.item))
    ?.map((d) => ({ value: d.id, label: d.category }));

  const loadData = () => {
    dispatch(getItemCategoryListThunk());
    dispatch(
      getDeleteRecordsThunk({
        limit: paginationData.rowPerPage,
        page: paginationData.currentPage
      })
    );
    dispatch(getExportDeleteRecordsThunk());
  };

  const handleDeleteClick = () => {
    if (selectedItems?.length === 0) {
      toast?.error('Please select at least one item before deleting.', {
        position: 'top-right',
        autoClose: 3000
      });
      return;
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setRemark('');
  };

  const handleRemarkChange = (event) => {
    setRemark(event?.target?.value);
    setError('');
  };

  const handleSubmit = async () => {
    if (remark === '') {
      setError('remark is required');
    } else {
      const formData = {
        item: selectedItems,
        category: selectedCategories,
        remark: remark
      };

      dispatch(deleteItemCategoryListThunk(formData)).then((response) => {
        if (response?.payload?.data?.status === 1) {
          dispatch(
            getDeleteRecordsThunk({
              limit: paginationData?.rowPerPage,
              page: paginationData?.currentPage
            })
          );
          dispatch(getExportDeleteRecordsThunk());
          setSelectedItems([]);
          setSelectedCategories([]);
          handleClose();
        }
      });
    }
  };

  const columns = [
    {
      name: 'Sr No.',
      selector: (row, index) =>
        (paginationData.currentPage - 1) * paginationData.rowPerPage +
        index +
        1,
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
      name: 'Exact Weight',
      selector: (row) => row?.exact_wt ?? '---',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Weight Range',
      selector: (row) => row?.weight_range ?? '---',
      sortable: true,
      width: '120px'
    },
    {
      name: 'Size Range',
      selector: (row) => row?.size_range ?? '---',
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
      name: 'Karagir Weight Range',
      selector: (row) => row?.karagir_wt_range ?? '---',
      sortable: true,
      width: '175px'
    },
    {
      name: 'Karagir Off Weight Range',
      selector: (row) => row?.knockoff_wt_range ?? '---',
      sortable: true,
      width: '175px'
    },

    {
      name: 'Karagir Size Range',
      selector: (row) => row?.karagir_size_range ?? '---',
      sortable: true,
      width: '175px'
    },

    {
      name: 'Created At',
      selector: (row) => row.created_at ?? '---',
      sortable: true,
      width: '175px'
    },
    {
      name: 'Created By',
      selector: (row) => row.created_by_name ?? '---',
      sortable: true,
      width: '150px'
    },
    {
      name: 'Updated At',
      selector: (row) => row.updated_at ?? '---',
      sortable: true,
      width: '175px'
    },
    {
      name: 'Updated By',
      selector: (row) => row.updated_by_name ?? '---',
      sortable: true,
      width: '150px'
    }
  ];

  useEffect(() => {
    loadData();
  }, [dispatch, paginationData]);

  return (
    <Container fluid className="po_vender_export_container">
      <h3 className="fw-bold text_primary">Delete Requisition</h3>
      <Stack gap={3}>
        <Row className="align-items-md-end row_gap_3">
          <Col sm={6} md={4} lg={3}>
            <label className="form-label font-weight-bold">Item:</label>
            <Select
              classNamePrefix="react-select"
              isMulti
              options={filterItemCategoryList}
              value={filterItemCategoryList.filter((option) =>
                selectedItems?.includes(option?.label)
              )}
              onChange={(selected) =>
                setSelectedItems(selected.map((s) => s?.label))
              }
            />
          </Col>

          <Col sm={6} md={4} lg={3}>
            <label className="form-label font-weight-bold">Category:</label>
            <Select
              classNamePrefix="react-select"
              isMulti
              options={filteredCategories}
              value={filteredCategories?.filter((option) =>
                selectedCategories?.includes(option?.label)
              )}
              onChange={(selected) =>
                setSelectedCategories(selected?.map((s) => s?.label))
              }
            />
          </Col>

          <Col className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-sm btn-danger mt-3 w-25"
              onClick={handleDeleteClick}
              disabled={selectedItems?.length === 0}
            >
              Delete
            </button>

            {DeleteRecordsList?.data?.length > 0 && (
              <ExportToExcel
                className="btn btn-sm btn-info mt-3 w-25 me-2 mx-2"
                apiData={exportDeletedRecordsList}
                fileName="Delete Requisition Records"
              />
            )}
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-sm-12">
              <label className="form-label font-weight-bold">
                Remark <Astrick color="red" />:
              </label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="remark"
                name="remark"
                maxLength={50}
                value={remark}
                onChange={handleRemarkChange}
              />
              {error && (
                <small
                  style={{
                    color: 'red'
                  }}
                >
                  {error}
                </small>
              )}
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
          data={DeleteRecordsList?.data}
          progressPending={getDeleteRecordsList}
          progressComponent={<TableLoadingSkelton />}
          pagination
          paginationServer
          paginationTotalRows={DeleteRecordsList?.total}
          paginationDefaultPage={paginationData?.currentPage}
          onChangePage={(page) => setPaginationData({ currentPage: page })}
          onChangeRowsPerPage={(newPageSize) => {
            setPaginationData({ rowPerPage: newPageSize });
            setPaginationData({ currentPage: 1 });
          }}
          paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 200]}
        />
      </Stack>
    </Container>
  );
}
