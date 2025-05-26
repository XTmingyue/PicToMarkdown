# PicToMarkdown

一个将数学公式图片转换为Markdown格式的React应用。

## 功能特点

- 支持图片上传
- 使用Google Gemini API识别数学公式
- 实时预览Markdown渲染效果
- 支持复制Markdown代码

## 版本历史

### v1.0.0 (2024-03-xx)
- 初始版本发布
- 实现基础图片上传功能
- 集成Google Gemini API进行公式识别
- 添加Markdown预览功能

### v1.0.1 (2024-03-xx)
- 更新Gemini API模型从`gemini-pro-vision`到`gemini-1.5-flash`
- 优化API调用参数配置
- 修复公式渲染问题

### v1.0.2 (2024-03-xx)
- 修复Markdown预览中公式渲染问题
- 优化错误处理和日志输出
- 改进用户界面样式

### v1.0.3 (2024-03-xx)
- 添加项目部署配置
- 支持Vercel、Netlify和传统服务器部署
- 完善部署文档

## 安装说明

1. 克隆仓库
```bash
git clone https://github.com/yourusername/PicToMarkdown.git
```

2. 安装依赖
```bash
cd PicToMarkdown
npm install
```

3. 配置环境变量
创建`.env`文件并添加你的Gemini API密钥： 
```

## 部署说明

### 使用Vercel部署（推荐）

1. 安装Vercel CLI
```bash
npm install -g vercel
```

2. 登录Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel
```

4. 配置环境变量
在Vercel项目设置中添加环境变量：
- `REACT_APP_GEMINI_API_KEY`: 你的Gemini API密钥

### 使用Netlify部署

1. 安装Netlify CLI
```bash
npm install -g netlify-cli
```

2. 登录Netlify
```bash
netlify login
```

3. 部署项目
```bash
netlify deploy
```

4. 配置环境变量
在Netlify项目设置中添加环境变量：
- `REACT_APP_GEMINI_API_KEY`: 你的Gemini API密钥

### 使用传统服务器部署

1. 构建项目
```bash
npm run build
```

2. 将`build`目录下的所有文件上传到服务器的网站根目录

3. 配置Nginx（示例配置）：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. 配置环境变量
在服务器上设置环境变量或在`.env.production`文件中配置：