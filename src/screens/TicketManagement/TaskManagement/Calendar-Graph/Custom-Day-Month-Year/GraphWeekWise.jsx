import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Avatar from "react-avatar";
import SprintService from "../../../../../services/TicketService/SprintService";
const GraphWeekWise = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "TODO",
        data: [
          {
            x: "BASKET 1",
            y: [
              {
                x: new Date("2019-03-05").getTime(),
                y: new Date("2019-03-08").getTime(),
              },
            ],
          },
          {
            x: "BASKET 1",
            y: [
              {
                x: new Date("2019-03-08").getTime(),
                y: new Date("2019-03-10").getTime(),
              },
            ],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 450,
        type: "rangeBar",
        // stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "80%",
        },
      },
      xaxis: {
        type: "datetime",
      },
      stroke: {
        width: 1,
      },
      fill: {
        type: "pattern",
        opacity: 1,
        pattern: {
          style: [
            "circles",
            "slantedLines",
            "verticalLines",
            "horizontalLines",
          ], // string or array of strings
        },
      },
      stroke: {
        show: true,
        curve: "straight",
        lineCap: "butt",
        colors: undefined,
        width: 2,
        dashArray: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      grid: {
        show: true,
        borderColor: "#90A4AE",
        strokeDashArray: 25,
      },
      annotations: {
        xaxis: [
          {
            x: new Date("2019-03-10").getTime(),
            borderColor: "#C3F5FF",
            strokeDashArray: 1,
            borderColor: "#c2c2c2",
            fillColor: "#c2c2c2",
            label: {
              style: {
                color: "#C3F5FF",
                height: 450,
              },
              text: "Sprint End Date",
            },
          },
        ],
      },
      tooltip: {
        custom: function ({ series, seriesIndex }) {
          console.log("seriesIndex", seriesIndex);
          console.log("series", series);
          return '<div class="p-4">' + "<span>" + "Amit" + "</span>" + "</div>";
        },
      },
    },
  });

  const [graphData, setGraphData] = useState({
    data: {
      DELAY: [
        {
          id: 37505,
          ticket_id: "TT19753",
          basket_id: 6943,
          basket_name: "Priyanka",
          task_name: "TT19753 - KT for Department wise AOP Approval Plan",
          task_priority: "High",
          task_creation_Date: "2024-03-01 17:28:43",
          task_start_Date: "2024-03-18",
          task_end_date: "2024-03-18",
          task_scheduled_Hours: "03:00",
          task_actual_worked: null,
          task_completed_at: "2024-03-19 07:34:19",
          task_status: "COMPLETED",
          task_actual_status: "DELAY",
          updated_at: "2024-03-08 09:24:46",
          sprint_name: "First Sprint",
          time_history: [],
          taskOwners: [
            "Priyanka Gole",
            "Prathamesh Kulkarni",
            "Preeti123 Bokade",
            "Punam Shinde",
            "Amreen Shaikh",
            "Krushna Patare",
          ],
        },
        {
          id: 38752,
          ticket_id: "TT19753",
          basket_id: 7211,
          basket_name: "sprint amreen",
          task_name: "Sprint Task2",
          task_priority: "Low",
          task_creation_Date: "2024-03-28 17:01:03",
          task_start_Date: "2024-03-19",
          task_end_date: "2024-03-20",
          task_scheduled_Hours: "02:00",
          task_actual_worked: "00:00:03",
          task_completed_at: "2024-03-28 17:04:02",
          task_status: "COMPLETED",
          task_actual_status: "DELAY",
          updated_at: "2024-03-28 17:04:02",
          sprint_name: "First Sprint",
          time_history: [
            {
              id: 70109,
              start_time: "2024-03-28 17:03:32",
              stop_time: "2024-03-28 17:03:35",
            },
          ],
          taskOwners: ["Amreen Shaikh"],
        },
        {
          id: 38755,
          ticket_id: "TT19753",
          basket_id: 7211,
          basket_name: "sprint amreen",
          task_name: "Sprint Testing",
          task_priority: "Low",
          task_creation_Date: "2024-04-08 13:10:52",
          task_start_Date: "2024-04-08",
          task_end_date: "2024-04-09",
          task_scheduled_Hours: "01:00",
          task_actual_worked: null,
          task_completed_at: null,
          task_status: "TO_DO",
          task_actual_status: "DELAY",
          updated_at: null,
          sprint_name: "8 April 2024",
          time_history: [],
          taskOwners: [],
        },
        {
          id: 38756,
          ticket_id: "TT19753",
          basket_id: 7211,
          basket_name: "sprint amreen",
          task_name: "Sprint Testingg",
          task_priority: "Low",
          task_creation_Date: "2024-04-08 13:12:15",
          task_start_Date: "2024-04-08",
          task_end_date: "2024-04-09",
          task_scheduled_Hours: "01:00",
          task_actual_worked: null,
          task_completed_at: null,
          task_status: "TO_DO",
          task_actual_status: "DELAY",
          updated_at: null,
          sprint_name: "8 April 2024",
          time_history: [],
          taskOwners: ["Amreen Shaikh"],
        },
      ],
      COMPLETED: [],
      IN_PROGRESS: [],
      TO_DO: [],
    },
  });

  const getGraphData = async () => {
    try {
      await new SprintService()
        .getGraphDataForSprint("17664", "2024-04-20", "2024-05-29")
        .then((res) => {
          console.log("graphData", res.data.data);
        });
    } catch (error) {}
  };
  useEffect(() => {
    getGraphData();
  }, []);

  return (
    <div>
      <div className="col-9">{<Avatar name="Amit Solanki" round />}</div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="rangeBar"
        height={600}
      />
    </div>
  );
};

export default GraphWeekWise;
