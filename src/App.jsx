import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
  };

  const handleProcessImage = () => {
    if (image) {
      setLoading(true);
      Tesseract.recognize(
        image,
        'eng',
        {
          logger: (m) => console.log(m),
        }
      ).then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      }).catch((error) => {
        console.error('Error:', error);
        setText('Failed to extract text. Please try again.');
        setLoading(false);
      });
    } else {
      alert('Please upload an image first.');
    }
  };

  return (
    <div className="App">
      <h1>Handwriting to Text</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && (
        <div>
          <img src={image} alt="Uploaded Preview" style={{ maxWidth: '500px', marginTop: '20px' }} />
          <button onClick={handleProcessImage} disabled={loading} style={{ display: 'block', marginTop: '20px' }}>
            {loading ? 'Processing...' : 'Process Image'}
          </button>
        </div>
      )}
      <h2>Extracted Text:</h2>
      <pre>{text}</pre>
    </div>
  );
};

export default App;
