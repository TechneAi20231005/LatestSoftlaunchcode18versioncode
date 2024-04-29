import React, { useEffect, useState } from "react";
import "./custom-style.css";
import SprintService from "../../../../../services/TicketService/SprintService";
const WeekwiseCalendar = (props) => {
  const { daysOfWeek, data, bgColor, firstDate, lastDate } = props;

  const [calendarDate, setCalendarData] = useState([]);

  const getFormattedDate = (dates) => {
    const date = new Date(dates);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      date: date.getDate(),
    };
  };

  // useEffect(() => {
  //   new SprintService()
  //     .getSprintCalendarDataForWeek("17664", "2024-04-22", "2024-04-25")
  //     .then((res) => {
  //       console.log("res week wise new data", res);
  //     });
  // }, []);

  return (
    <>
      <div className="d-flex mt-3">
        {data?.map((dataItems, index) => {
          const formatedDate = getFormattedDate(dataItems?.date);
          const taskDataArray = dataItems?.task_data || [];

          while (taskDataArray.length < 6) {
            taskDataArray.push({});
          }
          return (
            <div className="custom-col d-flex flex-column" key={index}>
              <div className="  border d-flex justify-content-between">
                <div className="px-1">
                  <h4 className="mb-0">{formatedDate.date}</h4>
                  <p className="mb-0">{formatedDate.day}</p>
                </div>
                <div className="px-1">
                  <p className="mb-0">{formatedDate.month}</p>
                </div>
              </div>
              {taskDataArray.map((task, idx) => {
                let actualStatus = task?.task_status;
                let filteredBgColor = bgColor?.filter(
                  (bgcolor) => bgcolor?.statusName === actualStatus
                );

                return (
                  <div
                    className="calendar-card  border px-1 py-1"
                    style={{ backgroundColor: filteredBgColor[0]?.color }}
                    key={idx}
                  >
                    {task?.basket_name && (
                      <p className="mb-0 fw-bold">{task?.basket_name}</p>
                    )}
                    {task?.task_name && (
                      <p className="mb-0">{task?.task_name}</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default WeekwiseCalendar;
