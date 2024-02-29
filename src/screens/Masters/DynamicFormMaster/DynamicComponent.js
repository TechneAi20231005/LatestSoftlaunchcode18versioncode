import React, { useState, useEffect } from 'react'
import DynamicFormDropdownMasterService from "../../../services/MastersService/DynamicFormDropdownMasterService";

function DynamicComponent(props) {
    // console.log(props);
    const [selectedDropdown, setSelectedDropdown] = useState();
    const [selectedDropdownValues, setSelectedDropdownValues] = useState();

    const [selectedOption, setSelectedOption] = useState("");

    const handleOptionChange = (value) => {
        setSelectedOption(value);
    };

    const loadData = async () => {
        if (props && props.data.inputType == "select" && props.data.inputAddOn.inputDataSource) 
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

   if(props)
   {
        if(props.data.inputAddOn.inputRange!==null)
        {
            var range=props.data.inputAddOn.inputRange.split("|")
        }else if(props.data.inputAddOn.inputDateRange){
            var range=props.data.inputAddOn.inputDateRange.split("|")
        }
        

       




    return (
        <>
        {props.data.inputType==="number" &&
            <span>
            <input
            type="text"
            placeholder='Eg. 0|100'
            className="form-control form-control-sm"
            onChange={props.onGetChange}
            id="inputRange"
            name="inputRange"
            min={props.data.inputAddOn.inputRange ? range[0] : ''}
            max={props.data.inputAddOn.inputRange ? range[1] : ''}
            />
            <small style={{'color':'red'}}><b>Min|Max(Range)</b></small>
            </span>   
        }   

        {props.data.inputType==="select" &&
            <span>
                <select className="form-control form-control-sm" 
                onChange={props.onGetChange}
                // onChange={(e) => {
                //     props.onGetChange(e.target.value); // Call onGetChange with the selected value
                // }}
                id="inputDataSource[]"
                name="inputDataSource[]"
                // value={props.selectData}
                >
                    <option>Select Data Source</option>
                    <option value="user">User Master</option>
                    <option value="department">Department Master</option>
                    <option value="role">Role Master</option>
                    {/* <option value="department|id|department">Department Master</option> */}
                    {/* <option value="role|id|role">Role Master</option> */}
                </select>
                <small style={{'color':'red'}}><b>Select Data Source</b></small> 
            </span>
        }



{props.data.inputType === "decimal" &&
                    <div className="d-flex justify-content-between">
                        <div class="form-group">
                            <label>Min Number:</label>
                            <input
                                type="number"
                                onChange={props.onGetChange}
                                id="inputRangeMin"
                                name="inputRangeMin"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMin}
                                min={props.data.inputAddOn.inputRangeMin}
                            />
                        </div>
                        <div className="form-group">
                            <label>Max Number:</label>
                            <input
                                type="number"
                                onChange={props.onGetChange}
                                id="inputRangeMax"
                                name="inputRangeMax"
                                className="form-control form-control-sm"
                                defaultValue={props.data.inputAddOn.inputRangeMax}
                                max={props.data.inputAddOn.inputRangeMax}

                            />
                        </div>
                    </div>
                }


{ props.data.inputType === "radio" &&
                    <span>
                        <select className="form-control form-control-sm"
                            onChange={props.onGetChange}
                            
                            id="inputOnChangeSource"
                            name="inputOnChangeSource">
                            <option>Select Data Source</option>
                            {/* {props.radioSelect && props.radioSelect.map((d, i) => {
                                if (selectedDropdown == d.value) {
                                    return <option value={d.value} >{d.label}</option>
                                } else {
                                    return <option value={d.value}>{d.label}</option>
                                }
                            })
                            } */}
                                {props&&props.dropdown && props.dropdown.map((d, i) => {
                                if (selectedDropdown == d.id) {
                                    return <option value={d.id} selected>{d.dropdown_name}</option>
                                } else {
                                    return <option value={d.id}>{d.dropdown_name}</option>
                                }
                            })
                            }
                        </select>
                        <small style={{ 'color': 'red' }}><b>Select Data Source</b></small>
                    </span>  
                }
        
        {props.data.inputType==="date" &&
            <span>
                <input
                    type="text"
                    onChange={props.onGetChange}
                    id="inputDateRange"
                    name="inputDateRange"
                    placeholder='Eg. 2022-01-01|2022-02-01'
                    className="form-control form-control-sm"
                    min={props.data.inputAddOn.inputDateRange ? range[0] : ''}
                    max={props.data.inputAddOn.inputDateRange ? range[1] : ''}
                />
                <small style={{'color':'red'}}><b>Min|Max (YYYY-MM-DD)</b></small>
            </span>   
        }        

        {props.inputType==="radio" &&
            <span>
            <input
            type="text"
            id="inputRadio"
        name="inputRadio"

            // id={props.inputAddOn} name={props.inputAddOn}
            placeholder='Eg. 1:True|0:False'
            className="form-control form-control-sm"
            />
            <small style={{'color':'red'}}><b>Actual_value|Display Value</b></small>
            </span>   
        }


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




{/* 
                        {props.inputType == "radio" && props.inputAddOn.inputRadio
                          ? props.inputAddOn.inputRadio.map((d) => {
                              return (
                                <div>
                                  <input type="radio" />
                                  <label for={d.value}>{d.label}</label>
                                </div>
                              );
                            })
                          : ""} */}
                       
             
            
        </>
    )
   }else{
       return <></>
   }
}

export default DynamicComponent
