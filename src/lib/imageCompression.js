/**
 * Compresses an image file using Canvas.
 * @param {File} file - The image file to compress.
 * @param {Object} options - Compression options.
 * @param {number} options.maxSizeMB - Maximum file size in MB.
 * @param {number} options.maxWidthOrHeight - Maximum width or height in pixels.
 * @returns {Promise<File|Blob>} - The compressed image file.
 */
export const compressImage = async (file, { maxSizeMB = 1, maxWidthOrHeight = 1280 } = {}) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidthOrHeight) {
            height *= maxWidthOrHeight / width;
            width = maxWidthOrHeight;
          }
        } else {
          if (height > maxWidthOrHeight) {
            width *= maxWidthOrHeight / height;
            height = maxWidthOrHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Quality starts at 0.8 and decreases if size is still too large
        let quality = 0.8;
        
        const convertToBlob = (q) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Canvas toBlob failed'));
                return;
              }
              
              if (blob.size / 1024 / 1024 > maxSizeMB && q > 0.1) {
                // If still too large, try with lower quality
                convertToBlob(q - 0.1);
              } else {
                // Return as a File object to maintain compatibility with existing upload logic
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            q
          );
        };

        convertToBlob(quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
