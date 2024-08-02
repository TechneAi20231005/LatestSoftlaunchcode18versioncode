import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Alert({ alertData }) {
  const existingToast = toast.isActive(alertData.message);
  useEffect(() => {
    if (alertData) {
      if (!existingToast) {
        // Show the toast notification
        toast(alertData.message, {
          type: alertData.type,
          autoClose: 10000, // Adjust as needed
          hideProgressBar: true, // Adjust as needed
          position: 'top-right', // Adjust as needed

          style: {
            backgroundColor: getBackgroundColor(alertData.type), // Function to get background color based on type
            color: 'white', // Adjust text color as needed
            fontSize: '18px', // Adjust font size as needed
            zIndex: '100' // Adjust zIndex as needed
          },
          toastId: alertData.message
        });
      }
    }
  }, [alertData, existingToast]);

  // Function to get background color based on type
  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return '#42ba96'; // Green color for success
      case 'danger':
        return '#df4759'; // Red color for danger
      case 'warning':
        return '#ffc107'; // Yellow color for warning
      case 'info':
        return '#467fd0'; // Blue color for info
      default:
        return '#42ba96'; // Default color
    }
  };

  return <ToastContainer />;
}

export default Alert;
