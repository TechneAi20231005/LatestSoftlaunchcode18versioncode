import axios from 'axios';
import { masterURL, userSessionData } from '../../settings/constants';
import { projectManagementUrl } from '../../settings/constants';

// const _URL=projectManagementUrl.projectUrl;
const _URL = masterURL.projectMaster;
console.log('url', _URL);
const _getAllProject = `${_URL}/getData?export=1`;
const _postProject = _URL + '/createProject';
const _getProjectById = _URL + '/getProjectById/';
const _updateProject = _URL + '/updateProject/';

export default class ProjectService {
  getProject() {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getAllProject, config);
  }

  postProject(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', userSessionData.time);

    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    };
    return axios.post(_postProject, payload, config);
  }

  getProjectById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getProjectById + id, config);
  }

  getReviewersByProject(projectId) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_URL + '/getProjectReviewers/' + projectId, config);
  }

  updateProject(id, payload) {
    payload.append('updated_by', userSessionData.userId);
    payload.append('tenant_id', userSessionData.tenantId);
    // payload.append('updated_at',userSessionData.time);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_updateProject + id, payload, config);
  }
}
