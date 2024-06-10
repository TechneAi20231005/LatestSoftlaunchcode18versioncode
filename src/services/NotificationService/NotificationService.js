import axios from 'axios';
import { userSessionData } from '../../settings/constants';
import { notificationUrl } from '../../settings/constants';

const _URL = notificationUrl;

const _getNotification =
  _URL + '/getNotification/' + localStorage.getItem('id');

const _markedReadNotification = _URL + '/markedReadNotification/';
const _getAllNotification =
  _URL + '/getAllNotification/' + localStorage.getItem('id');

const _markAllReadAsNotification = _URL + '/markAllAsReadNotification/';

export function getData() {
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

export function postData(payload) {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return axios.post(_URL, payload, config);
}

export function getNotification() {
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_getNotification, config);
}

export function markedReadNotification(id) {
  const token = localStorage.getItem('jwt_token');

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
  const token = localStorage.getItem('jwt_token');

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
  const token = localStorage.getItem('jwt_token');

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return axios.get(_markAllReadAsNotification + userId, config);
}
