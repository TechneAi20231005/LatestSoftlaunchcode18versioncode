import React, { useState, useEffect } from 'react'
import { MentionsInput, Mention } from 'react-mentions'
import { Form, Button, ListGroup } from 'react-bootstrap'
import UserService from '../../services/MastersService/UserService' // Import your UserService
import classNames from './example.module.css'
import MyTicketService from '../../services/TicketService/MyTicketService'

const Chatbox = props => {
  const { ticketId, loadComment, commentData } = props
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState([])
  const [mentionId, setMentionId] = useState("")
  const handleMentionAdd = e => {
    setMentionId([...mentionId, e])
  }
  const handleComment = async e => {
    e.preventDefault()
    setMessage('')
      const mentionsString=mentionId.join(',')
    await new MyTicketService()
      .postComment({
        ticket_id: ticketId,
        comment: message,
        mentions_id: mentionsString
      })
      .then(res => {
        loadComment()
      })
  }

  const typedMessage = (e) => {
    setMessage(e)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inputRequired =
          'id,employee_id,first_name,last_name,middle_name,is_active'
        const res = await new UserService().getUserForMyTickets(inputRequired)

        if (res.status === 200 && res.data.status === 1) {
          const data = res.data.data.filter(d => d.is_active === 1)
          const select = data.map(d => ({
            id: d.id,
            display: `${d.first_name} ${d.last_name}`
          }))
          setUsers(select)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div style={{ maxWidth: '500px', margin: 'auto' }}>
      <form method='post' onSubmit={handleComment}>
        <div className='card '>
          <div className='card-body card-body-height py-4'>
            <h6 className='mb-0 fw-bold mb-3'>Ticket Chat</h6>
            <div className='card mb-2'>
              <div className='card-body'>
                <MentionsInput
                  className='mentions'
                  classNames={classNames}
                  value={message}
                  onChange={e => typedMessage(e.target.value)}
                >
                  <Mention
                    trigger='@'
                    data={users}
                    onAdd={(e, id) => {
                      handleMentionAdd(e, id)
                    }}
                    className={classNames.mentions__mention}
                    displayTransform={(id, display) => `@${display}`}
                  />
                </MentionsInput>
                <Button variant='primary' className='mt-2' type='submit'>
                  Send
                </Button>
              </div>
            </div>
            <ListGroup
              className='mt-3'
              style={{ overflowY: 'scroll', height: '70vh' }}
            >
              {commentData?.comments?.map((comment, index) => (
                <ListGroup.Item key={index}>
                  <div>
                    <p className='fw-bold'> {highlightMentions(comment.cmt)}</p>
                  </div>

                  <div className='d-flex justify-content-between mt-4'>
                    <p>
                      {comment.user_id}
                    </p>
                    <p>
                      {comment.time}
                    </p>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Chatbox

// Function to highlight mentions in the comment
const highlightMentions = comment => {
  const mentionRegex = /@\[([^\]]+)]\(\d+\)/g
  let match
  let lastIndex = 0
  const parts = []

  // Iterate through all matches of mentionRegex in the comment
  while ((match = mentionRegex.exec(comment)) !== null) {
    // Push the text before the mention
    parts.push(comment.slice(lastIndex, match.index))

    // Extract the username from the match
    const userName = match[1]
    // Push the mention with background color
    parts.push(
      <span
        key={match.index}
        style={{ color: '#15198f' }}
      >{`@${userName}`}</span>
    )

    lastIndex = mentionRegex.lastIndex
  }

  // Push the remaining text
  parts.push(comment.slice(lastIndex))

  return parts
}
