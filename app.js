const express = require('express');
const multer = require('multer');
const serveIndex = require('serve-index');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;
const HOST = '0.0.0.0'; // 确保可以通过局域网访问
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 创建文件夹用于存储上传的文件
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 设置静态文件和文件浏览
app.use('/files', express.static(UPLOAD_DIR));
app.use('/files', serveIndex(UPLOAD_DIR, { icons: true }));
app.use(express.static('public'));

// 配置 multer 用于文件上传
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// 上传文件接口
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ message: 'File uploaded successfully!', file: req.file });
});

// 主页面：上传表单

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html'); // 直接返回 HTML 文件
});

// 启动服务器
app.listen(PORT, HOST, () => {
    console.log(`LAN 网盘运行中: http://${HOST}:${PORT}`);
});
