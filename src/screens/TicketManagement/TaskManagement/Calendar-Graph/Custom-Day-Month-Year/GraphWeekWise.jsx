//"../../../../../services/TicketService/SprintService"
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import SprintService from '../../../../../services/TicketService/SprintService';
import './custom-style.css';
import Select from 'react-select';
import PageHeader from '../../../../../components/Common/PageHeader';
import { useParams } from 'react-router-dom';
import Alert from '../../../../../components/Common/Alert';
import TicketCollapse from '../../../../../components/Common/TicketCollapse';
const GraphWeekWise = () => {
  const params = useParams();

  const { id: ticketId, date: sprintRange } = params;
  const [notify, setNotify] = useState({});
  const [selectedOption, setSelectedOption] = useState('week');
  const [open, setOpen] = useState(false);
  // const [sprintFirstDate, setSprintFirstDate] = useState('');
  // const [sprintLastDate, setSprintLastDate] = useState('');
  const [dropDownData, setDropDownData] = useState([]);
  // const [weekRange, setWeekRange] = useState([]);
  const [selectedDropDown, setSelectedDropdown] = useState(null);
  // const allBasketNames = ['Amit', 'Sprint basket', 'Priyans'];
  const [ticketDetails, setTicketDetails] = useState({
    ticket_id: '',
    description: ''
  });
  const [chartData, setChartData] = useState({
    series: [
      {
        name: '',
        data: []
      }
    ],
    options: {
      chart: {
        height: 450,
        type: 'rangeBar',
        group: 'timestamp'
      },
      plotOptions: {
        bar: {
          opacity: 0.7,
          horizontal: true,
          barHeight: '100%',
          distributed: false,
          barWidth: '50%',
          rangeBarOverlap: false
          // rangeBarGroupRows: true,
        }
      },
      stroke: {
        show: true,
        width: 6,
        colors: ['transparent']
      },
      xaxis: {
        type: 'datetime',
        min: new Date('2024-04-11').getTime(),
        max: new Date('2024-04-29').getTime()
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left'
      },
      // grid: {
      //   show: true,
      //   borderColor: "#90A4AE",
      //   strokeDashArray: 25,
      // },
      fill: {
        type: 'solid',
        opacity: 0.8
      },
      colors: ['#C3F5FF', '#FF8888', '#FFC075', '#DB0101', '#9EFFB9'],
      annotations: {
        xaxis: [
          {
            // x: new Date("").getTime(),
            // x: new Date("2024-04-24").getTime(),
            // borderColor: "#C3F5FF",
            strokeDashArray: 1,
            fillColor: '#FFFFFF',
            offsetX: 0,
            offsetY: 0,
            label: {
              style: {
                color: '#FFFFFF',
                height: 450,
                background: '#484C7F',
                fontSize: '12px',
                fontWeight: 400,
                opacity: 0.6
              },
              cssClass: 'apexcharts-point-annotation-label',
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 2
              },
              text: ''
            }
          },
          {
            x: new Date('').getTime(),
            strokeDashArray: 1,
            fillColor: '#FFFFFF',
            offsetX: 0,
            offsetY: 0,
            label: {
              style: {
                color: '#FFFFFF',
                height: 450,
                background: '#484C7F',
                fontSize: '12px',
                fontWeight: 400,
                opacity: 0.6
              },
              cssClass: 'apexcharts-point-annotation-label',
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 0
              },
              margin: {
                top: 0,
                bottom: 0
              },
              text: ''
            }
          }
        ]
      },
      yaxis: {
        show: true,
        showForNullSeries: false,
        categories: []
      }
    }
  });

  function convertToDate(dateString) {
    return new Date(dateString).getTime();
  }
  function getWeekRange(startDate, endDate) {
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
        Sunday: prevSunday.toLocaleDateString()
      });
    }
    while (currentMonday <= endOfWeek) {
      const currentSunday = new Date(currentMonday);
      currentSunday.setDate(currentSunday.getDate() + 6);

      weekRange.push({
        Monday: currentMonday.toLocaleDateString(),
        Sunday: currentSunday.toLocaleDateString()
      });

      currentMonday.setDate(currentMonday.getDate() + 7);
    }

    return weekRange;
  }

  const formatDate = (dates) => {
    const date = new Date(dates);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getGraphData = async (
    shouldCallWeekRange = true,
    endDate,
    firstDate
  ) => {
    try {
      const splitedSprintRange = sprintRange.split('to');
      let weeksplitDate = [];
      if (shouldCallWeekRange) {
        let weekRange = getWeekRange(
          splitedSprintRange[0],
          splitedSprintRange[1]
        )?.map((weekRange, index) => {
          return {
            value: index,
            label: `${weekRange?.Sunday}-${weekRange?.Monday}`
          };
        });

        setDropDownData(weekRange);
        weeksplitDate = weekRange[0]?.label?.split('-');
      }
      function addSmallIncrementIfNeeded(startDate, endDate) {
        // const start = convertToDate(startDate);
        // let end = convertToDate(endDate);

        if (startDate === endDate) {
          startDate = convertToDate(startDate);
          endDate = convertToDate(endDate) + 36000000;
        } else {
          startDate = convertToDate(startDate);
          endDate = convertToDate(endDate);
        }

        return [startDate, endDate];
      }

      const res = await new SprintService().getGraphDataForSprint(
        ticketId,
        formatDate(firstDate || weeksplitDate[1]),
        formatDate(endDate || weeksplitDate[0])
      );

      const { first_sprint_date, last_sprint_date } = res?.data?.data;
      const { data } = res?.data;
      setTicketDetails(res?.data?.ticket_details);

      const allBasketNames = data?.basket_data;
      const transformedData = {
        series: [
          {
            name: 'TODO',
            data: allBasketNames.flatMap((basketName) => {
              const task = data?.TO_DO?.filter(
                (task) => task.basket_name === basketName
              );

              return task?.length > 0
                ? task.map((task) => ({
                    x: basketName,
                    y: addSmallIncrementIfNeeded(
                      task.task_start_Date,
                      task.task_end_date
                    ),
                    taskDetail: task
                  }))
                : {
                    x: basketName,
                    y: [0, 0],
                    taskDetail: {
                      basket_name: basketName,
                      task_start_Date: '',
                      task_end_date: '',
                      status: 'No Data'
                    }
                  };
            })
          },

          {
            name: 'Delay',
            data: allBasketNames.flatMap((basketName) => {
              const task = data?.DELAY?.filter(
                (task) => task.basket_name === basketName
              );
              return task?.length > 0
                ? task.map((task) => ({
                    x: basketName,
                    y: addSmallIncrementIfNeeded(
                      task.task_start_Date,
                      task.task_end_date
                    ),
                    taskDetail: task
                  }))
                : {
                    x: basketName,
                    y: [0, 0],
                    taskDetail: {
                      basket_name: basketName,
                      task_start_Date: '',
                      task_end_date: '',
                      status: 'No Data'
                    }
                  };
            })
          },
          {
            name: 'Highly Delay',
            data: allBasketNames.flatMap((basketName) => {
              const task = data?.HIGHLY_DELAY?.filter(
                (task) => task.basket_name === basketName
              );
              return task?.length > 0
                ? task.map((task) => ({
                    x: basketName,
                    y: addSmallIncrementIfNeeded(
                      task.task_start_Date,
                      task.task_end_date
                    ),
                    taskDetail: task
                  }))
                : {
                    x: basketName,
                    y: [0, 0],
                    taskDetail: {
                      basket_name: basketName,
                      task_start_Date: '',
                      task_end_date: '',
                      status: 'No Data'
                    }
                  };
            })
          },
          {
            name: 'In Time',
            data: allBasketNames.flatMap((basketName) => {
              const task = data?.IN_TIME?.filter(
                (task) => task.basket_name === basketName
              );
              return task?.length > 0
                ? task.map((task) => ({
                    x: basketName,
                    y: addSmallIncrementIfNeeded(
                      task.task_start_Date,
                      task.task_end_date
                    ),
                    taskDetail: task
                  }))
                : {
                    x: basketName,
                    y: [0, 0],
                    taskDetail: {
                      basket_name: basketName,
                      task_start_Date: '',
                      task_end_date: '',
                      status: 'No Data'
                    }
                  };
            })
          },
          {
            name: 'In Progress',
            data: allBasketNames.flatMap((basketName) => {
              const task = data?.IN_PROGRESS?.filter(
                (task) => task.basket_name === basketName
              );
              return task?.length > 0
                ? task.map((task) => ({
                    x: basketName,
                    y: addSmallIncrementIfNeeded(
                      task.task_start_Date,
                      task.task_end_date
                    ),
                    taskDetail: task
                  }))
                : {
                    x: basketName,
                    y: [0, 0],
                    taskDetail: {
                      basket_name: basketName,
                      task_start_Date: '',
                      task_end_date: '',
                      status: 'No Data'
                    }
                  };
            })
          }
        ]
      };

      const labelStyle = {
        style: {
          color: '#FFFFFF',
          height: 450,
          background: '#484C7F',
          fontSize: '12px',
          fontWeight: 400,
          opacity: 0.6
        }
      };

      const xaxisAnnotations = [];

      data.sprint_data.forEach((sprint, index) => {
        xaxisAnnotations.push({
          x: new Date(sprint.start_date).getTime(),
          label: {
            text: `Sprint Name :${sprint.name} - Sprint start date : ${sprint.start_date} `,
            ...labelStyle
          }
        });

        xaxisAnnotations.push({
          x: new Date(sprint.end_date).getTime(),
          label: {
            text: `Sprint Name :${sprint.name}   -   Sprint end date : ${sprint.end_date} `,
            ...labelStyle
          }
        });
      });

      const barHeight = 30;
      const chartHeight = barHeight * allBasketNames.length;
      setChartData((prevChartData) => ({
        ...prevChartData,
        series: transformedData.series,
        options: {
          ...prevChartData.options,
          chart: {
            ...prevChartData.options.chart,
            height: chartHeight,
            events: {
              dataPointSelection: () => {
                let prevTab = localStorage.getItem('PreviosTab');
                localStorage.removeItem('PreviosTab');
                if (prevTab) {
                  window.location.href = prevTab;
                }
              }
            }
          },
          xaxis: {
            ...prevChartData.options.xaxis,
            min: new Date(firstDate || weeksplitDate[1]).getTime(),
            max: new Date(endDate || weeksplitDate[0]).getTime()
          },
          annotations: {
            ...prevChartData.options.annotations,
            // xaxis: [
            //   ...prevChartData.options.annotations.xaxis,
            //   {
            //     ...prevChartData.options.annotations.xaxis[0],
            //     x: new Date(last_sprint_date).getTime(),
            //     label: {
            //       ...prevChartData.options.annotations.xaxis[0].label,
            //       text: 'Sprint Start Date'
            //     }
            //   }
            //   // {
            //   //   ...prevChartData.options.annotations.xaxis[1],
            //   //   x: new Date(last_sprint_date).getTime(),
            //   //   label: {
            //   //     ...prevChartData.options.annotations.xaxis[1].label,
            //   //     text: 'Sprint End Date'
            //   //   }
            //   // }
            // ],

            xaxis: [
              ...prevChartData.options.annotations.xaxis,
              ...xaxisAnnotations
            ]
          },

          yaxis: {
            show: true,
            showForNullSeries: false,
            categories: allBasketNames
          },
          tooltip: {
            custom: ({ series, seriesIndex, dataPointIndex, w }) => {
              const taskDetail =
                w.globals.initialSeries[seriesIndex].data[dataPointIndex]
                  .taskDetail;

              const taskOwners = taskDetail?.taskOwners.join('');
              return `
              <div>
               <span className="mb-0"><strong>Sprint Name:</strong> ${
                 taskDetail.sprint_name || 'null recieved in response'
               }</span></br>
                  <span className="mb-0"><strong>Task Name:</strong> ${
                    taskDetail.task_name
                  }</span></br>
                 <span className="mb-0"><strong>Basket Name:</strong> ${
                   taskDetail.basket_name
                 }</span></br>
              <span className="mb-0"><strong>Task Start Date:</strong> ${new Date(
                taskDetail.task_start_Date
              ).toLocaleDateString()}</span></br>
              <span className="mb-0"><strong>Task End Date:</strong> ${new Date(
                taskDetail.task_end_date
              ).toLocaleDateString()}</span></br>
              <span className="mb-0"><strong>Total Scheduled Hours:</strong> ${
                taskDetail.task_scheduled_Hours || 'null recieved in response'
              }</span></br>
                 <span className="mb-0"><strong>Scheduled Hours:</strong> ${
                   taskDetail.actual_task_scheduled_Hours ||
                   'null recieved in response'
                 }</span></br>
                 <span className="mb-0"><strong>Actual Worked:</strong> ${
                   taskDetail.task_actual_worked || 'null recieved in response'
                 }</span></br>
              <span className="mb-0"><strong>Status:</strong> ${
                taskDetail.task_status || 'null recieved in response'
              }</span></br>
              <span className="mb-0"><strong>Actual Status:</strong> ${
                taskDetail.task_actual_status || 'null recieved in response'
              }</span></br>
                 <span className="mb-0"><strong>Task Owners:</strong> ${taskOwners}</span></br>
              </div>
            `;
            }
          }
        }
      }));
    } catch (error) {
      // const { status } = error?.response;
      setNotify({
        type: 'danger',
        message: `Message:Error while fetching data`
      });
      console.error('Error fetching graph data:', error.message);
    }
  };
  const handleRadioChange = async (event) => {
    setSelectedDropdown(null);
    setSelectedOption(event.target.value);
    setChartData((prevData) => ({
      ...prevData,
      series: [
        {
          name: '',
          data: []
        }
      ]
    }));
    setDropDownData([]);
    const { value } = event.target;
    const splitRange = sprintRange.split('to');
    if (value === 'month') {
      const monthsOfYear = Array.from({ length: 12 }, (_, index) => {
        const date = new Date(2024, index, 1);
        return date.toLocaleString('en-US', { month: 'long' });
      }).map((month, index) => {
        return { value: index, label: month };
      });
      setDropDownData(monthsOfYear);
      const month = new Date(splitRange[0]).getMonth();
      const firstDayOfMonth = new Date(new Date().getFullYear(), month, 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), month + 1, 0);
      await getGraphData(false, lastDayOfMonth, firstDayOfMonth);
    } else if (value === 'year') {
      const year = new Date(splitRange[0]).getFullYear();
      setDropDownData([{ value: 1, label: year }]);
      const firstDayOfYear = new Date(year, 0, 1);
      const lastDayOfYear = new Date(year, 11, 31);
      await getGraphData(false, lastDayOfYear, firstDayOfYear);
    } else if (value === 'week') {
      getGraphData(true);
    }
  };

  function getFirstAndLastDayOfMonth(label) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    const monthIndex = months.indexOf(label);

    if (monthIndex === -1) {
      throw new Error('Invalid month name');
    }

    const year = new Date().getFullYear();
    const firstDayOfMonth = new Date(year, monthIndex, 1);
    const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

    return { firstDayOfMonth, lastDayOfMonth };
  }

  const dropDownHandler = async (event) => {
    const { label } = event;
    setSelectedDropdown(event);
    if (selectedOption === 'week') {
      const currentWeek = event.label.split('-');
      getGraphData(false, currentWeek[0], currentWeek[1]);
    } else if (selectedOption === 'month') {
      const { firstDayOfMonth, lastDayOfMonth } =
        getFirstAndLastDayOfMonth(label);

      await getGraphData(false, lastDayOfMonth, firstDayOfMonth);
    }
  };
  function toggleOpen() {
    setOpen(!open);
  }
  useEffect(() => {
    getGraphData(true);
  }, []);

  return (
    <div className="container-xxl ">
      {notify && <Alert alertData={notify} />}
      <PageHeader headerTitle="Manage Task" paddingStart="3" />
      <TicketCollapse
        ticket={ticketDetails.ticket_id}
        details={ticketDetails.description}
        open={open}
        toggleOpen={toggleOpen}
      />

      <div className="range-bar-chart-container card mt-3">
        <div className="col-12 text-end p-2 d-md-flex align-items-center my-3 justify-content-end d-none">
          <div className="form-check ms-5">
            <input
              className="form-check-input"
              type="radio"
              name="flexRadioDefault"
              id="flexRadioDefault1"
              value="week"
              checked={selectedOption === 'week'}
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
              checked={selectedOption === 'month'}
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
              checked={selectedOption === 'year'}
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
              value={selectedDropDown}
              // defaultValue={dropDownData[0]?.label}
              // ref={sprintDropDownRef}
              // defaultValue={}
            />
          </div>
        </div>

        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="rangeBar"

          // height={500}
        />
      </div>
    </div>
  );
};

export default GraphWeekWise;
