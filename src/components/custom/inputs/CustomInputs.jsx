import React from 'react';
import { useFormikContext, getIn } from 'formik';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './style.scss';

export const CustomInput = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);

  return (
    <div className={`${props.styleData} space-y-10`}>
      {!props.withOutLabel && (
        <label>
          {props.label}
          {props.requiredField && <span className="mendatory_sign">*</span>}
        </label>
      )}
      <input
        {...field}
        {...props}
        className={`form-control ${error && touch ? 'is-invalid' : ''} ${props.inputClassName}`}
      />
      {error && touch && <div className="invalid-feedback d-block mb-1">{error}</div>}
    </div>
  );
};
export const CustomPswInput = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);

  return (
    <div className={`${props.styleData} space-y-10 ${props.pswClassName}`}>
      {!props.withOutLabel && (
        <label>
          {props.label}
          {props.requiredField && <span className="mendatory_sign">*</span>}
        </label>
      )}
      <div className="psw_input_container">
        <input
          {...field}
          {...props}
          className={`form-control ${error && touch && 'is-invalid'} ${props.inputClassName} `}
        />
        <div className={error && touch && 'input_invalid'}>
          {props.show ? (
            <i onClick={() => props.setShow(false)} className="icofont-eye cp" />
          ) : (
            <i onClick={() => props.setShow(true)} className="icofont-eye-blocked cp" />
          )}
        </div>
      </div>
      {error && touch && <div className="invalid-feedback d-block mb-1">{error}</div>}
    </div>
  );
};
export const CustomCurrencyInput = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);

  return (
    <div className={`${props.styleData} space-y-10 ${props.pswClassName}`}>
      <label>
        {props.label}
        {props.requiredField && <span className="mendatory_sign">*</span>}
      </label>
      <div className="currency_input_container">
        <input
          {...field}
          {...props}
          className={`form-control ${error && touch && 'is-invalid'} ${props.inputClassName} `}
        />

        <i className="icofont-rupee cp" />
        <div className={error && touch && 'input_invalid'}>
          <small>/{props?.duration || 'Month'}</small>
        </div>
      </div>
      {error && touch && <div className="invalid-feedback d-block mb-1">{error}</div>}
    </div>
  );
};

