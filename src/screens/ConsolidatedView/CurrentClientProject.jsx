import React, { useState, useEffect } from 'react';
import { _base } from '../../settings/constants';
import { ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import DataTable from 'react-data-table-component';
import ListGroup from 'react-bootstrap/ListGroup';
import ConsolidatedService from '../../services/ProjectManagementService/ConsolidatedService';

export default function CurrentClientProject(props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (e) => {
    setIsOpen((prev) => !prev);
  };
  var colors = [
    'light-info-bg',
    'bg-lightgreen',
    'bg-lightyellow',
    'light-success-bg',
    'light-orange-bg',
    'bg-lightblue',
    'bg-lightgreen',
    'light-success-bg',
    'light-orange-bg'
  ];
  return (
    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6 mb-4 mt-3">
      <div className="card" style={{ borderRadius: '10px', width: '100%' }}>
        <div
          className="card-body shadow-lg p-4"
          style={{ borderRadius: '10px' }}
        >
          <div className="d-flex align-items-center justify-content-between mt-5 ">
            <div className="lesson_name">
              <div
                className={`project-block ${
                  colors[Math.floor(Math.random() * colors.length)]
                }`}
              >
                <i class="icofont-bag-alt"></i>
              </div>

              <h6 className="mb-0 fw-bold  fs-6  mb-2">
                {props.data.project_name}

                <Link
                  to={
                    `/${_base}/ConsolidatedView/ProjectwiseModule/` +
                    props.data.id
                    //  +
                    // '/'
                    // +
                    // e.id
                  }
                >
                  <i
                    title="Upload project wise document"
                    className="icofont-upload-alt p-2 "
                  ></i>
                </Link>
              </h6>
            </div>
          </div>
          <div className="row g-2">
            <div className="col-6">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i class="icofont-ticket"></i>
                    <Link to={`/${_base}/completedTickets/` + props.data.id}>
                      <span className="ms-2">
                        {props.data.details.ticket.COMPLETED} Completed Tickets
                      </span>
                    </Link>
                  </div>
                </div>{' '}
                {/* col */}
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i class="icofont-sand-clock"></i>
                    <Link to={`/${_base}/pendingTickets/` + props.data.id}>
                      <span className="ms-2">
                        {props.data.details.ticket.PENDING} Pending Tickets
                      </span>
                    </Link>
                  </div>
                </div>
                {/* col */}
              </div>
            </div>

            <div className="col-6">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i class="icofont-bomb"></i>
                    <Link to={`/${_base}/DelayedTasks/` + props.data.id}>
                      <span className="ms-2">
                        {props.data.details.task.DELAYED} Delayed Tasks
                      </span>
                    </Link>
                  </div>
                </div>{' '}
                {/* col */}
                <div className="col-12">
                  <div className="d-flex align-items-center">
                    <i class="icofont-tasks"></i>
                    <Link to={`/${_base}/PendingTasks/` + props.data.id}>
                      <span className="ms-2">
                        {props.data.details.task.PENDING} Pending Tasks
                      </span>
                    </Link>
                  </div>
                </div>
                {/* col */}
              </div>
            </div>
          </div>

          <div className="dividers-block mb-4"></div>
          <div className=" d-flex justify-content-start">
            <button
              onClick={(e) => handleOpen()}
              className="btn btn-outline-warning btn-sm "
              aria-controls={props.data.project_id}
              aria-expanded={isOpen}
            >
              <i
                className="icofont-tasks-alt p-2"
                style={{ fontSize: '20px' }}
              ></i>
            </button>
            <h6 className=" fw-bold p-2">View Module</h6>
          </div>
          {props.data.project_modules
            .filter((d) => d.is_active === 1)
            .map((e, i) => {
              return (
                <Collapse in={isOpen} className="mt-2">
                  <div id={e.id}>
                    <ListGroup
                      className="list-group mb-2"
                      style={{ textAlign: 'left' }}
                    >
                      <Link
                        to={
                          `/${_base}/ConsolidatedView/ProjectwiseModule/` +
                          props.data.id +
                          '/' +
                          e.id
                        }
                      >
                        <ListGroup.Item>
                          {i + 1}. {e.module_name}{' '}
                        </ListGroup.Item>
                      </Link>
                    </ListGroup>
                  </div>
                </Collapse>
              );
            })}
        </div>
      </div>
    </div>
  );
}
