import React, { useState, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { Button, ListGroup } from 'react-bootstrap';
import UserService from '../../services/MastersService/UserService'; // Import your UserService
import classNames from './example.module.css';
import MyTicketService from '../../services/TicketService/MyTicketService';

const Chatbox = (props) => {
  const { ticketId, loadComment, commentData } = props;
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [mentionId, setMentionId] = useState([]);
  const handleMentionAdd = (e) => {
    setMentionId([...mentionId, e]);
  };
  const handleComment = async (e) => {
    e.preventDefault();
    setMessage('');
    // if (!mentionId.length) {
    //   alert("Kindly mention user");
    //   return;
    // }
    await new MyTicketService()
      .postComment({
        ticket_id: ticketId,
        comment: message,
        mentions_id: mentionId
      })
      .then((res) => {
        loadComment();
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inputRequired =
          'id,employee_id,first_name,last_name,middle_name,is_active';
        const res = await new UserService().getUserForMyTickets(inputRequired);

        if (res.status === 200 && res.data.status === 1) {
          console.log('res', res);
          const data = res.data.data.filter(
            (d) => d.is_active === 1 && d.account_for
          );
          const select = data.map((d) => ({
            id: d.id,
            display: `${d.first_name} ${d.last_name}`
          }));
          setUsers(select);
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <form method="post" onSubmit={handleComment}>
        <div className="card ">
          <div className="card-body card-body-height py-4">
            <h6 className="mb-0 fw-bold mb-3">Ticket Chat</h6>
            <div className="card mb-2">
              <div className="card-body">
                <MentionsInput
                  className="mentions"
                  classNames={classNames}
                  value={message}
                  disabled={
                    props.statusName?.status_name === 'Solved' ||
                    props.statusName?.status_name === 'Rejected'
                  }
                  onChange={(e) => setMessage(e.target.value)}
                >
                  <Mention
                    trigger="@"
                    data={users}
                    onAdd={(e, id) => {
                      handleMentionAdd(e, id);
                    }}
                    className={classNames.mentions__mention}
                    displayTransform={(id, display) => `@${display}`}
                  />
                </MentionsInput>

                <Button variant="primary" className="mt-2" type="submit">
                  Send
                </Button>
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 mt-3">
                    <input
                      type="file"
                      id="attachment"
                      name="attachment"
                      // className="form-control"
                      accept="image/jpg,image/jpeg,image/png,application/pdf"
                      // ref={fileInputRef}
                      capture="camera"
                      multiple
                      // required={
                      //   selectedFiles && selectedFiles.length <= 0 ? true : false
                      // }
                      onChange={(e) => {
                        // Check if the file type is one of the allowed types
                        // if (
                        //   selectedFile.type === "image/jpg" ||
                        //   selectedFile.type === "image/jpeg" ||
                        //   selectedFile.type === "image/png" ||
                        //   selectedFile.type === "application/pdf"
                        // ) {
                        //   // File type is allowed
                        // } else {
                        //   // Check if the file type is BMP
                        //   if (selectedFile.type === "image/bmp") {
                        //     alert(
                        //       "Invalid file format. BMP files are not allowed."
                        //     );
                        //   } else {
                        //     alert(
                        //       "Invalid file format. Only jpg, jpeg, png, and pdf are allowed."
                        //     );
                        //   }
                        //   e.target.value = ""; // Clear the input to prevent the user from submitting an invalid file
                        // }
                        // uploadAttachmentHandler(e, "UPLOAD", "");
                        // maxLengthCheck(e, "UPLOAD");
                      }}
                    />
                  </div>
                  <div className="col-md-6 d-flex justify-content-end">
                    <Button variant="primary" className="mt-2" type="submit">
                      upload
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <ListGroup
              className="mt-3"
              style={{ overflowY: 'scroll', height: '70vh' }}
            >
              {commentData?.comments?.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <div>
                    <p className="fw-bold">
                      {' '}
                      {highlightMentions(comment?.cmt ? comment?.cmt : '')}
                    </p>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <p>{comment?.user_id}</p>
                    <p>{comment?.time}</p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;

// Function to highlight mentions in the comment
const highlightMentions = (comment) => {
  const mentionRegex = /@\[([^\]]+)]\(\d+\)/g;
  let match;
  let lastIndex = 0;
  const parts = [];

  // Iterate through all matches of mentionRegex in the comment
  while ((match = mentionRegex.exec(comment)) !== null) {
    // Push the text before the mention
    parts.push(comment?.slice(lastIndex, match.index));

    // Extract the username from the match
    const userName = match[1];
    // Push the mention with background color
    parts.push(
      <span
        key={match.index}
        style={{ color: '#15198f' }}
      >{`@${userName}`}</span>
    );

    lastIndex = mentionRegex.lastIndex;
  }

  // Push the remaining text
  parts.push(comment?.slice(lastIndex));

  return parts;
};
