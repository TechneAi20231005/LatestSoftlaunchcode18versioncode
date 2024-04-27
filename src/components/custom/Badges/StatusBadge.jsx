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
  return (
    <>
      <Badge
        bg={
          type === 'primary'
            ? 'primary'
            : type === 'success'
            ? 'success'
            : type === 'warning'
            ? 'warning'
            : 'danger'
        }
        className="px-3 py-1"
      >
        {name}
      </Badge>
    </>
  );
};
