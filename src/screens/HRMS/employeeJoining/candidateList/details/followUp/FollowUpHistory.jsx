import React from 'react';

function FollowUpHistory() {
  return (
    <div>
      <h5 className="mb-0 text-primary">Follow Up Activity</h5>
      <hr className="primary_divider mt-1" />
      {[...new Array(3)].map(() => (
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi animi officiis velit
            consequuntur tenetur cum ex odit blanditiis sint nemo.
          </p>
          <div className="remark_history d-flex justify-content-between">
            <div>
              <h5>Next Follow-up Date & Time</h5>
              <p>Remark Title : Remark Title</p>
            </div>
            <div>
              <h5>Attachment</h5>
              <a>Attachment.png</a>
            </div>
            <p className="mt-5 opacity-50">Lorem ipsum dolor sit amet consectetur adipisicing</p>
          </div>
          <hr className="mt-0" />
        </div>
      ))}
    </div>
  );
}

export default FollowUpHistory;
