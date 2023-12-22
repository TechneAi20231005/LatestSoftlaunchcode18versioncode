import React, { useEffect, useState } from 'react'
import DynamicFormDropdownMasterService from '../../../services/MastersService/DynamicFormDropdownMasterService';
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import { useRef } from 'react';

function RenderDynamicForm(props) {
    const [inputDataSource, setInputDataSource] = useState();
    const [dateValue, setDateValue] = useState(new Date())
    const query_id = props.data.inputAddOn.inputDataSource;
    const mandatoryRef = useRef()
    const loadData = async () => {
        if (props.data.inputType == "date") {
            setDateValue(new Date(props.data.inputDefaultValue));
        }

        await new DynamicFormDropdownMasterService().getDropdownById(query_id).then((res) => {
            if (res.status == 200) {
                if (res.data.status == 1) {
                    const temp = [];
                    res.data.data.dropdown.forEach(d => {
                        temp.push({ 'label': d.label, 'value': d.id });
                    })
                    // console.log(temp)
                    // rows[idx].inputAddOn.inputDataSourceData = temp;
                    setInputDataSource(temp)
                }
            }
        })
    }
    const handleMandatoryChange =() =>{
        if(mandatoryRef.current.props.value === null){
            return false;
        }
    }

    const onChangeDate = (value) => {
        setDateValue(new Date(value))
    }

    useEffect(() => {
        loadData()
    }, [props.data])

    if (props) {

        if (props.data.inputAddOn.inputRange) {
            var range = props.data.inputAddOn.inputRange.split("|")
        } else if (props.data.inputAddOn.inputDateRange) {
            var range = props.data.inputAddOn.inputDateRange.split("|")
        }
        return (
            <>

                <div key={props.data.index} className={`${props.data.inputWidth} mt-2`} >
                    <label><b>{props.data.inputLabel} :</b></label>
                    {props.data.inputType === 'text' &&
                        <input
                            type={props.data.inputType}
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            defaultValue={props.data.inputDefaultValue}
                            className="form-control form-control-sm"
                            onChange={props.dynamicChangeHandle}
                        />
                    }
                    {props.data.inputType === 'textarea' &&
                        <textarea
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            className="form-control form-control-sm"
                            onChange={props.dynamicChangeHandle}
                        >{props.data.inputDefaultValue}</textarea>
                    }
                    {props.data.inputType === 'date' &&
                        // <input
                        //     type={props.data.inputType}
                        //     id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                        //     name={props.data.inputName}
                        //     defaultValue={props.data.inputDefaultValue}
                        //     onChange={props.dynamicChangeHandle}
                        //     min={props.data.inputAddOn.inputDateRange ? range[0] : ''}
                        //     max={props.data.inputAddOn.inputDateRange ? range[1] : ''}
                        //     className="form-control form-control-sm"
                        // />
                        <div className='form-control'>
                            <DatePicker onChange={onChangeDate}
                            maxDate={"9999-12-31"}
                            
                            value={dateValue} format={props.data.inputFormat}

                                style={{ width: '100%' }}
                            />
                        </div>
                    }

                    {props.data.inputType === 'time' &&
                        <input
                            type={props.data.inputType}
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            defaultValue={props.data.inputDefaultValue}
                            className="form-control form-control-sm"
                        />
                    }


                    {props.data.inputType === 'number' &&
                        <input
                            type={props.data.inputType}
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            step="any"
                            defaultValue={props.data.inputDefaultValue}
                            onChange={props.dynamicChangeHandle}
                            // min={props.data.inputAddOn.inputRange ? range[0] : ''}
                            // max={props.data.inputAddOn.inputRange ? range[1] : ''}
                            className="form-control form-control-sm"
                        />
                    }



                    {/* {props.data.inputType === 'select' && 
                        // <select
                        //     id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                        //     name={props.data.inputName}
                        //     className="form-control form-control-sm"
                        //     onChange={props.dynamicChangeHandle}
                        // >
                        //     <option>Select {props.data.inputName}</option>
                        //     {props.data.inputAddOn.inputDataSourceData &&
                        //         props.data.inputAddOn.inputDataSourceData.map((option, index) => {
                        //             if (props.data.inputDefaultValue == option.value) {
                        //                 return <option value={option.value} selected>{option.label}</option>
                        //             } else {
                        //                 return <option value={option.value}>{option.label}</option>
                        //             }
                        //         })
                        //     }
                        // </select>
                    } */}


                    {props.data.inputType === 'select' &&
                        props.data.inputMultiple == true && props.data.inputMandatory== true &&
                        <Select
                            options={inputDataSource}
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            isMulti
                            className="form-control form-control-sm"
                            rules={{ required: true }}
                            required={props.data.inputMandatory ? true : false}
                        />
                    }

                    {props.data.inputType === 'select' &&
                        props.data.inputMultiple == null &&
                      
                        <Select
                            options={inputDataSource}
                            id={props.data.inputName ? props.data.inputName.replace(/ /g, "_").toLowerCase() : ''}
                            name={props.data.inputName}
                            ref={mandatoryRef}
                            onChange={handleMandatoryChange}
                            className="form-control form-control-sm"
                            required={props.data.inputMandatory ? true : false}
                        />
                    
                    }

                </div>
            </>
        )
    } else {
        return <></>
    }
}
export default RenderDynamicForm