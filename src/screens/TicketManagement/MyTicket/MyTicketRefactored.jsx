import React, { useEffect } from 'react';
import PageHeader from '../../../components/Common/PageHeader';
import MyTicketFilters from './MyTicketFilters';
import MyTicketsTab from './MyTicketsTab';

const MyTicketRefactored = () => {
  return (
    <>
      <PageHeader headerTitle="My Ticket" />
      <MyTicketsTab />
    </>
  );
};

export default MyTicketRefactored;
