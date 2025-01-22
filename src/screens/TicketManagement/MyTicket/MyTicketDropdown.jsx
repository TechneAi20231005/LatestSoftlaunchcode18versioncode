import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { RenderIf } from '../../../utils';

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
                <li>{menuBtn.label}</li>
              </RenderIf>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});

export default MyTicketDropdown;
