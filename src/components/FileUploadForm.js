import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function FileUploadForm({ callBack }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      if (callBack) callBack();
      console.log(data.message);
    } else {
      console.error(data.error);
    }
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert('File is too large. Max size is 5MB.');
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('File type is not allowed. Only JPEG, PNG, and GIF are allowed.');
      return;
    }

    setFile(file);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-8 rounded shadow-lg max-w-md mx-auto my-10" encType="multipart/form-data">
      <input 
        type="text"
        className="block w-full px-4 py-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <textarea
        value={description}
        className="block w-full px-4 py-2 border rounded"
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
      />

      <input 
        type="file" 
        className="block w-full px-4 py-2 border rounded"
        onChange={(e) => handleFileChange(e.target.files[0])}
        required
      />

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors">Upload File</button>
    </form>
  );
}

FileUploadForm.propTypes = {
  callBack: PropTypes.func,
};

export default FileUploadForm;
