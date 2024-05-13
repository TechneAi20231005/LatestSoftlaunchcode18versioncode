import React, { useEffect, useState, useRef } from "react";
import { Modal, Spinner, Table } from "react-bootstrap";
import ErrorLogService from "../../../../services/ErrorLogService";
import Alert from "../../../../components/Common/Alert";
import {
  getRegularizationTime,
  changeStatusRegularizationTime,
  getRegularizationTimeHistory,
} from "../../../../services/TicketService/TaskService";
import TableLoadingSkelton from "../../../../components/custom/loader/TableLoadingSkelton";

const TimeRegularizationHistory = (props) => {
  const [notify, setNotify] = useState(null);
  const [data, setData] = useState([]);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const isLoading = props.isLoading;
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef();

  // Function to filter rquestData based on search terms

  const handleClearSearchData = (e) => {
    setSearchTerm(""); // Clear search term by updating state
  };

  const filteredHistoryData = props?.data.filter(
    (i) =>
      i?.ticket_id_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i?.task_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      show={props.show}
      onHide={props.hide}
      dialogClassName="modal-100w"
      size="xl"
      aria-labelledby="example-custom-modal-styling-title"
    >
      {notify && <Alert alertData={notify} />}
      <Modal.Header closeButton>
        <Modal.Title id="example-custom-modal-styling-title">
          Time Regularization History
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="row">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search by Ticket ID or Task Name...."
                onChange={(e) => setSearchTerm(e.target.value)}
                ref={searchRef}
                value={searchTerm}
              />
            </div>
            <div className="col-md-4">
              <button
                className="btn btn-sm btn-warning text-white mr-2"
                type="button"
                style={{ fontWeight: "600" }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={(e) => {
                  handleClearSearchData(e);
                }}
                style={{ fontWeight: "600" }}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>
            </div>
          </div>

          <div className="table-responsive">
            {props.isLoading === true ? (
              <TableLoadingSkelton />
            ) : filteredHistoryData?.length > 0 ? (
              <>
                <table
                  className="table table-bordered mt-3 table-responsive"
                  id="tab_logic"
                >
                  <thead>
                    <tr>
                      <th className="text-center"> Sr. No. </th>

                      <th className="text-center"> Ticket Id </th>
                      <th className="text-center"> Task Name </th>
                      <th className="text-center"> Requested By </th>
                      <th className="text-center"> From Date </th>
                      <th className="text-center"> To Date </th>
                      <th className="text-center"> From Time </th>
                      <th className="text-center"> To Time </th>
                      <th className="text-center"> Actual Time </th>
                      <th className="text-center"> Scheduled Time </th>

                      <th className="text-center"> Remark </th>
                      <th className="text-center"> Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHistoryData &&
                      filteredHistoryData?.map((x, i) => {
                        return (
                          <tr id={`addr_${i}`} key={i}>
                            <td>{i + 1}</td>

                            <td title={x.ticket_id_name}>{x.ticket_id_name}</td>
                            <td title={x.task_name}>{x.task_name}</td>
                            <td>{x.created_by_name}</td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id={`from_date${i}`}
                                name="from_date[]"
                                value={x.from_date}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id={`to_date${i}`}
                                name="to_date[]"
                                value={x.to_date}
                                required
                                readOnly={true}
                              />
                            </td>

                            <td>
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                id={`from_time${i}`}
                                name="from_time[]"
                                value={x.from_time}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="time"
                                className="form-control form-control-sm"
                                id={`to_time${i}`}
                                name="to_time[]"
                                value={x.to_time}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                style={{ width: "100px" }}
                                id={`actual_time${i}`}
                                name="actual_time[]"
                                value={x.actual_time}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id={`scheduled_time${i}`}
                                name="scheduled_time[]"
                                value={x.scheduled_time}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td title={x.remark}>
                              <input
                                type="text"
                                style={{ width: "100px" }}
                                className="form-control form-control-sm"
                                id={`remark${i}`}
                                name="remark[]"
                                value={x.remark}
                                required
                                readOnly={true}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                id={`status${i}`}
                                name="status[]"
                                style={{ width: "100px" }}
                                value={x.status}
                                required
                                readOnly={true}
                              />
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </>
            ) : (
              <p
                className="text-center opacity-50"
                style={{ fontWeight: "bold", fontSize: 20 }}
              >
                No record found
              </p>
            )}
          </div>
        </>
        {/* )} */}
      </Modal.Body>

      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default TimeRegularizationHistory;
