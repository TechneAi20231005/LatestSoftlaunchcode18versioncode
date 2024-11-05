import { toast } from 'react-toastify';
import moment from 'moment';

export const downloadSvgAsPng = (
  svgData,
  fileName = 'QR_Code',
  goBack = false
) => {
  const currentDate = moment().format('MM-DD-YYYY');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const svgSize = 800;
  canvas.width = svgSize;
  canvas.height = svgSize;

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);

  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const pngUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${fileName}-${currentDate}.png`;

    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('QR Code downloaded successfully');
    if (goBack) {
      setTimeout(() => {
        window.history.back();
      }, 1500);
    }
  };

  img.onerror = (error) => {
    console.error('Error loading image', error);
    toast.error('Failed to download QR Code');
  };

  img.src = url;
};
