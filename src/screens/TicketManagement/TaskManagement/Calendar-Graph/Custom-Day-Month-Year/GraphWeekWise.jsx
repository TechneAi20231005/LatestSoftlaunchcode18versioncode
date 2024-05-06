//"../../../../../services/TicketService/SprintService"
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import SprintService from "../../../../../services/TicketService/SprintService";
import "./custom-style.css";
import Select from "react-select";
import PageHeader from "../../../../../components/Common/PageHeader";
import { useLocation, useParams } from "react-router-dom";

const GraphWeekWise = () => {
  const params = useParams();
  const location = useLocation();

  const { id: ticketId, date: sprintRange } = params;

  const [selectedOption, setSelectedOption] = useState("week");
  const [sprintFirstDate, setSprintFirstDate] = useState("");
  const [sprintLastDate, setSprintLastDate] = useState("");
  const [dropDownData, setDropDownData] = useState([]);
  const [weekRange, setWeekRange] = useState([]);
  // const [selectedDropDown, setSelectedDropdown] = useEffect("");

  const [chartData, setChartData] = useState({
    series: [
      {
        name: "",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 450,
        type: "rangeBar",
        group: "timestamp",
      },
      plotOptions: {
        bar: {
          opacity: 0.7,
          horizontal: true,
          barHeight: "100%",
          distributed: false,
          barWidth: "50%",
          rangeBarOverlap: false,
          // rangeBarGroupRows: true,
        },
      },
      stroke: {
        show: true,
        width: 6,
        colors: ["transparent"],
      },
      xaxis: {
        type: "datetime",
        min: new Date("2024-04-11").getTime(),
        max: new Date("2024-04-29").getTime(),
      },
      legend: {
        show: true,
        position: "top",
        horizontalAlign: "left",
      },
      // grid: {
      //   show: true,
      //   borderColor: "#90A4AE",
      //   strokeDashArray: 25,
      // },
      fill: {
        type: "solid",
        opacity: 0.8,
      },
      colors: ["#C3F5FF", "#FF8888", "#FFC075", "#DB0101", "#9EFFB9"],
      annotations: {
        xaxis: [
          {
            // x: new Date("").getTime(),
            // x: new Date("2024-04-24").getTime(),
            // borderColor: "#C3F5FF",
            strokeDashArray: 1,
            fillColor: "#FFFFFF",
            offsetX: 0,
            offsetY: 0,
            label: {
              style: {
                color: "#FFFFFF",
                height: 450,
                background: "#484C7F",
                fontSize: "12px",
                fontWeight: 400,
                opacity: 0.6,
              },
              cssClass: "apexcharts-point-annotation-label",
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 2,
              },
              text: "Sprint Start Date",
            },
          },
          {
            x: new Date("").getTime(),
            // x: new Date("2024-04-24").getTime(),
            // borderColor: "#C3F5FF",
            strokeDashArray: 1,
            fillColor: "#FFFFFF",
            offsetX: 0,
            offsetY: 0,
            label: {
              style: {
                color: "#FFFFFF",
                height: 450,
                background: "#484C7F",
                fontSize: "12px",
                fontWeight: 400,
                opacity: 0.6,
              },
              cssClass: "apexcharts-point-annotation-label",
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 0,
              },
              margin: {
                top: 0,
                bottom: 0,
              },
              text: "Sprint End Date",
            },
          },
        ],
      },
      yaxis: {
        show: true,
        // showAlways: false,
        showForNullSeries: false,
        // seriesName: undefined,
        // opposite: false,
        // reversed: false,
        // logarithmic: false,
      },
    },
  });

  function convertToDate(dateString) {
    return new Date(dateString).getTime();
  }
  function getWeekRange(startDate, endDate) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const prevMonday = new Date(start);
    prevMonday.setDate(
      prevMonday.getDate() -
        prevMonday.getDay() +
        (prevMonday.getDay() === 0 ? -6 : 1)
    );

    const prevSunday = new Date(prevMonday);
    prevSunday.setDate(prevSunday.getDate() + 6);

    const startOfWeek = new Date(start);
    startOfWeek.setDate(
      startOfWeek.getDate() -
        startOfWeek.getDay() +
        (startOfWeek.getDay() === 0 ? -6 : 1)
    );

    const endOfWeek = new Date(end);
    endOfWeek.setDate(endOfWeek.getDate() - endOfWeek.getDay() + 7);

    const weekRange = [];
    let currentMonday = new Date(startOfWeek);

    if (prevMonday.getTime() !== startOfWeek.getTime()) {
      weekRange.push({
        Monday: prevMonday.toLocaleDateString(),
        Sunday: prevSunday.toLocaleDateString(),
      });
    }
    while (currentMonday <= endOfWeek) {
      const currentSunday = new Date(currentMonday);
      currentSunday.setDate(currentSunday.getDate() + 6);

      weekRange.push({
        Monday: currentMonday.toLocaleDateString(),
        Sunday: currentSunday.toLocaleDateString(),
      });

      currentMonday.setDate(currentMonday.getDate() + 7);
    }
    return weekRange;
  }

  const formatDate = (dates) => {
    const date = new Date(dates);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getGraphData = async (
    shouldCallWeekRange = true,
    endDate,
    firstDate
  ) => {
    try {
      const splitedSprintRange = sprintRange.split("to");
      let weeksplitDate = [];
      if (shouldCallWeekRange) {
        let weekRange = getWeekRange(
          splitedSprintRange[0],
          splitedSprintRange[1]
        )?.map((weekRange, index) => {
          return {
            value: index,
            label: `${weekRange?.Sunday}-${weekRange?.Monday}`,
          };
        });
        setDropDownData(weekRange);
        weeksplitDate = weekRange[0]?.label?.split("-");
      }

      const res = await new SprintService().getGraphDataForSprint(
        ticketId,
        formatDate(firstDate || weeksplitDate?.[1]),
        formatDate(endDate || weeksplitDate?.[0])
      );

      if (res?.data?.status === 1) {
        const { first_sprint_date, last_sprint_date } = res?.data?.data;

        const transformedData = {
          series: [
            {
              name: "TODO",
              data: res?.data?.data?.TO_DO
                ? res?.data?.data?.TO_DO?.map((task) => ({
                    x: task.basket_name,
                    y: [
                      convertToDate(task.task_start_Date),
                      convertToDate(task.task_end_date),
                    ],
                  }))
                : [null],
            },
            {
              name: "Delay",
              data: res?.data?.data?.DELAY
                ? res?.data?.data?.DELAY?.map((task) => ({
                    x: task.basket_name,
                    y: [
                      convertToDate(task.task_start_Date),
                      convertToDate(task.task_end_date),
                    ],
                  }))
                : [null],
            },
            {
              name: "Highly Delay",
              data: res?.data?.data?.HIGHLY_DELAY
                ? res?.data?.data?.HIGHLY_DELAY?.map((task) => ({
                    x: task.basket_name,
                    y: [
                      convertToDate(task.task_start_Date),
                      convertToDate(task.task_end_date),
                    ],
                  }))
                : [null],
            },
            {
              name: "Completed",
              data: res?.data?.data?.COMPLETED
                ? res?.data?.data?.COMPLETED?.map((task) => ({
                    x: task.basket_name,
                    y: [
                      convertToDate(task.task_start_Date),
                      convertToDate(task.task_end_date),
                    ],
                  }))
                : [null],
            },
            {
              name: "In Progress",
              data: res?.data?.data?.IN_PROGRESS
                ? res?.data?.data?.IN_PROGRESS?.map((task) => ({
                    x: task.basket_name,
                    y: [
                      convertToDate(task.task_start_Date),
                      convertToDate(task.task_end_date),
                    ],
                  }))
                : [null],
            },
          ],
        };

        setChartData((prevChartData) => ({
          ...prevChartData,
          series: transformedData.series,
          options: {
            ...prevChartData.options,
            xaxis: {
              ...prevChartData.options.xaxis,
              min: new Date(firstDate || weeksplitDate[1]).getTime(),
              max: new Date(endDate || weeksplitDate[0]).getTime(),
            },
            annotations: {
              ...prevChartData.options.annotations,
              xaxis: [
                ...prevChartData.options.annotations.xaxis,
                {
                  ...prevChartData.options.annotations.xaxis[0],
                  x: new Date(first_sprint_date).getTime(),
                  label: {
                    ...prevChartData.options.annotations.xaxis[0].label,
                    text: "Sprint Start Date",
                  },
                },
                {
                  ...prevChartData.options.annotations.xaxis[1],
                  x: new Date(last_sprint_date).getTime(),
                  label: {
                    ...prevChartData.options.annotations.xaxis[1].label,
                    text: "Sprint End Date",
                  },
                },
              ],
            },
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }
  };
  const handleRadioChange = async (event) => {
    setSelectedOption(event.target.value);
    setChartData((prevData) => ({
      ...prevData,
      series: [
        {
          name: "",
          data: [],
        },
      ],
    }));
    setDropDownData([]);
    const { value } = event.target;
    const splitRange = sprintRange.split("to");
    if (value === "month") {
      const monthsOfYear = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(2024, index, 1);
        return date.toLocaleString("en-US", { month: "long" });
      }).map((month, index) => {
        return { value: index, label: month };
      });
      setDropDownData(monthsOfYear);

      const month = new Date(splitRange[0]).getMonth();
      const firstDayOfMonth = new Date(new Date().getFullYear(), month, 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), month + 1, 0);
      await getGraphData(false, lastDayOfMonth, firstDayOfMonth);
    } else if (value === "year") {
      const year = new Date(splitRange[0]).getFullYear();
      // setDropDownData([...{ value: 1, label: year }]);
      const firstDayOfYear = new Date(year, 0, 1);
      const lastDayOfYear = new Date(year, 11, 31);
      await getGraphData(false, lastDayOfYear, firstDayOfYear);
    } else if (value === "week") {
      getGraphData(true);
    }
  };
  const dropDownHandler = async (event) => {
    const { label } = event;
    if (selectedOption === "week") {
      const currentWeek = event.label.split("-");
      getGraphData(false, currentWeek[0], currentWeek[1]);
    } else if (selectedOption === "month") {
      const firstDayOfMonth = new Date(new Date().getFullYear(), label, 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), label + 1, 0);
      await getGraphData(false, lastDayOfMonth, firstDayOfMonth);
    }
  };
  useEffect(() => {
    getGraphData();
  }, []);

  return (
    <div className="container-xxl ">
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
      <div className="range-bar-chart-container card mt-3">
        <div className="col-12 text-end p-2 d-md-flex align-items-center my-3 justify-content-end d-none">
          <div className="form-check ms-5">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              value="week"
              checked={selectedOption === "week"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
              Week
            </label>
          </div>
          <div className="form-check ms-5">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault2"
              value="month"
              checked={selectedOption === "month"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
              Month
            </label>
          </div>
          <div className="form-check ms-5">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault3"
              value="year"
              checked={selectedOption === "year"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault3">
              Year
            </label>
          </div>
          <div className="col-2 ms-3 text-start">
            <Select
              // className=""
              // name="sprint_data"
              // id="sprint_data"
              options={dropDownData}
              onChange={dropDownHandler}
              defaultValue={dropDownData[0]?.label}
              // ref={sprintDropDownRef}
              // defaultValue={}
            />
          </div>
        </div>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="rangeBar"
          height={500}
        />
      </div>
    </div>
  );
};

export default GraphWeekWise;
