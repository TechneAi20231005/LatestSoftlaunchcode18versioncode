import React, { useState, useRef, useEffect } from 'react';
import './custom-style.css';
import CalendarSkeleton from './Skeleton/CalendarSkeleton';
import { Tooltip } from 'react-tooltip';
const WeekwiseCalendar = (props) => {
  const { data, bgColor, isLoading } = props;
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  const getFormattedDate = (dates) => {
    const date = new Date(dates);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      month: date.toLocaleDateString('en-US', { month: 'long' }),
      date: date.getDate()
    };
  };

  // const handleMouseEnter = (event, data) => {
  //   if (Object.keys(data).length === 0 && data.constructor === Object) {
  //     return;
  //   }
  //   const {
  //     task_name,
  //     task_scheduled_Hours,
  //     sprint_name,
  //     basket_name,
  //     task_start_Date,
  //     task_end_date,
  //     task_actual_worked,
  //     task_status,
  //     task_actual_status,
  //     actual_task_scheduled_Hours,
  //     taskOwners
  //   } = data;
  //   const users = taskOwners.join(',');

  //   const tooltipText = `Sprint Name: ${sprint_name}\nTask Name: ${task_name}\nBasket Name: ${basket_name}\nStart Date:${task_start_Date}\nEnd Date:${task_end_date}\nTotal Scheduled Hours:${actual_task_scheduled_Hours}\nScheduled Hours: ${task_scheduled_Hours}\nActual Worked: ${
  //     task_actual_worked ? task_actual_worked : '00:00:00'
  //   }\nStatus:${task_status}\nActual Status:${task_actual_status}\nTask Owners:${users}`;
  //   setTooltipContent(tooltipText);
  //   const xPos = event.clientX + 5;
  //   const yPos = event.clientY - 5;

  //   const tooltipElement = document.getElementById('tooltip');
  //   const tooltipRect = tooltipElement?.getBoundingClientRect();

  //   if (tooltipRect) {
  //     if (xPos + tooltipRect.width > window.innerWidth) {
  //       xPos = window.innerWidth - tooltipRect.width - 5;
  //     }
  //     if (yPos + tooltipRect.height > window.innerHeight) {
  //       yPos = window.innerHeight - tooltipRect.height - 5;
  //     }
  //     if (yPos < 0) {
  //       yPos = 5;
  //     }
  //   }

  //   setTooltipPosition({ x: xPos, y: yPos });

  //   // setTooltipPosition({ x: xPos, y: yPos });
  // };

  const handleMouseLeave = () => {
    setTooltipContent('');

    // tooltip.style.display = "none";
  };
  function goPrevTab() {
    let prevTab = localStorage.getItem('PreviosTab');
    localStorage.removeItem('PreviosTab');
    if (prevTab) {
      window.location.href = prevTab;
    }
  }

  const TooltipItem = ({ label, value }) => (
    <div style={{ marginBottom: '8px' }}>
      {label}: {value || ''}
    </div>
  );

  const generateTooltipText = (task) => {
    if (Object.keys(task).length === 0 && task.constructor === Object) {
      return null;
    }
    const users = task?.taskOwners?.join(',');

    const tooltipFields = {
      'Sprint Name': task?.sprint_name,
      'Task Name': task?.task_name,
      'Basket Name': task?.basket_name,
      'Start Date': task?.task_start_Date,
      'End Date': task?.task_end_date,
      'Total Scheduled Hours': task?.actual_task_scheduled_Hours,
      'Scheduled Hours': task?.task_scheduled_Hours,
      'Actual Worked': task?.task_actual_worked,
      'Status': task?.task_status,
      'Actual Status': task?.task_actual_status,
      'Task Owners': users
    };

    return Object.entries(tooltipFields)?.map(([label, value], index) => (
      <TooltipItem key={index} label={label} value={value} />
    ));
  };

  return (
    <>
      {isLoading && <CalendarSkeleton />}
      {!isLoading && (
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
                  let actualStatus = task?.task_actual_status;
                  let filteredBgColor = bgColor?.filter(
                    (bgcolor) => bgcolor?.statusName === actualStatus
                  );
                  const colorChange =
                    Object.keys(task).length > 0
                      ? filteredBgColor[0]?.color
                      : '';

                  const truncateText = (text) =>
                    text.length > 25 ? `${text.slice(0, 20)}...` : text;
                  const tooltipTexts = generateTooltipText(task);
                  return (
                    <>
                      <a
                        data-tooltip-id={`my-tooltip-${task?.id}`}
                      >
                        <Tooltip
                        place='right'
                          style={{
                            backgroundColor: 'white',
                            color: 'rgb(55 65 81)',
                            boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                          }}
                          id={`my-tooltip-${task?.id}`}
                        >
                          {tooltipTexts}
                        </Tooltip>
                        <div
                          className="calendar-card  border ps-2   py-2"
                          style={{ backgroundColor: colorChange }}
                          key={idx}
                          // onMouseEnter={(event) => handleMouseEnter(event, task)}
                          // onMouseLeave={handleMouseLeave}
                        >
                          {task?.basket_name && (
                            <p className="mb-0 fw-bold">
                              {truncateText(task?.basket_name)}
                            </p>
                          )}
                          {task?.task_name && (
                            <p className="mb-0" onClick={goPrevTab}>
                              {truncateText(task?.task_name)}
                            </p>
                          )}
                        </div>
                      </a>
                    </>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* {tooltipContent && (
        <div
          id="custom-tooltip"
          className="custom-tooltip"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <pre>{tooltipContent}</pre>
        </div>
      )} */}
    </>
  );
};

export default WeekwiseCalendar;