export const CustomTextArea = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);

  return (
    <div className={`${props.styleData} space-y-10`}>
      <label>
        {props.label}
        {props.requiredField && <span className="mendatory_sign">*</span>}
      </label>
      <textarea
        {...field}
        {...props}
        className={`form-control ${error && touch && 'is-invalid'} ${props.inputClassName} `}
      />
      {error && touch && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export const CustomDropdown = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);

  return (
    <div className={`${props.styleData} space-y-10`}>
      {!props.withOutLabel && (
        <label>
          {props.label}
          {props.requiredField && <span className="mendatory_sign">*</span>}
        </label>
      )}
      <select
        {...field}
        {...props}
        onChange={e => {
          field.onChange(e);
          if (props.handleChange) {
            props.handleChange(e);
          }
        }}
        className={`form-select custom-select ${props.inputClassName} ${
          error && touch && 'is-invalid'
        }`}
      >
        <option value="" disabled>
          {props.placeholder}
        </option>
        {props.data &&
          props.data.map(i => (
            <option key={Math.random()} value={i.value}>
              {i.label}
            </option>
          ))}
      </select>
      {error && touch && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export const CustomReactSelect = ({
  field,
  options,
  isMulti = false,
  disabled = false,
  form: { touched, errors },
  ...props
}) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);
  const { setFieldValue } = useFormikContext();
  const onChange = option => {
    setFieldValue(field.name, isMulti ? option.map(item => item.value) : option.value);
  };
  const getValue = () => {
    if (options) {
      return isMulti
        ? options.filter(option => field?.value?.indexOf(option.value) >= 0)
        : options.find(option => option.value === field.value);
    } else {
      return isMulti ? [] : '';
    }
  };
  let optionsWithOther;
  if (props.addOtherOption) {
    optionsWithOther = [...options, { label: 'Other', value: 'other' }];
  }
  return (
    <>
      <div className={props.styleData + ' max_250'} style={props.style}>
        {!props.withOutLabel && (
          <label>
            {props.label}
            {props.requiredField && <span className="mendatory_sign">*</span>}
          </label>
        )}
        <Select
          name={field.name}
          value={getValue()}
          onChange={onChange}
          placeholder={props.placeholder}
          options={props.addOtherOption ? optionsWithOther : options}
          isMulti={isMulti}
          className={`form-control p-0 ${props.inputClassName} ${error && touch && 'is-invalid'}`}
          isDisabled={disabled}
        />
        {error && touch && <div className="invalid-feedback">{error}</div>}
      </div>
    </>
  );
};

export const CustomRadioButton = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);
  return (
    <div className={`${props.styleData} space-y-10 custom_radio`}>
      <div className="d-flex space-x-10 switch_item">
        <label className={`${props.className} d-flex mx-2`}>
          <input
            {...props}
            {...field}
            className={`${props.inputClassName} ${error && touch && 'is-invalid'}`}
            id={props.label}
            onChange={e => {
              field.onChange(e);
              if (props.handleChange) {
                props.handleChange(e);
              }
            }}
          />
          <span className="label-span">{props.label}</span>
        </label>
        {/* {!props.withOutLabel && (
            <label>
              {props.label}
              {props.requiredField && <span className="mendatory_sign">*</span>}
            </label>
          )} */}
        {/* <label className="" htmlFor={props.label} /> */}
      </div>
      {error && touch && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export const CustomCheckbox = ({ field, form: { touched, errors }, ...props }) => {
  const touch = getIn(touched, field.name);
  const error = getIn(errors, field.name);
  const { setFieldValue } = useFormikContext();
  return (
    <>
      <div className="cursor-pointer custom-checkbox wrapper justify-content-start">
        <input
          name={props.name}
          id={props.id}
          type="checkbox"
          className={`${error && touch && 'is-invalid'} ${props.checkboxclass} cp`}
          checked={props.val}
          disabled={props.disabled}
          onChange={() => {
            setFieldValue(field.name, !props.val);
          }}
        />
        <label
          className={`${props.inputClassName} d-flex`}
          htmlFor={props.id}
          style={{ userSelect: 'none' }}
        >
          {props.label}
        </label>
      </div>
      {error && touch && <div className="invalid-feedback d-block mt-0">{error}</div>}
    </>
  );
};

export const CustomReactDatePicker = ({
  field,
  form: { touched, errors },
  range = false,
  ...props
}) => {
  const touch = touched[field.name];
  const error = errors[field.name];

  return (
    <div className={`${props.styleData} space-y-10`}>
      {!props.withOutLabel && (
        <label>
          {props.label}
          {props.requiredField && <span className="mendatory_sign">*</span>}
        </label>
      )}
      {range ? (
        <DatePicker
          {...props}
          startDate={field.value[0] ? new Date(field.value[0]) : null}
          endDate={field.value[1] ? new Date(field.value[1]) : null}
          selectsRange
          onChange={dates => {
            field.onChange({
              target: {
                name: field.name,
                value: dates,
              },
            });
          }}
          className={`form-control ${error && touch ? 'is-invalid' : ''} ${props.inputClassName}`}
        />
      ) : (
        <DatePicker
          {...field}
          {...props}
          selected={field.value ? new Date(field.value) : null}
          onChange={date => {
            field.onChange({
              target: {
                name: field.name,
                value: date,
              },
            });
          }}
          className={`form-control ${error && touch ? 'is-invalid' : ''} ${props.inputClassName}`}
        />
      )}
      {error && touch && <div className="invalid-feedback d-block mb-1">{error}</div>}
    </div>
  );
};
