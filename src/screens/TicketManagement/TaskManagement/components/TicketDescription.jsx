import React,{ useEffect, useState} from 'react';
import {_attachmentUrl} from '../../../../settings/constants';

export default function TicketDescription(props) {

    const [showDetails,setShowDetails]= useState(false);
    const [attachment,setAttachment]= useState(false);

    const detailsHandler = ()=>{
        setShowDetails(prev=>!prev);   
    }
    
    
  return (
    <div>
       {showDetails && <div class="p-0 m-0">
                <p className="p-0 m-0"><strong>Details :</strong></p>
                <p>{props.data.description}</p>

                <div className="d-flex">
                    {props.attachment && props.attachment.map((attachment, index) => {
                        return <div  key={index} className="justify-content-start"
                            style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
                            <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
                                <div className="card-header">
                                    {attachment.name}
                                    <div className="d-flex justify-content-center p-0 mt-1">
                                        <a href={`${_attachmentUrl}/${attachment.path}`}
                                            target='_blank'
                                            className='btn btn-primary btn-sm p-1'>
                                            View
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
        </div>

            </div>
        }


        <button className="btn btn-sm btn-primary" onClick={detailsHandler}> 
            {showDetails ? "Hide" : "Show" } Ticket Details
         </button>


        <i class="icofont-eye" style={{fontSize: "27px"}}></i>
<i class="icofont-eye-blocked" style={{fontSize: "27px"}}></i>

        
        {/* <i class="icofont-eye"></i>
            <i class="icofont-eye-blocked"></i> */}
            {/* <i class="icofont-eye-alt"></i> */}
            {/* <i class="icofont-eye-close"></i> */}
    </div>  
  )
}
