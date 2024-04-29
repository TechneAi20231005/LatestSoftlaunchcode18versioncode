import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import SprintService from "../../../../../services/TicketService/SprintService";
import { useParams } from "react-router-dom";
import CustomTooltip from "./CustomTooltip";

export const CalendarYearWise = (props) => {
  const { yearData } = props;
  console.log("data", yearData);
  const params = useParams();
  const { id: ticketId } = params;
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [notify, setNotify] = useState({});
  const localizer = momentLocalizer(moment);
  const taskStatus = [
    { id: 1, statusName: "TO_DO", color: "#C3F5FF" },
    { id: 2, statusName: "IN_PROGRESS", color: "#FFECB3" },
    { id: 3, statusName: "COMPLETED", color: "#9EFFB9" },
    { id: 4, statusName: "Delay", color: "#C3F5FF" },
    { id: 5, statusName: "Min_Delay", color: "#FFC581" },
    { id: 6, statusName: "Max_Delay", color: "#484C7F" },
  ];
  const frameStructureForCalendar = () => {
    setCalendarEvent([]);
    const newCalendarEvents = [];
    for (let i = 0; i < yearData?.length; i++) {
      const yearItem = yearData[i];
      if (yearItem?.task_data?.length > 0) {
        for (let j = 0; j < yearItem.task_data.length; j++) {
          const taskDataItem = yearItem.task_data[j];
          if (Object.keys(taskDataItem).length > 0) {
            const newEvent = {
              title: taskDataItem.sprint_name,
              start: yearItem.date,
              end: yearItem.date,
              basketName: taskDataItem?.basket_name,
              taskName: taskDataItem?.task_name,
              scheduledHours: taskDataItem?.task_scheduled_Hours,
              actualWorked: taskDataItem?.task_actual_worked,
              priority: taskDataItem?.task_priority,
              actualStatus: taskDataItem?.task_status,
            };
            newCalendarEvents.push(newEvent);
          }
        }
      }
    }
    setCalendarEvent((prevState) => [...prevState, ...newCalendarEvents]);
  };

  const eventPropGetter = (event) => {
    const statusColors = {
      TO_DO: "#C3F5FF",
      IN_PROGRESS: "#FFECB3",
      COMPLETED: "#9EFFB9",
      Delay: "#C3F5FF",
      Min_Delay: "#FFC581",
      Max_Delay: "#484C7F",
    };

    const backgroundColor = statusColors[event?.actualStatus] || "";

    return {
      style: {
        backgroundColor,
      },
    };
  };

  const tooltipAccessor = (event) => {
    const {
      taskName,
      scheduledHours,
      basketName,
      start,
      end,
      actualWorked,
      actualStatus,
    } = event;
    const tooltipText = `Sprint Name: ${
      event.title
    }\nTask Name: ${taskName}\nBasket Name: ${basketName}\nStart Date:${start}\nEnd Date:${end}\nScheduled Hours: ${scheduledHours}\nActual Worked: ${
      actualWorked ? actualWorked : "00:00:00"
    }\nStatus:${actualStatus}`;
    return tooltipText;
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate("prev");
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate("next");
    };

    return (
      <div className="custom-toolbar">
        <button onClick={goToBack}>
          <span className="btn">
            <i className="icofont-arrow-last "></i>
          </span>
        </button>
        <span>{toolbar.label}</span>
        <button onClick={goToNext}>
          <span>
            <i className="icofont-arrow-last"></i>
          </span>
        </button>
      </div>
    );
  };

  useEffect(() => {
    frameStructureForCalendar();
  }, []);

  return (
    <div className="myCustomHeight mt-2">
      <Calendar
        localizer={localizer}
        events={calendarEvent}
        startAccessor="start"
        endAccessor="end"
        popup={true}
        // showAllEvents={true}
        eventPropGetter={(event) => eventPropGetter(event)}
        tooltipAccessor={(event) => tooltipAccessor(event)}
        views={["month"]}
        components={{
          // eventWrapper: CustomTooltip,
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};
