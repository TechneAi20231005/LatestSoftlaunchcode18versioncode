import React, { useState, useEffect,useRef } from "react";
import PageHeader from "../../components/Common/PageHeader";
import { getData } from "../../services/DashboardService";
import { Link } from "react-router-dom";


export default function InsightsCompletedTask() {

  const [count, setCount] = useState();
  const [dailyTask, setDailyTask] = useState();
  const [upcomingTask, setUpcomingTask] = useState();
  const [previousTask, setPreviousTask] = useState();
  const [totalTask, setTotalTask] = useState();
  const [completedTask, setCompletedTask] = useState();

  async function get() {
    await getData(localStorage.getItem("id")).then((res) => {
      if (res.status == 200) {
        setCount(res.data.data.count);
        setDailyTask(res.data.data.dailyTask);
        setPreviousTask(res.data.data.previousTask);
        setUpcomingTask(res.data.data.upcomingTask);
        setTotalTask(res.data.data.totalTask)
        setCompletedTask(res.data.data.completedTask)
      }
    });
  }

  // console.log("p",previousTask.length)

  useEffect(() => {
    get();
  }, []);


  const searchRef = useRef();
  const handleSearch = (e) => {
    const search = searchRef.current.value;
    if (search.length > 0) {
      const temp1 = completedTask.filter((d) => {
console.log("app",completedTask)
        return (d.main_ticket_id ? d.main_ticket_id : "")
          .toLowerCase()
          .match(new RegExp(search.toLowerCase(), "g"));
      });
      setCompletedTask(null)
      setCompletedTask(temp1)
    }
  
    else {
      alert("Please Search Name");
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

    return (



      <div className="container-xxl">
        <PageHeader headerTitle={`Completed Tasks(${completedTask && completedTask.length}) `} />

        <div className="card card-body">
          <div className="row">
            <div className="col-md-9">
              <input
                type="text"
                className="form-control"
                placeholder="Search by User Ticket...."
              ref={searchRef}
              onKeyDown={handleKeyDown}
              />
            </div>
            <div className="col-md-3">
              <button
                className="btn btn-sm btn-warning text-white"
                type="button"
                onClick={handleSearch}
                style={{ marginTop: "0px", fontWeight: "600" }}
              >
                <i className="icofont-search-1 "></i> Search
              </button>
              <button
                className="btn btn-sm btn-info text-white"
                type="button"
                onClick={() => window.location.reload(false)}
                style={{ marginTop: "0px", fontWeight: "600" }}
              >
                <i className="icofont-refresh text-white"></i> Reset
              </button>

            </div>
          </div>
        </div>
        <div className="row" style={{ marginLeft: "4rem" }}>
          {completedTask && completedTask.length > 0 &&
            completedTask.map((ele, index) => {
              return (
                <>
                  <div
                    className="dd-handle mt-2 ms-5"
                    style={{
                      width: "400px",
                      height: "200px",
                      // backgroundColor:'#ff1843',
                      borderRadius: "10px",
                      boxShadow: "8px 8px 18px -6px rgba(89, 89, 89, 1)",
                      justifyContent: 'space-between',
                      marginBottom: "20px" // Added margin-bottom for spacing
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <div className="">
                        <div className="card">
                          <div className="card-body d-flex align-items-center justify-content-between">
                            <div className="flex-fill">
                              <Link to={`Ticket/Task/${ele.ticket_id}`}>
                                <h6 className="fw-bold mb-0" title={ele.task_name} >
                                  {ele.main_ticket_id}-
                                  {ele.task_name.length < 50
                                    ? ele.task_name
                                    : ele.task_name.substring(0, 50) + "...."}
                                </h6>
                              </Link>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4" style={{ color: 'red', position: 'absolute' }}>
                          <span className="fw-bold badge bg-danger p-2">Start Date: {ele.start_date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
        </div>
      </div>

    )
  }


// created by Asmita Margaje

