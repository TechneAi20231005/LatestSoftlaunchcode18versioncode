
import React, { useEffect, useState }  from "react";
import { Modal } from "react-bootstrap";
import PageHeader from "../../../components/Common/PageHeader";
import Select from 'react-select';
import DataTable from "react-data-table-component";
import ErrorLogService from "../../../services/ErrorLogService";
import QueryTypeService from "../../../services/MastersService/QueryTypeService";
import Alert from "../../../components/Common/Alert";
import {DynamicFormDropdown} from "../DynamicFormMaster/DynamicFormComponent";
import {Astrick} from "../../../components/Utilities/Style";
import *  as Validation from '../../../components/Utilities/Validation';

function QueryTypeComponentCopy() {
    const [notify, setNotify]=useState(null);
    const [data, setData] = useState(null);
    const [modal,setModal] = useState({showModal:false,modalData:"",modalHeader:""});

    const handleModal = (data) =>{
        setModal(data);
    }                                        
    
    const columns=[
                    { name: "Action",selector: (row)=>{},sortable: false, 
                        cell:(row)=>
                            <div className="btn-group" role="group" >
                                <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#edit" 
                                    onClick={(e)=>{ 
                                        handleModal({showModal:true,modalData:row,modalHeader:'Edit Customer Type'}) 
                                    }}
                                ><i className="icofont-edit text-success"></i>
                                </button>
                            </div>
                    },
                    { name: "Sr",selector: (row)=>row.counter,sortable: true },
                    { name: "Customer Type Name",selector: (row)=>row.query_type_name,sortable: true },
                    { name: "Status",selector: (row)=>row.is_active,sortable: false,
                      cell:(row)=><div>
                                    {row.is_active==1  &&  <span className="badge bg-primary">Active</span> }
                                    {row.is_active==0  &&  <span className="badge bg-danger">Deactive</span> }
                                </div>
                    },
                    { name: "Updated At",selector: (row)=>row.updated_at,sortable: true },
                    { name: "Updated By",selector: (row)=>row.updated_by,sortable: true },
                   
                ];

    const loadData = async() => {
        const data=[];
        await new QueryTypeService().getQueryType().then(res =>{
            if(res.status===200){
                let counter=1;
                const temp=res.data.data;
                for (const key in temp) {
                    data.push({
                        counter:counter++,  
                        id: temp[key].id,
                        query_type_name: temp[key].query_type_name,
                        form_id:temp[key].form_id,
                        is_active:temp[key].is_active,
                        remark :temp[key].remark,
                        updated_at : temp[key].updated_at,
                        updated_by : temp[key].updated_by,
                    })
                }
                setData(null);
                setData(data);
            }
        }).catch(error => {
            const { response } = error;
            const { request, ...errorObject } = response; 
            new ErrorLogService().sendErrorLog("QueryType","Get_QueryType","INSERT",errorObject.data.message);
         })
    }       

    const handleForm = id =>async(e) => {
        e.preventDefault();
        setNotify(null);
        const form=new FormData(e.target);
        if(!id){
            await new QueryTypeService().postQueryType(form).then(res=>{
                if(res.status===200){
                    if(res.data.status===1){
                        setModal({showModal:false,modalData:"",modalHeader:""});
                        setNotify({type: 'success', message:res.data.message});
                        loadData();
                    }else{
                        setNotify({type: 'danger', message:res.data.message});
                    }
                }else{
                    setNotify({type: 'danger', message:res.message});
                    new ErrorLogService().sendErrorLog("QueryType","Create_QueryType","INSERT",res.message);    
                }
            }).catch(error => {
                setNotify({type: 'danger', message:"Connection Error !!!"});
                const { response } = error;
                const { request, ...errorObject } = response; 
                setNotify({type: 'danger', message:"Remark Error !!!"});
                new ErrorLogService().sendErrorLog("QueryType","Create_QueryType","INSERT",errorObject.data.message);
            })
        }else{
            await new QueryTypeService().updateQueryType(id,form).then(res=>{
                if(res.status===200){
                    if(res.data.status===1)
                    {
                        setModal({showModal:false,modalData:"",modalHeader:""});
                        setNotify({type: 'success', message:res.data.message});
                        loadData();
                    }else{
                        setNotify({type: 'danger', message:res.data.message});
                    }
                }else{
                    setNotify({type: 'danger', message:res.message});
                    new ErrorLogService().sendErrorLog("QueryType","Edit_QueryType","INSERT",res.message);    
                }
            }).catch(error => {
                const { response } = error;
                const { request, ...errorObject } = response; 
                setNotify({type: 'danger', message:"Remark Error !!!"});
                new ErrorLogService().sendErrorLog("QueryType","Edit_QueryType","INSERT",errorObject.data.message);
            })
        }
    }

    useEffect(() => {
        loadData();
    }, [])

  return (
    <div className="container-xxl">
        {notify && <Alert alertData={notify} />}
            <PageHeader headerTitle="Query Type Master" renderRight={()=>{
                return <div className="col-auto d-flex w-sm-100">
                            <button className="btn btn-dark btn-set-task w-sm-100" onClick={()=>{ handleModal({showModal:true,modalData:null,modalHeader:'Add Query Type'})  }}>
                                <i className="icofont-plus-circle me-2 fs-6"></i>Add Query Type
                            </button>
                        </div>
            }}/>
        <div className='card mt-2'>
                <div className='card-body'> 
            <div className="row clearfix g-3">
                <div className="col-sm-12">
                    {data && <DataTable
                                columns={columns}
                                data={data}
                                defaultSortField="title"
                                pagination
                                selectableRows={false}
                                className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                                highlightOnHover={true}
                                />
                    }
                </div>
            </div>
                    </div>
                    </div>

            <Modal centered show={modal.showModal} 
                    onHide={(e)=>{handleModal({
                                                showModal:false,
                                                modalData:"",
                                                modalHeader:""
                                            }) }}>
                <form method="post" onSubmit={handleForm(modal.modalData?modal.modalData.id:'')}>

                    <Modal.Header closeButton>
                        <Modal.Title className="fw-bold">{modal.modalHeader}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    
                        <div className="deadline-form">
                
                            <div className="row g-3 mb-3">

                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Query Type Name : <Astrick color="red" size="13px"/></label>
                                    <input type="text" 
                                        className="form-control form-control-sm" 
                                        id="query_type_name"     
                                        name="query_type_name"
                                        required
                                        defaultValue={modal.modalData?modal.modalData.query_type_name:""}
                                        onKeyPress={e => { Validation.CharactersOnly(e) } }
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Select Form :</label>
                                    <DynamicFormDropdown 
                                        id="form_id"
                                        name="form_id"
                                        required
                                        defaultValue={modal.modalData?modal.modalData.form_id:""}
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Remark :</label>
                                    <input type="text" 
                                        className="form-control form-control-sm" 
                                        id="remark"   
                                        name="remark"  
                                        defaultValue={modal.modalData?modal.modalData.remark:""}
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <label className="form-label font-weight-bold">Status : <Astrick color="red" size="13px"/></label>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_1" 
                                                value="1" 
                                                defaultChecked={ (modal.modalData && modal.modalData.is_active===1) ? true : ((!modal.modalData) ? true :false ) }
                                                />
                                                <label className="form-check-label" htmlFor="is_active_1">
                                                    Active
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-1">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="is_active" id="is_active_0" value="0" 
                                                    readOnly={(modal.modalData) ? false : true }
                                                    defaultChecked={ (modal.modalData && modal.modalData.is_active===0) ? true : false }
                                                />
                                                <label className="form-check-label" htmlFor="is_active_0">
                                                    Deactive
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {!modal.modalData &&  <button type="submit" className="btn btn-primary text-white" style={{backgroundColor:"#484C7F"}}>
                                Add
                            </button>      
                        } 
                        {modal.modalData &&   <button type="submit" className="btn btn-primary text-white" style={{backgroundColor:"#484C7F"}}  >
                                Update
                            </button>      
                        } 
                        <button type="button" className="btn btn-danger text-white"
                                onClick={()=>{ handleModal({showModal:false,modalData:"",modalHeader:"" })}} >
                            Cancel
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>

        </div>
  )
}

