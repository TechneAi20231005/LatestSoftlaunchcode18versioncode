import React, { useState, useEffect } from "react";
import PageHeader from "../../components/Common/PageHeader";
import {
  getAllNotification,
  getNotification,
  markedReadNotification,
} from "../../services/NotificationService/NotificationService";
import { Link } from "react-router-dom";
import { _base, userSessionData } from "../../settings/constants";

export default function ApprovedNotificationComponent() {
  const [notifications, setNotifications] = useState();

  const loadNotifcation = () => {
    getNotification().then((res) => {
      if (res.status === 200) {
        setNotifications(null);
        if (res.data.data.for_me) {
          var length = res.data.data.for_me.length;
          var height = 0;
          setNotifications(res.data.data.for_me);
          if (parseInt(length) > 0 && parseInt(length) <= 5) {
            height = 100;
          }
          if (parseInt(length) > 5) {
            height = 250;
          }
        }
      }
    });
  };

  useEffect(() => {
    loadNotifcation();
  }, []);
  return (
    <div className="container-xxl">
      <PageHeader
        headerTitle={`Your Approved Notifications (${
          notifications ? notifications.length : 0
        })`}
      />

      <div className="card mt-2" style={{ zIndex: 10 }}>
        <div className="card-body">
          {notifications &&
            notifications.map((ele, i) => {
              const date = ele.created_at.split(" ")[0];
              const time = ele.created_at.split(" ")[1];
              return (
                <div
                  className="row d-flex justify-content-center"
                  style={{ cursor: "pointer" }}
                >
                  <div className="col-md-6">
                    <div className="card mt-2">
                      <div className="card-body">
                        <div className="flex-fill ms-2">
                          <Link to={`/${_base}/${ele.url}`}>
                            <p className="d-flex justify-content-between mb-0">
                              <span className="fw-bold badge bg-primary p-2">{`Date: ${date}`}</span>
                              <span className="fw-bold badge bg-danger p-2">{`Time: ${time}`}</span>
                            </p>
                            <p className="font-weight-bold mt-2">
                              {ele.message}
                            </p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
