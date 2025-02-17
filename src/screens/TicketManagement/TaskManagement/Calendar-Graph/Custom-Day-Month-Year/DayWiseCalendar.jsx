import React, { useState } from 'react';
import Avatar from 'react-avatar';
import './custom-style.css';

import TaskSkeleton from './Skeleton/TaskSkeleton';
import { Tooltip } from 'react-tooltip';

const DayWiseCalendar = (props) => {
  const { data: dayWiseData, bgColor, isLoading } = props;
  // const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const [expandedRows, setExpandedRows] = useState({});

  const handleMouseEnter = (event, data) => {
    const {
      task_name,
      task_scheduled_Hours,
      sprint_name,
      basket_name,
      task_start_Date,
      task_end_date,
      task_actual_worked,
      task_actual_status,
      actual_task_scheduled_Hours,
      task_status,
      taskOwners
    } = data;
    const users = taskOwners.join(',');
    const tooltipText = `Sprint Name: ${sprint_name}\nTask Name: ${task_name}\nBasket Name: ${basket_name}\nStart Date:${task_start_Date}\nEnd Date:${task_end_date}\nTotal Scheduled Hours:${actual_task_scheduled_Hours}\nScheduled Hours: ${task_scheduled_Hours}\nActual Worked: ${
      task_actual_worked ? task_actual_worked : '00:00:00'
    }\nStatus:${task_status}\nActual Status:${task_actual_status}\nTask Owners:${users}`;
    setTooltipContent(tooltipText);

    const xPos = event.clientX + 5;
    const yPos = event.clientY - 5;
    setTooltipPosition({ x: xPos, y: yPos });
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
    // tooltip.style.display = "none";
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle only the clicked row
    }));
  };

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

    const taskOwnersContent =
      task?.taskOwners?.length > 6 ? (
        <div
          style={{
            maxWidth: '400px',
            wordWrap: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word'
          }}
        >
          {users}
        </div>
      ) : (
        users
      );
    const tooltipFields = {
      'Sprint Name': task?.sprint_name,
      'Task Name': task?.task_name,
      'Basket Name': task?.basket_name,
      'Start Date': task?.task_start_Date,
      'End Date': task?.task_end_date,
      'Total Scheduled Hours': task?.actual_task_scheduled_Hours,
      'Scheduled Hours': task?.task_scheduled_Hours,
      'Actual Worked': task?.task_actual_worked,
      Status: task?.task_status,
      'Actual Status': task?.task_actual_status,
      'Task Owners': taskOwnersContent
    };

    return Object.entries(tooltipFields)?.map(([label, value], index) => (
      <TooltipItem key={index} label={label} value={value} />
    ));
  };

  // const filterTaskAsPerAsSprint = async () => {
  //   const formatDate = (dates) => {
  //     const date = new Date(dates);
  //     const year = date.getFullYear();
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const day = String(date.getDate()).padStart(2, '0');
  //     return `${year}-${month}-${day}`;
  //   };

  // const response = await new SprintService().getSprintCalendarDataForWeek(
  //   ticketId,
  //   formatDate(date),
  //   formatDate(date)
  // );
  // console.log('response', response.data.data);
  // if (response?.data?.status === 1) {
  //   setCalendarData(response?.data?.data[0].task_data);
  // }
  // // if (!dayWiseData) return [];

  // let newTaskSprintData = [];

  // let currentDate = new Date(presentDate);
  // for (let i = 0; i < dayWiseData?.length; i++) {
  //   for (let j = 0; j < dayWiseData[i].task_data.length; j++) {
  //     const startDate = new Date(dayWiseData[i].task_data[j].task_start_Date);
  //     const endDate = new Date(dayWiseData[i].task_data[j].task_end_date);
  //     if (currentDate >= startDate && currentDate <= endDate) {
  //       const payload = {
  //         sprintName: dayWiseData[i].name,
  //         basketName: dayWiseData[i].task_data[j].basket_name,
  //         taskName: dayWiseData[i].task_data[j].task_name,
  //         scheduledHours: dayWiseData[i].task_data[j].task_scheduled_Hours,
  //         actualWorked: dayWiseData[i].task_data[j].task_actual_worked,
  //         priority: dayWiseData[i].task_data[j].task_priority,
  //         actualStatus: dayWiseData[i].task_data[j].task_status,
  //         startDate: dayWiseData[i].task_data[j].task_start_Date,
  //         endDate: dayWiseData[i].task_data[j].task_end_date,
  //         taskOwners: dayWiseData[i].task_data[j].taskOwners
  //       };
  //       newTaskSprintData.push(payload);
  //       setCalendarData((prevState) => [...prevState, payload]);
  //     }
  //   }
  // }
  //   return newTaskSprintData;
  // };
  function goPrevTab() {
    let prevTab = localStorage.getItem('PreviosTab');
    localStorage.removeItem('PreviosTab');
    if (prevTab) {
      window.location.href = prevTab;
    }
  }

  return (
    <>
      {isLoading &&
        [...Array(3)].map((el, id) => (
          <div key={id}>
            <TaskSkeleton />
          </div>
        ))}
      {dayWiseData && dayWiseData.length > 0 && !isLoading ? (
        dayWiseData.map((data) => {
          let actualStatus = data?.task_actual_status;
          let filteredBgColor = bgColor?.filter(
            (bgcolor) => bgcolor?.statusName === actualStatus
          );
          const tooltipTexts = generateTooltipText(data);
          const isExpanded = expandedRows[data.id] || false;

          return (
            <>
              <a key={data?.id} data-tooltip-id={`my-tooltip-children-multiline-${data?.id}`}>
                <Tooltip
                  place="top"
                  style={{
                    backgroundColor: 'white',
                    color: 'rgb(55 65 81)',
                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px'
                  }}
                  id={`my-tooltip-children-multiline-${data?.id}`}
                >
                  {/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
                  {tooltipTexts}

                  {/* </div> */}
                </Tooltip>
                <div
                  key={data.id}
                  className={`px-3 py-4 mt-2 d-flex justify-content-between rounded daily_task_data`}
                  style={{ backgroundColor: filteredBgColor[0]?.color }}
                >
                  {/* Left Section: Sprint Name, Basket Name, Task Name, Hours */}
                  <div className="col-6 d-flex ">
                    <h5
                      className="col-3 fw-bold"
                      type="button"
                      data-bs-animation={true}
                      data-bs-placement="left"
                      title="Sprint Name"
                    >
                      {data?.sprint_name}
                    </h5>
                    <h5 className="col-3 fw-bold">{data?.basket_name}</h5>
                    <div className="col-6">
                      <p className="mb-0 fw-bold cp" onClick={goPrevTab}>
                        {data.task_name}
                      </p>

                      <span className="me-3">
                        {data?.task_actual_worked
                          ? data?.task_actual_worked
                          : '00:00:00'}
                      </span>
                      <span>{data.task_scheduled_Hours}</span>
                    </div>
                  </div>

                  {/* Right Section: User Avatars & Priority */}
                  <div className="col-6 d-flex  justify-content-start text-end">
                    <div
                      className="col-9 d-flex gap-2 justify-content-start"
                      style={{
                        display: 'flex',
                        flexWrap: isExpanded ? "wrap" : "nowrap",
                      }}
                    >
                      {data?.taskOwners
                        .slice(0, isExpanded ? data.taskOwners.length : 5)
                        .map((userName, id) => (
                          <div key={id} className="text-end">
                            <Avatar round size="45px" name={userName} />
                          </div>
                        ))}
                      {data?.taskOwners.length > 5 && (
                        <span
                         onClick={() => toggleExpand(data.id)}
                          title={isExpanded ? 'View Less' : 'View More'}
                          className="fs-3 pointer"
                        >
                          ....
                        </span>
                      )}
                    </div>

                    <h5 className="col-3 mb-0">{data.task_priority}</h5>
                  </div>
                </div>


              </a>
            </>
          );
        })
      ) : (
        <div
          className="text-center mt-4 p-2 text-white rounded-1 bg-primary"
          // style={{ backgroundColor: '#484C7F' }}
        >
          No Tasks For Current Date
        </div>
      )}

      {/* Custom tooltip */}
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

export default DayWiseCalendar;
