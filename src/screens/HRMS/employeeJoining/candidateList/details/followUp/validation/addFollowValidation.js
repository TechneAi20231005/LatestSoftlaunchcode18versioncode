import * as Yup from 'yup';

export const addFollowValidation = Yup.object().shape({
  follow_up: Yup.string()
    .min(2, 'Follow up must be at least 2 characters')
    .max(1000, 'Follow up must be at most 1000 characters')
    .required('Follow up is required'),
  next_follow_date_time: Yup.date()
    .required('Follow up date & time is required')
    .test('is-future', 'Follow up date & time must be in the future', value => {
      if (!value) return true;
      const now = new Date();
      return value > now;
    }),
  attachment: Yup.mixed().test('fileSize', 'Attachment size must be less than 2MB', value => {
    if (!value) return true; // Allow empty values
    return value?.size <= 2000000; //2mb
  }),
});
