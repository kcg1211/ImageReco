const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// // Import the upload configuration
// const upload = require('../multer.js');
const storage = multer.diskStorage({
    destination: './uploads/',  // Folder where images will be stored
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize upload
  const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit size to 10MB
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    }
  }).single('image'); // 'image' is the field name from the form data
  
  // Check file type
  function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
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
router.post('/', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: 'No file selected' });
      } else {
        res.json({
          message: 'File uploaded successfully',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});

router.get('/testing', function(req, res, next) {
    res.send('testing');
  });

module.exports = router;