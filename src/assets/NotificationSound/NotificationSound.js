import React, { useEffect } from 'react';

const NotificationComponent = () => {
  // useEffect(() => {
  //   const playNotificationSound = () => {
  //     const notificationSound = new Audio(MsgRecieved);
  //     notificationSound.addEventListener('error', (error) => {
  //       console.error('Failed to play notification sound:', error);
  //     });
  //     notificationSound.play();
  //   }

  //   // Call function to play notification sound as soon as component is mounted
  //   playNotificationSound();
  // }, []);

  return (
    <div>
      {/* Render your notification component */}
      <p>Notification Component</p>
    </div>
  );
}

export default NotificationComponent;
