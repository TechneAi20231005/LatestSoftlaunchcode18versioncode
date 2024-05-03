import React, { useEffect, useState } from "react";
import "./custom-style.css";
import SprintService from "../../../../../services/TicketService/SprintService";
const WeekwiseCalendar = (props) => {
  const { daysOfWeek, data, bgColor, firstDate, lastDate } = props;

  const [tooltipContent, setTooltipContent] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getFormattedDate = (dates) => {
    const date = new Date(dates);
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      date: date.getDate(),
    };
  };

  const handleMouseEnter = (event, data) => {
    console.log("mouse enter", data);
    const {
      task_name,
      task_scheduled_Hours,
      sprint_name,
      basket_name,
      task_start_Date,
      task_end_date,
      task_actual_worked,
      task_actual_status,
    } = data;
    const tooltipText = `Sprint Name: ${sprint_name}\nTask Name: ${task_name}\nBasket Name: ${basket_name}\nStart Date:${task_start_Date}\nEnd Date:${task_end_date}\nScheduled Hours: ${task_scheduled_Hours}\nActual Worked: ${
      task_actual_worked ? task_actual_worked : "00:00:00"
    }\nStatus:${task_actual_status}`;
    setTooltipContent(tooltipText);

    const tooltip = document.getElementById("custom-tooltip");
    const xPos = event.clientX + 5;
    const yPos = event.clientY - 5;
    setTooltipPosition({ x: xPos, y: yPos });
  };

  const handleMouseLeave = () => {
    setTooltipContent("");

    // tooltip.style.display = "none";
  };

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
              <div className="  border d-flex pb-2 pt-1 mb-1 justify-content-between">
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
                const colorChange =
                  Object.keys(task).length > 0 ? filteredBgColor[0]?.color : "";

                const truncateText = (text) =>
                  text.length > 25 ? `${text.slice(0, 20)}...` : text;
                return (
                  <div
                    className="calendar-card  border ps-2   py-2"
                    style={{ backgroundColor: colorChange }}
                    key={idx}
                    onMouseEnter={(event) => handleMouseEnter(event, task)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {task?.basket_name && (
                      <p className="mb-0 fw-bold">
                        {truncateText(task?.basket_name)}
                      </p>
                    )}
                    {task?.task_name && (
                      <p className="mb-0">{truncateText(task?.task_name)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {tooltipContent && (
        <div
          id="custom-tooltip"
          className="custom-tooltip"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <pre>{tooltipContent}</pre>
        </div>
      )}
    </>
  );
};

export default WeekwiseCalendar;
