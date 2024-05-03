import React, { useState, useEffect } from "react";
import TestCaseService from "../../../services/ConnectorService/TestCaseService";
import { _base } from "../../../settings/constants";
import { useNavigate } from "react-router-dom";

import DataTable from "react-data-table-component";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";
import { getCurrentDate } from "../../../components/Utilities/Functions";
import { UserDropdown } from "../../Masters/UserMaster/UserComponent";

function TestCase({ match }) {
  const history = useNavigate();
  const currentDate = getCurrentDate();

  const fileName = "Testcases_Ticket";

  const [testCase, setTestCase] = useState();

  const [data, setData] = useState(null);

  var submodule_id = "";
  var module_id = "";
  if (match.params.module_id) {
    module_id = match.params.module_id;
  }
  if (match.params.submodule_id) {
    submodule_id = match.params.submodule_id;
  }

  const get = () => {
    const tempData = [];
    // axios
    //   .get("http://15.207.120.175/TicketServiceDevelopment/public/api/testcase/"+module_id+"/"+submodule_id)
    new TestCaseService()
      .getTestcase(module_id, submodule_id)
      .then(function (res) {
        if (res.status === 200) {
          let counter = 1;
          const data = res.data.data;
          for (const key in data) {
            tempData.push({
              counter: counter++,
              id: data[key].id,
              tc_id: data[key].tc_id,
              t_id: data[key].t_id,
              description: data[key].description,
              testing_type: data[key].testing_type,
              test_case_group: data[key].test_case_group,
              module: data[key].module,
              submodule: data[key].submodule,
              screenshot_path: data[key].screenshot_path,
              expected_result: data[key].expected_result,
              actual_result: data[key].actual_result,
              status: data[key].status,
              priority: data[key].priority,
              severity: data[key].severity,
              tester_remark: data[key].tester_remark,
              developer_remark: data[key].developer_remark,
              ba_remark: data[key].ba_remark,
              testcase_created_at: data[key].created_at,
              testcase_created_by: data[key].created_by,
              version: data[key].version,
              ticket_id: data[key].ticket_id,
              project_name: data[key].project_name,
              pre_condition: data[key].pre_condition,
              dependencies: data[key].dependencies,
              testing_server: data[key].testing_server,
              testing_deadline: data[key].testing_deadline,
              project_go_live: data[key].project_go_live,              
            });
          }
          setData(tempData);
        }
      });
  };

  const columns = [
    { name: "Sr", selector: (row) => row.counter, sortable: true },
    { name: "TC_ID", selector: (row) => 'TC_'+row.tc_id, sortable: true },
    { name: "t_id", selector: (row) => row.t_id, sortable: true },
    {
      name: "Test description",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Testing Type",
      selector: (row) => row.testing_type,
      sortable: true,
    },
    {
      name: "Test Case Group",
      selector: (row) => row.test_case_group,
      sortable: true,
    },
    { name: "Module", selector: (row) => row.module, sortable: true },
    { name: "Sub Module", selector: (row) => row.submodule, sortable: true },
    {
      name: "Screenshot path",
      selector: (row) => row.screenshot_path,
      sortable: true,
    },
    {
      name: "Expected Result",
      selector: (row) => row.expected_result,
      sortable: true,
    },
    {
      name: "Actual Result",
      selector: (row) => row.actual_result,
      sortable: true,
    },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Priority", selector: (row) => row.priority, sortable: true },
    { name: "Severity", selector: (row) => row.severity, sortable: true },
    {
      name: "Tester remark",
      selector: (row) => row.tester_remark,
      sortable: true,
    },
    {
      name: "Developer remark",
      selector: (row) => row.developer_remark,
      sortable: true,
    },
    { name: "BA Remark", selector: (row) => row.ba_remark, sortable: true },
    {
      name: "Created At",
      selector: (row) => row.testcase_created_at,
      sortable: true,
    },
    {
      name: "Created By",
      selector: (row) => row.testcase_created_by,
      sortable: true,
    },
    { name: "Version", selector: (row) => row.version, sortable: true },
    { name: "Remark", selector: (row) => row.remark, sortable: true },
    {
      name: "Action",
      width: "auto",
      button: true,
      ignoreRowClick: true,
      allowOverflow: true,
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <button
            type="Link"
            url={`/${_base}/TestCase/Edit/` + row.id}
            buttonColor="primary"
            textColor="white"
            icon={{ type: "Edit", color: "white", size: "15px" }}
          ></button>

          <button
            type="button"
            className="btn btn-sm btn-danger text-white"
            onClick={handleDelete(row.t_id)}
          >
            <i
              className="icofont-ui-delete text-white"
              style={{ fontSize: "15px" }}
            ></i>
          </button>
        </div>
      ),
    },
  ];

  const [inputList, setInputList] = useState([
    {
      description: "",
      screenshot_path: "",
      expected_result: "",
      actual_result: "",
      status: "",
      tester_remark: "",
      developer_remark: "",
      ba_remark: "",
      remark: "",
    },
  ]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle input change
  const changeHandler = (e, index) => {
    const { name, value } = e.target;
    // const listTC = [...testCase];
    // listTC[index][name] = value;
    // setTestCase(list);
    setTestCase((values) => ({ ...values, [name]: value }));
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, {}]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
   
    new TestCaseService()
      .postTestcase(module_id, submodule_id, data)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status == 1) {
            document.getElementById("create-course-form").reset();
            history({
              pathname: `/${_base}/TestCase/${module_id}/${submodule_id}`,
            });
          } else {
          }
        }
      });
  };

  const handleDelete = (id) => (e) => {
    const data = new FormData();
    data.append("is_active", "0");
    new TestCaseService()
      .deleteTestcase(id)
      .then((res) => {
    
       
      });
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <div className="body d-flex py-3">
      <div className="container-xxl">
        <div className="row clearfix g-3">
          <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
            <div className="card">
              <div
                className="card-header d-flex justify-content-between bg-transparent 
                              border-bottom-0"
              >
                <h2 className="mb-0 fw-bold ">Add TestCase</h2>
              </div>
            </div>
            <form onSubmit={submitHandler} id="create-course-form" method="post" enctype='multipart/form-data'>
              <div className="card mt-2">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Testing Type :</b>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        id="testing_type"
                        name="testing_type"
                        required={true}
                        onChange={changeHandler}
                      >
                        <option value="">Select Type</option>
                        <option value="UI/UX">UI / UX</option>
                        <option value="functional">Functional</option>
                        <option value="non_functional">Non Functional</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Test Case Group :</b>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        id="test_case_group"
                        name="test_case_group"
                        required={true}
                        onChange={changeHandler}
                      >
                        <option value="">Select Case Group</option>
                        <option value="Smoke">Smoke</option>
                        <option value="Sanity">Sanity</option>
                        <option value="Regration">Regration</option>
                      </select>
                      {/* <input
                        type="text"
                        className="form-control form-control-sm"
                        name="test_case_group"
                        onChange={changeHandler}
                      /> */}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Module :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="module"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Sub Module :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="submodule"
                        onChange={changeHandler}
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Ticket Id :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="ticket_id"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Project Name :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="project_name"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Pre Condition :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="pre_condition"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Dependencies :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="dependencies"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Testing Server :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="testing_server"
                        onChange={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Deadline :</b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="testing_deadline"
                        name="testing_deadline"
                        // defaultValue={ticketData.ticket_date}
                        // min={ticketData.ticket_date}
                        onChange={changeHandler}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Go Live:</b>
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        id="project_go_live"
                        name="project_go_live"
                        // defaultValue={ticketData.ticket_date}
                        // min={ticketData.ticket_date}
                        onChange={changeHandler}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Priority :</b>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        id="priority"
                        name="priority"
                        required={true}
                        onChange={changeHandler}
                      >
                        <option value="">Select Priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Severity :</b>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        id="severity"
                        name="severity"
                        required={true}
                        onChange={changeHandler}
                      >
                        <option value="">Select Severity</option>
                        <option value="Critical">Critical</option>
                        <option value="Major">Major</option>
                        <option value="Minor">Minor</option>
                        <option value="Low">Low</option>
                      </select>
                      {/* <input
                        type="text"
                        className="form-control form-control-sm"
                        name="severity"
                        onChange={changeHandler}
                      /> */}
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Test Case Created When :</b>
                      </label>
                      <input type="date"
                      className="form-control form-control-sm"
                        id="created_at"
                        name="created_at"
                        defaultValue={currentDate}
                        readOnly={true}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Testcase Created By :</b>
                      </label>
                      <UserDropdown
                        id="created_by"
                        name="created_by"
                        required
                        getChangeValue={changeHandler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label htmlFor="" className="">
                        <b>Version :</b>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        name="version"
                        onChange={changeHandler}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-2">
                <div className="card-body row">
                  {inputList.map((x, i) => {
                    return (
                      <div className="row" key={i}>
                        <div className="col-sm-6">
                          <div className="col-md-12">
                            <label htmlFor="" className="">
                              <b>Test description :</b>
                            </label>
                            <textarea className="form-control form-control-sm" rows="4" id="description"
                              name="description[]"
                              required
                              getInputValue={handleInputChange}>                              
                              </textarea>
                            {/* <input
                              type="text"
                              className="form-control form-control-sm"
                              name="description[]"
                              onChange={(e) => handleInputChange(e, i)}
                              defaultValue={x.description}
                            /> */}
                          </div>
                        </div>
                        <div className="col-sm-6 row">
                          <div className="col-md-6">
                            <label htmlFor="" className="">
                              <b>Screenshot path :</b>
                            </label>
                            <input type="file"
                                id="screenshot_path"
                                name="screenshot_path[]"
                                onChange={(e) => handleInputChange(e, i)}
                                multiple
                            />
                            {/* <input
                              type="text"
                              className="form-control form-control-sm"
                              name="screenshot_path[]"
                              onChange={(e) => handleInputChange(e, i)}
                              defaultValue={x.screenshot_path}
                            /> */}
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="" className="">
                              <b>Expected Result :</b>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="expected_result[]"
                              onChange={(e) => handleInputChange(e, i)}
                              defaultValue={x.expected_result}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="" className="">
                              <b>Actual Result :</b>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              name="actual_result[]"
                              onChange={(e) => handleInputChange(e, i)}
                              defaultValue={x.actual_result}
                            />
                          </div>
                          <div className="col-md-6">
                            <label htmlFor="" className="">
                              <b>Status :</b>
                            </label>
                            <select
                              className="form-control form-control-sm"
                              id="status"
                              name="status[]"
                              required={true}
                              onChange={(e) => handleInputChange(e, i)}
                            >
                              <option value="">Select Status</option>
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                              <option value="Partial Fail">Partial Fail</option>
                              <option value="Pending">Pending</option>
                            </select>
                            {/* <input
                              type="text"
                              className="form-control form-control-sm"
                              name="status[]"
                              onChange={(e) => handleInputChange(e, i)}
                              defaultValue={x.status}
                            /> */}
                          </div>
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="" className="">
                            <b>Remark :</b>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            name="remark[]"
                            onChange={(e) => handleInputChange(e, i)}
                            defaultValue={x.remark}
                          />
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="" className="">
                            <b>Tester remark :</b>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            id="tester_remark"
                            name="tester_remark[]"
                            required={true}
                            onChange={(e) => handleInputChange(e, i)}
                          >
                            <option value="">Select Remark</option>
                            <option value="Close">Close</option>
                            <option value="Pending">Pending</option>
                            <option value="Reopen">Reopen</option>
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="" className="">
                            <b>Developer remark :</b>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            id="developer_remark"
                            name="developer_remark[]"
                            required={true}
                            onChange={(e) => handleInputChange(e, i)}
                          >
                            <option value="">Select Remark</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Not a bug">Not a bug</option>
                            <option value="Deffered">Deffered</option>
                            <option value="In progress">In progress</option>
                          </select>
                          {/* <input
                            type="text"
                            className="form-control form-control-sm"
                            name="developer_remark[]"
                            onChange={(e) => handleInputChange(e, i)}
                            defaultValue={x.developer_remark}
                          /> */}
                        </div>
                        <div className="col-md-3">
                          <label htmlFor="" className="">
                            <b>BA Remark :</b>
                          </label>
                          <select
                            className="form-control form-control-sm"
                            id="ba_remark"
                            name="ba_remark[]"
                            required={true}
                            onChange={(e) => handleInputChange(e, i)}
                          >
                            <option value="">Select Remark</option>
                            <option value="Resolved">Closed</option>
                            <option value="Not a bug">Reopen</option>
                            <option value="Deffered">Deffered</option>
                          </select>
                          {/* <input
                            type="text"
                            className="form-control form-control-sm"
                            name="ba_remark[]"
                            onChange={(e) => handleInputChange(e, i)}
                            defaultValue={x.ba_remark}
                          /> */}
                        </div>
                        <div className="btn-box">
                          {inputList.length !== 1 && (
                            <button
                              className="mr10 mr-1 btn btn-danger"
                              onClick={() => handleRemoveClick(i)}
                            >
                              Remove row
                            </button>
                          )}
                          {inputList.length - 1 === i && (
                            <button
                              onClick={handleAddClick}
                              className="btn btn-primary"
                            >
                              Add new row
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="col-md-2">
                    <button
                      className="btn btn-sm btn-warning mt-4"
                      type="submit"
                      style={{ margiTop: `20px` }}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="card mt-2">
              <div className="card-body">
                <ExportToExcel
                  className="btn btn-sm btn-danger"
                  apiData={data}
                  fileName={fileName}
                />
                {data && <DataTable
                                columns={columns}
                                data={data}
                                defaultSortField="title"
                                pagination
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                            />
                            }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestCase;
