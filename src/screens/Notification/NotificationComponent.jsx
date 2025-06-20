import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Chip,
  Divider,
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
      sx={{
        marginLeft: 0
      }}
      maxWidth="md"
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        display="flex"
        // justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <PageHeader
          headerTitle={`Your Notifications (${notifications?.length || 0})`}
        />
      </Box>

      <Grid container spacing={2}>
        {notifications?.map((ele, i) => {
          const [date, time] = ele.created_at.split(' ');

          return (
            <Grid item xs={12} key={ele.id}>
              <ButtonBase
                onClick={() => handleReadNotification(ele.id)}
                component={Link}
                to={`/${_base}/${ele.url}`}
                sx={{ width: '100%', textAlign: 'left' }}
              >
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderLeft:
                      ele.is_read === 0
                        ? '4px solid #3b82f6'
                        : '4px solid transparent',
                    // backgroundColor: ele.is_read === 0 ? '#f0f9ff' : '#fff',
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
                    >
                      <Chip
                        label={`Date: ${date}`}
                        // color="primary"
                        sx={{ background: '#484c7f', color: '#fff' }}
                        size="small"
                      />
                      <Chip
                        label={`Time: ${time}`}
                        color="error"
                        size="small"
                      />
                    </Box>

                    <Typography
                      // variant="body1"
                      sx={{
                        color: '#212529',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        whiteSpace: 'normal', // ✅ allow wrapping
                        wordBreak: 'break-word', // ✅ breaks long words
                        overflowWrap: 'break-word'
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
