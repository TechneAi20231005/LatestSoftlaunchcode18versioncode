import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const CalendarYearWise = () => {
  const localizer = momentLocalizer(moment);
  return (
    <div className="myCustomHeight">
      <Calendar
        localizer={localizer}
        // events={myEventsList}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};
