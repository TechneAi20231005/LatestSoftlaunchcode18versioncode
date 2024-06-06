import * as Yup from 'yup';

export const generatePoFilterValidation = Yup.object().shape({
  vender_name: Yup.string().required('Please select vender name'),
  delivery_date: Yup.date()
    .min(
      new Date()?.toDateString(),
      'Delivery date must be today or a future date'
    )
    .required('Please select delivery date')
});
