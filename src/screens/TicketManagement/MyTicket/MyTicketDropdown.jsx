import React, {useState} from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { RenderIf } from '../../../utils';
import { _base } from '../../../settings/constants';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuItem, Button } from '@mui/material';
import UnPassModal from './UnPassModal';

const MyTicketDropdown = React.memo(({ type, data, setPagination, setColumnFilters }) => {
  // Edit Button
  const currentUser = localStorage.getItem('id');
  const ticketCreatedBy = Number(data.created_by?.id) === currentUser;
  const tickedtAssignedto = data.assign_to_user_id === currentUser;
  const checkNotSolvedAndNotReject =
    data.status_name !== 'Solved' && data.passed_status !== 'REJECT';
  const userAccountFor = localStorage.getItem('account_for');
  // const isUserProjectOwner = data.projectowner.find(
  //   (item) => item.user_id === currentUser
  // );
  const isUserProjectOwner = false;
  // console.log('My ticket hamburger rendered');
  console.log(type,"type")

  const [anchorEl, setAnchorEl] = React.useState(null);
   const open = Boolean(anchorEl);
   const handleClick = (event) => {
     setAnchorEl(event.currentTarget);
   };
   const handleClosed = () => {
     setAnchorEl(null);
   };

   const handleRemarkModal = (data) => {
    setRemarkModal(data);
  };

     const [remarkModal, setRemarkModal] = useState({
       showModal: false,
       modalData: '',
       modalHeader: ''
     });

  const menuBtns = [
    {
      id: 1,
      label: 'Edit',
      type: type,
      redirectLink: `/${_base}/Ticket/Edit/` + data.id,
      className: 'btn btn-sm btn-warning text-white',
      isModal: false,
      icon: <i className="icofont-ui-edit"></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return (
            currentUser === ticketCreatedBy ||
            currentUser === tickedtAssignedto ||
            (checkNotSolvedAndNotReject && userAccountFor === 'SELF') ||
            isUserProjectOwner
          );
        } else if (type === 'YourTask') {
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
      isModal: false,
      className: 'btn btn-sm btn-info text-white',
      icon: <i className="icofont-external-link "></i>,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return true;
        } else if (type === 'YourTask') {
          return true;
        } else if (type === 'DepartmentWise') {
          return false;
        } else if (type === 'CreatedByMe') {
          return true;
        }else if (type === 'UnPassed') {
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
      isModal: false,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return (
            ((ticketCreatedBy !== currentUser && data.basket_configured > 0) ||
              (tickedtAssignedto === currentUser &&
                data.basket_configured > 0)) &&
            userAccountFor === 'SELF'
          );
        } else if (type === 'YourTask') {
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
      isModal: false,
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
        } else if (type === 'YourTask') {
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
      isModal: false,
      conditions: (type) => {
        if (type === 'AssignToMe') {
          return true;
        } else if (type === 'YourTask') {
          return false;
        } else if (type === 'DepartmentWise') {
          return true;
        } else if (type === 'CreatedByMe') {
          return true;
        }
      }
    },
     {
      id: 5,
      label: 'Pass',
     className:"btn btn-success text-white",
      redirectLink: '' ,
      icon: <i className="icofont-checked"></i>,
      type: type,
      isModal: true,
      status: 'PASS',
      conditions: (type) => {
        if(type === "UnPassed"){
          return true;
      }else return false;
    }
    },
    {
      id: 6,
      label: 'Reject',
     className:"btn btn-danger  text-white",
      redirectLink: '',
      icon:   <i className="icofont-close-squared-alt"></i>,
      type: type,
      status: 'Reject',
      isModal: true,
      conditions: (type) => {
        if(type === "UnPassed"){
          return true;
      }else return false;
    }
    },

  ];

  return (
    <>
   <Button
        id="basic-button"
        style={{ height: "30px", width: "35px" }}
        className="btn btn-primary text-white"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <i className="icofont-listine-dots"></i>
      </Button>

      {/* MUI Menu Component */}
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClosed}
        sx={{'& .MuiPaper-root': {width: '140px'}}}
        // MenuListProps={{
        //   'aria-labelledby': 'basic-button',
        // }}
      >
        {menuBtns.filter((btn) => btn.conditions(type)).length === 0 && (
  <MenuItem disabled>No actions available</MenuItem>
)}
        {menuBtns.map((menuBtn, idx) => (
          menuBtn.conditions(menuBtn.type) && (
            <MenuItem key={idx} onClick={handleClosed}>
              {
                 type === "UnPassed" ?
                <button
                  className={menuBtn.className}
                  style={{ width: '100%', }}
                  disabled={data?.passed_status !== "UNPASS"}
                  onClick={() =>
                    handleRemarkModal({
                      showModal: true,
                      modalData: data,
                      modalHeader: 'Enter Remark',
                      status: menuBtn.status
                    })
                  }
                >
                  {menuBtn.icon} {menuBtn.label}
                </button>
                :
                <Link
                to={menuBtn.redirectLink}
                className={menuBtn.className}
                style={{  width: '100%' }}
              >
                {menuBtn.icon}
                {menuBtn.label}
              </Link>
              }
            </MenuItem>
          )
        ))}
      </Menu>

      {
              remarkModal.showModal && <UnPassModal
              remarkModal={remarkModal}
              handleRemarkModal={handleRemarkModal}
              setPagination={setPagination}
              setColumnFilters={setColumnFilters}
            />
            }
      {/* <Dropdown className="d-inline-flex m-1">
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
      </Dropdown> */}
    </>
  );
});

export default MyTicketDropdown;
