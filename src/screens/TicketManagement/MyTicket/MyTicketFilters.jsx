import React, { useEffect } from 'react';
import PageHeader from '../../../components/Common/PageHeader';
import MyTicketFilters from './MyTicketFilters';
import MyTicketsTab from './MyTicketsTab';

const MyTicketRefactored = () => {
  return (
    <>
      <div className="container-fluid">
      <PageHeader headerTitle="My Ticket" />
      <MyTicketsTab />
      </div>
    </>
  );
};

export default MyTicketRefactored;
