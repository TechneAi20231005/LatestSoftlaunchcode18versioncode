import React from 'react';
import { Container } from 'react-bootstrap';
import PageHeader from '../../../components/Common/PageHeader';
import Select from 'react-select';
import TabComponent from './Components/TabComponent';
import MetricsPanel from './Components/MetricsPanel';

export default function MonthlyAttendance() {
  const months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' }
  ];

  return (
    <>
      <Container fluid>
        <PageHeader
          headerTitle="Monthly Attendance"
          renderRight={() => (
            <div className="col-sm-2">
              <Select
                classNamePrefix="react-select"
                options={months}
                isClearable
                id="country_id"
                name="country_id"
              />
            </div>
          )}
        />
      </Container>

      <>
        <TabComponent />
      </>

      <MetricsPanel />
    </>
  );
}
