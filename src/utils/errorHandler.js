import { toast } from 'react-toastify';

export default function errorHandler(response = '') {
  if (!response || typeof response !== 'object' || !response.status) {
    return showToast('Something went wrong! Please try again later.');
  }

  const { status, data } = response;
  const defaultErrorMessage = 'Something went wrong! Please try again later.';
  const statusHandlers = {
    200: () => {
      if (data?.status === 0 || data?.status === 3) {
        showToast(data.message);
      }
    },
    400: () => showToast(data?.message || defaultErrorMessage),
    401: () => showToast('User force logout'),
    403: () => showToast(data?.message || defaultErrorMessage),
    404: () => showToast(data?.message || defaultErrorMessage),
    422: () => showToast(data?.message || defaultErrorMessage),
    500: () => showToast('Server error! Please try again later.')
  };

  if (statusHandlers[status]) {
    statusHandlers[status]();
  } else if (typeof data?.message === 'object') {
    showToast(data.message.join('\n'));
  } else {
    showToast(data?.message || defaultErrorMessage);
  }
}
function showToast(message) {
  toast.error(message, { toastId: message });
}

// import { toast } from 'react-toastify';

// export default function errorHandler(response = '') {
//   if (
//     response !== undefined &&
//     response !== undefined &&
//     response.status !== undefined
//   ) {
//     if (
//       response.status === 200 &&
//       (response.data.status === 0 || response.data.status === 3)
//     ) {
//       toast.error(response.data.message, { toastId: response.data.message });
//     }
//     if (response.status === 500) {
//       toast.error('Server error! Please try again later.', {
//         toastId: 'Server error! Please try again later.'
//       });
//     }
//     if (response.status === 400) {
//       toast.error(response.data.message, { toastId: response.data.message });
//     }
//     if (response.status === 403) {
//       toast.error(response.data.message, { toastId: response.data.message });
//     }
//     if (response.status === 422) {
//       toast.error(response.data.message, { toastId: response.data.message });
//     }
//     if (response.status === 401) {
//       // // logoutAction({ forceLogout: true })
//       toast.error('user force logout', { toastId: 'user force logout' });
//     }
//     if (typeof response.data.message === 'object') {
//       toast.error(response.data.message.join('\n'), {
//         toastId: response.data.message.join('\n')
//       });
//     }
//     if (response.data.message === undefined || response.data.message === '') {
//       toast.error('Something went wrong! Please try again later.', {
//         toastId: 'Something went wrong! Please try again later'
//       });
//     }
//   } else {
//     toast.error('Something went wrong! Please try again later.', {
//       toastId: 'Something went wrong! Please try again later'
//     });
//   }
// }
