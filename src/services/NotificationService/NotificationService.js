import axios from 'axios';
import { notificationUrl } from '../../settings/constants';

const _getNotification =
  notificationUrl + '/getNotification/' + sessionStorage.getItem('id');

const _markedReadNotification = notificationUrl + '/markedReadNotification/';
const _markedReadRegularizationNotification =
  notificationUrl + '/markAllAsReadNotification/';

const _getAllNotification =
  notificationUrl + '/getAllNotification/' + sessionStorage.getItem('id');

const _markAllReadAsNotification =
  notificationUrl + '/markAllAsReadNotification/';

const token = localStorage.getItem('jwt_token');

export function getData() {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(notificationUrl, config);
}

export function postData(payload) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(notificationUrl, payload, config);
}

export function getNotification() {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_getNotification, config);
}

export function markedAllReadRegularizationNotification({ id, type }) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(
    _markedReadRegularizationNotification + id + '/' + type,
    config
  );
}

export function markedReadNotification(id) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_markedReadNotification + id, config);
}

export function getAllNotification() {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_getAllNotification, config);
}

export function getAllmarkAllAsReadNotification(userId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_markAllReadAsNotification + userId, config);
}
