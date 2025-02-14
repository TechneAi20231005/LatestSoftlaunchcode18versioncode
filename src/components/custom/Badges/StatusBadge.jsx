import React from 'react';
import { Badge } from 'react-bootstrap';

function StatusBadge({ status }) {
  return (
    <>
      <Badge bg={status === 1 ? 'primary' : 'danger'} className="px-3 py-1">
        {status === 1 ? 'Active' : 'Deactive'}
      </Badge>
    </>
  );
}

export default StatusBadge;

export const ApplicationStatusBadge = ({ type, name }) => {
  const style = {
    minWidth: '100px'
  };
  return (
    <>
      <Badge bg={type} className="px-3 py-1" style={style}>
        {name}
      </Badge>
    </>
  );
};
