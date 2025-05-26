import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import FormulaParser from './components/FormulaParser';

function App() {
  const [image, setImage] = useState(null);
  const [markdown, setMarkdown] = useState('');

  const handleImageUpload = (file) => {
    setImage(file);
    setMarkdown(''); // 清除之前的解析结果
  };

  const handleParseResult = (result) => {
    setMarkdown(result);
  };

  return (
    <div className="app">
      <h1>数学公式图片转Markdown</h1>
      <div className="container">
        <ImageUploader onImageUpload={handleImageUpload} image={image} />
        <FormulaParser image={image} onParseResult={handleParseResult} markdown={markdown} />
      </div>
    </div>
  );
}

export default App; 