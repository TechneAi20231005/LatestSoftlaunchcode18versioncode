import React, { useState } from "react";
import Chart from "react-apexcharts";
import Avatar from "react-avatar";
const GraphWeekWise = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "TODO",
        data: [
          {
            x: "BASKET 1",
            y: [
              new Date("2019-03-05").getTime(),
              new Date("2019-03-08").getTime(),
            ],
          },
          {
            x: "BASKET 2",
            y: [
              new Date("2019-03-02").getTime(),
              new Date("2019-03-05").getTime(),
            ],
          },
          {
            x: "BASKET 2",
            y: [
              new Date("2019-03-05").getTime(),
              new Date("2019-03-07").getTime(),
            ],
          },
          {
            x: "BASKET 3",
            y: [
              new Date("2019-03-03").getTime(),
              new Date("2019-03-09").getTime(),
            ],
          },
          {
            x: "BASKET 3",
            y: [
              new Date("2019-03-08").getTime(),
              new Date("2019-03-11").getTime(),
            ],
          },
          {
            x: "BASKET 4",
            y: [
              new Date("2019-03-11").getTime(),
              new Date("2019-03-16").getTime(),
            ],
          },
          {
            x: "BASKET 1",
            y: [
              new Date("2019-03-01").getTime(),
              new Date("2019-03-03").getTime(),
            ],
          },
        ],
      },
      {
        name: "PLAYED",
        data: [
          {
            x: "BASKET 1",
            y: [
              new Date("2019-03-02").getTime(),
              new Date("2019-03-05").getTime(),
            ],
          },
          {
            x: "BASKET 3",
            y: [
              new Date("2019-03-06").getTime(),
              new Date("2019-03-16").getTime(),
            ],
            goals: [
              {
                name: "Break",
                value: new Date("2019-03-10").getTime(),
                strokeColor: "#CD2F2A",
              },
            ],
          },
          {
            x: "BASKET 2",
            y: [
              new Date("2019-03-03").getTime(),
              new Date("2019-03-07").getTime(),
            ],
          },
          {
            x: "BASKET 5",
            y: [
              new Date("2019-03-20").getTime(),
              new Date("2019-03-22").getTime(),
            ],
          },
          {
            x: "BASKET 1",
            y: [
              new Date("2019-03-10").getTime(),
              new Date("2019-03-16").getTime(),
            ],
          },
        ],
      },
      {
        name: "COMPLETED",
        data: [
          {
            x: "BASKET 2",
            y: [
              new Date("2019-03-10").getTime(),
              new Date("2019-03-17").getTime(),
            ],
          },
          {
            x: "BASKET 4",
            y: [
              new Date("2019-03-05").getTime(),
              new Date("2019-03-09").getTime(),
            ],
            goals: [
              {
                name: "Break",
                value: new Date("2019-03-07").getTime(),
                strokeColor: "#282c34",
              },
            ],
          },
        ],
      },
      {
        name: "MIN DELAY",
        data: [
          {
            x: "Basket 4",
            y: [
              new Date("2019-03-10").getTime(),
              new Date("2019-03-17").getTime(),
            ],
          },
          {
            x: "BASKET 4",
            y: [
              new Date("2019-03-05").getTime(),
              new Date("2019-03-09").getTime(),
            ],
            goals: [
              {
                name: "Break",
                value: new Date("2019-03-07").getTime(),
                strokeColor: "#CD2F2A",
              },
            ],
          },
        ],
      },
      {
        name: "MAX DELAY",
        data: [
          {
            x: "BASKET 4",
            y: [
              new Date("2019-03-10").getTime(),
              new Date("2019-03-17").getTime(),
            ],
          },
          {
            x: "BASKET 4",
            y: [
              new Date("2019-03-05").getTime(),
              new Date("2019-03-09").getTime(),
            ],
            goals: [
              {
                name: "Break",
                value: new Date("2019-03-07").getTime(),
                strokeColor: "#CD2F2A",
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
        type: "solid",
        opacity: 0.6,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
      },
      annotations: {
        xaxis: [
          {
            x: new Date("2019-03-10").getTime(),
            borderColor: "#C3F5FF",
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
  {
  }
  return (
    <div>
      <div className="col-9">{<Avatar name="Amit Solanki" round />}</div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="rangeBar"
        height={700}
      />
    </div>
  );
};

export default GraphWeekWise;
