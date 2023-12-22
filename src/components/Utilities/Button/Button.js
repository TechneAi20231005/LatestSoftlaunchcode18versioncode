import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";
import { ExportToExcel } from "../../../components/Utilities/Table/ExportToExcel";



export function ButtonComponent(props) {
  const getIcon = (type, color, size) => {
    const fontSize = size ? size : 15;
    switch (type) {
      case "Add":
        return (
          <i
            className={`icofont-plus-circle text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
        break;
      case "Edit":
        return (
          <i
            className={`icofont-edit text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
        break;
      case "Cancel":
        return (
          <i
            className={`icofont-arrow-left text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
        break;
      case "Delete":
        return (
          <i
            className={`icofont-ui-delete text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
        break;
      case "Task":
        return (
          <i
            class={`icofont-tasks text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
      case "View":
        return (
          <i
            class={`icofont-paper text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
      case "Detail":
        return (
          <i
            class={`icofont-external text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
      default:
      case "Excel":
        return (
          <i
            class={`icofont-file-excel text-${color ? color : "white"}`}
            style={({ marginRight: "25px" }, { fontSize: fontSize })}
          ></i>
        );
        break;
    }
  };

  return (
    <>
      {props.type === "Link" && (
        <Link
          to={props.url}
          className={`btn btn-${props.buttonColor} text-${props.textColor}`}
        >
          {props.icon &&
            getIcon(props.icon.type, props.icon.color, props.icon.size)}
          {props.text}
        </Link>
      )}

      {props.type === "submit" && (
        <button
          type="submit"
          to={props.url}
          className="btn btn-primary"
          title={props.title}
          style={{ background: "#484c7f" }}
          disabled={props.disabled ? true : false}
        >
          {props.icon &&
            getIcon(props.icon.type, props.icon.color, props.icon.size)}
          {props.text}
        </button>
      )}

      {props.type === "button" && (
        <button
          type="button"
          className={`btn btn-sm btn-${props.buttonColor} text-${props.textColor}`}
          onClick={props.getClick}
          title={props.title}
        >
          {props.icon &&
            getIcon(props.icon.type, props.icon.color, props.icon.size)}
          {props.text}
        </button>
      )}
    </>
  );
}

export function InputComponent(props) {
  return (
    <>
      <input
        type="text"
        className="form-control form-control-sm"
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue ? props.defaultValue : null}
        minLength={props.minLength}
        maxLength={props.maxLength}
        onChange={props.getInputValue}
        onKeyPress={props.onInputKey}
        required={props.required ? true : false}
      />
    </>
  );
}

export function PasswordComponent(props) {
  return (
    <>
      <input
        type="password"
        className="form-control form-control-sm"
        id={props.id}
        name={props.name}
        value={props.defaultValue}
        onChange={props.getInputValue}
        required={props.required ? true : false}
      />
    </>
  );
}

export function DateComponent(props) {
  return (
    <>
      <input
        type="date"
        className="form-control form-control-sm"
        id={props.id}
        name={props.name}
        defaultValue={props.defaultValue}
        readOnly={props.readOnly}
        onChange={props.getInputValue}
        min={props.min}
        max={props.max}
        required={props.required ? true : false}
      />
    </>
  );
}

export function TextareaComponent(props) {
  return (
    <>
      <textarea
        className="form-control form-control-sm"
        id={props.id}
        name={props.name}
        onChange={props.getInputValue}
        rows="5"
        readOnly={props.readonly ? true : false}
        required={props.required ? true : false}
        defaultValue={props.defaultValue}
      />
    </>
  );
}

export function DropdownComponent(props) {
  return (
    <>
      <select
        className={props.className}
        id={props.id}
        name={props.name}
        required={props.required === true ? true : false}
        onChange={props.getInputValue}
        // value={props.selectedValue ?props.selectedValue : ""}  
        placeholder={props.placeholder}

   
        defaultValue={props.selectedValue} // Set the selected value of the dropdown
      >
        {props.selectedValue == "" &&
        <option> Select Type </option>
          }
        {props.data.map((value, index) => {
          return (
            <option key={index} value={value.value}>
              {value.label}
            </option>
          );
        })}
      </select>
    </>
  );
}

export const SearchComponent = React.forwardRef((props, ref) => {
  const clearInput = () => {
    ref.current.value = ""; // Clear the input value
  };
  return (
    <div className="card card-body">
      <div className="row">
        <div className="col-md-9">
          <input
            type="text"
            className="form-control"
            ref={ref}
            onKeyDown={props.handleKeyDown}
            placeholder={props.placeholder}
          />
        </div>
        <div className="col-md-3">
          <button
            className={props.className}
            style={props.style}
            onClick={props.handleSearch}
          >
            <i className={props.Searchicon}></i>
            {props.buttonName1}
          </button>

          <button
            className={props.className2}
            style={props.style}
            onClick={() => window.location.reload(false)}
          >
            <i className="icofont-refresh text-white"></i>
            {props.buttonName2}
          </button>
          <ExportToExcel
              className={props.className3}
               apiData={props.apiData} 
              fileName={props.fileName}
            />


        </div>
      </div>
    </div>
  );
});

export function ReactSelectComponent(props) {
  const options = props.data.map((value, index) => ({
    value: value.value,
    label: value.label,
  }));

  return (
    <Select
      id={props.id}
      name={props.name}
      options={options}
      isMulti={props.isMulti} // Add the isMulti prop here
      onChange={(selectedOption) => {
        if (props.getInputValue) {
          props.getInputValue(selectedOption.value);
        }
      }}
      placeholder={`Select ${props.selectName}`}
    />
  );
}
