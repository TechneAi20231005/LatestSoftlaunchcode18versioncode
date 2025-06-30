import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../utils/regexPool';

export const shiftMasterValidation = Yup.object().shape({
  shift_name: Yup.string()
    .min(2, 'Shift name must be at least 2 characters')
    .max(100, 'Shift name must be at most 100 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Shift name must be alphanumeric')
    .required('Shift name is required'),
  shift_type: Yup.string().required('Please select Shift Type'),
  grace_period_in_min: Yup.number().required('Grace Period Is Required'),
  late_mark_period_in_min_after_grace_period: Yup.number().required(
    'Late Mark Period In Min After Grace Period is required'
  ),
  early_out_allowed_in_month: Yup.number().required(
    'Early Out Allowed In Month is required'
  ),
  early_out_allowed_min: Yup.number().required(
    'Early Out Allowed In Min Is Required'
  ),
  no_of_late_mark_for_half_day: Yup.number().required(
    'No. Of Late Mark For Half Day Is Required'
  ),
  min_to_consider_half_day: Yup.number().required(
    'Min To Consider In Half Day Is Required'
  ),
  min_to_consider_in_one_and_half_day: Yup.number().required(
    'Min To Consider In One And Half Day Is Required'
  ),
  min_to_consider_double_day: Yup.number().required(
    'Min To Consider Double Day Is Required'
  ),
  remark: Yup.string()
    .min(2, 'Remark must be at least 2 characters')
    .max(1000, 'Remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark must be alphanumeric')
});
