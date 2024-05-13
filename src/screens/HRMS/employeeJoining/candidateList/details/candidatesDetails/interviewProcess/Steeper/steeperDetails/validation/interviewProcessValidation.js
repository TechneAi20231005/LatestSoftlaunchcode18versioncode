import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../../../../../../settings/constants';

export const interViewProcessValidation = Yup.object().shape({
  remark_id: Yup.string().required('Remark is required'),
  other_remark: Yup.string()
    .test('otherRemarkRequired', 'Specify other remarks are required', function (value) {
      const remarkId = this.parent.remark_id;
      if (remarkId === '0' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    })
    .matches(ALPHA_NUMERIC_REGEX, 'Supporting remark name must be alphanumeric')
    .min(2, 'Specify other remarks must be at least 2 characters')
    .max(1000, 'Specify other remarks must be at most 1000 characters'),
});

export const interviewScheduleRescheduleValidation = Yup.object().shape({
  date: Yup.date()
    .min(new Date()?.toDateString(), 'Interview date must be today or a future date')
    .required('Interview date is required'),

  time: Yup.string()
    .test('time-validation', 'Interview slot time must be future time', function (value) {
      const { date } = this.parent;
      const today = new Date()?.toDateString();
      const currentTime = new Date().getHours();

      if (date?.toDateString() === today) {
        const timeParts = value.split(':');
        const hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);

        if (hour < currentTime || (hour === currentTime && minute <= new Date().getMinutes())) {
          return false;
        }
      } else {
        // Interview date is not today, time should be in 24hr format
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(value)) {
          return false;
        }
      }
      return true;
    })
    .required('Interview slot time is required'),
});
