import React from 'react';
import { Badge } from 'react-bootstrap';

function StatusBadge({ status }) {
  return (
    <>
      <Badge bg={status === 1 ? 'primary' : 'danger'} className="px-3 py-1">
        {status === 1 ? 'Active' : 'Deactivate'}
      </Badge>
    </>
  );
}

export default StatusBadge;
