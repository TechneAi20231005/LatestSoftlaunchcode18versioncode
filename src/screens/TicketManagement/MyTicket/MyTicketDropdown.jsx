import React, { useEffect, useState } from 'react';
import { _base } from '../../../settings/constants';
import { Link, useLocation } from 'react-router-dom';
import { Menu, MenuItem, Button } from '@mui/material';
import UnPassModal from './UnPassModal';
import ConfirmationModal from './confirmationModal';

const MyTicketDropdown = ({
  type,
  data,
  setPagination,
  setColumnFilters,
  pagination
}) => {
  // Edit Button
  const currentUser = Number(localStorage.getItem('id'));
  const ticketCreatedBy = Number(data.created_by?.id) === currentUser;
  const tickedtAssignedto = data.assign_to_user_id === currentUser;
  const doUserHaveBasket =
    data?.basket_configured?.length > 0
      ? data?.basket_configured.find(
          (item) => item.basket_owner === currentUser
        )
      : false;

  const checkNotSolvedAndNotReject =
    data.status?.status !== 'Solved' && data.passed_status !== 'REJECT';

  const userAccountFor = localStorage.getItem('account_for');
  // const isUserProjectOwner = data.projectowner.find(
  //   (item) => item.user_id === currentUser
  // );
  const isUserProjectOwner = false;

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
  const [confirmationModal, setConfirmationModal] = useState({
    showModals: false,
    modalData: '',
    modalsHeader: ''
  });
  const handleConfirmationModal = (data) => {
    setConfirmationModal(data);
  };

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
            ticketCreatedBy ||
            (tickedtAssignedto &&
              checkNotSolvedAndNotReject &&
              userAccountFor === 'SELF')
          );
        } else if (type === 'YourTask') {
          return ticketCreatedBy || tickedtAssignedto;
        } else if (type === 'DepartmentWise') {
          return ticketCreatedBy || tickedtAssignedto;
        } else if (type === 'CreatedByMe') {
          return false;
        } else if (type === 'UnPassed') {
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
          return true;
        } else if (type === 'CreatedByMe') {
          return true;
        } else if (type === 'UnPassed') {
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
            ((data?.created_by?.id !== currentUser &&
              doUserHaveBasket &&
              data?.basket_configured?.length > 0) ||
              (tickedtAssignedto && data?.basket_configured?.length > 0)) &&
            userAccountFor === 'SELF'
          );
        } else if (type === 'YourTask') {
          return (
            data?.created_by?.id !== currentUser &&
            userAccountFor === 'SELF' &&
            data?.basket_configured?.length > 0
          );
        } else if (type === 'DepartmentWise') {
          return false;
        } else if (type === 'CreatedByMe') {
          return (
            data?.created_by?.id !== currentUser &&
            userAccountFor === 'SELF' &&
            data?.basket_configured?.length > 0
          );
        } else if (type === 'UnPassed') {
          return false;
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
            (data?.created_by?.id !== currentUser &&
              data?.basket_configured?.length === 0) ||
            (tickedtAssignedto &&
              userAccountFor === 'SELF' &&
              data?.basket_configured?.length === 0)
          );
        } else if (type === 'YourTask') {
          return false;
        } else if (type === 'DepartmentWise') {
          return false;
        } else if (type === 'CreatedByMe') {
          return false;
        } else if (type === 'UnPassed') {
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
        } else if (type === 'UnPassed') {
          return false;
        }
      }
    },
    {
      id: 5,
      label: 'Pass',
      className: 'btn btn-success text-white',
      redirectLink: '',
      icon: <i className="icofont-checked"></i>,
      type: type,
      isModal: true,
      status: 'PASS',
      conditions: (type) => {
        if (type === 'UnPassed') {
          return true;
        } else if (type === 'AssignToMe') {
          return false;
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
      id: 6,
      label: 'Reject',
      className: 'btn btn-danger  text-white',
      redirectLink: '',
      icon: <i className="icofont-close-squared-alt"></i>,
      type: type,
      status: 'Reject',
      isModal: true,
      conditions: (type) => {
        if (type === 'UnPassed') {
          return true;
        } else if (type === 'AssignToMe') {
          return false;
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
      id: 7,
      label: 'Confirm',
      className: ' btn btn-sm  btn-secondary text-white',
      redirectLink: '',
      type: type,
      isModal: true,
      conditions: (type) => {
        if (type === 'CreatedByMe') {
          return ticketCreatedBy ? true : false;
        } else if (type === 'AssignToMe') {
          return ticketCreatedBy ? true : false;
        } else if (type === 'YourTask') {
          return ticketCreatedBy ? true : false;
        } else if (type === 'DepartmentWise') {
          return ticketCreatedBy ? true : false;
        } else if (type === 'UnPassed') {
          return false;
        }
      }
    }
  ];

  return (
    <>
      <Button
        id="basic-button"
        style={{ height: '30px', width: '35px' }}
        className="btn btn-primary text-white"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <i className="icofont-listine-dots"></i>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClosed}
        sx={{ '& .MuiPaper-root': { width: '140px' } }}
      >
        {menuBtns.map((menuBtn, idx) => {
          return (
            menuBtn.conditions(menuBtn.type) && (
              <MenuItem key={idx} onClick={handleClosed}>
                {type === 'UnPassed' && menuBtn?.isModal ? (
                  <button
                    className={menuBtn.className}
                    style={{ width: '100%' }}
                    disabled={data?.passed_status !== 'UNPASS'}
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
                ) : type === 'CreatedByMe' && menuBtn?.isModal ? (
                  <button
                    className={menuBtn.className}
                    style={{ width: '100%' }}
                    onClick={() =>
                      handleConfirmationModal({
                        showModal: true,
                        modalData: data,
                        modalHeader: 'Solve Ticket'
                      })
                    }
                  >
                    {menuBtn.icon} {menuBtn.label}
                  </button>
                ) : (
                  <Link
                    to={menuBtn.redirectLink}
                    className={menuBtn.className}
                    style={{ width: '100%' }}
                  >
                    {menuBtn.icon}
                    {menuBtn.label}
                  </Link>
                )}
              </MenuItem>
            )
          );
        })}
      </Menu>

      {remarkModal.showModal && (
        <UnPassModal
          remarkModal={remarkModal}
          handleRemarkModal={handleRemarkModal}
          setPagination={setPagination}
          setColumnFilters={setColumnFilters}
          pagination={pagination}
        />
      )}
      {confirmationModal.showModal && (
        <ConfirmationModal
          confirmationModal={confirmationModal}
          handleConfirmationModal={handleConfirmationModal}
          setPagination={setPagination}
          setColumnFilters={setColumnFilters}
          pagination={pagination}
        />
      )}
    </>
  );
};

export default MyTicketDropdown;
