import axios from 'axios';
import {
  consolidateViewUrl,
  masterURL,
  userSessionData
} from '../../settings/constants';
import { projectManagementUrl } from '../../settings/constants';

const _URL = masterURL.subModuleMaster;

const _getAllSubModule = `${_URL}/getData?export=1`;
const _postSubModule = _URL + '/createSubModules';
const _getSubModuleById = _URL + '/getData/';
const _updateSubModule = _URL + '/createSubModules/';
const _updateSubModuleDoc =
  consolidateViewUrl.consolidateViewUrl + '/createProjectsSubModules';
const _getSubModuleDocumentById =
  consolidateViewUrl.consolidateViewUrl + '/getProjectsSubModules';
const _getDocumentHistory =
  consolidateViewUrl.consolidateViewUrl + '/getProjectAttachmentHistory';

const deleteRestoreSubModuleDoc =
  consolidateViewUrl.consolidateViewUrl +
  '/deleteRestoreProjectsSubModulesAttachment';
const updateProjectDocUrl =
  consolidateViewUrl.consolidateViewUrl + '/updateProjectDocument/';

export default class SubModuleService {
  getSubModule() {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getAllSubModule, config);
  }

  postSubModule(payload) {
    payload.append('tenant_id', userSessionData.tenantId);
    payload.append('created_by', userSessionData.userId);
    payload.append('created_at', userSessionData.time);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_postSubModule, payload, config);
  }

  getSubModuleById(id) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(_getSubModuleById + id, config);
  }

  updateSubModule(id, payload) {
    payload.append('updated_by', userSessionData.userId);
    payload.append('updated_at', userSessionData.time);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(_updateSubModule + id, payload, config);
  }

  postSubModuleDocument(payload) {
    //  payload.append('created_by',userSessionData.userId);
    //  payload.append('created_at',userSessionData.time);
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data'
      }
    };
    return axios.post(_updateSubModuleDoc, payload, config);
  }

  getSubModuleDocuments(projectId, moduleId, type, subModuleId) {
    const token = localStorage.getItem('jwt_token');
    const userId = localStorage.getItem('id');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };

    return axios.get(
      `${_getSubModuleDocumentById}/${projectId}/${moduleId}/${type}/${subModuleId}`,
      config
    );
  }

  deleteAndRestoreSubModuleDocuments(payload) {
    const token = localStorage.getItem('jwt_token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(`${deleteRestoreSubModuleDoc}`, payload, config);
  }

  getHistoryOfDOcument(docId) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.get(`${_getDocumentHistory}/${docId}`, config);
  }

  updateProjectDocument(docId, payload) {
    const token = localStorage.getItem('jwt_token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    };
    return axios.post(updateProjectDocUrl + docId, payload, config);
  }
}

// /{id}
