import React, { useRef } from 'react';

function ImageUploader({ onImageUpload, image }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="uploader-section">
      <h2>上传图片</h2>
      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <button onClick={handleButtonClick} className="upload-button">
          选择图片
        </button>
      </div>
      {image && (
        <div className="preview-container">
          <h3>预览</h3>
          <img
            src={URL.createObjectURL(image)}
            alt="预览"
            className="preview-image"
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader; 