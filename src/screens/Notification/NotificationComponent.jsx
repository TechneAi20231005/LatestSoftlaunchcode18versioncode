import React, { useState, useEffect } from 'react'
import PageHeader from "../../components/Common/PageHeader";
import { getAllNotification, markedReadNotification } from '../../services/NotificationService/NotificationService'
import { Link } from "react-router-dom";
import { _base, userSessionData } from "../../settings/constants";

export default function NotificationComponent() {
  const [notifications, setNotifications] = useState();

  const getNotifications = () => {
    getAllNotification(localStorage.getItem('id')).then(res => {
      if (res.status === 200) {
        setNotifications(null);
        setNotifications(res.data.data);
      }
    });
  }
  const handleReadNotification = (e, id) => {
    markedReadNotification(id).then(res => {
      getNotifications();
    })
  }
  useEffect(() => {
    getNotifications();
  }, [])
  return (
    <div className="container-xxl">
      <PageHeader headerTitle={`Your Notifications (${notifications ? notifications.length : 0})`} />

      <div className='card mt-2' style={{ zIndex: 10 }}>
        <div className='card-body'>
          {notifications && notifications.map((ele, i) => {
            const date = ele.created_at.split(" ")[0]
            const time = ele.created_at.split(" ")[1]
            return <div className="row d-flex justify-content-center" style={{ cursor: "pointer" }}>
              <div className="col-md-6">
                <div className='card mt-2' onClick={(e) => handleReadNotification(e, ele.id)}>
                  <div className='card-body'>
                    <div className="flex-fill ms-2">
                      <Link to={`/${_base}/${ele.url}`}>
                        <p className="d-flex justify-content-between mb-0">
                          <span className="fw-bold badge bg-primary p-2">{`Date: ${date}`}</span>
                          <span className="fw-bold badge bg-danger p-2" >{`Time: ${time}`}</span>
                        </p>
                        <p className="font-weight-bold mt-2">{ele.message}</p>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          })
          }

        </div>
      </div>
    </div>
  )
}
