import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { RenderIf } from '../../../utils';
import { _base } from '../../../settings/constants';
import { Link, useLocation } from 'react-router-dom';

const MyTicketDropdown = React.memo(({ type, data }) => {
  // Edit Button
  const currentUser = localStorage.getItem('id');
  const ticketCreatedBy = data.created_by === currentUser;
  const tickedtAssignedto = data.assign_to_user_id === currentUser;
  const checkNotSolvedAndNotReject =
    data.status_name !== 'Solved' && data.passed_status !== 'REJECT';
  const userAccountFor = localStorage.getItem('account_for');
  // const isUserProjectOwner = data.projectowner.find(
  //   (item) => item.user_id === currentUser
  // );
  const isUserProjectOwner = false;
  console.log('My ticket hamburger rendered');

  const menuBtns = [
    {
      id: 1,
      label: 'Edit',
      type: type,
      redirectLink: `/${_base}/Ticket/Edit/` + data.id,
      className: 'btn btn-sm btn-warning text-white',
      icon: <i className="icofont-ui-edit"></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return (
            currentUser === ticketCreatedBy ||
            currentUser === tickedtAssignedto ||
            (checkNotSolvedAndNotReject && userAccountFor === 'SELF') ||
            isUserProjectOwner
          );
        } else if (type === 'YouTask') {
          return (
            currentUser === ticketCreatedBy || currentUser === tickedtAssignedto
          );
        } else if (type === 'DepartmentWise') {
          return true;
        } else if (type === 'CreatedByMe') {
          return false;
        }
      }
    },
    {
      id: 2,
      label: 'View',
      type: type,
      redirectLink: `/${_base}/Ticket/View/` + data.id,
      className: 'btn btn-sm btn-info text-white',
      icon: <i className="icofont-external-link "></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return true;
        } else if (type === 'YouTask') {
          return true;
        } else if (type === 'DepartmentWise') {
          return false;
        } else if (type === 'CreatedByMe') {
          return true;
        }
      }
    },
    {
      id: 3,
      label: 'Task',
      type: type,
      redirectLink: `/${_base}/Ticket/Task/` + data.id,
      className: 'btn btn-sm btn-outline-primary',
      icon: <i className="icofont-tasks"></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return (
            ((ticketCreatedBy !== currentUser && data.basket_configured > 0) ||
              (tickedtAssignedto === currentUser &&
                data.basket_configured > 0)) &&
            userAccountFor === 'SELF'
          );
        } else if (type === 'YouTask') {
          return (
            ticketCreatedBy !== currentUser &&
            userAccountFor === 'SELF' &&
            data.basket_configured > 0
          );
        } else if (type === 'DepartmentWise') {
          return true;
        } else if (type === 'CreatedByMe') {
          return (
            ticketCreatedBy !== currentUser &&
            userAccountFor === 'SELF' &&
            data.basket_configured > 0
          );
        }
      }
    },
    {
      id: 4,
      label: 'Basket',
      type: type,
      redirectLink: `/${_base}/Ticket/Basket/` + data.id,
      className: 'btn btn-sm btn-primary text-white',
      icon: <i className="icofont-bucket2"></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return (
            ((ticketCreatedBy !== currentUser &&
              data.basket_configured === 0) ||
              (tickedtAssignedto === currentUser &&
                data.basket_configured === 0)) &&
            userAccountFor === 'SELF'
          );
        } else if (type === 'YouTask') {
          return false;
        } else if (type === 'DepartmentWise') {
          return false;
        } else if (type === 'CreatedByMe') {
          return false;
        }
      }
    },
    {
      id: 5,
      label: 'History',
      className: 'btn btn-sm btn-primary text-white',
      redirectLink: `/${_base}/TicketHistory/` + data.id,
      icon: <i className="icofont-history"></i>,
      type: type,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return true;
        } else if (type === 'YouTask') {
          return false;
        } else if (type === 'DepartmentWise') {
          return true;
        } else if (type === 'CreatedByMe') {
          return true;
        }
      }
    }
  ];

  return (
    <>
      <Dropdown className="d-inline-flex m-1">
        <Dropdown.Toggle
          as="button"
          variant=""
          className="btn btn-primary text-white"
        >
          <i className="icofont-listine-dots"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu as="ul" className="border-0 shadow p-1">
          {menuBtns.map((menuBtn, idx) => {
            return (
              <RenderIf render={menuBtn.conditions(menuBtn.type)}>
                <li>
                  <Link
                    to={menuBtn.redirectLink}
                    className={`d-flex justify-content-center align-items-center ${menuBtn.className}`}
                    style={{ width: '100%', zIndex: 100 }}
                  >
                    <span className="d-flex align-items-center gap-2">
                      {menuBtn?.icon}
                      {menuBtn.label}
                    </span>
                  </Link>
                </li>
              </RenderIf>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});

export default MyTicketDropdown;
