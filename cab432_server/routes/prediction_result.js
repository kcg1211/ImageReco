const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authorize = require('../authorize');

router.post('/', authorize, (req, res) => { // passing username data thru authroize middleware
  const { imageUrl, predictions } = req.body;

  // Validate the incoming data
  if (!imageUrl || !predictions) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  // Create a directory to store predictions if it doesn't exist
  const userDir = path.join(__dirname, '..', 'predictions', req.username);
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }

  // Define the path and filename for saving predictions
  const fileName = path.basename(imageUrl) + '.json';
  const filePath = path.join(userDir, fileName);

  // Save the predictions as a JSON file
  fs.writeFile(filePath, JSON.stringify({ imageUrl, predictions }, null, 2), (err) => {
    if (err) {
      console.error('Error saving predictions:', err);
      return res.status(500).json({ error: 'Failed to save predictions' });
    }
    res.json({ message: 'Predictions saved successfully', filePath });
  });
});

module.exports = router;