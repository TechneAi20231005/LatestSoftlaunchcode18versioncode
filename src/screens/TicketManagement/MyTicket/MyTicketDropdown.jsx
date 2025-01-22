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

  // {
  //   //search results

  //   {
  //     data.created_by === localStorage.getItem('id') ||
  //       data.assign_to_user_id === localStorage.getItem('id') ||
  //       (data.status_name !== 'Solved' &&
  //         data.passed_status !== 'REJECT' &&
  //         localStorage.getItem('account_for' === 'SELF')) ||
  //       (data?.projectowner?.filter(
  //         (d) => d.user_id === localStorage.getItem('id')
  //       ) && (
  //         <li>
  //           <Link
  //             to={`/${_base}/Ticket/Edit/` + data.id}
  //             className="btn btn-sm btn-warning text-white"
  //             style={{ width: '100%', zIndex: '100' }}
  //           >
  //             <i className="icofont-ui-edit"></i> Edit
  //           </Link>
  //         </li>
  //       ));
  //   }

  //   //assigned to me
  //   <li>
  //     <Link
  //       to={`/${_base}/Ticket/Edit/` + data.id}
  //       className="btn btn-sm btn-warning text-white"
  //       style={{ width: '100%', zIndex: '100' }}
  //     >
  //       <i className="icofont-ui-edit"></i> Edit
  //     </Link>
  //   </li>;

  //   ///Your task

  //   {
  //     data.created_by === localStorage.getItem('id') ||
  //       (data.assign_to_user_id === localStorage.getItem('id') && (
  //         <li>
  //           <Link
  //             to={`/${_base}/Ticket/Edit/` + data.id}
  //             className="btn btn-sm btn-warning text-white"
  //             style={{ width: '100%', zIndex: '100' }}
  //           >
  //             <i className="icofont-ui-edit"></i> Edit
  //           </Link>
  //         </li>
  //       ));
  //   }

  //   //createdbye me
  //   //No edit button

  //   //Unpassed ticket
  //   {
  //     data.created_by === localStorage.getItem('id') ||
  //       (data.assign_to_user_id === localStorage.getItem('id') && (
  //         <li>
  //           <Link
  //             to={`/${_base}/Ticket/Edit/` + data.id}
  //             className="btn btn-sm btn-warning text-white"
  //             style={{ width: '100%', zIndex: 100 }}
  //           >
  //             <i className="icofont-ui-edit"></i> Edit
  //           </Link>
  //         </li>
  //       ));
  //   }
  // }

  //'CreatedByMe'
  //'UnPassed'
  //'YouTask'
  //'DepartmentWise'

  const menuBtns = [
    {
      id: 1,
      label: 'Edit',
      type: type,
      conditions: (type) => {
        if (type === "AssignToMe'") {
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
    {}
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
          {/* <RenderIf render={}>
          <li>Edit</li>
          </RenderIf> */}

          <li>
            <i className="icofont-external-link "></i> View
          </li>

          <li>
            <i className="icofont-bucket2"></i>Basket
          </li>

          <li>
            <i className="icofont-tasks"></i> Task
          </li>

          <li>History</li>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
});

export default MyTicketDropdown;
