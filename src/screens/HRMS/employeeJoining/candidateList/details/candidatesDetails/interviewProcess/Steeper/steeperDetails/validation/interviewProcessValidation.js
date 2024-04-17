import * as Yup from 'yup';

export const interViewProcessValidation = Yup.object().shape({
  remark_id: Yup.string().required('Remark is required'),
  other_remark: Yup.string()
    .test('otherRemarkRequired', 'Specify Other remarks are required', function (value) {
      const remarkId = this.parent.remark_id;
      if (remarkId === '0' && (!value || value.trim() === '')) {
        return false;
      }
      return true;
    })
    .min(2, 'Specify Other remarks must be at least 2 characters')
    .max(1000, 'Specify Other remarks must be at most 1000 characters'),
});

export const selectInterViewSlotValidation = Yup.object().shape({
  interview_date: Yup.date()
    .min(new Date()?.toDateString(), 'Interview date must be today or a future date')
    .required('Interview date is required'),

  interview_time: Yup.string().required('Interview slot time is required'),
});
