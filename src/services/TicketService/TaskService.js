import axios from 'axios';
import { ticketUrl, userSessionData, _apiUrl } from '../../settings/constants';
import { getDateTime } from '../../components/Utilities/Functions';

const _URL = ticketUrl.task;

export function getTask() {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.get(_URL, config);
}

export function getTaskHistory(taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.get(_URL + '/getTaskHistory/' + taskId, config);
}

export function postTask(payload) {
  // payload={...payload,'tenant_id':localStorage.getItem('tenant_id'),'created_by':localStorage.getItem('id'),'created_at':getDateTime()}
  payload.append('tenant_id', localStorage.getItem('tenant_id'));
  payload.append('created_by', localStorage.getItem('id'));
  payload.append('created_at', getDateTime());
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };

  return axios.post(_URL, payload, config);
}

export function updateTask(id, payload) {
  payload.append('tenant_id', localStorage.getItem('tenant_id'));
  payload.append('updated_by', localStorage.getItem('id'));
  payload.append('updated_at', getDateTime());
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data'
    }
  };
  return axios.post(_URL + '/' + id, payload, config);
}

export function deleteTask(taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.delete(_URL + '/' + taskId, config);
}

export function getTaskData(taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_URL + '/' + taskId, config);
}

export function postTimerData(payload) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.post(ticketUrl.timerData, payload, config);
}

export function postTimerDataGroupActivity(payload) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.post(ticketUrl.postTimerDataGroupActivity, payload, config);
}

export function getTaskPlanner(taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_URL + '/getTaskPlanner/' + taskId, config);
}

export function updateTaskPlanner(taskId, payload) {
  payload.append('updated_by', localStorage.getItem('id'));
  payload.append('updated_at', getDateTime());
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(_URL + '/updateTaskPlanner/' + taskId, payload, config);
}

export function getTaskUser(taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_URL + '/getTaskUser/' + taskId, config);
}

export function resourcePlanningUserTask(payload) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(_apiUrl + 'resourcePlanningUserTask', payload, config);
}

//Suyash 30/5/22
export function getTaskOwnerTime(payload) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.post(_apiUrl + 'taskOwnerTime', payload, config);
}

//Parth
export function requestRegularizationTime(payload) {
  payload.append('tenant_id', localStorage.getItem('tenant_id'));
  payload.append('created_by', localStorage.getItem('id'));
  payload.append('created_at', getDateTime());
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.post(_URL + '/requestRegularizationTime', payload, config);
}

export function taskRequestRegularizationTime(payload) {
  // payload.append('tenant_id',localStorage.getItem('tenant_id'));
  //  payload.append('created_by',localStorage.getItem('id'));
  //  payload.append('created_at',getDateTime());
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.post(_URL + '/taskRegularize', payload, config);
}

export function getRegularizationTime(ticketId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(
    _URL + '/getRegularizationTime/' + userSessionData.userId + '/' + ticketId,
    config
  );
}

export function getRegularizationTimeHistory({ type }) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(
    // _URL + `/getRegularizationTime/${userSessionData.userId}?type=${type}`,
    _URL +
      `/getRegularizationTime/${userSessionData.userId}${
        type ? `?type=${type}` : ''
      }`,

    config
  );
}
export function getRegularizationTimeData(ticketId, taskId) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(
    _URL + '/getTimeRegularizedData/' + ticketId + '/' + taskId,
    config
  );
}

export function getTaskRegularizationTime() {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_URL + '/taskRegularize', config);
}

export function changeStatusRegularizationTime(payload) {
  // payload.append('updated_by',localStorage.getItem('id'));
  // payload.append('updated_at',getDateTime());

  payload = {
    ...payload,
    updated_by: localStorage.getItem('id'),
    updated_at: getDateTime()
  };
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(_URL + '/changeStatusRegularizationTime', payload, config);
}

export function changeTaskStatusRegularizationTime(payload) {
  // payload.append('updated_by',localStorage.getItem('id'));
  // payload.append('updated_at',getDateTime());

  payload = {
    ...payload,
    updated_by: localStorage.getItem('id'),
    updated_at: getDateTime()
  };
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(_URL + '/changeStatusTaskRegularize', payload, config);
}
