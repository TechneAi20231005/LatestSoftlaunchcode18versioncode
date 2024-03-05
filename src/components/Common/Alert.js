// import React, { useEffect, useState } from 'react'
// import 'react-toastify/dist/ReactToastify.css';
// import { ToastContainer, toast, collapseToast } from 'react-toastify';

// function Alert(props) {

//   const [show, setShow] = useState(true)
//   const [color, setColor] = useState("#42ba96");
//   const notify = () => toast(props.alertData.message);

//   console.log("props",props.alertData.type)
//   console.log("c",color)
//   console.log("al",props.alertData)


//   useEffect(() => {


//     if (props.alertData.type === "success") {
//       setColor("#42ba96");

//     } else if (props.alertData.type === "danger") {
//       setColor("#df4759");
//     } else if (props.alertData.type === "warning") {
//       setColor("#ffc107");
//     } else if (props.alertData.type === "info") {
//       setColor("#467fd0");
//     }
//     notify();
//     // const timeId = setTimeout(() => {
//     //   setShow(false)
//     // }, 3000)
//     // return () => {
//     //   clearTimeout(timeId)
//     // }


//   }, [props.alertData]);


//   return (
//     <>
//       {/* <div className={`alert alert-${props.type}`} role="alert">
//                  {props.message}
//             </div>  
//             <button onClick={notify}>Notify !</button> */}
//       <ToastContainer
//         position="top-right"
//         autoClose={15000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         // type="success"
//         type={props.alertData.type}
//         pauseOnHover
//         toastStyle={{ backgroundColor: `${color}`, color: 'white', fontSize: '18px', zIndex: "100", }}
//       />
//     </>
//   )
// }

// export default Alert


import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Alert({ alertData }) {
  useEffect(() => {
    if (alertData) {
      // Show the toast notification
      toast(alertData.message, {
        type: alertData.type,
        autoClose: 5000, // Adjust as needed
        hideProgressBar: true, // Adjust as needed
        position: "top-right", // Adjust as needed
        style: {
          backgroundColor: getBackgroundColor(alertData.type), // Function to get background color based on type
          color: 'white', // Adjust text color as needed
          fontSize: '18px', // Adjust font size as needed
          zIndex: "100" // Adjust zIndex as needed
        }
      });
    }
  }, [alertData]);

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

  return (
    <ToastContainer />
  );
}

export default Alert;
