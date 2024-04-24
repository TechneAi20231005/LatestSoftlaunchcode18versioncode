import React, { useEffect, useState } from "react";
import PageHeader from "../../../../components/Common/PageHeader";
import SprintService from "../../../../services/TicketService/SprintService";
import { useParams } from "react-router-dom";
import DayWiseCalendar from "./Custom-Day-Month-Year/DayWiseCalendar";
import WeekwiseCalendar from "./Custom-Day-Month-Year/WeekwiseCalendar";

const SprintCalendar = () => {
  const params = useParams();
  const { id: ticketId } = params;

  const [selectedOption, setSelectedOption] = useState("week");
  const [calendarData, setCalendarData] = useState([]);
  const [notify, setNotify] = useState({});
  const [componentToRender, setComponentToRender] = useState(null);
  const [currentDateRange, setCurrentDateRange] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firstStartDate, setFirstStarDate] = useState("");
  const [lastEndDate, setLasteEndDate] = useState("");
  const [withinRangeDates, setWithinRangeDates] = useState([]);
  const [, setDateArray] = useState([]);
  const [currentDaywiseDate, setCurrentDaywiseDate] = useState({});
  const [taskStatus, setTaskStatus] = useState([
    { id: 1, statusName: "TO_DO", color: "#C3F5FF" },
    { id: 2, statusName: "IN_PROGRESS", color: "#FFECB3" },
    { id: 3, statusName: "COMPLETED", color: "#9EFFB9" },
    { id: 4, statusName: "Delay", color: "#C3F5FF" },
    { id: 5, statusName: "Min_Delay", color: "#FFC581" },
    { id: 6, statusName: "Max_Delay", color: "#484C7F" },
  ]);

  const generateDateArray = () => {
    const start = new Date(firstStartDate);
    const end = new Date(lastEndDate);
    const days = [];
    let currentDate = start;
    let count = 1;
    while (currentDate <= end) {
      days.push({ id: count++, date: new Date(currentDate) });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log("genrtae days", days);
    setDateArray(days);
    return days;
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    if (event.target.value === "day") {
      const days = generateDateArray();
      console.log("days in radio", days);
      setCurrentDateRange(days);
    }
  };
  // const WeeklyRanges = (startingDate, endingDate) => {
  //   const startDate = new Date(startingDate);
  //   const endDate = new Date(endingDate);
  //   const weeklyRanges = [];
  //   let currentDate = new Date(startDate);
  //   let nextSunday = new Date(startDate);
  //   nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));

  //   while (nextSunday <= endDate) {
  //     const nextMonday = new Date(nextSunday);
  //     nextMonday.setDate(nextMonday.getDate() + 6);

  //     weeklyRanges.push({
  //       start: new Date(nextSunday),
  //       end: new Date(nextMonday),
  //     });
  //     nextSunday.setDate(nextSunday.getDate() + 7);
  //   }
  //   return weeklyRanges;
  // };

  // const WeeklyRanges = (startingDate, endingDate) => {
  //   const startDate = new Date(startingDate);
  //   const endDate = new Date(endingDate);
  //   const weeklyRanges = [];
  //   let currentDate = new Date(startDate);
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
  //   return weeklyRanges;
  // };

  const WeeklyRanges = (startingDate, endingDate) => {
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);
    const weeklyRanges = [];

    const prevSunday = new Date(startDate);
    prevSunday.setDate(prevSunday.getDate() - prevSunday.getDay());
    const prevMonday = new Date(prevSunday);
    prevMonday.setDate(prevMonday.getDate() - 6);

    const prevStartFormatted = prevMonday.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const prevEndFormatted = prevSunday.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    weeklyRanges.push({
      start: prevStartFormatted,
      end: prevEndFormatted,
    });
    let nextSunday = new Date(startDate);
    nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));

    while (nextSunday <= endDate) {
      const nextMonday = new Date(nextSunday);
      nextMonday.setDate(nextMonday.getDate() + 6);

      const startFormatted = nextSunday.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const endFormatted = nextMonday.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      weeklyRanges.push({
        start: startFormatted,
        end: endFormatted,
      });

      nextSunday.setDate(nextSunday.getDate() + 7);
    }
    console.log("weeklyRanges 1", weeklyRanges);
    return weeklyRanges;
  };

  const getFormattedDate = (date) => {
    return {
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      month: date.toLocaleDateString("en-US", { month: "long" }),
      date: date.getDate(),
    };
  };

  const formatDateString = (date) => {
    console.log("date...", date);
    const day = date.getDate();
    const month = date.toLocaleString("en", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchCalendarData = async () => {
    try {
      const res = await new SprintService().getSprintCalendar(ticketId);
      console.log("res.data.data", res.data.data);
      if (res?.data?.status && res?.data?.data) {
        setCalendarData(res?.data?.data);
        setFirstStarDate(res?.data?.data[0]?.first_sprint_date);
        setLasteEndDate(res?.data?.data[0]?.last_sprint_date);
        if (selectedOption === "week") {
          const weeklyRange = WeeklyRanges(
            res?.data?.data[0]?.first_sprint_date,
            res?.data?.data[0]?.last_sprint_date
          );
          if (weeklyRange) {
            setCurrentDateRange(weeklyRange);
            let filterData = weeklyRange[currentIndex];
            const startDate = new Date(filterData.start);
            const endDate = new Date(filterData.end);
            const days = [];

            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              days.push(getFormattedDate(new Date(currentDate)));
              currentDate.setDate(currentDate.getDate() + 1);
            }
            setWithinRangeDates(days);
          }
        }
      } else {
        setNotify({ type: "danger", message: res?.data?.message });
        console.error("Unexpected response format:", res);
      }
    } catch (error) {
      setCalendarData(null);
      setNotify({ type: "danger", message: "Error fetching calendar data!!!" });
      console.error("Error fetching calendar data:", error);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex =
        prevIndex === currentDateRange.length - 1 ? 0 : prevIndex + 1;
      setCurrentDaywiseDate(currentDateRange[nextIndex]);
      const filterData = currentDateRange[nextIndex];
      const startDate = new Date(filterData.start);
      const endDate = new Date(filterData.end);
      const days = [];

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        days.push(getFormattedDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      setWithinRangeDates(days);

      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const previousIndex =
        prevIndex === 0 ? currentDateRange.length - 1 : prevIndex - 1;
      setCurrentDaywiseDate(currentDateRange[previousIndex]);
      return previousIndex;
    });
  };
  console.log("currentdaywisedate", currentDaywiseDate);
  useEffect(() => {
    fetchCalendarData();
  }, []);
  useEffect(() => {
    if (selectedOption === "day") {
      setComponentToRender(
        <DayWiseCalendar
          data={calendarData}
          bgColor={taskStatus}
          presentDate={currentDaywiseDate?.date}
        />
      );
    } else if (selectedOption === "week") {
      setComponentToRender(
        <WeekwiseCalendar
          data={calendarData}
          bgColor={taskStatus}
          daysOfWeek={withinRangeDates}
          firstDate={firstStartDate}
          lastDate={lastEndDate}
        />
      );
    } else if (selectedOption === "month") {
      // setComponentToRender(<MonthComponent />);
    }
  }, [selectedOption, calendarData, taskStatus, currentDaywiseDate]);

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Manage Task" paddingStart="3" />
      <div className="card mt-3">
        <div className="card-body">
          <div>
            <div className="d-flex ">
              <h4 className="col-md-3">
                <strong className="text-primary">Ticket - TT3711 </strong>
                <i
                  className="icofont-eye"
                  style={{ fontSize: "27px" }}
                ></i>{" "}
              </h4>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-3 mt-3">
        <div className="d-flex justify-content-between justify-content-md-end ">
          {taskStatus?.map((statusName) => (
            <div
              key={statusName.id}
              className="ms-md-4 d-md-flex align-items-center "
            >
              <div
                className=""
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: statusName.color,
                }}
              ></div>
              <div className="ms-md-2 mt-1 mt-md-0">
                {statusName.statusName}
              </div>
            </div>
          ))}
        </div>
      </div>
      {console.log("current date range", currentDateRange)}
      {
        <div className="card mt-3">
          <div className="card-body d-flex align-items-center justify-content-between">
            <div className="text-primary col-5 d-flex align-items-center">
              <strong>Day wise</strong>
              {/* {currentDateRange[currentIndex] && ( */}
              {
                <div className="col-6 d-flex ms-2 align-items-center  justify-content-around">
                  <button
                    className="btn col-2 p-0 text-end"
                    onClick={handlePrev}
                  >
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
                  {selectedOption === "day" && (
                    <div className="col-8 text-center">
                      {formatDateString(currentDateRange[currentIndex]?.date)}
                    </div>
                  )}
                  {selectedOption === "week" && (
                    <div className="col-8 text-center">{`${currentDateRange[currentIndex]?.start} - ${currentDateRange[currentIndex]?.start}  `}</div>
                  )}

                  <button
                    className="btn col-2 p-0 text-start "
                    onClick={handleNext}
                  >
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
              }
            </div>

            <div className="col-7 d-md-flex align-items-center justify-content-end d-none">
              <div className="form-check ms-5">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value="day"
                  checked={selectedOption === "day"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault1">
                  Day
                </label>
              </div>
              <div className="form-check ms-5">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  value="week"
                  checked={selectedOption === "week"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault2">
                  Week
                </label>
              </div>
              <div className="form-check ms-5">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault3"
                  value="month"
                  checked={selectedOption === "month"}
                  onChange={handleRadioChange}
                />
                <label className="form-check-label" htmlFor="flexRadioDefault3">
                  Month
                </label>
              </div>
            </div>
          </div>
        </div>
      }

      {/* component */}
      <div className="">{componentToRender}</div>
    </div>
  );
};

export default SprintCalendar;
