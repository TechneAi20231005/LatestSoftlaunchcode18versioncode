import React from 'react';
import { chatAppData } from '../../components/Appdata';
import Chattile from '../../components/Chattile';

function ChatApp() {
  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <Chattile data={chatAppData} />
      </div>
    </div>
  );
}

export default ChatApp;
