import React, { useEffect, useState }  from "react";
import {Link,useNavigate} from 'react-router-dom';
import PageHeader from "../../components/Common/PageHeader";
import {Spinner,Modal} from 'react-bootstrap';
import Alert from '../../components/Common/Alert';
import {_base} from '../../settings/constants';
import ProfileImg from "../../assets/images/profile_av.png";
import UserService from "../../services/MastersService/UserService";
function PendingTask() {
  return (

    <div className="container-xxl">
        <PageHeader headerTitle="Pending Task" /> 
    </div>
  )
}

export default PendingTask