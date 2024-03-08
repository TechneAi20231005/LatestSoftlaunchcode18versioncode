import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { _base, userSessionData } from "../../settings/constants";
import { Spinner, Modal } from "react-bootstrap";
import Alert from "../../components/Common/Alert";
import { _attachmentUrl } from "../../settings/constants";
import { getAttachment } from "../../services/OtherService/AttachmentService";
import MyTicketService from "../../services/TicketService/MyTicketService";
import ReportService from "../../services/ReportService/ReportService";
import PageHeader from "../../components/Common/PageHeader";
import DatePicker from "react-date-picker";
import StatusCard from "../../components/Ticket/StatusCard";
import Chart from "react-apexcharts";
import CommentsData from "./CommentData";
import ManageMenuService from "../../services/MenuManagementService/ManageMenuService";
import Chatbox from "./NewChatBox";
import Shimmer from "./ShimmerComponent";

export default function ViewTicketComponent({ match }) {
  const history = useNavigate();
  const { id } = useParams();
  const ticketId = id;
  const [notify, setNotify] = useState(null);
  const [rangeBar, SetRangeBar] = useState(null);
  const [showLoaderModal, setShowLoaderModal] = useState(false);
  const [dateValue, setDateValue] = useState(new Date());
  const [data, setData] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [checkRole, setCheckRole] = useState(null);
  const roleId = sessionStorage.getItem("role_id");
  const [isSolved, setIsSolved] = useState(false);
  const [chart, setChart] = useState(null);
  const [allUsers, setAllUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [rows, setRows] = useState();
  const [chartDataa, setChartData] = useState("");
  const [commentData, setCommentData] = useState();

  //   const onAddMention = (e) => {
  //     setIdCount((idCount) => [...idCount, e.id]);
  //   };

  const loadData = async () => {
    await new MyTicketService().getGanttChart(ticketId).then((res) => {
      setChartData(res.data.data["series"]);
    });
    await new MyTicketService().getTicketById(ticketId).then((res) => {
      setRows(res?.data?.data?.dynamic_form);
      setShowLoaderModal(null);

      if (res.status === 200) {
        const data = res?.data?.data;
        if (data.status_id == 3) {
          setIsSolved(true);
        }
        setData(null);
        setData(data);

        new ReportService()
          .getTimeLineReport({ ticket_id: res.data.data.ticket_id })
          .then((res) => {
            if (res.status === 200) {
              // setShowLoaderModal(false)
              const data = res.data.data;
              setChart(null);
              setChart(data);
            }
          });

        // new ReportService()
        // .getTimeLineReportHoursWise({ ticket_id: res.data.data.ticket_id })
        // .then((res) => {
        //   if (res.status === 200) {
        //     // setShowLoaderModal(false)
        //     const data = res.data.data;
        //     // setChart(null);
        //     // setChart(data);
        //   }
        // });

        handleAttachment("GetAttachment", ticketId);
      }
    });

    await new ManageMenuService().getRole(roleId).then((res) => {
      if (res.status === 200) {
        if (res.data.status == 1) {
          const getRoleId = sessionStorage.getItem("role_id");
          setCheckRole(res.data.data.filter((d) => d.role_id == getRoleId));
        }
      }
    });
  };

  const loadComments = async () => {
    setIsLoading(true);
    await new MyTicketService().getComments(ticketId).then((res) => {
      if (res.status === 200) {
        setCommentData(res.data.data);
        setIsLoading(false);
      }
    });
  };

  const handleAttachment = (type, ticket_id, attachmentId = null) => {
    getAttachment(ticket_id, "TICKET").then((res) => {
      if (res.status === 200) {
        const data = res.data.data;
        const temp = [];
        data.forEach((d) => {
          if (
            userSessionData.account_for === "CUSTOMER" &&
            d.show_to_customer === 1
          ) {
            temp.push(d);
          } else {
            temp.push(d);
          }
        });

        setAttachment(data);
      }
    });
  };

  const [selectedUser, setSelectedUser] = useState("both"); // Initialize the selected user

  const chartOptions = {
    chart: {
      height: 400,
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true, // display bars evenly distributed along the y-axis
      },
    },
    xaxis: {
      type: "numeric",
      tickAmount: 24,
      min: 0,
      max: 24,
      labels: {
        formatter: (value) => `${value} hr`, // format the x-axis labels to show hours
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      type: "category",
    },
    fill: {
      type: "solid",
      colors: ["#42f486", "#ff8f43"], // specify colors for completed and pending tasks
    },
    // Add other chart options as needed
  };

  const loadCommentsCallback = useCallback(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    loadData();
    loadComments();
    return () => {
      console.log("");
    };
  }, []);

  useEffect(() => {
    if (checkRole && checkRole[15].can_read === 0) {
      // alert("Rushi")

      window.location.href = `${process.env.PUBLIC_URL}/Dashboard`;
    }
  }, [checkRole]);
  return (
    <div className="container-xxl">

      <PageHeader headerTitle={`Ticket - ${data ? data.ticket_id : ""}`} />

      {notify && <Alert alertData={notify} />}

      <div className="row g-3 mt-2">
        <div className="col-xxl-8 col-xl-8 col-lg-12 col-md-12">
          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <StatusCard
                progress={data ? data.status_name : ""}
                progressBg="bg-warning"
                iconClass="icofont-optic fs-4"
                iconbg="bg-lightyellow"
                title="Status"
              />
            </div>

            <div className="col-md-4">
              <StatusCard
                progress={data ? data.created_by_name : ""}
                progressBg="bg-info"
                iconClass="icofont-user fs-4"
                iconbg="bg-lightblue"
                title="Created By"
              />
            </div>

            <div className="col-md-4">
              <StatusCard
                progress={data ? data.created_at : ""}
                progressBg="bg-info"
                iconClass="icofont-user fs-4"
                iconbg="bg-lightblue"
                title="Created At"
              />
            </div>

            <div className="col-md-4">
              <StatusCard
                progress={data ? data.priority : ""}
                progressBg={data?.priority === "High" ? "bg-warning" : data?.priority === "Medium" ? "bg-info" : "bg-success"}
                details=""
                iconClass="icofont-price fs-4"
                iconbg="bg-lightgreen"
                title="Priority"
              />
            </div>
            <div className="col-md-4">
              <StatusCard
                progress={data ? data.passed_status : ""}
                progressBg="bg-success"
                iconClass="icofont-user fs-4"
                iconbg="bg-lightblue"
                title="Passing Status"
              />
            </div>
            {/* <div className="col-md-4">
              <StatusCard
                progress={data ? data.parent_name : ""}
                progressBg="bg-success"
                iconClass="icofont-user fs-4"
                iconbg="bg-lightblue"
                title="Parent Task Type "
              />
            </div> */}

            {/* <div className="col-md-4">
              <StatusCard
                progress={data ? data.type_name : ""}
                progressBg="bg-success"
                iconClass="icofont-user fs-4"
                iconbg="bg-lightblue"
                title="Ticket Type"
              />
            </div> */}
          </div>
        
          {rows && (
            <div className="card mt-2">
              <div className="card-body">
                <div className="row">
                  {rows.map((data, index) => {
                    // console.log("dd",rows)
                    var range = "";
                    return (
                      <div className={`${data.inputWidth} mt-2`}>
                        <label>
                          <b>{data.inputLabel} :</b>
                        </label>
                        {data.inputType === "text" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                  .replace(/ /g, "_")
                                  .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            readOnly
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "textarea" && (
                          <textarea
                            id={
                              data.inputName
                                ? data.inputName
                                  .replace(/ /g, "_")
                                  .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            className="form-control form-control-sm"
                            defaultValue={data.inputDefaultValue}
                          />
                        )}
                        {data.inputType === "date" && (
                          <div className="form-control">
                            <DatePicker
                              // onChange={onChangeDate}
                              value={dateValue}
                              format={data.inputFormat}
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                        {data.inputType === "time" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                  .replace(/ /g, "_")
                                  .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "number" && (
                          <input
                            type={data.inputType}
                            id={
                              data.inputName
                                ? data.inputName
                                  .replace(/ /g, "_")
                                  .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputRange ? range[0] : ""}
                            max={data.inputAddOn.inputRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "decimal" && (
                          <input
                            type="number"
                            id={
                              data.inputName
                                ? data.inputName
                                  .replace(/ /g, "_")
                                  .toLowerCase()
                                : ""
                            }
                            name={data.inputName}
                            defaultValue={data.inputDefaultValue}
                            min={data.inputAddOn.inputRange ? range[0] : ""}
                            max={data.inputAddOn.inputRange ? range[1] : ""}
                            className="form-control form-control-sm"
                          />
                        )}
                        {data.inputType === "select" && (
                          <input
                            type="text"
                            // defaultValue={selectedDropdown ? selectedDropdown[data.inputName] : ""}
                            // defaultValue={data.inputDefaultValue ? data.inputAddOn.inputDataSourceData.filter(d => d.value == data.inputDefaultValue) : ""}
                            defaultValue={data.inputDefaultValue}
                            // options={data.inputAddOn.inputDataSourceData}
                            // id={data.inputName ? data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={data.inputName}
                            // onChange={e => { dynamicDependancyHandle(data.inputName, e, data.inputAddOn.inputOnChangeSource) }}
                            className="form-control form-control-sm"
                            required={data.inputMandatory ? true : false}
                            readOnly
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="row g-3 mb-3 mt-2">
            <div className="col-md-12">
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 text-danger">Description</h6>
                  <p>{data ? data.description : ""}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 ">
            <div className="col-lg-6 col-md-6">
              {/* <AttechedCard data={BugImageAttechedData} /> */}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-12">
              <div className="card mb-3">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 text-danger">Attachments</h6>
                  {/* <Attachment refId={data ? data.id : ""}/> */}
                  {attachment && (
                    <div className="flex-grow-1">
                      {attachment.map((data, i) => {
                        return (
                          <div
                            key={"cuhdus" + i}
                            className=" d-flex align-items-center border-bottom"
                          >
                            <div className="d-flex ms-3 align-items-center flex-fill">
                              <span
                                className={`avatar lg fw-bold  rounded-circle text-center d-flex align-items-center justify-content-center`}
                              >
                                {i + 1}
                              </span>
                              <div className="d-flex flex-column ">
                                <h6 className="fw-bold mb-0 small-14">
                                  {data.name}
                                </h6>
                              </div>
                            </div>
                            <div className="mr-1">
                              <a
                                href={`${_attachmentUrl}${data.path}`}
                                target="_blank"
                                download
                                className="btn btn-primary btn-sm"
                              >
                                <i class="icofont-download"></i> Download
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/*  COL */}

        <div className="col-xxl-4 col-xl-4 col-lg-12 col-md-12">
          {isLoading ? (
            <Shimmer count={10} />
          ) : (
            <Chatbox
              ticketId={ticketId}
              loadComment={loadCommentsCallback}
              commentData={commentData}
              statusName={data}
            />
          )}
        </div>
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="card mb-3">
              <div className="card-body">
                <h6 className="fw-bold mb-3 text-danger">Timeline</h6>

                {/* {chart && (
                  <Chart
                    options={chart.options}
                    series={chart.series}
                    type="rangeBar"
                    height={chart.options.chart.height}
                  />
                
                )} */}

                <div>
                  <div style={{ display: "block", flexDirection: "column" }}>
                    <label className="mx-2">
                      <input
                        className="mx-1"
                        type="radio"
                        value="both"
                        checked={selectedUser === "both"}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      />
                      Both
                    </label>
                    <label className="mx-2">
                      <input
                        className="mx-1"
                        type="radio"
                        value="user1"
                        checked={selectedUser === "user1"}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      />
                      User 1
                    </label>
                    <label className="mx-2">
                      <input
                        className="mx-1"
                        type="radio"
                        value="user2"
                        checked={selectedUser === "user2"}
                        onChange={(e) => setSelectedUser(e.target.value)}
                      />
                      User 2
                    </label>
                  </div>
                  {chartDataa?.data?.length && chartOptions && (
                    <Chart
                      options={chartOptions}
                      data={chartDataa}
                      // series={getTaskSeries()}
                      type="rangeBar"
                      height={chartOptions?.chart?.height}
                    />
                  )}
                </div>

                {/* {console.log("series",chart.series)} */}
                {/* {console.log("chart",chart.options.chart.height)} */}

                {/* <Chart
          width={'700px'}
          height={'410px'}
          chartType="Gantt"
          loader={<div>Loading Chart</div>}
          data={ganttChartData}
          rootProps={{ 'data-testid': '1' }}
        /> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal show={showLoaderModal} centered>
        <Modal.Body className="text-center">
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </Modal.Body>
      </Modal>
    </div>
  );
}
