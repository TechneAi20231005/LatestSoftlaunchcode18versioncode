import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  Grow
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { flagBotMessage } from '.././redux/services/chatBot';

const FeedbackModal = ({ open, onClose, setFeedback, chat, project_id }) => {
  const [issueType, setIssueType] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(
      flagBotMessage({
        formData: {
          project_id: project_id,
          // uuid: chat?.text?.chat_entry_uuid || 0,
          flagging: {
            flag_id: chat?.text?.chat_entry_uuid || 0,
            type: issueType || '',
            remarks: details || ''
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

  const handleCancel = () => {
    setIssueType('');
    setDetails('');
    onClose();
  };

  const issueTypes = [
    'Incorrect Information',
    'Harmful Content',
    'Poor Response Quality',
    'Technical Issue',
    'Other'
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: Grow }}
      PaperProps={{
        sx: {
          width: {
            xs: '100%',
            sm: '80%',
            md: '60%',
            lg: '38%'
          },

          borderRadius: 3,
          padding: 2,
          backgroundColor: '#f5f5f5'
        }
      }}
    >
      <DialogTitle
        sx={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: '#484c7f',
          padding: '0px 0 12px 0'
        }}
      >
        Feedback
        <Divider sx={{ mt: 0.8 }} />
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>
        <Box sx={{ marginBottom: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              marginBottom: 1,
              marginLeft: '2px',
              fontSize: '0.88rem'
            }}
          >
            What type of issue do you wish to report?
          </Typography>

          <FormControl fullWidth>
            <InputLabel
              sx={{
                color: '#999',
                marginTop: '-6px',
                '&.Mui-focused': { color: '#1976d2' }
              }}
            >
              {/* Select... */}
            </InputLabel>
            <Select
              displayEmpty
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              sx={{
                height: '42px',
                backgroundColor: 'white',
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ddd'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bbb'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2'
                }
              }}
            >
              <MenuItem value="" disabled selected>
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

        <Box sx={{ marginBottom: 1 }}>
          <Typography
            variant="body1"
            sx={{
              color: '#666',
              marginBottom: 1,
              marginLeft: '2px',
              fontSize: '0.88rem'
            }}
          >
            Please provide details: (optional)
          </Typography>

          <TextField
            multiline
            rows={1.8}
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
      </DialogContent>

      <DialogActions
        sx={{
          padding: '4px 0 0 0',
          gap: 1,
          justifyContent: 'flex-end'
        }}
      >
        <Button
          onClick={handleCancel}
          variant="outlined"
          sx={{
            borderColor: '#ddd',
            color: '#fff',
            backgroundColor: '#fc5a69',
            borderRadius: 2,
            padding: '5px 24px',
            textTransform: 'none',
            fontSize: '0.90rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 15px rgba(72, 76, 127, 0.6)'
            }
          }}
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: '#484c7f',
            color: 'white',
            borderRadius: 2,
            padding: '5px 24px',
            textTransform: 'none',
            fontSize: '0.90rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 15px rgba(72, 76, 127, 0.6)'
            }
          }}
        >
          {submitted ? '✔ Submitted' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;
