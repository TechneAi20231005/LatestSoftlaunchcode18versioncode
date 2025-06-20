import React, { useEffect, useState } from 'react';
import {
  ChevronRight as ChevronRightIcon,
  Notifications as NotificationsIcon,
  Event as EventIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container,
  Paper,
  Divider,
  Backdrop,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { _base } from '../../settings/constants';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReviewerNotificationList } from '../../redux/services/chatBot';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  '&:before': {
    display: 'none'
  }
}));

const QuestionItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: '6px',
  backgroundColor: 'rgb(249 250 251)',
  border: '1px solid #e2e8f0',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  }
}));

const AllReviewerNotificationList = () => {
  const [expanded, setExpanded] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useDispatch();
  const reviewerNotification = useSelector(
    (state) => state?.chatBotSlice?.getAllReviewerNotificationList || []
  );
  const isLoading = useSelector(
    (state) => state?.chatBotSlice.isLoading.getAllReviewerNotificationList
  );

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getAllReviewerNotificationList());
      setDataLoaded(true);
    };
    fetchData();
  }, [dispatch]);

  const totalQuestions = reviewerNotification?.reduce(
    (sum, p) => sum + p?.flagged_entries?.length,
    0
  );
  const totalCount = reviewerNotification?.length + totalQuestions;

  return (
    <Box
      sx={{
        minHeight: '100vh'
      }}
    >
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container
        sx={{
          '@media (min-width: 600px)': {
            paddingLeft: '0px',
            paddingRight: '0px'
          }
        }}
        maxWidth="md"
      >
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2
            }}
          >
            <NotificationsIcon sx={{ fontSize: 36, mr: 2, color: '#484c7f' }} />
            <PageHeader headerTitle="Reviewer Notifications"></PageHeader>
            {dataLoaded && reviewerNotification?.length > 0 && (
              <Box
                title="This count includes all projects and their associated review questions."
                sx={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: '0.8rem',
                  ml: 1.8,
                  fontWeight: 600,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  animation: 'fadeIn 0.5s ease-in-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'scale(0.8)' },
                    to: { opacity: 1, transform: 'scale(1)' }
                  }
                }}
              >
                {totalCount || '0'} Projects
              </Box>
            )}
          </Box>
        </Box>

        {isLoading ? null : dataLoaded && reviewerNotification?.length > 0 ? (
          <Box>
            {reviewerNotification?.map((project) => (
              <StyledAccordion
                key={project?.project_id}
                expanded={expanded === project?.project_id}
                onChange={handleChange(project?.project_id)}
                sx={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0'
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ChevronRightIcon
                      sx={{
                        color: '#64748b',
                        transform:
                          expanded === project?.project_id
                            ? 'rotate(90deg)'
                            : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  }
                  sx={{
                    py: 2,
                    px: 2.5
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        mb: 1,
                        color: '#1e293b',
                        fontSize: '1.1rem',
                        fontWeight: 600
                      }}
                    >
                      {project?.project_name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                        mt: 1
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EventIcon
                          sx={{ fontSize: 16, mr: 0.5, color: '#64748b' }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: '#475569', fontSize: '0.85rem' }}
                        >
                          Date:
                          {(() => {
                            const rawDate =
                              project?.flagged_entries?.[0]?.timestamp;
                            const parsedDate = new Date(rawDate);
                            return isNaN(parsedDate.getTime())
                              ? new Date('6/19/2025').toLocaleString()
                              : parsedDate.toLocaleString();
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0, px: 2.5, pb: 2 }}>
                  <Divider sx={{ mb: 2, borderColor: 'gray' }} />
                  <Box>
                    <Typography
                      variant="subtitle1"
                      component="h4"
                      sx={{
                        mb: 2,
                        color: '#1e293b',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      Review Questions ({project?.flagged_entries?.length})
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {project?.flagged_entries?.map((question, i) => (
                        <QuestionItem key={i}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'flex-start'
                            }}
                          >
                            <Box
                              title="Redirect To Detail Feedback"
                              sx={{ flex: 1 }}
                            >
                              <Link
                                to={`/${_base}/CustomerFeedback?id=${project?.project_id}&chat_id=${question?.uuid}`}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    mr: 1,
                                    color: '#1e40af',
                                    fontSize: '0.9rem',
                                    mb: 0.5
                                  }}
                                >
                                  Q{i + 1}. {question?.question}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    color: '#475569',
                                    fontSize: '0.9rem',
                                    mr: 1,
                                    mt: 1
                                  }}
                                >
                                  Ans: {question?.answer}
                                </Typography>
                              </Link>
                            </Box>
                          </Box>
                        </QuestionItem>
                      ))}
                    </Box>
                  </Box>
                </AccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '300px',
              textAlign: 'center',
              p: 4,
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed #e2e8f0'
            }}
          >
            <NotificationsIcon
              sx={{
                fontSize: 64,
                color: '#cbd5e1',
                mb: 2
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: '#64748b',
                fontWeight: 600,
                mb: 1
              }}
            >
              No notifications yet
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default AllReviewerNotificationList;
