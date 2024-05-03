import React,{useEffect,useState} from 'react';

import {_attachmentUrl} from "../../settings/constants";

export default function Attachment(props) {

    const handleAttachment = (type,attachment_id) =>{
        props.handleAttachment(type,props.refId,attachment_id);
    }

    return (
            <div className="d-flex">
            {props.data && props.data.map((attachment, index) => {
                return <div  key={index} className="justify-content-start"
                    style={{ marginRight: '20px', padding: '5px', maxWidth: '250px' }}>
                    <div className="card" style={{ backgroundColor: '#EBF5FB' }}>
                        <div className="card-header">
                            {attachment.name}
                            <div className="d-flex justify-content-between p-0 mt-1">
                                <a href={`${_attachmentUrl}/${attachment.path}`}
                                    target='_blank'
                                    downlaod
                                    className='btn btn-primary btn-sm p-1'>
                                    <i class="icofont-download" style={{ fontSize: '15px', height: '15px' }}></i>
                                </a>
                                <button className='btn btn-danger text-white btn-sm p-1'
                                    onClick={e => { 
                                                handleAttachment("DeleteAttachment",attachment.id) 
                                            }}
                                >
                                    <i class="icofont-ui-delete" style={{ fontSize: '15px' }}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>

  )
}
