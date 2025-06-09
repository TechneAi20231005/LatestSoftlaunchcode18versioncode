import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import CustomDialog from '../components/custom/modal/CustomModalMui';
import { useDispatch } from 'react-redux';
import { flagBotMessage } from '../redux/services/chatBot';

const FeedbackWrapper = ({ open, onClose, chat, setFeedback, project_id }) => {
  const dispatch = useDispatch();
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    'Incorrect Information',
    'Harmful Content',
    'Poor Response Quality',
    'Technical Issue',
    'Other'
  ];

  const handleSubmit = () => {
    dispatch(
      flagBotMessage({
        formData: {
          project_id: project_id,
          uuid: chat?.text?.chat_entry_uuid || 0,
          flagging: {
            flag_id: 0,
            type: issueType,
            remarks: details
          }
        }
      })
    );
    setSubmitted(true);
    setTimeout(() => {
      setFeedback('down');
      setIssueType('');
      setDetails('');
      setSubmitted(false);
      onClose();
    }, 1000);
  };

  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      dialogTitle="Help us improve"
      submitted={submitted}
    >
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="body1"
          sx={{ color: '#666', mb: 1, ml: '2px', fontSize: '0.88rem' }}
        >
          What type of issue do you wish to report?
        </Typography>
        <FormControl fullWidth>
          <Select
            displayEmpty
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            sx={{
              height: '42px',
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#ddd' },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#bbb'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2'
              }
            }}
          >
            <MenuItem value="" disabled>
              <span style={{ color: '#999' }}>--Select Issues--</span>
            </MenuItem>
            {issueTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ mb: 1 }}>
        <Typography
          variant="body1"
          sx={{ color: '#666', mb: 1, ml: '2px', fontSize: '0.88rem' }}
        >
          Please provide details: (optional)
        </Typography>
        <TextField
          multiline
          rows={2}
          fullWidth
          placeholder="What was unsatisfying about this response?"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '& fieldset': {
                borderColor: '#ddd'
              },
              '&:hover fieldset': {
                borderColor: '#bbb'
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2'
              }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#999',
              opacity: 1
            }
          }}
        />
      </Box>
    </CustomDialog>
  );
};

export default FeedbackWrapper;
