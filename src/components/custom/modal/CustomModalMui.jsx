import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Grow
} from '@mui/material';

const CustomDialog = ({
  open,
  onClose,
  onSubmit,
  dialogTitle = 'Dialog',
  children,
  loading = false,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  submitted = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slots={{ transition: Grow }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '80%', md: '60%', lg: '38%' },
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
        {dialogTitle}
        <Divider sx={{ mt: 0.8 }} />
      </DialogTitle>

      <DialogContent sx={{ padding: 0 }}>{children}</DialogContent>

      <DialogActions
        sx={{
          padding: '4px 0 0 0',
          gap: 1,
          justifyContent: 'flex-end'
        }}
      >
        <Button
          onClick={onClose}
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
          {cancelLabel}
        </Button>

        <Button
          onClick={onSubmit}
          variant="contained"
          disabled={loading}
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
          {submitted ? '✔ Submitted' : loading ? 'Submitting...' : submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
