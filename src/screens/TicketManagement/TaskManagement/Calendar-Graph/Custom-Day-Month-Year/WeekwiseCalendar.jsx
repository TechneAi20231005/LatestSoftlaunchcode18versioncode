import React, { useEffect, useState } from "react";
import "./custom-style.css";
import SprintService from "../../../../../services/TicketService/SprintService";
const WeekwiseCalendar = (props) => {
  const { daysOfWeek, data, bgColor, firstDate, lastDate } = props;
  console.log("daysOfWeek", daysOfWeek);
  console.log("data", data);
  const [calendarDate, setCalendarData] = useState([]);

  // const WeeklyRanges = () => {
  //   const startDate = new Date(firstDate);
  //   const endDate = new Date(lastDate);
  //   const weeklyRanges = [];

  //   const prevSunday = new Date(startDate);
  //   prevSunday.setDate(prevSunday.getDate() - prevSunday.getDay());
  //   const prevMonday = new Date(prevSunday);
  //   prevMonday.setDate(prevMonday.getDate() - 6);

  //   const prevStartFormatted = prevMonday.toLocaleDateString("en-US", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });

  //   const prevEndFormatted = prevSunday.toLocaleDateString("en-US", {
  //     day: "2-digit",
  //     month: "short",
  //     year: "numeric",
  //   });

  //   weeklyRanges.push({
  //     start: prevStartFormatted,
  //     end: prevEndFormatted,
  //   });
  //   let nextSunday = new Date(startDate);
  //   nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));

  //   while (nextSunday <= endDate) {
  //     const nextMonday = new Date(nextSunday);
  //     nextMonday.setDate(nextMonday.getDate() + 6);

  //     const startFormatted = nextSunday.toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     });

  //     const endFormatted = nextMonday.toLocaleDateString("en-US", {
  //       day: "2-digit",
  //       month: "short",
  //       year: "numeric",
  //     });

  //     weeklyRanges.push({
  //       start: startFormatted,
  //       end: endFormatted,
  //     });

  //     nextSunday.setDate(nextSunday.getDate() + 7);
  //   }
  //   console.log("weeklyRanges 1", weeklyRanges);
  //   return weeklyRanges;
  // };
  // const filterTaskAsPerAsSprint = () => {
  //   if (!data) return [];
  //   setCalendarData([]);
  //   let newTaskSprintData = [];
  //   let currentDate = new Date("2023-06-01");
  //   for (let i = 0; i < data?.length; i++) {
  //     for (let j = 0; j < data[i].task_data.length; j++) {
  //       const startDate = new Date(data[i].task_data[j].task_start_Date);
  //       const endDate = new Date(data[i].task_data[j].task_end_date);
  //       if (currentDate >= startDate && currentDate <= endDate) {
  //         const payload = {
  //           sprintName: data[i].name,
  //           basketName: data[i].task_data[j].basket_name,
  //           taskName: data[i].task_data[j].task_name,
  //           scheduledHours: data[i].task_data[j].task_scheduled_Hours,
  //           actualWorked: data[i].task_data[j].task_actual_worked,
  //           priority: data[i].task_data[j].priority,
  //           actualStatus: data[i].task_data[j].task_status,
  //         };
  //         newTaskSprintData.push(payload);
  //         setCalendarData((prevState) => [...prevState, payload]);
  //       }
  //     }
  //   }
  //   return newTaskSprintData;
  // };

  // console.log("newTaskSprintData", filterTaskAsPerAsSprint());
  useEffect(() => {
    new SprintService()
      .getSprintCalendarDataForWeek("17664", "2024-04-22", "2024-04-25")
      .then((res) => {
        console.log("res week wise new data", res);
      });
  }, []);

  return (
    <div
      className="d-flex mt-3
    "
    >
      {daysOfWeek?.map((day) => {
        return (
          <div className="custom-col border border-1">
            <div className="d-flex p-1 justify-content-between">
              <div>
                <h2 className="mb-0">{day?.date}</h2>
                <p className="mb-0">{day.day}</p>
              </div>
              <div>
                <span>{day?.month}</span>
              </div>
            </div>

            {}
          </div>
        );
      })}
    </div>
  );
};

export default WeekwiseCalendar;
