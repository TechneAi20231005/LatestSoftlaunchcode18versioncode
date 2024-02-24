import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, collapseToast } from 'react-toastify';

function Alert(props) {

  const [show, setShow] = useState(true)
  const [color, setColor] = useState("#42ba96");
  const notify = () => toast(props.alertData.message);

  useEffect(() => {


    if (props.alertData.type === "success") {
      setColor("#42ba96");

    } else if (props.alertData.type === "danger") {
      setColor("#df4759");
    } else if (props.alertData.type === "warning") {
      setColor("#ffc107");
    } else if (props.alertData.type === "info") {
      setColor("#467fd0");
    }
    notify();
    // const timeId = setTimeout(() => {
    //   setShow(false)
    // }, 3000)
    // return () => {
    //   clearTimeout(timeId)
    // }


  }, [props.alertData]);


  return (
    <>
      {/* <div className={`alert alert-${props.type}`} role="alert">
                 {props.message}
            </div>  
            <button onClick={notify}>Notify !</button> */}
      <ToastContainer
        position="top-right"
        autoClose={15000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        type="success"
        pauseOnHover
        toastStyle={{ backgroundColor: `${color}`, color: 'white', fontSize: '18px', zIndex: "100", }}
      />
    </>
  )
}

export default Alert
