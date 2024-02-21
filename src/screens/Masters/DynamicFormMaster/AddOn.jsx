import React, { useState, useEffect } from 'react'
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";
import Select from "react-select";


function AddOn(props) {

    const [selectedDropdown, setSelectedDropdown] = useState();
    const [selectedDropdownValues, setSelectedDropdownValues] = useState();



    const loadData = async () => {

        if (props && props.data.inputType == "select"  
        //  && props.data.inputAddOn.inputDataSource
         ) 
        {
            await new DynamicFormDropdownMasterService().getDropdownById(props.data.inputAddOn.inputDataSource).then((res) => {
                if (res.status == 200) {
                  if (res.data.status == 1) {
                        setSelectedDropdown(res.data.data.master.id)
                        setSelectedDropdownValues(res.data.data.dropdown.map((d) => ({ label: d.label, value: d.value })))
                        // rows[idx].inputAddOn.inputDataSourceData = data;
                    }
                }
            })
        }
    }

    useEffect(() => {
        loadData();
    }, [])



    const [minValue,setMinValue]= useState()
    const [maxValue,setMaxValue]= useState()



// const handleMin=(e)=>{
// setMinValue(e.target.value)
// }

// const handleMin = (e) => {
//   const min = parseFloat(e.target.value);
//   const max = parseFloat(props.data.inputAddOn.inputRangeMax);

//   if (!isNaN(min) && !isNaN(max) && min > max) {
//     // Min is greater than Max, so set Max to Min
//     props.onGetChange({
//       target: {
//         name: "inputRangeMax",
//         value: min.toString(),
//       },
//     });
//   } else {
//     setMinValue(e.target.value);
//   }
// };

console.log("min",minValue)



const handleMax = (e) => {
  const maxValue = e.target.value;

  if (parseInt(maxValue) < parseInt(minValue)) {
    setMaxValue("Invalid Remark");
  } else {
    setMaxValue("");
  }
};




    if (props) {
        var range=null;
        // if (props.data.inputAddOn.inputRange) 
        // {
        //     range = props.data.inputAddOn.inputRange.split("|")
        // } else if (props.data.inputAddOn.inputDateRange) {
        //     range = props.data.inputAddOn.inputDateRange.split("|")
        // }

        return (
            <>
                {props.data.inputType === "time" &&
                    <div className="d-flex justify-content-between" key={props.key}>
                        <div class="form-group">
                            <label>Min Time:</label>
                            <input
                                type="time"
                                onChange={props.onGetChange}
                                id="inputRangeMin"
                                name="inputRangeMin"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMin}
                                min={props.data.inputAddOn.inputRangeMin}
                            // max={props.data.inputAddOn.inputRangeMax ? props.data.inputAddOn.inputRangeMax : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Time:</label>
                            <input
                                type="time"
                                onChange={props.onGetChange}
                                id="inputRangeMax"
                                name="inputRangeMax"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMax}
                                // min={props.data.inputAddOn.inputRangeMin ? props.data.inputAddOn.inputRangeMin : ''}
                                max={props.data.inputAddOn.inputRangeMax}
                            />
                        </div>
                       
                 
                    </div>
                }

                {
                    props.data.inputType === "datetime-local" &&
                    <div className="d-flex justify-content-between">
                        <div class="form-group">
                            <label>Date-time:</label>
                            <input
                                type="datetime-local"
                                onChange={props.onGetChange}
                                id="datetime-local"
                                name="datetime-local"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputDateTime}
                                min={props.data.inputAddOn.inputDateTime}
                            />
                        </div>
                    </div>
                }

                { props.data.inputType === "radio" &&
                    <span>
                        <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            id="inputRadio"
                            name="inputRadio"
                        >
                            <option>Select Data Source</option>
                            {props.dropdown && props.dropdown.map((d, i) => {
                                if (props.radioSelect == d.label) {
                                    return <option selected ={props.radioSelect == d.label} value={d.value} >{d.label}</option>
                                } else {
                                    return <option selected ={props.radioSelect == d.label}  value={d.value}>{d.label}</option>
                                }
                            })
                            }
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select Data Source</b></small>
                    </span>  
                }
              { props.data.inputType === "checkbox" &&
                    <span>
                        <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            id="inputCheckbox"
                            name="inputCheckbox"
                        >
                            <option>Select Data Source</option>
                            {props.dropdown && props.dropdown.map((d, i) => {
                                if (props.checkboxSelect == d.label) {
                                    return <option selected ={props.checkboxSelect == d.label} value={d.value} >{d.label}</option>
                                } else {
                                    return <option selected ={props.checkboxSelect == d.label}  value={d.value}>{d.label}</option>
                                }
                            })
                            }
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select Data Source</b></small>
                    </span>  
                }

