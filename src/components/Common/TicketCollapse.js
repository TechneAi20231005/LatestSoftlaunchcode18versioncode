import React from 'react';
import { Button, Collapse } from 'react-bootstrap';

const TicketCollapse = ({ ticket, open, toggleOpen }) => {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <div className="d-flex align-items-center gap-2">
          <strong className="text-primary fs-5"> Ticket - {ticket}</strong>
          <Button
            className="bg-light border-0"
            onClick={toggleOpen}
            aria-controls="example-collapse-text"
            aria-expanded={open}
          >
            <i
              className={`fs-4 text-primary icofont-eye${
                open ? '-blocked' : ''
              }`}
            ></i>
          </Button>
        </div>
        <Collapse in={open}>
          <div id="example-collapse-text">
            <p className="mt-1 mb-0 fw-bold">Ticket Details :</p>
            <span>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Explicabo blanditiis ut optio alias assumenda enim ratione iste
              repellat. Voluptates quia, animi facilis eos corrupti non vel
              fugit ratione et dolore?
            </span>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default TicketCollapse;
