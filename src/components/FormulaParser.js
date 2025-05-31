import React, { useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import katex from 'katex';

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
          // 检查API密钥是否存在
          if (!process.env.REACT_APP_GEMINI_API_KEY) {
            throw new Error('API密钥未配置');
          }
          
          // 打印当前环境信息
          console.log('当前环境信息:', {
            nodeEnv: process.env.NODE_ENV,
            apiKey: process.env.REACT_APP_GEMINI_API_KEY ? '已配置' : '未配置',
            modelVersion: 'gemini-2.0-flash'
          });
          
          // 调用Gemini API
          const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';
          console.log('API调用URL:', apiUrl);
          
          const response = await axios.post(
            apiUrl,
            {
              contents: [{
                parts: [
                  {
                    text: `识别这张图片中的数学公式，并以标准的LaTeX格式返回。注意只需要返回解析的公式，不要包含任何其他文字`
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
                temperature: 0.1,
                topK: 1,
                topP: 0.1,
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
          
          // 从响应中提取公式并清理
          let formula = response.data.candidates[0].content.parts[0].text.trim();
          
          // 清理可能的额外字符
          formula = formula
            .replace(/^`+|`+$/g, '')   // 先移除首尾的反引号
            .replace(/^latex/i, '')    // 再移除开头的latex字符串（不区分大小写）
            .replace(/^\$+|\$+$/g, '') // 移除首尾的所有$符号
            .trim();

          // 确保公式前后只有两个$符号
          formula = `$$${formula}$$`;
            
          console.log('清理后的公式:', formula);
          
          onParseResult(formula);
        } catch (err) {
          console.error('API调用错误，详细信息:', {
            message: err.message,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers,
            env: {
              hasApiKey: !!process.env.REACT_APP_GEMINI_API_KEY,
              nodeEnv: process.env.NODE_ENV
            }
          });
          
          setError(`API调用失败: ${err.message}`);
          
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
          <div 
            className="markdown-preview"
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(markdown.replace(/^\$\$|\$\$$/g, ''), {
                displayMode: true,
                throwOnError: false
              })
            }}
          />
        </div>
      )}
    </div>
  );
}

export default FormulaParser; 