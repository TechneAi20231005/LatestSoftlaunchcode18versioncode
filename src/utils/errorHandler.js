import { toast } from 'react-toastify';

export default function errorHandler(response = '') {
  if (
    response !== undefined &&
    response !== undefined &&
    response.status !== undefined
  ) {
    if (response.status === 200 && response.data.status === 0) {
      toast.error(response.data.message);
    }
    if (response.status === 500) {
      toast.error('Server error! Please try again later.');
    }
    if (response.status === 400) {
      toast.error(response.data.message);
    }
    if (response.status === 403) {
      toast.error(response.data.message);
    }
    if (response.status === 422) {
      toast.error(response.data.message);
    }
    if (response.status === 401) {
      // // logoutAction({ forceLogout: true })
      toast.error('user force logout');
    }
    if (typeof response.data.message === 'object') {
      toast.error(response.data.message.join('\n'));
    }
    if (response.data.message === undefined || response.data.message === '') {
      toast.error('Something went wrong! Please try again later.');
    }
  } else {
    toast.error('Something went wrong! Please try again later.');
  }
}
