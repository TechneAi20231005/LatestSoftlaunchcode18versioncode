import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Chip,
  ButtonBase,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import {
  getAllNotification,
  markedReadNotification
} from '../../services/NotificationService/NotificationService';
import { _base } from '../../settings/constants';

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotifications = () => {
    setLoading(true);
    getAllNotification(localStorage.getItem('id')).then((res) => {
      if (res.status === 200) {
        setNotifications(res.data.data || []);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });
  };

  const handleReadNotification = (id) => {
    markedReadNotification(id).then(() => {
      getNotifications();
    });
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginLeft: 0
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        // px={2} // Add horizontal padding
      >
        <PageHeader
          headerTitle={`Your Notifications (${notifications?.length || 0})`}
        />
      </Box>

      <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
        {notifications?.map((ele, i) => {
          const [date, time] = ele.created_at.split(' ');

          return (
            <Grid item xs={12} key={ele.id} sx={{ width: '100%' }}>
              <ButtonBase
                onClick={() => handleReadNotification(ele.id)}
                component={Link}
                to={`/${_base}/${ele.url}`}
                sx={{ width: '100%', textAlign: 'left' }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    width: '100%',
                    borderRadius: 2,
                    borderLeft:
                      ele.is_read === 0
                        ? '4px solid #3b82f6'
                        : '4px solid transparent',
                    transition: 'all 0.3s',
                    boxShadow: 'rgba(99, 99, 99, 0.1) 0px 2px 8px 0px',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                      flexWrap="wrap" // Allow items to wrap on small screens
                    >
                      <Chip
                        label={`Date: ${date}`}
                        sx={{
                          background: '#484c7f',
                          color: '#fff',
                          mb: { xs: 1, sm: 0 }
                        }}
                        size="small"
                      />
                      <Chip
                        label={`Time: ${time}`}
                        color="error"
                        size="small"
                      />
                    </Box>

                    <Typography
                      sx={{
                        color: '#212529',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}
                    >
                      {ele?.message}
                    </Typography>
                  </CardContent>
                </Card>
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default NotificationComponent;
