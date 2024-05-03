import { toast } from 'react-toastify';

export default function errorHandler(response = '') {
  if (response !== undefined && response !== undefined && response.status !== undefined) {
    if (response.status === 200 && response.data.status === 0) {
      toast.error(response.data.message);
    }
    if (response.status === 500) {
      toast.error(response.data.message ?? 'Server error! Please try again.');
    }
    if (response.status === 400) {
      toast.error(response.data.message);
    }
    if (response.status === 403) {
      toast.error(response.data.message);
    }
    if (response.status === 401) {
      // // logoutAction({ forceLogout: true })
      toast.error('user force logout');
    }
    if (
      response.data.message === undefined ||
      response.data.message === '' ||
      typeof response.data.message !== 'string'
    ) {
      toast.error('Server error! Please try again.');
    }
  } else {
    toast.error('Something went wrong! Please try again.');
  }
}
