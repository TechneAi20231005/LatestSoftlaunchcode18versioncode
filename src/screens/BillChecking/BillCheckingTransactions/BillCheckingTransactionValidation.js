import * as Yup from 'yup';

export const billCheckingTransactionValidation = Yup.object().shape({
  id: Yup.string(),
  // .required('Id  is required '),
  // vendor_bill_no: Yup.string().required('Vendor bill number is required '),
  // vendor_name: Yup.array().required('Vendor name is required'),
  // bill_status: Yup.string().required('Bill status is required '),
  // bill_type: Yup.string().required('Bill type is required '),
  // assign_to: Yup.string().required('Assign to is required '),
  from_bill_date: Yup.date(),
  to_bill_date: Yup.date().test('To bill date is required', function (value) {
    const { from_bill_date } = this.parent;
    if (from_bill_date && !value) {
      return this.createError({ message: 'To bill date is required' });
    }
    return true; // Pass validation if from_bill_date is not selected
  }),

  from_received_date: Yup.date(),
  to_received_date: Yup.date().test(
    'To received date is required',

    function (value) {
      const { from_received_date } = this.parent;
      if (from_received_date && !value) {
        return this.createError({ message: 'To received date is required' });
      }
      return true; // Pass validation if from_bill_date is not selected
    }
  ),
  // from_received_date: Yup.date(),
  // .required('From received date is required'),
  // to_received_date: Yup.date()
  // .min(
  //   Yup.ref('from_received_date'),
  //   'To received date cannot be earlier than from received date'
  // )
  // .required('To received date is required if from received date is selected'),

  from_payment_date: Yup.date(),
  to_payment_date: Yup.date()
    .test(
      'to-payment-date-required',
      'To payment date is required if from payment date is selected',
      function (value) {
        const { from_payment_date } = this.parent;
        if (from_payment_date && !value) {
          return this.createError({
            message:
              'To payment date is required if from payment date is selected'
          });
        }
        return true; // Pass validation if from_payment_date is not selected or to_payment_date is filled
      }
    )
    .min(
      Yup.ref('from_payment_date'),
      'To payment date cannot be earlier than from payment date'
    ),

  // from_bill_amount: Yup.string().required('From bill amount is required '),
  from_bill_amount: Yup.string()
    .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
    .test(
      'is-decimal',
      'Invalid amount format',
      (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
    ),
  to_bill_amount: Yup.string()
    .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
    .test(
      'is-required-when-from-filled',
      'To bill amount is required if from bill amount is entered',
      function (value) {
        const fromBillAmount = this.resolve(Yup.ref('from_bill_amount'));
        return !fromBillAmount || !!value;
      }
    )
    .test(
      'is-greater',
      'To bill amount cannot be less than from bill amount',
      function (value) {
        const fromBillAmount = this.resolve(Yup.ref('from_bill_amount'));
        return (
          !fromBillAmount ||
          !value ||
          parseFloat(value) >= parseFloat(fromBillAmount)
        );
      }
    )
    .test(
      'is-decimal',
      'Invalid amount format',
      (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
    ),

  // from_bill_amount: Yup.string()
  //   .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
  //   .test(
  //     'is-decimal',
  //     'Invalid amount format',
  //     (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
  //   ),
  // to_bill_amount: Yup.string()
  //   .required('To bill amount is required')
  //   .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
  //   .test(
  //     'is-greater',
  //     'To bill amount cannot be less than from bill amount',
  //     function (value) {
  //       const fromBillAmount = this.resolve(Yup.ref('from_bill_amount'));
  //       return (
  //         !fromBillAmount ||
  //         !value ||
  //         parseFloat(value) >= parseFloat(fromBillAmount)
  //       );
  //     }
  //   )
  //   .test(
  //     'is-decimal',
  //     'Invalid amount format',
  //     (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
  //   ),
  from_hold_amount: Yup.string()
    .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
    .test(
      'is-decimal',
      'Invalid amount format',
      (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
    ),

  to_hold_amount: Yup.string()
    .test(
      'conditional-required',
      'To hold amount is required',
      function (value) {
        const fromHoldAmount = this.resolve(Yup.ref('from_hold_amount'));
        // If from_hold_amount has a value and to_hold_amount is empty, show required error
        return !fromHoldAmount || (value && value.trim() !== '');
      }
    )
    .matches(/^\d{1,10}(\.\d{0,2})?$/, 'Invalid amount format')
    .test(
      'is-greater',
      'To hold amount cannot be less than from hold amount',
      function (value) {
        const fromHoldAmount = this.resolve(Yup.ref('from_hold_amount'));
        return (
          !fromHoldAmount ||
          !value ||
          parseFloat(value) >= parseFloat(fromHoldAmount)
        );
      }
    )
    .test(
      'is-decimal',
      'Invalid amount format',
      (value) => !value || /^[0-9]+(\.[0-9]{1,2})?$/.test(value)
    )
});
