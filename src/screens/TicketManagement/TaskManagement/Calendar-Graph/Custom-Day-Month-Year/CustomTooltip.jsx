import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const CustomTooltip = ({ event }) => {
  const {
    taskName,
    scheduledHours,
    basketName,
    start,
    end,
    actualWorked,
    actualStatus,
  } = event;

  return (
    <OverlayTrigger
      key="tooltip"
      placement="top"
      overlay={
        <Tooltip id={`tooltip-${event.id}`}>
          <div>
            <div>
              <strong>Sprint Name:</strong> {event.title}
            </div>
            <div>
              <strong>Task Name:</strong> {taskName}
            </div>
            <div>
              <strong>Basket Name:</strong> {basketName}
            </div>
            <div>
              <strong>Start Date:</strong> {start}
            </div>
            <div>
              <strong>End Date:</strong> {end}
            </div>
            <div>
              <strong>Scheduled Hours:</strong> {scheduledHours}
            </div>
            <div>
              <strong>Actual Worked:</strong>{" "}
              {actualWorked ? actualWorked : "00:00:00"}
            </div>
            <div>
              <strong>Status:</strong> {actualStatus}
            </div>
          </div>
        </Tooltip>
      }
    >
      <div>{event.title}</div>
    </OverlayTrigger>
  );
};

export default CustomTooltip;
