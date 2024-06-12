import React, { useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import './custom-style.css';
import { Link, useNavigate } from 'react-router-dom';
import { _base } from '../../../../../settings/constants';

const DayWiseCalendar = (props) => {
  const navigate = useNavigate();
  // console.log("navigate", navigate());
  const { data: dayWiseData, bgColor, presentDate } = props;
  const [calendarData, setCalendarData] = useState([]);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (event, data) => {
    const {
      taskName,
      scheduledHours,
      sprintName,
      basketName,
      startDate,
      endDate,
      actualWorked,
      actualStatus
    } = data;
    const tooltipText = `Sprint Name: ${sprintName}\nTask Name: ${taskName}\nBasket Name: ${basketName}\nStart Date:${startDate}\nEnd Date:${endDate}\nScheduled Hours: ${scheduledHours}\nActual Worked: ${
      actualWorked ? actualWorked : '00:00:00'
    }\nStatus:${actualStatus}`;
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

  const filterTaskAsPerAsSprint = () => {
    if (!dayWiseData) return [];
    setCalendarData([]);
    let newTaskSprintData = [];

    let currentDate = new Date(presentDate);
    for (let i = 0; i < dayWiseData?.length; i++) {
      for (let j = 0; j < dayWiseData[i].task_data.length; j++) {
        const startDate = new Date(dayWiseData[i].task_data[j].task_start_Date);
        const endDate = new Date(dayWiseData[i].task_data[j].task_end_date);
        if (currentDate >= startDate && currentDate <= endDate) {
          const payload = {
            sprintName: dayWiseData[i].name,
            basketName: dayWiseData[i].task_data[j].basket_name,
            taskName: dayWiseData[i].task_data[j].task_name,
            scheduledHours: dayWiseData[i].task_data[j].task_scheduled_Hours,
            actualWorked: dayWiseData[i].task_data[j].task_actual_worked,
            priority: dayWiseData[i].task_data[j].task_priority,
            actualStatus: dayWiseData[i].task_data[j].task_status,
            startDate: dayWiseData[i].task_data[j].task_start_Date,
            endDate: dayWiseData[i].task_data[j].task_end_date,
            taskOwners: dayWiseData[i].task_data[j].taskOwners
          };
          newTaskSprintData.push(payload);
          setCalendarData((prevState) => [...prevState, payload]);
        }
      }
    }
    return newTaskSprintData;
  };
  function goPrevTab() {
    let prevTab = localStorage.getItem('PreviosTab');
    localStorage.removeItem('PreviosTab');
    if (prevTab) {
      window.location.href = prevTab;
    }
  }

  useEffect(() => {
    filterTaskAsPerAsSprint();
  }, [dayWiseData, presentDate]);

  return (
    <>
      {calendarData && calendarData.length > 0 ? (
        calendarData.map((data) => {
          let actualStatus = data?.actualStatus;
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
                  {data.sprintName}
                </h5>
                <h5 className="col-3 fw-bold">{data.basketName}</h5>
                <div className="col-6">
                  <p className="mb-0 fw-bold" onClick={goPrevTab}>
                    {data.taskName}
                  </p>

                  <span className="me-3">
                    {data?.actualWorked ? data?.actualWorked : '00:00:00'}
                  </span>
                  <span>{data.scheduledHours}</span>
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
                <h5 className="col-3 mb-0">{data.priority}</h5>
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
