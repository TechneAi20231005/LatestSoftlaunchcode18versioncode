import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import './custom-style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { _base } from '../../../../../settings/constants';
import SprintService from '../../../../../services/TicketService/SprintService';
import TaskSkeleton from './Skeleton/TaskSkeleton';

const DayWiseCalendar = (props) => {
  const navigate = useNavigate();

  const params = useParams();
  const { date, id: ticketId } = params;
  const { data: dayWiseData, bgColor, isLoading } = props;
  // const [isLoading, setIsLoading] = useState(true);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

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

    const tooltip = document.getElementById('custom-tooltip');
    const xPos = event.clientX + 5;
    const yPos = event.clientY - 5;
    setTooltipPosition({ x: xPos, y: yPos });
  };

  const handleMouseLeave = () => {
    setTooltipContent('');
    // tooltip.style.display = "none";
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

          return (
            <div
              key={data.id}
              className={`px-3 py-4 mt-2 d-flex align-items-center justify-content-between rounded daily_task_data`}
              style={{ backgroundColor: filteredBgColor[0]?.color }}
              onMouseEnter={(event) => handleMouseEnter(event, data)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="col-6 d-flex align-items-center">
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
                    {data?.actualWorked ? data?.actualWorked : '00:00:00'}
                  </span>
                  <span>{data.task_scheduled_Hours}</span>
                </div>
              </div>
              <div className="col-6 d-flex align-items-center justify-content-end text-end ">
                <div className="col-9 d-flex gap-2 justify-content-end ">
                  {data?.taskOwners.map((userName, id) => (
                    <div key={id} className="text-end">
                      <Avatar round size="45px" name={userName} />
                    </div>
                  ))}
                </div>
                <h5 className="col-3 mb-0">{data.task_priority}</h5>
              </div>
            </div>
          );
        })
      ) : (
        <div
          className="text-center mt-4 p-2 text-white rounded-1"
          style={{ backgroundColor: '#484C7F' }}
        >
          No Tasks For Current Date
        </div>
      )}

      {/* Custom tooltip */}
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

export default DayWiseCalendar;
