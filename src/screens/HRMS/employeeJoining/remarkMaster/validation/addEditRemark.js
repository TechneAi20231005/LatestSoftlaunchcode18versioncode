import * as Yup from 'yup';
import { ALPHA_NUMERIC_REGEX } from '../../../../../settings/constants';

export const addEditRemarkValidation = Yup.object().shape({
  remark_description: Yup.string()
    .min(2, 'Remark description must be at least 2 characters')
    .max(1000, 'Remark description must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Remark description name must be alphanumeric')

    .required('Remark description is required'),
  supporting_remark: Yup.string()
    .min(2, 'Supporting remark must be at least 2 characters')
    .max(1000, 'Supporting remark must be at most 1000 characters')
    .matches(ALPHA_NUMERIC_REGEX, 'Supporting remark name must be alphanumeric'),
});