function QueryTypeDropdownCopy(props){
    const [data, setData] = useState(null);
    const [defaultValue, setDefaultValue] = useState(null);

    useEffect( async () => {
        const tempData=[];
        const tempDefaultValue=[];

        await new QueryTypeService().getQueryType().then(res =>{
            if(res.status===200){
                    let counter=1;
                    const data=res.data.data;
                    for (const key in data) {
                        if(props.defaultValue && props.defaultValue!=null && props.defaultValue !=0 ){
                            if(props.defaultValue==data[key].id){
                                tempDefaultValue.push({value:data[key].id.toString(),label:data[key].query_type_name});
                            }
                        }
                        tempData.push({  
                            value: data[key].id,
                            label: data[key].query_type_name
                        })
                }
                setData(null);
                setData(tempData);
                setDefaultValue(null);
                setDefaultValue(tempDefaultValue);
            }
        });
    },[])
    return (
        <>
            { data && !props.defaultValue && defaultValue?.length == 0 && <Select
                            options={data}
                            id={props.id} 
                            name={props.name}
                            required={props.required ? true : false }   
                            onChange={e=>props.getChange}
                        />
                    }
            { data && props.defaultValue && defaultValue?.length > 0 && 
                        <Select
                            defaultValue={defaultValue}
                            options={data}
                            id={props.id} 
                            name={props.name}
                            required={props.required ? true : false }   
                            onChange={e=>props.getChange}
                    />
            }

            { data && props.defaultValue && defaultValue?.length == 0 && 
                        <Select
                            options={data}
                            id={props.id} 
                            name={props.name}
                            required={props.required ? true : false }   
                            onChange={e=>props.getChange}
                    />
            }
            {!data && <p> Loading....</p>}
        </>
        
    )
}

export  {QueryTypeComponentCopy,QueryTypeDropdownCopy};
