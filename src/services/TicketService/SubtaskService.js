import axios from 'axios';
import { ticketUrl } from '../../settings/constants';
import { getDateTime } from '../../components/Utilities/Functions';
const _URL = ticketUrl.subtask;

export default class SubtaskService {
  getSubtask(taskId) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(_URL + '/getData/' + taskId, config);
  }

  postSubtask(payload) {
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
    return axios.post(_URL + '/postData', payload, config);
  }

  completeSubtask(subtaskId, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/postData/' + subtaskId, payload, config);
  }

  deleteSubtask(subtaskId, payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_URL + '/postData/' + subtaskId, payload, config);
  }
}
