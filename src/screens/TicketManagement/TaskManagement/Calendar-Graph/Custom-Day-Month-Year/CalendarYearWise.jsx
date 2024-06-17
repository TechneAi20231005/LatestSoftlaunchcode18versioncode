import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SprintService from '../../../../../services/TicketService/SprintService';
import { useParams } from 'react-router-dom';

export const CalendarYearWise = (props) => {
  const { firstDate, lastDate } = props;
  const params = useParams();
  const { id: ticketId } = params;
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [notify, setNotify] = useState({});

  const localizer = momentLocalizer(moment);
  const taskStatus = [
    { id: 1, statusName: 'TO_DO', color: '#C3F5FF' },
    { id: 2, statusName: 'IN_PROGRESS', color: '#FFECB3' },
    { id: 3, statusName: 'COMPLETED', color: '#9EFFB9' },
    { id: 4, statusName: 'Delay', color: '#C3F5FF' },
    { id: 5, statusName: 'Min_Delay', color: '#FFC581' },
    { id: 6, statusName: 'Max_Delay', color: '#484C7F' }
  ];
  const frameStructureForCalendar = async () => {
    const formatDate = (dates) => {
      const date = new Date(dates);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    try {
      const res = await new SprintService().getSprintCalendarDataForWeek(
        ticketId,
        formatDate(firstDate),
        formatDate(lastDate)
      );
      const { status, data } = res?.data;

      if (status === 1) {
        const yearData = data;
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
                  taskStartDate: taskDataItem?.task_start_Date,
                  taskEndDate: taskDataItem?.task_end_date,
                  basketName: taskDataItem?.basket_name,
                  taskName: taskDataItem?.task_name,
                  totalScheduledHours:
                    taskDataItem?.actual_task_scheduled_Hours,
                  scheduledHours: taskDataItem?.task_scheduled_Hours,
                  actualWorked: taskDataItem?.task_actual_worked,
                  priority: taskDataItem?.task_priority,
                  actualStatus: taskDataItem?.task_status,
                  taskOwners: taskDataItem?.taskOwners
                };
                newCalendarEvents.push(newEvent);
              }
            }
          }
        }

        setCalendarEvent((prevState) => [...prevState, ...newCalendarEvents]);
      } else {
        setNotify({ type: 'danger', message: res?.data?.message });
      }
    } catch (err) {
      setNotify({ type: 'danger', message: err });
    }
  };

  const eventPropGetter = (event) => {
    const statusColors = {
      TO_DO: '#C3F5FF',
      IN_PROGRESS: '#FFECB3',
      COMPLETED: '#9EFFB9',
      Delay: '#C3F5FF',
      Min_Delay: '#FFC581',
      Max_Delay: '#484C7F'
    };

    const backgroundColor = statusColors[event?.actualStatus] || '';

    return {
      style: {
        backgroundColor
      }
    };
  };

  const tooltipAccessor = (event) => {
    const {
      taskName,
      scheduledHours,
      basketName,
      taskStartDate,
      taskEndDate,
      actualWorked,
      actualStatus,
      taskOwners,
      totalScheduledHours
    } = event;
    const users = taskOwners.join(',');
    const tooltipText = `Sprint Name: ${
      event.title
    }\nTask Name: ${taskName}\nBasket Name: ${basketName}\nStart Date:${taskStartDate}\nEnd Date:${taskEndDate}\nTotal Scheduled hours:${totalScheduledHours}\nScheduled Hours: ${scheduledHours}\nActual Worked: ${
      actualWorked ? actualWorked : '00:00:00'
    }\nStatus:${actualStatus}\nTask Owners:${users}`;
    return tooltipText;
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate('prev');
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate('next');
    };

    return (
      <div className="custom-toolbar my-1 col-12 col-md-6 d-flex align-items-center">
        <button onClick={goToBack} className="btn col-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <rect
              width="22.9927"
              height="22.9927"
              rx="11.4964"
              transform="matrix(1 0 0 -1 0 22.9963)"
              fill="#484C7F"
            />
            <path
              d="M14.8838 5.40916C15.0634 5.58882 15.1643 5.83245 15.1643 6.08649C15.1643 6.34052 15.0634 6.58416 14.8838 6.76381L10.1416 11.5061L14.8838 16.2483C15.0583 16.429 15.1549 16.671 15.1527 16.9222C15.1505 17.1734 15.0498 17.4137 14.8722 17.5913C14.6945 17.7689 14.4542 17.8697 14.203 17.8719C13.9519 17.874 13.7099 17.7775 13.5292 17.603L8.1096 12.1834C7.93 12.0037 7.8291 11.7601 7.8291 11.5061C7.8291 11.252 7.93 11.0084 8.1096 10.8287L13.5292 5.40916C13.7088 5.22956 13.9525 5.12866 14.2065 5.12866C14.4605 5.12866 14.7042 5.22956 14.8838 5.40916Z"
              fill="white"
            />
          </svg>
        </button>
        <span className="col-6 text-center">{toolbar.label}</span>
        <button onClick={goToNext} className="col-3 btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 23 23"
          >
            <rect
              width="22.9927"
              height="22.9927"
              rx="11.4964"
              transform="matrix(1 0 0 -1 -0.00732422 22.9963)"
              fill="#484C7F"
            />
            <path
              d="M8.86813 17.5911C8.68853 17.4114 8.58763 17.1678 8.58763 16.9138C8.58763 16.6597 8.68853 16.4161 8.86813 16.2364L13.6104 11.4942L8.86813 6.75194C8.69362 6.57125 8.59705 6.32925 8.59924 6.07806C8.60142 5.82687 8.70217 5.58658 8.8798 5.40896C9.05743 5.23133 9.29771 5.13058 9.5489 5.12839C9.8001 5.12621 10.0421 5.22277 10.2228 5.39729L15.6424 10.8169C15.822 10.9965 15.9229 11.2402 15.9229 11.4942C15.9229 11.7482 15.822 11.9919 15.6424 12.1715L10.2228 17.5911C10.0431 17.7707 9.79949 17.8716 9.54546 17.8716C9.29142 17.8716 9.04779 17.7707 8.86813 17.5911Z"
              fill="white"
            />
          </svg>
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
        views={['month']}
        components={{
          // eventWrapper: CustomTooltip,
          toolbar: CustomToolbar
        }}
      />
    </div>
  );
};
