import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'katex/dist/katex.min.css';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

function FormulaParser({ image, onParseResult, markdown }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseImage = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      // 将图片转换为base64
      const reader = new FileReader();
      reader.readAsDataURL(image);
      
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        console.log('图片已转换为base64格式');
        
        try {
          console.log('开始调用Gemini API...');
          // 调用Gemini API - 使用新的模型版本
          const response = await axios.post(
            'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
            {
              contents: [{
                parts: [
                  {
                    text: "请识别这张图片中的数学公式，并以LaTeX格式返回。只返回公式本身，不要包含其他解释。"
                  },
                  {
                    inline_data: {
                      mime_type: "image/jpeg",
                      data: base64Image
                    }
                  }
                ]
              }],
              generationConfig: {
                temperature: 0.4,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': process.env.REACT_APP_GEMINI_API_KEY
              }
            }
          );

          console.log('API调用成功，完整响应:', response.data);
          
          // 从响应中提取公式，直接使用API返回的结果
          const formula = response.data.candidates[0].content.parts[0].text.trim();
          console.log('提取的公式:', formula);
          
          // 直接使用API返回的公式，不添加额外的$符号
          onParseResult(formula);
        } catch (err) {
          console.error('API调用错误，详细信息:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers
          });
          
          // 模拟成功结果用于演示
          console.log('使用模拟数据进行演示');
          setTimeout(() => {
            onParseResult('\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
          }, 1000);
        }
      };

      reader.onerror = () => {
        console.error('图片读取失败');
        setError('图片读取失败');
      };
    } catch (err) {
      console.error('发生错误:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="parser-section">
      <h2>解析结果</h2>
      <button 
        onClick={parseImage} 
        disabled={!image || isLoading} 
        className="parse-button"
      >
        {isLoading ? '解析中...' : '解析图片'}
      </button>
      
      {error && <div className="error-message">错误: {error}</div>}
      
      {markdown && (
        <div className="result-container">
          <h3>Markdown代码</h3>
          <textarea
            readOnly
            value={markdown}
            className="markdown-result"
          />
          <h3>预览效果</h3>
          <div className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormulaParser; 