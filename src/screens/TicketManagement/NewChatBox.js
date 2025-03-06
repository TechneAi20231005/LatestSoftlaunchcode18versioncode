import React, { useState, useEffect, useRef } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { Button, ListGroup } from 'react-bootstrap';
import UserService from '../../services/MastersService/UserService'; // Import your UserService
import classNames from './example.module.css';
import MyTicketService from '../../services/TicketService/MyTicketService';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils';
import { _rewampAttachmentUrl } from '../../settings/constants';

const Chatbox = (props) => {
  const { ticketId, loadComment, commentData } = props;
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [mentionId, setMentionId] = useState([]);
  const handleMentionAdd = (e) => {
    setMentionId([...mentionId, e]);
  };
  const [selectedFile, setSelectedFile] = useState([]);
  const fileInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const uploadAttachmentHandler = (e, type, id = null) => {
    let file;
    if (type === 'UPLOAD') {
      const selectedFilesCount = selectedFile?.length;
      const maxTotalSizeMB = 10; // Maximum total size in MB
      // Calculate the total size of video files in the existing selected files
      const totalSizeBytesExisting = selectedFile
        .filter((file) => file.file.type.startsWith('video/'))
        .reduce((acc, currFile) => acc + currFile.file.size, 0);

      const newFiles = Array.from(e.target.files)
        .filter((file, index) => index < 5 - selectedFilesCount) // Limit to available slots
        .map((file) => ({
          file,
          show_to_customer: 0,
          show_to_project_owner: 0
        }));

      if (newFiles?.length === 0) {
        // All available slots already used
        alert('You can only upload a maximum of 5 files.');
      } else {
        // Calculate the total size of video files in the new selection
        const totalSizeBytesNew = newFiles
          .filter((file) => file.file.type.startsWith('video/'))
          .reduce((acc, currFile) => acc + currFile.file.size, 0);

        // Calculate the total size in MB
        const totalSizeMB =
          (totalSizeBytesExisting + totalSizeBytesNew) / (1024 * 1024);

        if (totalSizeMB > maxTotalSizeMB) {
          alert(
            `Total video file size exceeds ${maxTotalSizeMB} MB. Please reduce the size of your videos.`
          );
        } else {
          setSelectedFile((prevSelectedFiles) => [
            ...prevSelectedFiles,
            ...newFiles
          ]);
        }

        // Clear the input field
        fileInputRef.current.value = '';
      }
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setMessage('');
    // if (!mentionId.length) {
    //   alert("Kindly mention user");
    //   return;
    // }

    try {
      const res = await new MyTicketService().postComment({
        ticket_id: ticketId,
        comment: message,
        mentions_id: mentionId,
        attachment: selectedFile[0]?.file
      });
      if (res?.data?.status === 1) {
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message);
      }
      loadComment();
    } catch (error) {
      errorHandler(error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inputRequired =
          'id,employee_id,first_name,last_name,middle_name,is_active,department_id,email_id';
        const res = await new UserService().getUserForMyTickets(inputRequired);

        if (res.status === 200 && res.data.status === 1) {
          const data = res.data.data?.data?.filter(
            (d) => d.is_active === 1 && d.account_for
          );
          const select = data.map((d) => ({
            id: d.id,
            display: `${d.first_name} ${d.last_name}`
          }));
          setUsers(select);
        }
      } catch (error) {
        errorHandler(error);
      }
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

                <input
                  type="file"
                  className="form-control"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) => {
                    uploadAttachmentHandler(e, 'UPLOAD', '');
                  }}
                />
                <div className="mt-2">
                  {selectedFile.length > 0 && (
                    <ul className="list-group">
                      {selectedFile.map((fileObj, index) => (
                        <li
                          key={index}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          {fileObj.file.name}{' '}
                          {/* <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              uploadAttachmentHandler(null, 'DELETE', index)
                            }
                          >
                            Remove
                          </button> */}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="col-md-12 d-flex justify-content-end">
                  <Button variant="primary" className="mt-5" type="submit">
                    submit
                  </Button>
                </div>
              </div>
            </div>
            {/* <div className="card mt-2">
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
            </div> */}

            <ListGroup
              className="mt-3"
              style={{
                overflowY: 'scroll',
                height: '70vh',
                gap: '10px'
              }}
            >
              {commentData?.comments?.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <div>
                    <p className="fw-bold">
                      {' '}
                      {highlightMentions(comment?.cmt ? comment?.cmt : '')}
                    </p>
                  </div>

                  {comment?.attachments?.length > 0 && (
                    <div className="mt-2">
                      {comment?.attachments?.map((attachment, i) => {
                        const fileName = attachment?.split('/').pop();
                        return (
                          <div
                            key={i}
                            className="d-flex align-items-center mt-1 gap-2"
                          >
                            <i class="icofont-download "></i>
                            <a
                              style={{ color: '#a908c6' }}
                              href={`${_rewampAttachmentUrl}/${attachment}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
