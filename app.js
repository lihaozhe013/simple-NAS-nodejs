const express = require('express');
const multer = require('multer');
const serveIndex = require('serve-index');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
const PORT = 8000;
const HOST = '0.0.0.0';
const UPLOAD_DIR = path.join(__dirname, 'uploads');
const NEW_UPLOAD_DIR = path.join(__dirname, 'uploads/new_upload_things');
const PUBLIC_DIR = path.join(__dirname, 'public');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        const interface = interfaces[interfaceName];
        for (const iface of interface) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
}

const LOCAL_IP = getLocalIP();

// create folder 'upload' if dne
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// setup static files
app.use('/files', express.static(UPLOAD_DIR));
app.use('/files', serveIndex(UPLOAD_DIR, { icons: true }));
app.use(express.static(PUBLIC_DIR));

// set up multer for file uploading
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, NEW_UPLOAD_DIR),
    filename: function (req, file, cb) { // 确保文件名正确保存为中文 (Chinese Character Support)
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
});
const upload = multer({ storage });

// file uploading port
app.post('/upload', upload.single('file'), (req, res) => {
    res.send({ message: 'File uploaded successfully!', file: req.file });
});

// Main Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// start
app.listen(PORT, HOST, () => {
    console.log(`NAS Started: http://${LOCAL_IP}:${PORT}`);
});
