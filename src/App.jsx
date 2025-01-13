import React, { useState } from 'react';
    import { createWorker } from 'tesseract.js';

    function App() {
      const [image, setImage] = useState(null);
      const [text, setText] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);

      const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setText('');
        setError('');
      };

      const convertImageToText = async () => {
        if (!image) {
          setError('Please select an image.');
          return;
        }

        setLoading(true);
        setError('');

        try {
          const worker = await createWorker();
          await worker.loadLanguage('eng');
          await worker.initialize('eng');
          const { data: { text } } = await worker.recognize(image);
          setText(text);
          await worker.terminate();
        } catch (err) {
          setError('Error during OCR processing. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="container">
          <h1>Image to Text Converter</h1>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <button onClick={convertImageToText} disabled={loading}>
            {loading ? 'Converting...' : 'Convert to Text'}
          </button>
          {error && <div className="error">{error}</div>}
          <textarea value={text} readOnly placeholder="Converted text will appear here" />
        </div>
      );
    }

    export default App;
