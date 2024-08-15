import axios from 'axios';
import { attachmentUrl } from '../../settings/constants';

export function getAttachment(id, type) {
  if (id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(`${attachmentUrl}` + '/' + id + '/' + type, config);
  }
}

export function deleteAttachment(id) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.delete(`${attachmentUrl}` + '/' + id, config);
}
