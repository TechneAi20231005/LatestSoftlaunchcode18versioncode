import React, { useState } from 'react';

import ErrorLogService from '../../services/ErrorLogService';
import ReportService from '../../services/ReportService/ReportService';
import PageHeader from '../../components/Common/PageHeader';
import Chart from 'react-apexcharts';

export default function TimelineReportComponent() {
  const [chart, setChart] = useState(null);

  const handleForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await new ReportService()
      .getTimeLineReport(formData)
      .then((res) => {
        if (res.status === 200) {
          if (res.data.status === 1) {
            const data = res.data.data;
            setChart(data);
          } else {
            setChart(null);
          }
        } else {
          new ErrorLogService().sendErrorLog(
            'TimelineReport',
            'Get_TimelineReport',
            'INSERT',
            res.message
          );
        }
      })
      .catch((error) => {
        const { response } = error;
        const { request, ...errorObject } = response;
        new ErrorLogService().sendErrorLog(
          'TimelineReport',
          'Get_TimelineReport',
          'INSERT',
          errorObject.data.message
        );
      });
  };

  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Timeline Report" />

      <div className="card mt-2">
        <div className="card-body">
          <form onSubmit={handleForm}>
            <div className="row">
              <div className="col-md-3">
                <label htmlFor="" className="">
                  <b>Ticket Id :</b>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  name="ticket_id"
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-sm btn-warning"
                  type="submit"
                  style={{ marginTop: '20px' }}
                >
                  <i class="icofont-search-1"></i>
                </button>
                <button
                  className="btn btn-sm btn-info"
                  type="button"
                  onClick={() => window.location.reload(false)}
                  style={{ marginTop: '20px' }}
                >
                  <i class="icofont-refresh"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card mt-2">
        <div className="card-body">
          {chart && (
            <Chart
              options={chart.options}
              series={chart.series}
              type="rangeBar"
              height={chart.options.height}
            />
          )}
        </div>
      </div>
    </div>
  );
}