{
  props.data.inputType === "number" && (
    <div className="d-flex justify-content-between">
      <div className="form-group">
        <label>Min Number:</label>
        <input
          type="number"
          onChange={(e) => {
            const min = parseFloat(e.target.value);
            const max = parseFloat(props.data.inputAddOn.inputRangeMax);

            if (!isNaN(min) && !isNaN(max) && min > max) {
              // Min is greater than Max, so set Max to Min
              props.onGetChange({
                target: {
                  name: "inputRangeMax",
                  value: min.toString(),
                },
              });
            } else {
              props.onGetChange(e);
            }
          }}

          // onChange={(e) => {
          //   const min = parseFloat(e.target.value);
          //   const max = parseFloat(props.data.inputAddOn.inputRangeMax);
          
          //   setMinValue(min);
          //   if (!isNaN(min) && !isNaN(max) && min > max) {
          //     // Min is greater than Max, so set Max to Min
          //     props.onGetChange({
          //       target: {
          //         name: "inputRangeMax",
          //         value: min.toString(),
          //       },
          //     });
          //   } else {
          //     props.onGetChange(e);
          //   }}}
          id="inputRangeMin"
          name="inputRangeMin"
          className="form-control form-control-sm"
          defaultValue={props.data.inputAddOn.inputRangeMin}
          min={props.data.inputAddOn.inputRangeMin}
        />
        {console.log("props",props.data)}
      </div>
      <div className="form-group">
        <label>Max Number:</label>
        <input
          type="number"
          // onChange={(e)=>handleMax(e)}
          // onChange={handleMax}
          // onKeyPress={(e) => {
          //   handleMax(e);
          // }}

          onChange={(e) => {
            const max = parseFloat(e.target.value);
            const min = parseFloat(props.data.inputAddOn.inputRangeMin);

            if (!isNaN(max) && !isNaN(min) && max < min) {
              // Max is smaller than Min, so set Min to Max
              props.onGetChange({
                target: {
                  name: "inputRangeMin",
                  value: max.toString(),
                },
              });
            } else {
              props.onGetChange(e);
            }
          }}
          id="inputRangeMax"
          name="inputRangeMax"
          className="form-control form-control-sm"
          defaultValue={props.data.inputAddOn.inputRangeMax}
          max={props.data.inputAddOn.inputRangeMax}
        />
         <small
                    style={{
                      color: "red",
                    }}
                  >
                    {maxValue}
                  </small>
              
      </div>
    </div>
  )
}


{
  props.data.inputType === "decimal" && (
    <div className="d-flex justify-content-between">
      <div className="form-group">
        <label>Min Number:</label>
        <input
          type="text"
          onChange={(e) => {
            const input = e.target.value;

            // Use a regular expression to validate numeric input (integer or decimal)
            if (/^\d*\.?\d*$/.test(input)) {
              props.onGetChange({
                target: {
                  name: "inputRangeMin",
                  value: input,
                },
              });
            }
          }}
          id="inputRangeMin"
          name="inputRangeMin"
          className="form-control form-control-sm"
          defaultValue={props.data.inputAddOn.inputRangeMin}
        />
      </div>
      <div className="form-group">
        <label>Max Number:</label>
        <input
          type="text"
          onChange={(e) => {
            const input = e.target.value;

            // Use a regular expression to validate numeric input (integer or decimal)
            if (/^\d*\.?\d*$/.test(input)) {
              props.onGetChange({
                target: {
                  name: "inputRangeMax",
                  value: input,
                },
              });
            }
          }}
          id="inputRangeMax"
          name="inputRangeMax"
          className="form-control form-control-sm"
          defaultValue={props.data.inputAddOn.inputRangeMax}
        />
      </div>
    </div>
  )
}


                {props.data.inputType === "select" &&
                    <span>
                        {/* <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            id="inputOnChangeSource"
                            name="inputOnChangeSource"
                        >
                            <option>On Change Variable</option>
                                {props.labelNames && props.labelNames.map((d, i) => {
                                    return <option value={d}>{d}</option>
                                    })
                                }
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select On Change Variable</b></small> */}
                        <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            id="inputDataSource"
                            name="inputDataSource"
                        >
                            <option>Select Data Source</option>
                            {props.dropdown && props.dropdown.map((d, i) => {

                                if (selectedDropdown == d.value) {
                                    return <option value={d.value} selected>{d.label}</option>
                                } else {
                                    return <option value={d.value}>{d.label}</option>
                                }
                            })
                            }
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select Data Source</b></small>
                    </span>
                }

                {/* {props.data.inputType === "select-master" &&
                    <span>
                        <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            id="inputDataSource"
                            name="inputDataSource"
                        >
                            <option>Select Data Source</option>
                            <option value="user|id|employeeMaster">User Master</option>
                            <option value="department|id|getAllDepartment">Department Master</option>
                            <option value="role|id|role">Role Master</option>
                            <option value="customer|id|customer">Customer Master</option>
                            <option value="country|id|country">Country Master</option>
                            <option value="state|id|state">State Master</option>
                            <option value="city|id|city">City Master</option>
                            <option value="designation|id|designation">Designation Master</option>
                            <option value="status|id|status">Status Master</option>
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select Data Source</b></small>
                    </span>
                } */}

                {props.data.inputType === "date" &&
                    <div className="d-flex justify-content-between">
                        <div class="form-group">
                            <label>Min Date:</label>
                            <input
                                type="date"
                                onChange={props.onGetChange}
                                id="inputRangeMin"
                                name="inputRangeMin"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMin}
                                min={props.data.inputAddOn.inputRangeMin}
                            // max={props.data.inputAddOn.inputRangeMax}
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Date:</label>
                            <input
                                type="date"
                                onChange={props.onGetChange}
                                id="inputRangeMax"
                                name="inputRangeMax"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMax}
                                // min={props.data.inputAddOn.inputRangeMin}
                                max={props.data.inputAddOn.inputRangeMax}
                            />
                        </div>
                    </div>
                }

                {/* {props.inputType==="radio" &&
            <span>
            <input
            type="text"
            // id={props.inputAddOn} name={props.inputAddOn}
            placeholder='Eg. 1:True|0:False'
            className="form-control form-control-sm"
            />
            <small style={{'color':'red'}}><b>Actual_value|Display Value</b></small>
            </span>   
        } */}
            </>
        )
    } else {
        return <></>
    }
}

export default AddOn