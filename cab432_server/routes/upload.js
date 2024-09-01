const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authorize = require('../authorize');
const fs = require('fs');

// Configuration of Multer middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userDir = path.join(__dirname, '..', 'uploads', req.username); // creating directory with the name of user
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        cb(null, userDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
// Initialize upload
const upload = multer({
storage: storage,
// limits: { fileSize: 10 * 1024 * 1024 }, // Limit size to 10MB
fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
}
}).single('image'); // 'image' is the field name from the form data

// Check file type
function checkFileType(file, cb) {
// Allowed ext
const filetypes = /jpeg|jpg|png|gif|tif|bmp|raf/;
// Check ext
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
// Check mime
const mimetype = filetypes.test(file.mimetype);

if (mimetype && extname) {
    return cb(null, true);
} else {
    cb('Error: Images Only!');
}
}

// Upload route
router.post('/', authorize, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } 
    if (!req.file) {
        return res.status(400).json({ error: 'No file selected' });
    }
  
    const imageUrl = `/uploads/${req.username}/${req.file.filename}`;
    res.json({
        message: 'File uploaded successfully',
        file: imageUrl
    });
  });
});

router.get('/testing', function(req, res, next) {
    res.send('testing');
  });

module.exports = router;