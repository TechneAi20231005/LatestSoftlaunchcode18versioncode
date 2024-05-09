import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../../../settings/constants';

export const addFollowValidation = Yup.object().shape({
  add_follow_up: Yup.string()
    .min(2, 'Follow up must be at least 2 characters')
    .max(1000, 'Follow up must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Follow up  must be alphanumeric')
    .required('Follow up is required'),
  next_follow_up_date: Yup.date()
    .required('Follow up date & time is required')
    .test('is-future', 'Follow up date & time must be in the future', value => {
      if (!value) return true;
      const now = new Date();
      return value > now;
    }),
  attachment_file: Yup.mixed().test('fileSize', 'Attachment size must be less than 2MB', value => {
    if (!value) return true; // Allow empty values
    return value?.size <= 2000000; //2mb
  }),
});
